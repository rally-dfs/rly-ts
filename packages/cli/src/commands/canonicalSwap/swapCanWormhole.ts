import { web3, BN } from "@project-serum/anchor";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { getProvider } from "../../utils/utils";
import { config } from "../../utils/config";

const { PublicKey } = web3;

import {
  swapCanonicalForWrapped,
  canonicalSwapProgram,
  getOrCreateAssociatedAccount,
} from "rly-js";

export const swapCanWormholeCommand = async (options) => {
  const { version, keypair, wormhole_token_account, canonical_token_account } =
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

  let { decimals } = await canSwap.account.wrappedData.fetch(wormholeData);

  const ten = new BN(10);
  decimals = new BN(decimals);
  let destAmount = new BN(amount);

  //convert to decimal units
  destAmount = destAmount.mul(ten.pow(decimals));

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

  const { decimals: canDec } = await canonicalToken.getMintInfo();

  const wormholeTokenAccount = wormhole_token_account
    ? new PublicKey(wormhole_token_account)
    : await getOrCreateAssociatedAccount(wormholeToken, wallet.payer.publicKey);
  const canonicalTokenAccount = canonical_token_account
    ? new PublicKey(canonical_token_account)
    : await getOrCreateAssociatedAccount(
        canonicalToken,
        wallet.payer.publicKey
      );

  let { amount: canAmount } = await canonicalToken.getAccountInfo(
    canonicalTokenAccount
  );

  const canBalance = new BN(canAmount);

  const balance = canBalance.div(ten.pow(new BN(canDec))).toNumber();

  if (balance < Number(amount)) {
    return console.log(
      `insufficent funds, your canonical $RLY balance is currently ${balance}`
    );
  }

  const tx = await swapCanonicalForWrapped({
    canSwap,
    canonicalMint: canonicalMint,
    wrappedMint: new PublicKey(wormholeMint),
    canonicalData: canonicalData,
    wrappedData: new PublicKey(wormholeData),
    sourceTokenAccount: canonicalTokenAccount,
    destinationTokenAccount: wormholeTokenAccount,
    destinationAmount: destAmount,
    wallet,
    connection,
  });

  await connection.confirmTransaction(tx);

  console.log(
    `${destAmount
      .div(ten.pow(decimals))
      .toNumber()} of ${canonicalMint} swapped for ${wormholeMint} sent to ${wormholeTokenAccount.toBase58()} `
  );
  console.log(`tx sig = ${tx}`);
};
