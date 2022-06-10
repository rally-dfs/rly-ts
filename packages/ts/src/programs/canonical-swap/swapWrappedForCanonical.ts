import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Program, web3, BN, Wallet } from "@project-serum/anchor";
import { config } from "../../../config";
import { addTxPayerAndHash, sendTx } from "../../utils";
const {
  pda: { CANONICAL_MINT_AUTHORITY_PDA_SEED, TOKEN_ACCOUNT_PDA_SEED },
} = config;
const { Transaction } = web3;

interface swapWrappedForCanonicalTxParams {
  canSwap: Program;
  canonicalMint: web3.PublicKey;
  wrappedMint: web3.PublicKey;
  canonicalData: web3.PublicKey;
  wrappedData: web3.PublicKey;
  sourceTokenAccount: web3.PublicKey;
  destinationTokenAccount: web3.PublicKey;
  destinationAmount: BN;
  walletPubKey: web3.PublicKey;
  connection: any;
}

interface swapWrappedForCanonicalParams {
  canSwap: Program;
  canonicalMint: web3.PublicKey;
  wrappedMint: web3.PublicKey;
  canonicalData: web3.PublicKey;
  wrappedData: web3.PublicKey;
  sourceTokenAccount: web3.PublicKey;
  destinationTokenAccount: web3.PublicKey;
  destinationAmount: BN;
  wallet: Wallet;
  connection: any;
}

export const swapWrappedForCanonicalTx = async (
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
  } = {} as swapWrappedForCanonicalTxParams
): Promise<web3.Transaction> => {
  const transaction = new Transaction();

  const [expectedMintAuthorityPDA] = await web3.PublicKey.findProgramAddress(
    [CANONICAL_MINT_AUTHORITY_PDA_SEED, canonicalMint.toBuffer()],
    canSwap.programId
  );

  const [wrappedTokenAccount] = await web3.PublicKey.findProgramAddress(
    [TOKEN_ACCOUNT_PDA_SEED, canonicalMint.toBuffer(), wrappedMint.toBuffer()],
    canSwap.programId
  );

  const ix = canSwap.instruction.swapWrappedForCanonical(destinationAmount, {
    accounts: {
      user: walletPubKey,
      destinationCanonicalTokenAccount: destinationTokenAccount,
      canonicalMint: canonicalMint,
      pdaCanonicalMintAuthority: expectedMintAuthorityPDA,
      sourceWrappedTokenAccount: sourceTokenAccount,
      wrappedTokenAccount,
      canonicalData: canonicalData,
      wrappedData: wrappedData,
      tokenProgram: TOKEN_PROGRAM_ID,
    },
  });
  transaction.add(ix);
  await addTxPayerAndHash(transaction, connection, walletPubKey);
  return transaction;
};

export const swapWrappedForCanonical = async (
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
  } = {} as swapWrappedForCanonicalParams
): Promise<web3.TransactionSignature> => {
  const transaction = await swapWrappedForCanonicalTx({
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
