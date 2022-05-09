import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { Account } from "@metaplex-foundation/mpl-core";
import { web3 } from "@project-serum/anchor";

interface getMetadataParams {
  tokenMint: web3.PublicKey;
  connection: any;
}

export const getMetadata = async (
  { tokenMint, connection } = {} as getMetadataParams
) => {
  const metadata = await Metadata.getPDA(tokenMint);
  const metadataInfo = await Account.getInfo(connection, metadata);
  const { data } = new Metadata(metadata, metadataInfo).data;
  return data;
};
