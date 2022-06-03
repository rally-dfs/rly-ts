import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Program, web3, Provider } from "@project-serum/anchor";
import { config } from "../../../config";
import { Wallet } from "@metaplex/js";
import { sendTx, partialSignTx, addTxPayerAndHash } from "../../utils";
const {
  pda: { WRAPPED_TOKEN_OWNER_AUTHORITY_PDA_SEED, TOKEN_ACCOUNT_PDA_SEED },
  accountLayout: { WRAPPED_DATA_SPACE },
} = config;
const {
  PublicKey,
  SystemProgram: { programId },
  Transaction,
} = web3;

interface initializeWrappedTokenTxParams {
  canSwap: Program;
  wrappedMint: web3.PublicKey;
  wrappedData: any;
  canonicalMint: web3.PublicKey;
  canonicalData: web3.PublicKey;
  canonicalAuthority: any;
  walletPubKey: web3.PublicKey;
  connection: web3.Connection;
}

interface initializeWrappedTokenParams {
  canSwap: Program;
  wrappedMint: web3.PublicKey;
  wrappedData: any;
  canonicalMint: web3.PublicKey;
  canonicalData: web3.PublicKey;
  canonicalAuthority: any;
  connection: any;
  wallet: Wallet;
}

export const initializeWrappedTokenTx = async (
  {
    canSwap,
    wrappedMint,
    wrappedData,
    canonicalMint,
    canonicalData,
    canonicalAuthority,
    walletPubKey,
    connection,
  } = {} as initializeWrappedTokenTxParams
): Promise<web3.Transaction> => {
  const transaction = new Transaction();

  const [wrappedTokenAccount] = await PublicKey.findProgramAddress(
    [TOKEN_ACCOUNT_PDA_SEED, canonicalMint.toBuffer(), wrappedMint.toBuffer()],
    canSwap.programId
  );

  const [wrappedTokenAccountAuthority] = await PublicKey.findProgramAddress(
    [
      WRAPPED_TOKEN_OWNER_AUTHORITY_PDA_SEED,
      canonicalMint.toBuffer(),
      wrappedMint.toBuffer(),
    ],
    canSwap.programId
  );

  const wrappedDataIx = await canSwap.account.wrappedData.createInstruction(
    wrappedData,
    WRAPPED_DATA_SPACE
  );

  const initIx = await canSwap.instruction.initializeWrappedToken({
    accounts: {
      currentAuthority: canonicalAuthority.publicKey,
      wrappedTokenMint: wrappedMint,
      pdaWrappedTokenAccount: wrappedTokenAccount,
      pdaWrappedTokenAccountAuthority: wrappedTokenAccountAuthority,
      canonicalData: canonicalData,
      wrappedData: wrappedData.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
      rent: web3.SYSVAR_RENT_PUBKEY,
      systemProgram: programId,
    },
  });

  transaction.add(wrappedDataIx, initIx);
  await addTxPayerAndHash(transaction, connection, walletPubKey);

  await partialSignTx(transaction, [wrappedData]);
  return transaction;
};

export const initializeWrappedToken = async (
  {
    canSwap,
    wrappedMint,
    wrappedData,
    canonicalMint,
    canonicalData,
    canonicalAuthority,
    connection,
    wallet,
  } = {} as initializeWrappedTokenParams
): Promise<web3.TransactionSignature> => {
  const transaction = await initializeWrappedTokenTx({
    canSwap,
    wrappedMint,
    wrappedData,
    canonicalMint,
    canonicalData,
    canonicalAuthority,
    walletPubKey: wallet.publicKey,
    connection,
  });

  return sendTx(wallet, connection, transaction, { commitment: "finalized" });
};
