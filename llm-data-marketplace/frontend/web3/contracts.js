// Web3 Contract Configuration for BNB Testnet
import { ethers } from 'ethers';

// BNB Testnet Configuration
export const NETWORK_CONFIG = {
  chainId: '0x61', // 97 in hex
  chainName: 'BNB Smart Chain Testnet',
  nativeCurrency: {
    name: 'tBNB',
    symbol: 'tBNB',
    decimals: 18
  },
  rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
  blockExplorerUrls: ['https://testnet.bscscan.com/']
};

// Contract Addresses (from deployment)
export const CONTRACT_ADDRESSES = {
  DATASET_MARKET: '0x4d9f46D3578FBF27B8e1dfC46a3d909bA0c41f54',
  MODEL_MARKET: '0x9da6677a8AE28B0F4451A15D9B415ab06D3D2f36'
};

// Dataset Market ABI (Updated to match current contract)
export const DATASET_MARKET_ABI = [
  {
    "inputs": [],
    "name": "PLATFORM_FEE_PERCENT",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "_title", "type": "string"},
      {"internalType": "string", "name": "_description", "type": "string"},
      {"internalType": "string", "name": "_author", "type": "string"},
      {"internalType": "string", "name": "_date", "type": "string"},
      {"internalType": "string", "name": "_download_details", "type": "string"},
      {"internalType": "string", "name": "_size", "type": "string"},
      {"internalType": "string", "name": "_format", "type": "string"},
      {"internalType": "string", "name": "_license", "type": "string"},
      {"internalType": "string", "name": "_schema", "type": "string"},
      {"internalType": "string", "name": "_sample_head", "type": "string"},
      {"internalType": "uint256", "name": "_feasibility_score", "type": "uint256"},
      {"internalType": "string", "name": "_purchase_details", "type": "string"},
      {"internalType": "string", "name": "_storageURI", "type": "string"},
      {"internalType": "uint256", "name": "_price", "type": "uint256"}
    ],
    "name": "registerDataset",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_id", "type": "uint256"}],
    "name": "purchaseDataset",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_id", "type": "uint256"}],
    "name": "getDataset",
    "outputs": [
      {"internalType": "uint256", "name": "id", "type": "uint256"},
      {"internalType": "string", "name": "title", "type": "string"},
      {"internalType": "string", "name": "description", "type": "string"},
      {"internalType": "string", "name": "author", "type": "string"},
      {"internalType": "string", "name": "date", "type": "string"},
      {"internalType": "string", "name": "download_details", "type": "string"},
      {"internalType": "string", "name": "size", "type": "string"},
      {"internalType": "string", "name": "format", "type": "string"},
      {"internalType": "string", "name": "license", "type": "string"},
      {"internalType": "string", "name": "schema", "type": "string"},
      {"internalType": "string", "name": "sample_head", "type": "string"},
      {"internalType": "uint256", "name": "feasibility_score", "type": "uint256"},
      {"internalType": "string", "name": "purchase_details", "type": "string"},
      {"internalType": "address", "name": "owner", "type": "address"},
      {"internalType": "uint256", "name": "price", "type": "uint256"},
      {"internalType": "bool", "name": "active", "type": "bool"},
      {"internalType": "string", "name": "storageURI", "type": "string"},
      {"internalType": "uint256", "name": "createdAt", "type": "uint256"},
      {"internalType": "uint256", "name": "updatedAt", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "_buyer", "type": "address"},
      {"internalType": "uint256", "name": "_id", "type": "uint256"}
    ],
    "name": "hasAddressPurchased",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nextDatasetId",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "id", "type": "uint256"},
      {"indexed": false, "internalType": "string", "name": "title", "type": "string"},
      {"indexed": true, "internalType": "address", "name": "owner", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "price", "type": "uint256"},
      {"indexed": false, "internalType": "string", "name": "storageURI", "type": "string"}
    ],
    "name": "DatasetRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "id", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "buyer", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "price", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "platformFee", "type": "uint256"}
    ],
    "name": "DatasetPurchased",
    "type": "event"
  }
];

// Web3 Service Class
export class Web3Service {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.account = null;
  }

  // Check if MetaMask is installed
  isMetaMaskInstalled() {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  }

  // Connect to MetaMask
  async connectWallet() {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found. Please unlock MetaMask.');
      }

      // Switch to BNB testnet if needed
      await this.switchToBNBTestnet();

      // Set up provider and signer
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = this.provider.getSigner();
      this.account = accounts[0];

      // Initialize contract
      this.contract = new ethers.Contract(
        CONTRACT_ADDRESSES.DATASET_MARKET,
        DATASET_MARKET_ABI,
        this.signer
      );

      return {
        account: this.account,
        balance: await this.getBalance()
      };
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  }

  // Switch to BNB testnet
  async switchToBNBTestnet() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: NETWORK_CONFIG.chainId }]
      });
    } catch (switchError) {
      // If network doesn't exist, add it
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [NETWORK_CONFIG]
        });
      } else {
        throw switchError;
      }
    }
  }

  // Get wallet balance
  async getBalance() {
    if (!this.provider || !this.account) {
      throw new Error('Wallet not connected');
    }

    const balance = await this.provider.getBalance(this.account);
    return ethers.utils.formatEther(balance);
  }

  // Register a new dataset on the blockchain
  async registerDataset(datasetData) {
    if (!this.contract) {
      throw new Error('Contract not initialized. Please connect wallet first.');
    }

    try {
      const priceInWei = ethers.utils.parseEther(datasetData.price.toString());
      
      const tx = await this.contract.registerDataset(
        datasetData.title,
        datasetData.description,
        datasetData.author || 'Anonymous',
        datasetData.date || new Date().toISOString(),
        datasetData.download_details || '',
        datasetData.size || 'Unknown',
        datasetData.format || 'CSV',
        datasetData.license || 'MIT',
        datasetData.schema || '',
        datasetData.sample_head || '',
        datasetData.feasibility_score || 85,
        datasetData.purchase_details || '',
        datasetData.storageURI,
        priceInWei
      );

      const receipt = await tx.wait();
      
      // Extract dataset ID from events
      const event = receipt.events?.find(e => e.event === 'DatasetRegistered');
      const datasetId = event?.args?.id?.toNumber();

      return {
        success: true,
        transactionHash: receipt.transactionHash,
        datasetId: datasetId,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      console.error('Error registering dataset:', error);
      throw error;
    }
  }

  // Purchase a dataset with tBNB
  async purchaseDataset(datasetId) {
    if (!this.contract) {
      throw new Error('Contract not initialized. Please connect wallet first.');
    }

    try {
      // Get dataset details first
      const dataset = await this.contract.getDataset(datasetId);
      const price = dataset.price;

      // Check if already purchased
      const hasPurchased = await this.contract.hasAddressPurchased(this.account, datasetId);
      if (hasPurchased) {
        throw new Error('You have already purchased this dataset');
      }

      // Estimate gas
      const gasEstimate = await this.contract.estimateGas.purchaseDataset(datasetId, {
        value: price
      });

      // Add 10% buffer to gas estimate
      const gasLimit = gasEstimate.mul(110).div(100);

      // Execute purchase
      const tx = await this.contract.purchaseDataset(datasetId, {
        value: price,
        gasLimit: gasLimit
      });

      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: receipt.transactionHash,
        price: ethers.utils.formatEther(price),
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      console.error('Error purchasing dataset:', error);
      throw error;
    }
  }

  // Get dataset details from blockchain
  async getDatasetFromBlockchain(datasetId) {
    if (!this.contract) {
      throw new Error('Contract not initialized. Please connect wallet first.');
    }

    try {
      const dataset = await this.contract.getDataset(datasetId);
      
      return {
        id: dataset.id.toNumber(),
        title: dataset.title,
        description: dataset.description,
        author: dataset.author,
        date: dataset.date,
        download_details: dataset.download_details,
        info: {
          size: dataset.size,
          format: dataset.format,
          license: dataset.license
        },
        schema: dataset.schema,
        sample_head: dataset.sample_head,
        feasibility_score: dataset.feasibility_score.toNumber(),
        purchase_details: dataset.purchase_details,
        owner: dataset.owner,
        price: ethers.utils.formatEther(dataset.price),
        active: dataset.active,
        storageURI: dataset.storageURI,
        createdAt: new Date(dataset.createdAt.toNumber() * 1000).toISOString(),
        updatedAt: new Date(dataset.updatedAt.toNumber() * 1000).toISOString()
      };
    } catch (error) {
      console.error('Error fetching dataset from blockchain:', error);
      throw error;
    }
  }

  // Check if user has purchased a dataset
  async hasUserPurchased(datasetId) {
    if (!this.contract || !this.account) {
      return false;
    }

    try {
      return await this.contract.hasAddressPurchased(this.account, datasetId);
    } catch (error) {
      console.error('Error checking purchase status:', error);
      return false;
    }
  }

  // Get next dataset ID
  async getNextDatasetId() {
    if (!this.contract) {
      throw new Error('Contract not initialized. Please connect wallet first.');
    }

    try {
      const nextId = await this.contract.nextDatasetId();
      return nextId.toNumber();
    } catch (error) {
      console.error('Error getting next dataset ID:', error);
      throw error;
    }
  }

  // Disconnect wallet
  disconnect() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.account = null;
  }
}

// Export singleton instance
export const web3Service = new Web3Service();
