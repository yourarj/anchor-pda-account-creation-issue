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
  const seedNumber = new BN(parseInt((Date.now() % 1000000).toString()));
  const seedNumberBuffer = seedNumber.toBuffer("le", 8);

  // perform prerequisites for the tests
  before(async () => {
    try {
      const airdropSignature = await connection.requestAirdrop(
        user.publicKey,
        20 * web3.LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction(airdropSignature);
    } catch (error) {
      console.error(error);
    }
  });

  it("Is initialized!", async () => {


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
    // please note the order of arguments here
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

  // this test calls another rpc method with just arguments order changed.
  // which runs okay
  it("Is initialized ONLY argument flipped!", async () => {
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
      // the only difference here is order of arguments
      .initializeArgumentsFlipped(seedNumber, user.publicKey)
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
