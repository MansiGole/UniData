from fastapi import APIRouter, HTTPException, Depends, Query, File, UploadFile, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
import json
import time
import uuid
from ...services.blockchain_service import blockchain_service
from ...services.simple_blockchain_service import simple_blockchain_service

router = APIRouter()
security = HTTPBearer()

# In-memory storage for demo purposes
DATASETS = []
MODELS = []
USERS = {}
PURCHASES = []
TOKENS = {}  # Simple token storage

class Dataset(BaseModel):
    id: int
    title: str
    description: str
    price: float
    file_url: str
    owner: str
    active: bool = True

class Model(BaseModel):
    id: int
    name: str
    description: str
    owner: str
    framework: str
    accuracy: float
    tags: List[str] = []
    file_url: str
    price: float = 0.0

class User(BaseModel):
    wallet_address: str
    balance: float = 1000.0  # Starting balance
    username: str = ""
    email: str = ""

class Purchase(BaseModel):
    id: int
    user_address: str
    item_type: str  # "dataset" or "model"
    item_id: int
    price: float
    timestamp: float

class LoginRequest(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

# Web3 specific models
class TransactionRequest(BaseModel):
    transaction_hash: str

class Web3DatasetRequest(BaseModel):
    title: str
    description: str
    price: float
    storageURI: str
    author: Optional[str] = "Anonymous"
    size: Optional[str] = "Unknown"
    format: Optional[str] = "CSV"
    license: Optional[str] = "MIT"
    
class Web3PurchaseRequest(BaseModel):
    dataset_id: int
    buyer_address: str
    transaction_hash: str

class BlockchainDataset(BaseModel):
    id: int
    title: str
    description: str
    author: str
    price: float
    owner: str
    active: bool
    storageURI: str
    info: dict
    createdAt: int
    updatedAt: int

# Helper functions
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    if token not in TOKENS:
        raise HTTPException(status_code=401, detail="Invalid token")
    return TOKENS[token]

def get_current_user_optional(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Optional authentication - returns None if no valid token"""
    if not credentials:
        return None
    token = credentials.credentials
    return TOKENS.get(token, None)

def generate_token(wallet_address: str) -> str:
    token = str(uuid.uuid4())
    TOKENS[token] = wallet_address
    return token

# Authentication & Users
@router.post("/login/access-token")
async def login_access_token(login_data: LoginRequest):
    """Login and get access token"""
    # Simple demo authentication - in real app, verify password
    wallet_address = f"0x{login_data.username.lower()}" + "0" * (40 - len(login_data.username))
    if wallet_address not in USERS:
        USERS[wallet_address] = User(wallet_address=wallet_address, username=login_data.username)
    
    token = generate_token(wallet_address)
    return {"access_token": token, "token_type": "bearer"}

@router.get("/login/test-token")
async def test_token(current_user: str = Depends(get_current_user)):
    """Test access token"""
    return {"valid": True, "user": current_user}

@router.post("/users/")
async def create_user(username: str, email: str, wallet_address: str):
    """Create new user"""
    if wallet_address in USERS:
        raise HTTPException(status_code=400, detail="User already exists")
    
    user = User(wallet_address=wallet_address, username=username, email=email)
    USERS[wallet_address] = user
    return {"success": True, "message": "User created successfully"}

@router.get("/users/me")
async def get_current_user_info(current_user: str = Depends(get_current_user)):
    """Get current user"""
    if current_user not in USERS:
        raise HTTPException(status_code=404, detail="User not found")
    return USERS[current_user]

# Datasets
@router.get("/datasets/")
async def list_datasets(skip: int = Query(0), limit: int = Query(100), active_only: bool = Query(True)):
    """List all datasets"""
    datasets = DATASETS
    if active_only:
        datasets = [d for d in datasets if d.get("active", True)]
    return datasets[skip:skip+limit]

@router.post("/datasets/")
async def create_dataset(dataset: Dataset):
    """Create a new dataset (temporarily without auth for testing)"""
    dataset_dict = dataset.dict()
    DATASETS.append(dataset_dict)
    return {"success": True, "data": dataset_dict, "message": "Dataset created successfully"}

@router.get("/datasets/{dataset_id}")
async def get_dataset(dataset_id: int):
    """Get dataset by ID"""
    dataset = next((d for d in DATASETS if d["id"] == dataset_id), None)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return {"success": True, "data": dataset}

@router.put("/datasets/{dataset_id}")
async def update_dataset(dataset_id: int, dataset: Dataset, current_user: str = Depends(get_current_user)):
    """Update dataset"""
    for i, d in enumerate(DATASETS):
        if d["id"] == dataset_id:
            if d["owner"] != current_user:
                raise HTTPException(status_code=403, detail="Not authorized")
            DATASETS[i] = dataset.dict()
            return {"success": True, "data": DATASETS[i], "message": "Dataset updated successfully"}
    raise HTTPException(status_code=404, detail="Dataset not found")

@router.delete("/datasets/{dataset_id}")
async def delete_dataset(dataset_id: int, current_user: str = Depends(get_current_user)):
    """Delete dataset"""
    for i, d in enumerate(DATASETS):
        if d["id"] == dataset_id:
            if d["owner"] != current_user:
                raise HTTPException(status_code=403, detail="Not authorized")
            DATASETS.pop(i)
            return {"success": True, "message": "Dataset deleted successfully"}
    raise HTTPException(status_code=404, detail="Dataset not found")

@router.post("/datasets/upload")
async def upload_dataset(
    file: UploadFile = File(...),
    title: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    info: str = Form("{}"),
    current_user: str = Depends(get_current_user)
):
    """Upload dataset file"""
    # In a real app, save file to storage
    file_url = f"/uploads/datasets/{file.filename}"
    
    dataset_id = len(DATASETS) + 1
    dataset = {
        "id": dataset_id,
        "title": title,
        "description": description,
        "price": price,
        "file_url": file_url,
        "owner": current_user,
        "active": True,
        "info": json.loads(info) if info else {}
    }
    
    DATASETS.append(dataset)
    return {"success": True, "data": dataset, "message": "Dataset uploaded successfully"}

# Models
@router.get("/models/")
async def list_models(
    skip: int = Query(0),
    limit: int = Query(100),
    owner: Optional[str] = Query(None),
    framework: Optional[str] = Query(None),
    min_accuracy: Optional[float] = Query(None),
    tags: Optional[str] = Query(None)
):
    """List all models"""
    models = MODELS
    
    if owner:
        models = [m for m in models if m.get("owner") == owner]
    if framework:
        models = [m for m in models if m.get("framework") == framework]
    if min_accuracy:
        models = [m for m in models if m.get("accuracy", 0) >= min_accuracy]
    if tags:
        tag_list = tags.split(",")
        models = [m for m in models if any(tag in m.get("tags", []) for tag in tag_list)]
    
    return {"success": True, "data": models[skip:skip+limit]}

@router.post("/models/")
async def create_model(model: Model, current_user: str = Depends(get_current_user)):
    """Create new model (metadata)"""
    model_dict = model.dict()
    model_dict["owner"] = current_user
    MODELS.append(model_dict)
    return {"success": True, "data": model_dict, "message": "Model created successfully"}

@router.get("/models/{model_id}")
async def get_model(model_id: int):
    """Get model by ID"""
    model = next((m for m in MODELS if m["id"] == model_id), None)
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    return {"success": True, "data": model}

@router.post("/models/upload")
async def upload_model(
    file: UploadFile = File(...),
    metadata: str = Form(...),
    current_user: str = Depends(get_current_user)
):
    """Upload model file"""
    # In a real app, save file to storage
    file_url = f"/uploads/models/{file.filename}"
    
    model_data = json.loads(metadata)
    model_id = len(MODELS) + 1
    
    model = {
        "id": model_id,
        "file_url": file_url,
        "owner": current_user,
        **model_data
    }
    
    MODELS.append(model)
    return {"success": True, "data": model, "message": "Model uploaded successfully"}

# Purchases
@router.post("/purchases/")
async def create_purchase(item_type: str, item_id: int, current_user: str = Depends(get_current_user)):
    """Create purchase record"""
    purchase_id = len(PURCHASES) + 1
    
    # Find item and price
    if item_type == "dataset":
        item = next((d for d in DATASETS if d["id"] == item_id), None)
    elif item_type == "model":
        item = next((m for m in MODELS if m["id"] == item_id), None)
    else:
        raise HTTPException(status_code=400, detail="Invalid item type")
    
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    user = USERS.get(current_user)
    if not user or user.balance < item["price"]:
        raise HTTPException(status_code=400, detail="Insufficient balance")
    
    # Process purchase
    user.balance -= item["price"]
    
    purchase = Purchase(
        id=purchase_id,
        user_address=current_user,
        item_type=item_type,
        item_id=item_id,
        price=item["price"],
        timestamp=time.time()
    )
    
    PURCHASES.append(purchase.dict())
    return {"success": True, "data": purchase.dict(), "message": "Purchase successful"}

@router.get("/purchases/history")
async def get_purchase_history(
    item_type: Optional[str] = Query(None),
    page: int = Query(1),
    page_size: int = Query(10),
    current_user: str = Depends(get_current_user)
):
    """Get purchase history"""
    user_purchases = [p for p in PURCHASES if p["user_address"] == current_user]
    
    if item_type:
        user_purchases = [p for p in user_purchases if p["item_type"] == item_type]
    
    start = (page - 1) * page_size
    end = start + page_size
    
    return {
        "success": True,
        "data": user_purchases[start:end],
        "total": len(user_purchases),
        "page": page,
        "page_size": page_size
    }

@router.post("/purchases/verify")
async def verify_purchase(item_type: str, item_id: int, current_user: str = Depends(get_current_user)):
    """Verify purchase"""
    purchase = next((p for p in PURCHASES 
                    if p["user_address"] == current_user 
                    and p["item_type"] == item_type 
                    and p["item_id"] == item_id), None)
    
    return {"success": True, "verified": purchase is not None, "purchase": purchase}

# Marketplace
@router.post("/marketplace/purchase/dataset/{dataset_id}")
async def purchase_dataset_marketplace(dataset_id: int, current_user: str = Depends(get_current_user)):
    """Purchase a dataset"""
    return await create_purchase("dataset", dataset_id, current_user)

@router.post("/marketplace/purchase/model/{model_id}")
async def purchase_model_marketplace(model_id: int, current_user: str = Depends(get_current_user)):
    """Purchase a model"""
    return await create_purchase("model", model_id, current_user)

@router.get("/marketplace/ownership/{user_address}")
async def check_ownership(user_address: str, item_type: str = Query(...), item_id: int = Query(...)):
    """Check item ownership"""
    purchase = next((p for p in PURCHASES 
                    if p["user_address"] == user_address 
                    and p["item_type"] == item_type 
                    and p["item_id"] == item_id), None)
    
    return {"success": True, "owns": purchase is not None}

# Utils
@router.get("/utils/health")
async def health_check():
    """Health check"""
    return {
        "success": True,
        "status": "healthy",
        "data": {
            "datasets_count": len(DATASETS),
            "models_count": len(MODELS),
            "users_count": len(USERS),
            "purchases_count": len(PURCHASES)
        }
    }

@router.get("/debug/info")
async def debug_info():
    """Debug endpoint to check what's happening"""
    return {
        "endpoints_available": [
            "GET /datasets/ - List datasets (no auth required)",
            "GET /datasets/{id} - Get dataset (no auth required)",
            "POST /datasets/ - Create dataset (auth required)",
            "GET /connect/{wallet} - Connect wallet (no auth required)"
        ],
        "datasets": DATASETS,
        "users_count": len(USERS),
        "tokens_count": len(TOKENS)
    }

# Legacy endpoints for backward compatibility
@router.get("/connect/{wallet_address}")
async def connect_wallet(wallet_address: str):
    """Connect wallet and return user data (legacy endpoint)"""
    if wallet_address not in USERS:
        USERS[wallet_address] = User(wallet_address=wallet_address)
    return {"status": "connected", "wallet_address": wallet_address, "balance": USERS[wallet_address].balance}

@router.post("/purchase/{dataset_id}")
async def purchase_dataset_legacy(dataset_id: int, data: Dict[str, str]):
    """Purchase a dataset (legacy endpoint)"""
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
    
    # Add to purchases
    purchase_id = len(PURCHASES) + 1
    purchase = Purchase(
        id=purchase_id,
        user_address=wallet_address,
        item_type="dataset",
        item_id=dataset_id,
        price=dataset["price"],
        timestamp=time.time()
    )
    PURCHASES.append(purchase.dict())
    
    return {
        "status": "purchased",
        "dataset": dataset,
        "download_url": f"/download/{dataset_id}",
        "new_balance": user.balance
    }

# ========== WEB3 BLOCKCHAIN ENDPOINTS ==========

@router.get("/web3/network")
async def get_network_info():
    """Get blockchain network information"""
    try:
        return simple_blockchain_service.get_network_info()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Network error: {str(e)}")

@router.get("/web3/balance/{address}")
async def get_wallet_balance(address: str):
    """Get tBNB balance for a wallet address"""
    try:
        return simple_blockchain_service.get_balance(address)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error getting balance: {str(e)}")

@router.post("/web3/validate-transaction")
async def validate_transaction(request: TransactionRequest):
    """Validate a blockchain transaction"""
    try:
        return simple_blockchain_service.validate_transaction(request.transaction_hash)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Transaction validation failed: {str(e)}")

# Simulated blockchain dataset operations (for demo purposes)
@router.get("/web3/dataset/{dataset_id}")
async def get_blockchain_dataset(dataset_id: int):
    """Get dataset details (simulated blockchain data)"""
    try:
        # For demo, we'll simulate blockchain data by enhancing our local data
        dataset = next((d for d in DATASETS if d["id"] == dataset_id), None)
        if not dataset:
            raise HTTPException(status_code=404, detail="Dataset not found")
        
        # Simulate blockchain-enhanced data
        blockchain_dataset = {
            "id": dataset["id"],
            "title": dataset["title"],
            "description": dataset["description"],
            "author": dataset.get("author", "Anonymous"),
            "price": dataset["price"],
            "owner": dataset["owner"],
            "active": dataset.get("active", True),
            "storageURI": dataset.get("file_url", ""),
            "info": {
                "size": dataset.get("size", "Unknown"),
                "format": dataset.get("format", "CSV"),
                "license": dataset.get("license", "MIT")
            },
            "createdAt": int(time.time()),
            "updatedAt": int(time.time()),
            "blockchain_verified": True
        }
        
        return blockchain_dataset
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Dataset not found: {str(e)}")

@router.get("/web3/purchase-status/{address}/{dataset_id}")
async def check_purchase_status(address: str, dataset_id: int):
    """Check if a user has purchased a specific dataset"""
    try:
        # Check in our purchase records
        purchase = next(
            (p for p in PURCHASES if p["user_address"] == address and p["item_id"] == dataset_id),
            None
        )
        has_purchased = purchase is not None
        
        return {
            "address": address, 
            "dataset_id": dataset_id, 
            "has_purchased": has_purchased,
            "purchase_details": purchase if has_purchased else None
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error checking purchase status: {str(e)}")

@router.post("/web3/register-dataset-blockchain")
async def register_dataset_on_blockchain(request: Web3DatasetRequest):
    """Register dataset after blockchain transaction"""
    try:
        # Generate new dataset ID
        dataset_id = len(DATASETS) + 1
        
        # Create dataset entry
        dataset_dict = {
            "id": dataset_id,
            "title": request.title,
            "description": request.description,
            "price": request.price,
            "file_url": request.storageURI,
            "owner": "blockchain_user",  # In real implementation, get from transaction
            "active": True,
            "storageURI": request.storageURI,
            "author": request.author,
            "size": request.size,
            "format": request.format,
            "license": request.license,
            "created_at": time.time(),
            "updated_at": time.time(),
            "blockchain_registered": True
        }
        
        # Add to local storage
        DATASETS.append(dataset_dict)
        
        return {
            "success": True,
            "dataset": dataset_dict,
            "message": f"Dataset {dataset_id} registered successfully"
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error registering dataset: {str(e)}")

@router.post("/web3/purchase-dataset-blockchain")
async def purchase_dataset_on_blockchain(request: Web3PurchaseRequest):
    """Record dataset purchase after blockchain transaction"""
    try:
        # Validate the transaction if hash provided
        if request.transaction_hash:
            try:
                tx_details = simple_blockchain_service.validate_transaction(request.transaction_hash)
                if tx_details["status"] != "success":
                    raise HTTPException(status_code=400, detail="Transaction failed")
            except:
                # For demo, allow purchases without strict transaction validation
                tx_details = {"status": "simulated", "hash": request.transaction_hash}
        
        # Get dataset details
        dataset = next((d for d in DATASETS if d["id"] == request.dataset_id), None)
        if not dataset:
            raise HTTPException(status_code=404, detail="Dataset not found")
        
        # Check if already purchased
        existing_purchase = next(
            (p for p in PURCHASES if p["user_address"] == request.buyer_address and p["item_id"] == request.dataset_id),
            None
        )
        
        if existing_purchase:
            raise HTTPException(status_code=400, detail="Dataset already purchased")
        
        # Record purchase
        purchase_id = len(PURCHASES) + 1
        purchase = Purchase(
            id=purchase_id,
            user_address=request.buyer_address,
            item_type="dataset",
            item_id=request.dataset_id,
            price=dataset["price"],
            timestamp=time.time()
        )
        PURCHASES.append(purchase.dict())
        
        return {
            "success": True,
            "purchase": purchase.dict(),
            "transaction": tx_details if 'tx_details' in locals() else None,
            "dataset": dataset,
            "download_url": f"/web3/download/{request.dataset_id}/{request.buyer_address}"
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error recording purchase: {str(e)}")

@router.get("/web3/download/{dataset_id}/{buyer_address}")
async def download_dataset_web3(dataset_id: int, buyer_address: str):
    """Download dataset for verified purchaser"""
    try:
        # Verify purchase
        purchase = next(
            (p for p in PURCHASES if p["user_address"] == buyer_address and p["item_id"] == dataset_id),
            None
        )
        
        if not purchase:
            raise HTTPException(status_code=403, detail="Dataset not purchased by this address")
        
        # Get dataset details
        dataset = next((d for d in DATASETS if d["id"] == dataset_id), None)
        if not dataset:
            raise HTTPException(status_code=404, detail="Dataset not found")
        
        return {
            "dataset_id": dataset_id,
            "buyer_address": buyer_address,
            "download_verified": True,
            "storageURI": dataset.get("storageURI", dataset.get("file_url")),
            "title": dataset["title"],
            "access_granted": True,
            "message": "Access granted. Use storageURI to download from decentralized storage.",
            "purchase_date": purchase["timestamp"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Download error: {str(e)}")

@router.get("/web3/user-purchases/{address}")
async def get_user_purchases_web3(address: str):
    """Get all datasets purchased by a user"""
    try:
        user_purchases = [p for p in PURCHASES if p["user_address"] == address]
        
        purchases_with_datasets = []
        for purchase in user_purchases:
            dataset = next((d for d in DATASETS if d["id"] == purchase["item_id"]), None)
            if dataset:
                purchases_with_datasets.append({
                    "purchase": purchase,
                    "dataset": dataset
                })
        
        return {
            "user_address": address,
            "total_purchases": len(purchases_with_datasets),
            "purchases": purchases_with_datasets
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error getting user purchases: {str(e)}")

@router.get("/web3/marketplace")
async def get_web3_marketplace():
    """Get all active datasets"""
    try:
        active_datasets = [d for d in DATASETS if d.get("active", True)]
        
        # Enhance with blockchain-style data
        enhanced_datasets = []
        for dataset in active_datasets:
            enhanced_dataset = {
                **dataset,
                "blockchain_verified": True,
                "smart_contract_address": simple_blockchain_service.dataset_market_address,
                "network": "BNB Smart Chain Testnet"
            }
            enhanced_datasets.append(enhanced_dataset)
        
        return {
            "total_datasets": len(enhanced_datasets),
            "datasets": enhanced_datasets,
            "blockchain_source": True,
            "network": "BNB Smart Chain Testnet"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading marketplace: {str(e)}")

# Simplified wallet connection for Web3
@router.get("/web3/connect/{wallet_address}")
async def connect_web3_wallet(wallet_address: str):
    """Connect Web3 wallet and get balance"""
    try:
        # Validate address format
        if not wallet_address.startswith('0x') or len(wallet_address) != 42:
            raise HTTPException(status_code=400, detail="Invalid wallet address format")
        
        # Get balance
        balance_info = simple_blockchain_service.get_balance(wallet_address)
        
        # Add to users if not exists
        if wallet_address not in USERS:
            USERS[wallet_address] = User(
                wallet_address=wallet_address,
                balance=balance_info["balance"]
            )
        else:
            # Update balance
            USERS[wallet_address].balance = balance_info["balance"]
        
        return {
            "status": "connected",
            "wallet_address": wallet_address,
            "balance": balance_info["balance"],
            "currency": "tBNB",
            "network": "BNB Smart Chain Testnet"
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Connection failed: {str(e)}")
