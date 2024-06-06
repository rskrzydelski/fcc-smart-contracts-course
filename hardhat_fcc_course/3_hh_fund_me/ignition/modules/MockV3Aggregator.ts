import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"
import { DECIMALS, INITIAL_ANSWER } from "../../helper-hardhat-config"


const MockV3AggregatorModule = buildModule("MockV3AggregatorModule", (m) => {
    const v3Aggregator = m.contract("MockV3Aggregator", [DECIMALS, INITIAL_ANSWER])
    return { v3Aggregator }
})

export default MockV3AggregatorModule
