
import { web3, BN } from '@project-serum/anchor';
const { Connection, clusterApiUrl } = web3;
import { NodeWallet } from '@metaplex/js';
import { loadKeypair } from "../../utils/utils"

import { createToken } from '../../../../ts/lib/src';

export const createTokenCommand = async (options) => {

    // get values from options

    const { env, keypair, name, symbol, no_freeze_authority } = options;
    let { supply, dec } = options;
    const ten = new BN(10)
    dec = new BN(dec)
    supply = new BN(supply)

    //convert to decimal units
    supply = supply.mul(ten.pow(dec))

    // connect to cluster and load wallet
    const connection = new Connection(clusterApiUrl(env))
    const wallet = new NodeWallet(loadKeypair(keypair))

    // create token
    const { tx, tokenMint, tokenAccount } = await createToken({
        initialSupply: supply,
        tokenData: { name, symbol, decimals: dec },
        connection,
        wallet,
        freezeAuthority: !no_freeze_authority
    })

    // wait for tx confirmation
    await connection.confirmTransaction(tx)

    console.log(`${name} created, token mint = ${tokenMint}, associated token account = ${tokenAccount}`)
}