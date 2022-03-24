import { useState } from 'react';
import type { NextPage } from 'next'
import {
    Typography,
    Container,
    Box,
    Stepper,
    StepLabel,
    StepContent,
    Step,
    Button,
    Paper
} from '@mui/material';
import { APP_NAME, copy } from '../../config'
import Layout from "../../components/Layout";
import ExecuteTbcSwap from "../../components/ExecuteTbcSwap";
import tokenlist from "../../assets/tokenlist.json";





const FanToken: NextPage = () => {

    const tokens = tokenlist.tokens;


    return (
        <Layout title={`Create Token | ${APP_NAME}`}>
            <Container disableGutters maxWidth="md" component="main" sx={{ pt: 8, pb: 6 }} >
                <Typography>Buy Tokens</Typography>
                <ExecuteTbcSwap tokenList={tokens} />
            </Container>
        </Layout>
    )



}

export default FanToken