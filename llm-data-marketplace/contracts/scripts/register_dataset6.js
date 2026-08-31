const hre = require("hardhat");
const assert = require("assert");

async function main() {
  console.log("--- EXECUTING CONTROLLED REGISTRATION OF LOCAL DATASET ID 6 ---");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Signer Account:", deployer.address);
  assert(deployer.address.toLowerCase() === "0xCcfA277C946b8527DFF6d6A20e285A0E3401ADDe".toLowerCase(), "Wallet address mismatch");

  const contractAddress = "0x4Ccd91247B98df05dCF18aBd70F27367DFcd9da4";
  const DatasetMarket = await hre.ethers.getContractFactory("DatasetMarket");
  const datasetMarket = DatasetMarket.attach(contractAddress);

  const priceInWei = hre.ethers.utils.parseEther("0.001");

  console.log("Submitting DatasetMarket.registerDataset transaction...");
  const tx = await datasetMarket.registerDataset(
    "BSC Testnet Dedicated Purchase Dataset",
    "Dedicated test dataset for end-to-end BSC Testnet purchase verification",
    deployer.address,
    new Date().toISOString(),
    "/uploads/datasets/sample_financial_data.csv",
    "792 bytes",
    "CSV",
    "MIT",
    "",
    "",
    85,
    "",
    "ipfs://bafybeic723-dedicated-test",
    priceInWei
  );

  console.log("Transaction Hash:", tx.hash);
  console.log("Waiting for block confirmation...");

  const receipt = await tx.wait();
  console.log("Transaction Confirmed in Block:", receipt.blockNumber);
  console.log("Gas Used:", receipt.gasUsed.toString());

  // Parse event
  let newDatasetId = null;
  for (const log of receipt.logs) {
    try {
      const parsedLog = datasetMarket.interface.parseLog(log);
      if (parsedLog.name === "DatasetRegistered") {
        newDatasetId = parsedLog.args.id.toNumber();
        break;
      }
    } catch (e) {
      // ignore other events
    }
  }

  console.log("Newly Assigned Blockchain Dataset ID:", newDatasetId);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Registration Failed:", error);
    process.exit(1);
  });
