import click
import requests
import json
import os
from pathlib import Path
from web3 import Web3
from eth_account import Account
from eth_account.messages import encode_defunct
from typing import Optional

# Configuration
CONFIG_FILE = Path.home() / ".llm_marketplace_config.json"
API_URL = "http://localhost:8000/api/v1"

class Config:
    def __init__(self):
        self.data = self._load_config()
    
    def _load_config(self):
        if CONFIG_FILE.exists():
            try:
                with open(CONFIG_FILE, 'r') as f:
                    return json.load(f)
            except json.JSONDecodeError:
                return {}
        return {}
    
    def save(self):
        with open(CONFIG_FILE, 'w') as f:
            json.dump(self.data, f, indent=2)
    
    def get_wallet(self) -> Optional[dict]:
        return self.data.get("wallet")
    
    def set_wallet(self, address: str, private_key: str):
        if "wallet" not in self.data:
            self.data["wallet"] = {}
        self.data["wallet"]["address"] = address
        self.data["wallet"]["private_key"] = private_key
        self.save()

config = Config()

def print_error(message: str):
    click.echo(click.style(f"Error: {message}", fg="red"))

def print_success(message: str):
    click.echo(click.style(message, fg="green"))

def print_info(message: str):
    click.echo(click.style(message, fg="blue"))

@click.group()
def cli():
    """LLM Data Marketplace CLI"""
    pass

@cli.command()
def connect_wallet():
    """Connect your Ethereum wallet"""
    private_key = click.prompt("Enter your private key (keep this secure!)", hide_input=True)
    
    try:
        account = Account.from_key(private_key)
        config.set_wallet(account.address, private_key)
        print_success(f"Connected wallet: {account.address}")
    except Exception as e:
        print_error(f"Invalid private key: {e}")

@cli.command()
@click.argument("file_path", type=click.Path(exists=True))
@click.option("--title", prompt="Dataset title", help="Name of the dataset")
@click.option("--description", prompt="Description", help="Description of the dataset")
@click.option("--price", type=float, prompt="Price in BNB", help="Price in BNB")
@click.option("--dtype", type=click.Choice(["dataset", "model"], case_sensitive=False), 
              default="dataset", help="Type of data (dataset or model)")
def upload(file_path: str, title: str, description: str, price: float, dtype: str):
    """Upload a new dataset or model"""
    wallet = config.get_wallet()
    if not wallet:
        print_error("Please connect your wallet first using 'connect-wallet'")
        return
    
    try:
        # Convert price to wei
        price_wei = int(price * 10**18)
        
        # Prepare the file upload
        with open(file_path, 'rb') as f:
            files = {'file': (os.path.basename(file_path), f, 'application/octet-stream')}
            data = {
                'title': title,
                'description': description,
                'price': str(price_wei),
                'dtype': dtype,
                'owner_address': wallet['address'],
                'private_key': wallet['private_key']
            }
            
            response = requests.post(
                f"{API_URL}/upload",
                files=files,
                data=data
            )
            
            if response.status_code == 200:
                result = response.json()
                print_success(f"Upload successful! Dataset ID: {result.get('id')}")
            else:
                print_error(f"Upload failed: {response.text}")
                
    except Exception as e:
        print_error(f"Error uploading file: {e}")

@cli.command()
def list_datasets():
    """List all available datasets"""
    try:
        response = requests.get(f"{API_URL}/datasets")
        if response.status_code == 200:
            datasets = response.json()
            if not datasets:
                print_info("No datasets available")
                return
                
            for dataset in datasets:
                price_eth = float(dataset['price']) / 10**18
                print_info(f"\nID: {dataset['id']}")
                print(f"Title: {dataset['title']}")
                print(f"Description: {dataset['description']}")
                print(f"Price: {price_eth} BNB")
                print(f"Owner: {dataset['owner']}")
                print(f"Type: {dataset['dtype']}")
                
        else:
            print_error(f"Failed to fetch datasets: {response.text}")
    except Exception as e:
        print_error(f"Error: {e}")

@cli.command()
@click.argument("dataset_id", type=int)
def download(dataset_id: int):
    """Download a dataset by ID"""
    wallet = config.get_wallet()
    if not wallet:
        print_error("Please connect your wallet first using 'connect-wallet'")
        return
    
    try:
        # Sign a message for authentication
        message = f"Download dataset {dataset_id}"
        message_hash = encode_defunct(text=message)
        signed_message = Account.sign_message(
            message_hash,
            private_key=wallet['private_key']
        )
        
        response = requests.post(
            f"{API_URL}/download/{dataset_id}",
            data={
                "user_address": wallet['address'],
                "signature": signed_message.signature.hex()
            }
        )
        
        if response.status_code == 200:
            result = response.json()
            print_success(f"Download URL: {result.get('download_url')}")
        else:
            print_error(f"Download failed: {response.text}")
            
    except Exception as e:
        print_error(f"Error: {e}")

if __name__ == "__main__":
    cli()
