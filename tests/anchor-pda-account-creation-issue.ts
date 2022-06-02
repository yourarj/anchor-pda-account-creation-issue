import {
  Program,
  AnchorProvider,
  web3,
  workspace,
  getProvider,
  setProvider,
  BN,
  utils,
} from "@project-serum/anchor";
import { AnchorPdaAccountCreationIssue } from "../target/types/anchor_pda_account_creation_issue";

describe("anchor_pda_account_creation_issue", () => {
  // Configure the client to use the local cluster.
  setProvider(AnchorProvider.env());

  const program =
    workspace.AnchorPdaAccountCreationIssue as Program<AnchorPdaAccountCreationIssue>;
  const user = web3.Keypair.generate();
  const connection = getProvider().connection;
  console.log("User Pubkey:", user.publicKey.toBase58());

  // perform prerequisites for the tests
  before(async () => {
    try {
      const airdropSignature = await connection.requestAirdrop(
        user.publicKey,
        20 * web3.LAMPORTS_PER_SOL
      );

      await connection.confirmTransaction(airdropSignature);

      console.log(new Date(), "airdrop request completed");
    } catch (error) {
      console.log(new Date(), "error occurred");
      console.error(error);
    }
  });

  it("Is initialized!", async () => {
    const seedNumber = new BN(parseInt((Date.now() % 1000000).toString()));
    const seedNumberBuffer = seedNumber.toBuffer("le", 8);

    const [dataHolderPda, dataHolderBump] =
      await web3.PublicKey.findProgramAddress(
        [
          utils.bytes.utf8.encode("data"),
          user.publicKey.toBuffer(),
          seedNumberBuffer,
        ],
        program.programId
      );

    console.log(
      "PDA for program",
      program.programId.toBase58(),
      "is generated :",
      dataHolderPda.toBase58()
    );
    const tx = await program.methods
      .initialize(user.publicKey, seedNumber)
      .accounts({
        dataHolder: dataHolderPda,
        creator: user.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([user])
      .rpc();
    console.log("Your transaction signature", tx);
  });
});
