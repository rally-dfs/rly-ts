import * as React from 'react';
import type { NextPage } from 'next'
import {
    Typography,
    Container,
    ButtonGroup,
    Button,
    Link
} from '@mui/material';
import { APP_NAME, copy } from '../../config'
import Layout from "../../components/Layout";

const Creator: NextPage = () => {

    return (
        <Layout title={`Creator | ${APP_NAME}`}>
            <Container disableGutters maxWidth="md" component="main" sx={{ pt: 8, pb: 6, textAlign: "center" }}>
                <Typography variant="h5" align="center" color="text.secondary" component="h1" sx={{ pt: 2, pb: 2 }}>
                    {copy.creatorCopy.title}
                </Typography>
                <ButtonGroup orientation="vertical"
                    aria-label="vertical outlined button group"
                    fullWidth
                    sx={{ pl: 10, pr: 10 }}
                >
                    <Link href="creator/token" underline="none">
                        <Button fullWidth
                            variant='outlined'
                            sx={{ mt: 2, mb: 2 }}
                        >Launch Token</Button>
                    </Link>
                    <Link href="creator/nft" underline="none">
                        <Button fullWidth
                            variant='outlined'>Create NFT</Button>
                    </Link>
                </ButtonGroup>
            </Container>
        </Layout >
    )
}

export default Creator