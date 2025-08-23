import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { useWallet } from '../hooks/useWallet'
import { useUploadDataset } from '../hooks/useApi'
import { useToast } from '../components/ui/use-toast'
import { Upload, FileText, DollarSign, Tag, BarChart3, Database, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react'
import PageTransition from '../components/animations/PageTransition'

export const UploadDatasetPage: React.FC = () => {
  const navigate = useNavigate()
  const { isConnected } = useWallet()
  const { toast } = useToast()
  const uploadDatasetMutation = useUploadDataset()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    format: '',
    size: '',
    license: 'MIT',
    tags: '',
    source: '',
    collection_method: '',
    file: null as File | null
  })

  const [isUploading, setIsUploading] = useState(false)
  const [feasibilityResults, setFeasibilityResults] = useState<any>(null)
  const [showResults, setShowResults] = useState(false)

  const categories = [
    'Machine Learning',
    'Computer Vision',
    'Natural Language Processing',
    'Time Series',
    'Tabular Data',
    'Audio',
    'Healthcare',
    'Finance',
    'Education',
    'Other'
  ]

  const formats = ['CSV', 'JSON', 'Parquet', 'Excel', 'SQL', 'Other']

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({ ...prev, file }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to upload datasets",
        variant: "destructive"
      })
      return
    }

    if (!formData.file) {
      toast({
        title: "No File Selected",
        description: "Please select a dataset file to upload",
        variant: "destructive"
      })
      return
    }

    setIsUploading(true)

    try {
      // Create FormData for file upload
      const uploadData = new FormData()
      uploadData.append('file', formData.file)
      uploadData.append('title', formData.title)
      uploadData.append('description', formData.description)
      uploadData.append('price', formData.price)
      uploadData.append('category', formData.category)
      uploadData.append('format', formData.format)
      uploadData.append('size', formData.size)
      uploadData.append('license', formData.license)
      uploadData.append('tags', formData.tags)
      uploadData.append('source', formData.source)
      uploadData.append('collection_method', formData.collection_method)

      const result = await uploadDatasetMutation.mutateAsync(uploadData)

      // Capture feasibility results if available
      if (result.feasibility_analysis) {
        setFeasibilityResults(result.feasibility_analysis)
        setShowResults(true)
      }

      toast({
        title: "Dataset Uploaded Successfully!",
        description: `Dataset "${result.data.title}" has been added to the marketplace` + 
                    (result.feasibility_analysis ? " with feasibility analysis" : "")
      })

      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        category: '',
        format: '',
        size: '',
        license: 'MIT',
        tags: '',
        source: '',
        collection_method: '',
        file: null
      })

      // Don't navigate immediately if we have results to show
      if (!result.feasibility_analysis) {
        navigate('/datasets')
      }

    } catch (error: any) {
      console.error('Upload failed:', error)
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload dataset. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Database className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-muted-foreground mb-6">
            Please connect your MetaMask wallet to upload datasets to the marketplace
          </p>
        </div>
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center">
            <Upload className="h-8 w-8 mr-3 text-primary" />
            Upload Dataset
          </h1>
          <p className="text-lg text-muted-foreground">
            Share your dataset with the community and earn tBNB
          </p>
        </div>

        {/* Upload Form */}
        <Card>
          <CardHeader>
            <CardTitle>Dataset Information</CardTitle>
            <CardDescription>
              Provide details about your dataset to help buyers understand its value
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: '16px',
                    fontWeight: 400,
                    lineHeight: '24px',
                    color: 'rgb(196, 197, 203)',
                    letterSpacing: 'normal'
                  }}
                  className="flex items-center"
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Basic Information
                </h3>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Dataset Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter a descriptive title for your dataset"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Describe your dataset, its contents, use cases, and any important details"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Format *
                    </label>
                    <select
                      name="format"
                      value={formData.format}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select format</option>
                      {formats.map(format => (
                        <option key={format} value={format}>{format}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <h3 
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: '16px',
                    fontWeight: 400,
                    lineHeight: '24px',
                    color: 'rgb(196, 197, 203)',
                    letterSpacing: 'normal'
                  }}
                  className="flex items-center"
                >
                  <DollarSign className="h-5 w-5 mr-2" />
                  Pricing
                </h3>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Price (tBNB) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="0.1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Set a fair price for your dataset in tBNB tokens
                  </p>
                </div>
              </div>

              {/* Dataset Metrics */}
              <div className="space-y-4">
                <h3 
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: '16px',
                    fontWeight: 400,
                    lineHeight: '24px',
                    color: 'rgb(196, 197, 203)',
                    letterSpacing: 'normal'
                  }}
                  className="flex items-center"
                >
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Dataset Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      File Size
                    </label>
                    <input
                      type="text"
                      name="size"
                      value={formData.size}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="e.g., 15.2 MB"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      License
                    </label>
                    <select
                      name="license"
                      value={formData.license}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="MIT">MIT</option>
                      <option value="Apache-2.0">Apache 2.0</option>
                      <option value="GPL-3.0">GPL 3.0</option>
                      <option value="Creative Commons">Creative Commons</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Academic">Academic Use Only</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Data Source
                    </label>
                    <input
                      type="text"
                      name="source"
                      value={formData.source}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="e.g., Public APIs, Web scraping"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Collection Method
                  </label>
                  <input
                    type="text"
                    name="collection_method"
                    value={formData.collection_method}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="e.g., API collection, Manual curation, Web scraping"
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-4">
                <h3 
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: '16px',
                    fontWeight: 400,
                    lineHeight: '24px',
                    color: 'rgb(196, 197, 203)',
                    letterSpacing: 'normal'
                  }}
                  className="flex items-center"
                >
                  <Tag className="h-5 w-5 mr-2" />
                  Tags
                </h3>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="machine learning, classification, healthcare, medical"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Add relevant tags to help users discover your dataset
                  </p>
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-4">
                <h3 
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: '16px',
                    fontWeight: 400,
                    lineHeight: '24px',
                    color: 'rgb(196, 197, 203)',
                    letterSpacing: 'normal'
                  }}
                  className="flex items-center"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Upload File
                </h3>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Dataset File *
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    required
                    accept=".csv,.json,.parquet,.xlsx,.xls,.sql"
                    className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Supported formats: CSV, JSON, Parquet, Excel, SQL
                  </p>
                  {formData.file && (
                    <p className="text-sm text-green-600 mt-2">
                      Selected: {formData.file.name} ({(formData.file.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/datasets')}
                  disabled={isUploading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isUploading || uploadDatasetMutation.isPending}
                  className="flex-1"
                >
                  {isUploading ? 'Uploading...' : 'Upload Dataset'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upload Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Ensure your dataset is clean and well-documented</p>
              <p>• Provide accurate metadata and descriptions</p>
              <p>• Use appropriate tags for discoverability</p>
              <p>• Set fair pricing based on data quality and uniqueness</p>
              <p>• Verify you have rights to distribute the data</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Earning Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• You retain ownership of your dataset</p>
              <p>• Earn tBNB tokens for each purchase</p>
              <p>• No platform fees for uploads</p>
              <p>• Payments are processed via smart contracts</p>
              <p>• Instant payouts to your connected wallet</p>
            </CardContent>
          </Card>
        </div>

        {/* Feasibility Results Modal */}
        {showResults && feasibilityResults && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Feasibility Analysis Results
                </CardTitle>
                <CardDescription>
                  Analysis completed for your uploaded dataset
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Score and Grade */}
                <div className="text-center">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-semibold ${
                    feasibilityResults.score >= 80 ? 'bg-green-100 text-green-600' :
                    feasibilityResults.score >= 60 ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    Score: {feasibilityResults.score}/100 (Grade: {feasibilityResults.grade})
                  </div>
                </div>

                {/* Dataset Info */}
                {feasibilityResults.dataset_info && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Dataset Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>Rows: {feasibilityResults.dataset_info.rows}</div>
                      <div>Columns: {feasibilityResults.dataset_info.columns}</div>
                      <div>Size: {feasibilityResults.dataset_info.size_mb} MB</div>
                      <div>Missing Data: {feasibilityResults.dataset_info.missing_percentage}%</div>
                    </div>
                  </div>
                )}

                {/* Strengths */}
                {feasibilityResults.feasibility_analysis?.strengths && (
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Strengths
                    </h4>
                    <ul className="space-y-1">
                      {feasibilityResults.feasibility_analysis.strengths.slice(0, 3).map((strength: string, index: number) => (
                        <li key={index} className="text-sm text-green-600 flex items-center">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Issues */}
                {feasibilityResults.feasibility_analysis?.issues && (
                  <div>
                    <h4 className="font-semibold text-orange-700 mb-2 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Areas for Improvement
                    </h4>
                    <ul className="space-y-1">
                      {feasibilityResults.feasibility_analysis.issues.slice(0, 3).map((issue: string, index: number) => (
                        <li key={index} className="text-sm text-orange-600 flex items-center">
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Use Cases */}
                {feasibilityResults.feasibility_analysis?.recommended_use_cases && (
                  <div>
                    <h4 className="font-semibold text-blue-700 mb-2 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Recommended Use Cases
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {feasibilityResults.feasibility_analysis.recommended_use_cases.slice(0, 4).map((useCase: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                        >
                          {useCase}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-2 pt-4">
                  <Button onClick={() => navigate('/datasets')} className="flex-1">
                    View in Marketplace
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowResults(false)}
                    className="flex-1"
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
    </PageTransition>
  )
}

export default UploadDatasetPage
