const hre = require("hardhat");

async function main() {
  console.log("Verifying contracts on BSCScan...");
  
  // Verify DatasetMarket
  console.log("\nVerifying DatasetMarket...");
  await hre.run("verify:verify", {
    address: "0x4d9f46D3578FBF27B8e1dfC46a3d909bA0c41f54",
    constructorArguments: [],
  });
  
  // Verify ModelMarket
  console.log("\nVerifying ModelMarket...");
  await hre.run("verify:verify", {
    address: "0x9da6677a8AE28B0F4451A15D9B415ab06D3D2f36",
    constructorArguments: [],
  });
  
  console.log("\nVerification completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
