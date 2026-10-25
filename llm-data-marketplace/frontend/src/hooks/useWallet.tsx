import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ethers } from 'ethers'
import { apiClient } from '../api/client'

export type TransactionRole = 'uploader' | 'buyer'

export const UPLOADER_ACCOUNT = '0xCcfA277C946b8527DFF6d6A20e285A0E3401ADDe'
export const BUYER_ACCOUNT = '0x6237E39Cb5D50285A944dfd0E9BAf32d4B0bDBa5'

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
  // Multi-account and role support
  accounts: string[]
  switchAccount: (address: string) => Promise<void>
  uploaderAccount: string
  buyerAccount: string
  role: TransactionRole
  isUploader: boolean
  isBuyer: boolean
  setRole: (role: TransactionRole) => Promise<void>
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

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [networkInfo, setNetworkInfo] = useState<any>(null)
  const [accounts, setAccounts] = useState<string[]>([])

  // Check if wallet is already connected via eth_accounts on mount
  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  // Listen for MetaMask account and chain changes
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
      const token = `mock_token_${walletAddress}`
      apiClient.setAuthToken(token)
      console.log('Authenticated with backend:', walletAddress)
      
      // Fetch user balance from backend connect wallet API
      const response = await apiClient.connectWallet(walletAddress)
      if (response && response.balance !== undefined) {
        setBalance(response.balance.toString())
      }
    } catch (error) {
      console.error('Failed to authenticate with backend:', error)
    }
  }

  const handleAccountsChanged = async (newAccounts: string[]) => {
    if (!newAccounts || newAccounts.length === 0) {
      disconnect()
    } else {
      setAccounts(newAccounts)
      setAccount(newAccounts[0])
      setIsConnected(true)
      await authenticateWithBackend(newAccounts[0])
      
      if (window.ethereum) {
        try {
          const browserProvider = new ethers.BrowserProvider(window.ethereum)
          const browserSigner = await browserProvider.getSigner()
          setProvider(browserProvider)
          setSigner(browserSigner)
          const bal = await browserProvider.getBalance(newAccounts[0])
          setBalance(ethers.formatEther(bal))
          const network = await browserProvider.getNetwork()
          setNetworkInfo(network)
        } catch (e) {
          console.error('Error updating provider on accountsChanged:', e)
        }
      }
    }
  }

  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {
        const ethAccounts: string[] = await window.ethereum.request({ method: 'eth_accounts' })
        if (ethAccounts && ethAccounts.length > 0) {
          const browserProvider = new ethers.BrowserProvider(window.ethereum)
          const browserSigner = await browserProvider.getSigner()
          
          setProvider(browserProvider)
          setSigner(browserSigner)
          setAccounts(ethAccounts)
          setAccount(ethAccounts[0])
          setIsConnected(true)
          
          await authenticateWithBackend(ethAccounts[0])
          
          const bal = await browserProvider.getBalance(ethAccounts[0])
          setBalance(ethers.formatEther(bal))
          
          const network = await browserProvider.getNetwork()
          setNetworkInfo(network)
        } else {
          // Keep disconnected state if no accounts authorized
          disconnect()
        }
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error)
      disconnect()
    }
  }

  const connect = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!')
      return
    }

    try {
      setIsConnecting(true)
      
      const reqAccounts: string[] = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      if (reqAccounts && reqAccounts.length > 0) {
        const browserProvider = new ethers.BrowserProvider(window.ethereum)
        const browserSigner = await browserProvider.getSigner()
        
        setProvider(browserProvider)
        setSigner(browserSigner)
        setAccounts(reqAccounts)
        setAccount(reqAccounts[0])
        setIsConnected(true)
        
        await authenticateWithBackend(reqAccounts[0])
        
        const bal = await browserProvider.getBalance(reqAccounts[0])
        setBalance(ethers.formatEther(bal))
        
        const network = await browserProvider.getNetwork()
        setNetworkInfo(network)
        
        // Switch to BNB testnet after connecting
        if (network.chainId !== 97n) {
          await switchToBNBTestnet()
        }
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
    setAccounts([])
    apiClient.setAuthToken('')
  }

  const uploaderAccount = accounts.find(a => a.toLowerCase() === UPLOADER_ACCOUNT.toLowerCase()) || (accounts.length > 1 ? accounts[0] : UPLOADER_ACCOUNT)
  const buyerAccount = accounts.find(a => a.toLowerCase() === BUYER_ACCOUNT.toLowerCase()) || (accounts.length > 1 ? accounts[1] : BUYER_ACCOUNT)

  const isUploader = Boolean(account && account.toLowerCase() === uploaderAccount.toLowerCase())
  const isBuyer = !isUploader
  const role: TransactionRole = isUploader ? 'uploader' : 'buyer'

  const switchAccount = async (address: string) => {
    setAccount(address)
    await authenticateWithBackend(address)
    
    // Update balance and signer if we have a provider
    if (provider) {
      try {
        const newSigner = await provider.getSigner(address)
        setSigner(newSigner)
      } catch (e) {
        console.warn('Could not get signer for address directly:', e)
      }
      try {
        const bal = await provider.getBalance(address)
        setBalance(ethers.formatEther(bal))
      } catch (error) {
        console.error('Error getting balance for switched account:', error)
      }
    }
  }

  const setRole = async (targetRole: TransactionRole) => {
    const targetAddress = targetRole === 'uploader' ? uploaderAccount : buyerAccount
    await switchAccount(targetAddress)
  }

  const switchToBNBTestnet = async () => {
    if (!window.ethereum) return

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BNB_TESTNET.chainId }],
      })
    } catch (switchError: any) {
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
    uploaderAccount,
    buyerAccount,
    role,
    isUploader,
    isBuyer,
    setRole,
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
