import { web3, BN } from '@project-serum/anchor';
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { getProvider } from "../../utils/utils"
import { config } from '../../utils/config';

const { PublicKey } = web3;


export const getCanonicalBalanceCommand = async (options) => {


    const { keypair, version } = options;
    const { wallet, connection } = getProvider(keypair, 'mainnet-beta')
    const { payer } = wallet;
    const { cswap } = config;

    const ten = new BN(10);

    const canonicalMint = new PublicKey(version === '2' ? cswap.canonicalMintV2 : cswap.canonicalMintV3)

    //decimals of destination-

    const canv2 = new Token(connection, new PublicKey(canonicalMint), TOKEN_PROGRAM_ID, payer);
    const { decimals } = await canv2.getMintInfo()
    const associatedTokenAcct = await canv2.getOrCreateAssociatedAccountInfo(wallet.publicKey);
    const { amount } = await canv2.getAccountInfo(associatedTokenAcct.address);

    const canBalance = new BN(amount);

    console.log(`balance = ${canBalance.div(ten.pow(new BN(decimals))).toNumber()} in ${associatedTokenAcct.address}`);
}