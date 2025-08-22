# tBNB Deployment Guide

This guide explains how to deploy the smart contracts to the BNB Smart Chain Testnet (tBNB) and integrate them with the backend.

## Prerequisites

1. Install Node.js and npm
2. Install Hardhat: `npm install --save-dev hardhat`
3. Install dependencies: `npm install`
4. Create a `.env` file in the contracts directory with the following variables:
   ```
   PRIVATE_KEY=your_private_key_here
   BNB_TESTNET_RPC=https://data-seed-prebsc-1-s1.binance.org:8545/
   BSCSCAN_API_KEY=your_bscscan_api_key
   ```

## Deployment Steps

### 1. Compile Contracts
```bash
npx hardhat compile
```

### 2. Deploy to tBNB
```bash
npx hardhat run scripts/deploy-tbnb.js --network bnb_testnet
```

### 3. Verify Contracts on BSCScan
```bash
npx hardhat run scripts/verify-tbnb.js --network bnb_testnet
```

## Backend Integration

Update your backend configuration with the deployed contract addresses:

```python
# In your .env or config file
DATASET_MARKET_ADDRESS=0x...  # From deployment output
MODEL_MARKET_ADDRESS=0x...    # From deployment output
BNB_TESTNET_RPC=https://data-seed-prebsc-1-s1.binance.org:8545/
```

## Contract Addresses

After deployment, the contract addresses will be saved in the `deployments` directory. Use these addresses in your frontend and backend applications.

## Interacting with Contracts

### Web3 Provider Setup
```javascript
const { ethers } = require("ethers");

// Connect to tBNB
const provider = new ethers.providers.JsonRpcProvider(process.env.BNB_TESTNET_RPC);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Connect to DatasetMarket
const datasetMarket = new ethers.Contract(
  process.env.DATASET_MARKET_ADDRESS,
  DatasetMarketABI,
  wallet
);

// Connect to ModelMarket
const modelMarket = new ethers.Contract(
  process.env.MODEL_MARKET_ADDRESS,
  ModelMarketABI,
  wallet
);
```

### Common Operations

#### DatasetMarket
- `registerDataset`: Register a new dataset for sale
- `purchaseDataset`: Purchase a dataset
- `getDataset`: Get dataset details
- `hasPurchased`: Check if an address has purchased a dataset

#### ModelMarket
- `registerModel`: Register a new AI model for sale
- `purchaseModel`: Purchase an AI model
- `getModel`: Get model details
- `hasAddressPurchased`: Check if an address has purchased a model

## Testing

To run tests:
```bash
npx hardhat test
```

## Security Considerations

1. Never commit your private key to version control
2. Use environment variables for sensitive information
3. Test thoroughly on testnet before deploying to mainnet
4. Consider using a multi-sig wallet for contract ownership

## Support

For issues or questions, please open an issue in the repository.
