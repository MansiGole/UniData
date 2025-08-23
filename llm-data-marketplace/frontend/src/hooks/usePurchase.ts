import { useState } from 'react'
import { ethers } from 'ethers'
import { useWallet } from './useWallet'
import { useCreatePurchase } from './useApi'
import { Dataset } from '../api/client'

const DATASET_MARKET_ABI = [
  "function purchaseDataset(uint256 tokenId) external payable",
  "function getDatasetPrice(uint256 tokenId) external view returns (uint256)",
  "function ownerOf(uint256 tokenId) external view returns (address)",
  "event DatasetPurchased(uint256 indexed tokenId, address indexed buyer, uint256 price)"
]

// Contract address from deployment
const DATASET_MARKET_ADDRESS = "0xC31653D4aB73911013Aa1b03b7B40E7ca352052E"

interface PurchaseResult {
  success: boolean
  transactionHash?: string
  error?: string
}

export const usePurchase = () => {
  const [isPurchasing, setIsPurchasing] = useState(false)
  const { signer, isConnected } = useWallet()
  const createPurchaseMutation = useCreatePurchase()

  const purchaseDataset = async (dataset: Dataset): Promise<PurchaseResult> => {
    if (!isConnected || !signer) {
      return { success: false, error: 'Wallet not connected' }
    }

    try {
      setIsPurchasing(true)

      // Create contract instance
      const contract = new ethers.Contract(
        DATASET_MARKET_ADDRESS,
        DATASET_MARKET_ABI,
        signer
      )

      // Convert price to wei (dataset price is in ETH/tBNB)
      const priceInWei = ethers.parseEther(dataset.price.toString())

      // Execute purchase transaction
      const tx = await contract.purchaseDataset(dataset.id, {
        value: priceInWei,
        gasLimit: 300000, // Set reasonable gas limit
      })

      // Wait for transaction confirmation
      const receipt = await tx.wait()

      if (receipt.status === 1) {
        // Record purchase in backend
        try {
          await createPurchaseMutation.mutateAsync({
            type: 'dataset',
            id: dataset.id,
          })
        } catch (backendError) {
          console.warn('Failed to record purchase in backend:', backendError)
          // Don't fail the entire purchase if backend fails
        }

        return {
          success: true,
          transactionHash: receipt.hash,
        }
      } else {
        return {
          success: false,
          error: 'Transaction failed',
        }
      }
    } catch (error: any) {
      console.error('Purchase failed:', error)
      
      let errorMessage = 'Purchase failed'
      
      if (error.code === 'ACTION_REJECTED') {
        errorMessage = 'Transaction was rejected by user'
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        errorMessage = 'Insufficient funds for purchase'
      } else if (error.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient tBNB balance'
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

  return {
    purchaseDataset,
    getDatasetPrice,
    isPurchasing,
  }
}
