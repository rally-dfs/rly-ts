import { web3, BN, Wallet } from "@project-serum/anchor";
import assert from "assert";
import { Token, TOKEN_PROGRAM_ID, u64 } from "@solana/spl-token";
import { addMetadata, createToken, getMetadata, getMintInfo } from "../src";
const { Keypair, Connection, clusterApiUrl, LAMPORTS_PER_SOL } = web3;

describe("spl token", () => {
  let wallet;
  let connection;
  let tokenMint;
  let tx;
  const initialSupply = new BN(10_000 * 10 ** 9);
  const name = "TestToken";
  const symbol = "TKNSYMBL";
  const decimals = 9;

  before(async () => {
    const walletKeyPair = Keypair.generate();
    const receiver = Keypair.generate();
    connection = new Connection(clusterApiUrl("devnet"));
    wallet = new Wallet(walletKeyPair);
    await connection.confirmTransaction(
      await connection.requestAirdrop(wallet.publicKey, LAMPORTS_PER_SOL)
    );
    await connection.confirmTransaction(
      await connection.requestAirdrop(receiver.publicKey, LAMPORTS_PER_SOL)
    );
  });

  it("should create a new spl token with metadata", async () => {
    ({ tx, tokenMint } = await createToken({
      initialSupply,
      tokenData: {
        name,
        symbol,
        decimals,
        uri: "https://arweave.net:443/fRgc2NeIGpeRcyHQ_cmJE-76AW7jYnTn8kPbiEMXOB",
      },
      connection,
      wallet,
      freezeAuthority: true,
    }));

    await connection.confirmTransaction(tx);
    const data = await getMetadata({ tokenMint, connection });
    const mintInfo = await getMintInfo({ tokenMint, connection });

    assert.strictEqual(
      mintInfo.freezeAuthority.toBase58(),
      wallet.publicKey.toBase58()
    );
    assert.strictEqual(data.name, name);
    assert.strictEqual(data.symbol, symbol);
  });

  it("should create a new spl token with metadata and no freeze authority", async () => {
    ({ tx, tokenMint } = await createToken({
      initialSupply,
      tokenData: {
        name,
        symbol,
        decimals,
        uri: "https://arweave.net:443/fRgc2NeIGpeRcyHQ_cmJE-76AW7jYnTn8kPbiEMXOB",
      },
      connection,
      wallet,
      freezeAuthority: false,
    }));

    await connection.confirmTransaction(tx);
    const data = await getMetadata({ tokenMint, connection });
    const mintInfo = await getMintInfo({ tokenMint, connection });

    assert.strictEqual(mintInfo.freezeAuthority, null);
    assert.strictEqual(data.name, name);
    assert.strictEqual(data.symbol, symbol);
  });

  it("should add metadata to an existing fungible token mint", async () => {
    const { payer } = wallet;

    const tokenMint = await Token.createMint(
      connection,
      payer,
      payer.publicKey,
      null,
      9,
      TOKEN_PROGRAM_ID
    );

    const tokenAccount = await tokenMint.createAssociatedTokenAccount(
      wallet.publicKey
    );

    await tokenMint.mintTo(
      tokenAccount,
      wallet.publicKey,
      [],
      new u64(initialSupply.toString())
    );

    const tx = await addMetadata({
      tokenMint,
      tokenData: {
        name,
        symbol,
        decimals,
        uri: "https://arweave.net:443/fRgc2NeIGpeRcyHQ_cmJE-76AW7jYnTn8kPbiEMXOB",
      },
      connection,
      wallet,
    });

    await connection.confirmTransaction(tx);
    const data = await getMetadata({
      tokenMint: tokenMint.publicKey,
      connection,
    });
    assert.strictEqual(data.name, name);
    assert.strictEqual(data.symbol, symbol);
  });
});
