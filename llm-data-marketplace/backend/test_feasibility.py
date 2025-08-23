#!/usr/bin/env python3
"""
Test script for feasibility analysis endpoints
"""

import requests
import json

BASE_URL = "http://localhost:8000/api/v1"
HEADERS = {
    "Authorization": "Bearer test-token-123",
    "Content-Type": "application/json"
}

def test_dataset_feasibility():
    """Test dataset feasibility analysis endpoint"""
    print("Testing Dataset Feasibility Analysis...")
    
    data = {
        "data": {
            "rows": 1000,
            "columns": 10,
            "missing_percentage": 5.2,
            "file_size_mb": 15.3
        }
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/analyze/dataset/feasibility",
            headers=HEADERS,
            json=data
        )
        
        print(f"Debug: Response status: {response.status_code}")
        print(f"Debug: Response headers: {dict(response.headers)}")
        print(f"Debug: Response text: {response.text[:200]}")
        
        if response.status_code == 200:
            result = response.json()
            analysis = result["analysis"]
            print(f"✅ SUCCESS: Score {analysis['score']}/100, Grade {analysis['grade']}")
            print(f"   ML Ready: {analysis['feasibility_analysis']['ml_readiness']}")
            if analysis['feasibility_analysis']['issues']:
                print(f"   Issues: {', '.join(analysis['feasibility_analysis']['issues'])}")
            if analysis['feasibility_analysis']['strengths']:
                print(f"   Strengths: {', '.join(analysis['feasibility_analysis']['strengths'])}")
            return True
        else:
            print(f"❌ FAILED: Status {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return False

def test_model_feasibility():
    """Test model feasibility analysis endpoint"""
    print("\nTesting Model Feasibility Analysis...")
    
    data = {
        "data": {
            "framework": "tensorflow",
            "model_size_mb": 25.7,
            "parameters": 1250000,
            "layers": 15
        }
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/analyze/model/feasibility",
            headers=HEADERS,
            json=data
        )
        
        if response.status_code == 200:
            result = response.json()
            analysis = result["analysis"]
            feasibility = analysis["feasibility_analysis"]
            print(f"✅ SUCCESS: Score {analysis['score']}/100, Grade {analysis['grade']}")
            print(f"   Framework: {analysis['framework']}")
            print(f"   Deployment Ready: {feasibility['deployment_ready']}")
            print(f"   Complexity: {feasibility['complexity_level']}")
            print(f"   Inference Time: {feasibility['estimated_inference_time']}")
            print(f"   Memory: {feasibility['memory_requirements']}")
            return True
        else:
            print(f"❌ FAILED: Status {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return False

def test_existing_endpoints():
    """Test that existing endpoints still work"""
    print("\nTesting Existing Endpoints...")
    
    try:
        # Test datasets endpoint
        response = requests.get(f"{BASE_URL}/datasets/")
        if response.status_code == 200:
            datasets = response.json()
            print(f"✅ Datasets endpoint: {len(datasets)} datasets found")
        else:
            print(f"❌ Datasets endpoint failed: {response.status_code}")
            return False
            
        # Test models endpoint  
        response = requests.get(f"{BASE_URL}/models/")
        if response.status_code == 200:
            models = response.json()
            # Handle both old and new format
            if isinstance(models, dict) and 'data' in models:
                model_count = len(models['data'])
            elif isinstance(models, dict) and 'success' in models and 'data' in models:
                model_count = len(models['data'])
            elif isinstance(models, list):
                model_count = len(models)
            else:
                model_count = "unknown"
            print(f"✅ Models endpoint: {model_count} models found")
        else:
            print(f"❌ Models endpoint failed: {response.status_code}")
            return False
            
        return True
        
    except Exception as e:
        print(f"❌ ERROR testing existing endpoints: {str(e)}")
        return False

if __name__ == "__main__":
    print("🧪 FEASIBILITY ANALYSIS ENDPOINT TESTS")
    print("=" * 50)
    
    # Test existing endpoints first
    existing_ok = test_existing_endpoints()
    
    # Test new feasibility endpoints
    dataset_ok = test_dataset_feasibility()
    model_ok = test_model_feasibility()
    
    print("\n" + "=" * 50)
    print("📊 TEST RESULTS:")
    print(f"   Existing Endpoints: {'✅ PASS' if existing_ok else '❌ FAIL'}")
    print(f"   Dataset Feasibility: {'✅ PASS' if dataset_ok else '❌ FAIL'}")
    print(f"   Model Feasibility: {'✅ PASS' if model_ok else '❌ FAIL'}")
    
    if all([existing_ok, dataset_ok, model_ok]):
        print("\n🎉 ALL TESTS PASSED! Feasibility analysis is ready!")
    else:
        print("\n⚠️  Some tests failed. Check the errors above.")
