import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
export const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
/** Address of the SPL Associated Token Account program */
export const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');

export const getAssociatedTokenAddress = async (
    mint: PublicKey,
    owner: PublicKey,
    programId = TOKEN_PROGRAM_ID,
    associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID
) => {

    const [address] = await PublicKey.findProgramAddress(
        [owner.toBuffer(), programId.toBuffer(), mint.toBuffer()],
        associatedTokenProgramId
    );
    return address;
}

export const baseToDec = (price: number, dec: number) => {
    return new BN(price * 10 ** dec)
}

export const decToBase = (decVal: number, dec: number) => {
    return new BN(decVal / 10 ** dec)
}

