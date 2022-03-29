import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import formidable from 'formidable';
export const config = {
    api: {
        bodyParser: false,
        externalResolver: true,
    }
};

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
        const address = await arweave.wallets.jwkToAddress(arWallet);
        const winston = await arweave.wallets.getBalance(address);

        const form = new formidable.IncomingForm();
        form.parse(req, async (er: any, fields: any, files: any) => {

            const { filepath, mimetype } = files.image;

            let data = fs.readFileSync(filepath);

            const imgTx = await arweave.createTransaction(
                {
                    data,
                },
                arWallet,
            );
            imgTx.addTag('App-Name', 'rally-io-test');
            imgTx.addTag('Content-Type', mimetype);
            await arweave.transactions.sign(imgTx, arWallet);
            await arweave.transactions.post(imgTx);
            const imageUri = `${protocol}://${host}:${port}/${imgTx.id}`
            res.status(200).json({ message: "upload successful", imageUri });
        });

    } else {
        res.status(405).json({ message: "method not supported" })
    }
}