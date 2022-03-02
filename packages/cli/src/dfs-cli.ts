#! /usr/bin/env node

import { web3, BN } from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID, Token } from '@solana/spl-token';
import { NodeWallet } from '@metaplex/js';
import { program } from 'commander';
program.version('1.0.5');
import {
    addMetadata,
    canonicalSwapProgram,
    createToken,
    getMetadata,
    getMintInfo,
    swapWrappedForCanonical,
    swapCanonicalForWrapped,
    initializeLinearPriceCurve,
    estimateSwap,
    executeSwap,
    tokenSwapProgram,
    getTokenSwapInfo,
} from 'dfs-js';


import { loadKeypair, getProvider, getOrCreateAssociatedAccount } from "./utils/utils"

const { Connection, clusterApiUrl, PublicKey, Keypair } = web3;


const canonicalMint = new PublicKey(
    "RLYv2ubRMDLcGG2UyvPmnPmkfuQTsMbg4Jtygc7dmnq"
);

const canonicalData = new PublicKey(
    "4wkz5UF7ziY3Kuz1vxkZBakcZrRoTfup4XPASdhDfnpk"
);

const wormholeMint = new PublicKey(
    "6Y7LNYkHiJHSH8zR2HvZQzXD3QA9yFw64tyMHxBxDRe4"
);

const wormholeData = new PublicKey(
    "BuvUZWrTnrBkacCikXsoGW1zA1yMt7D1okq3ZDJrDft8"
);


const ten = new BN(10);

// create fungible SPL token with metadata + initial supply


program
    .command('create-token')
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
    .requiredOption('-n, --name <string>', 'token name')
    .requiredOption('-s, --symbol <string>', 'token symbol')
    .option('-d, --dec <number>', 'token decimals', '9')
    .requiredOption('--supply <number>', 'initial supply (integer value)')
    .action(async (options) => {

        // get values from options

        const { env, keypair, name, symbol } = options;
        let { supply, dec } = options;
        const ten = new BN(10)
        dec = new BN(dec)
        supply = new BN(supply)

        //convert to decimal units
        supply = supply.mul(ten.pow(dec))

        // connect to cluster and load wallet
        const connection = new Connection(clusterApiUrl(env))
        const wallet = new NodeWallet(loadKeypair(keypair))

        // create token
        const { tx, tokenMint, tokenAccount } = await createToken({
            initialSupply: supply,
            tokenData: { name, symbol, decimals: dec },
            connection,
            wallet
        })

        // wait for tx confirmation
        await connection.confirmTransaction(tx)

        console.log(`${name} created, token mint = ${tokenMint}, associated token account = ${tokenAccount}`)
    });


// add metadata to existing fungible token mint 

program
    .command('add-metadata')
    .argument('<mint>', 'token mint')
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
    .requiredOption('-n, --name <string>', 'token name')
    .requiredOption('-s, --symbol <string>', 'token symbol')
    .action(async (mint, options) => {

        // get values from options
        const { env, keypair, name, symbol } = options;

        // connect to cluster and load wallet
        const connection = new Connection(clusterApiUrl(env))
        const wallet = new NodeWallet(loadKeypair(keypair))
        const { payer } = wallet;

        // init token instance
        const tokenMint = new Token(connection, new PublicKey(mint), TOKEN_PROGRAM_ID, payer);

        //add metdata to token
        const tx = await addMetadata({
            tokenMint,
            tokenData: { name, symbol, decimals: null },
            connection,
            wallet
        })

        console.log(`metadata successfully added to ${mint}`)
        console.log(`tx hash = ${tx}`)

    });

// get token info and metadata

program
    .command('get-token-info')
    .argument('<mint>', 'token mint')
    .option(
        '-e, --env <string>',
        'Solana cluster env name',
        'devnet',
    )
    .action(async (mint, options) => {

        // get values from options

        const { env } = options;

        // connect to cluster and load wallet
        const connection = new Connection(clusterApiUrl(env))
        const mintInfo = await getMintInfo({ tokenMint: new PublicKey(mint), connection })
        const data = await getMetadata({ tokenMint: new PublicKey(mint), connection })
        console.log("mint authority = ", mintInfo.mintAuthority.toBase58());
        console.log("supply = ", mintInfo.supply.toNumber());
        console.log("name = ", data.name);
        console.log("symbol = ", data.symbol);
    });


program
    .command('get-balance-canonical')
    .requiredOption(
        '-k, --keypair <path>',
        `Solana wallet location`,
        '--keypair not provided',
    )
    .action(async (options) => {

        const { keypair } = options;
        const { wallet, connection } = getProvider(keypair, 'mainnet-beta')
        const { payer } = wallet;

        //decimals of destination-

        const canv1 = new Token(connection, new PublicKey(canonicalMint), TOKEN_PROGRAM_ID, payer);
        const { decimals } = await canv1.getMintInfo()
        const associatedTokenAcct = await canv1.getOrCreateAssociatedAccountInfo(wallet.publicKey);
        const { amount } = await canv1.getAccountInfo(associatedTokenAcct.address);

        console.log(`balance = ${amount.div(ten.pow(new BN(decimals))).toNumber()} in ${associatedTokenAcct.address}`);

    });


program
    .command('get-balance-wormhole')
    .requiredOption(
        '-k, --keypair <path>',
        `Solana wallet location`,
        '--keypair not provided',
    )
    .action(async (options) => {

        const { keypair } = options;
        const { wallet, connection } = getProvider(keypair, 'mainnet-beta')
        const { payer } = wallet;

        const whv2 = new Token(connection, new PublicKey(wormholeMint), TOKEN_PROGRAM_ID, payer);
        const { decimals } = await whv2.getMintInfo()
        const associatedTokenAcct = await whv2.getOrCreateAssociatedAccountInfo(wallet.publicKey);
        const { amount } = await whv2.getAccountInfo(associatedTokenAcct.address);


        console.log(`balance = ${amount.div(ten.pow(new BN(decimals))).toNumber()} in ${associatedTokenAcct.address}`);

    });


program
    .command('swap-canonical-wormhole')
    .requiredOption(
        '-a, --amount <string>',
        'amount',
    )
    .requiredOption(
        '-k, --keypair <path>',
        `Solana wallet location`,
        '--keypair not provided',
    )
    .option(
        '-w, --wormhole_token_account <string>',
        'destination account (if not included uses associated token acct)',
    )
    .option(
        '-c, --canonical_token_account <string>',
        'destination account (if not included uses associated token acct)',
    )
    .action(async options => {

        const { env, keypair, wormhole_token_account, canonical_token_account } = options;
        let { amount } = options;
        const { provider, wallet, connection } = getProvider(keypair, 'mainnet-beta')
        const { payer } = wallet;
        const canSwap = await canonicalSwapProgram(provider);


        let { decimals } = await canSwap.account.wrappedData.fetch(wormholeData)

        const ten = new BN(10)
        decimals = new BN(decimals)
        let destAmount = new BN(amount)

        //convert to decimal units
        destAmount = destAmount.mul(ten.pow(decimals))

        const wormholeToken = new Token(connection, new PublicKey(wormholeMint), TOKEN_PROGRAM_ID, payer)
        const canonicalToken = new Token(connection, new PublicKey(canonicalMint), TOKEN_PROGRAM_ID, payer)

        const { decimals: canDec } = await canonicalToken.getMintInfo()

        const wormholeTokenAccount = wormhole_token_account ? new PublicKey(wormhole_token_account) : await getOrCreateAssociatedAccount(wormholeToken, wallet.payer.publicKey);
        const canonicalTokenAccount = canonical_token_account ? new PublicKey(canonical_token_account) : await getOrCreateAssociatedAccount(canonicalToken, wallet.payer.publicKey);

        let { amount: canBalance } = await canonicalToken.getAccountInfo(canonicalTokenAccount);

        const balance = canBalance.div(ten.pow(new BN(canDec))).toNumber();

        if (balance < Number(amount)) {

            return console.log(`insufficent funds, your canonical $RLY balance is currently ${balance}`)

        }

        const tx = await swapCanonicalForWrapped({
            canSwap,
            canonicalMint: canonicalMint,
            wrappedMint: wormholeMint,
            canonicalData: canonicalData,
            wrappedData: wormholeData,
            sourceTokenAccount: canonicalTokenAccount,
            destinationTokenAccount: wormholeTokenAccount,
            destinationAmount: destAmount,
            wallet,
            connection
        })

        console.log(tx)

        await connection.confirmTransaction(tx)

        console.log(`${destAmount.div(ten.pow(decimals)).toNumber()} of ${canonicalMint} swapped for ${wormholeMint} sent to ${wormholeTokenAccount.toBase58()} `)

    });


program
    .command('swap-wormhole-canonical')
    .option(
        '-a, --amount <string>',
        'amount',
    )
    .option(
        '-w, --wormhole_token_account <string>',
        'destination account (if not included uses associated token acct)',
    )
    .option(
        '-c, --canonical_token_account <string>',
        'destination account (if not included uses associated token acct)',
    )
    .requiredOption(
        '-k, --keypair <path>',
        `Solana wallet location`,
        '--keypair not provided',
    )
    .action(async options => {

        const { keypair, wormhole_token_account, canonical_token_account } = options;
        let { amount } = options;
        const { provider, wallet, connection } = getProvider(keypair, 'mainnet-beta')
        const { payer } = wallet;
        const canSwap = await canonicalSwapProgram(provider);


        let { decimals } = await canSwap.account.canonicalData.fetch(canonicalData)

        const ten = new BN(10)
        decimals = new BN(decimals)
        let destAmount = new BN(amount)

        //convert to decimal units
        destAmount = destAmount.mul(ten.pow(decimals))

        //decimals of destination-

        const wormholeToken = new Token(connection, new PublicKey(wormholeMint), TOKEN_PROGRAM_ID, payer)
        const canonicalToken = new Token(connection, new PublicKey(canonicalMint), TOKEN_PROGRAM_ID, payer)

        const { decimals: wormDec } = await wormholeToken.getMintInfo()

        const wormholeTokenAccount = wormhole_token_account ? new PublicKey(wormhole_token_account) : await getOrCreateAssociatedAccount(wormholeToken, wallet.payer.publicKey);
        const canonicalTokenAccount = canonical_token_account ? new PublicKey(canonical_token_account) : await getOrCreateAssociatedAccount(canonicalToken, wallet.payer.publicKey);


        let { amount: wormBalance } = await wormholeToken.getAccountInfo(wormholeTokenAccount);

        const balance = wormBalance.div(ten.pow(new BN(wormDec))).toNumber();

        if (balance < Number(amount)) {
            return console.log(`insufficent funds, your wormhole $RLY balance is currently ${balance} `)
        }

        const tx = await swapWrappedForCanonical({
            canSwap,
            canonicalMint: canonicalMint,
            wrappedMint: wormholeMint,
            canonicalData: canonicalData,
            wrappedData: wormholeData,
            sourceTokenAccount: wormholeTokenAccount,
            destinationTokenAccount: canonicalTokenAccount,
            destinationAmount: destAmount,
            wallet,
            connection
        })

        console.log(tx)

        await connection.confirmTransaction(tx)

        console.log(`${destAmount.div(ten.pow(decimals)).toNumber()} of ${wormholeMint} swapped for ${canonicalMint} sent to ${canonicalTokenAccount.toBase58()} `)

    });

program
    .command('tbc-init')
    .argument('<token_a>', 'token A')
    .argument('<token_b>', 'token B')
    .argument('<token_b_liquidity', 'token B liquidity')
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
    .requiredOption(
        '--slope_numerator <string>',
        'slope numerator',
    )
    .requiredOption(
        '--slope_denominator <string>',
        'slope denominator',
    )
    .requiredOption(
        '--init_price_a_numerator <string>',
        'initial price token A',
    )
    .requiredOption(
        '--init_price_a_denominator <string>',
        'initial price token B',
    )
    .action(async (token_a, token_b, token_b_liquidity, options) => {

        const { env, keypair, slope_numerator, slope_denominator, init_price_a_numerator, init_price_a_denominator } = options;


        const { provider, wallet, connection } = getProvider(keypair, env)
        const { payer } = wallet
        const tokenSwap = await tokenSwapProgram(provider);

        const slopeDenominator = new BN(slope_denominator);
        const slopeNumerator = new BN(slope_numerator);
        const initialTokenAPriceNumerator = new BN(init_price_a_numerator);
        const initialTokenAPriceDenominator = new BN(init_price_a_denominator);
        const initialTokenBLiquidity = new BN(token_b_liquidity);

        //convert numbers to deimal values 

        const tokenSwapInfo = Keypair.generate();

        const tokenA = new Token(connection, new PublicKey(token_a), TOKEN_PROGRAM_ID, payer);
        const tokenB = new Token(connection, new PublicKey(token_b), TOKEN_PROGRAM_ID, payer);

        const callerTokenBAccount = await getOrCreateAssociatedAccount(tokenB, payer.publicKey);

        const { tx, destinationAccount } = await initializeLinearPriceCurve({
            tokenSwap,
            slopeNumerator,
            slopeDenominator,
            initialTokenAPriceNumerator,
            initialTokenAPriceDenominator,
            callerTokenBAccount,
            tokenSwapInfo,
            tokenA: tokenA.publicKey,
            tokenB: tokenB.publicKey,
            wallet,
            connection,
            initialTokenBLiquidity
        })

        await connection.confirmTransaction(tx)

        const data = await getTokenSwapInfo(provider, tokenSwapInfo.publicKey, tokenSwap.programId);
        const poolToken = new Token(connection, new PublicKey(data.poolToken), TOKEN_PROGRAM_ID, payer)
        const feeAccount = data.feeAccount;
        const tokenATokenAccount = data.tokenAccountA;
        const tokenBTokenAccount = data.tokenAccountB;


        console.log('tcb succesfully initalized');
        console.log('new pool public key', tokenSwapInfo.publicKey.toBase58());
        console.log('swap token account A', tokenATokenAccount.toBase58());
        console.log('swap token account B', tokenBTokenAccount.toBase58());
        console.log('pool token public key', poolToken.publicKey.toBase58());
        console.log('fee account public key', feeAccount.toBase58());
        console.log('initial pool token deposit token account', destinationAccount.publicKey.toBase58());

    });


program
    .command('tbc-swap-estimate')
    .argument('<swap>', 'swap')
    .argument('<token_a>', 'token A')
    .argument('<token_b>', 'token B')
    .argument('<amount>', 'amount of token a to swap')
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
    .action(async (swap, token_a, token_b, amount, options) => {

        const { env, keypair, } = options;


        const { provider, wallet, connection } = getProvider(keypair, env)
        const { payer } = wallet;
        const tokenSwap = await tokenSwapProgram(provider);

        const tokenAAmount = new BN(amount);
        const amountOut = new BN(0)


        const tokenSwapInfo = new PublicKey(swap);

        const tokenA = new Token(connection, new PublicKey(token_a), TOKEN_PROGRAM_ID, payer);
        const tokenB = new Token(connection, new PublicKey(token_b), TOKEN_PROGRAM_ID, payer);

        const [SwapAuthorityPDA] =
            await PublicKey.findProgramAddress(
                [tokenSwapInfo.toBuffer()],
                tokenSwap.programId
            );

        const swapData = await getTokenSwapInfo(provider, tokenSwapInfo, tokenSwap.programId);

        const callerTokenAAccount = await getOrCreateAssociatedAccount(tokenA, payer.publicKey);
        const callerTokenBAccount = await getOrCreateAssociatedAccount(tokenB, payer.publicKey);

        const { amountTokenAPostSwap, amountTokenBPostSwap } = await estimateSwap({
            tokenSwap,
            tokenSwapInfo,
            amountIn: tokenAAmount,
            amountOut,
            userTransferAuthority: payer.publicKey,
            userSourceTokenAccount: callerTokenAAccount,
            userDestinationTokenAccount: callerTokenBAccount,
            swapSourceTokenAccount: swapData.tokenAccountA,
            swapDestinationTokenAccount: swapData.tokenAccountB,
            poolMintAccount: swapData.poolToken,
            poolFeeAccount: swapData.feeAccount,
            wallet,
            connection
        })

        console.log(`estimated amount token A = ${amountTokenAPostSwap}`);
        console.log(`estimated amount token B = ${amountTokenBPostSwap}`);
    });


program
    .command('tbc-swap')
    .argument('<swap>', 'swap')
    .argument('<token_a>', 'token A')
    .argument('<token_b>', 'token B')
    .argument('<amount>', 'amount of token a to swap')
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
    .action(async (swap, token_a, token_b, amount, options) => {

        const { env, keypair, } = options;


        const { provider, wallet, connection } = getProvider(keypair, env)
        const { payer } = wallet;
        const tokenSwap = await tokenSwapProgram(provider);

        const tokenAAmount = new BN(amount);
        const amountOut = new BN(0)


        const tokenSwapInfo = new PublicKey(swap);

        const tokenA = new Token(connection, new PublicKey(token_a), TOKEN_PROGRAM_ID, payer);
        const tokenB = new Token(connection, new PublicKey(token_b), TOKEN_PROGRAM_ID, payer);

        const [SwapAuthorityPDA] =
            await PublicKey.findProgramAddress(
                [tokenSwapInfo.toBuffer()],
                tokenSwap.programId
            );

        const swapData = await getTokenSwapInfo(provider, tokenSwapInfo, tokenSwap.programId);

        const callerTokenAAccount = await getOrCreateAssociatedAccount(tokenA, payer.publicKey);
        const callerTokenBAccount = await getOrCreateAssociatedAccount(tokenB, payer.publicKey);

        const tx = await executeSwap({
            tokenSwap,
            tokenSwapInfo,
            amountIn: tokenAAmount,
            amountOut,
            userTransferAuthority: payer.publicKey,
            userSourceTokenAccount: callerTokenAAccount,
            userDestinationTokenAccount: callerTokenBAccount,
            swapSourceTokenAccount: swapData.tokenAccountA,
            swapDestinationTokenAccount: swapData.tokenAccountB,
            poolMintAccount: swapData.poolToken,
            poolFeeAccount: swapData.feeAccount,
            wallet,
            connection
        })

        await connection.confirmTransaction(tx)

        console.log('swap executed successfully');
    });

program.parse(process.argv);

