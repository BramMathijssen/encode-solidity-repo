import { ethers } from "ethers";
import "dotenv/config";
import * as ballotJson from "../../artifacts/contracts/Ballot.sol/Ballot.json";
import { Ballot } from "../../typechain";

const EXPOSED_KEY =
  "8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f";

const contractAddress = "0x6a345dbc03d92cff8e62624edd0f83921b3c9623";

async function main() {
  const provider = ethers.providers.getDefaultProvider("ropsten");

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? EXPOSED_KEY);
  const signer = wallet.connect(provider);

  const ballotContract: Ballot = new ethers.Contract(
    contractAddress,
    ballotJson.abi,
    signer
  ) as Ballot;

  const votedTx = await ballotContract.vote(0);
  console.log(votedTx.hash);
  const proposal = await ballotContract.proposals(1);
  console.log(proposal.voteCount.toNumber());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
