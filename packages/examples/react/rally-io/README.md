## Rally IO Example App

This is an example react app using the `rly-ts` library to reproduce basic functionality required by a rally-io style app (token minting, bonding curve intialization, nft creation). Given that this is an example app it is currently only set up to run on the solana devnet.

### running the app locally 

```
npm i
npm run start
```

## Creating tokens and intializing bonding curves

This app uses `rly-ts` to allow creators to create tokens and initialize token bonding curves. The `CreateToken` and `InitTbc` components in the component directory execute this functionality. 

## Swaping tokens 

Tokens can be swapped using the swap functionality of the initialized token bonding curves. The `ExecuteTbcSwap` component executes this functionality. The allowed tokens for the swap are pulled from a token list which follows the tokenlist standard initially defined by Uniswap and currently in use on Solana [here](https://github.com/solana-labs/token-list/blob/main/src/tokens/solana.tokenlist.json). To add a token pair to swap they must be added to the token list found at `src/assets/tokenlist.json`

## Creating NFTs

NFTs are created using the [metaplex metadata libraries](https://docs.metaplex.com/token-metadata/Versions/v1.0.0/nft-standard) and arweave for media storage. Media uploads are currently handled with nextjs serverless functions at `src/pages/api/`, note that an Arweave wallet key is required to perform uploads. 

