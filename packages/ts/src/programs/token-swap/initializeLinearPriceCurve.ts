import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Program, web3, BN, Wallet } from "@project-serum/anchor";
import { config } from "../../../config";
import {
  generateTokenMintInstructions,
  generateCreateTokenAccountInstructions,
  Numberu64,
  sendTx,
  partialSignTx,
  addTxPayerAndHash,
} from "../../utils";

const {
  accountLayout: { SWAP_ACCOUNT_SPACE },
} = config;

const { PublicKey, Transaction } = web3;

interface initializeLinearPriceCurveTxResults {
  setupTransaction: web3.Transaction;
  initTbcTransaction: web3.Transaction;
}

interface initializeLinearPriceCurveResults {
  tx: web3.TransactionSignature;
  setupTx: web3.TransactionSignature;
}

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
  callerTokenBAccountOwner?: Wallet;
  //if the owner of the fee token account and destination token account is not the caller wallet include the admin owner public key here
  adminAccountOwner?: web3.PublicKey;
}

//generate partially signed transaction objects for initializing tbc

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
): Promise<initializeLinearPriceCurveTxResults> => {
  // initialize required transactions, split into two transactions as combined the transations are > the 1232 bytes limit for solana

  // setupTransaction creates required accounts for tbc
  let setupTransaction = new Transaction();

  //initTbcTransaciton initializes the new tbc
  let initTbcTransaction = new Transaction();

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

  // get token account create instructions for swap pda

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

  //transfer initial token_b liquidity into the swap token_b token account

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

  // create the tokenswapinfo data account to store swap data

  const tokenSwapInfoIx = web3.SystemProgram.createAccount({
    fromPubkey: walletPubKey,
    newAccountPubkey: tokenSwapInfo.publicKey,
    space: SWAP_ACCOUNT_SPACE,
    lamports: await connection.getMinimumBalanceForRentExemption(
      SWAP_ACCOUNT_SPACE
    ),
    programId: tokenSwap.programId,
  });

  //initiliaze the TBC

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

  // populate setup transaction

  setupTransaction.add(
    ...tokenIx,
    ...createTokenATokenAccountIx,
    ...createTokenBTokenAccountIx,
    tokenBTransferIx
  );

  // populate init tbc transaction

  initTbcTransaction.add(
    ...createFeeAccountIx,
    ...createDestinationAccountIx,
    tokenSwapInfoIx,
    initCurveIx
  );

  //add tx payer and recent blockchash to setup transaction

  await addTxPayerAndHash(setupTransaction, connection, walletPubKey);

  // partially sign setup transaction with generated accounts

  setupTransaction = await partialSignTx(setupTransaction, [
    poolTokenMint,
    tokenATokenAccount,
    tokenBTokenAccount,
    ...(callerTokenBAccountOwner ? [callerTokenBAccountOwner.payer] : []),
  ]);

  //add tx payer and recent blockchash to init tbc transaction

  await addTxPayerAndHash(initTbcTransaction, connection, walletPubKey);

  //partially sign init tbc transaction with generated accounts

  initTbcTransaction = await partialSignTx(initTbcTransaction, [
    tokenSwapInfo,
    feeAccount,
    destinationAccount,
  ]);

  return { setupTransaction, initTbcTransaction };
};

//generate partially signed transaction objects for initializing tbc

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
): Promise<initializeLinearPriceCurveResults> => {
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

  //send setup tx await tx finality
  const setupTx = await sendTx(wallet, connection, setupTransaction, {
    commitment: "finalized",
  });

  //send init tbc tx await tx finality
  const tx = await sendTx(wallet, connection, initTbcTransaction, {
    commitment: "finalized",
  });

  return { tx, setupTx };
};
