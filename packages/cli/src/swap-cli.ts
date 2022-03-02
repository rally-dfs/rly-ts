import { web3, BN, Provider } from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID, Token } from '@solana/spl-token';
import { NodeWallet } from '@metaplex/js';
import { program } from 'commander';
program.version('0.0.1');
import {
    canonicalSwapProgram,
    initializeCanonicalToken,
    initializeWrappedToken,
    swapWrappedForCanonical,
    swapCanonicalForWrapped
} from "../../ts/src"
import { loadKeypair, getProvider } from "./utils/utils"
const { Connection, clusterApiUrl, Keypair, PublicKey } = web3;

const ten = new BN(10);


program
    .command('init-canonical-token')
    .argument('<mint>', 'canonical mint')

    .option(
        '-e, --env <string>',
        'Solana cluster env name',
        'devnet',
    )
    .requiredOption(
        '-k, --keypair <path>',
        `Solana wallet location`,
        '--keypair not provided',
    )
    .action(async (mint, options) => {

        const { env, keypair } = options;
        const wallet = new NodeWallet(loadKeypair(keypair))
        const connection = new Connection(clusterApiUrl(env));
        const provider = new Provider(connection, wallet, {});
        const canonicalData = Keypair.generate()
        const canSwap = await canonicalSwapProgram(provider);

        const tx = await initializeCanonicalToken({ canSwap, canonicalMint: new PublicKey(mint), canonicalData, canonicalAuthority: wallet.payer });

        await connection.confirmTransaction(tx)

        const cData = await canSwap.account.canonicalData.fetch(canonicalData.publicKey)
        console.log(`canonical token created for mint = ${mint}, canonical data address = ${canonicalData.publicKey.toBase58()}`)

    });


program
    .command('init-wrapped-token')
    .argument('<wrapped_mint>', 'canonical mint')
    .argument('<canonical_mint>', 'canonical mint')
    .argument('<canonical_data>', 'canonical data')
    .option(
        '-ca, --canonical_authority <string>',
        'canonical token authority',
    )
    .option(
        '-e, --env <string>',
        'Solana cluster env name',
        'devnet',
    )
    .requiredOption(
        '-k, --keypair <path>',
        `Solana wallet location`,
        '--keypair not provided',
    )
    .action(async (
        wrapped_mint,
        canonical_mint,
        canonical_data,
        options) => {

        const { env, keypair, canonical_authority } = options;
        const { provider, wallet, connection } = getProvider(keypair, env)
        const wrappedData = Keypair.generate()
        const canSwap = await canonicalSwapProgram(provider);

        const tx = await initializeWrappedToken({
            canSwap,
            wrappedMint: new PublicKey(wrapped_mint),
            wrappedData,
            canonicalMint: new PublicKey(canonical_mint),
            canonicalData: new PublicKey(canonical_data),
            canonicalAuthority: canonical_authority ? new PublicKey(canonical_authority) : wallet.payer
        });

        await connection.confirmTransaction(tx)

        console.log(`wrapped token initialized for ${wrapped_mint}, wrapped data address = ${wrappedData.publicKey.toBase58()}`)

    });


program
    .command('swap-wrapped')
    .argument('<wrapped_mint>', 'wrapped mint')
    .argument('<wrapped_data>', 'wrapped data')
    .argument('wrapped_token_account', "wrapped token account")
    .argument('<canonical_mint>', 'canonical mint')
    .argument('<canonical_data>', 'canonical data')
    .option(
        '-a, --amount <string>',
        'amount',
    )
    .option(
        '-d, --destination_account <string>',
        'destination account',
    )
    .option(
        '-e, --env <string>',
        'Solana cluster env name',
        'devnet',
    )
    .requiredOption(
        '-k, --keypair <path>',
        `Solana wallet location`,
        '--keypair not provided',
    )
    .action(async (
        wrapped_mint,
        wrapped_data,
        wrapped_token_account,
        canonical_mint,
        canonical_data,
        options) => {

        const { env, keypair, destination_account } = options;
        let { amount } = options;
        const { provider, wallet, connection } = getProvider(keypair, env)
        const canSwap = await canonicalSwapProgram(provider);

        let { decimals } = await canSwap.account.canonicalData.fetch(new PublicKey(canonical_data))

        decimals = new BN(decimals)
        amount = new BN(amount)

        //convert to decimal units
        amount = amount.mul(ten.pow(decimals))

        //decimals of destination-

        const canonicalToken = new Token(connection, new PublicKey(canonical_mint), TOKEN_PROGRAM_ID, wallet.payer)
        const canonicalTokenAccount = destination_account ? new PublicKey(destination_account) : await canonicalToken.createAssociatedTokenAccount(wallet.payer.publicKey);

        const tx = await swapWrappedForCanonical({
            canSwap,
            canonicalMint: new PublicKey(canonical_mint),
            wrappedMint: new PublicKey(wrapped_mint),
            canonicalData: new PublicKey(canonical_data),
            wrappedData: new PublicKey(wrapped_data),
            sourceTokenAccount: new PublicKey(wrapped_token_account),
            destinationTokenAccount: canonicalTokenAccount,
            destinationAmount: amount,
            wallet
        })

        await connection.confirmTransaction(tx)

        console.log(`${amount.div(ten.pow(decimals)).toNumber()} of ${wrapped_mint} swapped for ${canonical_mint} sent to ${canonicalTokenAccount.toBase58()}`)

    });

program
    .command('swap-canonical')
    .argument('<wrapped_mint>', 'wrapped mint')
    .argument('<wrapped_data>', 'wrapped data')
    .argument('<canonical_mint>', 'canonical mint')
    .argument('<canonical_data>', 'canonical data')
    .argument('<canonical_token_account>', "canonical token account")
    .option(
        '-a, --amount <string>',
        'amount',
    )
    .option(
        '-d, --destination_account <string>',
        'destination account',
    )
    .option(
        '-e, --env <string>',
        'Solana cluster env name',
        'devnet',
    )
    .requiredOption(
        '-k, --keypair <path>',
        `Solana wallet location`,
        '--keypair not provided',
    )
    .action(async (
        wrapped_mint,
        wrapped_data,
        canonical_mint,
        canonical_data,
        canonical_token_account,
        options) => {

        const { env, keypair, destination_account } = options;
        let { amount } = options;
        const { provider, wallet, connection } = getProvider(keypair, env)
        const canSwap = await canonicalSwapProgram(provider);


        let { decimals } = await canSwap.account.wrappedData.fetch(new PublicKey(wrapped_data))

        decimals = new BN(decimals)
        amount = new BN(amount)

        //convert to decimal units
        amount = amount.mul(ten.pow(decimals))

        //decimals of destination-

        const wrappedToken = new Token(connection, new PublicKey(wrapped_mint), TOKEN_PROGRAM_ID, wallet.payer)
        const wrappedTokenAccount = destination_account ? new PublicKey(destination_account) : await wrappedToken.createAssociatedTokenAccount(wallet.payer.publicKey);

        const tx = await swapCanonicalForWrapped({
            canSwap,
            canonicalMint: new PublicKey(canonical_mint),
            wrappedMint: new PublicKey(wrapped_mint),
            canonicalData: new PublicKey(canonical_data),
            wrappedData: new PublicKey(wrapped_data),
            sourceTokenAccount: new PublicKey(canonical_token_account),
            destinationTokenAccount: wrappedTokenAccount,
            destinationAmount: amount,
            wallet
        })

        await connection.confirmTransaction(tx)

        console.log(`${amount.div(ten.pow(decimals)).toNumber()} of ${canonical_mint} swapped for ${wrapped_mint} sent to ${wrappedTokenAccount.toBase58()}`)

    });