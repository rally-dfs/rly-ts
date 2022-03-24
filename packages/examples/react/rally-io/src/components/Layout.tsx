import React, { ReactNode } from 'react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Head from 'next/head'
import {
    GlobalStyles,
    CssBaseline,
    AppBar,
    Toolbar,
    Typography,
    Container,
    Link
} from '@mui/material'

import { copy, APP_NAME } from '../config'
const { indexCopy } = copy;


type Props = {
    children?: ReactNode,
    title?: string
}

const Layout = ({ children, title }: Props) => {
    return (
        <>
            <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
            <Head>
                <title>{title}</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <CssBaseline />
            <AppBar
                position="static"
                color="default"
                elevation={0}
                sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
            >
                <Toolbar sx={{ flexWrap: 'wrap' }}>

                    <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                        <Link href="/" underline="none" color="inherit">
                            {APP_NAME}
                        </Link>
                    </Typography>

                    <WalletMultiButton />
                </Toolbar>
            </AppBar>
            {/*!wallet.publicKey &&
             <Alert severity="error" style={{ justifyContent: "center" }}>
                please connect wallet
                </Alert>
            */}
            {children}
        </>
    )
}

export default Layout