use anchor_lang::prelude::*;

declare_id!("4TVMT7N8nAJwZMuXH3MdfzNNQVG5YivBhRv9wbEBp9Ma");

#[program]
pub mod anchor_pda_account_creation_issue {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        data_owner: Pubkey,
        seed_number: u64,
    ) -> Result<()> {
        ctx.accounts.data_holder.seed_number = seed_number;
        ctx.accounts.data_holder.data_owner = data_owner;
        Ok(())
    }

    pub fn initialize_arguments_flipped(
        ctx: Context<Initialize>,
        seed_number: u64,
        data_owner: Pubkey,
    ) -> Result<()> {
        ctx.accounts.data_holder.seed_number = seed_number;
        ctx.accounts.data_holder.data_owner = data_owner;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(seed_number: u64)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer=creator,
        space=1000,
        seeds = [
            b"data".as_ref(),
            creator.key.as_ref(),
            seed_number.to_le_bytes().as_ref()
        ],
        bump
    )]
    pub data_holder: Account<'info, DataHolder>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct DataHolder {
    pub seed_number: u64,
    pub data_owner: Pubkey,
}
