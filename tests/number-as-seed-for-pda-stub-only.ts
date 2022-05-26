import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { NumberAsSeedForPdaStubOnly } from "../target/types/number_as_seed_for_pda_stub_only";

describe("number-as-seed-for-pda-stub-only", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.NumberAsSeedForPdaStubOnly as Program<NumberAsSeedForPdaStubOnly>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
