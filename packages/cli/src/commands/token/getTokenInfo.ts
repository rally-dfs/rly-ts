import { web3 } from "@project-serum/anchor";
const { Connection, clusterApiUrl, PublicKey } = web3;

import { getMintInfo, getMetadata } from "rly-js";

export const getTokenInfoCommand = async (mint, options) => {
  const { env } = options;
  // connect to cluster and load wallet
  const connection = new Connection(clusterApiUrl(env));
  const mintInfo = await getMintInfo({
    tokenMint: new PublicKey(mint),
    connection,
  });
  const data = await getMetadata({
    tokenMint: new PublicKey(mint),
    connection,
  });
  console.log("mint authority = ", mintInfo.mintAuthority.toBase58());
  console.log("supply = ", mintInfo.supply.toNumber());
  console.log("name = ", data.name);
  console.log("symbol = ", data.symbol);
};
