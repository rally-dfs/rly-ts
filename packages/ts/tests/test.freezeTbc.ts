import assert from "assert";
const chai = require("chai");
const expect = chai.expect;
chai.use(require("chai-as-promised"));

import { web3, Provider, BN } from "@project-serum/anchor";
import { NodeWallet } from "@metaplex/js";

import {
  initializeLinearPriceCurve,
  executeSwap,
  tokenSwapProgram,
  Numberu64,
  getTokenSwapInfo,
  getMintInfo,
  getTokenAccountInfo,
} from "../src";

import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { token } from "@project-serum/anchor/dist/cjs/utils";
const { Keypair, Connection, clusterApiUrl, LAMPORTS_PER_SOL } = web3;

describe("test freeze", () => {
  let provider;
  let wallet;
  let connection;
  let tokenA;
  let tokenB;
  let tokenSwapInfo;
  let slopeNumerator;
  let slopeDenominator;
  let initialTokenAPriceNumerator;
  let initialTokenAPriceDenominator;
  let feeAccount;
  let poolToken;
  let tokenATokenAccount;
  let tokenBTokenAccount;
  let callerTokenAAccount;
  let callerTokenBAccount;
  const initialTokenBLiquidity = new BN(200 * 10 ** 8);
  const initialTokenALiquidity = new BN(10000 * 10 ** 8);
  const swapInitAmountTokenA = new BN(2400 * 10 ** 8);
  const decimals = 8;

  before(async () => {
    const walletKeyPair = Keypair.generate();
    tokenSwapInfo = Keypair.generate();
    provider = new Provider(
      new Connection(clusterApiUrl("devnet")),
      new NodeWallet(walletKeyPair),
      {}
    );
    ({ connection, wallet } = provider);
    const { payer } = wallet;
    await connection.confirmTransaction(
      await connection.requestAirdrop(wallet.publicKey, LAMPORTS_PER_SOL)
    );

    // create token A

    tokenA = await Token.createMint(
      connection,
      payer,
      payer.publicKey,
      payer.publicKey,
      decimals,
      TOKEN_PROGRAM_ID
    );

    // create token B

    tokenB = await Token.createMint(
      connection,
      payer,
      payer.publicKey,
      null,
      decimals,
      TOKEN_PROGRAM_ID
    );

    // create token a token account for caller

    callerTokenAAccount = await tokenA.createAssociatedTokenAccount(
      payer.publicKey
    );

    // creat token b token account for caller

    callerTokenBAccount = await tokenB.createAssociatedTokenAccount(
      payer.publicKey
    );

    // mint initial supply of token a to caller
    await tokenA.mintTo(
      callerTokenAAccount,
      payer,
      [],
      initialTokenALiquidity.toNumber()
    );

    // mint initial supply of token b to caller
    await tokenB.mintTo(
      callerTokenBAccount,
      payer,
      [],
      Numberu64.fromBuffer(initialTokenBLiquidity.toBuffer("le", 8))
    );
  });

  it("it should initiliaze a linear price curve", async () => {
    const { payer } = wallet;
    slopeNumerator = new BN(1);
    slopeDenominator = new BN(200000000);
    initialTokenAPriceNumerator = new BN(150);
    initialTokenAPriceDenominator = new BN(3);

    const tokenSwap = await tokenSwapProgram(provider);
    const poolTokenDecimals = 9;

    const { tx } = await initializeLinearPriceCurve(
      {
        tokenSwap,
        slopeNumerator,
        slopeDenominator,
        initialTokenAPriceNumerator,
        initialTokenAPriceDenominator,
        callerTokenBAccount: callerTokenBAccount,
        tokenSwapInfo,
        tokenA: tokenA.publicKey,
        tokenB: tokenB.publicKey,
        poolTokenDecimals,
        wallet,
        connection,
        initialTokenBLiquidity,
      },
      {}
    );

    await connection.confirmTransaction(tx);

    const data = await getTokenSwapInfo(
      connection,
      tokenSwapInfo.publicKey,
      tokenSwap.programId
    );
    poolToken = new Token(connection, data.poolToken, TOKEN_PROGRAM_ID, payer);
    feeAccount = data.feeAccount;
    tokenATokenAccount = data.tokenAccountA;
    tokenBTokenAccount = data.tokenAccountB;
    const { amount: feeAmount } = await poolToken.getAccountInfo(feeAccount);
    const { amount: tokenBTokenAccountAmount } = await tokenB.getAccountInfo(
      tokenBTokenAccount
    );

    assert.ok(tokenBTokenAccountAmount.eq(initialTokenBLiquidity));
    assert.ok(feeAmount.eq(new BN(0)));
  });

  it("should freeze the initialized token swap token account", async () => {
    const { payer } = wallet;
    await tokenA.freezeAccount(tokenATokenAccount, payer.publicKey, []);
    const acctInfo = await getTokenAccountInfo(connection, tokenATokenAccount);
    assert.equal(acctInfo.state, 2);
  });

  it("should fail to execute swap", async () => {
    const tokenSwap = await tokenSwapProgram(provider);
    const amountOut = new BN(0);

    const fail = executeSwap({
      tokenSwap,
      tokenSwapInfo: tokenSwapInfo.publicKey,
      amountIn: swapInitAmountTokenA,
      amountOut,
      userTransferAuthority: wallet.publicKey,
      userSourceTokenAccount: callerTokenAAccount,
      userDestinationTokenAccount: callerTokenBAccount,
      swapSourceTokenAccount: tokenATokenAccount,
      swapDestinationTokenAccount: tokenBTokenAccount,
      poolMintAccount: poolToken.publicKey,
      poolFeeAccount: feeAccount,
      wallet,
      connection,
    });
    await expect(fail).to.eventually.be.rejectedWith(
      "failed to send transaction: Transaction simulation failed: Error processing Instruction 0: custom program error: 0x11"
    );
  });
});
