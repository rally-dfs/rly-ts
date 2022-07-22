import { Token } from "@solana/spl-token";
import { TokenData } from "../types";
import { web3, Wallet } from "@project-serum/anchor";
import { config } from "../../config";
import { addTxPayerAndHash, sendTx } from "../utils";

import {
  DataV2,
  UpdateMetadataAccountV2InstructionAccounts,
  UpdateMetadataAccountArgsV2,
  UpdateMetadataAccountV2InstructionArgs,
  createUpdateMetadataAccountV2Instruction,
  PROGRAM_ADDRESS,
} from "@metaplex-foundation/mpl-token-metadata";
const { Transaction, PublicKey } = web3;

interface updateMetadataTxParams {
  tokenMint: Token;
  tokenData: TokenData;
  connection: web3.Connection;
  walletPubKey: web3.PublicKey;
}

interface updateMetadataParams {
  tokenMint: Token;
  tokenData: TokenData;
  connection: web3.Connection;
  wallet: Wallet;
}

export const updateMetadataTx = async (
  {
    tokenMint,
    tokenData,
    connection,
    walletPubKey,
  } = {} as updateMetadataTxParams
): Promise<web3.Transaction> => {
  const transaction = new Transaction();

  const metadataProgramAddress = new PublicKey(PROGRAM_ADDRESS);

  const [metadata] = await PublicKey.findProgramAddress(
    [
      config.pda.METADATA,
      metadataProgramAddress.toBuffer(),
      tokenMint.publicKey.toBuffer(),
    ],
    metadataProgramAddress
  );

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
    updateAuthority: walletPubKey,
  } as UpdateMetadataAccountV2InstructionAccounts;

  const updateMetadataAccountArgsV2 = {
    data,
    updateAuthority: walletPubKey,
    primarySaleHappened: false,
    isMutable: true,
  } as UpdateMetadataAccountArgsV2;

  const args = {
    updateMetadataAccountArgsV2,
  } as UpdateMetadataAccountV2InstructionArgs;

  const updateMetadataIx = createUpdateMetadataAccountV2Instruction(
    accounts,
    args
  );

  transaction.add(updateMetadataIx);
  await addTxPayerAndHash(transaction, connection, walletPubKey);
  return transaction;
};

export const updateMetadata = async (
  { tokenMint, tokenData, connection, wallet } = {} as updateMetadataParams
): Promise<web3.TransactionSignature> => {
  const transaction = await updateMetadataTx({
    tokenMint,
    tokenData,
    connection,
    walletPubKey: wallet.publicKey,
  });

  return sendTx(wallet, connection, transaction, { commitment: "finalized" });
};
