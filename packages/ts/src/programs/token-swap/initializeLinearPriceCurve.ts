import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Program, web3, BN, Provider } from '@project-serum/anchor';
import { config } from "../../../config";
import { Wallet } from '@metaplex/js';
import { generateTokenMintInstructions, generateCreateTokenAccountInstructions } from '../../utils';

const { accountLayout: { SWAP_ACCOUNT_SPACE } } = config;

const { PublicKey, SystemProgram: { programId }, Transaction } = web3;

interface initializeLinearPriceCurveParams {
    tokenSwap: Program;
    slopeNumerator: BN;
    slopeDenominator: BN;
    initialTokenAPriceNumerator: BN;
    initialTokenAPriceDenominator: BN;
    callerTokenBAccount: web3.PublicKey;
    tokenSwapInfo: any;
    tokenA: web3.PublicKey;
    tokenB: web3.PublicKey;
    wallet: Wallet;
    connection: any;
    initialTokenBLiquidity: BN;
}

export const initializeLinearPriceCurve = async ({
    tokenSwap,
    slopeNumerator,
    slopeDenominator,
    initialTokenAPriceNumerator,
    initialTokenAPriceDenominator,
    callerTokenBAccount,
    tokenSwapInfo,
    tokenA,
    tokenB,
    wallet,
    connection,
    initialTokenBLiquidity

} = {} as initializeLinearPriceCurveParams) => {

    const provider = new Provider(connection, wallet, { commitment: "confirmed", preflightCommitment: "processed" });
    const setupTransaction = new Transaction();
    const intermediateTx = new Transaction();
    const initTbcTransaction = new Transaction();

    // get exepcted swap authority PDA

    const [expectedSwapAuthorityPDA] =
        await PublicKey.findProgramAddress(
            [tokenSwapInfo.publicKey.toBuffer()],
            tokenSwap.programId
        );

    // get create pooltoken mint ix

    const { tokenIx, tokenMint: poolTokenMint } = await generateTokenMintInstructions(connection, wallet, expectedSwapAuthorityPDA, null, 8)


    // get token accounts creat instrucstions for swap pda

    const { tokenAccount: tokenATokenAccount, accountIx: createTokenATokenAccountIx } = await generateCreateTokenAccountInstructions(connection, wallet, tokenA, expectedSwapAuthorityPDA)
    const { tokenAccount: tokenBTokenAccount, accountIx: createTokenBTokenAccountIx } = await generateCreateTokenAccountInstructions(connection, wallet, tokenB, expectedSwapAuthorityPDA)


    const tokenBTransferIx = Token.createTransferInstruction(TOKEN_PROGRAM_ID, callerTokenBAccount, tokenBTokenAccount.publicKey, wallet.publicKey, [], initialTokenBLiquidity.toNumber())

    // create token accounts for fees and pool tokens owned by calling account (can't use associated token account as two accounts req'd)

    const { tokenAccount: feeAccount, accountIx: createFeeAccountIx } = await generateCreateTokenAccountInstructions(connection, wallet, poolTokenMint.publicKey, wallet.publicKey)
    const { tokenAccount: destinationAccount, accountIx: createDestinationAccountIx } = await generateCreateTokenAccountInstructions(connection, wallet, poolTokenMint.publicKey, wallet.publicKey)

    const tokenSwapInfoIx = web3.SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: tokenSwapInfo.publicKey,
        space: SWAP_ACCOUNT_SPACE,
        lamports: await provider.connection.getMinimumBalanceForRentExemption(
            SWAP_ACCOUNT_SPACE
        ),
        programId: tokenSwap.programId
    })

    const initCurveIx = tokenSwap.instruction.initializeLinearPrice(
        slopeNumerator,
        slopeDenominator,
        initialTokenAPriceNumerator,
        initialTokenAPriceDenominator,
        {
            accounts: {
                tokenSwap: tokenSwapInfo.publicKey,
                swapAuthority: expectedSwapAuthorityPDA,
                tokenA: tokenATokenAccount.publicKey,
                tokenB: tokenBTokenAccount.publicKey,
                pool: poolTokenMint.publicKey,
                fee: feeAccount.publicKey,
                destination: destinationAccount.publicKey,
                tokenProgram: TOKEN_PROGRAM_ID,
            }
        }
    );

    setupTransaction.add(
        ...tokenIx,
        ...createTokenATokenAccountIx,
        ...createTokenBTokenAccountIx,
        tokenBTransferIx,
    );

    initTbcTransaction.add(
        ...createFeeAccountIx,
        ...createDestinationAccountIx,
        tokenSwapInfoIx,
        initCurveIx
    )

    const setupTx = await provider.send(setupTransaction, [poolTokenMint, tokenATokenAccount, tokenBTokenAccount])
    await connection.confirmTransaction(setupTx)
    const tx = await provider.send(initTbcTransaction, [tokenSwapInfo, feeAccount, destinationAccount])
    return { tx, setupTx, destinationAccount }

}