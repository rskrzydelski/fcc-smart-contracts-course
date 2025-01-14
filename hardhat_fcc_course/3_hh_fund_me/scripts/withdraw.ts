import { ethers, getNamedAccounts } from "hardhat"

async function main() {
    const { deployer } = await getNamedAccounts()
    const fundMe = await ethers.getContract("FundMe", deployer)
    console.log("withdrawing...")
    const txResponse = await fundMe.withdraw()
    await txResponse.wait(1)
    console.log("withdrawed!")

}

main().then(() => process.exit(0)).catch((err) => {
    console.error(err)
    process.exit(1)
})