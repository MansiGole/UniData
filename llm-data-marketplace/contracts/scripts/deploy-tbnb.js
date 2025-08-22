const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying contracts to tBNB testnet...");
  
  // Get the deployer's account
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deploying contracts with account: ${deployer.address}`);
  
  // Deploy DatasetMarket
  console.log("Deploying DatasetMarket...");
  const DatasetMarket = await hre.ethers.getContractFactory("DatasetMarket");
  const datasetMarket = await DatasetMarket.deploy();
  await datasetMarket.deployed();
  console.log(`DatasetMarket deployed to: ${datasetMarket.address}`);
  
  // Deploy ModelMarket
  console.log("Deploying ModelMarket...");
  const ModelMarket = await hre.ethers.getContractFactory("ModelMarket");
  const modelMarket = await ModelMarket.deploy();
  await modelMarket.deployed();
  console.log(`ModelMarket deployed to: ${modelMarket.address}`);
  
  // Save deployment info to a JSON file
  const deploymentInfo = {
    network: hre.network.name,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      datasetMarket: datasetMarket.address,
      modelMarket: modelMarket.address
    }
  };
  
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  const deploymentFile = path.join(deploymentsDir, `deployment-${hre.network.name}-${Date.now()}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  
  console.log(`\nDeployment information saved to: ${deploymentFile}`);
  console.log("\nDeployment completed successfully!");
  
  return {
    datasetMarket: datasetMarket.address,
    modelMarket: modelMarket.address
  };
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
