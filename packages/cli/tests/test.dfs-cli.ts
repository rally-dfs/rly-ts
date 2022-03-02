import assert from 'assert';
import { execSync } from 'child_process';
import { web3, BN } from "@project-serum/anchor"
import { NodeWallet } from "@metaplex/js";
import { TOKEN_PROGRAM_ID, Token } from '@solana/spl-token';

import { loadKeypair } from "../src/utils/utils"
const { Keypair, Connection, clusterApiUrl } = web3;

const test = (command, args) => {
    return execSync(`npx ts-node src/dfs-cli.ts ${command} ${args}`).toString();
};


describe("dfs-cli", () => {

    let connection;
    let wallet;
    let tokenA;
    let tokenB;
    let callerTokenBAccount;
    let callerTokenAAccount;
    const initialTokenBLiquidity = new BN(500 * 10 ** 8);
    const initialTokenALiquidity = new BN(10000 * 10 ** 8);
    const swapInitAmountTokenA = new BN(2400 * 10 ** 8);
    const decimals = 9;
    let tbcPubKey;

    before(async () => {
        const walletKeyPair = Keypair.generate();
        connection = new Connection(clusterApiUrl("devnet"))
        wallet = new NodeWallet(loadKeypair(process.env.KEYPAIR_DEVNET))

        const { payer } = wallet;

        tokenA = await Token.createMint(
            connection,
            payer,
            payer.publicKey,
            null,
            decimals,
            TOKEN_PROGRAM_ID
        );


        tokenB = await Token.createMint(
            connection,
            payer,
            payer.publicKey,
            null,
            decimals,
            TOKEN_PROGRAM_ID
        );

        callerTokenBAccount = await tokenB.createAssociatedTokenAccount(payer.publicKey);
        callerTokenAAccount = await tokenA.createAssociatedTokenAccount(payer.publicKey);
        await tokenB.mintTo(callerTokenBAccount, payer, [], initialTokenBLiquidity.toNumber());
        await tokenA.mintTo(callerTokenAAccount, payer, [], initialTokenALiquidity.toNumber());
    })
    it("should create a new token", () => {
        const result = test("create-token", `-k ${process.env.KEYPAIR_DEVNET} -n "TestCoin" -s "TC" -d 9 --supply 100000`)
        const resString = result.trim().split(' ')[0];
        assert.strictEqual(resString, "TestCoin");
    });
    it("should add metadata to an existing token", async () => {

        const { payer } = wallet;

        const result = test("add-metadata", `${tokenA.publicKey.toBase58()} -k ${process.env.KEYPAIR_DEVNET} -n "TestCoin" -s "TC"`)
        const resString = result.trim().split(' ')[0];
        const tx = result.trim().split(' ').pop();
        await connection.confirmTransaction(tx);
        assert.strictEqual(resString, 'metadata');
    });
    it("it should get token info", async () => {

        const { payer } = wallet;
        const result = test("get-token-info", `${tokenA.publicKey.toBase58()}`)
        const resString = result.trim().split(' ')[0];
        assert.strictEqual(resString, "mint")
    });
    it("it should get canonical token balance", async () => {
        const { payer } = wallet;
        const result = test("get-balance-canonical", `-k ${process.env.KEYPAIR_MAINNET}`)
    });

    it("it should get wormhole token balance", async () => {
        const { payer } = wallet;
        const result = test("get-balance-wormhole", `-k ${process.env.KEYPAIR_MAINNET}`)
    });
    it("it should swap canonical rally for wormhole rally", async () => {
        const { payer } = wallet;
        const result = test("swap-canonical-wormhole", `-k ${process.env.KEYPAIR_MAINNET} -a 5 `)
    });
    it("it should swap wormhole rally for canonical rally", async () => {
        const { payer } = wallet;
        const result = test("swap-wormhole-canonical", `-k ${process.env.KEYPAIR_MAINNET} -a 5 `)
    });
    it("it should initialize a tbc", async () => {
        const { payer } = wallet;
        const result = test("tbc-init", `${tokenA.publicKey.toBase58()} ${tokenB.publicKey.toBase58()} ${initialTokenBLiquidity.toNumber()} -k ${process.env.KEYPAIR_DEVNET} --slope_numerator 1 --slope_denominator 200000000 --init_price_a_numerator 50 --init_price_a_denominator 1`)
        tbcPubKey = result.trim().split(/\s+/)[7];
    });
    it("it should estimate swap on tbc", async () => {
        const { payer } = wallet;
        const result = test("tbc-swap-estimate", `${tbcPubKey} ${tokenA.publicKey.toBase58()} ${tokenB.publicKey.toBase58()} ${swapInitAmountTokenA.toNumber()} -k ${process.env.KEYPAIR_DEVNET}`)
    });
    it("it should execute swap on tbc", async () => {
        const { payer } = wallet;
        const result = test("tbc-swap", `${tbcPubKey} ${tokenA.publicKey.toBase58()} ${tokenB.publicKey.toBase58()} ${swapInitAmountTokenA.toNumber()} -k ${process.env.KEYPAIR_DEVNET}`)
    });

});