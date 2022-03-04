
# RLY CLI 

RLY CLI allows you to setup fungilble SPL tokens and call Rally token programs from the command line. 

## installation 

`npm i -g rly-cli`

or 

`yarn global add rly-cli`

## general

The --keypair option on all commands points to a solana keypair file stored in your file system. You can create a keypair with the solana-cli or import an existing keypair.


## create token

`rly-cli create token`

This command can be used on any of the solana networks (mainnet-beta, devnet, testnet). This will create a token and decorate the token mint with metadata per the metaplex metadata standard. The token can be set up with an initial supply which is minted to the associated token account for the keypair creating the token. 

TODO: allow user to specify destination address of initial supply


```
Usage: rly-cli create-token [options]

Options:
  -e, --env <string>     Solana cluster env name (default:
                         "devnet")
  -k, --keypair <path>   Solana wallet location (default:
                         "--keypair not provided")
  -n, --name <string>    token name
  -s, --symbol <string>  token symbol
  -d, --dec <number>     token decimals (default: "9")
  --supply <number>      initial supply (integer value)
  -h, --help             display help for command

```

## add metadata to existing spl token

This command can be used on any of the solana networks (mainnet-beta, devnet, testnet). This command will add a metadata decorator to the specified token mint per the metaplex metadata standard. 

`npx ts-node src/rly-cli add-metadata`

```
Usage: rly-cli add-metadata [options] <mint>

Arguments:
  mint                   token mint

Options:
  -e, --env <string>     Solana cluster env name (default: "devnet")
  -k, --keypair <path>   Solana wallet location (default: "--keypair not provided")
  -n, --name <string>    token name
  -s, --symbol <string>  token symbol
  -h, --help             display help for command
  ```


## get token info

This command can be used on any of the solana networks (mainnet-beta, devnet, testnet). This command returns information about the token account (supply, authority, decimals) and the tokens metadata. Use this to verify the token metadata after adding metadata above.

`rly-cli get-token-info`

```
Usage: rly-cli get-token-info [options] <mint>

Arguments:
  mint                  token mint

Options:
  -e, --env <string>    Solana cluster env name (default: "devnet")
  -k, --keypair <path>  Solana wallet location (default: "--keypair not provided")
  -h, --help            display help for command
  ```
## Get Canonical $RLY Token Balance

This command will only work on mainnet-beta as it queries the token mint for canonical $RLY on mainnet-beta. This command looks for the canonical rally associated token account for the specified keypair and returns the balance. 

TODO: allow user to specify address to lookup, rather than just the associated token account

`rly-cli get-balance-canonical`

```
Usage: rly-cli get-balance-canonical [options]

Options:
  -k, --keypair <path>  Solana wallet location (default: "--keypair not provided")
  -h, --help            display help for command
```

## Get wormhole $RLY Token Balance

This command will only work on mainnet-beta as it queries the token mint for wormhole $RLY (v2) on mainnet-beta. This command looks for the canonical rally associated token account for the specified keypair and returns the balance. 

TODO: allow user to specify address to lookup, rather than just the associated token account

`rly-cli get-balance-wormhole`

```
Usage: rly-cli get-balance-wormhole [options]

Options:
  -k, --keypair <path>  Solana wallet location (default: "--keypair not provided")
  -h, --help            display help for command
```


## Swap wormhole $RLY for canonical $RLY

This command will only work on mainnet-beta as it swaps between the wormhole and canonical rally token mints on mainnet beta. This allows you to specify an amount to swap and optionally can specify a canonical token account and a wormhole token account, if the token accounts are not specified the associated token accounts with the specified keypairs will be used.

` rly-cli swap-wormhole-canonical`

```
Usage: rly-cli swap-wormhole-canonical [options]

Options:
  -a, --amount <number>                   amount
  -w, --wormhole_token_account <string>   destination account (if not included uses associated token acct)
  -c, --canonical_token_account <string>  destination account (if not included uses associated token acct)
  -k, --keypair <path>                    Solana wallet location (default: "--keypair not provided")
  -h, --help                              display help for command
```

## Swap canonical $RLY for wormhole $RLY

This command will only work on mainnet-beta as it swaps between the wormhole and canonical rally token mints on mainnet beta. This allows you to specify an amount to swap and optionally can specify a canonical token account and a wormhole token account, if the token accounts are not specified the associated token accounts with the specified keypairs will be used.

` rly-cli swap-canonical-wormhole`

```
Usage: rly-cli swap-canonical-wormhole [options]

Options:
  -a, --amount <string>                   amount
  -w, --wormhole_token_account <string>   destination account (if not included uses associated token acct)
  -c, --canonical_token_account <string>  destination account (if not included uses associated token acct)
  -k, --keypair <path>                    Solana wallet location (default: "--keypair not provided")
  -h, --help                              display help for command
```

## Initilialize token bonding curve

This command allows you to set up a token bonding curve

`rly-cli init-tbc`

```
Usage: rly-cli tbc-init [options] <token_a> <token_b> <token_b_liquidit>

Arguments:
  token_a                              token A
  token_b                              token B
  token_b_liquidit                     token B liquidity

Options:
  -e, --env <string>                   Solana cluster env name (default: "devnet")
  -k, --keypair <path>                 Solana wallet location (default: "--keypair not provided")
  --slope_numerator <string>           slope numerator
  --slope_denominator <string>         slope denominator
  --init_price_a_numerator <string>    initial price token A
  --init_price_a_denominator <string>  initial price token B
  -h, --help                           display help for command
```

## Swap tokens on bonding curve 

This command allows you to swap two tokens on an initialized bonding curve

```
Usage: rly-cli tbc-swap [options] <swap> <token_a> <token_b> <amount>

Arguments:
  swap                  swap
  token_a               token A
  token_b               token B
  amount                amount of token a to swap

Options:
  -e, --env <string>    Solana cluster env name (default: "devnet")
  -k, --keypair <path>  Solana wallet location (default: "--keypair not provided")
  -h, --help            display help for command

```


