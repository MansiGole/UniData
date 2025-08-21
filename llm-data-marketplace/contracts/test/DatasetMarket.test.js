const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");
const { deployContract } = waffle;

describe("DatasetMarket", function () {
  let DatasetMarket, datasetMarket, owner, addr1, addr2;
  const price = ethers.utils.parseEther("1.0");
  const title = "Test Dataset";
  const description = "This is a test dataset";
  const storageURI = "ipfs://test";
  const dtype = "dataset";

  before(async function () {
    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();
    
    // Deploy contract
    DatasetMarket = await ethers.getContractFactory("DatasetMarket");
    datasetMarket = await DatasetMarket.deploy();
    await datasetMarket.deployed();
    
    // For testing events
    this.dsMarket = datasetMarket;
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await datasetMarket.owner()).to.equal(await owner.getAddress());
    });
  });

  describe("Register Dataset", function () {
    it("Should register a new dataset", async function () {
      await expect(datasetMarket.registerDataset(title, description, storageURI, price, dtype))
        .to.emit(datasetMarket, 'DatasetRegistered')
        .withArgs(1, owner.address, title, price, storageURI, dtype);

      const dataset = await datasetMarket.getDataset(1);
      expect(dataset.title).to.equal(title);
      expect(dataset.price).to.equal(price);
      expect(dataset.owner).to.equal(owner.address);
    });

    it("Should fail with empty title or storageURI", async function () {
      await expect(
        datasetMarket.registerDataset("", description, storageURI, price, dtype)
      ).to.be.revertedWith("Title cannot be empty");

      await expect(
        datasetMarket.registerDataset(title, description, "", price, dtype)
      ).to.be.revertedWith("Storage URI cannot be empty");
    });
  });

  describe("Purchase Dataset", function () {
    beforeEach(async function () {
      await (await datasetMarket.registerDataset(title, description, storageURI, price, dtype)).wait();
    });

    it("Should allow purchase with correct payment", async function () {
      await expect(datasetMarket.connect(addr1).purchaseDataset(1, { value: price }))
        .to.emit(datasetMarket, 'Purchased')
        .withArgs(1, addr1.address, price);

      const hasAccess = await datasetMarket.hasUserPurchased(await addr1.getAddress(), 1);
      expect(hasAccess).to.be.true;
    });

    it("Should fail with incorrect payment amount", async function () {
      const halfPrice = price.div(2);
      await expect(
        datasetMarket.connect(addr1).purchaseDataset(1, { value: halfPrice })
      ).to.be.revertedWith("Incorrect payment amount");
    });
  });

  describe("Activation", function () {
    beforeEach(async function () {
      await (await datasetMarket.registerDataset(title, description, storageURI, price, dtype)).wait();
    });

    it("Should allow owner to deactivate dataset", async function () {
      await expect(datasetMarket.setActive(1, false))
        .to.emit(datasetMarket, 'Activated')
        .withArgs(1, false);

      const dataset = await datasetMarket.getDataset(1);
      expect(dataset.active).to.be.false;
    });

    it("Should prevent purchase of inactive dataset", async function () {
      await (await datasetMarket.setActive(1, false)).wait();
      await expect(
        datasetMarket.connect(addr1).purchaseDataset(1, { value: price })
      ).to.be.revertedWith("Dataset is not active");
    });
  });
});
