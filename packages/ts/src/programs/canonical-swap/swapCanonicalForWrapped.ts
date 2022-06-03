import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Program, web3, BN, Provider } from "@project-serum/anchor";
import { config } from "../../../config";
import { Wallet } from "@metaplex/js";
import { addTxPayerAndHash, sendTx } from "../../utils";
const {
  pda: { WRAPPED_TOKEN_OWNER_AUTHORITY_PDA_SEED, TOKEN_ACCOUNT_PDA_SEED },
} = config;
const { PublicKey, Transaction } = web3;

interface swapCanonicalForWrappedTxParams {
  canSwap: Program;
  canonicalMint: web3.PublicKey;
  wrappedMint: web3.PublicKey;
  canonicalData: web3.PublicKey;
  wrappedData: web3.PublicKey;
  sourceTokenAccount: web3.PublicKey;
  destinationTokenAccount: web3.PublicKey;
  destinationAmount: BN;
  walletPubKey: web3.PublicKey;
  connection: web3.Connection;
}

interface swapCanonicalForWrappedParams {
  canSwap: Program;
  canonicalMint: web3.PublicKey;
  wrappedMint: web3.PublicKey;
  canonicalData: web3.PublicKey;
  wrappedData: web3.PublicKey;
  sourceTokenAccount: web3.PublicKey;
  destinationTokenAccount: web3.PublicKey;
  destinationAmount: BN;
  wallet: Wallet;
  connection: web3.Connection;
}

export const swapCanonicalForWrappedTx = async (
  {
    canSwap,
    canonicalMint,
    wrappedMint,
    canonicalData,
    wrappedData,
    sourceTokenAccount,
    destinationTokenAccount,
    destinationAmount,
    walletPubKey,
    connection,
  } = {} as swapCanonicalForWrappedTxParams
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

  const ix = canSwap.instruction.swapCanonicalForWrapped(destinationAmount, {
    accounts: {
      user: walletPubKey,
      sourceCanonicalTokenAccount: sourceTokenAccount,
      canonicalMint: canonicalMint,
      destinationWrappedTokenAccount: destinationTokenAccount,
      wrappedTokenAccount,
      pdaWrappedTokenAuthority: wrappedTokenAccountAuthority,
      canonicalData: canonicalData,
      wrappedData: wrappedData,
      tokenProgram: TOKEN_PROGRAM_ID,
    },
  });

  transaction.add(ix);
  await addTxPayerAndHash(transaction, connection, walletPubKey);
  return transaction;
};

export const swapCanonicalForWrapped = async (
  {
    canSwap,
    canonicalMint,
    wrappedMint,
    canonicalData,
    wrappedData,
    sourceTokenAccount,
    destinationTokenAccount,
    destinationAmount,
    wallet,
    connection,
  } = {} as swapCanonicalForWrappedParams
): Promise<web3.TransactionSignature> => {
  const transaction = await swapCanonicalForWrappedTx({
    canSwap,
    canonicalMint,
    wrappedMint,
    canonicalData,
    wrappedData,
    sourceTokenAccount,
    destinationTokenAccount,
    destinationAmount,
    walletPubKey: wallet.publicKey,
    connection,
  });
  return sendTx(wallet, connection, transaction, { commitment: "finalized" });
};
