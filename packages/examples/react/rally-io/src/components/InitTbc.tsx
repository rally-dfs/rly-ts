
import { FC, useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Button, Grid, TextField, Typography, Box, Stack, Link } from '@mui/material';
import BN from 'bn.js';
import { initializeLinearPriceCurve, tokenSwapProgram, getMintInfo } from "rly-js"
import { Wallet } from '@metaplex/js';
import { PublicKey, Keypair } from '@solana/web3.js';
import { EXPLORER_ROOT, NETWORK } from "../config";
import { Provider } from '@project-serum/anchor';
import { getAssociatedTokenAddress } from '../utils';

interface initTbcProps {
    tokenB: string,
    tokenBName: string
}


const InitTbc: FC<initTbcProps> = ({ tokenB, tokenBName }) => {

    const { connection } = useConnection();
    const wallet = useWallet() as Wallet;
    const provider = new Provider(connection, wallet, {});
    let tokenSwapInfo;

    type defaultTbcValues = {
        slopeNumerator: number,
        slopeDenominator: number,
        initialTokenAPriceNumerator: number,
        initialTokenAPriceDenominator: number,
        initialTokenBLiquidity: number,
        tokenA: string,
        tokenAName: string,
        tokenB: string,
        tokenBName: string,
        tokenSwapInfo: string,
    }


    const defaultTbcValues = {
        slopeNumerator: 0,
        slopeDenominator: 0,
        initialTokenAPriceNumerator: 0,
        initialTokenAPriceDenominator: 0,
        initialTokenBLiquidity: 0,
        tokenA: "RLYv2ubRMDLcGG2UyvPmnPmkfuQTsMbg4Jtygc7dmnq",
        tokenAName: "sRLY",
        tokenB,
        tokenBName
    } as defaultTbcValues;

    type initTbcResponse = {
        tx: string | null,
        setupTx: string | null,
        destinationAccount: Keypair | null
    }

    const defaultInitTbcRespondValues = {} as initTbcResponse;


    const [formValues, setFormValues] = useState(defaultTbcValues)
    const [tbcResponseValues, setTbcResponsValues] = useState(defaultInitTbcRespondValues)

    console.log(formValues)

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };


    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!wallet.publicKey) {
            console.log("wallet not active")
        } else {


            const {
                slopeNumerator,
                slopeDenominator,
                initialTokenAPriceNumerator,
                initialTokenAPriceDenominator,
                initialTokenBLiquidity,
                tokenA,
                tokenB
            } = formValues;


            tokenSwapInfo = Keypair.generate();
            setFormValues({
                ...formValues,
                tokenSwapInfo: tokenSwapInfo.publicKey.toBase58()
            })

            const tokenSwap = await tokenSwapProgram(provider);
            const callerTokenBAccount = await getAssociatedTokenAddress(new PublicKey(tokenB), wallet.publicKey)
            const { decimals: tokenBDecimals } = await getMintInfo({ tokenMint: new PublicKey(tokenB), connection });


            const result = await initializeLinearPriceCurve({
                tokenSwap,
                slopeNumerator: new BN(slopeNumerator),
                slopeDenominator: new BN(slopeDenominator),
                initialTokenAPriceNumerator: new BN(initialTokenAPriceNumerator),
                initialTokenAPriceDenominator: new BN(initialTokenAPriceDenominator),
                callerTokenBAccount,
                tokenSwapInfo,
                tokenA: new PublicKey(tokenA),
                tokenB: new PublicKey(tokenB),
                poolTokenDecimals: 9,
                wallet,
                connection,
                initialTokenBLiquidity: new BN(initialTokenBLiquidity * (10 ** Number(tokenBDecimals)))
            })

            setTbcResponsValues(result);

        }
    };


    return (
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 4 }}>


            <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                {`create bonding curve between ${formValues.tokenAName} and ${formValues.tokenBName}`}
            </Typography>

            <Grid container spacing={3} maxWidth="sm">
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="slopeNumerator"
                        name="slopeNumerator"
                        label="Slope Numerator"
                        fullWidth
                        variant="standard"
                        value={formValues.slopeNumerator}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="slopeDenominiator"
                        name="slopeDenominator"
                        label="Slope Denominator"
                        fullWidth
                        variant="standard"
                        value={formValues.slopeDenominator}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="initialTokenAPriceNumerator"
                        name="initialTokenAPriceNumerator"
                        label={`Initial ${formValues.tokenAName} Numerator`}
                        fullWidth
                        variant="standard"
                        value={formValues.initialTokenAPriceNumerator}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="initialTokenAPriceDenominator"
                        name="initialTokenAPriceDenominator"
                        label={`Initial ${formValues.tokenAName} Price Denominator`}
                        fullWidth
                        variant="standard"
                        value={formValues.initialTokenAPriceDenominator}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="initialTokenBLiquidity"
                        name="initialTokenBLiquidity"
                        label={`Initial ${formValues.tokenBName} Liquidity`}
                        fullWidth
                        variant="standard"
                        value={formValues.initialTokenBLiquidity}
                        onChange={handleInputChange}
                    />
                </Grid>
            </Grid>
            <Button variant="contained" color="primary" type="submit" sx={{ mt: 3, mb: 2 }}>
                Initialize Token Bonding Curve
            </Button>
            {
                tbcResponseValues.tx != null && (
                    <Stack spacing={1}>
                        <Typography variant="body1" color="text.secondary">{`swap successfully initialized!`}<Link href={`${EXPLORER_ROOT}/tx/${tbcResponseValues.tx}?cluster=${NETWORK}`} target="_blank">{`(view transaction)`}</Link></Typography>
                        <Typography variant="body1" color="text.secondary">swap id: <Link href={`${EXPLORER_ROOT}/address/${formValues.tokenSwapInfo}?cluster=${NETWORK}`} target="_blank">{`${formValues.tokenSwapInfo}`}</Link></Typography>
                    </Stack>

                )
            }
        </Box >

    );


}

export default InitTbc