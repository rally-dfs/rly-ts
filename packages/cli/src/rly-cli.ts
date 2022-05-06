#! /usr/bin/env node

import { program } from 'commander';
program.version('0.0.6');

import {
    createTokenCommand,
    addMetadataCommand,
    getTokenInfoCommand,
    freezeAccountCommand,
    getCanonicalBalanceCommand,
    getWormholeBalanceCommand,
    swapCanWormholeCommand,
    swapWormholeCanCommand,
    swapV2toV3Command,
    initTbcCommand,
    getTbcCommand,
    estimateSwapCommand,
    executeSwapCommand
} from "./commands"


// token commands

program
    .command('create-token')
    .requiredOption(
        '-k, --keypair <path>',
        `Solana wallet location`,
        '--keypair not provided',
    )
    .requiredOption('-n, --name <string>', 'token name')
    .requiredOption('-s, --symbol <string>', 'token symbol')
    .requiredOption('--supply <number>', 'initial supply (integer value)')
    .option('-d, --dec <number>', 'token decimals', '9')
    .option(
        '--no_freeze_authority',
        'no freeze authority',
    )
    .option(
        '-e, --env <string>',
        'Solana cluster env name',
        'devnet',
    )
    .description('create a new spl token with metadata')
    .action(createTokenCommand);


program
    .command('add-metadata')
    .argument('<mint>', 'token mint')
    .requiredOption(
        '-k, --keypair <path>',
        `Solana wallet location`,
        '--keypair not provided',
    )
    .requiredOption('-n, --name <string>', 'token name')
    .requiredOption('-s, --symbol <string>', 'token symbol')
    .option(
        '-e, --env <string>',
        'Solana cluster env name',
        'devnet',
    )
    .description('add metadata to an existing SPL token')
    .action(addMetadataCommand);


program
    .command('get-token-info')
    .argument('<mint>', 'token mint')
    .description('get information and metadata for a token mint')
    .option(
        '-e, --env <string>',
        'Solana cluster env name',
        'devnet',
    )
    .action(getTokenInfoCommand);

program
    .command('freeze-token-account')
    .argument('<mint>', 'token mint')
    .argument('<token_account>', 'token account')
    .description('for the specified token mint freeze an account')
    .option(
        '-e, --env <string>',
        'Solana cluster env name',
        'devnet',
    ).requiredOption(
        '-k, --keypair <path>',
        `Solana wallet location`,
        '--keypair not provided',
    )
    .action(freezeAccountCommand);


// canonical swap commands


program
    .command('get-balance-canonical')
    .option(
        '-v, --version <number>',
        'canonical token version',
        '3',
    )
    .requiredOption(
        '-k, --keypair <path>',
        `Solana wallet location`,
        '--keypair not provided',
    )
    .description('get sRLY balance in your wallet')
    .action(getCanonicalBalanceCommand);


program
    .command('get-balance-wormhole')
    .requiredOption(
        '-k, --keypair <path>',
        `Solana wallet location`,
        '--keypair not provided',
    )
    .description('get the wormhole RLY balance in your wallet')
    .action(getWormholeBalanceCommand);


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
        '-v, --version <number>',
        'canonical token version',
        '3',
    )
    .option(
        '-w, --wormhole_token_account <string>',
        'source account (if not included uses associated token acct)',
    )
    .option(
        '-c, --canonical_token_account <string>',
        'destination account (if not included uses associated token acct)',
    )
    .description('swap sRLY for wormhole RLY')
    .action(swapCanWormholeCommand);


program
    .command('swap-wormhole-canonical')
    .option(
        '-a, --amount <string>',
        'amount',
    )
    .option(
        '-v, --version <number>',
        'canonical token version',
        '3',
    )
    .option(
        '-w, --wormhole_token_account <string>',
        'source account (if not included uses associated token acct)',
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
    .description('swap wormhole RLY for sRLY')
    .action(swapWormholeCanCommand);

program
    .command('swap-v2-v3')
    .option(
        '-a, --amount <string>',
        'amount',
    )
    .option(
        '-v2, --v2_token_account <string>',
        'source account (if not included uses associated token acct)',
    )
    .option(
        '-v3, --v3_token_account <string>',
        'destination account (if not included uses associated token acct)',
    )
    .requiredOption(
        '-k, --keypair <path>',
        `Solana wallet location`,
        '--keypair not provided',
    )
    .description('convert sRLYv2 to sRLYv3')
    .action(swapV2toV3Command);


// token bonding curve commands

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
    .description('initialize a new token bonding curve with the specified parameters')
    .action(initTbcCommand);


program
    .command('get-tbc')
    .argument('<tbc>', 'tbc pubkey')
    .requiredOption(
        '-k, --keypair <path>',
        `Solana wallet location`,
        '--keypair not provided',
    )
    .option(
        '-e, --env <string>',
        'Solana cluster env name',
        'devnet',
    )
    .description('get information about a deployed token bonding curve')
    .action(getTbcCommand);

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
    .description('estimate the result of swapping two tokens on a given token bonding curve')
    .action(estimateSwapCommand);


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
    .description('swap two tokens on a given token bonding curve')
    .action(executeSwapCommand);

program.parse(process.argv);

