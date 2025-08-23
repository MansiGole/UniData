#!/usr/bin/env python3
"""
Script to add test data directly to the running backend via HTTP requests
"""

import requests
import json

def add_test_data():
    """Add test data using HTTP requests"""
    
    print("🚀 Adding test data to populate the database...")
    
    BASE_URL = "http://localhost:8000/api/v1"
    
    # Test connectivity first
    try:
        response = requests.get(f"{BASE_URL}/datasets/")
        print(f"✅ Backend connected - Current datasets: {len(response.json())}")
    except Exception as e:
        print(f"❌ Cannot connect to backend: {e}")
        return False
    
    # Upload a dataset using form data (simulating file upload)
    print("\n📊 Uploading test dataset...")
    
    # Prepare sample data
    sample_data = {
        "sentiment_samples": [
            {"text": "I love this product!", "sentiment": "positive"},
            {"text": "This is terrible", "sentiment": "negative"},
            {"text": "It's okay I guess", "sentiment": "neutral"}
        ]
    }
    
    # Create a file-like object
    import io
    sample_file = io.StringIO(json.dumps(sample_data, indent=2))
    
    try:
        # Upload dataset
        files = {'file': ('sentiment_dataset.json', json.dumps(sample_data, indent=2), 'application/json')}
        data = {
            'title': 'Sample Sentiment Analysis Dataset',
            'description': 'A comprehensive sentiment analysis dataset with labeled examples for training NLP models',
            'price': 0.5,
            'category': 'NLP',
            'format': 'JSON',
            'tags': 'sentiment, nlp, classification, text',
            'license': 'MIT'
        }
        
        response = requests.post(f"{BASE_URL}/datasets/upload", files=files, data=data)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Dataset uploaded successfully!")
            print(f"   ID: {result.get('dataset_id', 'Unknown')}")
            print(f"   Title: {result.get('title', 'Unknown')}")
            if 'feasibility_analysis' in result:
                analysis = result['feasibility_analysis']
                print(f"   Feasibility Score: {analysis.get('score', 'N/A')}/10 ({analysis.get('grade', 'N/A')})")
        else:
            print(f"❌ Dataset upload failed: {response.status_code}")
            print(f"   Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Error uploading dataset: {e}")
    
    # Upload a model
    print("\n🤖 Uploading test model...")
    
    try:
        # Simulate model file
        model_data = {
            "model_type": "sentiment_classifier",
            "architecture": "BERT",
            "parameters": {"layers": 12, "hidden_size": 768}
        }
        
        files = {'file': ('bert_sentiment.json', json.dumps(model_data, indent=2), 'application/json')}
        data = {
            'name': 'BERT Sentiment Classifier',
            'description': 'Fine-tuned BERT model for sentiment analysis with 94% accuracy',
            'price': 3.5,
            'framework': 'PyTorch',
            'accuracy': 94.2,
            'tags': 'bert, sentiment, nlp, transformer',
            'license': 'MIT'
        }
        
        response = requests.post(f"{BASE_URL}/models/upload", files=files, data=data)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Model uploaded successfully!")
            print(f"   ID: {result.get('model_id', 'Unknown')}")
            print(f"   Name: {result.get('name', 'Unknown')}")
            if 'feasibility_analysis' in result:
                analysis = result['feasibility_analysis']
                print(f"   Feasibility Score: {analysis.get('score', 'N/A')}/10 ({analysis.get('grade', 'N/A')})")
        else:
            print(f"❌ Model upload failed: {response.status_code}")
            print(f"   Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Error uploading model: {e}")
    
    # Check final status
    print("\n🔍 Final Status Check:")
    try:
        datasets_response = requests.get(f"{BASE_URL}/datasets/")
        models_response = requests.get(f"{BASE_URL}/models/")
        
        datasets = datasets_response.json()
        models = models_response.json().get('data', [])
        
        print(f"   📊 Total Datasets: {len(datasets)}")
        print(f"   🤖 Total Models: {len(models)}")
        
        if len(datasets) > 0:
            print(f"\n✅ Success! Now you can test:")
            print(f"   curl http://localhost:8000/api/v1/datasets/1")
            print(f"   curl http://localhost:8000/api/v1/datasets/1 | ConvertFrom-Json | Select-Object title, price, @{{Name='FeasibilityScore'; Expression={{$_.feasibility_analysis.score}}}}")
        
    except Exception as e:
        print(f"❌ Error checking final status: {e}")
    
    return True

if __name__ == "__main__":
    add_test_data()
