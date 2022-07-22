import { PublicKey } from "@solana/web3.js";
import { BN } from "@project-serum/anchor";

const ten = new BN(10);

export const TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);
/** Address of the SPL Associated Token Account program */
export const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

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
};

export const baseToDec = (price: BN, dec: BN) => {
  return new BN(price.toNumber() * Math.pow(10, dec.toNumber()));
};

export const decToBase = (decVal: BN, dec: BN) => {
  return decVal.toNumber() / Math.pow(10, dec.toNumber());
};
