import { Token, TOKEN_PROGRAM_ID, u64, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Wallet } from '@metaplex/js';
import { MetadataDataData, Metadata, CreateMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { TokenData } from '../types';
import { BN, web3, Provider } from "@project-serum/anchor";
import { generateTokenMintInstructions } from '../utils';
const { Transaction, } = web3;


interface createTokenParams {
    initialSupply: BN;
    tokenData: TokenData;
    connection: any;
    wallet: Wallet;
}


export const createToken = async ({ initialSupply, tokenData, connection, wallet } = {} as createTokenParams) => {

    // create token mint 

    const provider = new Provider(connection, wallet, { commitment: "confirmed", preflightCommitment: "processed" });
    const transaction = new Transaction();


    // create mint

    const { tokenIx, tokenMint } = await generateTokenMintInstructions(connection, wallet, wallet.publicKey, wallet.publicKey, tokenData.decimals)

    // create associated account to receive tokens

    const tokenAccount = await Token.getAssociatedTokenAddress(ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, tokenMint.publicKey, wallet.publicKey)
    const associatedAcctIx = await Token.createAssociatedTokenAccountInstruction(ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, tokenMint.publicKey, tokenAccount, wallet.publicKey, wallet.publicKey)

    // send initial supply to token account

    const mintToIx = await Token.createMintToInstruction(TOKEN_PROGRAM_ID, tokenMint.publicKey, tokenAccount, wallet.publicKey, [], new u64(initialSupply.toString()))

    // create metadata obj

    const metadataData = new MetadataDataData({
        name: tokenData.name,
        symbol: tokenData.symbol,
        // values below are only used for NFT metadata
        uri: "",
        sellerFeeBasisPoints: null,
        creators: null,
    });

    // get metadata PDA


    const metadata = await Metadata.getPDA(tokenMint.publicKey)

    // create metadata Tx

    const createMetadataTx = new CreateMetadata(
        { feePayer: wallet.publicKey },
        {
            metadata,
            metadataData,
            updateAuthority: wallet.publicKey,
            mint: tokenMint.publicKey,
            mintAuthority: wallet.publicKey,
        },
    );

    // return tx hash, token mint, token account 

    transaction.add(...tokenIx, associatedAcctIx, mintToIx, createMetadataTx)

    const tx = await provider.send(transaction, [tokenMint])

    return { tx, tokenMint: tokenMint.publicKey, tokenAccount }


}

