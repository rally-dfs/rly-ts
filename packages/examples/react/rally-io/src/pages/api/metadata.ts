import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {


    if (req.method === 'POST') {
        console.log(req.body)
        res.status(200).json({
            body: req.body,
        });
    } else {
        res.status(405).json({ message: "method not supported" })
    }
}