
import { FC, useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Button, Grid, TextField, Typography, Box, Stack, Link, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { executeSwap, estimateSwap, tokenSwapProgram, getTokenSwapInfo, getMintInfo, getTokenAccountInfo } from "rly-js"
import { Wallet } from '@metaplex/js';
import { PublicKey } from '@solana/web3.js';
import { EXPLORER_ROOT, NETWORK } from "../config";
import { Provider } from '@project-serum/anchor';
import BN from 'bn.js';
import { getAssociatedTokenAddress, baseToDec, decToBase } from '../utils';

interface token {
    chainId: number,
    address: string,
    symbol: string,
    decimals: number,
    swapId: string,
    tags: []

}

interface swapProps {
    tokenList: token[]
}

const ExecuteTbcSwap: FC<swapProps> = ({ tokenList }) => {

    const { connection } = useConnection();
    const wallet = useWallet() as Wallet;
    const provider = new Provider(connection, wallet, {});

    type defaultSwapValues = {
        tokenSwapInfo: string,
        tokenA: string,
        tokenB: token | "",
        amountIn: number,
        amountOut: number
    }

    type swapResponse = {
        tx: string | null,
    }

    const defaultSwapValues = {
        tokenSwapInfo: "",
        tokenA: "RLYv2ubRMDLcGG2UyvPmnPmkfuQTsMbg4Jtygc7dmnq",
        tokenB: "",
        amountIn: 0,
        amountOut: 0
    } as defaultSwapValues;


    const defaultSwapResponse = {} as swapResponse;

    const [tokens] = useState(tokenList)
    const [formValues, setFormValues] = useState(defaultSwapValues)
    const [estimateOut, setEstimateOut] = useState(0);
    const [swapResponseValues, setSwapResponseValues] = useState(defaultSwapResponse)

    const generateSwapValues = async () => {
        const {
            tokenSwapInfo,
            tokenA,
            tokenB,
            amountIn,
            amountOut,
        } = formValues;


        const tokenSwapInfoPubKey = new PublicKey(tokenSwapInfo);
        const tokenAPubKey = new PublicKey(tokenA);
        const tokenBPubKey = new PublicKey(tokenB && tokenB.address);

        //convert amount to proper units

        const { decimals: tokenADecimals } = await getMintInfo({ tokenMint: tokenAPubKey, connection });
        const { decimals: tokenBDecimals } = await getMintInfo({ tokenMint: tokenBPubKey, connection });

        const amountInBN = baseToDec(new BN(amountIn), new BN(tokenADecimals));
        const amountOutBN = baseToDec(new BN(amountOut), new BN(tokenBDecimals));

        const tokenSwap = await tokenSwapProgram(provider);
        const { feeAccount, tokenAccountA, tokenAccountB, poolToken } = await getTokenSwapInfo(provider, tokenSwapInfoPubKey, tokenSwap.programId);
        const callerTokenAAccount = await getAssociatedTokenAddress(tokenAPubKey, wallet.publicKey)
        const callerTokenBAccount = await getAssociatedTokenAddress(tokenBPubKey, wallet.publicKey)


        return {
            tokenSwap,
            tokenSwapInfoPubKey,
            amountInBN,
            amountOutBN,
            callerTokenAAccount,
            callerTokenBAccount,
            poolToken,
            feeAccount,
            tokenAccountA,
            tokenAccountB,
            tokenADecimals,
            tokenBDecimals
        }

    }

    const estimateSwapValues = async () => {

        const {
            tokenSwap,
            tokenSwapInfoPubKey,
            amountInBN,
            amountOutBN,
            callerTokenAAccount,
            callerTokenBAccount,
            poolToken,
            feeAccount,
            tokenAccountA,
            tokenAccountB,
            tokenADecimals,
            tokenBDecimals
        } = await generateSwapValues()

        console.log("caller token a", callerTokenAAccount.toBase58())
        console.log("caller token b", callerTokenBAccount.toBase58())

        const tokenAAccountInfo = await getTokenAccountInfo(connection, callerTokenAAccount);
        const tokenBAccountInfo = await getTokenAccountInfo(connection, callerTokenBAccount);

        console.log("not getting here")

        try {

            const { amountTokenAPostSwap, amountTokenBPostSwap } = await estimateSwap({
                tokenSwap,
                tokenSwapInfo: tokenSwapInfoPubKey,
                amountIn: amountInBN,
                amountOut: amountOutBN,
                userTransferAuthority: wallet.publicKey,
                userSourceTokenAccount: callerTokenAAccount,
                userDestinationTokenAccount: callerTokenBAccount,
                swapSourceTokenAccount: tokenAccountA,
                swapDestinationTokenAccount: tokenAccountB,
                poolMintAccount: poolToken,
                poolFeeAccount: feeAccount,
                wallet,
                connection
            })

            console.log(tokenBAccountInfo.amount.toString())

            //console.log(amountTokenAPostSwap.toString())
            console.log(amountTokenBPostSwap.toString())

            return {
                amountA: decToBase((new BN(tokenAAccountInfo.amount)).sub(new BN(amountTokenAPostSwap)), new BN(tokenADecimals)),
                amountB: decToBase((new BN(amountTokenBPostSwap)).sub(new BN(tokenBAccountInfo.amount)), new BN(tokenBDecimals))
            }


        } catch (error) {
            console.log(error)
            console.log("invalid amounts")
            return {
                amountA: decToBase(amountInBN, new BN(tokenADecimals)),
                amountB: decToBase(amountOutBN, new BN(tokenBDecimals)),

            }
        }

    }

    useEffect(() => {
        const estimate = async () => {
            const { amountB } = await estimateSwapValues()
            console.log(amountB)
            setEstimateOut(Number(amountB))
        }
        if (wallet.publicKey && formValues.amountIn > 0) {
            estimate()
        }
    }, [formValues.amountIn]);

    const handleInputChange = async (e: any) => {
        const { name, value } = e.target;

        if (name === "tokenB") {
            return setFormValues({
                ...formValues,
                tokenB: value,
                tokenSwapInfo: value.swapId
            })
        }
        setFormValues({
            ...formValues,
            [name]: value,
        })
    };


    const handleSubmit = async (e: any) => {
        e.preventDefault();


        if (!wallet.publicKey) {
            console.log("wallet not active")
        } else {
            const {
                tokenSwap,
                tokenSwapInfoPubKey,
                amountInBN,
                amountOutBN,
                callerTokenAAccount,
                callerTokenBAccount,
                poolToken,
                feeAccount,
                tokenAccountA,
                tokenAccountB,
            } = await generateSwapValues()

            const result = await executeSwap({
                tokenSwap,
                tokenSwapInfo: tokenSwapInfoPubKey,
                amountIn: amountInBN,
                amountOut: amountOutBN,
                userTransferAuthority: wallet.publicKey,
                userSourceTokenAccount: callerTokenAAccount,
                userDestinationTokenAccount: callerTokenBAccount,
                swapSourceTokenAccount: tokenAccountA,
                swapDestinationTokenAccount: tokenAccountB,
                poolMintAccount: poolToken,
                poolFeeAccount: feeAccount,
                wallet,
                connection
            })

            setSwapResponseValues({ tx: result });

        }
    };

    console.log(formValues)


    return (
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 6 }}>

            <Grid container spacing={3} maxWidth="sm">

                {/*<Grid item xs={12} sm={12}>
                    <TextField
                        required
                        id="tokenSwapInfo"
                        name="tokenSwapInfo"
                        label="Swap Id"
                        value={formValues.tokenSwapInfo}
                        onChange={handleInputChange}
                        fullWidth
                        variant="standard"
                    />
                 </Grid>*/}
                <Grid item xs={12} sm={12}>
                    <FormControl fullWidth>
                        <InputLabel id="token-a-select-label">Select Token</InputLabel>
                        <Select
                            labelId="token-a-select-label"
                            id="tokenA"
                            name="tokenA"
                            value={formValues.tokenA}
                            label="Token A"
                            onChange={handleInputChange}
                        >
                            <MenuItem value={formValues.tokenA}>sRLY</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <FormControl fullWidth>
                        <InputLabel id="token-b-select-label">Select Token</InputLabel>
                        <Select
                            labelId="token-b-select-label"
                            id="tokenB"
                            name="tokenB"
                            value={formValues.tokenB}
                            label="Token B"
                            onChange={handleInputChange}
                        >
                            {
                                tokens.map((token: any, i: number) => {
                                    return <MenuItem key={i} value={token}>{token.name}</MenuItem>
                                })

                            }
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="amountIn"
                        name="amountIn"
                        label="Amount In"
                        fullWidth
                        variant="standard"
                        value={formValues.amountIn}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="amountOut"
                        name="amountOut"
                        label="Amount Out"
                        fullWidth
                        variant="standard"
                        value={estimateOut}
                    />
                </Grid>
            </Grid>
            <Button variant="contained" color="primary" type="submit" sx={{ mt: 3, mb: 2 }}>
                Swap
            </Button>
            {
                swapResponseValues.tx != null && (
                    <Stack spacing={1}>
                        <Typography variant="body1" color="text.secondary">{`swap successfully executed!`}<Link href={`${EXPLORER_ROOT}/tx/${swapResponseValues.tx}?cluster=${NETWORK}`} target="_blank"> (view transaction)</Link></Typography>
                    </Stack>

                )
            }
        </Box >

    );


}

export default ExecuteTbcSwap