
import { FC, useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Button, Grid, TextField, Typography, Box, Stack, Link } from '@mui/material';
import BN from 'bn.js';
import { createToken } from "../../../../../build/src/index"
import { Wallet } from '@metaplex/js';
import { PublicKey } from '@solana/web3.js';
import { EXPLORER_ROOT, NETWORK } from "../config";

const CreateToken: FC = () => {

    const { connection } = useConnection();
    const wallet = useWallet() as Wallet;


    type createTokenValues = {
        tokenName: string,
        tokenSymbol: string,
        tokenDecimals: number,
        initialSupply: number
    }

    type createTokenReturn = {
        tx: string | null,
        tokenMint: PublicKey | null,
        tokenAccount: PublicKey | null
    }

    const defaultTokenValues = {
        tokenName: "",
        tokenSymbol: "",
        tokenDecimals: 0,
        initialSupply: 0
    } as createTokenValues;


    const defaultReturnValues = {} as createTokenReturn;


    const [formValues, setFormValues] = useState(defaultTokenValues)
    const [tokenReturnValues, setTokenReturnValues] = useState(defaultReturnValues)

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
            const { tokenName, tokenSymbol, tokenDecimals, initialSupply } = formValues;

            //convert init supply to decimal units

            const ten = new BN(10)
            const decimals = new BN(tokenDecimals)
            let supply = new BN(initialSupply);

            supply = supply.mul(ten.pow(decimals))

            const result = await createToken({
                initialSupply: supply,
                tokenData: {
                    name: tokenName,
                    symbol: tokenSymbol,
                    decimals: tokenDecimals
                },
                connection,
                wallet
            })

            setTokenReturnValues(result);
            console.log(result)

        }
    };


    return (


        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 6 }}>
            <Typography variant="h6" gutterBottom>
                Create Token
            </Typography>
            <Grid container spacing={3} maxWidth="sm">
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="tokenName"
                        name="tokenName"
                        label="Toke Name"
                        value={formValues.tokenName}
                        onChange={handleInputChange}
                        fullWidth
                        variant="standard"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="tokenSymbol"
                        name="tokenSymbol"
                        label="Toke Symbol"
                        fullWidth
                        variant="standard"
                        value={formValues.tokenSymbol}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="tokenDecimals"
                        name="tokenDecimals"
                        label="Token Decimals"
                        fullWidth
                        variant="standard"
                        value={formValues.tokenDecimals}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="initialSupply"
                        name="initialSupply"
                        label="Initial Supply"
                        fullWidth
                        variant="standard"
                        value={formValues.initialSupply}
                        onChange={handleInputChange}
                    />
                </Grid>
            </Grid>
            <Button variant="contained" color="primary" type="submit" sx={{ mt: 3, mb: 2 }}>
                Create Token
            </Button>

            {
                tokenReturnValues.tx != null && (
                    <Stack spacing={1}>
                        <Typography variant="body1" color="text.secondary">{`token successfully created! `}<Link href={`${EXPLORER_ROOT}/tx/${tokenReturnValues.tx}?cluster=${NETWORK}`} target="_blank">(view transaction)</Link></Typography>
                        <Typography variant="body1" color="text.secondary"></Typography>
                        <Typography variant="body1" color="text.secondary">token mint: <Link href={`${EXPLORER_ROOT}/address/${tokenReturnValues.tokenMint}?cluster=${NETWORK}`} target="_blank">{`${tokenReturnValues.tokenMint}`}</Link></Typography>
                    </Stack>

                )
            }
        </Box >



    );


}

export default CreateToken