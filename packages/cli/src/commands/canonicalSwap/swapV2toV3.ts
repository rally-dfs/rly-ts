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

export const swapV2toV3Command = async (options) => {
  const { keypair, v2_token_account, v3_token_account } = options;
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

  const v2Mint = new PublicKey(canonicalMintV2);
  const v2Data = new PublicKey(canonicalDataV2);

  const v3Mint = new PublicKey(canonicalMintV3);
  const v3Data = new PublicKey(canonicalDataV3);

  let { decimals } = await canSwap.account.canonicalData.fetch(v3Data);

  const ten = new BN(10);
  decimals = new BN(decimals);
  let destAmount = new BN(amount);

  //convert to decimal units
  destAmount = destAmount.mul(ten.pow(decimals));

  //decimals of destination-

  const v2Token = new Token(
    connection,
    new PublicKey(v2Mint),
    TOKEN_PROGRAM_ID,
    payer
  );
  const v3Token = new Token(
    connection,
    new PublicKey(v3Mint),
    TOKEN_PROGRAM_ID,
    payer
  );

  const { decimals: v2Dec } = await v2Token.getMintInfo();

  const v2TokenAccount = v2_token_account
    ? new PublicKey(v2_token_account)
    : await getOrCreateAssociatedAccount(v2Token, wallet.payer.publicKey);
  const v3TokenAccount = v3_token_account
    ? new PublicKey(v3_token_account)
    : await getOrCreateAssociatedAccount(v3Token, wallet.payer.publicKey);

  let { amount: v2Amount } = await v2Token.getAccountInfo(v2TokenAccount);

  const v2Bal = new BN(v2Amount);

  const balance = v2Bal.div(ten.pow(new BN(v2Dec))).toNumber();

  if (balance < Number(amount)) {
    return console.log(
      `insufficent funds, your wormhole $sRLYv2 balance is currently ${balance} `
    );
  }

  const tx = await swapWrappedForCanonical({
    canSwap,
    canonicalMint: v3Mint,
    wrappedMint: v2Mint,
    canonicalData: v3Data,
    wrappedData: v2Data,
    sourceTokenAccount: v2TokenAccount,
    destinationTokenAccount: v3TokenAccount,
    destinationAmount: destAmount,
    wallet,
    connection,
  });

  await connection.confirmTransaction(tx);

  console.log(
    `${destAmount
      .div(ten.pow(decimals))
      .toNumber()} of ${canonicalMintV2} swapped for ${canonicalMintV3} sent to ${v3TokenAccount.toBase58()} `
  );
  console.log(`tx sig = ${tx}`);
};
