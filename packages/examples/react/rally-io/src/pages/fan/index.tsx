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

const Fan: NextPage = () => {

    return (
        <Layout title={`Creator | ${APP_NAME}`}>
            <Container disableGutters maxWidth="md" component="main" sx={{ pt: 8, pb: 6, textAlign: "center" }}>
                <Typography variant="h5" align="center" color="text.secondary" component="h1" sx={{ pt: 2, pb: 2 }}>
                    {copy.fanCopy.title}
                </Typography>
                <ButtonGroup orientation="vertical"
                    aria-label="vertical outlined button group"
                    fullWidth
                    sx={{ pl: 10, pr: 10 }}
                >
                    <Link href="fan/token" underline="none">
                        <Button fullWidth
                            variant='outlined'
                            sx={{ mt: 2, mb: 2 }}
                        >Buy Tokens</Button>
                    </Link>
                    <Link href="fan/nft" underline="none">
                        <Button fullWidth
                            variant='outlined'>Buy NFTs</Button>
                    </Link>
                </ButtonGroup>
            </Container>
        </Layout >
    )
}

export default Fan