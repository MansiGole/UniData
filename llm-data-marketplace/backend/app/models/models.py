from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base

class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    owner = Column(String, index=True)  # Wallet address
    price = Column(Integer)  # Price in wei
    active = Column(Boolean, default=True)
    storage_uri = Column(String)
    dtype = Column(String)  # "dataset" or "model"
    blockchain_dataset_id = Column(Integer, nullable=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    purchases = relationship("Purchase", back_populates="dataset")

class Purchase(Base):
    __tablename__ = "purchases"

    id = Column(Integer, primary_key=True, index=True)
    dataset_id = Column(Integer, ForeignKey("datasets.id"))
    buyer = Column(String)  # Wallet address
    tx_hash = Column(String, unique=True, index=True)
    amount = Column(Integer)  # Price paid in wei
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    dataset = relationship("Dataset", back_populates="purchases")
