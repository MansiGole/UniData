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

    def is_connected(self):
        return True

    def get_balance(self, address):
        return {
            "address": address,
            "balance": 1.0,
            "balance_wei": "1000000000000000000",
            "currency": "tBNB"
        }

    def get_dataset_from_blockchain(self, dataset_id):
        return {
            "id": dataset_id,
            "title": f"Mock Dataset {dataset_id}",
            "description": "Mock dataset for demo",
            "author": "Demo Author",
            "date": "2024-01-01",
            "download_details": "Mock download",
            "info": {"size": "1MB", "format": "CSV", "license": "MIT"},
            "schema": "Mock schema",
            "sample_head": "Mock sample",
            "feasibility_score": 85,
            "purchase_details": "Mock purchase",
            "owner": "0x" + "0" * 40,
            "price": 0.1,
            "active": True,
            "storageURI": "ipfs://mock",
            "createdAt": 1640995200,
            "updatedAt": 1640995200
        }

    def has_user_purchased(self, user_address, dataset_id):
        return False

    def get_next_dataset_id(self):
        return 1

    def validate_transaction(self, tx_hash):
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

    def get_contract_events(self, event_name, from_block=0, to_block='latest'):
        return []

class MockWeb3:
    def __init__(self):
        self.eth = MockEth()

    def isConnected(self):
        return True

    def isAddress(self, address):
        return True

    def fromWei(self, value, unit):
        return float(value) / 10**18

class MockEth:
    def __init__(self):
        self.block_number = 12345678

    def get_balance(self, address):
        return 1000000000000000000

    def get_transaction_receipt(self, tx_hash):
        return MockReceipt()

    def get_transaction(self, tx_hash):
        return MockTransaction()

class MockReceipt:
    def __init__(self):
        self.status = 1
        self.blockNumber = 12345678
        self.gasUsed = 21000

class MockTransaction:
    def __init__(self):
        self.gasPrice = 5000000000
        self.value = 100000000000000000  # 0.1 BNB

class MockContract:
    def __init__(self):
        pass

    def functions(self):
        return MockFunctions()

    @property
    def events(self):
        return MockEvents()

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

    def nextDatasetId(self):
        return MockFunction()

class MockFunction:
    def __init__(self):
        pass

    def call(self, *args, **kwargs):
        # Mock responses
        return True

    def transact(self, *args, **kwargs):
        return "0x" + "0" * 64

class MockEvents:
    def __init__(self):
        pass

    def DatasetRegistered(self):
        return MockEvent()

    def DatasetPurchased(self):
        return MockEvent()

class MockEvent:
    def __init__(self):
        pass

    def createFilter(self, fromBlock=0, toBlock='latest'):
        return MockFilter()

class MockFilter:
    def __init__(self):
        pass

    def get_all_entries(self):
        return []

# Create service instance
blockchain_service = BlockchainService()