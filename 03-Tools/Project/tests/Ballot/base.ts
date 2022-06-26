import { expect } from "chai";
import { ethers } from "hardhat";
// eslint-disable-next-line node/no-missing-import
import { HelloWorld } from "../../typechain";

describe("HelloWorld (Homework)", function () {
  let helloWorldContract: HelloWorld;

  // https://mochajs.org/#hooks
  beforeEach(async function () {
    // https://hardhat.org/plugins/nomiclabs-hardhat-ethers.html#helpers
    const helloWorldFactory = await ethers.getContractFactory("HelloWorld");
    // https://docs.ethers.io/v5/api/contract/contract-factory/#ContractFactory-deploy
    helloWorldContract = await helloWorldFactory.deploy();
    await helloWorldContract.deployed();
  });

  it("Should give a Hello World", async function () {
    // https://www.chaijs.com/api/bdd/#method_equal

    const text = await helloWorldContract.getText();
    const originalText = ethers.utils.parseBytes32String(text);
    expect(originalText).to.equal("Hello World");
  });

  it("Should set owner to deployer account", async function () {
    // https://hardhat.org/plugins/nomiclabs-hardhat-ethers.html#helpers
    const accounts = await ethers.getSigners();
    console.log(accounts[0].address);
    expect(await helloWorldContract.owner()).to.equal(accounts[0].address);
  });

  it("Should not allow anyone other than owner to call transferOwnership", async function () {
    // https://hardhat.org/plugins/nomiclabs-hardhat-ethers.html#helpers
    const accounts = await ethers.getSigners();
    await expect(
      helloWorldContract
        // https://docs.ethers.io/v5/api/contract/contract/#Contract-connect
        .connect(accounts[1])
        .transferOwnership(accounts[1].address)
      // https://ethereum-waffle.readthedocs.io/en/latest/matchers.html#revert
    ).to.be.revertedWith("Caller is not the owner");
  });

  it("Should change text correctly", async function () {
    // parse test string to bytes32 and call setText
    const stringtoBytes = ethers.utils.formatBytes32String("test");
    await helloWorldContract.setText(stringtoBytes);

    // get the newly set text, which should be "test"
    const text = await helloWorldContract.getText();
    const originalText = ethers.utils.parseBytes32String(text);

    expect(originalText).to.equal("test");
  });

  it("Should not allow anyone other than owner to change text", async function () {
    const accounts = await ethers.getSigners();
    const stringtoBytes = ethers.utils.formatBytes32String("test");

    console.log(stringtoBytes);
    await expect(
      helloWorldContract.connect(accounts[1].address).setText(stringtoBytes)
    ).to.be.reverted;
  });
});
