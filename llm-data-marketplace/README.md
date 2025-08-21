# LLM Data Marketplace

A decentralized marketplace for buying and selling datasets and AI models using blockchain technology.

## Project Structure

```
llm-data-marketplace/
├── contracts/           # Solidity smart contracts + Hardhat
│   ├── contracts/       # Smart contracts
│   ├── test/            # Smart contract tests
│   ├── scripts/         # Deployment scripts
│   └── deployed/        # Deployed contract ABIs and addresses
├── backend/             # FastAPI backend
│   ├── app/
│   │   ├── api/         # API routes
│   │   ├── db/          # Database configuration
│   │   ├── models/      # Database models
│   │   ├── services/    # Business logic
│   │   └── storage/     # Storage adapters
│   └── requirements.txt # Python dependencies
└── README.md            # This file
```

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- Python (3.9+)
- pip (Python package manager)
- Hardhat (for smart contract development)
- IPFS (for file storage, optional)
- Greenfield CLI (for BNB Greenfield, optional)

### 1. Smart Contracts Setup

```bash
# Navigate to contracts directory
cd contracts

# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to local network
npx hardhat node
# In a new terminal
npx hardhat run scripts/deploy.js --network localhost
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations (if using Alembic)
alembic upgrade head

# Start the development server
uvicorn app.main:app --reload
```

### Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```
# Web3 Configuration
WEB3_PROVIDER_URL=http://localhost:8545

# IPFS Configuration (if using IPFS)
IPFS_HOST=localhost
IPFS_PORT=5001
IPFS_GATEWAY_URL=https://ipfs.io/ipfs/

# Greenfield Configuration (if using Greenfield)
GREENFIELD_RPC_ENDPOINT=
GREENFIELD_PRIVATE_KEY=
GREENFIELD_CHAIN_ID=greenfield_1017-1

# Database
DATABASE_URL=sqlite:///./sql_app.db

# Security
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## API Documentation

Once the backend is running, you can access the interactive API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Smart Contract Deployment

To deploy to a testnet or mainnet:

1. Set up your environment variables in `contracts/.env`:
   ```
   PRIVATE_KEY=your_wallet_private_key
   BSCSCAN_API_KEY=your_bscscan_api_key
   BNB_TESTNET_RPC=your_bnb_testnet_rpc_url
   ```

2. Deploy to BSC Testnet:
   ```bash
   npx hardhat run scripts/deploy.js --network bnb_testnet
   ```

## Storage Options

The application supports multiple storage backends:

1. **IPFS**: Decentralized file storage (default)
   - Run a local IPFS node or use a hosted service like Infura or Pinata

2. **BNB Greenfield**: Decentralized storage on BNB Chain
   - Set up Greenfield CLI and configure the Greenfield adapter

## Testing

### Smart Contracts

```bash
cd contracts
npx hardhat test
```

### Backend

```bash
cd backend
pytest
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenZeppelin for secure smart contract libraries
- FastAPI for the Python backend framework
- Web3.py for Ethereum interaction
- IPFS for decentralized file storage
- BNB Greenfield for decentralized storage
