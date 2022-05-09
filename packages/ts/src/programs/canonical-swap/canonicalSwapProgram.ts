import * as anchor from "@project-serum/anchor";
import idl from "./idl.json";

import { config } from "../../../config";
const { canonicalSwap } = config.programs;

export const canonicalSwapProgram = async (provider: anchor.Provider) => {
  // configure anchor client
  anchor.setProvider(provider);

  // get program id from config
  const programId = new anchor.web3.PublicKey(canonicalSwap);

  // return program client
  return new anchor.Program(idl as anchor.Idl, programId, provider);
};
