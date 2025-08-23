import React, { useState } from 'react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { useCreatePurchase, usePurchaseStatus, useDownloadDataset, useDownloadModel } from '../hooks/useApi'
import { Download, ShoppingCart, CheckCircle, AlertCircle, CreditCard } from 'lucide-react'

interface PurchaseButtonProps {
  type: 'dataset' | 'model'
  itemId: number
  itemTitle: string
  price: number
  userBalance?: number
  className?: string
}

const PurchaseButton: React.FC<PurchaseButtonProps> = ({
  type,
  itemId,
  itemTitle,
  price,
  userBalance = 0,
  className = ''
}) => {
  const [showConfirm, setShowConfirm] = useState(false)
  
  // Hooks
  const { data: purchaseStatus, isLoading: statusLoading } = usePurchaseStatus(type, itemId)
  const createPurchase = useCreatePurchase()
  const downloadDataset = useDownloadDataset()
  const downloadModel = useDownloadModel()
  
  // Check if already purchased
  const isPurchased = purchaseStatus?.purchased || false
  const canAfford = userBalance >= price
  
  const handlePurchase = async () => {
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
          <p><strong>Price:</strong> ${price.toFixed(2)}</p>
          <p><strong>Your Balance:</strong> ${userBalance.toFixed(2)}</p>
          <p><strong>After Purchase:</strong> ${(userBalance - price).toFixed(2)}</p>
        </div>
        
        {!canAfford && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            Insufficient balance
          </div>
        )}
        
        <div className="flex gap-2">
          <Button
            onClick={handlePurchase}
            disabled={!canAfford || createPurchase.isPending}
            className="flex items-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            {createPurchase.isPending ? 'Processing...' : 'Confirm Purchase'}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowConfirm(false)}
            disabled={createPurchase.isPending}
          >
            Cancel
          </Button>
        </div>
      </div>
    )
  }
  
  return (
    <Button
      onClick={() => setShowConfirm(true)}
      disabled={!canAfford}
      className={`flex items-center gap-2 ${className}`}
      variant={canAfford ? "default" : "secondary"}
    >
      <ShoppingCart className="w-4 h-4" />
      {canAfford ? `Purchase $${price.toFixed(2)}` : `Insufficient Balance ($${price.toFixed(2)})`}
    </Button>
  )
}

export default PurchaseButton
