
import { web3 } from '@project-serum/anchor';
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
const { Connection, clusterApiUrl, PublicKey } = web3;
import { NodeWallet } from '@metaplex/js';
import { loadKeypair } from "../../utils/utils"

import { addMetadata } from '../../../../ts/lib/src';

export const addMetadataCommand = async (mint, options) => {

    // get values from options
    const { env, keypair, name, symbol } = options;

    // connect to cluster and load wallet
    const connection = new Connection(clusterApiUrl(env))
    const wallet = new NodeWallet(loadKeypair(keypair))
    const { payer } = wallet;

    // init token instance
    const tokenMint = new Token(connection, new PublicKey(mint), TOKEN_PROGRAM_ID, payer);

    //add metdata to token
    const tx = await addMetadata({
        tokenMint,
        tokenData: { name, symbol, decimals: null },
        connection,
        wallet
    })

    console.log(`metadata successfully added to ${mint}`)
    console.log(`tx sig = ${tx}`)
}