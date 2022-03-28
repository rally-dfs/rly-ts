import { NextApiRequest, NextApiResponse } from 'next';
import Arweave from 'arweave'

const host = process.env.AR_HOST;
const port = process.env.AR_PORT;
const protocol = process.env.AR_PROTOCOL;

// arwaeave init
const arweave = Arweave.init({
    host,
    port,
    protocol,
    timeout: 20000,
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {

    if (req.method === 'POST') {

        const arWallet = process.env.TEST_WALLET && JSON.parse(process.env.TEST_WALLET)
        const address = await arweave.wallets.jwkToAddress(arWallet);
        const winston = await arweave.wallets.getBalance(address);
        console.log("address = ", address)
        console.log("balance winstons =", winston)
        res.status(200).json({
            body: req.body
        });
    } else {
        res.status(405).json({ message: "method not supported" })
    }
}