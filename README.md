# UniData_V0
a BNB-chain powered dataset marketplace where contributors can upload datasets, buyers purchase with tBNB, and contributors automatically earn royalties. Storage defaults to IPFS with optional BNB Greenfield for access-controlled storage. AI/ML workflows run in isolation and consume datasets via signed URLs.
🚀 Overview

The LLM Data Marketplace is a decentralized platform where contributors can upload datasets and earn royalties when buyers (AI startups, researchers, data owners) purchase them. Built with BNB Chain architecture in mind, the project integrates BNB Greenfield for decentralized storage and access control, making it possible to monetize datasets transparently.

Think of it as GitHub + HuggingFace + App Store, but for datasets — with on-chain ownership + revenue share.

✨ Key Features

Dataset Registry → Contributors upload datasets and register them on-chain.

Purchasing & Royalties → Buyers purchase with tBNB/ETH (local test). Contributors earn automatic royalties.

BNB Greenfield Integration → Datasets stored in Greenfield buckets, with buyer-only access granted after purchase.

IPFS Fallback → If Greenfield SDK is unavailable, files fallback to IPFS.

Frontend dApp → Upload, browse, buy, and download datasets via wallet (Metamask).

AI/ML Integration → Purchased dataset consumed in HuggingFace pipeline for fine-tuning.

⚡ Hybrid Demo Strategy (Plan D)

Contracts → Deployed locally (Hardhat) or on Sepolia (fallback). EVM-compatible, ready for BNB chain.

Storage → BNB Greenfield SDK (primary) with IPFS fallback.

Backend → Thin Express service for contract event indexing + download entitlement validation.

Frontend → Next.js dApp for contributors and buyers.

AI Layer → Runs offline; isolated from infra; consumes datasets via signed URL.

🎥 Demo Flow

Contributor uploads dataset → stored in Greenfield → registered on local chain.

Buyer browses and purchases dataset.

Smart contract records purchase + royalties flow to contributor.

Backend validates buyer entitlement → grants Greenfield access.

Buyer downloads dataset.

ML pipeline fine-tunes HuggingFace model on dataset → outputs results.

📖 Pitch Story

Problem: AI startups spend $$$ for clean, copyright-safe datasets without clear provenance.

Solution: Marketplace with royalties + access-controlled BNB Greenfield storage.

USP: Transparent, copyright-proof, and monetizable open data.

Vision: Long-term, the App Store for AI datasets — powered by BNB.

🛠️ Tech Stack

Smart Contracts → Solidity, Hardhat (Local/Sepolia, EVM-compatible for BNB).

Storage → BNB Greenfield SDK + IPFS fallback.

Backend → Node.js/Express, Prisma, ethers/viem.

Frontend → Next.js + Wagmi + Metamask.

AI Layer → Python + HuggingFace.

👥 Team Roles

Blockchain/Backend → Contracts, APIs, event indexer.

Frontend → Next.js marketplace, wallet integration.

ML → HuggingFace pipeline + demo.

Pitch/PM → Slides, storytelling, submission.
