import { useState } from 'react';
import type { NextPage } from 'next'
import {
    Typography,
    Container,
    Box,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Button,
    Paper
} from '@mui/material';
import { APP_NAME, copy } from '../../config'
import Layout from "../../components/Layout";
import CreateNft from '../../components/CreateNft';

const steps = [
    {
        label: 'NFT metadata',
        description: `Describe your NFT`,
    },
    {
        label: 'Upload artwork',
        description:
            'upload an image of your artworks',
    },
];

const NFT: NextPage = () => {

    return (
        <Layout title={`Create NFT | ${APP_NAME}`}>
        <Container disableGutters maxWidth="md" component="main" sx={{ pt: 8, pb: 6 }} >
          <CreateNft />
        </Container>
    </Layout>
    )
}

export default NFT