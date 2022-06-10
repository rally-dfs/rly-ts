import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Program, web3, Wallet } from "@project-serum/anchor";
import { config } from "../../../config";
import { sendTx, partialSignTx, addTxPayerAndHash } from "../../utils";
const {
  pda: { CANONICAL_MINT_AUTHORITY_PDA_SEED },
  accountLayout: { CANONICAL_DATA_SPACE },
} = config;
const {
  PublicKey,
  SystemProgram: { programId },
  Transaction,
} = web3;

interface intitializeCanonicalTokenTxParams {
  canSwap: Program;
  canonicalMint: web3.PublicKey;
  canonicalData: any;
  canonicalAuthority: web3.PublicKey;
  walletPubKey: web3.PublicKey;
  connection: web3.Connection;
}

interface intitializeCanonicalTokenParams {
  canSwap: Program;
  canonicalMint: web3.PublicKey;
  canonicalData: any;
  canonicalAuthority: web3.PublicKey;
  connection: any;
  wallet: Wallet;
}

export const initializeCanonicalTxToken = async (
  {
    canSwap,
    canonicalMint,
    canonicalData,
    canonicalAuthority,
    walletPubKey,
    connection,
  } = {} as intitializeCanonicalTokenTxParams
): Promise<web3.Transaction> => {
  const transaction = new Transaction();

  const [expectedMintAuthorityPDA] = await PublicKey.findProgramAddress(
    [CANONICAL_MINT_AUTHORITY_PDA_SEED, canonicalMint.toBuffer()],
    canSwap.programId
  );

  const canDataiX = await canSwap.account.canonicalData.createInstruction(
    canonicalData,
    CANONICAL_DATA_SPACE
  );

  const initIx = canSwap.instruction.initializeCanonicalToken({
    accounts: {
      initializer: canonicalAuthority,
      canonicalMint: canonicalMint,
      pdaCanonicalMintAuthority: expectedMintAuthorityPDA,
      canonicalData: canonicalData.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: programId,
    },
  });

  transaction.add(canDataiX, initIx);
  await addTxPayerAndHash(transaction, connection, walletPubKey);
  await partialSignTx(transaction, [canonicalData]);
  return transaction;
};

export const initializeCanonicalToken = async (
  {
    canSwap,
    canonicalMint,
    canonicalData,
    canonicalAuthority,
    connection,
    wallet,
  } = {} as intitializeCanonicalTokenParams
): Promise<web3.TransactionSignature> => {
  const transaction = await initializeCanonicalTxToken({
    canSwap,
    canonicalMint,
    canonicalData,
    canonicalAuthority,
    walletPubKey: wallet.publicKey,
    connection,
  });
  return sendTx(wallet, connection, transaction, { commitment: "finalized" });
};
