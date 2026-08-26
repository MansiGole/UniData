import requests
import json
from typing import Optional

class SimpleBlockchainService:
    def __init__(self):
        # Mock BNB Testnet Configuration
        self.chain_id = 97
        self.rpc_url = "https://bsc-testnet.nodereal.io/v1/mock"
        self.explorer_api = "https://api-testnet.bscscan.com/api"

        # Mock Contract addresses
        self.dataset_market_address = "0x4Ccd91247B98df05dCF18aBd70F27367DFcd9da4"
        self.model_market_address = "0xDCA206BFBDc59FA423757e35cB55B18Bebe301A4"

    def get_balance_via_rpc(self, address: str) -> dict:
        """Mock balance via RPC"""
        return {
            "address": address,
            "balance": 1.0,
            "balance_wei": "1000000000000000000",
            "currency": "tBNB",
            "method": "rpc"
        }

    def get_balance_via_explorer(self, address: str) -> dict:
        """Mock balance via explorer"""
        return {
            "address": address,
            "balance": 1.0,
            "balance_wei": "1000000000000000000",
            "currency": "tBNB",
            "method": "explorer"
        }

    def get_balance(self, address: str) -> dict:
        """Get mock balance"""
        return self.get_balance_via_rpc(address)

    def get_network_info(self) -> dict:
        """Get mock network info"""
        return {
            "chain_id": self.chain_id,
            "rpc_url": self.rpc_url,
            "explorer_api": self.explorer_api,
            "dataset_market_address": self.dataset_market_address,
            "model_market_address": self.model_market_address
        }

    def validate_transaction(self, tx_hash: str) -> dict:
        """Mock transaction validation"""
        return {
            "hash": tx_hash,
            "status": "success",
            "block_number": 12345678,
            "gas_used": 21000,
            "gas_price": 5000000000,
            "from_address": "0x" + "0" * 40,
            "to_address": "0x" + "0" * 40,
            "value": 0.1
        }

# Create service instance
simple_blockchain_service = SimpleBlockchainService()