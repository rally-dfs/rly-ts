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
    timeout: 25000,
});


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {


    if (req.method === 'POST') {

        const arWallet = process.env.WALLET && JSON.parse(process.env.WALLET)
        const body = req.body

        const arTx = await arweave.createTransaction(
            {
                data: JSON.stringify(body),
            },
            arWallet,
        );
        arTx.addTag('App-Name', 'rally-io-test');
        arTx.addTag('Content-Type', 'application/json');

        await arweave.transactions.sign(arTx, arWallet);
        await arweave.transactions.post(arTx);

        const metadataUri = `${protocol}://${host}:${port}/${arTx.id}`
        res.status(200).json({ message: "metadata created successfully", metadataUri });


    } else {
        res.status(405).json({ message: "method not supported" })
    }
}