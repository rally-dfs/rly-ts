import { Token, TOKEN_PROGRAM_ID, u64 } from '@solana/spl-token';
import { Wallet } from '@metaplex/js';
import { web3, Provider } from "@project-serum/anchor";
const { Transaction } = web3;


interface createTokenParams {
    from: web3.PublicKey;
    to: web3.PublicKey;
    amount: u64
    connection: any;
    wallet: Wallet;
}


export const transferToken = async ({ from, to, amount, connection, wallet } = {} as createTokenParams) => {

    // create token mint 

    const provider = new Provider(connection, wallet, { commitment: "confirmed", preflightCommitment: "processed" });
    const transaction = new Transaction();


    // get token transfer instructions

    const ix = Token.createTransferInstruction(TOKEN_PROGRAM_ID, from, to, wallet.publicKey, [], amount)


    // add ix to transaction, send tx, returns tx

    transaction.add(ix)

    const tx = await provider.send(transaction, [])

    return tx


}