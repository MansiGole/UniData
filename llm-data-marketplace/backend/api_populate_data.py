#!/usr/bin/env python3
"""
API-based script to populate the database with test data via HTTP requests
"""

import requests
import json
import time

def populate_via_api():
    """Populate database using API endpoints"""
    
    print("🚀 Starting API-based database population...")
    
    BASE_URL = "http://localhost:8000/api/v1"
    
    # Test connectivity first
    try:
        response = requests.get(f"{BASE_URL}/datasets/")
        print(f"✅ Backend is running - Current datasets: {len(response.json())}")
    except Exception as e:
        print(f"❌ Backend not accessible: {e}")
        return
    
    # We'll simulate uploads by directly manipulating the storage
    # Since this is in-memory storage, we need to restart the approach
    
    print("🔄 Using direct storage manipulation approach...")
    
    # Import the storage directly
    import sys
    sys.path.append('.')
    
    try:
        from app.api.api_v1.api import DATASETS, MODELS
        
        # Clear existing data
        DATASETS.clear()
        MODELS.clear()
        
        # Add datasets with full feasibility analysis
        test_datasets = [
            {
                "id": 1,
                "title": "Sentiment Analysis Dataset",
                "description": "High-quality sentiment analysis dataset with 10,000 labeled reviews from multiple domains",
                "price": 0.5,
                "file_url": "/datasets/sentiment_analysis.json",
                "owner": "0x1234567890123456789012345678901234567890",
                "active": True,
                "feasibility_analysis": {
                    "score": 8.5,
                    "grade": "A",
                    "strengths": [
                        "Large dataset with 10,000 samples",
                        "Well-balanced sentiment distribution (40% positive, 35% negative, 25% neutral)",
                        "Clean JSON format with standardized fields",
                        "Comprehensive labeling with confidence scores"
                    ],
                    "issues": [
                        "Limited to English language only",
                        "No metadata about review sources",
                        "Some samples may have labeling bias"
                    ],
                    "recommendations": [
                        "Consider adding multi-language support",
                        "Include source metadata for better context",
                        "Add confidence scores for labels",
                        "Implement cross-validation testing"
                    ],
                    "data_quality": 9.0,
                    "commercial_viability": 8.0,
                    "technical_feasibility": 8.5
                }
            },
            {
                "id": 2,
                "title": "Image Classification Dataset",
                "description": "Computer vision dataset with 50,000 high-resolution labeled images across 100 categories",
                "price": 1.2,
                "file_url": "/datasets/image_classification.zip",
                "owner": "0x2345678901234567890123456789012345678901",
                "active": True,
                "feasibility_analysis": {
                    "score": 9.2,
                    "grade": "A+",
                    "strengths": [
                        "Large-scale dataset with 50,000 images",
                        "100 diverse categories with balanced distribution",
                        "High-resolution images (1024x1024)",
                        "Professional annotation quality with multiple reviewers"
                    ],
                    "issues": [
                        "Large file size (15GB) may impact download",
                        "Requires significant storage space",
                        "Some categories have fewer samples"
                    ],
                    "recommendations": [
                        "Consider offering compressed versions",
                        "Provide preview samples and thumbnails",
                        "Add batch download options",
                        "Include data augmentation suggestions"
                    ],
                    "data_quality": 9.5,
                    "commercial_viability": 9.0,
                    "technical_feasibility": 9.0
                }
            },
            {
                "id": 3,
                "title": "Time Series Financial Data",
                "description": "Stock market data with technical indicators for algorithmic trading strategies",
                "price": 2.0,
                "file_url": "/datasets/financial_timeseries.csv",
                "owner": "0x3456789012345678901234567890123456789012",
                "active": True,
                "feasibility_analysis": {
                    "score": 7.8,
                    "grade": "B+",
                    "strengths": [
                        "Comprehensive technical indicators (50+ features)",
                        "Long historical period (5 years of data)",
                        "Clean CSV format with proper timestamps",
                        "High trading volume stocks from major exchanges"
                    ],
                    "issues": [
                        "Market data can become outdated quickly",
                        "Regulatory considerations for financial data",
                        "Missing some newer market indicators",
                        "No real-time update mechanism"
                    ],
                    "recommendations": [
                        "Add real-time data updates",
                        "Include regulatory compliance notes",
                        "Expand to cryptocurrency markets",
                        "Provide backtesting framework"
                    ],
                    "data_quality": 8.0,
                    "commercial_viability": 7.5,
                    "technical_feasibility": 8.0
                }
            }
        ]
        
        # Add models with full feasibility analysis
        test_models = [
            {
                "id": 1,
                "name": "BERT Sentiment Classifier",
                "description": "Fine-tuned BERT model for sentiment analysis with 94% accuracy on diverse text data",
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
                        "State-of-the-art BERT architecture with 110M parameters",
                        "High accuracy of 94.2% on validation set",
                        "Well-documented implementation with examples",
                        "Pre-trained and fine-tuned on domain-specific data"
                    ],
                    "issues": [
                        "Large model size (500MB) may impact deployment",
                        "Requires significant computational resources (GPU recommended)",
                        "Limited to English text processing",
                        "Inference time can be slow for real-time applications"
                    ],
                    "recommendations": [
                        "Provide model optimization options (quantization, distillation)",
                        "Add multilingual support with mBERT",
                        "Include inference time benchmarks",
                        "Offer lighter variants for mobile deployment"
                    ],
                    "data_quality": 9.0,
                    "commercial_viability": 9.0,
                    "technical_feasibility": 9.0
                }
            },
            {
                "id": 2,
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
                        "Proven CNN architecture with residual connections",
                        "Good accuracy for general classification tasks",
                        "Reasonable model size (150MB)",
                        "TensorFlow/Keras compatible with easy integration"
                    ],
                    "issues": [
                        "Accuracy could be improved with newer architectures",
                        "Limited to 224x224 image resolution",
                        "No transfer learning examples provided",
                        "Missing data preprocessing pipeline"
                    ],
                    "recommendations": [
                        "Provide transfer learning guide and examples",
                        "Add data augmentation examples",
                        "Include model performance metrics by category",
                        "Upgrade to more recent architectures (EfficientNet, Vision Transformer)"
                    ],
                    "data_quality": 8.5,
                    "commercial_viability": 8.0,
                    "technical_feasibility": 8.5
                }
            },
            {
                "id": 3,
                "name": "LSTM Stock Predictor",
                "description": "Long Short-Term Memory model for stock price prediction with risk assessment",
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
                        "LSTM architecture well-suited for sequential data",
                        "Compact model size (25MB) for easy deployment",
                        "Domain expertise in financial feature engineering",
                        "Includes technical indicators and market sentiment"
                    ],
                    "issues": [
                        "Moderate accuracy of 76.8% raises reliability concerns",
                        "Financial predictions are inherently risky and uncertain",
                        "No risk management or uncertainty quantification",
                        "Limited to specific market conditions and time periods"
                    ],
                    "recommendations": [
                        "Add ensemble methods for better accuracy and robustness",
                        "Include risk assessment metrics and confidence intervals",
                        "Provide comprehensive backtesting framework",
                        "Add market regime detection and adaptive learning"
                    ],
                    "data_quality": 7.5,
                    "commercial_viability": 7.0,
                    "technical_feasibility": 7.0
                }
            }
        ]
        
        # Add all data to storage
        DATASETS.extend(test_datasets)
        MODELS.extend(test_models)
        
        print(f"\n✅ Successfully added {len(test_datasets)} datasets and {len(test_models)} models!")
        
        # Verify the data was added
        time.sleep(1)
        response = requests.get(f"{BASE_URL}/datasets/")
        datasets = response.json()
        print(f"📊 Verification: {len(datasets)} datasets now in database")
        
        response = requests.get(f"{BASE_URL}/models/")
        models = response.json()
        print(f"🤖 Verification: {len(models.get('data', []))} models now in database")
        
        print("\n🎉 Database population completed successfully!")
        print("\n🔍 Try these commands to see the feasibility system in action:")
        print("   curl http://localhost:8000/api/v1/datasets/1")
        print("   curl http://localhost:8000/api/v1/models/1")
        
        # Test one dataset to show feasibility analysis
        print("\n📈 Sample feasibility analysis for Dataset 1:")
        try:
            response = requests.get(f"{BASE_URL}/datasets/1")
            if response.status_code == 200:
                data = response.json()
                fa = data.get('feasibility_analysis', {})
                print(f"   Score: {fa.get('score', 'N/A')}/10")
                print(f"   Grade: {fa.get('grade', 'N/A')}")
                print(f"   Strengths: {len(fa.get('strengths', []))} items")
                print(f"   Issues: {len(fa.get('issues', []))} items")
            else:
                print(f"   Error fetching dataset: {response.status_code}")
        except Exception as e:
            print(f"   Error: {e}")
            
    except Exception as e:
        print(f"❌ Error during population: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    populate_via_api()
