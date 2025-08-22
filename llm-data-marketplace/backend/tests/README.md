# BNB Greenfield Integration Tests

This directory contains integration tests for BNB Greenfield storage functionality in the LLM Data Marketplace project.

## 🎯 Purpose

These tests verify that your application can:
1. Connect to BNB Greenfield testnet
2. Create storage buckets
3. Upload files to Greenfield storage
4. Download and verify file contents
5. Manage storage resources

## 📋 Prerequisites

### Python Requirements
- Python 3.8+
- pytest
- requests

### Node.js Requirements
- Node.js 16+
- npm
- @bnb-chain/greenfield-js-sdk

### Greenfield Setup
- BNB Greenfield testnet access
- Test wallet with private key
- Some testnet BNB for transaction fees

## 🚀 Quick Start

### Option 1: Automated Setup
```bash
cd backend
python setup_greenfield_tests.py
```

### Option 2: Manual Setup

1. **Install Python dependencies:**
```bash
pip install pytest requests
```

2. **Install Node.js dependencies:**
```bash
cd backend
npm install @bnb-chain/greenfield-js-sdk
```

3. **Set up environment variables (optional):**
```bash
export GREENFIELD_PRIVATE_KEY="your_test_private_key_here"
```

## 🧪 Running Tests

### Python Tests
```bash
# Run all tests
pytest tests/test_greenfield_integration.py -s

# Run specific test
pytest tests/test_greenfield_integration.py::test_greenfield_nodejs_integration -s

# Run with verbose output
pytest tests/test_greenfield_integration.py -s -v

# Run only integration tests
pytest tests/test_greenfield_integration.py -m integration -s
```

### Node.js Tests
```bash
# Run standalone Node.js test
node test_greenfield_standalone.js

# Or via npm script
npm test
```

## 📁 Test Files

### `tests/test_greenfield_integration.py`
Main Python test file containing:
- **`test_greenfield_nodejs_integration()`**: Tests Greenfield via Node.js SDK
- **`test_greenfield_python_http_integration()`**: Tests Greenfield HTTP API
- **`test_greenfield_mock_integration()`**: Mock test for CI/CD pipelines

### `test_greenfield_standalone.js`
Standalone Node.js script for testing Greenfield SDK directly:
- Initialize client and authenticate
- Create bucket and upload file
- Download and verify content
- Clean up resources

### Supporting Files
- **`package.json`**: Node.js dependencies and scripts
- **`pytest.ini`**: Pytest configuration
- **`setup_greenfield_tests.py`**: Automated setup script
- **`requirements.txt`**: Python test dependencies

## ⚙️ Configuration

### Testnet Settings
- **RPC URL**: `https://gnfd-testnet-fullnode-tendermint-ap.bnbchain.org`
- **Chain ID**: `5600`
- **Network**: BNB Greenfield Testnet

### Environment Variables
```bash
# Optional: Set your test private key
export GREENFIELD_PRIVATE_KEY="0x..."

# Optional: Custom testnet endpoints
export GREENFIELD_RPC_URL="https://gnfd-testnet-fullnode-tendermint-ap.bnbchain.org"
export GREENFIELD_CHAIN_ID="5600"
```

## 🔧 Test Types

### 1. Full Integration Test (`test_greenfield_nodejs_integration`)
- Uses Node.js SDK via subprocess
- Tests complete upload/download cycle
- Requires Node.js and Greenfield SDK

### 2. HTTP API Test (`test_greenfield_python_http_integration`)
- Tests basic connectivity to Greenfield RPC
- Uses Python requests library
- Lighter weight alternative

### 3. Mock Test (`test_greenfield_mock_integration`)
- Simulates Greenfield operations
- No network calls required
- Good for CI/CD pipelines

## 🐛 Troubleshooting

### Common Issues

1. **"Node.js not found"**
   - Install Node.js from https://nodejs.org/
   - Ensure `node` and `npm` are in your PATH

2. **"@bnb-chain/greenfield-js-sdk not installed"**
   ```bash
   npm install @bnb-chain/greenfield-js-sdk
   ```

3. **"Connection timeout"**
   - Check internet connection
   - Verify Greenfield testnet is accessible
   - Try different RPC endpoint

4. **"Authentication failed"**
   - Verify your private key is correct
   - Ensure wallet has testnet BNB for fees
   - Check private key format (should start with 0x)

5. **"Bucket creation failed"**
   - Bucket names must be globally unique
   - Use timestamp-based names
   - Check account balance for fees

### Debug Mode

Run tests with debug output:
```bash
# Python tests with full output
pytest tests/test_greenfield_integration.py -s -vv --tb=long

# Node.js with debug environment
DEBUG=* node test_greenfield_standalone.js
```

## 📚 Integration Examples

### Using in FastAPI Backend
```python
from tests.test_greenfield_integration import run_node_script

async def upload_to_greenfield(file_content, bucket_name, object_name):
    script = f"""
    // Your Greenfield upload logic here
    const result = await client.uploadFile('{bucket_name}', '{object_name}', content);
    console.log(JSON.stringify(result));
    """
    return run_node_script(script)
```

### Using in Storage Service
```python
# app/services/greenfield_service.py
import subprocess
import json

class GreenfieldService:
    def upload_dataset(self, file_path, metadata):
        # Implementation using Node.js SDK
        pass
    
    def download_dataset(self, bucket, object_name):
        # Implementation for downloading
        pass
```

## 🔐 Security Notes

- **Never commit real private keys to version control**
- Use environment variables for sensitive data
- Test private keys should only have testnet funds
- Consider using hardware wallets for production

## 📈 Performance Tips

- Batch operations when possible
- Use appropriate redundancy types
- Monitor storage costs
- Implement retry mechanisms for network issues

## 🤝 Contributing

When adding new Greenfield tests:
1. Follow the existing test structure
2. Add appropriate error handling
3. Clean up resources after tests
4. Document any new configuration options
5. Test both success and failure scenarios

## 📞 Support

- [BNB Greenfield Documentation](https://docs.bnbchain.org/greenfield-docs/)
- [Greenfield JS SDK](https://github.com/bnb-chain/greenfield-js-sdk)
- [Testnet Faucet](https://testnet.bnbchain.org/faucet-smart)
