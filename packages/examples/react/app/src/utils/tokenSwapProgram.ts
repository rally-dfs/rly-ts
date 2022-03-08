
import * as anchor from "@project-serum/anchor";
import idl from './idl.json';


import { config } from "./config";
const { tokenSwap } = config.programs;
const { web3 } = anchor;


export const tokenSwapProgram = async (provider: anchor.Provider) => {

    // configure anchor client
    anchor.setProvider(provider);

    console.log("tokenswap", tokenSwap)
    console.log("config", config)


    // get program id from config
    const programId = new web3.PublicKey(tokenSwap);

    console.log("program ID", programId.toBase58())

    // return program client
    return new anchor.Program(
        idl as anchor.Idl,
        tokenSwap,
        provider
    )
};