// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  //const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  //const unlockTime = currentTimestampInSeconds + 60;

  //const lockedAmount = hre.ethers.utils.parseEther("0.001");

  // const Lock = await hre.ethers.getContractFactory("Lock");
  // const lock = await Lock.deploy(unlockTime, { value: lockedAmount });
  const owner = await ethers.getSigner();
  console.log("Account balance:", (await owner.getBalance()).toString());

  const Token = await ethers.getContractFactory("Testium");
  const token = await Token.deploy();

  await token.deployed();

  console.log(`contract deployed to ${token.address}`);

  const gasEstimate = await Token.estimateGas();
  console.log(`Estimated gas cost: ${gasEstimate.toString()}`);

  await token.setMonetaryPolicy(owner.address);
  console.log(`monetary policy is ${await token.monetaryPolicy()}`);

  //0x5FbDB2315678afecb367f032d93F642f64180aa3
  //0xaB7D517718dc7EDD69a7F2ee2E65152650996B77
  //0xe61334063361408Cb23351a72375D9CbF8399fDE
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
