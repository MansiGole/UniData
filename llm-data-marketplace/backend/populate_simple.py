#!/usr/bin/env python3
"""
Simple script to populate the database via HTTP API calls
"""

import requests
import json
import time

def populate_via_api():
    """Populate database using HTTP API calls"""
    
    print("🚀 Starting database population via API...")
    
    BASE_URL = "http://localhost:8000/api/v1"
    
    # Check if server is running
    try:
        response = requests.get(f"{BASE_URL}/datasets/", timeout=5)
        print("✅ Backend server is running")
    except requests.exceptions.RequestException:
        print("❌ Backend server is not running!")
        print("   Please start the backend server first:")
        print("   cd backend && python -m uvicorn app.main:app --reload --port 8000")
        return False
    
    # Test datasets data
    test_datasets = [
        {
            "title": "Sentiment Analysis Dataset",
            "description": "High-quality sentiment analysis dataset with 10,000 labeled reviews for training NLP models",
            "price": 0.5,
            "file_url": "/datasets/sentiment_analysis.json",
            "owner": "0x1234567890123456789012345678901234567890",
            "feasibility_analysis": {
                "score": 8.5,
                "grade": "A",
                "strengths": ["Large dataset with 10,000 samples", "Well-balanced sentiment distribution", "Clean JSON format"],
                "issues": ["Limited to English language only"],
                "recommendations": ["Consider adding multi-language support", "Include source metadata"]
            }
        },
        {
            "title": "Image Classification Dataset", 
            "description": "Computer vision dataset with 50,000 labeled images across 100 categories for training image classifiers",
            "price": 1.2,
            "file_url": "/datasets/image_classification.zip",
            "owner": "0x2345678901234567890123456789012345678901",
            "feasibility_analysis": {
                "score": 9.2,
                "grade": "A+",
                "strengths": ["Large-scale dataset", "100 diverse categories", "High-resolution images"],
                "issues": ["Large file size may impact download"],
                "recommendations": ["Consider offering compressed versions", "Provide preview samples"]
            }
        },
        {
            "title": "Financial Time Series Data",
            "description": "Stock market data with technical indicators for algorithmic trading and financial modeling",
            "price": 2.0,
            "file_url": "/datasets/financial_timeseries.csv", 
            "owner": "0x3456789012345678901234567890123456789012",
            "feasibility_analysis": {
                "score": 7.8,
                "grade": "B+",
                "strengths": ["Comprehensive technical indicators", "Long historical period"],
                "issues": ["Market data can become outdated quickly"],
                "recommendations": ["Add real-time data updates", "Include regulatory compliance notes"]
            }
        }
    ]
    
    test_models = [
        {
            "name": "BERT Sentiment Classifier",
            "description": "Fine-tuned BERT model for sentiment analysis with 94% accuracy on benchmark datasets",
            "price": 3.5,
            "owner": "0x4567890123456789012345678901234567890123",
            "framework": "PyTorch", 
            "accuracy": 94.2,
            "tags": ["NLP", "Sentiment", "BERT"],
            "file_url": "/models/bert_sentiment.pkl",
            "feasibility_analysis": {
                "score": 9.0,
                "grade": "A+",
                "strengths": ["State-of-the-art BERT architecture", "High accuracy of 94.2%"],
                "issues": ["Large model size", "Requires significant computational resources"],
                "recommendations": ["Provide model optimization options", "Add multilingual support"]
            }
        },
        {
            "name": "CNN Image Classifier",
            "description": "Convolutional Neural Network for image classification with 88% accuracy across multiple domains",
            "price": 2.8,
            "owner": "0x5678901234567890123456789012345678901234",
            "framework": "TensorFlow",
            "accuracy": 88.5,
            "tags": ["Computer Vision", "CNN"],
            "file_url": "/models/cnn_classifier.h5",
            "feasibility_analysis": {
                "score": 8.3,
                "grade": "A-",
                "strengths": ["Proven CNN architecture", "Good accuracy for general classification"],
                "issues": ["Accuracy could be improved", "Limited to specific image resolution"],
                "recommendations": ["Provide transfer learning guide", "Add data augmentation examples"]
            }
        }
    ]
    
    print("\n📊 Adding test datasets...")
    for i, dataset in enumerate(test_datasets, 1):
        try:
            # For now, just print what we would add since the upload endpoint needs actual files
            print(f"✅ Would add Dataset {i}: {dataset['title']}")
            print(f"   Price: ${dataset['price']} | Score: {dataset['feasibility_analysis']['score']}/10 ({dataset['feasibility_analysis']['grade']})")
        except Exception as e:
            print(f"❌ Error adding dataset {i}: {e}")
    
    print("\n🤖 Adding test models...")
    for i, model in enumerate(test_models, 1):
        try:
            # For now, just print what we would add since the upload endpoint needs actual files
            print(f"✅ Would add Model {i}: {model['name']}")
            print(f"   Price: ${model['price']} | Accuracy: {model['accuracy']}% | Score: {model['feasibility_analysis']['score']}/10 ({model['feasibility_analysis']['grade']})")
        except Exception as e:
            print(f"❌ Error adding model {i}: {e}")
    
    print("\n💡 To test the complete workflow:")
    print("1. Go to http://localhost:3002 (frontend)")
    print("2. Upload a real dataset or model file")
    print("3. The system will automatically run feasibility analysis")
    print("4. View the results and purchase functionality")
    
    print("\n🔍 Current API Status:")
    try:
        datasets_response = requests.get(f"{BASE_URL}/datasets/")
        models_response = requests.get(f"{BASE_URL}/models/")
        print(f"   Datasets: {len(datasets_response.json())} items")
        print(f"   Models: {len(models_response.json().get('data', []))} items")
    except Exception as e:
        print(f"   Error checking API: {e}")
    
    return True

if __name__ == "__main__":
    populate_via_api()
