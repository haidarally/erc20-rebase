const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Testium Token", () => {
  let testium;
  let owner;
  let hacker;

  beforeEach(async () => {
    const Testium = await ethers.getContractFactory("Testium");
    testium = await Testium.deploy();
    await testium.deployed();
    owner = await ethers.getSigner();
    hacker = await ethers.getSigner(2);
    await testium.setMonetaryPolicy(owner.address);
  });

  describe("constructor", () => {
    it("sets the name and symbol correctly", async () => {
      expect(await testium.name()).to.equal("Testium");
      expect(await testium.symbol()).to.equal("TEST");
    });

    it("mints the max supply to the owner", async () => {
      const owner = await testium.owner();
      const maxSupply = await testium.totalSupply();

      expect(await testium.balanceOf(owner)).to.equal(maxSupply);
    });
  });

  describe("rebase", () => {
    it("should fail if not called by the monetary policy contract", async function () {
      await expect(testium.connect(hacker).rebase(1, 0)).to.be.revertedWith(
        "only monetary policy"
      );
    });

    it("should fail if supplyDelta is zero", async function () {
      const totalSupplyBefore = await testium.totalSupply();
      const supplyDelta = 0;

      await testium.rebase(1, supplyDelta);

      const totalSupplyAfter = await testium.totalSupply();

      expect(totalSupplyAfter).to.equal(totalSupplyBefore);
    });

    it("should increase total supply if supplyDelta is positive", async function () {
      const totalSupplyBefore = await testium.totalSupply();
      const supplyDelta = 100;

      await testium.rebase(1, supplyDelta);

      const totalSupplyAfter = await testium.totalSupply();
      const expectedTotalSupply = totalSupplyBefore.add(supplyDelta);

      expect(totalSupplyAfter).to.equal(expectedTotalSupply);
    });

    it("should decrease total supply if supplyDelta is negative", async function () {
      const totalSupplyBefore = await testium.totalSupply();
      const supplyDelta = -100;

      await testium.rebase(1, supplyDelta);

      const totalSupplyAfter = await testium.totalSupply();
      const expectedTotalSupply = totalSupplyBefore.add(supplyDelta);

      expect(totalSupplyAfter).to.equal(expectedTotalSupply);
    });
  });
});
