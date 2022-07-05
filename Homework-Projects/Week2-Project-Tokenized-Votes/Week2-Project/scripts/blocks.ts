import { ethers } from "ethers";

async function main() {
  // wallet
  // const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
  // provider
  const provider = ethers.getDefaultProvider("ropsten");
  console.log(await provider.getNetwork());

  // const transactionsInBlock = await provider.getBlockWithTransactions(12525777);
  // console.log(transactionsInBlock);

  const block = await provider.getBlock(12525777);
  console.log(block);
  console.log(block.difficulty);

  while (true) {
    const currBlock = await provider.getBlockNumber();

    setTimeout(() => {
      console.log('Current Block"', currBlock);
    }, 1000);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
