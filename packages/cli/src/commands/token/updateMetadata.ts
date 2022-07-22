import { web3, Wallet } from "@project-serum/anchor";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
const { Connection, clusterApiUrl, PublicKey } = web3;
import { loadKeypair } from "../../utils/utils";

import { updateMetadata } from "rly-js";

export const updateMetadataCommand = async (mint, options) => {
  // get values from options
  const { env, keypair, name, symbol, uri } = options;

  // connect to cluster and load wallet
  const connection = new Connection(clusterApiUrl(env));
  const wallet = new Wallet(loadKeypair(keypair));
  const { payer } = wallet;

  // init token instance
  const tokenMint = new Token(
    connection,
    new PublicKey(mint),
    TOKEN_PROGRAM_ID,
    payer
  );

  //add metdata to token
  const tx = await updateMetadata({
    tokenMint,
    tokenData: { name, symbol, decimals: null, uri },
    connection,
    wallet,
  });

  console.log(`metadata successfully updated for ${mint}`);
  console.log(`tx sig = ${tx}`);
};
