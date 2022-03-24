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


const FanNft: NextPage = () => {

    return (
        <Layout title={`Create Token | ${APP_NAME}`}>
            <Container disableGutters maxWidth="md" component="main" sx={{ pt: 8, pb: 6 }} >
                <Typography>Buy NFTs</Typography>
            </Container>
        </Layout>
    )



}

export default FanNft