UniData

A blockchain-powered dataset marketplace where users can discover datasets, evaluate their feasibility, connect a Web3 wallet, purchase blockchain-backed datasets using tBNB on BNB Smart Chain Testnet, and receive verified access after purchase.

UniData combines a traditional dataset marketplace with blockchain-based purchase verification and backend entitlement management.

Think of it as a marketplace for datasets with:

Dataset discovery
AI-powered feasibility analysis
Web3 wallet integration
On-chain dataset registration
tBNB-based purchasing
Blockchain purchase verification
Backend purchase synchronization
Purchase-based access control
🚀 Overview

UniData is a hybrid Web2 + Web3 dataset marketplace.

Users can browse datasets through the marketplace frontend. Blockchain-backed datasets are linked to records on the BNB Smart Chain Testnet and can be purchased through MetaMask using tBNB.

The blockchain is responsible for verifiable purchase and ownership state, while the backend maintains marketplace data, purchase records, and access authorization.

This architecture avoids storing large dataset files directly on the blockchain while using blockchain technology where it provides the most value: verification, payment, and ownership state.

✨ Key Features
📊 Dataset Marketplace
Browse available datasets
View dataset details
View dataset status and metadata
View dataset feasibility and quality information
Purchase blockchain-backed datasets
🤖 AI/ML Dataset Analysis

Datasets can display an AI-powered feasibility/readiness assessment.

The current interface demonstrates:

Feasibility score
Dataset grade
Dataset strengths
Dataset analysis information

The AI/ML layer helps users understand whether a dataset is suitable for machine-learning workflows.

🔗 Blockchain Integration

Blockchain-backed datasets are registered against the DatasetMarket smart contract deployed on BNB Smart Chain Testnet.

Current network:

Network: BNB Smart Chain Testnet
Chain ID: 97
Currency: tBNB
💰 Blockchain Purchase

A buyer can:

Connect MetaMask
Open a blockchain-backed dataset
Select Purchase
Confirm the transaction in MetaMask
Pay the dataset price in tBNB
Wait for blockchain confirmation
Synchronize the successful purchase with the backend
Receive verified access

The current verified demonstration uses a dataset priced at:

0.001 tBNB

✅ On-Chain Purchase Verification

The frontend verifies ownership using the smart contract function:

hasAddressPurchased()

This allows the application to recognize an already-purchased dataset even after refreshing the page or reconnecting the wallet.

🔐 Backend Entitlement & Access Control

After a successful blockchain purchase, the backend records:

Dataset ID
Buyer wallet address
Transaction hash
Purchase amount
Purchase timestamp

The backend then verifies whether a wallet is entitled to access the dataset.

Unauthorized wallets are rejected.

🦊 Wallet Integration

MetaMask is used for:

Wallet connection
Account detection
BNB Smart Chain Testnet interaction
Transaction signing
tBNB payments
🔄 End-to-End Purchase Flow
User
  ↓
UniData Frontend
  ↓
Connect MetaMask
  ↓
Open Blockchain-backed Dataset
  ↓
Purchase Dataset
  ↓
MetaMask Transaction
  ↓
DatasetMarket Smart Contract
  ↓
BSC Testnet Confirmation
  ↓
Transaction Hash
  ↓
Backend Synchronization
  ↓
Purchase Record
  ↓
Entitlement Verification
  ↓
Authorized Dataset Access

The blockchain transaction and backend purchase record are intentionally separated.

The blockchain provides independently verifiable purchase state, while the backend provides marketplace records and access-control logic.

🏗️ System Architecture
                    ┌─────────────────────┐
                    │        User         │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    React + Vite     │
                    │   UniData Frontend  │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 ▼                           ▼
        ┌─────────────────┐        ┌─────────────────┐
        │ FastAPI Backend │        │     MetaMask    │
        └────────┬────────┘        └────────┬────────┘
                 │                          │
                 ▼                          ▼
        ┌─────────────────┐        ┌─────────────────┐
        │    Database     │        │  BSC Testnet    │
        │ Dataset/Purchase│        │  DatasetMarket  │
        │     Records     │        │ Smart Contract  │
        └─────────────────┘        └─────────────────┘
                 │                          │
                 └────────────┬─────────────┘
                              ▼
                    ┌─────────────────────┐
                    │ Entitlement /       │
                    │ Access Verification │
                    └─────────────────────┘
🧪 Verified BSC Testnet Demonstration

The current implementation has been tested end-to-end using a dedicated blockchain-backed dataset.

Verified Flow
Dataset registered on BSC Testnet
Wallet connected through MetaMask
Purchase initiated from the frontend
Transaction confirmed on BSC Testnet
Transaction hash recorded
Backend purchase record created
On-chain hasAddressPurchased() returns true
Purchased state restored after refresh/reconnect
Authorized wallet receives access
Unauthorized wallet is rejected
Smart Contract

DatasetMarket

0x4Ccd91247B98df05dCF18aBd70F27367DFcd9da4

Network: BNB Smart Chain Testnet

Chain ID: 97

🛠️ Tech Stack
Frontend
React
Vite
TypeScript
ethers.js
MetaMask
Web3 wallet integration
Backend
Python
FastAPI
SQLAlchemy
REST APIs
Blockchain service layer
Blockchain
Solidity
Hardhat
ethers.js
BNB Smart Chain Testnet
DatasetMarket smart contract
Database
SQLAlchemy-based persistence
Dataset records
Purchase records
Blockchain dataset mapping
AI/ML
Dataset feasibility/readiness analysis
ML-oriented dataset evaluation
AI/ML workflow integration
🎯 Why Blockchain?

UniData does not store the actual dataset files directly on the blockchain.

Instead, blockchain is used for the parts where verifiability matters:

Purchase verification
Wallet-based identity
On-chain ownership/purchase state
Transparent transaction history
Decentralized payment

Large dataset files remain outside the blockchain.

This hybrid architecture is more practical than attempting to store large datasets directly on-chain.

🔐 Security & Access-Control Model

A user's wallet address is associated with the blockchain purchase.

The system verifies:

Wallet
   ↓
Has the wallet purchased the dataset?
   ↓
YES ──→ Grant access
   │
NO  ──→ Reject access

Both blockchain state and backend purchase records participate in the verified purchase workflow.

📊 Current Project Status
✅ Completed
Dataset marketplace UI
Dataset detail pages
Wallet connection
MetaMask integration
BSC Testnet integration
Dataset blockchain mapping
DatasetMarket integration
tBNB purchase flow
On-chain purchase verification
Backend purchase synchronization
Purchase record persistence
Entitlement verification
Unauthorized access rejection
Purchased-state restoration after refresh/reconnect
Production frontend build
End-to-end BSC Testnet testing
🔮 Future Scope

The architecture can be extended with:

BNB Greenfield integration
IPFS-based decentralized dataset storage
Automated royalty distribution
Advanced dataset provenance
Event indexing
Production-grade authentication
More sophisticated AI/ML pipelines
Dataset versioning
Contributor analytics
Automated model-training workflows
Mainnet deployment

These are extensions to the current implementation rather than requirements for the current BSC Testnet demonstration.

👥 Team Responsibilities
Blockchain / Backend
System architecture
FastAPI backend
Database integration
Smart contract integration
BSC Testnet integration
Purchase verification
Backend synchronization
Access-control logic
Frontend / Web3 UI
React marketplace
Dataset pages
MetaMask integration
Purchase interface
Wallet state
Purchased/download UI
AI/ML
Dataset feasibility analysis
ML-readiness evaluation
AI/ML workflow demonstration
Future model-training integration
Product / Pitch
Problem definition
User journey
Presentation
Storytelling
Future scope
Product positioning
📌 Project Vision

UniData aims to become a trusted marketplace for datasets where contributors can monetize data and users can discover, evaluate, and obtain datasets with verifiable ownership and access.

The long-term vision is to combine:

AI + Data + Blockchain

into trusted infrastructure for the AI data economy.

📄 License

This project is licensed under the MIT License.
