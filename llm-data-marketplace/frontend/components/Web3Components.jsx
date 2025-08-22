import React, { useState, useEffect } from 'react';
import { web3Service } from '../web3/contracts.js';

// MetaMask Wallet Component
export const WalletConnector = () => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if already connected
    checkConnection();
    
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    if (web3Service.isMetaMaskInstalled() && window.ethereum.selectedAddress) {
      try {
        const result = await web3Service.connectWallet();
        setAccount(result.account);
        setBalance(result.balance);
      } catch (error) {
        console.error('Auto-connection failed:', error);
      }
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      // User disconnected
      setAccount(null);
      setBalance('0');
      web3Service.disconnect();
    } else {
      // User switched accounts
      setAccount(accounts[0]);
      updateBalance();
    }
  };

  const handleChainChanged = () => {
    // Reload the page when chain changes
    window.location.reload();
  };

  const connectWallet = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await web3Service.connectWallet();
      setAccount(result.account);
      setBalance(result.balance);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateBalance = async () => {
    try {
      const newBalance = await web3Service.getBalance();
      setBalance(newBalance);
    } catch (error) {
      console.error('Error updating balance:', error);
    }
  };

  const disconnectWallet = () => {
    web3Service.disconnect();
    setAccount(null);
    setBalance('0');
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const formatBalance = (balance) => {
    return parseFloat(balance).toFixed(4);
  };

  if (!web3Service.isMetaMaskInstalled()) {
    return (
      <div className="wallet-connector">
        <div className="metamask-install">
          <h3>MetaMask Required</h3>
          <p>Please install MetaMask to connect your wallet</p>
          <a 
            href="https://metamask.io/download/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Install MetaMask
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-connector">
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {!account ? (
        <div className="connect-wallet">
          <button 
            onClick={connectWallet} 
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Connecting...' : 'Connect Wallet'}
          </button>
          <p className="help-text">
            Connect your MetaMask wallet to buy and sell datasets with tBNB
          </p>
        </div>
      ) : (
        <div className="wallet-connected">
          <div className="wallet-info">
            <div className="account">
              <strong>Account:</strong> {formatAddress(account)}
            </div>
            <div className="balance">
              <strong>Balance:</strong> {formatBalance(balance)} tBNB
            </div>
            <div className="network">
              <span className="network-badge">BNB Testnet</span>
            </div>
          </div>
          <div className="wallet-actions">
            <button onClick={updateBalance} className="btn btn-sm btn-secondary">
              Refresh Balance
            </button>
            <button onClick={disconnectWallet} className="btn btn-sm btn-outline">
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Dataset Purchase Component
export const DatasetPurchaser = ({ dataset, onPurchaseComplete }) => {
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState(null);
  const [hasPurchased, setHasPurchased] = useState(false);

  useEffect(() => {
    checkPurchaseStatus();
  }, [dataset.id]);

  const checkPurchaseStatus = async () => {
    try {
      const purchased = await web3Service.hasUserPurchased(dataset.id);
      setHasPurchased(purchased);
    } catch (error) {
      console.error('Error checking purchase status:', error);
    }
  };

  const handlePurchase = async () => {
    setPurchasing(true);
    setError(null);

    try {
      if (!web3Service.account) {
        throw new Error('Please connect your wallet first');
      }

      const result = await web3Service.purchaseDataset(dataset.id);
      
      setHasPurchased(true);
      
      if (onPurchaseComplete) {
        onPurchaseComplete(result);
      }

      alert(`Purchase successful! Transaction: ${result.transactionHash}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setPurchasing(false);
    }
  };

  if (hasPurchased) {
    return (
      <div className="purchase-status purchased">
        <span className="status-icon">✅</span>
        <span>Already Purchased</span>
        <button className="btn btn-success btn-sm">
          Download Dataset
        </button>
      </div>
    );
  }

  return (
    <div className="dataset-purchaser">
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <div className="purchase-info">
        <div className="price">
          <strong>{dataset.price} tBNB</strong>
        </div>
        <div className="platform-fee">
          <small>+ 2% platform fee</small>
        </div>
      </div>

      <button 
        onClick={handlePurchase}
        disabled={purchasing || !web3Service.account}
        className="btn btn-primary purchase-btn"
      >
        {purchasing ? 'Processing...' : `Buy for ${dataset.price} tBNB`}
      </button>

      {!web3Service.account && (
        <p className="help-text">
          Connect your wallet to purchase this dataset
        </p>
      )}
    </div>
  );
};

// Dataset Registration Component
export const DatasetRegistrar = ({ onRegistrationComplete }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    storageURI: '',
    author: '',
    size: '',
    format: 'CSV',
    license: 'MIT'
  });
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegistering(true);
    setError(null);

    try {
      if (!web3Service.account) {
        throw new Error('Please connect your wallet first');
      }

      if (!formData.title || !formData.description || !formData.price || !formData.storageURI) {
        throw new Error('Please fill in all required fields');
      }

      const result = await web3Service.registerDataset({
        ...formData,
        price: parseFloat(formData.price)
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        storageURI: '',
        author: '',
        size: '',
        format: 'CSV',
        license: 'MIT'
      });

      if (onRegistrationComplete) {
        onRegistrationComplete(result);
      }

      alert(`Dataset registered successfully! ID: ${result.datasetId}, Transaction: ${result.transactionHash}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setRegistering(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="dataset-registrar">
      <h3>Register New Dataset</h3>
      
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="3"
            className="form-control"
          />
        </div>

        <div className="form-row">
          <div className="form-group col">
            <label htmlFor="price">Price (tBNB) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.001"
              min="0"
              required
              className="form-control"
            />
          </div>

          <div className="form-group col">
            <label htmlFor="format">Format</label>
            <select
              id="format"
              name="format"
              value={formData.format}
              onChange={handleChange}
              className="form-control"
            >
              <option value="CSV">CSV</option>
              <option value="JSON">JSON</option>
              <option value="Parquet">Parquet</option>
              <option value="XML">XML</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="storageURI">Storage URI (Greenfield/IPFS) *</label>
          <input
            type="text"
            id="storageURI"
            name="storageURI"
            value={formData.storageURI}
            onChange={handleChange}
            placeholder="greenfield://bucket/object or ipfs://hash"
            required
            className="form-control"
          />
        </div>

        <div className="form-row">
          <div className="form-group col">
            <label htmlFor="author">Author</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group col">
            <label htmlFor="size">Size</label>
            <input
              type="text"
              id="size"
              name="size"
              value={formData.size}
              onChange={handleChange}
              placeholder="e.g., 10MB, 1GB"
              className="form-control"
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={registering || !web3Service.account}
          className="btn btn-primary"
        >
          {registering ? 'Registering...' : 'Register Dataset'}
        </button>

        {!web3Service.account && (
          <p className="help-text">
            Connect your wallet to register a dataset
          </p>
        )}
      </form>
    </div>
  );
};

// CSS Styles
export const WalletStyles = `
.wallet-connector {
  max-width: 400px;
  margin: 20px 0;
}

.metamask-install {
  text-align: center;
  padding: 20px;
  border: 2px dashed #ccc;
  border-radius: 8px;
}

.wallet-connected {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background: #f9f9f9;
}

.wallet-info {
  margin-bottom: 15px;
}

.wallet-info > div {
  margin-bottom: 8px;
}

.network-badge {
  background: #28a745;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.wallet-actions {
  display: flex;
  gap: 10px;
}

.dataset-purchaser {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin: 15px 0;
}

.purchase-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.purchase-btn {
  width: 100%;
}

.purchase-status.purchased {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
}

.dataset-registrar {
  max-width: 600px;
  margin: 20px 0;
}

.form-group {
  margin-bottom: 15px;
}

.form-row {
  display: flex;
  gap: 15px;
}

.form-row .form-group {
  flex: 1;
}

.form-control {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-outline {
  background: transparent;
  border: 1px solid #6c757d;
  color: #6c757d;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.alert {
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.alert-danger {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

.help-text {
  font-size: 12px;
  color: #6c757d;
  margin-top: 8px;
}
`;
