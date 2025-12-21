# Mock blockchain service for demo purposes
import json
import os
from typing import Optional
import requests

class BlockchainService:
    def __init__(self):
        # Mock configuration for demo
        self.rpc_url = "https://bsc-testnet.nodereal.io/v1/mock"
        self.chain_id = 97

        # Mock web3 object
        self.web3 = MockWeb3()

    def get_contract(self, address, abi):
        return MockContract()

    def get_account_balance(self, address):
        # Mock balance
        return 1000000000000000000  # 1 BNB in wei

    def send_transaction(self, tx):
        # Mock transaction
        return {"hash": "0x" + "0" * 64, "status": "success"}

    def wait_for_transaction(self, tx_hash):
        # Mock wait
        return {"status": "success"}

class MockWeb3:
    def __init__(self):
        self.eth = MockEth()

class MockEth:
    def __init__(self):
        self.block_number = 12345678

class MockContract:
    def __init__(self):
        pass

    def functions(self):
        return MockFunctions()

class MockFunctions:
    def __init__(self):
        pass

    def registerDataset(self):
        return MockFunction()

    def purchaseDataset(self):
        return MockFunction()

    def getDataset(self):
        return MockFunction()

    def hasAddressPurchased(self):
        return MockFunction()

class MockFunction:
    def __init__(self):
        pass

    def call(self, *args, **kwargs):
        # Mock responses
        return True

    def transact(self, *args, **kwargs):
        return "0x" + "0" * 64

# Create service instance
blockchain_service = BlockchainService()
            self.web3 = Web3(Web3.HTTPProvider(self.rpc_url))
        
        # Contract addresses from deployment
        self.dataset_market_address = "0x4d9f46D3578FBF27B8e1dfC46a3d909bA0c41f54"
        self.model_market_address = "0x9da6677a8AE28B0F4451A15D9B415ab06D3D2f36"
        
        # Load contract ABI
        self.dataset_market_abi = self._load_dataset_market_abi()
        
        # Initialize contract
        try:
            self.dataset_contract = self.web3.eth.contract(
                address=self.dataset_market_address,
                abi=self.dataset_market_abi
            )
        except Exception as e:
            print(f"Contract initialization warning: {e}")
            self.dataset_contract = None
        
    def _load_dataset_market_abi(self):
        """Load the Dataset Market contract ABI"""
        return [
            {
                "inputs": [],
                "name": "PLATFORM_FEE_PERCENT",
                "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {"internalType": "string", "name": "_title", "type": "string"},
                    {"internalType": "string", "name": "_description", "type": "string"},
                    {"internalType": "string", "name": "_author", "type": "string"},
                    {"internalType": "string", "name": "_date", "type": "string"},
                    {"internalType": "string", "name": "_download_details", "type": "string"},
                    {"internalType": "string", "name": "_size", "type": "string"},
                    {"internalType": "string", "name": "_format", "type": "string"},
                    {"internalType": "string", "name": "_license", "type": "string"},
                    {"internalType": "string", "name": "_schema", "type": "string"},
                    {"internalType": "string", "name": "_sample_head", "type": "string"},
                    {"internalType": "uint256", "name": "_feasibility_score", "type": "uint256"},
                    {"internalType": "string", "name": "_purchase_details", "type": "string"},
                    {"internalType": "string", "name": "_storageURI", "type": "string"},
                    {"internalType": "uint256", "name": "_price", "type": "uint256"}
                ],
                "name": "registerDataset",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [{"internalType": "uint256", "name": "_id", "type": "uint256"}],
                "name": "purchaseDataset",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "inputs": [{"internalType": "uint256", "name": "_id", "type": "uint256"}],
                "name": "getDataset",
                "outputs": [
                    {"internalType": "uint256", "name": "id", "type": "uint256"},
                    {"internalType": "string", "name": "title", "type": "string"},
                    {"internalType": "string", "name": "description", "type": "string"},
                    {"internalType": "string", "name": "author", "type": "string"},
                    {"internalType": "string", "name": "date", "type": "string"},
                    {"internalType": "string", "name": "download_details", "type": "string"},
                    {"internalType": "string", "name": "size", "type": "string"},
                    {"internalType": "string", "name": "format", "type": "string"},
                    {"internalType": "string", "name": "license", "type": "string"},
                    {"internalType": "string", "name": "schema", "type": "string"},
                    {"internalType": "string", "name": "sample_head", "type": "string"},
                    {"internalType": "uint256", "name": "feasibility_score", "type": "uint256"},
                    {"internalType": "string", "name": "purchase_details", "type": "string"},
                    {"internalType": "address", "name": "owner", "type": "address"},
                    {"internalType": "uint256", "name": "price", "type": "uint256"},
                    {"internalType": "bool", "name": "active", "type": "bool"},
                    {"internalType": "string", "name": "storageURI", "type": "string"},
                    {"internalType": "uint256", "name": "createdAt", "type": "uint256"},
                    {"internalType": "uint256", "name": "updatedAt", "type": "uint256"}
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {"internalType": "address", "name": "_buyer", "type": "address"},
                    {"internalType": "uint256", "name": "_id", "type": "uint256"}
                ],
                "name": "hasAddressPurchased",
                "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "nextDatasetId",
                "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
                "stateMutability": "view",
                "type": "function"
            }
        ]
    
    def is_connected(self) -> bool:
        """Check if connected to the blockchain"""
        try:
            return self.web3.isConnected()
        except Exception:
            return False
    
    def get_balance(self, address: str) -> dict:
        """Get tBNB balance for an address"""
        try:
            if not self.web3.isAddress(address):
                raise ValueError("Invalid address format")
            
            balance_wei = self.web3.eth.get_balance(address)
            balance_bnb = self.web3.fromWei(balance_wei, 'ether')
            
            return {
                "address": address,
                "balance": float(balance_bnb),
                "balance_wei": str(balance_wei),
                "currency": "tBNB"
            }
        except Exception as e:
            raise Exception(f"Error getting balance: {str(e)}")
    
    def get_dataset_from_blockchain(self, dataset_id: int) -> dict:
        """Get dataset details from the smart contract"""
        try:
            result = self.dataset_contract.functions.getDataset(dataset_id).call()
            
            return {
                "id": result[0],
                "title": result[1],
                "description": result[2],
                "author": result[3],
                "date": result[4],
                "download_details": result[5],
                "info": {
                    "size": result[6],
                    "format": result[7],
                    "license": result[8]
                },
                "schema": result[9],
                "sample_head": result[10],
                "feasibility_score": result[11],
                "purchase_details": result[12],
                "owner": result[13],
                "price": float(self.web3.fromWei(result[14], 'ether')),
                "active": result[15],
                "storageURI": result[16],
                "createdAt": result[17],
                "updatedAt": result[18]
            }
        except Exception as e:
            raise Exception(f"Error getting dataset from blockchain: {str(e)}")
    
    def has_user_purchased(self, user_address: str, dataset_id: int) -> bool:
        """Check if a user has purchased a specific dataset"""
        try:
            if not self.web3.isAddress(user_address):
                raise ValueError("Invalid address format")
            
            return self.dataset_contract.functions.hasAddressPurchased(
                user_address, dataset_id
            ).call()
        except Exception as e:
            raise Exception(f"Error checking purchase status: {str(e)}")
    
    def get_next_dataset_id(self) -> int:
        """Get the next dataset ID that will be assigned"""
        try:
            return self.dataset_contract.functions.nextDatasetId().call()
        except Exception as e:
            raise Exception(f"Error getting next dataset ID: {str(e)}")
    
    def validate_transaction(self, tx_hash: str) -> dict:
        """Validate a transaction and get its details"""
        try:
            # Get transaction receipt
            receipt = self.web3.eth.get_transaction_receipt(tx_hash)
            transaction = self.web3.eth.get_transaction(tx_hash)
            
            return {
                "hash": tx_hash,
                "status": "success" if receipt.status == 1 else "failed",
                "block_number": receipt.blockNumber,
                "gas_used": receipt.gasUsed,
                "gas_price": transaction.gasPrice,
                "from_address": transaction["from"],
                "to_address": transaction["to"],
                "value": float(self.web3.fromWei(transaction.value, 'ether'))
            }
        except Exception as e:
            raise Exception(f"Error validating transaction: {str(e)}")
    
    def get_contract_events(self, event_name: str, from_block: int = 0, to_block: str = 'latest') -> list:
        """Get contract events"""
        try:
            event_filter = getattr(self.dataset_contract.events, event_name).createFilter(
                fromBlock=from_block,
                toBlock=to_block
            )
            events = event_filter.get_all_entries()
            
            result = []
            for event in events:
                result.append({
                    "event": event.event,
                    "args": dict(event.args),
                    "transaction_hash": event.transactionHash.hex(),
                    "block_number": event.blockNumber,
                    "address": event.address
                })
            
            return result
        except Exception as e:
            raise Exception(f"Error getting contract events: {str(e)}")
    
    def estimate_gas_price(self) -> dict:
        """Get current gas price estimation"""
        try:
            gas_price = self.web3.eth.gas_price
            return {
                "gas_price_wei": gas_price,
                "gas_price_gwei": self.web3.fromWei(gas_price, 'gwei'),
                "currency": "tBNB"
            }
        except Exception as e:
            raise Exception(f"Error getting gas price: {str(e)}")

    def get_network_info(self) -> dict:
        """Get network information"""
        try:
            # Safely get latest block without POA issues
            try:
                latest_block_number = self.web3.eth.block_number
            except Exception as e:
                latest_block_number = "POA chain - block info unavailable"
            
            return {
                "network": "BNB Smart Chain Testnet",
                "chain_id": self.chain_id,
                "latest_block": latest_block_number,
                "connected": self.is_connected(),
                "contract_address": self.dataset_market_address,
                "rpc_url": self.rpc_url
            }
        except Exception as e:
            return {
                "network": "BNB Smart Chain Testnet",
                "chain_id": self.chain_id,
                "latest_block": "Error retrieving block info",
                "connected": False,
                "contract_address": self.dataset_market_address,
                "error": str(e)
            }

# Initialize blockchain service
blockchain_service = BlockchainService()
