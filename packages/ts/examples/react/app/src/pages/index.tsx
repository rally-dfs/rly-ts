import * as React from 'react';
import type { NextPage } from 'next'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { AppBar, Toolbar, Typography, Divider, GlobalStyles, CssBaseline, Container, Alert } from '@mui/material';
import { indexCopy } from '../config'

import CreateToken from '../components/CreateToken'
import InitTbc from '../components/InitTbc';
import ExecuteTbcSwap from '../components/ExecuteTbcSwap';


const Home: NextPage = () => {

  const wallet = useWallet() as Wallet;

  return (
    <React.Fragment>

      <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
      <CssBaseline />
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar sx={{ flexWrap: 'wrap' }}>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            RLY Network Test App
          </Typography>
          <WalletMultiButton />
        </Toolbar>
      </AppBar>

      <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
        <Typography variant="h5" align="left" color="text.secondary" component="h1" sx={{ pt: 2, pb: 2 }}>
          {indexCopy.title}
        </Typography>
        <Typography variant="body1" align="left" color="text.secondary" component="p">
          {indexCopy.headline}
        </Typography>
      </Container>
      <Divider />
      {!wallet.publicKey &&
        <Container maxWidth="sm" style={{ paddingLeft: 0, paddingRight: 0 }}>
          <Alert severity="error">
            please connect wallet
          </Alert>
        </Container>
      }
      <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 2, pb: 2 }}>
        <CreateToken />
      </Container >
      <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 2, pb: 2 }}>
        <InitTbc />
      </Container>
      <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 2, pb: 2, mb: 4 }}>
        <ExecuteTbcSwap />
      </Container>
    </React.Fragment>
  )
}

export default Home
