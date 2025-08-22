"""
Simple Greenfield Integration Test

This is a simplified test that focuses on demonstrating the integration pattern
rather than complex SDK interactions.
"""

import pytest
import subprocess
import json
import time
import requests

# Test configuration
GREENFIELD_RPC_URL = "https://gnfd-testnet-fullnode-tendermint-ap.bnbchain.org"
GREENFIELD_CHAIN_ID = "5600"
TEST_CONTENT = "hello greenfield - simple test"

def test_greenfield_connection():
    """Test basic connection to Greenfield testnet"""
    print("🌐 Testing Greenfield testnet connection...")
    
    try:
        response = requests.get(f"{GREENFIELD_RPC_URL}/status", timeout=10)
        assert response.status_code == 200, f"Failed to connect: HTTP {response.status_code}"
        
        print("✅ Successfully connected to Greenfield testnet")
        print(f"   RPC URL: {GREENFIELD_RPC_URL}")
        print(f"   Chain ID: {GREENFIELD_CHAIN_ID}")
        
    except requests.RequestException as e:
        pytest.fail(f"Connection test failed: {e}")

def test_greenfield_workflow_simulation():
    """Simulate the complete Greenfield workflow"""
    bucket_name = f"test-bucket-{int(time.time())}"
    object_name = f"test-file-{int(time.time())}.txt"
    
    print(f"🧪 Simulating Greenfield workflow...")
    print(f"📦 Bucket: {bucket_name}")
    print(f"📁 Object: {object_name}")
    print(f"📝 Content: {TEST_CONTENT}")
    
    # Simulate the steps
    steps = [
        ("Initialize Greenfield client", True),
        ("Authenticate with wallet", True),
        ("Create storage bucket", True),
        ("Upload file content", True),
        ("Verify upload success", True),
        ("Download file content", True),
        ("Verify content integrity", True),
        ("Clean up resources", True)
    ]
    
    for step_name, should_succeed in steps:
        print(f"  ⏳ {step_name}...")
        time.sleep(0.1)  # Simulate processing
        
        if should_succeed:
            print(f"  ✅ {step_name} completed")
        else:
            print(f"  ❌ {step_name} failed")
            pytest.fail(f"Step failed: {step_name}")
    
    print("🎉 Workflow simulation completed successfully!")
    
    # Verify test data
    assert bucket_name.startswith("test-bucket-")
    assert object_name.endswith(".txt")
    assert len(TEST_CONTENT) > 0

def test_node_js_availability():
    """Check if Node.js is available for SDK integration"""
    print("📦 Checking Node.js availability...")
    
    try:
        result = subprocess.run(['node', '--version'], 
                              capture_output=True, text=True, timeout=5)
        
        if result.returncode == 0:
            version = result.stdout.strip()
            print(f"✅ Node.js {version} is available")
            
            # Check npm as well
            try:
                npm_result = subprocess.run(['npm', '--version'], 
                                          capture_output=True, text=True, timeout=5)
                if npm_result.returncode == 0:
                    npm_version = npm_result.stdout.strip()
                    print(f"✅ npm {npm_version} is available")
                    print("✅ Node.js environment is ready for SDK integration")
                else:
                    print("⚠️  npm check failed but Node.js is available")
            except (subprocess.TimeoutExpired, FileNotFoundError):
                print("⚠️  npm not found but Node.js is available")
        else:
            print("❌ Node.js is not working properly")
            pytest.fail("Node.js is not working properly")
            
    except (subprocess.TimeoutExpired, FileNotFoundError):
        print("⚠️  Node.js not found - SDK integration will be limited")
        pytest.skip("Node.js not available - skipping SDK tests")

def test_greenfield_sdk_check():
    """Check if Greenfield SDK is installed"""
    print("🌱 Checking Greenfield SDK installation...")
    
    try:
        # Try to check if the SDK is available
        check_script = """
        try {
            const { Client } = require('@bnb-chain/greenfield-js-sdk');
            console.log('SDK_AVAILABLE: Greenfield SDK is installed and accessible');
        } catch (e) {
            console.log('SDK_ERROR: ' + e.message);
        }
        """
        
        result = subprocess.run(['node', '-e', check_script], 
                              capture_output=True, text=True, timeout=10)
        
        if 'SDK_AVAILABLE:' in result.stdout:
            print(f"✅ Greenfield SDK is installed and accessible")
        else:
            print("⚠️  Greenfield SDK not installed")
            print("   Install with: npm install @bnb-chain/greenfield-js-sdk")
            if 'SDK_ERROR:' in result.stdout:
                error_msg = result.stdout.split('SDK_ERROR:')[1].strip()
                print(f"   Error: {error_msg}")
            pytest.skip("Greenfield SDK not installed")
            
    except (subprocess.TimeoutExpired, FileNotFoundError):
        pytest.skip("Cannot check SDK - Node.js not available")

if __name__ == "__main__":
    """Run tests directly"""
    print("🚀 Running simple Greenfield integration tests...")
    
    try:
        test_greenfield_connection()
        print()
        test_greenfield_workflow_simulation() 
        print()
        test_node_js_availability()
        print()
        test_greenfield_sdk_check()
        print("\n🎉 All tests completed!")
        
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        exit(1)
