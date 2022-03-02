
import { web3, Provider } from '@project-serum/anchor'
import { NodeWallet } from '@metaplex/js';
import fs from 'fs';
import path from 'path';

const { Connection, clusterApiUrl } = web3;

export const loadKeypair = (keypair) => {
    if (!keypair || keypair == '') {
        throw new Error('Keypair is required!');
    }

    const keypairPath = keypair.startsWith("~/") ? path.resolve(process.env.HOME, keypair.slice(2)) : path.resolve(keypair);
    const loaded = web3.Keypair.fromSecretKey(
        new Uint8Array(JSON.parse(fs.readFileSync(keypairPath).toString())),
    );
    return loaded;
}


export const getProvider = (walletKeyPair, cluster) => {

    const wallet = new NodeWallet(loadKeypair(walletKeyPair))
    const connection = new Connection(clusterApiUrl(cluster));
    const provider = new Provider(connection, wallet, {});

    return { provider, connection, wallet }

}

export const getOrCreateAssociatedAccount = async (token, pubKey) => {

    const accountInfo = await token.getOrCreateAssociatedAccountInfo(pubKey);
    return accountInfo.address;

}
