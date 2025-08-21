import ipfshttpclient
import os
from typing import Tuple, Optional
from .base import StorageAdapter

class IPFSStorage(StorageAdapter):
    """IPFS storage adapter"""
    
    def __init__(self, host: str = 'localhost', port: int = 5001, protocol: str = 'http'):
        self.client = ipfshttpclient.connect(f'/ip4/{host}/tcp/{port}/{protocol}')
        self.gateway_url = os.getenv('IPFS_GATEWAY_URL', 'https://ipfs.io/ipfs/')
    
    async def upload_file(self, file_path: str, file_name: str, content_type: str) -> Tuple[bool, str]:
        """Upload a file to IPFS"""
        try:
            res = self.client.add(file_path)
            return True, res['Hash']
        except Exception as e:
            print(f"Error uploading to IPFS: {str(e)}")
            return False, str(e)
    
    async def get_download_url(self, file_uri: str, expiration: int = 3600) -> Optional[str]:
        """Generate IPFS gateway URL"""
        if not file_uri:
            return None
        return f"{self.gateway_url}{file_uri}"
