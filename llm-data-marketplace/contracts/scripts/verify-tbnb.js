const hre = require("hardhat");
const path = require("path");
const fs = require("fs");

async function main() {
  console.log("Verifying contracts on BSCScan...");
  
  // Find the latest deployment file
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  const files = fs.readdirSync(deploymentsDir)
    .filter(file => file.startsWith(`deployment-${hre.network.name}-`) && file.endsWith('.json'))
    .sort()
    .reverse();
  
  if (files.length === 0) {
    console.error("No deployment files found!");
    process.exit(1);
  }
  
  const latestDeployment = path.join(deploymentsDir, files[0]);
  console.log(`Using deployment file: ${latestDeployment}`);
  
  const deploymentInfo = JSON.parse(fs.readFileSync(latestDeployment, 'utf8'));
  
  // Verify DatasetMarket
  console.log("\nVerifying DatasetMarket...");
  try {
    await hre.run("verify:verify", {
      address: deploymentInfo.contracts.datasetMarket,
      constructorArguments: [],
    });
    console.log("DatasetMarket verified successfully!");
  } catch (error) {
    console.error("Error verifying DatasetMarket:", error.message);
  }
  
  // Verify ModelMarket
  console.log("\nVerifying ModelMarket...");
  try {
    await hre.run("verify:verify", {
      address: deploymentInfo.contracts.modelMarket,
      constructorArguments: [],
    });
    console.log("ModelMarket verified successfully!");
  } catch (error) {
    console.error("Error verifying ModelMarket:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
