
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Program, web3, BN, Provider } from '@project-serum/anchor';
import { NodeWallet } from '@metaplex/js';
import { config } from "../../../config";
const { pda: { CANONICAL_MINT_AUTHORITY_PDA_SEED, TOKEN_ACCOUNT_PDA_SEED } } = config;
const { Transaction } = web3;

interface swapWrappedForCanonicalParams {
    canSwap: Program;
    canonicalMint: web3.PublicKey;
    wrappedMint: web3.PublicKey;
    canonicalData: web3.PublicKey;
    wrappedData: web3.PublicKey,
    sourceTokenAccount: web3.PublicKey,
    destinationTokenAccount: web3.PublicKey,
    destinationAmount: BN,
    wallet: NodeWallet,
    connection: any
}

export const swapWrappedForCanonical = async ({
    canSwap,
    canonicalMint,
    wrappedMint,
    canonicalData,
    wrappedData,
    sourceTokenAccount,
    destinationTokenAccount,
    destinationAmount,
    wallet,
    connection
} = {} as swapWrappedForCanonicalParams) => {

    const provider = new Provider(connection, wallet, { commitment: "confirmed", preflightCommitment: "processed" });
    const transaction = new Transaction();

    const [expectedMintAuthorityPDA, expectedMintAuthorityBump] =
        await web3.PublicKey.findProgramAddress(
            [CANONICAL_MINT_AUTHORITY_PDA_SEED, canonicalMint.toBuffer()],
            canSwap.programId
        );

    const [wrappedTokenAccount] = await web3.PublicKey.findProgramAddress(
        [TOKEN_ACCOUNT_PDA_SEED, canonicalMint.toBuffer(), wrappedMint.toBuffer()],
        canSwap.programId
    );

    const ix = canSwap.instruction.swapWrappedForCanonical(
        destinationAmount,
        expectedMintAuthorityBump,
        {
            accounts: {
                user: wallet.publicKey,
                destinationCanonicalTokenAccount: destinationTokenAccount,
                canonicalMint: canonicalMint,
                pdaCanonicalMintAuthority: expectedMintAuthorityPDA,
                sourceWrappedTokenAccount: sourceTokenAccount,
                wrappedTokenAccount,
                canonicalData: canonicalData,
                wrappedData: wrappedData,
                tokenProgram: TOKEN_PROGRAM_ID,
            }
        }
    );

    transaction.add(ix)
    return provider.send(transaction, [])

}


