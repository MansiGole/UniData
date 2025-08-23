#!/usr/bin/env python3
"""
Script to populate the in-memory storage with test datasets and models including feasibility analysis
"""

import sys
import json
import requests
import time
from pathlib import Path

# Add the parent directory to Python path so we can import our modules
sys.path.append(str(Path(__file__).parent))

def populate_test_data():
    """Populate storage with test datasets and models using API calls"""
    
    print("🚀 Starting database population with test data...")
    
    BASE_URL = "http://localhost:8000/api/v1"
    
    # Sample datasets with feasibility analysis
    test_datasets = [
        {
            "title": "Sentiment Analysis Dataset",
            "description": "High-quality sentiment analysis dataset with 10,000 labeled reviews",
            "price": 0.5,
            "file_url": "/datasets/sentiment_analysis.json",
            "owner": "0x1234567890123456789012345678901234567890",
            "feasibility_analysis": {
                "score": 8.5,
                "grade": "A",
                "strengths": [
                    "Large dataset with 10,000 samples",
                    "Well-balanced sentiment distribution",
                    "Clean JSON format",
                    "Comprehensive labeling"
                ],
                "issues": [
                    "Limited to English language only",
                    "No metadata about review sources"
                ],
                "recommendations": [
                    "Consider adding multi-language support",
                    "Include source metadata for better context",
                    "Add confidence scores for labels"
                ],
                "data_quality": 9.0,
                "commercial_viability": 8.0,
                "technical_feasibility": 8.5
            }
        },
        {
            "title": "Image Classification Dataset",
            "description": "Computer vision dataset with 50,000 labeled images across 100 categories",
            "price": 1.2,
            "file_url": "/datasets/image_classification.zip",
            "owner": "0x2345678901234567890123456789012345678901",
            "feasibility_analysis": {
                "score": 9.2,
                "grade": "A+",
                "strengths": [
                    "Large-scale dataset with 50,000 images",
                    "100 diverse categories",
                    "High-resolution images",
                    "Professional annotation quality"
                ],
                "issues": [
                    "Large file size may impact download",
                    "Requires significant storage space"
                ],
                "recommendations": [
                    "Consider offering compressed versions",
                    "Provide preview samples",
                    "Add batch download options"
                ],
                "data_quality": 9.5,
                "commercial_viability": 9.0,
                "technical_feasibility": 9.0
            }
        },
        {
            "title": "Time Series Financial Data",
            "description": "Stock market data with technical indicators for algorithmic trading",
            "price": 2.0,
            "file_url": "/datasets/financial_timeseries.csv",
            "owner": "0x3456789012345678901234567890123456789012",
            "feasibility_analysis": {
                "score": 7.8,
                "grade": "B+",
                "strengths": [
                    "Comprehensive technical indicators",
                    "Long historical period",
                    "Clean CSV format",
                    "High trading volume stocks"
                ],
                "issues": [
                    "Market data can become outdated quickly",
                    "Regulatory considerations for financial data",
                    "Missing some newer market indicators"
                ],
                "recommendations": [
                    "Add real-time data updates",
                    "Include regulatory compliance notes",
                    "Expand to cryptocurrency markets"
                ],
                "data_quality": 8.0,
                "commercial_viability": 7.5,
                "technical_feasibility": 8.0
            }
        }
    ]
    
    # Sample models with feasibility analysis
    test_models = [
        {
            "name": "BERT Sentiment Classifier",
            "description": "Fine-tuned BERT model for sentiment analysis with 94% accuracy",
            "price": 3.5,
            "owner": "0x4567890123456789012345678901234567890123",
            "framework": "PyTorch",
            "accuracy": 94.2,
            "tags": ["NLP", "Sentiment", "BERT", "Transformer"],
            "file_url": "/models/bert_sentiment.pkl",
            "feasibility_analysis": {
                "score": 9.0,
                "grade": "A+",
                "strengths": [
                    "State-of-the-art BERT architecture",
                    "High accuracy of 94.2%",
                    "Well-documented implementation",
                    "Pre-trained and fine-tuned"
                ],
                "issues": [
                    "Large model size (500MB)",
                    "Requires significant computational resources",
                    "Limited to English text"
                ],
                "recommendations": [
                    "Provide model optimization options",
                    "Add multilingual support",
                    "Include inference time benchmarks"
                ],
                "data_quality": 9.0,
                "commercial_viability": 9.0,
                "technical_feasibility": 9.0
            }
        },
        {
            "name": "CNN Image Classifier",
            "description": "Convolutional Neural Network for image classification with 88% accuracy",
            "price": 2.8,
            "owner": "0x5678901234567890123456789012345678901234",
            "framework": "TensorFlow",
            "accuracy": 88.5,
            "tags": ["Computer Vision", "CNN", "Classification"],
            "file_url": "/models/cnn_classifier.h5",
            "feasibility_analysis": {
                "score": 8.3,
                "grade": "A-",
                "strengths": [
                    "Proven CNN architecture",
                    "Good accuracy for general classification",
                    "Reasonable model size",
                    "TensorFlow/Keras compatible"
                ],
                "issues": [
                    "Accuracy could be improved",
                    "Limited to specific image resolution",
                    "No transfer learning examples"
                ],
                "recommendations": [
                    "Provide transfer learning guide",
                    "Add data augmentation examples",
                    "Include model performance metrics"
                ],
                "data_quality": 8.5,
                "commercial_viability": 8.0,
                "technical_feasibility": 8.5
            }
        },
        {
            "name": "LSTM Stock Predictor",
            "description": "Long Short-Term Memory model for stock price prediction",
            "price": 4.2,
            "owner": "0x6789012345678901234567890123456789012345",
            "framework": "PyTorch",
            "accuracy": 76.8,
            "tags": ["Finance", "LSTM", "Time Series", "Prediction"],
            "file_url": "/models/lstm_stock.pkl",
            "feasibility_analysis": {
                "score": 7.2,
                "grade": "B",
                "strengths": [
                    "LSTM architecture suitable for time series",
                    "Compact model size",
                    "Financial domain expertise",
                    "Includes feature engineering"
                ],
                "issues": [
                    "Moderate accuracy of 76.8%",
                    "Financial predictions are inherently risky",
                    "No risk management features",
                    "Limited to specific market conditions"
                ],
                "recommendations": [
                    "Add ensemble methods for better accuracy",
                    "Include risk assessment metrics",
                    "Provide backtesting framework",
                    "Add market regime detection"
                ],
                "data_quality": 7.5,
                "commercial_viability": 7.0,
                "technical_feasibility": 7.0
            }
        }
    ]
    
    try:
        # Direct manipulation of in-memory storage
        print("\n📊 Adding test datasets...")
        from app.api.api_v1.api import DATASETS
        for i, dataset_data in enumerate(test_datasets, 1):
            dataset_data['id'] = i
            dataset_data['active'] = True
            DATASETS.append(dataset_data)
            print(f"✅ Dataset {i}: {dataset_data['title']}")
        
        # Add models  
        print("\n🤖 Adding test models...")
        from app.api.api_v1.api import MODELS
        for i, model_data in enumerate(test_models, 1):
            model_data['id'] = i
            MODELS.append(model_data)
            print(f"✅ Model {i}: {model_data['name']}")
        
        print("\n🎉 Database population completed successfully!")
        print("\n📋 Summary:")
        print(f"   • {len(test_datasets)} datasets added")
        print(f"   • {len(test_models)} models added")
        print("   • All items include comprehensive feasibility analysis")
        
        print("\n🔍 Test the API now:")
        print("   curl http://localhost:8000/api/v1/datasets/")
        print("   curl http://localhost:8000/api/v1/models/")
        print("   curl http://localhost:8000/api/v1/datasets/1")
        
    except Exception as e:
        print(f"❌ Error populating database: {e}")
        print("\n💡 Make sure the backend server is running first!")
        print("   cd backend && python -m uvicorn app.main:app --reload --port 8000")
        raise

if __name__ == "__main__":
    populate_test_data()
