import { expect } from "chai";
import { ethers } from "hardhat";
// eslint-disable-next-line node/no-missing-import
import { MyNFT, MyToken, Shop } from "../typechain";
// eslint-disable-next-line node/no-unpublished-import
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
// eslint-disable-next-line node/no-unpublished-import
import { BigNumber } from "ethers";

const DEFAULT_PURCHASE_RATIO = 100;
const DEFAULT_MINT_PRICE = 0.3333333333333333;

describe("NFT Shop", async () => {
  let shopContract: Shop;
  beforeEach(async () => {
    // TODO
    const tokenContractFactory = await ethers.getContractFactory("MyToken");
    await tokenContractFactory.deploy();

    const nftContractFactory = await ethers.getContractFactory("MyToken");
    await nftContractFactory.deploy();

    const shopContractFactory = await ethers.getContractFactory("Shop");
    shopContract = await shopContractFactory.deploy(
      DEFAULT_PURCHASE_RATIO,
      ethers.utils.parseEther(DEFAULT_MINT_PRICE.toString())
    );

    await shopContract.deployed();
  });

  describe("When the Shop contract is deployed", async () => {
    it("defines the ratio as provided in parameters", async () => {
      // TODO
      const ratio = await shopContract.purchaseRatio();
      expect(ratio).to.eq(DEFAULT_PURCHASE_RATIO);
    });

    it("defines the mint price as provided in parameters", async () => {
      // TODO
      const mintPrice = await shopContract.mintPrice();

      expect(Number(ethers.utils.formatEther(mintPrice))).to.eq(
        Number(DEFAULT_MINT_PRICE.toFixed(18))
      );
    });

    it("uses a valid ERC20 as payment token", async () => {
      // TODO
      const tokenContractAddress = await shopContract.paymentToken();
      expect(tokenContractAddress === ethers.constants.AddressZero).to.eq(
        false
      );

      const tokenContractFactory = await ethers.getContractFactory("MyToken");
      const tokenContract = await tokenContractFactory.attach(
        tokenContractAddress
      );
    });

    it("uses a valid ERC721 as NFT Collection", async () => {
      // TODO
      const nftContractAddress = await shopContract.paymentToken();
      expect(nftContractAddress === ethers.constants.AddressZero).to.eq(false);
    });
  });

  describe("When a user purchase an ERC20 from the Token contract", async () => {
    beforeEach(async () => {
      // TODO
    });

    it("charges the correct amount of ETH", async () => {
      // TODO
    });

    it("gives the correct amount of tokens", async () => {
      // TODO
    });

    describe("When a user burns an ERC20 at the Token contract", async () => {
      beforeEach(async () => {
        // TODO
      });

      it("gives the correct amount of ETH", async () => {
        // TODO
      });

      it("burns the correct amount of tokens", async () => {
        // TODO
      });
    });

    describe("When a user purchase a NFT from the Shop contract", () => {
      beforeEach(async () => {
        // TODO
      });

      it("charges the correct amount of ERC20 tokens", async () => {
        // TODO
      });

      it("mints the correct NFT to the buyer", async () => {
        // TODO
      });

      it("updates the owner account correctly", async () => {
        // TODO
      });

      it("update the pool account correctly", async () => {
        // TODO
      });

      it("favors the pool with the rounding", async () => {
        // TODO
      });

      describe("When a user burns their NFT at the Shop contract", async () => {
        beforeEach(async () => {
          // TODO
        });

        it("gives the correct amount of ERC20 tokens", async () => {
          // TODO
        });

        it("updates the pool correctly", async () => {
          // TODO
        });
      });

      describe("When the owner withdraw from the Shop contract", async () => {
        beforeEach(async () => {
          // TODO
        });

        it("recovers the right amount of ERC20 tokens", async () => {
          // TODO
        });

        it("updates the owner account correctly", async () => {
          // TODO
        });
      });
    });
  });

  describe("When the owner decreases the Mint price from the Shop contract", async () => {
    it("updates the pool and the owner account after increasing the price", async () => {
      throw new Error("Not implemented");
    });
  });

  describe("When the owner increases the Mint price from the Shop contract", async () => {});

  describe("When there is enough tokens in the pool to cover the costs", async () => {
    it("updates the pool and the owner account after increasing the price", async () => {
      throw new Error("Not implemented");
    });
  });

  describe("When there is not enough tokens in the pool to cover the costs", async () => {
    it("charges the correct amount and updates the pool and the owner account after decreasing the price", async () => {
      throw new Error("Not implemented");
    });
  });

  describe("When an attacker tries to exploit the contract", async () => {});

  describe("When transferring ownership", async () => {
    it("fails", async () => {
      throw new Error("Not implemented");
    });
  });

  describe("When withdrawing funds", async () => {
    it("fails ", async () => {
      throw new Error("Not implemented");
    });
  });

  describe("When changing the fee", async () => {
    it("fails", async () => {
      throw new Error("Not implemented");
    });
  });

  describe("When trying to burn a NFT without giving allowance to it", async () => {
    it("fails ", async () => {
      throw new Error("Not implemented");
    });
  });

  describe("When trying to buy ERC20 tokens without sufficient ETH balance", async () => {
    it("fails", async () => {
      throw new Error("Not implemented");
    });
  });
});
