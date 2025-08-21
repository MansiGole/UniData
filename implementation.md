📅 Timeline & Scrum Plan
Aug 20 — Planning & Scaffolding

Lock architecture + write docs (this file).

Monorepo scaffolding: contracts, backend, frontend.

Add .env.example.

Aug 21 — Offline Build (Post Exam)

Implement & test DatasetMarket contract.

Deploy locally/Sepolia; commit ABI + address.

Implement IPFS adapter + backend APIs.

Frontend scaffolding (upload, explore, buy, purchases).

Aug 22 (Hackathon Day 1)

Morning (Parth solo): ML pipeline + backup demo video.

Team afternoon: Integrate frontend ↔ backend ↔ contract.

Event indexer live.

Polish UI with BNB branding.

Aug 23 (Hackathon Day 2)

Morning (Parth solo): Validate ML end-to-end.

Team afternoon: Implement Greenfield adapter (if time).

Bug bash, record final demo, prep submission.

⚙️ Architecture
Smart Contract

Local/Hardhat (fallback Sepolia).

Functions: registerDataset, purchaseDataset, setActive, getDataset, hasPurchased.

Events: DatasetRegistered, Purchased, Activated.

Royalty = 100% to uploader (MVP).

Storage

BNB Greenfield SDK: Upload dataset, record object ID, grant buyer read access.

Fallback: IPFS with gateway link.

Backend

Indexing: Listen to events, persist to SQLite/Prisma.

APIs:

GET /datasets

GET /datasets/:id

POST /datasets/:id/download (wallet sig + entitlement check).

Adapters: Greenfield + IPFS.

Frontend

Pages: /upload, /explore, /dataset/:id, /my-purchases.

Wallet integration: Wagmi + Metamask → local/sep chain.

Purchase flow: Metamask popup → tx confirmed → dataset access.

ML Layer

Isolated repo; no write perms to infra.

Consumes signed download URL.

HuggingFace fine-tune demo on CSV.

🔒 Fault Tolerance

Pre-deploy contract + record ABI.

CLI scripts to simulate purchase if frontend fails.

Backup demo video (Parth).

IPFS fallback if Greenfield API fails.

📂 Repo Structure
llm-data-marketplace/
  apps/
    web/        # Next.js frontend
    api/        # Express backend
  packages/
    contracts/  # Hardhat + Solidity
    storage/    # IPFS + Greenfield adapters
    shared/     # Types, ABI, utils
✅ Definition of Done

Local/Sepolia contracts deployed + ABI in repo.

End-to-end flow: upload → buy → download → ML consume.

Greenfield SDK integration (optional stretch).

Backup video ready.

README + Implementation docs in repo.
