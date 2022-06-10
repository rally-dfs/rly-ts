import { Token } from "@solana/spl-token";
import {
  MetadataDataData,
  Metadata,
  CreateMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { TokenData } from "../types";
import { web3, Wallet } from "@project-serum/anchor";
import { addTxPayerAndHash, sendTx } from "../utils";
const { Transaction } = web3;

interface addMetadataTxParams {
  tokenMint: Token;
  tokenData: TokenData;
  connection: web3.Connection;
  walletPubKey: web3.PublicKey;
}

interface addMetadataParams {
  tokenMint: Token;
  tokenData: TokenData;
  connection: web3.Connection;
  wallet: Wallet;
}

export const addMetadataTx = async (
  { tokenMint, tokenData, connection, walletPubKey } = {} as addMetadataTxParams
): Promise<web3.Transaction> => {
  const transaction = new Transaction();

  const metadataData = new MetadataDataData({
    name: tokenData.name,
    symbol: tokenData.symbol,
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

  transaction.add(createMetadataTx);
  await addTxPayerAndHash(transaction, connection, walletPubKey);
  return transaction;
};

export const addMetadata = async (
  { tokenMint, tokenData, connection, wallet } = {} as addMetadataParams
): Promise<web3.TransactionSignature> => {
  const transaction = await addMetadataTx({
    tokenMint,
    tokenData,
    connection,
    walletPubKey: wallet.publicKey,
  });

  return sendTx(wallet, connection, transaction, { commitment: "finalized" });
};
