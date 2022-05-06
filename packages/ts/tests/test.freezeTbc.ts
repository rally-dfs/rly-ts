
import assert from 'assert';

import { web3, Provider, BN } from "@project-serum/anchor"
import { NodeWallet } from "@metaplex/js";

import { initializeLinearPriceCurve, executeSwap, tokenSwapProgram, Numberu64, getTokenSwapInfo } from "../src";

import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
const { Keypair, Connection, clusterApiUrl, LAMPORTS_PER_SOL } = web3;

describe('test freeze', () => {

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
    const decimals = 8

    before(async () => {
        const walletKeyPair = Keypair.generate();
        tokenSwapInfo = Keypair.generate();
        provider = new Provider(new Connection(clusterApiUrl("devnet")), new NodeWallet(walletKeyPair), {});
        ({ connection, wallet } = provider);
        const { payer } = wallet;
        await connection.confirmTransaction(await connection.requestAirdrop(wallet.publicKey, LAMPORTS_PER_SOL))

        tokenA = await Token.createMint(
            connection,
            payer,
            payer.publicKey,
            payer.publicKey,
            decimals,
            TOKEN_PROGRAM_ID
        );


        tokenB = await Token.createMint(
            connection,
            payer,
            payer.publicKey,
            null,
            decimals,
            TOKEN_PROGRAM_ID
        );

        callerTokenAAccount = await tokenA.createAssociatedTokenAccount(payer.publicKey);
        callerTokenBAccount = await tokenB.createAssociatedTokenAccount(payer.publicKey);
        await tokenB.mintTo(callerTokenBAccount, payer, [], Numberu64.fromBuffer(initialTokenBLiquidity.toBuffer()));
        await tokenA.mintTo(callerTokenAAccount, payer, [], initialTokenALiquidity.toNumber());
    })

    it('it should initiliaze a linear price curve', async () => {

        const { payer } = wallet
        slopeNumerator = new BN(1);
        slopeDenominator = new BN(200000000);
        initialTokenAPriceNumerator = new BN(150);
        initialTokenAPriceDenominator = new BN(3);

        const tokenSwap = await tokenSwapProgram(provider);
        const poolTokenDecimals = 9;

        const { tx, destinationAccount } = await initializeLinearPriceCurve({
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
            initialTokenBLiquidity
        }, {})

        await connection.confirmTransaction(tx);

        const data = await getTokenSwapInfo(connection, tokenSwapInfo.publicKey, tokenSwap.programId);
        poolToken = new Token(connection, data.poolToken, TOKEN_PROGRAM_ID, payer)
        feeAccount = data.feeAccount;
        tokenATokenAccount = data.tokenAccountA;
        tokenBTokenAccount = data.tokenAccountB;
        const { amount: feeAmount } = await poolToken.getAccountInfo(feeAccount);
        const { amount: destinationAmount } = await poolToken.getAccountInfo(destinationAccount.publicKey)

        assert.ok(feeAmount.eq(new BN(0)));
        assert.ok(destinationAmount.eq(new BN(10 * 10 ** 8)));

    })

    it('should freeze the initialized token swap', async () => {

        const { payer } = wallet
        await tokenA.freezeAccount(tokenATokenAccount, payer.publicKey, []);

    })

    it('should fail to execute swap', async () => {

        const tokenSwap = await tokenSwapProgram(provider);
        const amountOut = new BN(0)

        const tx = await executeSwap({
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
            connection
        })

        await connection.confirmTransaction(tx)

    })
})