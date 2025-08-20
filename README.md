# UniData_V0
a BNB-chain powered dataset marketplace where contributors can upload datasets, buyers purchase with tBNB, and contributors automatically earn royalties. Storage defaults to IPFS with optional BNB Greenfield for access-controlled storage. AI/ML workflows run in isolation and consume datasets via signed URLs.

1. Smart Contract Layer (BNB Testnet)

 Dataset Registry:

Register datasets (owner, price, URI, license).

Store immutable reference (IPFS CID or Greenfield Object ID).

 Purchasing Logic:

Buyers pay in tBNB.

Automatic royalty transfer to contributor.

 Access Control Support:

Record buyer entitlement (hasPurchased).

 Admin Controls:

Activate/deactivate datasets.

 Events:

DatasetRegistered, Purchased, Activated.

 Deployment:

Verified contract on BNB Testnet (chainId 97).

Address + ABI committed in repo.

2. Storage Layer

 IPFS Integration (default):

Upload via Web3.Storage / Pinata.

Store CID on-chain.

 BNB Greenfield Adapter (stretch):

Upload dataset to Greenfield bucket.

Contract stores object URI.

Buyer purchase triggers Greenfield permission grant.

3. Backend Layer (Node/Express)

 Event Indexer:

Listen to contract events, persist datasets & purchases.

 APIs:

GET /datasets (list all).

GET /datasets/:id (metadata).

POST /datasets/:id/download (auth + signed URL).

 Wallet Auth:

Verify buyer via signed message.

Check entitlement with hasPurchased.

 Signed URL Handling:

Issue short-lived IPFS gateway links.

(Stretch) Greenfield presigned reads.

4. Frontend Layer (Next.js)

 Dataset Upload:

Form → Upload to storage → call registerDataset.

 Marketplace View:

Browse/search datasets.

Dataset detail page with license + price.

 Purchasing Flow:

Buy with wallet → confirm on-chain.

 My Purchases:

Show purchased datasets.

Enable download via backend.

 Wallet Integration:

Metamask → auto switch to BNB Testnet.

5. AI/ML Layer (Isolated)

 Demo Pipeline:

Download dataset via signed URL.

Fine-tune a HuggingFace model (e.g., sentiment analysis).

 Offline Safety:

ML never writes to contract/storage.

Runs in separate repo/workspace.

 Backup Video:

Record ML fine-tune demo for fallback.

6. Hackathon Deliverables

 Live Demo:

Upload → Buy → Royalty → Download → ML usage.

 Backup Paths:

CLI purchase script + recorded video demo.

 Pitch Deck:

Problem → Solution → Architecture → USP → Demo flow.

 README:

Architecture diagram.

Setup instructions.

Contract address + ABI.

.env.example.

7. Stretch Goals

 Royalty % (basis points) + splits.

 NFT receipt for dataset purchase.

 Greenfield live integration.

 Dataset ratings/reviews.

 Analytics dashboard for contributors.
