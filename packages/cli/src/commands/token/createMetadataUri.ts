import { web3, BN, Wallet } from "@project-serum/anchor";
import Arweave from "arweave";
import path from "path";
import fs from "fs";

export const createMetadataUri = async (options) => {
  // get values from options

  const { metadata, arwallet } = options;

  const host = "arweave.net";
  const port = "443";
  const protocol = "https";

  /*const host = '127.0.0.1';
  const port = "1984";
  const protocol = "http";*/

  const arweave = Arweave.init({
    host,
    port,
    protocol,
    timeout: 20000,
  });

  const arPath = arwallet.startsWith("~/")
    ? path.resolve(process.env.HOME, arwallet.slice(2))
    : path.resolve(arwallet);

  const arWallet = JSON.parse(fs.readFileSync(arPath).toString());
  const address = await arweave.wallets.jwkToAddress(arWallet);
  const winston = await arweave.wallets.getBalance(address);

  const metadataJson = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, metadata)).toString()
  );

  console.log("address = ", address);
  console.log("balance winstons =", winston);

  console.log(metadataJson);

  const arTx = await arweave.createTransaction(
    {
      data: JSON.stringify(metadataJson),
    },
    arWallet
  );
  arTx.addTag("App-Name", "dfs");
  arTx.addTag("Content-Type", "application/json");

  try {
    await arweave.transactions.sign(arTx, arWallet);
    const result = await arweave.transactions.post(arTx);
    const metadataUri = `${protocol}://${host}:${port}/${arTx.id}`;
    console.log(`metadata URI = ${metadataUri}`);
  } catch (error) {
    console.log(error);
  }
};
