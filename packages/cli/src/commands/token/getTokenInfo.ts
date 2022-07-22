import { web3, BN } from "@project-serum/anchor";
import fetch from "node-fetch";
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

  const ten = new BN(10);

  const supply = mintInfo.supply
    .div(ten.pow(new BN(mintInfo.decimals)))
    .toString();

  //get metadata object if there is a metadatauri

  const jsonData = data.uri
    ? await fetch(data.uri).then((res) => res.json())
    : {};

  console.log(`mint authority = ${mintInfo.mintAuthority.toBase58()}`);
  console.log(`supply = ${supply.toString()}`);
  console.log(`name = ${data.name}`);
  console.log(`symbol = ${data.symbol}`);

  //print values from metadata object

  for (const key in jsonData) {
    if (key !== "symbol" && key !== "name") {
      console.log(`${key} = ${jsonData[key]}`);
    }
  }

  // print metadata uri

  data.uri && console.log("metadata uri = ", data.uri);
};
