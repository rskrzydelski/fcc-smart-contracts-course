import { ethers, getNamedAccounts } from "hardhat"

async function main() {
    const { deployer } = await getNamedAccounts()
    const fundMe = await ethers.getContract("FundMe", deployer)
    console.log("funding contract...")
    const txResponse = await fundMe.fund({ value: ethers.parseEther("0.1") })
    await txResponse.wait(1)
    console.log("funded!")

}

main().then(() => process.exit(0)).catch((err) => {
    console.error(err)
    process.exit(1)
})