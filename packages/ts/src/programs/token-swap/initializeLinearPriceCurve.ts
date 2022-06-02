import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Program, web3, BN } from "@project-serum/anchor";
import { config } from "../../../config";
import { Wallet, NodeWallet } from "@metaplex/js";
import {
  generateTokenMintInstructions,
  generateCreateTokenAccountInstructions,
  Numberu64,
  sendTx,
} from "../../utils";

const {
  accountLayout: { SWAP_ACCOUNT_SPACE },
} = config;

const { PublicKey, Transaction } = web3;

interface initializeLinearPriceCurveTxParams {
  tokenSwap: Program;
  slopeNumerator: BN;
  slopeDenominator: BN;
  initialTokenAPriceNumerator: BN;
  initialTokenAPriceDenominator: BN;
  callerTokenBAccount: web3.PublicKey;
  tokenSwapInfo: web3.Keypair;
  tokenA: web3.PublicKey;
  tokenB: web3.PublicKey;
  poolTokenDecimals: number;
  walletPubKey: web3.PublicKey;
  connection: any;
  initialTokenBLiquidity: BN;
}

interface initializeLinearPriceCurveParams {
  tokenSwap: Program;
  slopeNumerator: BN;
  slopeDenominator: BN;
  initialTokenAPriceNumerator: BN;
  initialTokenAPriceDenominator: BN;
  callerTokenBAccount: web3.PublicKey;
  tokenSwapInfo: web3.Keypair;
  tokenA: web3.PublicKey;
  tokenB: web3.PublicKey;
  poolTokenDecimals: number;
  wallet: Wallet;
  connection: any;
  initialTokenBLiquidity: BN;
}

interface initializeLinearPriceCurveOpts {
  //if the owner of the caller tokenB account is not the caller wallet account include the tokenB owner wallet here
  //do not use if calling from web or mobile
  callerTokenBAccountOwner?: NodeWallet;
  //if the owner of the fee token account and destination token account is not the caller wallet include the admin owner public key here
  adminAccountOwner?: web3.PublicKey;
}

export const initializeLinearPriceCurveTx = async (
  {
    tokenSwap,
    slopeNumerator,
    slopeDenominator,
    initialTokenAPriceNumerator,
    initialTokenAPriceDenominator,
    callerTokenBAccount,
    tokenSwapInfo,
    tokenA,
    tokenB,
    poolTokenDecimals,
    walletPubKey,
    connection,
    initialTokenBLiquidity,
  } = {} as initializeLinearPriceCurveTxParams,
  {
    callerTokenBAccountOwner,
    adminAccountOwner,
  } = {} as initializeLinearPriceCurveOpts
) => {
  // initialize required transactions

  const setupTransaction = new Transaction();
  const initTbcTransaction = new Transaction();

  // get exepcted swap authority PDA

  const [expectedSwapAuthorityPDA] = await PublicKey.findProgramAddress(
    [tokenSwapInfo.publicKey.toBuffer()],
    tokenSwap.programId
  );

  // get create pooltoken mint ix

  const { tokenIx, tokenMint: poolTokenMint } =
    await generateTokenMintInstructions(
      connection,
      walletPubKey,
      expectedSwapAuthorityPDA,
      null,
      poolTokenDecimals
    );

  // get token accounts creat instrucstions for swap pda

  const {
    tokenAccount: tokenATokenAccount,
    accountIx: createTokenATokenAccountIx,
  } = await generateCreateTokenAccountInstructions(
    connection,
    walletPubKey,
    tokenA,
    expectedSwapAuthorityPDA
  );
  const {
    tokenAccount: tokenBTokenAccount,
    accountIx: createTokenBTokenAccountIx,
  } = await generateCreateTokenAccountInstructions(
    connection,
    walletPubKey,
    tokenB,
    expectedSwapAuthorityPDA
  );

  const tokenBTransferIx = Token.createTransferInstruction(
    TOKEN_PROGRAM_ID,
    callerTokenBAccount,
    tokenBTokenAccount.publicKey,
    callerTokenBAccountOwner
      ? callerTokenBAccountOwner.publicKey
      : walletPubKey,
    [],
    Numberu64.fromBuffer(initialTokenBLiquidity.toArrayLike(Buffer, "le", 8))
  );

  // create token accounts for fees and pool tokens owned by calling account (can't use associated token account as two accounts req'd)

  const { tokenAccount: feeAccount, accountIx: createFeeAccountIx } =
    await generateCreateTokenAccountInstructions(
      connection,
      walletPubKey,
      poolTokenMint.publicKey,
      adminAccountOwner ? adminAccountOwner : walletPubKey
    );
  const {
    tokenAccount: destinationAccount,
    accountIx: createDestinationAccountIx,
  } = await generateCreateTokenAccountInstructions(
    connection,
    walletPubKey,
    poolTokenMint.publicKey,
    adminAccountOwner ? adminAccountOwner : walletPubKey
  );

  const tokenSwapInfoIx = web3.SystemProgram.createAccount({
    fromPubkey: walletPubKey,
    newAccountPubkey: tokenSwapInfo.publicKey,
    space: SWAP_ACCOUNT_SPACE,
    lamports: await connection.getMinimumBalanceForRentExemption(
      SWAP_ACCOUNT_SPACE
    ),
    programId: tokenSwap.programId,
  });

  const initCurveIx = tokenSwap.instruction.initializeLinearPrice(
    slopeNumerator,
    slopeDenominator,
    initialTokenAPriceNumerator,
    initialTokenAPriceDenominator,
    {
      accounts: {
        tokenSwap: tokenSwapInfo.publicKey,
        swapAuthority: expectedSwapAuthorityPDA,
        tokenA: tokenATokenAccount.publicKey,
        tokenB: tokenBTokenAccount.publicKey,
        pool: poolTokenMint.publicKey,
        fee: feeAccount.publicKey,
        destination: destinationAccount.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
    }
  );

  setupTransaction.add(
    ...tokenIx,
    ...createTokenATokenAccountIx,
    ...createTokenBTokenAccountIx,
    tokenBTransferIx
  );

  setupTransaction.feePayer = walletPubKey;
  setupTransaction.recentBlockhash = (
    await connection.getRecentBlockhash()
  ).blockhash;

  initTbcTransaction.add(
    ...createFeeAccountIx,
    ...createDestinationAccountIx,
    tokenSwapInfoIx,
    initCurveIx
  );

  initTbcTransaction.feePayer = walletPubKey;
  initTbcTransaction.recentBlockhash = (
    await connection.getRecentBlockhash()
  ).blockhash;

  // partially sign setup instruction

  // @ts-ignore
  setupTransaction.partialSign(
    poolTokenMint,
    tokenATokenAccount,
    tokenBTokenAccount,
    callerTokenBAccountOwner && callerTokenBAccountOwner.payer
  );

  //partially sign init tbc transaction

  // @ts-ignore
  initTbcTransaction.partialSign(tokenSwapInfo, feeAccount, destinationAccount);

  return { setupTransaction, initTbcTransaction };
};

export const initializeLinearPriceCurve = async (
  {
    tokenSwap,
    slopeNumerator,
    slopeDenominator,
    initialTokenAPriceNumerator,
    initialTokenAPriceDenominator,
    callerTokenBAccount,
    tokenSwapInfo,
    tokenA,
    tokenB,
    poolTokenDecimals,
    wallet,
    connection,
    initialTokenBLiquidity,
  } = {} as initializeLinearPriceCurveParams,
  {
    callerTokenBAccountOwner,
    adminAccountOwner,
  } = {} as initializeLinearPriceCurveOpts
) => {
  const { setupTransaction, initTbcTransaction } =
    await initializeLinearPriceCurveTx(
      {
        tokenSwap,
        slopeNumerator,
        slopeDenominator,
        initialTokenAPriceNumerator,
        initialTokenAPriceDenominator,
        callerTokenBAccount,
        tokenSwapInfo,
        tokenA,
        tokenB,
        poolTokenDecimals,
        walletPubKey: wallet.publicKey,
        connection,
        initialTokenBLiquidity,
      },
      { callerTokenBAccountOwner, adminAccountOwner }
    );

  const setupTx = await sendTx(wallet, connection, setupTransaction);
  await connection.confirmTransaction(setupTx);
  const tx = await sendTx(wallet, connection, initTbcTransaction);
  await connection.confirmTransaction(tx);

  return { tx, setupTx };
};
