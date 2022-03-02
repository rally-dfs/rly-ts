import { web3 } from "@project-serum/anchor";
import { MintLayout, u64 } from "@solana/spl-token";


export const getMintInfo = async ({ tokenMint, connection }) => {
    const info = await connection.getAccountInfo(new web3.PublicKey(tokenMint));
    const data = Buffer.from(info.data);
    const mintInfo = MintLayout.decode(data);
    if (mintInfo.mintAuthorityOption === 0) {
        mintInfo.mintAuthority = null;
    } else {
        mintInfo.mintAuthority = new web3.PublicKey(mintInfo.mintAuthority);
    }

    mintInfo.supply = u64.fromBuffer(mintInfo.supply);
    mintInfo.isInitialized = mintInfo.isInitialized != 0;

    if (mintInfo.freezeAuthorityOption === 0) {
        mintInfo.freezeAuthority = null;
    } else {
        mintInfo.freezeAuthority = new web3.PublicKey(mintInfo.freezeAuthority);
    }

    return mintInfo;
}