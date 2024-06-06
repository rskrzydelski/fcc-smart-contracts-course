import {HardhatUserConfig} from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import "hardhat-gas-reporter"
import "dotenv/config"
import "solidity-coverage"

const LINEA_MAINNET_RPC = process.env.LINEA_MAINNET_RPC || ""
const PRIVATE_KEY = process.env.PRIVATE_KEY || ""
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""
const COINMARKET_CAP_API_KEY = process.env.COINMARKET_CAP_API_KEY || ""

const config: HardhatUserConfig = {
    solidity: "0.8.24",
    networks: {
        localhost: {
            url: "http://127.0.0.1:8545/",
            chainId: 31337,
        },
        linea: {
            url: LINEA_MAINNET_RPC,
            chainId: 59144,
        }
        // sepolia: {
        //     url: SEPOLIA_RPC_URL,
        //     accounts: [PK],
        //     chainId: 4,
        // }
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enabled: true,
        // outputFile: "gas-report.txt",
        currency: "USD",
        coinmarketcap: COINMARKET_CAP_API_KEY,
    }
}

export default config;
