import * as React from 'react';
import type { NextPage } from 'next'
import {
  Typography,
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Box,
  Button
} from '@mui/material';
import Link from 'next/link';
import { APP_NAME, copy } from '../config'
import Layout from "../components/Layout";

const Home: NextPage = () => {

  return (
    <Layout title={`Home | ${APP_NAME}`}>
      <Container disableGutters maxWidth="md" component="main" sx={{ pt: 8, pb: 6 }}>
        <Typography variant="h5" align="center" color="text.secondary" component="h1" sx={{ pt: 2, pb: 2 }}>
          {copy.indexCopy.title}
        </Typography>
        <Typography variant="body1" align="left" color="text.secondary" component="p">
          {copy.indexCopy.headline}
        </Typography>
      </Container>
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
                <Link href="/creator">
                  <Button
                    fullWidth
                    variant='outlined'
                  >
                    Go
                  </Button>
                </Link>
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
                <Link href="/fan">
                  <Button
                    fullWidth
                    variant='outlined'
                  >
                    Go
                  </Button>
                </Link>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>

    </Layout>
  )
}

export default Home
