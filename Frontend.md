📂 Pages in Navbar

Navbar Links →

Home → Landing page showing product overview.

Browse → Marketplace with dataset + model cards + categories (like image 1).

Upload → Upload form (dataset: zip/tar/csv | model: .py).

Dashboard → User’s uploads, purchases, earnings, logs.

Datasets → Dedicated browse page for datasets (clicking a dataset card → detail page like image 2).

Models → Dedicated browse page for models (clicking a model card → detail page).

🏗 Pages & Features
1. Home Page

Hero section: “LLM Data Marketplace” tagline + CTA buttons (Browse, Upload).

Sections: Features (Decentralized ownership, Greenfield/IPFS, ML-ready).

Animated cards (Framer Motion).

2. Browse Page

Search bar, filters (tags, categories: NLP, CV, Classification, etc.).

Grid of cards (datasets + models mixed).

Card info: Title, author, size, format, downloads, price (tBNB).

Buy button → triggers wallet popup.

Category pills (like screenshot).

3. Upload Page

Form inputs:

Title

Description

Tags

File type (Dataset / Model)

File upload (.zip, .tar, .csv, .py)

Price (tBNB)

On submit: Calls FastAPI /upload → contract registerDataset.

4. Dashboard

Tabs:

My Uploads: List of datasets/models uploaded (with status, downloads, earnings).

My Purchases: Datasets/models purchased (with download links).

Earnings: Chart (Recharts line/bar graph).

Logs: History of transactions (bought/sold).

Each dataset/model card → Detail Page (like screenshot 2).

5. Datasets Page

Browse only datasets.

Clicking → detail page like screenshot 2:

Title, description, schema, metadata.

Buy/download button.

Seller info + license.

6. Models Page

Browse only models.

Clicking → model detail page:

Title, description, architecture, metadata.

Buy/download button.

Example usage code snippet.

7. DownloadManager (Popup/Modal)

After purchase: Calls FastAPI /datasets/{id}/download.

Shows loader, then a signed URL for Greenfield/IPFS download.

Success toast + download button.

🧩 Components

Navbar.jsx (wallet connect via wagmi).

Footer.jsx (BNB branding + social links).

DatasetCard.jsx & ModelCard.jsx.

UploadForm.jsx.

PurchaseButton.jsx (Metamask tx + toast).

DownloadModal.jsx.

⚡ Tech Stack

Frontend: React + Vite + JSX + TailwindCSS + Framer Motion.

Wallet: wagmi + ethers.js.

Graphs: Recharts.

Notifications: react-hot-toast.
