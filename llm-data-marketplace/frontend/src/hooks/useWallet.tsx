import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ethers } from 'ethers'
import { apiClient } from '../api/client'

interface WalletContextType {
  account: string | null
  isConnected: boolean
  isConnecting: boolean
  provider: ethers.BrowserProvider | null
  signer: ethers.Signer | null
  balance: string | null
  networkInfo: any
  connect: () => Promise<void>
  disconnect: () => void
  switchToBNBTestnet: () => Promise<void>
  // Multi-account support
  accounts: string[]
  switchAccount: (address: string) => void
  uploaderAccount: string
  buyerAccount: string
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

const BNB_TESTNET = {
  chainId: '0x61', // 97 in hex
  chainName: 'BNB Smart Chain Testnet',
  nativeCurrency: {
    name: 'tBNB',
    symbol: 'tBNB',
    decimals: 18,
  },
  rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
  blockExplorerUrls: ['https://testnet.bscscan.com/'],
}

// Predefined accounts
const UPLOADER_ACCOUNT = '0xA10C192c91b7b2712df3F98eDc0418C82b19771f'
const BUYER_ACCOUNT = '0x9ed8454F21BE1Ec34cd17e6C6abdF9CD8EE2C6b9'

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [networkInfo, setNetworkInfo] = useState<any>(null)
  const [accounts] = useState<string[]>([UPLOADER_ACCOUNT, BUYER_ACCOUNT])

  // Auto-connect with uploader account on mount
  useEffect(() => {
    // Auto-connect with uploader account
    setAccount(UPLOADER_ACCOUNT)
    setIsConnected(true)
    authenticateWithBackend(UPLOADER_ACCOUNT)
    checkIfWalletIsConnected()
  }, [])

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', () => window.location.reload())
      
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', () => window.location.reload())
      }
    }
  }, [])

  const authenticateWithBackend = async (walletAddress: string) => {
    try {
      // For now, we'll use a simple token based on the wallet address
      // In a real app, you'd implement proper authentication
      const token = `mock_token_${walletAddress}`
      apiClient.setAuthToken(token)
      console.log('Authenticated with backend:', walletAddress)
    } catch (error) {
      console.error('Failed to authenticate with backend:', error)
    }
  }

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnect()
    } else {
      setAccount(accounts[0])
      setIsConnected(true)
      authenticateWithBackend(accounts[0])
    }
  }

  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          const provider = new ethers.BrowserProvider(window.ethereum)
          const signer = await provider.getSigner()
          
          setProvider(provider)
          setSigner(signer)
          setAccount(accounts[0])
          setIsConnected(true)
          
          const balance = await provider.getBalance(accounts[0])
          setBalance(ethers.formatEther(balance))
          
          const network = await provider.getNetwork()
          setNetworkInfo(network)
        }
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error)
    }
  }

  const connect = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!')
      return
    }

    try {
      setIsConnecting(true)
      
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      
      setProvider(provider)
      setSigner(signer)
      setAccount(accounts[0])
      setIsConnected(true)
      
      await authenticateWithBackend(accounts[0])
      
      const balance = await provider.getBalance(accounts[0])
      setBalance(ethers.formatEther(balance))
      
      const network = await provider.getNetwork()
      setNetworkInfo(network)
      
      // Switch to BNB testnet after connecting
      if (network.chainId !== 97n) {
        await switchToBNBTestnet()
      }
    } catch (error) {
      console.error('Error connecting wallet:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setAccount(null)
    setIsConnected(false)
    setProvider(null)
    setSigner(null)
    setBalance(null)
    setNetworkInfo(null)
    apiClient.setAuthToken('')
  }

  const switchAccount = async (address: string) => {
    setAccount(address)
    await authenticateWithBackend(address)
    
    // Update balance if we have a provider
    if (provider) {
      try {
        const balance = await provider.getBalance(address)
        setBalance(ethers.formatEther(balance))
      } catch (error) {
        console.error('Error getting balance for switched account:', error)
        // Set a mock balance for predefined accounts
        setBalance('10.0')
      }
    } else {
      // Set a mock balance for predefined accounts
      setBalance('10.0')
    }
  }

  const switchToBNBTestnet = async () => {
    if (!window.ethereum) return

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BNB_TESTNET.chainId }],
      })
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [BNB_TESTNET],
          })
        } catch (addError) {
          console.error('Error adding BNB testnet:', addError)
        }
      } else {
        console.error('Error switching to BNB testnet:', switchError)
      }
    }
  }

  const value: WalletContextType = {
    account,
    isConnected,
    isConnecting,
    provider,
    signer,
    balance,
    networkInfo,
    connect,
    disconnect,
    switchToBNBTestnet,
    accounts,
    switchAccount,
    uploaderAccount: UPLOADER_ACCOUNT,
    buyerAccount: BUYER_ACCOUNT,
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

// Extend window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any
  }
}
