import { config } from "../../config";
import { BN, Provider, Wallet, web3 } from "@project-serum/anchor";
import * as BufferLayout from "@solana/buffer-layout";
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import {
  u64,
  AccountLayout,
  TOKEN_PROGRAM_ID,
  MintLayout,
  Token,
} from "@solana/spl-token";
import { Connection } from "@metaplex/js";
const { PublicKey, SystemProgram, Keypair, sendAndConfirmRawTransaction } =
  web3;

const {
  accountLayout: { SWAP_ACCOUNT_SPACE },
} = config;

export const sRLY_PUBKEY = new PublicKey(
  "RLYv2ubRMDLcGG2UyvPmnPmkfuQTsMbg4Jtygc7dmnq"
);

export const getOrCreateAssociatedAccount = async (
  token: Token,
  pubKey: web3.PublicKey
) => {
  const accountInfo = await token.getOrCreateAssociatedAccountInfo(pubKey);
  return accountInfo.address;
};

export const createSwapInfoAccount = async (
  provider: Provider,
  fromPubkey: web3.PublicKey,
  programId: web3.PublicKey
) => {
  // Generate new keypair

  const newAccount = web3.Keypair.generate();

  // Create account transaction.
  const tx = new web3.Transaction();
  tx.add(
    web3.SystemProgram.createAccount({
      fromPubkey: fromPubkey,
      newAccountPubkey: newAccount.publicKey,
      space: SWAP_ACCOUNT_SPACE,
      lamports: await provider.connection.getMinimumBalanceForRentExemption(
        SWAP_ACCOUNT_SPACE
      ),
      programId,
    })
  );
  await provider.send(tx, [newAccount]);

  return newAccount;
};

const publicKeyLayout = (property: string = "publicKey"): any => {
  return BufferLayout.blob(32, property);
};

const uint64Layout = (property: string = "uint64"): any => {
  return BufferLayout.blob(8, property);
};

const loadAccount = async (
  connection: web3.Connection,
  address: web3.PublicKey,
  programId: web3.PublicKey
) => {
  const accountInfo = await connection.getAccountInfo(address);
  if (accountInfo === null) {
    throw new Error("Failed to find account");
  }

  if (!accountInfo.owner.equals(programId)) {
    throw new Error(`Invalid owner: ${JSON.stringify(accountInfo.owner)}`);
  }
  return Buffer.from(accountInfo.data);
};

const TokenSwapLayout = BufferLayout.struct([
  BufferLayout.u8("version"),
  BufferLayout.u8("isInitialized"),
  BufferLayout.u8("bumpSeed"),
  publicKeyLayout("tokenProgramId"),
  publicKeyLayout("tokenAccountA"),
  publicKeyLayout("tokenAccountB"),
  publicKeyLayout("tokenPool"),
  publicKeyLayout("mintA"),
  publicKeyLayout("mintB"),
  publicKeyLayout("feeAccount"),
  uint64Layout("tradeFeeNumerator"),
  uint64Layout("tradeFeeDenominator"),
  uint64Layout("ownerTradeFeeNumerator"),
  uint64Layout("ownerTradeFeeDenominator"),
  uint64Layout("ownerWithdrawFeeNumerator"),
  uint64Layout("ownerWithdrawFeeDenominator"),
  uint64Layout("hostFeeNumerator"),
  uint64Layout("hostFeeDenominator"),
  BufferLayout.u8("curveType"),
  BufferLayout.blob(32, "curveParameters"),
]);

export class Numberu64 extends BN {
  toBuffer(): Buffer {
    const a = super.toArray().reverse();
    const b = Buffer.from(a);
    if (b.length === 8) {
      return b;
    }

    const zeroPad = Buffer.alloc(8);
    b.copy(zeroPad);
    return zeroPad;
  }

  static fromBuffer(buffer: Buffer): Numberu64 {
    return new Numberu64(
      [...buffer]
        .reverse()
        .map((i) => `00${i.toString(16)}`.slice(-2))
        .join(""),
      16
    );
  }
}

export const accountInfoFromSim = async (account: any) => {
  let data = account.data;
  data = Buffer.from(data[0], data[1]);
  const accountInfo = AccountLayout.decode(data);
  accountInfo.mint = new PublicKey(accountInfo.mint);
  accountInfo.owner = new PublicKey(accountInfo.owner);
  accountInfo.amount = u64.fromBuffer(accountInfo.amount);
  return accountInfo;
};

export const getTokenAccountInfo = async (
  connection: web3.Connection,
  address: web3.PublicKey
) => {
  const { data } = await connection.getAccountInfo(address);
  const accountInfo = AccountLayout.decode(data);
  accountInfo.mint = new PublicKey(accountInfo.mint);
  accountInfo.owner = new PublicKey(accountInfo.owner);
  accountInfo.amount = u64.fromBuffer(accountInfo.amount);
  return accountInfo;
};

export const getTokenSwapInfo = async (
  connection: web3.Connection,
  swapInfoPubKey: web3.PublicKey,
  programId: web3.PublicKey
) => {
  const data = await loadAccount(connection, swapInfoPubKey, programId);

  const tokenSwapData = TokenSwapLayout.decode(data);
  // @ts-ignore

  if (!tokenSwapData.isInitialized) {
    throw new Error(`Invalid token swap state`);
  }

  // @ts-ignore

  if (!tokenSwapData.isInitialized) {
    throw new Error(`Invalid token swap state`);
  }

  const [authority] = await PublicKey.findProgramAddress(
    [swapInfoPubKey.toBuffer()],
    programId
  );

  // @ts-ignore

  const poolToken = new PublicKey(tokenSwapData.tokenPool);
  // @ts-ignore

  const feeAccount = new PublicKey(tokenSwapData.feeAccount);
  // @ts-ignore

  const tokenAccountA = new PublicKey(tokenSwapData.tokenAccountA);
  // @ts-ignore

  const tokenAccountB = new PublicKey(tokenSwapData.tokenAccountB);
  // @ts-ignore

  const mintA = new PublicKey(tokenSwapData.mintA);
  // @ts-ignore

  const mintB = new PublicKey(tokenSwapData.mintB);
  // @ts-ignore

  const tokenProgramId = new PublicKey(tokenSwapData.tokenProgramId);

  const tradeFeeNumerator = Numberu64.fromBuffer(
    // @ts-ignore

    tokenSwapData.tradeFeeNumerator
  );
  const tradeFeeDenominator = Numberu64.fromBuffer(
    // @ts-ignore

    tokenSwapData.tradeFeeDenominator
  );
  const ownerTradeFeeNumerator = Numberu64.fromBuffer(
    // @ts-ignore

    tokenSwapData.ownerTradeFeeNumerator
  );
  const ownerTradeFeeDenominator = Numberu64.fromBuffer(
    // @ts-ignore

    tokenSwapData.ownerTradeFeeDenominator
  );
  const ownerWithdrawFeeNumerator = Numberu64.fromBuffer(
    // @ts-ignore

    tokenSwapData.ownerWithdrawFeeNumerator
  );
  const ownerWithdrawFeeDenominator = Numberu64.fromBuffer(
    // @ts-ignore

    tokenSwapData.ownerWithdrawFeeDenominator
  );
  // @ts-ignore

  const hostFeeNumerator = Numberu64.fromBuffer(tokenSwapData.hostFeeNumerator);
  const hostFeeDenominator = Numberu64.fromBuffer(
    // @ts-ignore

    tokenSwapData.hostFeeDenominator
  );
  // @ts-ignore

  const curveType = tokenSwapData.curveType;

  return {
    programId,
    tokenProgramId,
    poolToken,
    feeAccount,
    authority,
    tokenAccountA,
    tokenAccountB,
    mintA,
    mintB,
    tradeFeeNumerator,
    tradeFeeDenominator,
    ownerTradeFeeNumerator,
    ownerTradeFeeDenominator,
    ownerWithdrawFeeNumerator,
    ownerWithdrawFeeDenominator,
    hostFeeNumerator,
    hostFeeDenominator,
    curveType,
  };
};

export const generateTokenMintInstructions = async (
  connection: web3.Connection,
  walletPubKey: web3.PublicKey,
  authority: web3.PublicKey,
  freezeAuthority: web3.PublicKey | null,
  decimals: number
) => {
  const tokenMint = Keypair.generate();
  const balanceNeeded = await Token.getMinBalanceRentForExemptMint(connection);

  return {
    tokenMint,
    tokenIx: [
      SystemProgram.createAccount({
        fromPubkey: walletPubKey,
        newAccountPubkey: tokenMint.publicKey,
        lamports: balanceNeeded,
        space: MintLayout.span,
        programId: TOKEN_PROGRAM_ID,
      }),
      Token.createInitMintInstruction(
        TOKEN_PROGRAM_ID,
        tokenMint.publicKey,
        decimals,
        authority,
        freezeAuthority
      ),
    ],
  };
};

export const generateCreateTokenAccountInstructions = async (
  connection: web3.Connection,
  walletPubKey: web3.PublicKey,
  mint: web3.PublicKey,
  owner: web3.PublicKey
) => {
  const tokenAccount = Keypair.generate();
  const balanceNeeded = await Token.getMinBalanceRentForExemptAccount(
    connection
  );

  return {
    tokenAccount,
    accountIx: [
      SystemProgram.createAccount({
        fromPubkey: walletPubKey,
        newAccountPubkey: tokenAccount.publicKey,
        lamports: balanceNeeded,
        space: AccountLayout.span,
        programId: TOKEN_PROGRAM_ID,
      }),
      Token.createInitAccountInstruction(
        TOKEN_PROGRAM_ID,
        mint,
        tokenAccount.publicKey,
        owner
      ),
    ],
  };
};

export const simulateTransaction = async (
  tx: any,
  walletPubKey: web3.PublicKey,
  connection: web3.Connection,
  opts: any,
  includeAccounts: web3.PublicKey[]
) => {
  tx.feePayer = walletPubKey;

  tx.recentBlockhash = (
    await connection.getLatestBlockhash(opts.preflightCommitment)
  ).blockhash;

  const commitment = opts.commitment ?? "processed";

  const message = tx._compile();
  const signData = tx.serializeMessage();
  // @ts-ignore
  const wireTransaction = tx._serialize(signData);
  const encodedTransaction = wireTransaction.toString("base64");
  const config: any = { encoding: "base64", commitment };

  if (includeAccounts) {
    const addresses = (
      Array.isArray(includeAccounts) ? includeAccounts : message.nonProgramIds()
    )
      // @ts-ignore
      .map((key) => key.toBase58());

    config["accounts"] = {
      encoding: "base64",
      addresses,
    };
  }

  const args = [encodedTransaction, config];

  // @ts-ignore
  const res = await connection._rpcRequest("simulateTransaction", args);
  if (res.error) {
    throw new Error("failed to simulate transaction: " + res.error.message);
  }
  return res.result;
};

export const addTxPayerAndHash = async (
  transaction: web3.Transaction,
  connection: web3.Connection,
  payer: web3.PublicKey
) => {
  // add fee payer and recent block hash to tx
  transaction.feePayer = payer;
  transaction.recentBlockhash = (
    await connection.getRecentBlockhash()
  ).blockhash;
};

//partially sign tx with array of Keypairs
export const partialSignTx = async (
  transaction: web3.Transaction,
  signers: web3.Keypair[]
) => {
  // partially sign setup transaction with generated accounts

  transaction.partialSign(...signers);
  return transaction;
};

//sign tx with given wallet and broadcast tx
export const sendTx = async (
  wallet: Wallet,
  connection: Connection,
  transaction: web3.Transaction,
  txOpts: web3.ConfirmOptions
) => {
  //sign tx with wallet
  await wallet.signTransaction(transaction);

  const rawTx = transaction.serialize();

  const { lastValidBlockHeight, signature, recentBlockhash } = transaction;

  const confirmationStrategy: web3.BlockheightBasedTransactionConfimationStrategy =
    {
      lastValidBlockHeight,
      signature: bs58.encode(signature),
      blockhash: recentBlockhash,
    };
  await sendAndConfirmRawTransaction(
    connection,
    rawTx,
    confirmationStrategy,
    txOpts
  );
  return await sendAndConfirmRawTransaction(connection, rawTx, txOpts);
};
