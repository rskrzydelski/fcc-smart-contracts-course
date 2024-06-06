import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import "hardhat-deploy"
import "dotenv/config"
import "@nomicfoundation/hardhat-ethers"
import "@nomiclabs/hardhat-ethers"
import "@nomicfoundation/hardhat-chai-matchers"

const LINEA_MAINNET_RPC = process.env.LINEA_MAINNET_RPC || ""
const ETHEREUM_SEPOLIA_RPC = process.env.ETHEREUM_SEPOLIA_RPC || ""
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""

const config: HardhatUserConfig = {
    solidity: "0.8.7",
    // in case of multiple solidity versions
    // solidity: {
    //     compilers: [{ version: "0.8.8" }, { version: "0.6.6" }],
    // },
    networks: {
        localhost: {
            url: "http://127.0.0.1:8545/",
            chainId: 31337,
            blockConfirmations: 1
        },
        linea: {
            url: LINEA_MAINNET_RPC,
            chainId: 59144,
            blockConfirmations: 6
        },
        sepolia: {
            url: ETHEREUM_SEPOLIA_RPC,
            accounts: [PRIVATE_KEY],
            chainId: 11155111,
            blockConfirmations: 6
        }
    },
    namedAccounts: {
        deployer: 0
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY
    }
}


export default config
