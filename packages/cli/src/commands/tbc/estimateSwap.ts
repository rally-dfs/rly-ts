


import { web3, BN } from '@project-serum/anchor';
const { PublicKey, Keypair } = web3;
import { TOKEN_PROGRAM_ID, Token } from '@solana/spl-token';
import { getProvider } from "../../utils/utils"

import { tokenSwapProgram, estimateSwap, getOrCreateAssociatedAccount, getTokenSwapInfo } from '../../../../ts/lib/src';


export const estimateSwapCommand = async (swap, token_a, token_b, amount, options) => {


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

    const callerTokenAAccount = await getOrCreateAssociatedAccount(tokenA, payer.publicKey);
    const callerTokenBAccount = await getOrCreateAssociatedAccount(tokenB, payer.publicKey);

    const { amountTokenAPostSwap, amountTokenBPostSwap } = await estimateSwap({
        tokenSwap,
        tokenSwapInfo,
        amountIn: tokenAAmount,
        amountOut,
        userTransferAuthority: payer.publicKey,
        userSourceTokenAccount: callerTokenAAccount,
        userDestinationTokenAccount: callerTokenBAccount,
        swapSourceTokenAccount: swapData.tokenAccountA,
        swapDestinationTokenAccount: swapData.tokenAccountB,
        poolMintAccount: swapData.poolToken,
        poolFeeAccount: swapData.feeAccount,
        wallet,
        connection
    })

    console.log(`estimated amount token A = ${amountTokenAPostSwap}`);
    console.log(`estimated amount token B = ${amountTokenBPostSwap}`);

}