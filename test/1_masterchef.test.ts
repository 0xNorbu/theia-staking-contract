import {ethers, network} from "hardhat"
import {expect} from "chai"

describe("Staking", function () {
    let admin: any
    let dev: any
    let account1: any

    let pusdgContract: any
    let susdgContract: any
    let masterChefContract: any

    before(async function () {
        [admin, dev, account1] = await ethers.getSigners()
        const pusdgFactory = await ethers.getContractFactory("FakePUSDGToken")
        const susdgFactory = await ethers.getContractFactory("FakeSUSDGToken")
        const masterChefFactory = await ethers.getContractFactory("MasterChef")

        pusdgContract = await pusdgFactory.deploy()
        susdgContract = await susdgFactory.deploy()

        await pusdgContract.connect(admin).mint(account1.address, ethers.utils.parseUnits("1000"))

        masterChefContract = await masterChefFactory.deploy(
            susdgContract.address,
            dev.address,
            ethers.utils.parseUnits("0.285"),
            1,
            10000,
        )

        await susdgContract.connect(admin).setMinter(masterChefContract.address)
        await susdgContract.connect(admin).setBurner(masterChefContract.address)
    })

    describe("Staking", function () {
        it("Should add, deposit", async function () {
            await masterChefContract.connect(admin).add(
              100,
              pusdgContract.address,
              false
            )

            await pusdgContract.connect(account1).approve(masterChefContract.address, ethers.utils.parseUnits("1000"))

            {
                let account1USDCBalance = await pusdgContract.balanceOf(account1.address)
                expect(account1USDCBalance).to.equal(ethers.utils.parseUnits("1000"));
            }

            await masterChefContract.connect(account1).deposit(
                0,
                ethers.utils.parseUnits("1000")
            )

            await mineBlocks(10)

            await masterChefContract.connect(account1).withdraw(
                0,
                ethers.utils.parseUnits("1000")
            )

            let account1PUSDGBalance = await pusdgContract.balanceOf(account1.address)
            console.log(account1PUSDGBalance.toString())

            let account1SUSDGBalance = await susdgContract.balanceOf(account1.address)
            console.log(account1SUSDGBalance.toString())
        })
    })
})

async function mineBlocks(blockNumber: any) {
    while (blockNumber > 0) {
        blockNumber--;
        await network.provider.send("evm_mine")
    }
}