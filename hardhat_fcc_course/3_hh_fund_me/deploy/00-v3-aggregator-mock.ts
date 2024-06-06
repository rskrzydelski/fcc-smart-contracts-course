import { network } from "hardhat"
import { DECIMALS, developmentChains, INITIAL_ANSWER } from "../helper-hardhat-config"

const v3AggregatorMock = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    if (developmentChains.includes(network.name)) {
        log("Local network detected. Deploying mock aggregator...")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER]
        })
    }
}

(v3AggregatorMock as any).tags = ["all", "mocks"]
export default v3AggregatorMock
