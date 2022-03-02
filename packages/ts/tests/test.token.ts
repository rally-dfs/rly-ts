import { web3, BN, Provider } from "@project-serum/anchor"
import assert from 'assert';
import { Token, TOKEN_PROGRAM_ID, u64 } from '@solana/spl-token';
import { NodeWallet } from "@metaplex/js";
import { addMetadata, createToken, getMetadata } from "../src"
const { Keypair, Connection, clusterApiUrl, LAMPORTS_PER_SOL } = web3;


describe('spl token', () => {

    let wallet;
    let connection;
    const initialSupply = new BN(1_000_000);
    const name = "TestToken";
    const symbol = "TKNSYMBL";
    const decimals = 9

    before(async () => {
        const walletKeyPair = Keypair.generate();
        connection = new Connection(clusterApiUrl("devnet"))
        wallet = new NodeWallet(walletKeyPair)
        await connection.confirmTransaction(await connection.requestAirdrop(wallet.publicKey, LAMPORTS_PER_SOL))
    })


    it('should create a new spl token with metadata', async () => {

        const { tx, tokenMint } = await createToken({
            initialSupply,
            tokenData: { name, symbol, decimals },
            connection,
            wallet
        })

        await connection.confirmTransaction(tx)
        const data = await getMetadata({ tokenMint, connection })
        assert.strictEqual(data.name, name);
        assert.strictEqual(data.symbol, symbol);

    })

    it('should add metadata to an existing fungible token mint', async () => {

        const { payer } = wallet;

        const tokenMint = await Token.createMint(
            connection,
            payer,
            payer.publicKey,
            null,
            9,
            TOKEN_PROGRAM_ID
        );

        const tokenAccount = await tokenMint.createAssociatedTokenAccount(wallet.publicKey);


        await tokenMint.mintTo(
            tokenAccount,
            wallet.publicKey,
            [],
            new u64(initialSupply.toString())
        )


        const tx = await addMetadata({
            tokenMint,
            tokenData: { name, symbol, decimals },
            connection,
            wallet
        })

        await connection.confirmTransaction(tx)
        const data = await getMetadata({ tokenMint: tokenMint.publicKey, connection })
        assert.strictEqual(data.name, name);
        assert.strictEqual(data.symbol, symbol);

    })

})