import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Program, web3, BN, Provider } from '@project-serum/anchor';
import { Wallet } from '@metaplex/js';

const { PublicKey, SystemProgram: { programId }, Transaction } = web3;

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
    connection: web3.Connection
}

export const executeSwap = async ({
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
    connection

} = {} as executeSwapParams) => {

    const provider = new Provider(connection, wallet, { commitment: "confirmed", preflightCommitment: "processed" });
    const transaction = new Transaction();


    // get exepcted swap authority PDA

    const [expectedSwapAuthorityPDA] =
        await PublicKey.findProgramAddress(
            [tokenSwapInfo.toBuffer()],
            tokenSwap.programId
        );

    const ix = tokenSwap.instruction.swap(
        amountIn,
        amountOut,
        {
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
            }
        },
    )

    transaction.add(ix);
    return provider.send(transaction, [])

}