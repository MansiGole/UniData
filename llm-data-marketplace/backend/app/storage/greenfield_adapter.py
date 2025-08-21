import os
from typing import Tuple, Optional
from datetime import datetime, timedelta
from greenfield_sdk import GreenfieldClient
from greenfield_sdk.key_manager import KeyManager
from .base import StorageAdapter

class GreenfieldStorage(StorageAdapter):
    """Greenfield storage adapter"""
    
    def __init__(self, 
                 rpc_endpoint: str = None,
                 chain_id: str = 'greenfield_1017-1',
                 private_key: str = None):
        
        self.rpc_endpoint = rpc_endpoint or os.getenv('GREENFIELD_RPC_ENDPOINT')
        self.chain_id = chain_id
        self.private_key = private_key or os.getenv('GREENFIELD_PRIVATE_KEY')
        
        if not all([self.rpc_endpoint, self.chain_id, self.private_key]):
            raise ValueError("Missing required Greenfield configuration")
            
        self.key_manager = KeyManager(private_key=self.private_key)
        self.client = GreenfieldClient(
            rpc_endpoint=self.rpc_endpoint,
            chain_id=self.chain_id,
            key_manager=self.key_manager
        )
    
    async def upload_file(self, file_path: str, file_name: str, content_type: str) -> Tuple[bool, str]:
        """Upload a file to Greenfield"""
        try:
            # In a real implementation, you would:
            # 1. Create a bucket if it doesn't exist
            # 2. Upload the file to the bucket
            # 3. Return the object URI
            
            # This is a simplified example
            bucket_name = "llm-marketplace"
            object_name = f"uploads/{int(datetime.utcnow().timestamp())}_{file_name}"
            
            # TODO: Implement actual file upload to Greenfield
            # await self.client.storage.upload_file(
            #     bucket_name=bucket_name,
            #     object_name=object_name,
            #     file_path=file_path,
            #     content_type=content_type
            # )
            
            # For now, return a mock URI
            return True, f"gnfd://{bucket_name}/{object_name}"
            
        except Exception as e:
            print(f"Error uploading to Greenfield: {str(e)}")
            return False, str(e)
    
    async def get_download_url(self, file_uri: str, expiration: int = 3600) -> Optional[str]:
        """Generate a signed download URL from Greenfield"""
        if not file_uri or not file_uri.startswith("gnfd://"):
            return None
            
        try:
            # Extract bucket and object name from URI
            parts = file_uri.replace("gnfd://", "").split("/", 1)
            if len(parts) != 2:
                return None
                
            bucket_name, object_name = parts
            
            # TODO: Generate actual signed URL from Greenfield
            # return await self.client.storage.get_object_url(
            #     bucket_name=bucket_name,
            #     object_name=object_name,
            #     expiration=expiration
            # )
            
            # For now, return a mock URL
            return f"https://greenfield.example.com/{bucket_name}/{object_name}?signature=mock"
            
        except Exception as e:
            print(f"Error generating Greenfield URL: {str(e)}")
            return None
