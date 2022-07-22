import {
  Token,
  TOKEN_PROGRAM_ID,
  u64,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  PROGRAM_ADDRESS,
  DataV2,
  CreateMetadataAccountV2InstructionAccounts,
  CreateMetadataAccountArgsV2,
  CreateMetadataAccountV2InstructionArgs,
  createCreateMetadataAccountV2Instruction,
} from "@metaplex-foundation/mpl-token-metadata";

import { config } from "../../config";
import { TokenData } from "../types";
import { BN, web3, Wallet } from "@project-serum/anchor";
import { generateTokenMintInstructions, sendTx } from "../utils";
import { partialSignTx, addTxPayerAndHash } from "../utils";
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
    u64.fromBuffer(initialSupply.toArrayLike(Buffer, "le", 8))
  );

  // get metadata PDA

  const metadataProgramAddress = new web3.PublicKey(PROGRAM_ADDRESS);

  const [metadata] = await web3.PublicKey.findProgramAddress(
    [
      config.pda.METADATA,
      metadataProgramAddress.toBuffer(),
      tokenMint.publicKey.toBuffer(),
    ],
    metadataProgramAddress
  );

  // create metadata Tx

  const data = {
    name: tokenData.name,
    symbol: tokenData.symbol,
    uri: tokenData.uri,
    sellerFeeBasisPoints: null,
    creators: null,
    collection: null,
    uses: null,
  } as DataV2;

  const accounts = {
    metadata,
    mint: tokenMint.publicKey,
    mintAuthority: walletPubKey,
    updateAuthority: walletPubKey,
    payer: walletPubKey,
  } as CreateMetadataAccountV2InstructionAccounts;

  const createMetadataAccountArgsV2 = {
    data,
    isMutable: true,
  } as CreateMetadataAccountArgsV2;

  const args = {
    createMetadataAccountArgsV2,
  } as CreateMetadataAccountV2InstructionArgs;

  const createMetadataIx = createCreateMetadataAccountV2Instruction(
    accounts,
    args
  );

  // return tx hash, token mint, token account

  transaction.add(...tokenIx, associatedAcctIx, mintToIx, createMetadataIx);
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

  const tx = await sendTx(wallet, connection, transaction, {});

  return { tx, tokenMint: tokenMint, tokenAccount };
};
