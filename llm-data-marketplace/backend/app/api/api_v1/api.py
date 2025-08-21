from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from pydantic import BaseModel

router = APIRouter()

# In-memory storage for demo purposes
DATASETS = []
USERS = {}

class Dataset(BaseModel):
    id: int
    title: str
    description: str
    price: float
    file_url: str
    owner: str

class User(BaseModel):
    wallet_address: str
    balance: float = 1000.0  # Starting balance

@router.get("/connect/{wallet_address}")
async def connect_wallet(wallet_address: str):
    """Connect wallet and return user data"""
    if wallet_address not in USERS:
        USERS[wallet_address] = User(wallet_address=wallet_address)
    return {"status": "connected", "wallet_address": wallet_address, "balance": USERS[wallet_address].balance}

@router.get("/datasets/")
async def list_datasets():
    """List all available datasets"""
    return DATASETS

@router.post("/datasets/")
async def create_dataset(dataset: Dataset):
    """Create a new dataset"""
    DATASETS.append(dataset.dict())
    return {"status": "created", "dataset_id": dataset.id}

@router.post("/purchase/{dataset_id}")
async def purchase_dataset(dataset_id: int, data: Dict[str, str]):
    """Purchase a dataset"""
    wallet_address = data.get("wallet_address")
    if not wallet_address or wallet_address not in USERS:
        raise HTTPException(status_code=400, detail="Wallet not connected")
    
    dataset = next((d for d in DATASETS if d["id"] == dataset_id), None)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    user = USERS[wallet_address]
    if user.balance < dataset["price"]:
        raise HTTPException(status_code=400, detail="Insufficient balance")
    
    # Process payment
    user.balance -= dataset["price"]
    
    return {
        "status": "purchased",
        "dataset": dataset,
        "download_url": f"/download/{dataset_id}",
        "new_balance": user.balance
    }
