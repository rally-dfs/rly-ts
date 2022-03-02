import { Token } from '@solana/spl-token';
import { actions, NodeWallet } from '@metaplex/js';
const { createMetadata } = actions;
import { MetadataDataData, Metadata, CreateMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { TokenData } from '../types';
import { Provider, web3 } from "@project-serum/anchor";
const { Transaction } = web3;


interface addMetadataParams {
    tokenMint: Token;
    tokenData: TokenData;
    connection: any;
    wallet: NodeWallet;
}

export const addMetadata = async ({ tokenMint, tokenData, connection, wallet } = {} as addMetadataParams) => {


    const provider = new Provider(connection, wallet, { commitment: "confirmed", preflightCommitment: "processed" });
    const transaction = new Transaction();

    const metadataData = new MetadataDataData({
        name: tokenData.name,
        symbol: tokenData.symbol,
        uri: "",
        sellerFeeBasisPoints: null,
        creators: null,
    });

    // get metadata PDA


    const metadata = await Metadata.getPDA(tokenMint.publicKey)

    // create metadata Tx

    const createMetadataTx = new CreateMetadata(
        { feePayer: wallet.publicKey },
        {
            metadata,
            metadataData,
            updateAuthority: wallet.publicKey,
            mint: tokenMint.publicKey,
            mintAuthority: wallet.publicKey,
        },
    );

    transaction.add(createMetadataTx)

    return provider.send(transaction, [])

}