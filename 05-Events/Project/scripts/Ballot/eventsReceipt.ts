import { ethers } from "ethers";
import "dotenv/config";
import * as ballotJson from "../../artifacts/contracts/Ballot.sol/Ballot.json";

function setupProvider() {
  const infuraOptions = process.env.INFURA_API_KEY
    ? process.env.INFURA_API_SECRET
      ? {
          projectId: process.env.INFURA_API_KEY,
          projectSecret: process.env.INFURA_API_SECRET,
        }
      : process.env.INFURA_API_KEY
    : "";
  const options = {
    alchemy: process.env.ALCHEMY_API_KEY,
    infura: infuraOptions,
  };
  const provider = ethers.providers.getDefaultProvider("ropsten", options);
  return provider;
}

async function Populate(
  ballotContract: ethers.Contract,
  provider: ethers.providers.BaseProvider,
  signer: ethers.Signer
) {
  console.log("Populating transactions");
  const wallet1 = ethers.Wallet.createRandom().connect(provider);

  // Giving Right to vote to Random wallet1
  let tx;
  console.log(`Giving right to vote to ${wallet1.address}`);
  tx = await ballotContract.giveRightToVote(wallet1.address);
  await tx.wait();

  // Sending 0.001 ETH to wallet1 to be able to send te vote() tx
  console.log(`Funding account ${wallet1.address}`);
  tx = await signer.sendTransaction({
    to: wallet1.address,
    value: ethers.utils.parseEther("0.001"),
  });
  await tx.wait();

  // Voting for a proposal
  console.log("Voting for a proposal");
  tx = await ballotContract.connect(wallet1).vote(0);
  const receipt = await tx.wait();
  // console.log(receipt);

  // Getting the event data from the receipt
  console.log(receipt.events[0].args.voter);
  console.log(receipt.events[0].args.proposal.toNumber());
  console.log(receipt.events[0].args.weight.toNumber());
  console.log(receipt.events[0].args.proposalVotes.toString());
}

async function main() {
  const provider = setupProvider();
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);
  const contract = new ethers.Contract(
    "0x5a28cab8ccf29f0935c875131f1549cbac614bff",
    ballotJson.abi,
    signer
  );

  await Populate(contract, provider, signer);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
