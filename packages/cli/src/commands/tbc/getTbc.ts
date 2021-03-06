import { web3, BN } from "@project-serum/anchor";
const { PublicKey } = web3;
import { getProvider } from "../../utils/utils";

import {
  tokenSwapProgram,
  getMintInfo,
  getTokenAccountInfo,
  getTokenSwapInfo,
} from "rly-js";

export const getTbcCommand = async (tbc, options) => {
  // get values from options

  const { env, keypair } = options;

  // connect to cluster and load wallet
  const { provider, connection } = getProvider(keypair, env);

  const tokenSwap = await tokenSwapProgram(provider);

  //get token swap info
  const swapInfo = await getTokenSwapInfo(
    connection,
    new PublicKey(tbc),
    tokenSwap.programId
  );

  const ten = new BN(10);

  //get token mint data

  const { decimals: tokenBDecimals } = await getMintInfo({
    tokenMint: swapInfo.mintA,
    connection,
  });
  const { decimals: tokenADecimals } = await getMintInfo({
    tokenMint: swapInfo.mintA,
    connection,
  });

  //get token account data
  const tokenAccountAInfo = await getTokenAccountInfo(
    connection,
    swapInfo.tokenAccountA
  );
  const tokenAccountBInfo = await getTokenAccountInfo(
    connection,
    swapInfo.tokenAccountB
  );

  console.log("authority = ", swapInfo.authority.toBase58());
  console.log("token a account = ", swapInfo.tokenAccountA.toBase58());
  console.log("token b account = ", swapInfo.tokenAccountB.toBase58());
  console.log(
    "token account a balance = ",
    tokenAccountAInfo.amount.div(ten.pow(new BN(tokenADecimals))).toNumber()
  );
  console.log(
    "token account b balance = ",
    tokenAccountBInfo.amount.div(ten.pow(new BN(tokenBDecimals))).toNumber()
  );
  console.log("token a mint = ", swapInfo.mintA.toBase58());
  console.log("token b mint = ", swapInfo.mintB.toBase58());
  console.log("trade fee numerator ", swapInfo.tradeFeeNumerator);
  console.log("trade fee denominator", swapInfo.tradeFeeDenominator);
  console.log("owner trade fee numerator", swapInfo.ownerTradeFeeNumerator);
  console.log("owner trade fee denominator", swapInfo.ownerTradeFeeDenominator);
  console.log(
    "owner withdraw fee numerator",
    swapInfo.ownerWithdrawFeeNumerator
  );
  console.log(
    "owner withdraw fee denominator",
    swapInfo.ownerWithdrawFeeDenominator
  );
  console.log("host fee numerator", swapInfo.hostFeeNumerator);
  console.log("host fee denominator", swapInfo.hostFeeDenominator);
};
