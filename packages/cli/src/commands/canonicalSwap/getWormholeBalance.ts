import { web3, BN } from '@project-serum/anchor';
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { getProvider } from "../../utils/utils"
import { config } from '../../utils/config';

const { PublicKey } = web3;


export const getWormholeBalanceCommand = async (options) => {

    const { keypair } = options;
    const { wallet, connection } = getProvider(keypair, 'mainnet-beta')
    const { payer } = wallet;
    const { cswap } = config;

    const ten = new BN(10);

    const whv2 = new Token(connection, new PublicKey(cswap.wormholeMint), TOKEN_PROGRAM_ID, payer);
    const { decimals } = await whv2.getMintInfo()
    const associatedTokenAcct = await whv2.getOrCreateAssociatedAccountInfo(wallet.publicKey);
    const { amount } = await whv2.getAccountInfo(associatedTokenAcct.address);
    const wormBal = new BN(amount);

    console.log(`balance = ${wormBal.div(ten.pow(new BN(decimals))).toNumber()} in ${associatedTokenAcct.address}`);
}