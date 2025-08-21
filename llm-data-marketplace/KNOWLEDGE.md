# LLM Data Marketplace - Project Knowledge Base

## Project Structure
```
llm-data-marketplace/
├── backend/                  # Backend server (FastAPI)
│   ├── app/
│   │   ├── api/             # API endpoints
│   │   ├── core/            # Core configurations
│   │   ├── models/          # Database models
│   │   ├── services/        # Business logic
│   │   └── main.py          # FastAPI application entry point
│   ├── requirements.txt     # Python dependencies
│   └── .env.example        # Environment variables template
├── contracts/              # Smart contracts
│   ├── contracts/          # Solidity contracts
│   ├── test/               # Contract tests
│   └── hardhat.config.js   # Hardhat configuration
└── README.md               # Project overview
```

## Prerequisites
- Python 3.8+
- Node.js 16+
- pip (Python package manager)
- npm or yarn

## Backend Setup

### Installation
1. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate  # Windows
   source venv/bin/activate  # Linux/Mac
   ```

2. Install Python dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

### Environment Variables
Create a `.env` file in the `backend` directory with the following variables:
```env
DATABASE_URL=sqlite:///./sql_app.db
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
WEB3_PROVIDER_URL=https://your-blockchain-node-url
CONTRACT_ADDRESS=0x...
```

### Running the Backend
```bash
# Start the FastAPI server with hot reload
uvicorn app.main:app --reload

# The API will be available at:
# http://127.0.0.1:8000
# Interactive API docs: http://127.0.0.1:8000/docs
```

## Smart Contracts

### Installation
```bash
cd contracts
npm install
```

### Compiling Contracts
```bash
npx hardhat compile
```

### Testing
```bash
npx hardhat test
```

## API Endpoints

### Wallet
- `GET /api/v1/connect/{wallet_address}` - Connect wallet
- `GET /api/v1/wallet/balance` - Get wallet balance

### Datasets
- `GET /api/v1/datasets/` - List all datasets
- `POST /api/v1/datasets/` - Create new dataset
- `GET /api/v1/datasets/{dataset_id}` - Get dataset details
- `POST /api/v1/purchase/{dataset_id}` - Purchase dataset

## Common Commands

### Backend
```bash
# Run tests
pytest

# Run with production settings
uvicorn app.main:app --host 0.0.0.0 --port 8000

# Check code style
flake8 .
```

### Smart Contracts
```bash
# Deploy to local network
npx hardhat run scripts/deploy.js --network localhost

# Run local blockchain node
npx hardhat node

# Verify contract on Etherscan
npx hardhat verify --network mainnet DEPLOYED_CONTRACT_ADDRESS "Constructor argument 1"
```

## Troubleshooting

### Common Issues
1. **Port already in use**:
   ```bash
   # Find and kill the process
   netstat -ano | findstr :8000
   taskkill /PID <PID> /F
   ```

2. **Python dependencies not found**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Node.js dependencies issues**:
   ```bash
   cd contracts
   rm -rf node_modules package-lock.json
   npm install
   ```

## Development Workflow
1. Create a new branch for your feature
2. Make your changes
3. Run tests
4. Commit with a descriptive message
5. Push to the remote repository
6. Create a pull request

## License
[Your License Here]

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request
