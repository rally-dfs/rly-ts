import { Token, TOKEN_PROGRAM_ID, u64 } from "@solana/spl-token";
import { Wallet } from "@metaplex/js";
import { web3, Provider } from "@project-serum/anchor";
import { addTxPayerAndHash, sendTx } from "../utils";
const { Transaction } = web3;

interface transferTokenTxParams {
  from: web3.PublicKey;
  to: web3.PublicKey;
  amount: u64;
  connection: web3.Connection;
  walletPubKey: web3.PublicKey;
}

interface transferTokenParams {
  from: web3.PublicKey;
  to: web3.PublicKey;
  amount: u64;
  connection: web3.Connection;
  wallet: Wallet;
}

export const transferTokenTx = async (
  { from, to, amount, connection, walletPubKey } = {} as transferTokenTxParams
) => {
  const transaction = new Transaction();

  // get token transfer instructions

  const ix = Token.createTransferInstruction(
    TOKEN_PROGRAM_ID,
    from,
    to,
    walletPubKey,
    [],
    amount
  );

  // add ix to transaction, send tx, returns tx

  transaction.add(ix);
  await addTxPayerAndHash(transaction, connection, walletPubKey);

  return transaction;
};

export const transferToken = async (
  { from, to, amount, connection, wallet } = {} as transferTokenParams
) => {
  const transaction = await transferTokenTx({
    from,
    to,
    amount,
    connection,
    walletPubKey: wallet.publicKey,
  });

  return sendTx(wallet, connection, transaction, { commitment: "finalized" });
};
