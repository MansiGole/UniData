#!/usr/bin/env python3
"""
Simple FastAPI server for testing
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Simple Test API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Simple API is working", "status": "ok"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.get("/api/v1/datasets")
async def get_datasets():
    return [
        {
            "id": 1,
            "title": "Sample Dataset",
            "description": "A test dataset",
            "price": 1.0,
            "category": "Tabular Data",
            "owner": "0x123...",
            "created_at": "2024-01-01"
        }
    ]

@app.get("/api/v1/models")
async def get_models():
    return [
        {
            "id": 1,
            "name": "Sample Model",
            "description": "A test model", 
            "price": 2.0,
            "framework": "PyTorch",
            "owner": "0x123...",
            "created_at": "2024-01-01"
        }
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
