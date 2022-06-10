import { web3, Wallet } from "@project-serum/anchor";
const { Connection, clusterApiUrl, PublicKey } = web3;
import { loadKeypair } from "../../utils/utils";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";

export const freezeAccountCommand = async (mint, token_account, options) => {
  // get values from options
  const { env, keypair } = options;

  // connect to cluster and load wallet
  const connection = new Connection(clusterApiUrl(env));
  const wallet = new Wallet(loadKeypair(keypair));
  const { payer } = wallet;

  const token = new Token(
    connection,
    new PublicKey(mint),
    TOKEN_PROGRAM_ID,
    payer
  );
  const tokenAccount = new PublicKey(token_account);

  await token.freezeAccount(tokenAccount, payer.publicKey, []);

  console.log(`${token_account} frozen for toen ${mint}`);
};
