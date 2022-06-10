import {
  Metadata,
  PROGRAM_ADDRESS,
} from "@metaplex-foundation/mpl-token-metadata";
import { web3 } from "@project-serum/anchor";
import { config } from "../../config";

interface getMetadataParams {
  tokenMint: web3.PublicKey;
  connection: web3.Connection;
}

export const getMetadata = async (
  { tokenMint, connection } = {} as getMetadataParams
) => {
  const metadataProgramAddress = new web3.PublicKey(PROGRAM_ADDRESS);

  const [metadata] = await web3.PublicKey.findProgramAddress(
    [
      config.pda.METADATA,
      metadataProgramAddress.toBuffer(),
      tokenMint.toBuffer(),
    ],
    metadataProgramAddress
  );
  const { data } = await Metadata.fromAccountAddress(connection, metadata);

  data.name = data.name.replace(/\0/g, "");
  data.symbol = data.symbol.replace(/\0/g, "");
  data.uri = data.uri.replace(/\0/g, "");

  return data;
};
