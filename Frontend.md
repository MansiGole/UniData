# prompt_frontend.py

frontend_prompt = """
You are building a React + Vite + TailwindCSS frontend for a hackathon project called 
'LLM Data Marketplace'. The design inspiration is Kaggle-style dataset/model pages.

📂 Pages in Navbar
- Home → Landing page with product overview
- Browse → Marketplace with dataset + model cards + categories
- Upload → Upload form (dataset: zip/tar/csv | model: .py)
- Dashboard → User’s uploads, purchases, earnings, logs
- Datasets → Browse only datasets, with detail pages
- Models → Browse only models, with detail pages

🏗 Pages & Features

1. Home Page
- Hero: “LLM Data Marketplace” + CTA buttons (Browse, Upload)
- Sections: Features (Decentralized, Greenfield/IPFS, ML-ready)
- Animated cards (Framer Motion)

2. Browse Page
- Search bar, filters (tags, categories like NLP, CV, Classification)
- Grid of cards (datasets + models mixed)
- Card info: Title, author, size, format, downloads, price (tBNB)
- Buy button → triggers wallet popup
- Category pills

3. Upload Page
- Form inputs: Title, Description, Tags, File Type, File Upload, Price
- On submit: Calls FastAPI /upload → contract registerDataset

4. Dashboard
- Tabs:
  • My Uploads → List of user’s uploads with status, downloads, earnings
  • My Purchases → List of purchased items with download links
  • Earnings → Chart (Recharts line/bar graph)
  • Logs → Tx history
- Each dataset/model card links to a detail page

5. Datasets Page
- Browse only datasets
- Detail page: Title, description, schema, metadata
- Buy/download button
- Seller info + license

6. Models Page
- Browse only models
- Detail page: Title, description, architecture, metadata
- Buy/download button
- Example usage code snippet

7. DownloadManager (Popup/Modal)
- After purchase: Calls FastAPI /datasets/{id}/download
- Shows loader, then a signed URL for Greenfield/IPFS download
- Toasts + download button

🧩 Components
- Navbar.jsx (wallet connect via wagmi)
- Footer.jsx (BNB branding + social links)
- DatasetCard.jsx & ModelCard.jsx
- UploadForm.jsx
- PurchaseButton.jsx (Metamask tx + toast)
- DownloadModal.jsx

⚡ Tech Stack
- React + Vite + JSX + TailwindCSS + Framer Motion
- wagmi + ethers.js (wallet integration)
- Recharts (charts)
- react-hot-toast (notifications)

✅ Goal
Scaffold a minimal but functional frontend with these pages, components, and flows.
Focus on hackathon speed: working navigation, wallet connect, upload, purchase, 
download, and dashboard views.
"""
