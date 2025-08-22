import requests
import json
from typing import Optional

class SimpleBlockchainService:
    def __init__(self):
        # BNB Testnet Configuration
        self.chain_id = 97
        self.rpc_url = "https://bsc-testnet.nodereal.io/v1/e9a36765eb8a40b9bd12e680a1fd2bc5"
        self.explorer_api = "https://api-testnet.bscscan.com/api"
        
        # Contract addresses from deployment
        self.dataset_market_address = "0x4d9f46D3578FBF27B8e1dfC46a3d909bA0c41f54"
        self.model_market_address = "0x9da6677a8AE28B0F4451A15D9B415ab06D3D2f36"
    
    def get_balance_via_rpc(self, address: str) -> dict:
        """Get tBNB balance using direct RPC call"""
        try:
            payload = {
                "jsonrpc": "2.0",
                "method": "eth_getBalance",
                "params": [address, "latest"],
                "id": 1
            }
            
            response = requests.post(self.rpc_url, json=payload, timeout=10)
            result = response.json()
            
            if "result" in result:
                balance_wei = int(result["result"], 16)
                balance_bnb = balance_wei / (10 ** 18)
                
                return {
                    "address": address,
                    "balance": float(balance_bnb),
                    "balance_wei": str(balance_wei),
                    "currency": "tBNB",
                    "method": "rpc"
                }
            else:
                raise Exception(f"RPC Error: {result}")
                
        except Exception as e:
            raise Exception(f"Error getting balance via RPC: {str(e)}")
    
    def get_balance_via_explorer(self, address: str) -> dict:
        """Get tBNB balance using BSCScan API"""
        try:
            params = {
                "module": "account",
                "action": "balance",
                "address": address,
                "tag": "latest"
            }
            
            response = requests.get(self.explorer_api, params=params, timeout=10)
            result = response.json()
            
            if result["status"] == "1":
                balance_wei = int(result["result"])
                balance_bnb = balance_wei / (10 ** 18)
                
                return {
                    "address": address,
                    "balance": float(balance_bnb),
                    "balance_wei": str(balance_wei),
                    "currency": "tBNB",
                    "method": "explorer"
                }
            else:
                raise Exception(f"Explorer API Error: {result}")
                
        except Exception as e:
            raise Exception(f"Error getting balance via explorer: {str(e)}")
    
    def get_balance(self, address: str) -> dict:
        """Get balance with fallback methods"""
        # Validate address format
        if not address.startswith('0x') or len(address) != 42:
            raise ValueError("Invalid address format")
        
        # Try RPC first, fallback to explorer
        try:
            return self.get_balance_via_rpc(address)
        except Exception as rpc_error:
            try:
                return self.get_balance_via_explorer(address)
            except Exception as explorer_error:
                raise Exception(f"Both methods failed - RPC: {rpc_error}, Explorer: {explorer_error}")
    
    def is_connected(self) -> bool:
        """Check if we can connect to the network"""
        try:
            # Simple connectivity test
            payload = {
                "jsonrpc": "2.0",
                "method": "net_version",
                "params": [],
                "id": 1
            }
            
            response = requests.post(self.rpc_url, json=payload, timeout=5)
            result = response.json()
            
            return "result" in result and result["result"] == str(self.chain_id)
        except:
            return False
    
    def get_network_info(self) -> dict:
        """Get basic network information"""
        return {
            "network": "BNB Smart Chain Testnet",
            "chain_id": self.chain_id,
            "connected": self.is_connected(),
            "contract_address": self.dataset_market_address,
            "rpc_url": self.rpc_url,
            "explorer": "https://testnet.bscscan.com/"
        }
    
    def validate_transaction(self, tx_hash: str) -> dict:
        """Validate a transaction using explorer API"""
        try:
            params = {
                "module": "proxy",
                "action": "eth_getTransactionByHash",
                "txhash": tx_hash
            }
            
            response = requests.get(self.explorer_api, params=params, timeout=10)
            result = response.json()
            
            if result["result"]:
                tx = result["result"]
                
                # Get transaction receipt
                receipt_params = {
                    "module": "proxy",
                    "action": "eth_getTransactionReceipt",
                    "txhash": tx_hash
                }
                
                receipt_response = requests.get(self.explorer_api, params=receipt_params, timeout=10)
                receipt_result = receipt_response.json()
                
                receipt = receipt_result.get("result", {})
                
                return {
                    "hash": tx_hash,
                    "status": "success" if receipt.get("status") == "0x1" else "failed",
                    "block_number": int(tx.get("blockNumber", "0"), 16) if tx.get("blockNumber") else None,
                    "from_address": tx.get("from"),
                    "to_address": tx.get("to"),
                    "value": float(int(tx.get("value", "0"), 16) / (10 ** 18)),
                    "gas_used": int(receipt.get("gasUsed", "0"), 16) if receipt.get("gasUsed") else None,
                    "method": "explorer"
                }
            else:
                raise Exception("Transaction not found")
                
        except Exception as e:
            raise Exception(f"Error validating transaction: {str(e)}")

# Initialize simple blockchain service
simple_blockchain_service = SimpleBlockchainService()
