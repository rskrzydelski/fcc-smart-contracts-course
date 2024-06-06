const { network, getNamedAccounts, deployments } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../../helper-hardhat-config");
const { assert, expect, ethers } = require("ethers");

developmentChains.includes(network.name)
  ? describe.skip
  : describe("Lottery", async function () {
      let lottery, lotteryEntranceFee, deployer;
      const chainId = network.config.chainId;

      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        lottery = await ethers.getContracts("Lottery", deployer);
        lotteryEntranceFee = await lottery.getEntranceFee();
      });

      describe("fulfillRandomWords", function () {
        it("works with live Chainlink Keepers and Chainlink VRF, we get a random winner", async function () {
          // enter the lottery
          const startingTimestamp = await lottery.getLatestTimeStamp();
          const accounts = await ethers.getSiners();

          // setup listener before we eneter the lottery
          await new Promise(async (resolve, reject) => {
            lottery.once("WinnerPick", async () => {
              console.log("WinnerPicked event fired!");
              try {
                // our asserts here
                const recentWinner = await lottery.getRecentWinner();
                const lotteryState = await lottery.getLotteryState();
                const winnerEndingBalance = await accounts[0].getBalance();
                const endingTimestamp = await lottery.getLatestTimeStamp();

                await expect(lottery.getPlayer(0)).to.be.reverted;
                assert.equal(recentWinner.toString(), accounts[0].address);
                assert.equal(lotteryState, 0);
                assert.equal(
                  winnerEndingBalance.toString(),
                  winnerStartingBalance.add(lotteryEntranceFee).toString()
                );
                assert(endingTimestamp > startingTimestamp);
                resolve();
              } catch (error) {
                console.log(error);
                reject(error);
              }
            });

            // then enter the lottery
            await lottery.enterLottery({ value: lotteryEntranceFee });
            const winnerStartingBalance = await accounts[0].getBalance();
          });
        });
      });
    });
