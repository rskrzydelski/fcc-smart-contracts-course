import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"
import { network } from "hardhat"
import { developmentChains, networkConfig } from "../../helper-hardhat-config"
import MockV3AggregatorModule from "./MockV3Aggregator"

const FundMeModule = buildModule("FundMeModule", (m) => {
    const chainId = network.config.chainId
    let ethUsdPriceFeedAddress
    // for localhost or hardhat network if contract doesn't exist, we deploy
    // a minimal version for our local testing
    if (developmentChains.includes(network.name)) {
        MockV3AggregatorModule
        ethUsdPriceFeedAddress = "???"
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    console.log("ethUsdPriceFeedAddress ", ethUsdPriceFeedAddress)
    const fund_me = m.contract("FundMe", [ethUsdPriceFeedAddress])

    return { fund_me }
})

export default FundMeModule
