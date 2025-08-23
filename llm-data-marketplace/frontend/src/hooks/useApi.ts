import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient, CreateDatasetRequest } from '../api/client'

// Dataset hooks
export const useDatasets = () => {
  return useQuery({
    queryKey: ['datasets'],
    queryFn: () => apiClient.getDatasets(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useDataset = (id: string) => {
  return useQuery({
    queryKey: ['dataset', id],
    queryFn: async () => {
      const response = await apiClient.getDataset(id)
      return response.data
    },
    enabled: !!id,
  })
}

export const useCreateDataset = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateDatasetRequest) => apiClient.createDataset(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['datasets'] })
    },
  })
}

export const useUploadDataset = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (formData: FormData) => apiClient.uploadDataset(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['datasets'] })
    },
  })
}

// Model hooks
export const useModels = () => {
  return useQuery({
    queryKey: ['models'],
    queryFn: async () => {
      const response = await apiClient.getModels()
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useModel = (id: string) => {
  return useQuery({
    queryKey: ['model', id],
    queryFn: async () => {
      const response = await apiClient.getModel(id)
      return response.data
    },
    enabled: !!id,
  })
}

export const useUploadModel = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (formData: FormData) => apiClient.uploadModel(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['models'] })
    },
  })
}

// Purchase hooks
export const usePurchases = () => {
  return useQuery({
    queryKey: ['purchases'],
    queryFn: async () => {
      const response = await apiClient.getPurchaseHistory()
      return response.data
    },
  })
}

// Enhanced Purchase hooks
export const useCreatePurchase = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ type, id }: { type: 'dataset' | 'model'; id: number }) => {
      return type === 'dataset' 
        ? apiClient.purchaseDataset(id)
        : apiClient.purchaseModel(id)
    },
    onSuccess: (data: any) => {
      // Show success message
      console.log('Purchase successful:', data.message)
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['purchases'] })
      queryClient.invalidateQueries({ queryKey: ['datasets'] })
      queryClient.invalidateQueries({ queryKey: ['models'] })
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] })
      
      // Update user balance if available
      if (data.user_balance !== undefined) {
        queryClient.setQueryData(['user-balance'], data.user_balance)
      }
    },
    onError: (error) => {
      console.error('Purchase failed:', error)
    }
  })
}

export const usePurchaseStatus = (itemType: string, itemId: number) => {
  return useQuery({
    queryKey: ['purchase-status', itemType, itemId],
    queryFn: () => apiClient.checkPurchaseStatus(itemType, itemId),
    enabled: !!itemType && !!itemId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useDownloadDataset = () => {
  return useMutation({
    mutationFn: (datasetId: number) => apiClient.downloadDataset(datasetId),
    onSuccess: (data) => {
      // Could trigger actual file download here
      console.log('Download info:', data)
    }
  })
}

export const useDownloadModel = () => {
  return useMutation({
    mutationFn: (modelId: number) => apiClient.downloadModel(modelId),
    onSuccess: (data) => {
      // Could trigger actual file download here
      console.log('Download info:', data)
    }
  })
}

export const useVerifyPurchase = (itemType: string, itemId: number) => {
  return useQuery({
    queryKey: ['purchase-verify', itemType, itemId],
    queryFn: () => apiClient.verifyPurchase(itemType, itemId),
    enabled: !!itemType && !!itemId,
  })
}

// Marketplace hooks
export const useMarketplace = () => {
  return useQuery({
    queryKey: ['marketplace'],
    queryFn: () => apiClient.getMarketplace(),
    staleTime: 5 * 60 * 1000,
  })
}

export const useOwnership = (userAddress: string, itemType: string, itemId: number) => {
  return useQuery({
    queryKey: ['ownership', userAddress, itemType, itemId],
    queryFn: () => apiClient.checkOwnership(userAddress, itemType, itemId),
    enabled: !!userAddress && !!itemType && !!itemId,
  })
}

// Blockchain hooks
export const useNetworkInfo = () => {
  return useQuery({
    queryKey: ['network-info'],
    queryFn: () => apiClient.getNetworkInfo(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useWalletBalance = (address: string) => {
  return useQuery({
    queryKey: ['wallet-balance', address],
    queryFn: () => apiClient.getWalletBalance(address),
    enabled: !!address,
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}

export const useConnectWallet = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (walletAddress: string) => apiClient.connectWeb3Wallet(walletAddress),
    onSuccess: (data) => {
      queryClient.setQueryData(['wallet-balance', data.wallet_address], data)
    },
  })
}

export const useUserPurchases = (address: string) => {
  return useQuery({
    queryKey: ['user-purchases', address],
    queryFn: () => apiClient.getUserPurchases(address),
    enabled: !!address,
  })
}

export const useValidateTransaction = () => {
  return useMutation({
    mutationFn: (txHash: string) => apiClient.validateTransaction(txHash),
  })
}

export const usePurchaseDatasetBlockchain = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ datasetId, buyerAddress, transactionHash }: {
      datasetId: number;
      buyerAddress: string;
      transactionHash: string;
    }) => apiClient.purchaseDatasetBlockchain(datasetId, buyerAddress, transactionHash),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['datasets'] })
      queryClient.invalidateQueries({ queryKey: ['purchases'] })
      queryClient.invalidateQueries({ queryKey: ['user-purchases'] })
    },
  })
}

export const useRegisterDatasetBlockchain = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: {
      title: string;
      description: string;
      price: number;
      storageURI: string;
      author?: string;
      size?: string;
      format?: string;
      license?: string;
    }) => apiClient.registerDatasetBlockchain(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['datasets'] })
      queryClient.invalidateQueries({ queryKey: ['marketplace'] })
    },
  })
}

// Health check hook
export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => apiClient.getHealthCheck(),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Check health every 30 seconds
  })
}

// Feasibility analysis hooks - using real backend endpoints
export const useDatasetFeasibility = (datasetId: string) => {
  return useQuery({
    queryKey: ['dataset-feasibility', datasetId],
    queryFn: () => apiClient.getDatasetFeasibility(datasetId),
    enabled: !!datasetId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useModelFeasibility = (modelId: string) => {
  return useQuery({
    queryKey: ['model-feasibility', modelId],
    queryFn: () => apiClient.getModelFeasibility(modelId),
    enabled: !!modelId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}
