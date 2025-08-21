from abc import ABC, abstractmethod
from typing import Tuple, Optional

class StorageAdapter(ABC):
    """Base class for storage adapters"""
    
    @abstractmethod
    async def upload_file(self, file_path: str, file_name: str, content_type: str) -> Tuple[bool, str]:
        """Upload a file to the storage"""
        pass
    
    @abstractmethod
    async def get_download_url(self, file_uri: str, expiration: int = 3600) -> Optional[str]:
        """Generate a signed download URL"""
        pass
