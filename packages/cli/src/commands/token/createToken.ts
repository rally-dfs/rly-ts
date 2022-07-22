import { web3, BN, Wallet } from "@project-serum/anchor";
const { Connection, clusterApiUrl } = web3;
import { loadKeypair } from "../../utils/utils";

import { createToken } from "rly-js";

export const createTokenCommand = async (options) => {
  // get values from options

  const { env, keypair, name, symbol, uri, no_freeze_authority } = options;
  let { supply, dec } = options;
  const ten = new BN(10);
  dec = new BN(dec);
  supply = new BN(supply);

  //convert to decimal units
  supply = supply.mul(ten.pow(dec));

  // connect to cluster and load wallet
  const connection = new Connection(clusterApiUrl(env));
  const wallet = new Wallet(loadKeypair(keypair));

  // create token
  const { tx, tokenMint, tokenAccount } = await createToken({
    initialSupply: supply,
    tokenData: { name, symbol, decimals: dec, uri },
    connection,
    wallet,
    freezeAuthority: !no_freeze_authority,
  });

  // wait for tx confirmation
  await connection.confirmTransaction(tx);

  console.log(
    `${name} created, token mint = ${tokenMint}, associated token account = ${tokenAccount}`
  );
};
