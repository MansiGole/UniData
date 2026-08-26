import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { useCreatePurchase, usePurchaseStatus, useDownloadDataset, useDownloadModel } from '../hooks/useApi'
import { usePurchase } from '../hooks/usePurchase'
import { Dataset } from '../api/client'
import { Download, ShoppingCart, CheckCircle, AlertCircle, CreditCard } from 'lucide-react'

interface PurchaseButtonProps {
  type: 'dataset' | 'model'
  itemId: number
  itemTitle: string
  price: number
  userBalance?: number
  blockchainDatasetId?: number | null
  datasetObj?: Dataset
  className?: string
}

const PurchaseButton: React.FC<PurchaseButtonProps> = ({
  type,
  itemId,
  itemTitle,
  price,
  userBalance = 0,
  blockchainDatasetId,
  datasetObj,
  className = ''
}) => {
  const [showConfirm, setShowConfirm] = useState(false)
  const [onChainPurchased, setOnChainPurchased] = useState(false)
  
  // Hooks
  const { data: purchaseStatus, isLoading: statusLoading } = usePurchaseStatus(type, itemId)
  const createPurchase = useCreatePurchase()
  const downloadDataset = useDownloadDataset()
  const downloadModel = useDownloadModel()
  const { purchaseDataset: purchaseDatasetBlockchain, checkHasPurchased, isPurchasing: isPurchasingBlockchain } = usePurchase()

  const isBlockchainItem = type === 'dataset' && blockchainDatasetId != null && blockchainDatasetId > 0
  
  useEffect(() => {
    if (isBlockchainItem && blockchainDatasetId) {
      checkHasPurchased(blockchainDatasetId).then((purchased) => {
        if (purchased) {
          setOnChainPurchased(true)
        }
      })
    }
  }, [isBlockchainItem, blockchainDatasetId])

  // Check if already purchased
  const isPurchased = (purchaseStatus?.purchased || false) || onChainPurchased
  const canAfford = userBalance >= price

  const handlePurchase = async () => {
    if (isBlockchainItem && datasetObj) {
      try {
        const res = await purchaseDatasetBlockchain({
          ...datasetObj,
          blockchain_dataset_id: blockchainDatasetId
        })
        setShowConfirm(false)
        if (res.success) {
          setOnChainPurchased(true)
          alert(`Successfully purchased ${itemTitle} on BSC Testnet!\nTx Hash: ${res.transactionHash}`)
        } else {
          alert(`On-chain purchase error: ${res.error}`)
        }
      } catch (error: any) {
        console.error('Blockchain purchase failed:', error)
        alert(`Blockchain purchase error: ${error.message || 'Unknown error'}`)
      }
      return
    }

    if (!canAfford) {
      alert(`Insufficient balance. Required: $${price.toFixed(2)}, Available: $${userBalance.toFixed(2)}`)
      return
    }
    
    try {
      await createPurchase.mutateAsync({ type, id: itemId })
      setShowConfirm(false)
      alert(`Successfully purchased ${itemTitle}!`)
    } catch (error: any) {
      console.error('Purchase failed:', error)
      alert(`Purchase failed: ${error.message || 'Unknown error'}`)
    }
  }
  
  const handleDownload = async () => {
    try {
      if (type === 'dataset') {
        const result = await downloadDataset.mutateAsync(itemId)
        // In a real app, you would trigger the actual file download here
        alert(`Download access granted for ${result.title}. File URL: ${result.file_url}`)
      } else {
        const result = await downloadModel.mutateAsync(itemId)
        alert(`Download access granted for ${result.name}. Check console for file URLs.`)
        console.log('Model download info:', result)
      }
    } catch (error: any) {
      alert(`Download failed: ${error.message || 'Unknown error'}`)
    }
  }
  
  if (statusLoading) {
    return (
      <Button disabled className={className}>
        Loading...
      </Button>
    )
  }
  
  if (isPurchased) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Badge variant="secondary" className="flex items-center gap-1 bg-green-100 text-green-700">
          <CheckCircle className="w-3 h-3" />
          Purchased
        </Badge>
        <Button
          onClick={handleDownload}
          disabled={downloadDataset.isPending || downloadModel.isPending}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          {downloadDataset.isPending || downloadModel.isPending ? 'Preparing...' : 'Download'}
        </Button>
      </div>
    )
  }
  
  if (showConfirm) {
    return (
      <div className={`flex flex-col gap-2 p-4 border rounded-lg bg-gray-50 ${className}`}>
        <h4 className="font-semibold">Confirm Purchase</h4>
        <div className="text-sm text-gray-600">
          <p><strong>Item:</strong> {itemTitle}</p>
          <p><strong>Price:</strong> {isBlockchainItem ? `${price} tBNB` : `$${price.toFixed(2)}`}</p>
          {!isBlockchainItem && (
            <>
              <p><strong>Your Balance:</strong> ${userBalance.toFixed(2)}</p>
              <p><strong>After Purchase:</strong> ${(userBalance - price).toFixed(2)}</p>
            </>
          )}
        </div>
        
        {!isBlockchainItem && !canAfford && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            Insufficient balance
          </div>
        )}
        
        <div className="flex gap-2">
          <Button
            onClick={handlePurchase}
            disabled={(!isBlockchainItem && !canAfford) || createPurchase.isPending || isPurchasingBlockchain}
            className="flex items-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            {createPurchase.isPending || isPurchasingBlockchain ? 'Processing...' : 'Confirm Purchase'}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowConfirm(false)}
            disabled={createPurchase.isPending || isPurchasingBlockchain}
          >
            Cancel
          </Button>
        </div>
      </div>
    )
  }
  
  const isButtonDisabled = isBlockchainItem ? false : !canAfford
  const buttonVariant = (isBlockchainItem || canAfford) ? "default" : "secondary"
  const buttonText = isBlockchainItem 
    ? `Purchase ${price} tBNB` 
    : canAfford 
      ? `Purchase $${price.toFixed(2)}` 
      : `Insufficient Balance ($${price.toFixed(2)})`

  return (
    <Button
      onClick={() => setShowConfirm(true)}
      disabled={isButtonDisabled}
      className={`flex items-center gap-2 ${className}`}
      variant={buttonVariant}
    >
      <ShoppingCart className="w-4 h-4" />
      {buttonText}
    </Button>
  )
}

export default PurchaseButton
