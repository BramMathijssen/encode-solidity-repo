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

// HERE
describe("NFT Shop", async () => {
  let shopContract: Shop;
  let tokenContract: MyToken;
  let nftContract: MyNFT;
  let accounts: SignerWithAddress[];

  beforeEach(async () => {
    accounts = await ethers.getSigners();

    const tokenContractFactory = await ethers.getContractFactory("MyToken");
    tokenContract = await tokenContractFactory.deploy();
    await tokenContract.deployed();
    const tokenAddress = tokenContract.address;

    const nftContractFactory = await ethers.getContractFactory("MyNFT");
    nftContract = await nftContractFactory.deploy();
    await nftContract.deployed();
    const nftAddress = nftContract.address;

    const shopContractFactory = await ethers.getContractFactory("Shop");
    shopContract = await shopContractFactory.deploy(
      DEFAULT_PURCHASE_RATIO,
      ethers.utils.parseEther(DEFAULT_MINT_PRICE.toFixed(18)),
      tokenAddress,
      nftAddress
    );
    await shopContract.deployed();

    const minterRole = await tokenContract.MINTER_ROLE();
    const minterRoleTx = await tokenContract.grantRole(
      minterRole,
      shopContract.address
    );
    await minterRoleTx.wait();
    const nftMinterRole = await nftContract.MINTER_ROLE();
    const nftMinterRoleTx = await nftContract.grantRole(
      nftMinterRole,
      shopContract.address
    );
    await nftMinterRoleTx.wait();
  });

  describe("When the Shop contract is deployed", async () => {
    it("defines the ratio as provided in parameters", async () => {
      const ratio = await shopContract.purchaseRatio();
      expect(ratio).to.eq(DEFAULT_PURCHASE_RATIO);
    });

    it("defines the mint price as provided in parameters", async () => {
      const mintPrice = await shopContract.mintPrice();

      expect(Number(ethers.utils.formatEther(mintPrice))).to.eq(
        Number(DEFAULT_MINT_PRICE.toFixed(18))
      );
    });

    it("uses a valid ERC20 as payment token", async () => {
      const tokenContractAddress = await shopContract.paymentToken();
      expect(tokenContractAddress === ethers.constants.AddressZero).to.eq(
        false
      );
      const tokenContractFactory = await ethers.getContractFactory("MyToken");
      const tokenContract = await tokenContractFactory.attach(
        tokenContractAddress
      );

      const symbol = await tokenContract.symbol();
      const decimals = await tokenContract.decimals();
      const tokenName = await tokenContract.name();

      console.log(symbol);
      expect(symbol).to.eq("MTK");
      expect(decimals).to.eq(18);
      expect(tokenName).to.eq("MyToken");
    });

    it("uses a valid ERC721 as NFT Collection", async () => {
      const nftContractAddress = await shopContract.paymentToken();
      expect(nftContractAddress === ethers.constants.AddressZero).to.eq(false);

      const nftContractFactory = await ethers.getContractFactory("MyNFT");
      const nftContract = nftContractFactory.attach(nftContractAddress);

      const nftName = await nftContract.name();
      const nftSymbol = await nftContract.symbol();

      expect(nftName).to.eq("MyToken");
      expect(nftSymbol).to.eq("MTK");
    });
  });

  describe("When a user purchase an ERC20 from the Token contract", async () => {
    let accountValue: BigNumber;
    let txFee: BigNumber;
    let tokensEarned: BigNumber;
    const ETHER_SPEND = 500;
    beforeEach(async () => {
      accountValue = await accounts[0].getBalance();
      const parsedValue = ethers.utils.formatUnits(accountValue);
      console.log("acc value before", parsedValue);

      console.log(
        `MTK tokens before purchase of account 0: ${tokensEarned} MTK`
      );

      const purchaseTokenTx = await shopContract.purchaseTokens({
        value: ethers.utils.parseEther(ETHER_SPEND.toFixed(0)),
      });
      const receipt = await purchaseTokenTx.wait();
      const gasUsed = receipt.gasUsed;
      const effectiveGasPrice = receipt.effectiveGasPrice;
      txFee = gasUsed.mul(effectiveGasPrice);

      // with tokenContract.balanceOf() we call the default balanceOf method of the ERC20 contract
      // to check the amount of MTK tokens an account owns
      tokensEarned = await tokenContract.balanceOf(accounts[0].address);

      // logs the account value after the purchase token tx, which should be 500 less than before
      const accountValueAfter: BigNumber = await accounts[0].getBalance();
      const parsedValue2 = ethers.utils.formatUnits(accountValueAfter);
      console.log("acc value after", parsedValue2);
    });

    it("charges the correct amount of ETH", async () => {
      const accountValueAfterTx = await accounts[0].getBalance();

      // can use ETHER_SPEND.toString() or ETHER_SPEND.toFixed() like in the example
      const totalSpend = ethers.utils
        .parseEther(ETHER_SPEND.toString())
        .add(txFee);
      const expectedValueAfter = accountValue.sub(totalSpend);
      expect(accountValueAfterTx).to.eq(expectedValueAfter);
    });

    it("gives the correct amount of tokens", async () => {
      console.log(
        `MTK tokens after purchase of account 0: ${tokensEarned} MTK`
      );
      expect(tokensEarned.toString()).to.eq(
        ethers.utils
          .parseEther((ETHER_SPEND / DEFAULT_PURCHASE_RATIO).toString())
          .toString()
      );
    });

    describe("When a user burns an ERC20 at the Token contract", async () => {
      beforeEach(async () => {
        // TODO
        throw new Error("Not implemented");
      });

      it("gives the correct amount of ETH", async () => {
        // TODO
        throw new Error("Not implemented");
      });

      it("burns the correct amount of tokens", async () => {
        // TODO
        throw new Error("Not implemented");
      });
    });

    describe("When a user purchase a NFT from the Shop contract", () => {
      beforeEach(async () => {
        // TODO
        throw new Error("Not implemented");
      });

      it("charges the correct amount of ERC20 tokens", async () => {
        // TODO
        throw new Error("Not implemented");
      });

      it("mints the correct NFT to the buyer", async () => {
        // TODO
        throw new Error("Not implemented");
      });

      it("updates the owner account correctly", async () => {
        // TODO
        throw new Error("Not implemented");
      });

      it("update the pool account correctly", async () => {
        // TODO
        throw new Error("Not implemented");
      });

      it("favors the pool with the rounding", async () => {
        // TODO
        throw new Error("Not implemented");
      });

      describe("When a user burns their NFT at the Shop contract", async () => {
        beforeEach(async () => {
          // TODO
          throw new Error("Not implemented");
        });

        it("gives the correct amount of ERC20 tokens", async () => {
          // TODO
          throw new Error("Not implemented");
        });

        it("updates the pool correctly", async () => {
          // TODO
          throw new Error("Not implemented");
        });
      });

      describe("When the owner withdraw from the Shop contract", async () => {
        beforeEach(async () => {
          // TODO
          throw new Error("Not implemented");
        });

        it("recovers the right amount of ERC20 tokens", async () => {
          // TODO
          throw new Error("Not implemented");
        });

        it("updates the owner account correctly", async () => {
          // TODO
          throw new Error("Not implemented");
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
