const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");

const BASE_FEE = ethers.utils.parseEther("0.25"); // premium per request
// Chainlink Nodes pay the gas fees to give us randomness & do external
// execution so they proce of requests change based on the proce of gas
const GAS_PRICE_LINK = 10e9;

module.exports = async function ({ getNamedAccounts, deployments }) {
  console.log("MOCKSSSS");
  //   const { deploy, log } = deployments;
  //   const { deployer } = await getNamedAccounts();
  //   const args = [BASE_FEE, GAS_PRICE_LINK];

  //   if (developmentChains.includes(network.name)) {
  //     log("Local network detected! Deploying mocks...");
  //     await deploy("VRFCoordinatorV2Mock", {
  //       from: deployer,
  //       log: true,
  //       args: args,
  //     });
  //     log("Mock deployed!");
  //     log("-------------------------------------------------");
  //   }
};

module.exports.tags = ["all", "mocks"];
