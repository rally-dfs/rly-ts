import {
    canonicalSwapProgram,
    initializeCanonicalToken,
    initializeWrappedToken,
    swapCanonicalForWrapped,
    swapWrappedForCanonical,
    createToken,
} from "../src"
import { web3, Provider, BN } from "@project-serum/anchor"
import assert from 'assert';
import { NodeWallet } from "@metaplex/js";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
const { Keypair, Connection, clusterApiUrl, LAMPORTS_PER_SOL, } = web3;



describe('canonical swap', () => {

    let provider;
    let wallet;
    let connection;
    let txSig;
    let canonicalMint;
    let tokenMint;
    let canonicalData;
    let canonicalTokenAccount;
    let wrappedMint;
    let wrappedData;
    let wrappedTokenAccount;
    const initialCanSupply = new BN(0);
    const initalWrappedSupply = new BN(10_000_000);
    const name = "TestToken";
    const symbol = "TKNSYMBL";
    const decimals = 9

    before(async () => {
        const walletKeyPair = Keypair.generate();
        canonicalData = Keypair.generate();
        wrappedData = Keypair.generate();
        provider = new Provider(new Connection(clusterApiUrl("devnet")), new NodeWallet(walletKeyPair), {});
        ({ connection, wallet } = provider);
        await connection.confirmTransaction(await connection.requestAirdrop(wallet.publicKey, LAMPORTS_PER_SOL))
    })

    it('it should get an instance of the swap program', async () => {

        const programName = 'canonical_swap'
        const { idl } = await canonicalSwapProgram(provider);
        assert.strictEqual(idl.name, programName);

    })

    it('it should initialize a canonical token', async () => {

        const canSwap = await canonicalSwapProgram(provider);
        ({ tx: txSig, tokenMint: canonicalMint, tokenAccount: canonicalTokenAccount } = await createToken({ initialSupply: initialCanSupply, tokenData: { name, symbol, decimals }, connection, wallet }));

        await connection.confirmTransaction(txSig)

        canonicalMint = new Token(connection, canonicalMint, TOKEN_PROGRAM_ID, wallet)

        await initializeCanonicalToken({
            canSwap,
            canonicalMint: canonicalMint.publicKey,
            canonicalData,
            canonicalAuthority: wallet.publicKey,
            connection,
            wallet
        });

    })

    it('it should initialize a wrapped token', async () => {

        const canSwap = await canonicalSwapProgram(provider);
        ({ tx: txSig, tokenMint: wrappedMint, tokenAccount: wrappedTokenAccount } = await createToken({ initialSupply: initalWrappedSupply, tokenData: { name, symbol, decimals }, connection, wallet }));
        await connection.confirmTransaction(txSig)

        wrappedMint = new Token(connection, wrappedMint, TOKEN_PROGRAM_ID, wallet)

        await initializeWrappedToken({ canSwap, wrappedMint: wrappedMint.publicKey, wrappedData, canonicalMint: canonicalMint.publicKey, canonicalData: canonicalData.publicKey, canonicalAuthority: wallet.payer, connection, wallet });

    })

    it('it should swap wrapped token for canonical token', async () => {

        const canSwap = await canonicalSwapProgram(provider);

        const tx = await swapWrappedForCanonical({
            canSwap,
            canonicalMint: canonicalMint.publicKey,
            wrappedMint: wrappedMint.publicKey,
            canonicalData: canonicalData.publicKey,
            wrappedData: wrappedData.publicKey,
            sourceTokenAccount: wrappedTokenAccount,
            destinationTokenAccount: canonicalTokenAccount,
            destinationAmount: new BN(100),
            wallet,
            connection
        })

        await connection.confirmTransaction(tx)

        const destAccountInfo = await canonicalMint.getAccountInfo(canonicalTokenAccount)
        assert.ok(destAccountInfo.amount.eq(new BN(100)));

    })


    it('it should swap canonical token for wrapped token', async () => {

        const canSwap = await canonicalSwapProgram(provider);

        const tx = await swapCanonicalForWrapped({
            canSwap,
            canonicalMint: canonicalMint.publicKey,
            wrappedMint: wrappedMint.publicKey,
            canonicalData: canonicalData.publicKey,
            wrappedData: wrappedData.publicKey,
            sourceTokenAccount: canonicalTokenAccount,
            destinationTokenAccount: wrappedTokenAccount,
            destinationAmount: new BN(100),
            wallet,
            connection
        })

        await connection.confirmTransaction(tx);

        const destAccountInfo = await canonicalMint.getAccountInfo(canonicalTokenAccount)
        assert.ok(destAccountInfo.amount.eq(new BN(0)));

    })



})