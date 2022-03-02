# DFS JS 

## Install

Add the package as a dependency to your project:

```
$ npm i dfs-js
```

with yarn

```
yarn add i dfs-js
```

## Usage

### Token

```

// token

import { Keypair, Connection, clusterApiUrl } from 'solana/web3js`;
import { createToken, getMetadata } from 'dfs-js';

const initialSupply = new BN(1_000_000);
const name = "TestToken";
const symbol = "TKNSYMBL";
const decimals = 9

const walletKeyPair = Keypair.generate();
const connection = new Connection(clusterApiUrl("devnet"))
const wallet = new NodeWallet(walletKeyPair)

//create token

const { tx, tokenMint } = await createToken({
            initialSupply,
            tokenData: { name, symbol, decimals },
            connection,
            wallet
        })

// fetch metadata

const metadata await getMetadata({ tokenMint: tokenMint.publicKey, connection })

```
### Token Bonding Curve

```

// token bonding curve swap

import { Provider } from "@project-serum/anchor"
import { Keypair, Connection, clusterApiUrl } from 'solana/web3js`;
import { tokenSwapProgram } from 'dfs-js';

const walletKeyPair = Keypair.generate();
const provider = new Provider(new Connection(clusterApiUrl("devnet")), new NodeWallet(walletKeyPair), {});

const tokenSwap = await tokenSwapProgram(provider);

// view examples https://github.com/rally-dfs/dfs-ts/tree/main/ts/tests

```

### Canonical Token Swap

```

// canonical token swap

import { Provider } from "@project-serum/anchor"
import { Keypair, Connection, clusterApiUrl } from 'solana/web3js`;
import { canonicalSwapProgram } from 'dfs-js';

const walletKeyPair = Keypair.generate();
const provider = new Provider(new Connection(clusterApiUrl("devnet")), new NodeWallet(walletKeyPair), {});

const tokenSwap = await canonicalSwapProgram(provider);

// view examples https://github.com/rally-dfs/dfs-ts/tree/main/ts/tests

```
