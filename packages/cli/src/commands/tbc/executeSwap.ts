import { web3, BN } from '@project-serum/anchor';
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
const { PublicKey, Keypair } = web3;
import { getProvider } from "../../utils/utils"

import { tokenSwapProgram, getOrCreateAssociatedAccount, getTokenAccountInfo, getTokenSwapInfo, executeSwap } from '../../../../ts/lib/src';

export const executeSwapCommand = async (swap, token_a, token_b, amount, options) => {

    const { env, keypair, } = options;

    const { provider, wallet, connection } = getProvider(keypair, env)
    const { payer } = wallet;
    const tokenSwap = await tokenSwapProgram(provider);

    const tokenAAmount = new BN(amount);
    const amountOut = new BN(0)


    const tokenSwapInfo = new PublicKey(swap);

    const tokenA = new Token(connection, new PublicKey(token_a), TOKEN_PROGRAM_ID, payer);
    const tokenB = new Token(connection, new PublicKey(token_b), TOKEN_PROGRAM_ID, payer);

    const [SwapAuthorityPDA] =
        await PublicKey.findProgramAddress(
            [tokenSwapInfo.toBuffer()],
            tokenSwap.programId
        );

    const swapData = await getTokenSwapInfo(connection, tokenSwapInfo, tokenSwap.programId);

    const swapSourceInfo = await getTokenAccountInfo(connection, swapData.tokenAccountA);
    const swapDestInfo = await getTokenAccountInfo(connection, swapData.tokenAccountB);


    const swapSourceTokenAccount = swapSourceInfo.mint.toBase58() === tokenA.publicKey.toBase58() ? swapData.tokenAccountA : swapData.tokenAccountB;
    const swapDestinationTokenAccount = swapDestInfo.mint.toBase58() === tokenB.publicKey.toBase58() ? swapData.tokenAccountB : swapData.tokenAccountA;

    const callerTokenAAccount = await getOrCreateAssociatedAccount(tokenA, payer.publicKey);
    const callerTokenBAccount = await getOrCreateAssociatedAccount(tokenB, payer.publicKey);


    const tx = await executeSwap({
        tokenSwap,
        tokenSwapInfo,
        amountIn: tokenAAmount,
        amountOut,
        userTransferAuthority: payer.publicKey,
        userSourceTokenAccount: callerTokenAAccount,
        userDestinationTokenAccount: callerTokenBAccount,
        swapSourceTokenAccount,
        swapDestinationTokenAccount,
        poolMintAccount: swapData.poolToken,
        poolFeeAccount: swapData.feeAccount,
        wallet,
        connection
    })

    await connection.confirmTransaction(tx)

    console.log('swap executed successfully');
}