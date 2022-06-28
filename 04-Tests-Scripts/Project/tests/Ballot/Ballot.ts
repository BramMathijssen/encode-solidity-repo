import { expect } from "chai";
import { ethers } from "hardhat";
// eslint-disable-next-line node/no-missing-import
import { Ballot } from "../../typechain";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

async function giveRightToVote(ballotContract: Ballot, voterAddress: any) {
  const tx = await ballotContract.giveRightToVote(voterAddress);
  await tx.wait();
}

describe("Ballot", function () {
  let ballotContract: Ballot;
  let accounts: any[];

  beforeEach(async function () {
    accounts = await ethers.getSigners();
    const ballotFactory = await ethers.getContractFactory("Ballot");
    ballotContract = await ballotFactory.deploy(
      convertStringArrayToBytes32(PROPOSALS)
    );
    await ballotContract.deployed();
  });

  describe("when the contract is deployed", function () {
    it("has the provided proposals", async function () {
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.proposals(index);
        expect(ethers.utils.parseBytes32String(proposal.name)).to.eq(
          PROPOSALS[index]
        );
      }
    });

    it("has zero votes for all proposals", async function () {
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.proposals(index);
        expect(proposal.voteCount.toNumber()).to.eq(0);
      }
    });

    it("sets the deployer address as chairperson", async function () {
      const chairperson = await ballotContract.chairperson();
      expect(chairperson).to.eq(accounts[0].address);
    });

    it("sets the voting weight for the chairperson as 1", async function () {
      const chairpersonVoter = await ballotContract.voters(accounts[0].address);
      expect(chairpersonVoter.weight.toNumber()).to.eq(1);
    });
  });

  describe("when the chairperson interacts with the giveRightToVote function in the contract", function () {
    it("gives right to vote for another address", async function () {
      const voterAddress = accounts[1].address;
      await giveRightToVote(ballotContract, voterAddress);
      const voter = await ballotContract.voters(voterAddress);
      expect(voter.weight.toNumber()).to.eq(1);
    });

    it("can not give right to vote for someone that has voted", async function () {
      const voterAddress = accounts[1].address;
      await giveRightToVote(ballotContract, voterAddress);
      await ballotContract.connect(accounts[1]).vote(0);
      await expect(
        giveRightToVote(ballotContract, voterAddress)
      ).to.be.revertedWith("The voter already voted.");
    });

    it("can not give right to vote for someone that has already voting rights", async function () {
      const voterAddress = accounts[1].address;
      await giveRightToVote(ballotContract, voterAddress);
      await expect(
        giveRightToVote(ballotContract, voterAddress)
      ).to.be.revertedWith("");
    });
  });

  describe("when the voter interact with the vote function in the contract", function () {
    // TODO
    it("is not able to vote when the voter address has no right to vote", async function () {
      const voterAccount = accounts[1];
      await expect(
        ballotContract.connect(voterAccount).vote(1)
      ).to.be.revertedWith("Has no right to vote");
    });

    it("is able to vote when the voter address has right to vote", async function () {
      const voterAccount = accounts[1];

      // First checking voterWeight before calling giveRightToVote() function
      const voterWeightBefore = (
        await ballotContract.voters(voterAccount.address)
      ).weight.toNumber();

      // VoterWeight = 0
      console.log("before", voterWeightBefore);

      // Method1
      await ballotContract.giveRightToVote(voterAccount.address);
      // // Method2
      // await giveRightToVote(ballotContract, voterAccount.address);
      // // Method3
      // await ballotContract
      //   .connect(accounts[0])
      //   .giveRightToVote(accounts[1].address);

      // Checking VoterWeight again after having called the giveRightToVote() function
      const voterWeightAfter = (
        await ballotContract.voters(voterAccount.address)
      ).weight.toNumber();

      // VoterWeight = 1
      console.log("after", voterWeightAfter);

      // Calling the vote() function now our voterWeight = 1
      await ballotContract.vote(1);

      await expect((await ballotContract.proposals(1)).voteCount).to.be.equal(
        1
      );
    });

    it("is not able to vote if already voted before", async function () {
      const vote = await ballotContract.vote(1);
      const voteTx = await vote.wait();
      console.log(voteTx);

      expect(ballotContract.connect(accounts[0]).vote(1)).to.be.revertedWith(
        "Already voted."
      );
    });

    it("(1st- Form) sets the right proposal property for the voter", async function () {
      await ballotContract.vote(1);

      const voter = accounts[0].address;
      const votedProposal = (
        await ballotContract.voters(voter)
      ).vote.toNumber();

      expect(votedProposal).to.eq(1);
    });

    it("(2nd - Form) sets the right proposal property for the voter", async function () {
      await ballotContract.vote(1);
      const voter = await ballotContract.voters(accounts[0].address);
      const vote = voter.vote.toNumber();
      await expect(vote).to.eq(1);
    });
  });

  describe("when the voter interact with the delegate function in the contract", function () {
    // TODO
    it("is not implemented", async function () {
      throw new Error("Not implemented");
    });
  });

  describe("when the an attacker interact with the giveRightToVote function in the contract", function () {
    // TODO
    it("is not implemented", async function () {
      throw new Error("Not implemented");
    });
  });

  describe("when the an attacker interact with the vote function in the contract", function () {
    // TODO
    it("is not implemented", async function () {
      throw new Error("Not implemented");
    });
  });

  describe("when the an attacker interact with the delegate function in the contract", function () {
    // TODO
    it("is not implemented", async function () {
      throw new Error("Not implemented");
    });
  });

  describe("when someone interact with the winningProposal function before any votes are cast", function () {
    // TODO
    it("is not implemented", async function () {
      throw new Error("Not implemented");
    });
  });

  describe("when someone interact with the winningProposal function after one vote is cast for the first proposal", function () {
    // TODO
    it("is not implemented", async function () {
      throw new Error("Not implemented");
    });
  });

  describe("when someone interact with the winnerName function before any votes are cast", function () {
    // TODO
    it("is not implemented", async function () {
      throw new Error("Not implemented");
    });
  });

  describe("when someone interact with the winnerName function after one vote is cast for the first proposal", function () {
    // TODO
    it("is not implemented", async function () {
      throw new Error("Not implemented");
    });
  });

  describe("when someone interact with the winningProposal function and winnerName after 5 random votes are cast for the proposals", function () {
    // TODO
    it("is not implemented", async function () {
      throw new Error("Not implemented");
    });
  });
});
