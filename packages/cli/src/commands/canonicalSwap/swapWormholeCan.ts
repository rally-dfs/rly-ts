import { web3, BN } from "@project-serum/anchor";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { getProvider } from "../../utils/utils";
import { config } from "../../utils/config";

const { PublicKey } = web3;

import {
  swapWrappedForCanonical,
  canonicalSwapProgram,
  getOrCreateAssociatedAccount,
} from "rly-js";

export const swapWormholeCanCommand = async (options) => {
  const { keypair, wormhole_token_account, canonical_token_account, version } =
    options;
  let { amount } = options;
  const { provider, wallet, connection } = getProvider(keypair, "mainnet-beta");
  const { payer } = wallet;
  const {
    cswap: {
      canonicalDataV2,
      canonicalMintV2,
      canonicalMintV3,
      canonicalDataV3,
      wormholeData,
      wormholeMint,
    },
  } = config;

  const canSwap = await canonicalSwapProgram(provider);

  const canonicalMint = new PublicKey(
    version === "2" ? canonicalMintV2 : canonicalMintV3
  );
  const canonicalData = new PublicKey(
    version === "2" ? canonicalDataV2 : canonicalDataV3
  );

  const { decimals } = await canSwap.account.canonicalData.fetch(canonicalData);

  const ten = new BN(10);
  const decimalsBN = new BN(Number(decimals));
  let destAmount = new BN(amount);

  //convert to decimal units
  destAmount = destAmount.mul(ten.pow(decimalsBN));

  //decimals of destination-

  const wormholeToken = new Token(
    connection,
    new PublicKey(wormholeMint),
    TOKEN_PROGRAM_ID,
    payer
  );
  const canonicalToken = new Token(
    connection,
    new PublicKey(canonicalMint),
    TOKEN_PROGRAM_ID,
    payer
  );

  const { decimals: wormDec } = await wormholeToken.getMintInfo();

  const wormholeTokenAccount = wormhole_token_account
    ? new PublicKey(wormhole_token_account)
    : await getOrCreateAssociatedAccount(wormholeToken, wallet.payer.publicKey);
  const canonicalTokenAccount = canonical_token_account
    ? new PublicKey(canonical_token_account)
    : await getOrCreateAssociatedAccount(
        canonicalToken,
        wallet.payer.publicKey
      );

  let { amount: wormAmount } = await wormholeToken.getAccountInfo(
    wormholeTokenAccount
  );

  const wormBal = new BN(wormAmount);

  const balance = wormBal.div(ten.pow(new BN(wormDec))).toNumber();

  if (balance < Number(amount)) {
    return console.log(
      `insufficent funds, your wormhole $RLY balance is currently ${balance} `
    );
  }

  const tx = await swapWrappedForCanonical({
    canSwap,
    canonicalMint: canonicalMint,
    wrappedMint: new PublicKey(wormholeMint),
    canonicalData: canonicalData,
    wrappedData: new PublicKey(wormholeData),
    sourceTokenAccount: wormholeTokenAccount,
    destinationTokenAccount: canonicalTokenAccount,
    destinationAmount: destAmount,
    wallet,
    connection,
  });

  await connection.confirmTransaction(tx);

  console.log(
    `${destAmount
      .div(ten.pow(decimalsBN))
      .toNumber()} of ${wormholeMint} swapped for ${canonicalMint} sent to ${canonicalTokenAccount.toBase58()} `
  );
  console.log(`tx sig = ${tx}`);
};
