const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying DatasetMarket contract...");
  
  // Deploy the contract
  const DatasetMarket = await hre.ethers.getContractFactory("DatasetMarket");
  const datasetMarket = await DatasetMarket.deploy();
  await datasetMarket.deployed();

  console.log(`DatasetMarket deployed to: ${datasetMarket.address}`);

  // Create deployed directory if it doesn't exist
  const deployedDir = path.join(__dirname, "../deployed");
  if (!fs.existsSync(deployedDir)) {
    fs.mkdirSync(deployedDir, { recursive: true });
  }

  // Get contract ABI
  const artifact = await hre.artifacts.readArtifact("DatasetMarket");
  
  // Save contract address and ABI
  const contractInfo = {
    address: datasetMarket.address,
    abi: artifact.abi
  };

  fs.writeFileSync(
    path.join(deployedDir, "DatasetMarket.json"),
    JSON.stringify(contractInfo, null, 2)
  );

  console.log("Contract ABI and address saved to deployed/DatasetMarket.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
