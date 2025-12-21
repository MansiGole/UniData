from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
import uvicorn
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

# Mount static files directory (where built frontend will be placed)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Include API router
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def serve_frontend():
    return FileResponse("static/index.html")

@app.get("/api")
async def home(request: Request):
    return {"message": "LLM Data Marketplace API", "status": "running"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
