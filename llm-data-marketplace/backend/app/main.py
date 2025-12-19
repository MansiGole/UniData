from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import uvicorn
from pathlib import Path
import os

from app.api.api_v1.api import router as api_router

app = FastAPI(title="LLM Data Marketplace")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create static and templates directories if they don't exist
static_dir = Path("static")
templates_dir = Path("templates")
static_dir.mkdir(exist_ok=True)
templates_dir.mkdir(exist_ok=True)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Include API router
app.include_router(api_router, prefix="/api/v1")

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return """
    <html>
        <head>
            <title>LLM Data Marketplace</title>
            <script src="https://cdn.ethers.io/lib/ethers-5.2.umd.min.js" type="application/javascript"></script>
            <style>
                body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
                .wallet-section { margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
                button { padding: 10px 15px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; }
                button:hover { background: #45a049; }
            </style>
        </head>
        <body>
            <h1>Welcome to LLM Data Marketplace</h1>
            
            <div class="wallet-section">
                <h2>Connect Wallet</h2>
                <button onclick="connectWallet()">Connect MetaMask</button>
                <p id="walletAddress">Not connected</p>
                <p>Balance: <span id="balance">0</span> TOKEN</p>
            </div>

            <div id="menu" style="display: none;">
                <h2>Menu</h2>
                <button onclick="showDatasets()">1. Explore Datasets</button>
                <button onclick="showUploadForm()">2. Upload Dataset</button>
            </div>

            <div id="datasets" style="display: none; margin-top: 20px;">
                <h3>Available Datasets</h3>
                <div id="datasetList"></div>
            </div>

            <div id="uploadForm" style="display: none; margin-top: 20px;">
                <h3>Upload New Dataset</h3>
                <form onsubmit="uploadDataset(event)">
                    <div><label>Title: <input type="text" id="title" required></label></div>
                    <div><label>Description: <textarea id="description" required></textarea></label></div>
                    <div><label>Price: <input type="number" step="0.01" id="price" required></label></div>
                    <div><label>File URL: <input type="url" id="fileUrl" required></label></div>
                    <button type="submit">Upload Dataset</button>
                </form>
            </div>

            <script>
                let currentUser = null;

                async function connectWallet() {
                    if (window.ethereum) {
                        try {
                            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                            const account = accounts[0];
                            document.getElementById('walletAddress').textContent = `Connected: ${account.substring(0, 6)}...${account.substring(38)}`;
                            
                            // Call backend to connect wallet
                            const response = await fetch(`/api/v1/connect/${account}`);
                            const data = await response.json();
                            
                            if (data.status === 'connected') {
                                currentUser = data;
                                document.getElementById('balance').textContent = data.balance;
                                document.getElementById('menu').style.display = 'block';
                            }
                        } catch (error) {
                            console.error(error);
                            alert('Failed to connect wallet');
                        }
                    } else {
                        alert('Please install MetaMask!');
                    }
                }

                async function showDatasets() {
                    const response = await fetch('/api/v1/datasets/');
                    const datasets = await response.json();
                    
                    const datasetList = document.getElementById('datasetList');
                    datasetList.innerHTML = '';
                    
                    datasets.forEach((dataset, index) => {
                        const div = document.createElement('div');
                        div.style.padding = '10px';
                        div.style.borderBottom = '1px solid #eee';
                        div.innerHTML = `
                            <p><strong>${dataset.title}</strong> - ${dataset.price} TOKEN</p>
                            <p>${dataset.description}</p>
                            <button onclick="purchaseDataset(${dataset.id})">Purchase</button>
                        `;
                        datasetList.appendChild(div);
                    });
                    
                    document.getElementById('datasets').style.display = 'block';
                    document.getElementById('uploadForm').style.display = 'none';
                }

                async function purchaseDataset(datasetId) {
                    if (!currentUser) {
                        alert('Please connect your wallet first');
                        return;
                    }
                    
                    try {
                        const response = await fetch(`/api/v1/purchase/${datasetId}`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ wallet_address: currentUser.wallet_address })
                        });
                        
                        const result = await response.json();
                        
                        if (result.status === 'purchased') {
                            alert(`Purchase successful! Download URL: ${result.download_url}`);
                            document.getElementById('balance').textContent = result.new_balance;
                            showDatasets(); // Refresh the dataset list
                        } else {
                            alert('Purchase failed: ' + (result.detail || 'Unknown error'));
                        }
                    } catch (error) {
                        console.error(error);
                        alert('Failed to complete purchase');
                    }
                }

                function showUploadForm() {
                    document.getElementById('datasets').style.display = 'none';
                    document.getElementById('uploadForm').style.display = 'block';
                }

                async function uploadDataset(event) {
                    event.preventDefault();
                    
                    if (!currentUser) {
                        alert('Please connect your wallet first');
                        return;
                    }
                    
                    const dataset = {
                        id: Date.now(), // Simple ID generation for demo
                        title: document.getElementById('title').value,
                        description: document.getElementById('description').value,
                        price: parseFloat(document.getElementById('price').value),
                        file_url: document.getElementById('fileUrl').value,
                        owner: currentUser.wallet_address
                    };
                    
                    try {
                        const response = await fetch('/api/v1/datasets/', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(dataset)
                        });
                        
                        const result = await response.json();
                        
                        if (result.status === 'created') {
                            alert('Dataset created successfully!');
                            document.getElementById('uploadForm').style.display = 'none';
                            showDatasets();
                        } else {
                            alert('Failed to create dataset');
                        }
                    } catch (error) {
                        console.error(error);
                        alert('Failed to upload dataset');
                    }
                }
            </script>
        </body>
    </html>
    """

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
