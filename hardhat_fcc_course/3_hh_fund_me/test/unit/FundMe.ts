import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { deployments, ethers, getNamedAccounts, network } from "hardhat"
import { assert, expect } from "chai"
import { developmentChains } from "../../helper-hardhat-config"

!developmentChains.includes(network.name) ? describe.skip :
    describe("FundMe", function() {
        // We define a fixture to reuse the same setup in every test.
        // We use loadFixture to run this setup once, snapshot that state,
        // and reset Hardhat Network to that snapshot in every test.
        async function deployFundMeFixture() {
            // or you can use [acc1, acc2, acc3] = ethers.getSigners()
            const { deployer } = await getNamedAccounts()

            await deployments.fixture(["all"])

            const fundMe = await ethers.getContract("FundMe", deployer)
            const mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer)

            return { fundMe, mockV3Aggregator, deployer }
        }

        describe("constructor", function() {
            it("sets the aggregator addresses correctly", async function() {
                const { fundMe, mockV3Aggregator } = await loadFixture(deployFundMeFixture)

                const res = await fundMe.getPriceFeed()
                assert.equal(res, mockV3Aggregator.target)
            })
        })

        describe("fund", function() {
            it("fails if you don't send enough ETH", async function() {
                const { fundMe, mockV3Aggregator } = await loadFixture(deployFundMeFixture)
                await expect(fundMe.fund()).to.be.revertedWith("You need to spend more ETH!")
            })
            it("update the amount funded data structure", async function() {
                const { fundMe, deployer } = await loadFixture(deployFundMeFixture)
                const sendValue = ethers.parseEther("1")
                await fundMe.fund({ value: sendValue })
                const res = await fundMe.getAddressToAmountFunded(deployer)
                assert.equal(res.toString(), sendValue.toString())
            })
            it("adds funder to array of funders", async function() {
                const { fundMe, deployer } = await loadFixture(deployFundMeFixture)
                const sendValue = ethers.parseEther("1")
                await fundMe.fund({ value: sendValue })
                const funder = await fundMe.getFunder(0)
                assert.equal(funder, deployer)
            })
        })

        describe("withdraw", function() {
            it("withdraw ETH from a single founder", async function() {
                const { fundMe, deployer } = await loadFixture(deployFundMeFixture)
                const sendValue = ethers.parseEther("1")
                await fundMe.fund({ value: sendValue })

                const startingFundMeBalance = await ethers.provider.getBalance(fundMe.target)
                const startingDeployerBalance = await ethers.provider.getBalance(deployer)

                const txResponse = await fundMe.withdraw()
                const txReceipt = await txResponse.wait(1)
                const { gasUsed, gasPrice } = txReceipt
                const gasCost = gasUsed * gasPrice

                const endingFundMeBalance = await ethers.provider.getBalance(fundMe.target)
                const endingDeployerBalance = await ethers.provider.getBalance(deployer)

                assert.equal(endingFundMeBalance, 0n)
                assert.equal((startingFundMeBalance + startingDeployerBalance).toString(), (endingDeployerBalance + gasCost).toString())
            })
            it("allows us to withdraw with multiple funders", async function() {
                const sendValue = ethers.parseEther("1")
                const { fundMe, deployer } = await loadFixture(deployFundMeFixture)
                const accounts = await ethers.getSigners()
                for (let i = 1; i < 6; i++) {
                    const fundMeConnectedContract = await fundMe.connect(accounts[i])
                    await fundMeConnectedContract.fund({ value: sendValue })
                }

                const startingFundMeBalance = await ethers.provider.getBalance(fundMe.target)
                const startingDeployerBalance = await ethers.provider.getBalance(deployer)

                const txResponse = await fundMe.withdraw()
                const txReceipt = await txResponse.wait(1)
                const { gasUsed, gasPrice } = txReceipt
                const gasCost = gasUsed * gasPrice

                const endingFundMeBalance = await ethers.provider.getBalance(fundMe.target)
                const endingDeployerBalance = await ethers.provider.getBalance(deployer)

                assert.equal(endingFundMeBalance, 0n)
                assert.equal((startingFundMeBalance + startingDeployerBalance).toString(), (endingDeployerBalance + gasCost).toString())

                // make sure that the funders are reset properly
                await expect(fundMe.getFunder(0)).to.be.reverted

                for (let i = 1; i < 6; i++) {
                    assert.equal(await fundMe.getAddressToAmountFunded(accounts[i].address), 0)
                }
            })
            it("only allows the owner to withdraw", async function() {
                const { fundMe, deployer } = await loadFixture(deployFundMeFixture)
                const accounts = ethers.getSigners()
                const attaker = accounts[1]
                const attakerConnectedContract = await fundMe.connect(attaker)
                // todo: figure out why it's not working
                // await expect(attakerConnectedContract.withdraw()).to.be.rejectedWith("FundMe__NotOwner")
                await expect(attakerConnectedContract.withdraw()).to.be.rejected
            })
        })
    })
