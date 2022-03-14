import * as React from 'react';
import type { NextPage } from 'next'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  AppBar,
  Toolbar,
  Typography,
  Divider,
  GlobalStyles,
  CssBaseline,
  Container,
  Alert,
  Grid,
  Link,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Box,
  Button
} from '@mui/material';
import { indexCopy, APP_NAME } from '../config'
import { Wallet } from '@metaplex/js';

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
            {APP_NAME}
          </Typography>
          <WalletMultiButton />
        </Toolbar>
      </AppBar>
      <Container disableGutters maxWidth="md" component="main" sx={{ pt: 8, pb: 6 }}>
        <Typography variant="h5" align="center" color="text.secondary" component="h1" sx={{ pt: 2, pb: 2 }}>
          {indexCopy.title}
        </Typography>
        <Typography variant="body1" align="left" color="text.secondary" component="p">
          {indexCopy.headline}
        </Typography>
      </Container>
      {/*!wallet.publicKey &&
        <Alert severity="error" style={{ justifyContent: "center" }}>
          please connect wallet
        </Alert>
      */}
      <Container maxWidth="md" component="main">
        <Grid container spacing={5} alignItems="flex-end">
          <Grid
            item
            xs={12}
            sm={6}
            md={6}
          >
            <Card>
              <CardHeader
                title="I'm a creator"
                titleTypographyProps={{ align: 'center' }}
                sx={{
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                      ? theme.palette.grey[200]
                      : theme.palette.grey[700],
                }}
              />
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'baseline',
                    mb: 2,
                  }}
                >
                  <Typography component="h2" variant="h3" color="text.primary">
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant='outlined'
                >
                  Go
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={6}
          >
            <Card>
              <CardHeader
                title="I'm a fan"
                titleTypographyProps={{ align: 'center' }}
                sx={{
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                      ? theme.palette.grey[200]
                      : theme.palette.grey[700],
                }}
              />
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'baseline',
                    mb: 2,
                  }}
                >
                  <Typography component="h2" variant="h3" color="text.primary">
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant='outlined'
                >
                  Go
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>

    </React.Fragment>
  )
}

export default Home
