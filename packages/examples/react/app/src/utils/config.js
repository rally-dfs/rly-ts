import * as anchor from "@project-serum/anchor";

export const config = {
    programs: {
        canonicalSwap: 'CSWAPqg5XDRcknL2CmDVtmBHX2KFEnaLZgHFCC89nhDk',
        tokenSwap: 'TBCwReYDDw8SvwVVKJHgatzeXKrLHnaTPyDGwkUoBsq',
        token: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    },
    pda: {
        CANONICAL_MINT_AUTHORITY_PDA_SEED: anchor.utils.bytes.utf8.encode("can_mint_authority"),
        TOKEN_ACCOUNT_PDA_SEED: anchor.utils.bytes.utf8.encode("token_account_seed"),
        WRAPPED_TOKEN_OWNER_AUTHORITY_PDA_SEED: anchor.utils.bytes.utf8.encode("wrapped_acct_authority")
    },
    accountLayout: {
        SWAP_ACCOUNT_SPACE: 324,
        WRAPPED_DATA_SPACE: 8 + 66,
        CANONICAL_DATA_SPACE: 8 + 65
    }
};