import { ethers } from "ethers";
import * as customBallot from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";
import * as token from "../artifacts/contracts/Token.sol/MyToken.json";
import { convertStringArrayToBytes32 } from "../utils/common";
import "dotenv/config";

async function main() {
  console.log("deploying contract");
  // gets input from commandline, starting from position 2 in the array
  // the first two elements are filled by node so the elements after the
  // first two positions are the ones inputed by us.
  const argInput = process.argv.slice(2);
  console.log(argInput);

  let receipt;

  // wallet
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");

  // provider
  const provider = ethers.providers.getDefaultProvider("ropsten");
  const signer = wallet.connect(provider);

  // deploying token contract
  const tokenFactory = new ethers.ContractFactory(
    token.abi,
    token.bytecode,
    signer
  );

  const tokenContract = await tokenFactory.deploy();
  const tokenContractAddress = tokenContract.address;
  console.log("token address is", tokenContractAddress);

  receipt = await tokenContract.deployTransaction.wait();
  console.log("----------token contract receipt--------");
  console.log(receipt);

  // deploying custom ballot contract
  const customBallotFactory = new ethers.ContractFactory(
    customBallot.abi,
    customBallot.bytecode,
    signer
  );

  const ballotContract = await customBallotFactory.deploy(
    convertStringArrayToBytes32(argInput),
    tokenContractAddress
  );
  console.log(`ballot address is ${ballotContract.address}`);

  receipt = await ballotContract.deployTransaction.wait();
  console.log("----------token contract receipt--------");
  console.log(receipt);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
