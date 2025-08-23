#!/usr/bin/env python3
"""
LLM Data Marketplace - Dummy Data Removal Script
================================================================

This script removes all dummy/test data from the marketplace and provides
options for clean production deployment.

Author: GitHub Copilot
Date: August 2025
"""

import os
import json
import shutil
from pathlib import Path
from typing import List, Dict, Any

class DummyDataRemover:
    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.backend_path = self.project_root / "llm-data-marketplace" / "backend"
        self.frontend_path = self.project_root / "llm-data-marketplace" / "frontend"
        self.api_file = self.backend_path / "app" / "api" / "api_v1" / "api.py"
        self.hooks_file = self.frontend_path / "src" / "hooks" / "useApi.ts"
        
    def analyze_dummy_data(self) -> Dict[str, Any]:
        """Analyze and report all dummy data locations"""
        print("🔍 ANALYZING DUMMY DATA LOCATIONS...")
        print("=" * 60)
        
        analysis = {
            "backend_datasets": 0,
            "backend_models": 0,
            "root_json_files": 0,
            "frontend_mock_data": False,
            "test_files": 0,
            "locations": []
        }
        
        # 1. Backend API dummy data
        if self.api_file.exists():
            with open(self.api_file, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Count datasets
            if 'DATASETS = [' in content:
                dataset_start = content.find('DATASETS = [')
                dataset_end = content.find(']', dataset_start) + 1
                dataset_section = content[dataset_start:dataset_end]
                dataset_count = dataset_section.count('"id":')
                analysis["backend_datasets"] = dataset_count
                analysis["locations"].append(f"Backend API: {dataset_count} dummy datasets")
                
            # Count models  
            if 'MODELS = [' in content:
                model_start = content.find('MODELS = [')
                model_end = content.find(']', model_start) + 1
                model_section = content[model_start:model_end]
                model_count = model_section.count('"id":')
                analysis["backend_models"] = model_count
                analysis["locations"].append(f"Backend API: {model_count} dummy models")
        
        # 2. Root JSON files
        json_files = list(self.project_root.glob("*.json"))
        dummy_json_files = [f for f in json_files if any(keyword in f.name.lower() 
                           for keyword in ['test', 'dummy', 'sample', 'web3', 'real_wallet'])]
        analysis["root_json_files"] = len(dummy_json_files)
        if dummy_json_files:
            analysis["locations"].append(f"Root directory: {len(dummy_json_files)} JSON test files")
            
        # 3. Frontend mock data
        if self.hooks_file.exists():
            with open(self.hooks_file, 'r', encoding='utf-8') as f:
                content = f.read()
                if 'mock data while backend' in content.lower():
                    analysis["frontend_mock_data"] = True
                    analysis["locations"].append("Frontend: Mock feasibility data in useApi.ts")
        
        # 4. Test files
        test_files = list(self.backend_path.glob("tests/**/*.py"))
        greenfield_tests = [f for f in test_files if 'greenfield' in f.name.lower()]
        analysis["test_files"] = len(greenfield_tests)
        if greenfield_tests:
            analysis["locations"].append(f"Backend tests: {len(greenfield_tests)} Greenfield test files")
            
        return analysis
    
    def create_empty_api_template(self) -> str:
        """Create clean API template without dummy data"""
        return '''from fastapi import APIRouter, HTTPException, Depends, Query, File, UploadFile, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
import json
import time
import uuid
from datetime import datetime
from ...services.blockchain_service import blockchain_service
from ...services.simple_blockchain_service import simple_blockchain_service
from ...services.feasibility_analyzer import DatasetFeasibilityAnalyzer, ModelFeasibilityAnalyzer

router = APIRouter()
security = HTTPBearer()

# Production storage - starts empty, populated by real users
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

# Datasets - Real user uploads only
@router.get("/datasets/")
async def list_datasets(skip: int = Query(0), limit: int = Query(100), active_only: bool = Query(True)):
    """List all datasets (real user uploads only)"""
    datasets = DATASETS
    if active_only:
        datasets = [d for d in datasets if d.get("active", True)]
    return datasets[skip:skip+limit]

@router.post("/datasets/")
async def create_dataset(dataset: Dataset):
    """Create a new dataset"""
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

# Continue with all other endpoints...
# NOTE: This template excludes all dummy data - only real user uploads will appear

# Rest of the API endpoints remain the same...
'''

    def create_clean_hooks_template(self) -> str:
        """Create clean hooks template without mock data"""
        return '''import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient, CreateDatasetRequest } from '../api/client'

// Dataset hooks
export const useDatasets = () => {
  return useQuery({
    queryKey: ['datasets'],
    queryFn: () => apiClient.getDatasets(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useDataset = (id: string) => {
  return useQuery({
    queryKey: ['dataset', id],
    queryFn: async () => {
      const response = await apiClient.getDataset(id)
      return response.data
    },
    enabled: !!id,
  })
}

// Feasibility analysis hooks - now use real backend endpoints
export const useDatasetFeasibility = (datasetId: string) => {
  return useQuery({
    queryKey: ['dataset-feasibility', datasetId],
    queryFn: () => apiClient.getDatasetFeasibility(datasetId),
    enabled: !!datasetId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useModelFeasibility = (modelId: string) => {
  return useQuery({
    queryKey: ['model-feasibility', modelId],
    queryFn: () => apiClient.getModelFeasibility(modelId),
    enabled: !!modelId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Continue with all other hooks...
'''
    
    def remove_dummy_data(self, mode: str = "production") -> None:
        """
        Remove dummy data based on selected mode
        
        Args:
            mode: "production" (remove all), "demo" (keep for demo), "backup" (create backups first)
        """
        print(f"🚀 REMOVING DUMMY DATA (Mode: {mode})")
        print("=" * 60)
        
        if mode == "backup":
            self._create_backups()
        
        if mode in ["production", "backup"]:
            # 1. Clean backend API
            print("🔧 Cleaning backend API...")
            if self.api_file.exists():
                if mode == "backup":
                    shutil.copy2(self.api_file, str(self.api_file) + ".backup")
                
                # For now, just replace the dummy datasets/models arrays
                with open(self.api_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Replace dummy datasets with empty array
                if 'DATASETS = [' in content:
                    start = content.find('DATASETS = [')
                    end = content.find(']', start) + 1
                    # Find the next line after the closing bracket
                    next_newline = content.find('\n', end)
                    if next_newline != -1:
                        end = next_newline
                    
                    content = content[:start] + 'DATASETS = []' + content[end:]
                
                # Replace dummy models with empty array  
                if 'MODELS = [' in content:
                    start = content.find('MODELS = [')
                    end = content.find(']', start) + 1
                    # Find the next line after the closing bracket
                    next_newline = content.find('\n', end)
                    if next_newline != -1:
                        end = next_newline
                    
                    content = content[:start] + 'MODELS = []' + content[end:]
                
                with open(self.api_file, 'w', encoding='utf-8') as f:
                    f.write(content)
                    
                print("   ✅ Backend API cleaned")
            
            # 2. Remove root JSON files
            print("🗑️  Removing test JSON files...")
            json_files = ['test_dataset.json', 'real_wallet_dataset.json', 'web3_dataset.json', 
                         'test_purchase.json', 'real_wallet_purchase.json']
            
            for json_file in json_files:
                file_path = self.project_root / json_file
                if file_path.exists():
                    if mode == "backup":
                        shutil.copy2(file_path, str(file_path) + ".backup")
                    file_path.unlink()
                    print(f"   ✅ Removed {json_file}")
            
            # 3. Clean frontend mock data
            print("🎨 Cleaning frontend mock data...")
            if self.hooks_file.exists():
                if mode == "backup":
                    shutil.copy2(self.hooks_file, str(self.hooks_file) + ".backup")
                
                with open(self.hooks_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Replace mock data in feasibility hooks with real API calls
                if 'Temporary mock data while backend' in content:
                    # Replace the useDatasetFeasibility hook
                    start_marker = "export const useDatasetFeasibility = (datasetId: string) => {"
                    end_marker = "export const useModelFeasibility = (modelId: string) => {"
                    
                    start = content.find(start_marker)
                    end = content.find(end_marker)
                    
                    if start != -1 and end != -1:
                        new_hook = '''export const useDatasetFeasibility = (datasetId: string) => {
  return useQuery({
    queryKey: ['dataset-feasibility', datasetId],
    queryFn: () => apiClient.getDatasetFeasibility(datasetId),
    enabled: !!datasetId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

'''
                        content = content[:start] + new_hook + content[end:]
                    
                    # Similar replacement for useModelFeasibility
                    start_marker = "export const useModelFeasibility = (modelId: string) => {"
                    end_marker = "}"  # Find the closing brace of this function
                    
                    start = content.find(start_marker)
                    if start != -1:
                        # Find the matching closing brace
                        brace_count = 0
                        pos = start + len(start_marker)
                        while pos < len(content):
                            if content[pos] == '{':
                                brace_count += 1
                            elif content[pos] == '}':
                                if brace_count == 0:
                                    end = pos + 1
                                    break
                                brace_count -= 1
                            pos += 1
                        
                        if 'end' in locals():
                            new_hook = '''export const useModelFeasibility = (modelId: string) => {
  return useQuery({
    queryKey: ['model-feasibility', modelId],
    queryFn: () => apiClient.getModelFeasibility(modelId),
    enabled: !!modelId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}'''
                            content = content[:start] + new_hook + content[end:]
                
                with open(self.hooks_file, 'w', encoding='utf-8') as f:
                    f.write(content)
                    
                print("   ✅ Frontend hooks cleaned")
        
        elif mode == "demo":
            print("📋 Demo mode: Adding environment flag to toggle dummy data...")
            # Add environment variable to control dummy data visibility
            # This preserves dummy data but allows hiding it in production
            self._add_demo_flag()
    
    def _create_backups(self) -> None:
        """Create backups of files before modification"""
        print("💾 Creating backups...")
        backup_dir = self.project_root / "backups"
        backup_dir.mkdir(exist_ok=True)
        
        # List files to backup
        files_to_backup = [
            self.api_file,
            self.hooks_file,
            self.project_root / "test_dataset.json",
            self.project_root / "real_wallet_dataset.json", 
            self.project_root / "web3_dataset.json"
        ]
        
        for file_path in files_to_backup:
            if file_path.exists():
                backup_path = backup_dir / f"{file_path.name}.backup"
                shutil.copy2(file_path, backup_path)
                print(f"   ✅ Backed up {file_path.name}")
    
    def _add_demo_flag(self) -> None:
        """Add environment flag to show/hide dummy data"""
        # Add DEMO_MODE environment variable
        env_file = self.backend_path / ".env"
        
        env_content = ""
        if env_file.exists():
            with open(env_file, 'r') as f:
                env_content = f.read()
        
        if "DEMO_MODE=" not in env_content:
            env_content += "\n# Demo Mode - Set to 'false' for production\nDEMO_MODE=true\n"
            
            with open(env_file, 'w') as f:
                f.write(env_content)
            
            print("   ✅ Added DEMO_MODE environment variable")
    
    def generate_report(self) -> None:
        """Generate detailed removal report"""
        analysis = self.analyze_dummy_data()
        
        print("\n📊 DUMMY DATA ANALYSIS REPORT")
        print("=" * 60)
        print(f"Backend Datasets: {analysis['backend_datasets']}")
        print(f"Backend Models: {analysis['backend_models']}")
        print(f"Root JSON Files: {analysis['root_json_files']}")
        print(f"Frontend Mock Data: {'Yes' if analysis['frontend_mock_data'] else 'No'}")
        print(f"Test Files: {analysis['test_files']}")
        
        print("\n📍 LOCATIONS:")
        for location in analysis['locations']:
            print(f"   • {location}")
        
        print(f"\n💾 TOTAL ITEMS TO REMOVE: {analysis['backend_datasets'] + analysis['backend_models'] + analysis['root_json_files']}")
        
    def interactive_removal(self) -> None:
        """Interactive removal with user choices"""
        print("🎯 INTERACTIVE DUMMY DATA REMOVAL")
        print("=" * 60)
        
        self.generate_report()
        
        print("\n🔧 REMOVAL OPTIONS:")
        print("1. 🚀 PRODUCTION MODE - Remove all dummy data (recommended)")
        print("2. 📋 DEMO MODE - Keep dummy data but add toggle flag")
        print("3. 💾 BACKUP + REMOVE - Create backups then remove all")
        print("4. ❌ CANCEL - Just analyze, don't remove anything")
        
        choice = input("\nSelect option (1-4): ").strip()
        
        if choice == "1":
            confirm = input("⚠️  This will permanently remove all dummy data. Continue? (y/N): ").strip().lower()
            if confirm == 'y':
                self.remove_dummy_data("production")
                print("\n🎉 PRODUCTION CLEANUP COMPLETE!")
                print("Your marketplace now starts with clean, empty data stores.")
                print("Users can now upload real datasets and models.")
            else:
                print("❌ Cancelled")
                
        elif choice == "2":
            self.remove_dummy_data("demo")
            print("\n🎉 DEMO MODE CONFIGURED!")
            print("Set DEMO_MODE=false in .env for production")
            
        elif choice == "3":
            confirm = input("⚠️  This will create backups then remove dummy data. Continue? (y/N): ").strip().lower()
            if confirm == 'y':
                self.remove_dummy_data("backup")
                print("\n🎉 BACKUP & CLEANUP COMPLETE!")
                print("Backups created in /backups/ directory")
            else:
                print("❌ Cancelled")
                
        elif choice == "4":
            print("❌ Analysis only - no changes made")
            
        else:
            print("❌ Invalid choice")

def main():
    """Main entry point"""
    print("🔥 LLM DATA MARKETPLACE - DUMMY DATA REMOVAL TOOL")
    print("=" * 60)
    
    # Auto-detect project root
    current_dir = Path.cwd()
    project_root = None
    
    # Look for the marketplace directory
    if (current_dir / "llm-data-marketplace").exists():
        project_root = current_dir
    elif (current_dir.parent / "llm-data-marketplace").exists():
        project_root = current_dir.parent
    elif (current_dir / "sampleuni" / "llm-data-marketplace").exists():
        project_root = current_dir / "sampleuni"
    
    if not project_root:
        print("❌ Could not find LLM Data Marketplace directory")
        print("Please run this script from the project root or sampleuni directory")
        return
    
    print(f"📁 Project root detected: {project_root}")
    
    remover = DummyDataRemover(str(project_root))
    remover.interactive_removal()

if __name__ == "__main__":
    main()
