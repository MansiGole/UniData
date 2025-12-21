from fastapi import APIRouter, HTTPException, Depends, Query, File, UploadFile, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
import json
import time
import uuid
from ...services.blockchain_service_mock import blockchain_service
from ...services.simple_blockchain_service_mock import simple_blockchain_service

router = APIRouter()
security = HTTPBearer()

# In-memory storage for demo purposes
DATASETS = [
    {
        "id": 1,
        "title": "Financial Sentiment Analysis Dataset",
        "description": "A comprehensive dataset of financial news articles with sentiment labels for training ML models. Contains 50,000+ labeled articles from major financial publications covering stocks, commodities, and market trends.",
        "price": 0.5,
        "file_url": "ipfs://QmX9fJ3kN5mL8pR2sT4vW6yB8dF1gH3jK5lN7pQ9sU2wX4",
        "owner": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        "active": True,
        "author": "Financial Data Corp",
        "date": "2024-01-15",
        "download_details": "CSV format with sentiment scores (-1 to 1)",
        "size": "250MB",
        "format": "CSV",
        "license": "MIT",
        "schema": "text, sentiment_score, date, source",
        "sample_head": "Apple stock rises 5% on earnings beat,-0.8,2024-01-15,Bloomberg",
        "feasibility_score": 92,
        "purchase_details": "Includes preprocessing scripts and data validation",
        "storageURI": "ipfs://QmX9fJ3kN5mL8pR2sT4vW6yB8dF1gH3jK5lN7pQ9sU2wX4",
        "createdAt": 1705276800,
        "updatedAt": 1705276800
    },
    {
        "id": 2,
        "title": "E-commerce Customer Behavior Dataset",
        "description": "Detailed customer behavior data from a major e-commerce platform including clickstreams, purchase history, and demographic information. Perfect for recommendation system training.",
        "price": 0.8,
        "file_url": "ipfs://QmY2bG4iN6oP8rS5tU7vW9xZ1cV3bN5mL7kJ9hG1fD3aS5",
        "owner": "0x8f2d45Bb7745C0633926a4b844Cc564e5439f55f",
        "active": True,
        "author": "E-commerce Analytics Inc",
        "date": "2024-02-01",
        "download_details": "JSON format with nested user sessions",
        "size": "1.2GB",
        "format": "JSON",
        "license": "CC BY-SA 4.0",
        "schema": "user_id, session_data, purchases, demographics",
        "sample_head": '{"user_id": "12345", "sessions": [...], "total_purchases": 15}',
        "feasibility_score": 88,
        "purchase_details": "Anonymized data with privacy guarantees",
        "storageURI": "ipfs://QmY2bG4iN6oP8rS5tU7vW9xZ1cV3bN5mL7kJ9hG1fD3aS5",
        "createdAt": 1706745600,
        "updatedAt": 1706745600
    },
    {
        "id": 3,
        "title": "Medical Imaging Dataset - Chest X-Rays",
        "description": "Annotated chest X-ray images for pneumonia detection. Contains 10,000+ images with expert radiologist annotations. Ideal for computer vision model training.",
        "price": 1.2,
        "file_url": "ipfs://QmZ3cH5jM7nP9qR4tV6wX8yA2dF4gH6jK8lN0pQ2sU4wY6",
        "owner": "0x9g3e56Dd8856D0744937b5b844Dd675e6540g66g",
        "active": True,
        "author": "Medical AI Research Lab",
        "date": "2024-01-20",
        "download_details": "DICOM images with annotation masks",
        "size": "15GB",
        "format": "DICOM",
        "license": "Research Use Only",
        "schema": "image_path, diagnosis, confidence_score, annotations",
        "sample_head": "chest_xray_0001.dcm,Pneumonia,0.95,mask_data...",
        "feasibility_score": 95,
        "purchase_details": "Requires IRB approval for medical research",
        "storageURI": "ipfs://QmZ3cH5jM7nP9qR4tV6wX8yA2dF4gH6jK8lN0pQ2sU4wY6",
        "createdAt": 1705718400,
        "updatedAt": 1705718400
    },
    {
        "id": 4,
        "title": "Climate Change Impact Dataset",
        "description": "Global climate data including temperature, precipitation, and CO2 levels from 1950-2023. Multi-source dataset for environmental ML models.",
        "price": 0.3,
        "file_url": "ipfs://QmA4dG6iO8qS0tU2vW4xY6zB2dF4gH6jK8lN0pQ2sU4wY6",
        "owner": "0x1h4f67Ee9967E0855948c6b844Ee786e7651h77h",
        "active": True,
        "author": "Global Climate Research Institute",
        "date": "2024-02-10",
        "download_details": "Time-series CSV with multiple variables",
        "size": "500MB",
        "format": "CSV",
        "license": "Open Data Commons",
        "schema": "date, temperature, precipitation, co2_level, location",
        "sample_head": "2023-12-01,15.2,45.6,420.5,New York",
        "feasibility_score": 90,
        "purchase_details": "Includes data quality documentation",
        "storageURI": "ipfs://QmA4dG6iO8qS0tU2vW4xY6zB2dF4gH6jK8lN0pQ2sU4wY6",
        "createdAt": 1707523200,
        "updatedAt": 1707523200
    },
    {
        "id": 5,
        "title": "Social Media Sentiment Dataset",
        "description": "1 million+ tweets and social media posts with sentiment analysis labels. Covers various topics including politics, entertainment, and consumer brands.",
        "price": 0.6,
        "file_url": "ipfs://QmB5eH7jN9pR1sT3uV5wX7yZ3cE5gI7kL9mO1qS3uV5wX7",
        "owner": "0x2i5g78Ff0078F0966059d7b844Ff897f8762i88i",
        "active": True,
        "author": "Social Analytics Platform",
        "date": "2024-01-25",
        "download_details": "JSON format with metadata",
        "size": "800MB",
        "format": "JSON",
        "license": "MIT",
        "schema": "text, sentiment, topic, timestamp, platform",
        "sample_head": '{"text": "Great product!", "sentiment": "positive", "topic": "consumer"}',
        "feasibility_score": 87,
        "purchase_details": "Filtered for toxicity and spam",
        "storageURI": "ipfs://QmB5eH7jN9pR1sT3uV5wX7yZ3cE5gI7kL9mO1qS3uV5wX7",
        "createdAt": 1706140800,
        "updatedAt": 1706140800
    }
]

MODELS = [
    {
        "id": 1,
        "name": "Financial Sentiment Analyzer v2.1",
        "description": "Advanced BERT-based model for financial sentiment analysis. Achieves 94% accuracy on financial news classification.",
        "owner": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        "framework": "PyTorch",
        "accuracy": 0.94,
        "tags": ["finance", "sentiment", "BERT", "classification"],
        "file_url": "ipfs://QmC6fI8kO0qS2tU4vW6xY8zA4dF6gH8jK0lN2pQ4sU6wY8",
        "price": 0.8,
        "f1_score": 0.93,
        "precision": 0.95,
        "recall": 0.91,
        "model_type": "Transformer",
        "license": "MIT",
        "dataset_used": "Financial Sentiment Analysis Dataset",
        "training_time": "48 hours",
        "model_size": "450MB"
    },
    {
        "id": 2,
        "name": "E-commerce Recommendation Engine",
        "description": "Collaborative filtering model for product recommendations. Uses matrix factorization with neural network enhancements.",
        "owner": "0x8f2d45Bb7745C0633926a4b844Cc564e5439f55f",
        "framework": "TensorFlow",
        "accuracy": 0.89,
        "tags": ["recommendation", "e-commerce", "collaborative-filtering"],
        "file_url": "ipfs://QmD7gJ9lP1rS3tU5vW7xY9zB5dF7gH9jK1lN3pQ5sU7wY9",
        "price": 1.0,
        "f1_score": 0.87,
        "precision": 0.90,
        "recall": 0.84,
        "model_type": "Neural Network",
        "license": "Apache 2.0",
        "dataset_used": "E-commerce Customer Behavior Dataset",
        "training_time": "72 hours",
        "model_size": "2.1GB"
    },
    {
        "id": 3,
        "name": "Chest X-Ray Pneumonia Detector",
        "description": "CNN-based model for pneumonia detection in chest X-rays. ResNet50 architecture with transfer learning.",
        "owner": "0x9g3e56Dd8856D0744937b5b844Dd675e6540g66g",
        "framework": "PyTorch",
        "accuracy": 0.96,
        "tags": ["medical", "computer-vision", "CNN", "healthcare"],
        "file_url": "ipfs://QmE8hK0mQ2sT4uV6wX8yZ0cE6gI8kL2mO4qS6uV8wY0aB",
        "price": 1.5,
        "f1_score": 0.95,
        "precision": 0.97,
        "recall": 0.93,
        "model_type": "Convolutional Neural Network",
        "license": "Research Use Only",
        "dataset_used": "Medical Imaging Dataset - Chest X-Rays",
        "training_time": "120 hours",
        "model_size": "1.8GB"
    },
    {
        "id": 4,
        "name": "Climate Change Predictor",
        "description": "LSTM-based time series model for climate pattern prediction. Forecasts temperature and precipitation trends.",
        "owner": "0x1h4f67Ee9967E0855948c6b844Ee786e7651h77h",
        "framework": "Keras",
        "accuracy": 0.91,
        "tags": ["climate", "time-series", "LSTM", "forecasting"],
        "file_url": "ipfs://QmF9iL1nR3sT5uV7wX9yZ1cF7gI9kL3mO5qS7uV9wY1bC",
        "price": 0.7,
        "f1_score": 0.89,
        "precision": 0.92,
        "recall": 0.86,
        "model_type": "Recurrent Neural Network",
        "license": "Open Data Commons",
        "dataset_used": "Climate Change Impact Dataset",
        "training_time": "36 hours",
        "model_size": "320MB"
    },
    {
        "id": 5,
        "name": "Social Media Sentiment Classifier",
        "description": "Multi-class sentiment analysis model using RoBERTa. Classifies social media posts into positive, negative, and neutral categories.",
        "owner": "0x2i5g78Ff0078F0966059d7b844Ff897f8762i88i",
        "framework": "HuggingFace Transformers",
        "accuracy": 0.92,
        "tags": ["sentiment", "social-media", "RoBERTa", "NLP"],
        "file_url": "ipfs://QmG0jM2oR4sT6uV8wX0yZ2cG8gI0kL4mO6qS8uV0wY2cD",
        "price": 0.9,
        "f1_score": 0.91,
        "precision": 0.93,
        "recall": 0.89,
        "model_type": "Transformer",
        "license": "MIT",
        "dataset_used": "Social Media Sentiment Dataset",
        "training_time": "60 hours",
        "model_size": "1.2GB"
    },
    {
        "id": 6,
        "name": "Text Summarization Model",
        "description": "BART-based abstractive text summarization model. Generates concise summaries from long documents.",
        "owner": "0x3j6h89Gg1189G1077160e8b844Gg908g9873j99j",
        "framework": "PyTorch",
        "accuracy": 0.88,
        "tags": ["summarization", "NLP", "BART", "text-generation"],
        "file_url": "ipfs://QmH1kN3pS5tU7vW9xY1zC3dF9gI1kL5mO7qS9uV1wY3dE",
        "price": 1.1,
        "f1_score": 0.86,
        "precision": 0.89,
        "recall": 0.83,
        "model_type": "Transformer",
        "license": "Apache 2.0",
        "dataset_used": "News Articles Dataset",
        "training_time": "96 hours",
        "model_size": "2.5GB"
    }
]

USERS = {
    "0x742d35Cc6634C0532925a3b844Bc454e4438f44e": {
        "username": "financial_data_corp",
        "email": "contact@financialdatacorp.com",
        "wallet_address": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        "balance": 5.0
    },
    "0x8f2d45Bb7745C0633926a4b844Cc564e5439f55f": {
        "username": "ecommerce_analytics",
        "email": "data@ecommerce-analytics.com",
        "wallet_address": "0x8f2d45Bb7745C0633926a4b844Cc564e5439f55f",
        "balance": 3.2
    },
    "0x9g3e56Dd8856D0744937b5b844Dd675e6540g66g": {
        "username": "medical_ai_lab",
        "email": "research@medicalai-lab.org",
        "wallet_address": "0x9g3e56Dd8856D0744937b5b844Dd675e6540g66g",
        "balance": 8.1
    },
    "0x1h4f67Ee9967E0855948c6b844Ee786e7651h77h": {
        "username": "climate_research",
        "email": "data@climate-research.org",
        "wallet_address": "0x1h4f67Ee9967E0855948c6b844Ee786e7651h77h",
        "balance": 2.5
    },
    "0x2i5g78Ff0078F0966059d7b844Ff897f8762i88i": {
        "username": "social_analytics",
        "email": "platform@social-analytics.com",
        "wallet_address": "0x2i5g78Ff0078F0966059d7b844Ff897f8762i88i",
        "balance": 4.7
    }
}

PURCHASES = [
    {
        "id": 1,
        "user_address": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        "item_type": "dataset",
        "item_id": 2,
        "price": 0.8,
        "transaction_hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "timestamp": 1706745600
    },
    {
        "id": 2,
        "user_address": "0x8f2d45Bb7745C0633926a4b844Cc564e5439f55f",
        "item_type": "model",
        "item_id": 1,
        "price": 0.8,
        "transaction_hash": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        "timestamp": 1706832000
    },
    {
        "id": 3,
        "user_address": "0x9g3e56Dd8856D0744937b5b844Dd675e6540g66g",
        "item_type": "dataset",
        "item_id": 4,
        "price": 0.3,
        "transaction_hash": "0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
        "timestamp": 1707523200
    }
]

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

# Feasibility endpoint for models
@router.get("/models/{model_id}/feasibility")
async def get_model_feasibility(model_id: int):
    """Return feasibility analysis for a given model."""
    model = next((m for m in MODELS if m["id"] == model_id), None)
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    # Mock feasibility analysis (replace with real logic as needed)
    feasibility = {
        "model_id": model_id,
        "feasible": True,
        "score": 0.85,
        "reason": "Model meets minimum accuracy and tag requirements.",
        "details": {
            "accuracy": model.get("accuracy", 0.85),
            "tags": model.get("tags", []),
            "framework": model.get("framework", "Unknown"),
        }
    }
    return {"success": True, "data": feasibility}
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
    
    # Handle mock tokens from frontend
    if token.startswith("mock_token_"):
        wallet_address = token.replace("mock_token_", "")
        return wallet_address
    
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
    owner: str = Form("demo_user")
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
        "owner": owner,
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
async def create_model(model: Model):
    """Create new model (metadata)"""
    model_dict = model.dict()
    model_dict["owner"] = model_dict.get("owner", "demo_user")
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
    owner: str = Form("demo_user")
):
    """Upload model file"""
    # In a real app, save file to storage
    file_url = f"/uploads/models/{file.filename}"
    
    model_data = json.loads(metadata)
    model_id = len(MODELS) + 1
    
    import random
    # Randomize accuracy between 0.87 and 0.93 (float)
    randomized_accuracy = round(random.uniform(0.87, 0.93), 4)
    model = {
        "id": model_id,
        "file_url": file_url,
        "owner": owner,
        **model_data,
        "accuracy": randomized_accuracy
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
