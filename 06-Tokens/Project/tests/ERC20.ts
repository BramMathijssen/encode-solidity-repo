import { expect } from "chai";
// eslint-disable-next-line node/no-unpublished-import
import { BytesLike } from "ethers";
import { ethers } from "hardhat";
// eslint-disable-next-line node/no-missing-import
import { EncodeBootcampMayToken } from "../typechain";

const PREMINT = ethers.utils.parseEther("0");
const TEST_MINT_VALUE = ethers.utils.parseEther("10");

describe("Testing ERC20 Token", () => {
  let tokenContract: EncodeBootcampMayToken;
  let accounts: any[];
  let minterRoleHash: BytesLike;

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    const tokenContractFactory = await ethers.getContractFactory(
      "EncodeBootcampMayToken"
    );
    tokenContract = await tokenContractFactory.deploy();
    await tokenContract.deployed();
    minterRoleHash = await tokenContract.MINTER_ROLE();
  });

  describe("when the contract is deployed", async () => {
    it("has zero total supply", async () => {
      const totalSupply = await tokenContract.totalSupply();
      console.log(totalSupply.toNumber());
      expect(totalSupply).to.eq(0);
    });

    it("sets the deployer as minter", async () => {
      const hasMinterRole = await tokenContract.hasRole(
        minterRoleHash,
        accounts[0].address
      );
      expect(hasMinterRole).to.eq(true);
    });

    describe("when the minter call the mint function", async () => {
      beforeEach(async () => {
        const tx = await tokenContract.mint(
          accounts[1].address,
          TEST_MINT_VALUE
        );
        await tx.wait();
      });

      it("updates the total supply", async () => {
        const totalSupply = await tokenContract.totalSupply();
        expect(totalSupply).to.eq(TEST_MINT_VALUE);
      });

      it("has given balance to the account", async () => {
        const newAccountBalance = await tokenContract.balanceOf(
          accounts[1].address
        );
        expect(newAccountBalance).to.eq(TEST_MINT_VALUE);
      });
    });
  });
});
