
import * as anchor from "@project-serum/anchor";
import idl from './idl.json';

import { config } from "../../../config";
const { tokenSwap } = config.programs;


export const tokenSwapProgram = async (provider) => {

    // configure anchor client
    anchor.setProvider(provider);

    // get program id from config
    const programId = new anchor.web3.PublicKey(tokenSwap);

    // return program client
    return new anchor.Program(
        idl as anchor.Idl,
        programId,
        provider
    )
};