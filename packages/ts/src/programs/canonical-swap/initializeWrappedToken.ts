import { AccountLayout, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Program, web3, Provider } from '@project-serum/anchor';
import { config } from "../../../config";
import { Wallet } from '@metaplex/js';
const {
    pda: { WRAPPED_TOKEN_OWNER_AUTHORITY_PDA_SEED, TOKEN_ACCOUNT_PDA_SEED },
    accountLayout: { WRAPPED_DATA_SPACE }

} = config;
const { PublicKey, SystemProgram: { programId }, Transaction } = web3;

interface initializeWrappedTokenParams {
    canSwap: Program;
    wrappedMint: web3.PublicKey;
    wrappedData: any;
    canonicalMint: web3.PublicKey;
    canonicalData: web3.PublicKey;
    canonicalAuthority: any,
    connection: any
    wallet: Wallet,

}

export const initializeWrappedToken = async ({
    canSwap,
    wrappedMint,
    wrappedData,
    canonicalMint,
    canonicalData,
    canonicalAuthority,
    connection,
    wallet,
} = {} as initializeWrappedTokenParams) => {

    const provider = new Provider(connection, wallet, { commitment: "confirmed", preflightCommitment: "processed" });
    const transaction = new Transaction();

    const [wrappedTokenAccount, wrappedTokenAccountBump] =
        await PublicKey.findProgramAddress(
            [TOKEN_ACCOUNT_PDA_SEED, canonicalMint.toBuffer(), wrappedMint.toBuffer()],
            canSwap.programId
        );

    const [wrappedTokenAccountAuthority, wrappedTokenAccountAuthorityBump] =
        await PublicKey.findProgramAddress(
            [
                WRAPPED_TOKEN_OWNER_AUTHORITY_PDA_SEED,
                canonicalMint.toBuffer(),
                wrappedMint.toBuffer(),
            ],
            canSwap.programId
        );

    const wrappedDataIx = await canSwap.account.wrappedData.createInstruction(
        wrappedData,
        WRAPPED_DATA_SPACE
    )

    const initIx = await canSwap.instruction.initializeWrappedToken(
        wrappedTokenAccountBump,
        wrappedTokenAccountAuthorityBump,
        {
            accounts: {
                currentAuthority: canonicalAuthority.publicKey,
                wrappedTokenMint: wrappedMint,
                pdaWrappedTokenAccount: wrappedTokenAccount,
                pdaWrappedTokenAccountAuthority: wrappedTokenAccountAuthority,
                canonicalData: canonicalData,
                wrappedData: wrappedData.publicKey,
                tokenProgram: TOKEN_PROGRAM_ID,
                rent: web3.SYSVAR_RENT_PUBKEY,
                systemProgram: programId,
            }
        }
    );

    transaction.add(wrappedDataIx, initIx);
    return provider.send(transaction, [wrappedData])

}