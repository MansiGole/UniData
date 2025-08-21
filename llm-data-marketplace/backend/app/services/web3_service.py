import json
import os
from typing import Dict, Any, Optional
from web3 import Web3, HTTPProvider
from web3.middleware import ExtraDataToPOAMiddleware as geth_poa_middleware
from eth_account import Account
from eth_account.messages import encode_defunct

class Web3Service:
    def __init__(self):
        self.w3 = Web3(HTTPProvider(os.getenv("WEB3_PROVIDER_URL", "http://localhost:8545")))
        self.w3.middleware_onion.inject(geth_poa_middleware, layer=0)
        
        # Load contract ABI and address
        contract_info = self._load_contract_info()
        self.contract_address = contract_info.get("address")
        self.contract_abi = contract_info.get("abi")
        
        if self.contract_address and self.contract_abi:
            self.contract = self.w3.eth.contract(
                address=self.contract_address,
                abi=self.contract_abi
            )
    
    def _load_contract_info(self) -> Dict[str, Any]:
        """Load contract ABI and address from deployment file"""
        try:
            import os
            import json
            from pathlib import Path
            
            # Navigate to the contracts/deployed directory
            contracts_dir = Path(__file__).parent.parent.parent.parent / "contracts" / "deployed"
            contract_file = contracts_dir / "DatasetMarket.json"
            
            if contract_file.exists():
                with open(contract_file, 'r') as f:
                    data = json.load(f)
                    return {
                        "address": data.get("address"),
                        "abi": data.get("abi")
                    }
        except Exception as e:
            print(f"Error loading contract info: {e}")
        
        return {"address": None, "abi": []}
    
    def verify_signature(self, address: str, message: str, signature: str) -> bool:
        """Verify a signature against an Ethereum address"""
        try:
            message_hash = encode_defunct(text=message)
            signer = Account.recover_message(message_hash, signature=signature)
            return signer.lower() == address.lower()
        except Exception as e:
            print(f"Signature verification failed: {e}")
            return False
    
    async def register_dataset(
        self,
        private_key: str,
        title: str,
        description: str,
        storage_uri: str,
        price: int,
        dtype: str
    ) -> Dict[str, Any]:
        """Register a new dataset on the blockchain"""
        try:
            account = Account.from_key(private_key)
            nonce = self.w3.eth.get_transaction_count(account.address)
            
            tx = self.contract.functions.registerDataset(
                title, description, storage_uri, price, dtype
            ).build_transaction({
                'from': account.address,
                'nonce': nonce,
                'gas': 2000000,
                'gasPrice': self.w3.eth.gas_price
            })
            
            signed_tx = self.w3.eth.account.sign_transaction(tx, private_key)
            tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
            
            return {"success": True, "tx_hash": tx_hash.hex(), "receipt": dict(receipt)}
            
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    async def purchase_dataset(
        self,
        private_key: str,
        dataset_id: int,
        value: int
    ) -> Dict[str, Any]:
        """Purchase a dataset"""
        try:
            account = Account.from_key(private_key)
            nonce = self.w3.eth.get_transaction_count(account.address)
            
            tx = self.contract.functions.purchaseDataset(dataset_id).build_transaction({
                'from': account.address,
                'value': value,
                'nonce': nonce,
                'gas': 2000000,
                'gasPrice': self.w3.eth.gas_price
            })
            
            signed_tx = self.w3.eth.account.sign_transaction(tx, private_key)
            tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
            
            return {"success": True, "tx_hash": tx_hash.hex(), "receipt": dict(receipt)}
            
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    async def has_purchased(self, user_address: str, dataset_id: int) -> bool:
        """Check if a user has purchased a dataset"""
        try:
            return self.contract.functions.hasUserPurchased(
                user_address,
                dataset_id
            ).call()
        except Exception as e:
            print(f"Error checking purchase status: {e}")
            return False
    
    async def get_dataset(self, dataset_id: int) -> Optional[Dict[str, Any]]:
        """Get dataset details from the blockchain"""
        try:
            dataset = self.contract.functions.getDataset(dataset_id).call()
            return {
                "id": dataset[0],
                "title": dataset[1],
                "description": dataset[2],
                "owner": dataset[3],
                "price": dataset[4],
                "active": dataset[5],
                "storage_uri": dataset[6],
                "dtype": dataset[7]
            }
        except Exception as e:
            print(f"Error getting dataset: {e}")
            return None
