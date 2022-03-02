
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { Account } from '@metaplex-foundation/mpl-core';


export const getMetadata = async ({ tokenMint, connection, }) => {
    const metadata = await Metadata.getPDA(tokenMint);
    const metadataInfo = await Account.getInfo(connection, metadata);
    const { data } = new Metadata(metadata, metadataInfo).data;
    return data;
}