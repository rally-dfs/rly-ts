import { web3, BN } from "@project-serum/anchor";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
const { PublicKey, Keypair } = web3;
import { getProvider } from "../../utils/utils";

import {
  tokenSwapProgram,
  getOrCreateAssociatedAccount,
  initializeLinearPriceCurve,
  getTokenSwapInfo,
} from "rly-js";

export const initTbcCommand = async (
  token_a,
  token_b,
  token_b_liquidity,
  options
) => {
  const {
    env,
    keypair,
    slope_numerator,
    slope_denominator,
    init_price_a_numerator,
    init_price_a_denominator,
  } = options;

  const { provider, wallet, connection } = getProvider(keypair, env);
  const { payer } = wallet;
  const tokenSwap = await tokenSwapProgram(provider);

  const slopeDenominator = new BN(slope_denominator);
  const slopeNumerator = new BN(slope_numerator);
  const initialTokenAPriceNumerator = new BN(init_price_a_numerator);
  const initialTokenAPriceDenominator = new BN(init_price_a_denominator);
  const initialTokenBLiquidity = new BN(token_b_liquidity);

  //convert numbers to deimal values

  const tokenSwapInfo = Keypair.generate();

  const tokenA = new Token(
    connection,
    new PublicKey(token_a),
    TOKEN_PROGRAM_ID,
    payer
  );
  const tokenB = new Token(
    connection,
    new PublicKey(token_b),
    TOKEN_PROGRAM_ID,
    payer
  );

  const callerTokenBAccount = await getOrCreateAssociatedAccount(
    tokenB,
    payer.publicKey
  );

  const { tx } = await initializeLinearPriceCurve({
    tokenSwap,
    slopeNumerator,
    slopeDenominator,
    initialTokenAPriceNumerator,
    initialTokenAPriceDenominator,
    callerTokenBAccount,
    tokenSwapInfo,
    tokenA: tokenA.publicKey,
    tokenB: tokenB.publicKey,
    poolTokenDecimals: 9,
    wallet,
    connection,
    initialTokenBLiquidity,
  });

  await connection.confirmTransaction(tx);

  const data = await getTokenSwapInfo(
    connection,
    tokenSwapInfo.publicKey,
    tokenSwap.programId
  );
  const poolToken = new Token(
    connection,
    new PublicKey(data.poolToken),
    TOKEN_PROGRAM_ID,
    payer
  );
  const feeAccount = data.feeAccount;
  const tokenATokenAccount = data.tokenAccountA;
  const tokenBTokenAccount = data.tokenAccountB;

  console.log("tcb succesfully initalized");
  console.log("new tbc public key", tokenSwapInfo.publicKey.toBase58());
  console.log("swap token account A", tokenATokenAccount.toBase58());
  console.log("swap token account B", tokenBTokenAccount.toBase58());
  console.log("pool token public key", poolToken.publicKey.toBase58());
  console.log("fee account public key", feeAccount.toBase58());
};
