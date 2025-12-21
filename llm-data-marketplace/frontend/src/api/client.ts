// Environment configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:8001' : window.location.origin)

// Backend interfaces - matching the actual API responses
export interface Dataset {
  id: number
  title: string
  description: string
  price: number
  file_url: string
  owner: string
  active: boolean
  author: string
  date: string
  download_details: string
  size: string
  format: string
  license: string
  schema: string
  sample_head: string
  feasibility_score: number
  purchase_details: string
  storageURI: string
  createdAt: number
  updatedAt: number
}

export interface Model {
  id: number
  name: string
  description: string
  framework: string
  model_type: string
  price: number
  accuracy: number
  f1_score: number
  precision: number
  recall: number
  tags: string[]
  license: string
  dataset_used: string
  training_time: string
  model_size: string
  owner: string
  file_url: string
  config_file_url?: string
  weights_file_url?: string
  created_at: number
  updated_at: number
  active: boolean
  feasibility_analysis?: {
    score: number
    grade: string
    strengths: string[]
    issues: string[]
    recommended_use_cases: string[]
  }
}

export interface Purchase {
  id: number
  user_address: string
  item_type: string
  item_id: number
  price: number
  timestamp: number
}

export interface User {
  wallet_address: string
  balance: number
  username?: string
  email?: string
}

export interface CreateDatasetRequest {
  title: string
  description: string
  price: number
  category: string
  format: string
  size: string
  license: string
  tags: string
  source: string
  collection_method: string
}

export interface CreateModelRequest {
  name: string
  description: string
  framework: string
  model_type: string
  price: number
  accuracy: number
  f1_score: number
  precision: number
  recall: number
  tags: string
  license: string
  dataset_used: string
  training_time: string
  model_size: string
}

class ApiClient {
  private baseUrl: string
  private authToken: string | null = null

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  setAuthToken(token: string) {
    this.authToken = token
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const headers: Record<string, string> = {
      ...options.headers as Record<string, string>,
    }

    // Add auth token if available
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`
    }

    // Only add Content-Type for JSON requests
    if (options.body && typeof options.body === 'string') {
      headers['Content-Type'] = 'application/json'
    }

    const config: RequestInit = {
      headers,
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error)
      throw error
    }
  }

  // Authentication endpoints
  async login(username: string, password: string): Promise<{ access_token: string; token_type: string }> {
    return this.request('/api/v1/login/access-token', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
  }

  async connectWallet(walletAddress: string): Promise<User> {
    const response = await this.request<{ status: string; wallet_address: string; balance: number }>(`/api/v1/connect/${walletAddress}`)
    return {
      wallet_address: response.wallet_address,
      balance: response.balance
    }
  }

  // Dataset endpoints
  async getDatasets(): Promise<Dataset[]> {
    return this.request<Dataset[]>('/api/v1/datasets/')
  }

  async getDataset(id: string): Promise<{ success: boolean; data: Dataset }> {
    return this.request<{ success: boolean; data: Dataset }>(`/api/v1/datasets/${id}`)
  }

  async createDataset(data: CreateDatasetRequest): Promise<{ success: boolean; data: Dataset; message: string }> {
    return this.request<{ success: boolean; data: Dataset; message: string }>('/api/v1/datasets/', {
      method: 'POST',
      body: JSON.stringify({
        id: Date.now(), // Simple ID generation
        title: data.title,
        description: data.description,
        price: data.price,
        file_url: `/uploads/datasets/${Date.now()}.csv`,
        category: data.category,
        format: data.format,
        size: data.size,
        license: data.license,
        tags: data.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        source: data.source,
        collection_method: data.collection_method,
        owner: "user_wallet_address", // This should be set from wallet context
        active: true
      }),
    })
  }

  async uploadDataset(formData: FormData): Promise<{ 
    success: boolean; 
    data: Dataset; 
    message: string; 
    dataset_id: number;
    feasibility_analysis?: any;
  }> {
    return this.request<{ 
      success: boolean; 
      data: Dataset; 
      message: string; 
      dataset_id: number;
      feasibility_analysis?: any;
    }>('/api/v1/datasets/upload', {
      method: 'POST',
      body: formData,
    })
  }

  // Model endpoints
  async getModels(): Promise<{ success: boolean; data: Model[] }> {
    return this.request<{ success: boolean; data: Model[] }>('/api/v1/models/')
  }

  async getModel(id: string): Promise<{ success: boolean; data: Model }> {
    return this.request<{ success: boolean; data: Model }>(`/api/v1/models/${id}`)
  }

  async uploadModel(formData: FormData): Promise<{ 
    success: boolean; 
    data: Model; 
    message: string; 
    model_id: number;
    feasibility_analysis?: any;
  }> {
    return this.request<{ 
      success: boolean; 
      data: Model; 
      message: string; 
      model_id: number;
      feasibility_analysis?: any;
    }>('/api/v1/models/upload', {
      method: 'POST',
      body: formData,
    })
  }

  // Enhanced Purchase endpoints
  async purchaseDataset(datasetId: number): Promise<{ 
    success: boolean; 
    message: string;
    purchase: any;
    dataset: any;
    user_balance: number;
    download_info: any;
  }> {
    return this.request<{ 
      success: boolean; 
      message: string;
      purchase: any;
      dataset: any;
      user_balance: number;
      download_info: any;
    }>(`/api/v1/marketplace/purchase/dataset/${datasetId}`, {
      method: 'POST',
    })
  }

  async purchaseModel(modelId: number): Promise<{ 
    success: boolean; 
    message: string;
    purchase: any;
    model: any;
    user_balance: number;
    download_info: any;
  }> {
    return this.request<{ 
      success: boolean; 
      message: string;
      purchase: any;
      model: any;
      user_balance: number;
      download_info: any;
    }>(`/api/v1/marketplace/purchase/model/${modelId}`, {
      method: 'POST',
    })
  }

  async checkPurchaseStatus(itemType: string, itemId: number): Promise<{
    success: boolean;
    purchased: boolean;
    purchase_date?: number;
    download_url?: string;
  }> {
    return this.request<{
      success: boolean;
      purchased: boolean;
      purchase_date?: number;
      download_url?: string;
    }>(`/api/v1/marketplace/check-purchase/${itemType}/${itemId}`)
  }

  async downloadDataset(datasetId: number): Promise<{
    success: boolean;
    dataset_id: number;
    title: string;
    file_url: string;
    download_granted: boolean;
    purchase_date: number;
    message: string;
    instructions: string;
  }> {
    return this.request<{
      success: boolean;
      dataset_id: number;
      title: string;
      file_url: string;
      download_granted: boolean;
      purchase_date: number;
      message: string;
      instructions: string;
    }>(`/api/v1/download/dataset/${datasetId}`)
  }

  async downloadModel(modelId: number): Promise<{
    success: boolean;
    model_id: number;
    name: string;
    file_url: string;
    config_file_url?: string;
    weights_file_url?: string;
    download_granted: boolean;
    purchase_date: number;
    message: string;
    instructions: string;
  }> {
    return this.request<{
      success: boolean;
      model_id: number;
      name: string;
      file_url: string;
      config_file_url?: string;
      weights_file_url?: string;
      download_granted: boolean;
      purchase_date: number;
      message: string;
      instructions: string;
    }>(`/api/v1/download/model/${modelId}`)
  }

  async getPurchaseHistory(): Promise<{ success: boolean; data: Purchase[]; total: number; page: number; page_size: number }> {
    return this.request<{ success: boolean; data: Purchase[]; total: number; page: number; page_size: number }>('/api/v1/purchases/history')
  }

  async verifyPurchase(itemType: string, itemId: number): Promise<{ success: boolean; verified: boolean; purchase: Purchase | null }> {
    return this.request<{ success: boolean; verified: boolean; purchase: Purchase | null }>(`/api/v1/purchases/verify?item_type=${itemType}&item_id=${itemId}`)
  }

  // Marketplace endpoints
  async getMarketplace(): Promise<{ total_datasets: number; datasets: Dataset[]; blockchain_source: boolean; network: string }> {
    return this.request<{ total_datasets: number; datasets: Dataset[]; blockchain_source: boolean; network: string }>('/api/v1/web3/marketplace')
  }

  async checkOwnership(userAddress: string, itemType: string, itemId: number): Promise<{ success: boolean; owns: boolean }> {
    return this.request<{ success: boolean; owns: boolean }>(`/api/v1/marketplace/ownership/${userAddress}?item_type=${itemType}&item_id=${itemId}`)
  }

  // Web3 endpoints
  async getNetworkInfo(): Promise<{ chain_id: number; name: string; currency: string; rpc_url: string; explorer_url: string }> {
    return this.request<{ chain_id: number; name: string; currency: string; rpc_url: string; explorer_url: string }>('/api/v1/web3/network')
  }

  async getWalletBalance(address: string): Promise<{ address: string; balance: number; currency: string; network: string }> {
    return this.request<{ address: string; balance: number; currency: string; network: string }>(`/api/v1/web3/balance/${address}`)
  }

  async validateTransaction(txHash: string): Promise<{ status: string; hash: string; confirmed: boolean }> {
    return this.request<{ status: string; hash: string; confirmed: boolean }>('/api/v1/web3/validate-transaction', {
      method: 'POST',
      body: JSON.stringify({ transaction_hash: txHash }),
    })
  }

  async connectWeb3Wallet(walletAddress: string): Promise<{ status: string; wallet_address: string; balance: number; currency: string; network: string; access_token?: string; token_type?: string }> {
    return this.request<{ status: string; wallet_address: string; balance: number; currency: string; network: string; access_token?: string; token_type?: string }>(`/api/v1/web3/connect/${walletAddress}`)
  }

  async getUserPurchases(address: string): Promise<{ user_address: string; total_purchases: number; purchases: Array<{ purchase: Purchase; dataset: Dataset }> }> {
    return this.request<{ user_address: string; total_purchases: number; purchases: Array<{ purchase: Purchase; dataset: Dataset }> }>(`/api/v1/web3/user-purchases/${address}`)
  }

  async getBlockchainDataset(datasetId: number): Promise<Dataset> {
    return this.request<Dataset>(`/api/v1/web3/dataset/${datasetId}`)
  }

  async purchaseDatasetBlockchain(datasetId: number, buyerAddress: string, transactionHash: string): Promise<{ success: boolean; purchase: Purchase; transaction: any; dataset: Dataset; download_url: string }> {
    return this.request<{ success: boolean; purchase: Purchase; transaction: any; dataset: Dataset; download_url: string }>('/api/v1/web3/purchase-dataset-blockchain', {
      method: 'POST',
      body: JSON.stringify({
        dataset_id: datasetId,
        buyer_address: buyerAddress,
        transaction_hash: transactionHash,
      }),
    })
  }

  async registerDatasetBlockchain(data: {
    title: string;
    description: string;
    price: number;
    storageURI: string;
    author?: string;
    size?: string;
    format?: string;
    license?: string;
  }): Promise<{ success: boolean; dataset: Dataset; message: string }> {
    return this.request<{ success: boolean; dataset: Dataset; message: string }>('/api/v1/web3/register-dataset-blockchain', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Utility endpoints
  async getHealthCheck(): Promise<{ success: boolean; status: string; data: { datasets_count: number; models_count: number; users_count: number; purchases_count: number } }> {
    return this.request<{ success: boolean; status: string; data: { datasets_count: number; models_count: number; users_count: number; purchases_count: number } }>('/api/v1/utils/health')
  }

  // Feasibility analysis endpoints
  async getDatasetFeasibility(datasetId: string): Promise<{ 
    dataset_id: number; 
    dataset_title: string; 
    feasibility_analysis: any 
  }> {
    return this.request<{ 
      dataset_id: number; 
      dataset_title: string; 
      feasibility_analysis: any 
    }>(`/api/v1/datasets/${datasetId}/feasibility`)
  }

  async getModelFeasibility(modelId: string): Promise<{ 
    model_id: number; 
    model_title: string; 
    feasibility_analysis: any 
  }> {
    return this.request<{ 
      model_id: number; 
      model_title: string; 
      feasibility_analysis: any 
    }>(`/api/v1/models/${modelId}/feasibility`)
  }

  async analyzeDatasetFeasibility(file: File): Promise<{
    status: string;
    filename: string;
    user: string;
    analysis: any;
  }> {
    const formData = new FormData()
    formData.append('file', file)
    
    return this.request<{
      status: string;
      filename: string;
      user: string;
      analysis: any;
    }>('/api/v1/datasets/analyze-feasibility', {
      method: 'POST',
      body: formData,
    })
  }

  async analyzeModelFeasibility(file: File): Promise<{
    status: string;
    filename: string;
    user: string;
    analysis: any;
  }> {
    const formData = new FormData()
    formData.append('file', file)
    
    return this.request<{
      status: string;
      filename: string;
      user: string;
      analysis: any;
    }>('/api/v1/models/analyze-feasibility', {
      method: 'POST',
      body: formData,
    })
  }
}

export const apiClient = new ApiClient()
