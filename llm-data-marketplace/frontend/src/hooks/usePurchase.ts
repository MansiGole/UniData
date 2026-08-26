import { useState } from 'react'
import { ethers } from 'ethers'
import { useWallet } from './useWallet'
import { Dataset, apiClient } from '../api/client'
// @ts-ignore
import { CONTRACT_ADDRESSES, DATASET_MARKET_ABI } from '../../web3/contracts'

// Contract address from deployment
const DATASET_MARKET_ADDRESS = CONTRACT_ADDRESSES.DATASET_MARKET

interface PurchaseResult {
  success: boolean
  transactionHash?: string
  error?: string
}

export const usePurchase = () => {
  const [isPurchasing, setIsPurchasing] = useState(false)
  const { signer, isConnected, account } = useWallet()

  const purchaseDataset = async (dataset: Dataset): Promise<PurchaseResult> => {
    if (!isConnected || !signer || !signer.provider) {
      return { success: false, error: 'Wallet not connected' }
    }

    const targetOnChainId = dataset.blockchain_dataset_id
    if (!targetOnChainId || targetOnChainId <= 0) {
      return { success: false, error: 'Dataset does not have a valid on-chain blockchain mapping' }
    }

    try {
      setIsPurchasing(true)

      // Verify network Chain ID = 97
      const network = await signer.provider.getNetwork()
      if (Number(network.chainId) !== 97) {
        return { success: false, error: 'Please switch your wallet network to BNB Smart Chain Testnet (Chain ID 97)' }
      }

      // Create contract instance
      const contract = new ethers.Contract(
        DATASET_MARKET_ADDRESS,
        DATASET_MARKET_ABI,
        signer
      )

      // Fetch on-chain dataset details to get exact price
      const onchainDataset = await contract.getDataset(targetOnChainId)
      const onchainPrice = onchainDataset.price

      // Estimate gas with buffer
      const gasEstimate = await contract.purchaseDataset.estimateGas(targetOnChainId, {
        value: onchainPrice,
      })
      const gasLimit = (gasEstimate * 110n) / 100n

      // Execute purchase transaction on BSC Testnet
      const tx = await contract.purchaseDataset(targetOnChainId, {
        value: onchainPrice,
        gasLimit: gasLimit,
      })

      // Wait for transaction confirmation receipt
      const receipt = await tx.wait()

      if (receipt && receipt.status === 1) {
        // Record purchase in backend
        try {
          const userAddress = account || (await signer.getAddress())
          await apiClient.purchaseDatasetBlockchain(dataset.id, userAddress, receipt.hash)
        } catch (backendError) {
          console.warn('Failed to record purchase in backend:', backendError)
          // Do not fail the blockchain purchase if backend sync fails
        }

        return {
          success: true,
          transactionHash: receipt.hash,
        }
      } else {
        return {
          success: false,
          error: 'Transaction failed or was reverted on-chain',
        }
      }
    } catch (error: any) {
      console.error('Purchase failed:', error)
      
      let errorMessage = 'Purchase failed'
      
      if (error.code === 'ACTION_REJECTED') {
        errorMessage = 'Transaction was rejected by user'
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        errorMessage = 'Insufficient tBNB balance for purchase'
      } else if (error.message && error.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient tBNB balance for purchase'
      } else if (error.message && error.message.includes('Dataset is not active')) {
        errorMessage = 'Dataset is not active on-chain'
      } else if (error.message && error.message.includes('Already purchased')) {
        errorMessage = 'You have already purchased this dataset on-chain'
      } else if (error.message) {
        errorMessage = error.message
      }

      return {
        success: false,
        error: errorMessage,
      }
    } finally {
      setIsPurchasing(false)
    }
  }

  const getDatasetPrice = async (datasetId: string): Promise<string | null> => {
    if (!signer) return null

    try {
      const contract = new ethers.Contract(
        DATASET_MARKET_ADDRESS,
        DATASET_MARKET_ABI,
        signer
      )

      const priceInWei = await contract.getDatasetPrice(datasetId)
      return ethers.formatEther(priceInWei)
    } catch (error) {
      console.error('Failed to get dataset price:', error)
      return null
    }
  }

  const checkHasPurchased = async (blockchainDatasetId: number): Promise<boolean> => {
    if (!signer || !blockchainDatasetId) return false
    try {
      const userAddress = account || (await signer.getAddress())
      if (!userAddress) return false

      const contract = new ethers.Contract(
        DATASET_MARKET_ADDRESS,
        DATASET_MARKET_ABI,
        signer
      )

      return await contract.hasAddressPurchased(userAddress, blockchainDatasetId)
    } catch (error) {
      console.error('Failed to check on-chain purchase status:', error)
      return false
    }
  }

  return {
    purchaseDataset,
    getDatasetPrice,
    checkHasPurchased,
    isPurchasing,
  }
}
