import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Program, web3, BN, Provider } from "@project-serum/anchor";
import { Wallet, NodeWallet } from "@metaplex/js";
import { partialSignTx, sendTx, addTxPayerAndHash } from "../../utils";
const {
  PublicKey,
  SystemProgram: { programId },
  Transaction,
} = web3;

interface executeSwapTxParams {
  tokenSwap: Program;
  tokenSwapInfo: web3.PublicKey;
  amountIn: BN;
  amountOut: BN;
  userTransferAuthority: web3.PublicKey;
  userSourceTokenAccount: web3.PublicKey;
  userDestinationTokenAccount: web3.PublicKey;
  swapSourceTokenAccount: web3.PublicKey;
  swapDestinationTokenAccount: web3.PublicKey;
  poolMintAccount: web3.PublicKey;
  poolFeeAccount: web3.PublicKey;
  walletPubKey: web3.PublicKey;
  connection: web3.Connection;
}

interface executeSwapParams {
  tokenSwap: Program;
  tokenSwapInfo: web3.PublicKey;
  amountIn: BN;
  amountOut: BN;
  userTransferAuthority: web3.PublicKey;
  userSourceTokenAccount: web3.PublicKey;
  userDestinationTokenAccount: web3.PublicKey;
  swapSourceTokenAccount: web3.PublicKey;
  swapDestinationTokenAccount: web3.PublicKey;
  poolMintAccount: web3.PublicKey;
  poolFeeAccount: web3.PublicKey;
  wallet: Wallet;
  connection: web3.Connection;
}

interface executeSwapOpts {
  // if the authority over the userSourceTokenAccount and userDestinationAccount is not the caller wallet use this options
  // do not use if calling from web
  userTransferAuthorityOwner?: NodeWallet;
}

export const executeSwapTx = async (
  {
    tokenSwap,
    tokenSwapInfo,
    amountIn,
    amountOut,
    userTransferAuthority,
    userSourceTokenAccount,
    userDestinationTokenAccount,
    swapSourceTokenAccount,
    swapDestinationTokenAccount,
    poolMintAccount,
    poolFeeAccount,
    walletPubKey,
    connection,
  } = {} as executeSwapTxParams,
  { userTransferAuthorityOwner } = {} as executeSwapOpts
): Promise<web3.Transaction> => {
  const transaction = new Transaction();
  // get exepcted swap authority PDA

  const [expectedSwapAuthorityPDA] = await PublicKey.findProgramAddress(
    [tokenSwapInfo.toBuffer()],
    tokenSwap.programId
  );

  const ix = tokenSwap.instruction.swap(amountIn, amountOut, {
    accounts: {
      tokenSwap: tokenSwapInfo,
      swapAuthority: expectedSwapAuthorityPDA,
      userTransferAuthority,
      source: userSourceTokenAccount,
      destination: userDestinationTokenAccount,
      swapSource: swapSourceTokenAccount,
      swapDestination: swapDestinationTokenAccount,
      poolMint: poolMintAccount,
      poolFee: poolFeeAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
    },
  });

  transaction.add(ix);

  await addTxPayerAndHash(transaction, connection, walletPubKey);

  userTransferAuthorityOwner &&
    (await partialSignTx(transaction, [userTransferAuthorityOwner.payer]));
  return transaction;
};

export const executeSwap = async (
  {
    tokenSwap,
    tokenSwapInfo,
    amountIn,
    amountOut,
    userTransferAuthority,
    userSourceTokenAccount,
    userDestinationTokenAccount,
    swapSourceTokenAccount,
    swapDestinationTokenAccount,
    poolMintAccount,
    poolFeeAccount,
    wallet,
    connection,
  } = {} as executeSwapParams,
  { userTransferAuthorityOwner } = {} as executeSwapOpts
): Promise<web3.TransactionSignature> => {
  const transaction = await executeSwapTx(
    {
      tokenSwap,
      tokenSwapInfo,
      amountIn,
      amountOut,
      userTransferAuthority,
      userSourceTokenAccount,
      userDestinationTokenAccount,
      swapSourceTokenAccount,
      swapDestinationTokenAccount,
      poolMintAccount,
      poolFeeAccount,
      walletPubKey: wallet.publicKey,
      connection,
    },
    { userTransferAuthorityOwner }
  );
  return sendTx(wallet, connection, transaction, {
    commitment: "finalized",
  });
};
