import * as React from 'react';
import type { NextPage } from 'next'
import {
    Typography,
    Container,
    ButtonGroup,
    Button
} from '@mui/material';
import { APP_NAME, copy } from '../../config'
import Layout from "../../components/Layout";

const NFT: NextPage = () => {

    return (
        <Layout title={`Create Token | ${APP_NAME}`}>
            <Container disableGutters maxWidth="md" component="main" sx={{ pt: 8, pb: 6 }} >
                <Typography variant="h5" align="center" color="text.secondary" component="h1" sx={{ pt: 2, pb: 2 }}>
                    Create NFT
                </Typography>
            </Container>
        </Layout >
    )
}

export default NFT