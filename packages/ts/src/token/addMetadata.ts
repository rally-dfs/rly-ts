import { Token } from "@solana/spl-token";
import {
  DataV2,
  CreateMetadataAccountV2InstructionAccounts,
  CreateMetadataAccountArgsV2,
  CreateMetadataAccountV2InstructionArgs,
  createCreateMetadataAccountV2Instruction,
  PROGRAM_ADDRESS,
  Data,
} from "@metaplex-foundation/mpl-token-metadata";
import { TokenData } from "../types";
import { config } from "../../config";
import { web3, Wallet } from "@project-serum/anchor";
import { addTxPayerAndHash, sendTx } from "../utils";
const { Transaction, PublicKey } = web3;

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
    uri: "",
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

  transaction.add(createMetadataIx);
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
