import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Program, web3, Provider } from '@project-serum/anchor';
import { config } from "../../../config";
import { Wallet } from '@metaplex/js';
const { pda: { CANONICAL_MINT_AUTHORITY_PDA_SEED }, accountLayout: { CANONICAL_DATA_SPACE } } = config;
const { PublicKey, SystemProgram: { programId }, Transaction } = web3;


interface intitializeCanonicalTokenParams {
    canSwap: Program;
    canonicalMint: web3.PublicKey;
    canonicalData: any;
    canonicalAuthority: web3.PublicKey;
    connection: any;
    wallet: Wallet;

}

export const initializeCanonicalToken = async ({
    canSwap,
    canonicalMint,
    canonicalData,
    canonicalAuthority,
    connection,
    wallet,

} = {} as intitializeCanonicalTokenParams) => {

    const provider = new Provider(connection, wallet, { commitment: "confirmed", preflightCommitment: "processed" });
    const transaction = new Transaction();

    const [expectedMintAuthorityPDA, expectedMintAuthorityBump] =
        await PublicKey.findProgramAddress(
            [CANONICAL_MINT_AUTHORITY_PDA_SEED, canonicalMint.toBuffer()],
            canSwap.programId
        );

    const canDataiX = await canSwap.account.canonicalData.createInstruction(
        canonicalData,
        CANONICAL_DATA_SPACE
    )

    const initIx = canSwap.instruction.initializeCanonicalToken(
        expectedMintAuthorityBump,
        {
            accounts: {
                initializer: canonicalAuthority,
                canonicalMint: canonicalMint,
                pdaCanonicalMintAuthority: expectedMintAuthorityPDA,
                canonicalData: canonicalData.publicKey,
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: programId,
            },

        }
    );

    transaction.add(canDataiX, initIx);
    return provider.send(transaction, [canonicalData])


}