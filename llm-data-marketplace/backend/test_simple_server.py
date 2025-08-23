#!/usr/bin/env python3
"""
Simple server test to check what's causing the shutdown
"""

import uvicorn
from fastapi import FastAPI

# Test basic FastAPI app
app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Test server running"}

@app.get("/test")
def test():
    return {"status": "ok", "data": [1, 2, 3]}

if __name__ == "__main__":
    print("Starting test server...")
    uvicorn.run(app, host="127.0.0.1", port=8001)
