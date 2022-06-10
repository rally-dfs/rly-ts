import {
  Token,
  TOKEN_PROGRAM_ID,
  u64,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  MetadataDataData,
  Metadata,
  CreateMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { TokenData } from "../types";
import { BN, web3, Wallet } from "@project-serum/anchor";
import { generateTokenMintInstructions, sendTx } from "../utils";
import { partialSignTx, addTxPayerAndHash } from "../utils";
import { sendToken } from "@metaplex/js/lib/actions";
const { Transaction } = web3;

interface createTokenTxResults {
  transaction: web3.Transaction;
  tokenMint: web3.PublicKey;
  tokenAccount: web3.PublicKey;
}

interface createTokenTxParams {
  initialSupply: BN;
  tokenData: TokenData;
  connection: web3.Connection;
  walletPubKey: web3.PublicKey;
  //if true caller wallet will retain freeze authority over the token
  freezeAuthority: boolean;
}

interface createTokenParams {
  initialSupply: BN;
  tokenData: TokenData;
  connection: web3.Connection;
  wallet: Wallet;
  //if true caller wallet will retain freeze authority over the token
  freezeAuthority: boolean;
}

export const createTokenTx = async (
  {
    initialSupply,
    tokenData,
    connection,
    walletPubKey,
    freezeAuthority,
  } = {} as createTokenTxParams
): Promise<createTokenTxResults> => {
  const transaction = new Transaction();

  // create mint

  const { tokenIx, tokenMint } = await generateTokenMintInstructions(
    connection,
    walletPubKey,
    walletPubKey,
    freezeAuthority ? walletPubKey : null,
    tokenData.decimals
  );

  // create associated account to receive tokens

  const tokenAccount = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    tokenMint.publicKey,
    walletPubKey
  );
  const associatedAcctIx = await Token.createAssociatedTokenAccountInstruction(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    tokenMint.publicKey,
    tokenAccount,
    walletPubKey,
    walletPubKey
  );

  // send initial supply to token account

  const mintToIx = await Token.createMintToInstruction(
    TOKEN_PROGRAM_ID,
    tokenMint.publicKey,
    tokenAccount,
    walletPubKey,
    [],
    new u64(initialSupply.toString())
  );

  // create metadata obj

  const metadataData = new MetadataDataData({
    name: tokenData.name,
    symbol: tokenData.symbol,
    // values below are only used for NFT metadata
    uri: "",
    sellerFeeBasisPoints: null,
    creators: null,
  });

  // get metadata PDA

  const metadata = await Metadata.getPDA(tokenMint.publicKey);

  // create metadata Tx

  const createMetadataTx = new CreateMetadata(
    { feePayer: walletPubKey },
    {
      metadata,
      metadataData,
      updateAuthority: walletPubKey,
      mint: tokenMint.publicKey,
      mintAuthority: walletPubKey,
    }
  );

  // return tx hash, token mint, token account

  transaction.add(...tokenIx, associatedAcctIx, mintToIx, createMetadataTx);
  await addTxPayerAndHash(transaction, connection, walletPubKey);
  await partialSignTx(transaction, [tokenMint]);
  return { transaction, tokenMint: tokenMint.publicKey, tokenAccount };
};

export const createToken = async (
  {
    initialSupply,
    tokenData,
    connection,
    wallet,
    freezeAuthority,
  } = {} as createTokenParams
) => {
  const { transaction, tokenMint, tokenAccount } = await createTokenTx({
    initialSupply,
    tokenData,
    connection,
    walletPubKey: wallet.publicKey,
    freezeAuthority,
  });

  const tx = await sendTx(wallet, connection, transaction, {
    commitment: "finalized",
  });

  return { tx, tokenMint: tokenMint, tokenAccount };
};
