import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '../hooks/useWallet'
import { useUploadDataset } from '../hooks/useApi'
import { useToast } from '../components/ui/use-toast'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

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
    'IoT',
    'Other'
  ]

  const formats = ['CSV', 'JSON', 'Parquet', 'Excel', 'XML', 'TXT', 'Images', 'Other']

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFormData(prev => ({
        ...prev,
        file,
        // Auto-fill some fields based on file
        format: prev.format || file.name.split('.').pop()?.toUpperCase() || 'Other',
        size: prev.size || `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      }))
    }
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast({ title: "Error", description: "Title is required", variant: "destructive" })
      return false
    }
    if (!formData.description.trim()) {
      toast({ title: "Error", description: "Description is required", variant: "destructive" })
      return false
    }
    if (!formData.price || parseFloat(formData.price) < 0) {
      toast({ title: "Error", description: "Valid price is required", variant: "destructive" })
      return false
    }
    if (!formData.file) {
      toast({ title: "Error", description: "Dataset file is required", variant: "destructive" })
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isConnected) {
      toast({ title: "Error", description: "Please connect your wallet first", variant: "destructive" })
      return
    }

    if (!validateForm()) return

    setIsUploading(true)
    try {
      // Create FormData for file upload
      const uploadData = new FormData()
      uploadData.append('file', formData.file!)
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

      toast({ 
        title: "Success", 
        description: `Dataset "${result.data.title}" uploaded successfully!`,
        variant: "default"
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

      // Navigate to datasets page
      navigate('/datasets')

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
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Wallet Connection Required</CardTitle>
            <CardDescription>
              Please connect your wallet to upload datasets.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} className="w-full">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Upload Dataset</h1>
          <p className="text-muted-foreground mt-2">
            Share your valuable dataset with the community and earn tBNB
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dataset Information</CardTitle>
            <CardDescription>
              Fill in the details about your dataset. All fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="e.g., Customer Sentiment Analysis Dataset"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="price" className="text-sm font-medium">
                    Price (tBNB) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Describe your dataset, its contents, and potential use cases..."
                  required
                />
              </div>

              {/* Dataset Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="format" className="text-sm font-medium">
                    Format
                  </label>
                  <select
                    id="format"
                    name="format"
                    value={formData.format}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select format</option>
                    {formats.map(format => (
                      <option key={format} value={format}>{format}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="size" className="text-sm font-medium">
                    Size
                  </label>
                  <input
                    type="text"
                    id="size"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="e.g., 10 MB, 1.5 GB"
                  />
                </div>
              </div>

              {/* Additional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="license" className="text-sm font-medium">
                    License
                  </label>
                  <select
                    id="license"
                    name="license"
                    value={formData.license}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
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

                <div className="space-y-2">
                  <label htmlFor="source" className="text-sm font-medium">
                    Data Source
                  </label>
                  <input
                    type="text"
                    id="source"
                    name="source"
                    value={formData.source}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="e.g., Public APIs, Web scraping, Surveys"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="tags" className="text-sm font-medium">
                    Tags
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="machine-learning, nlp, sentiment-analysis"
                  />
                  <p className="text-xs text-muted-foreground">Separate tags with commas</p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="collection_method" className="text-sm font-medium">
                    Collection Method
                  </label>
                  <input
                    type="text"
                    id="collection_method"
                    name="collection_method"
                    value={formData.collection_method}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="e.g., API collection, Manual curation"
                  />
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <label htmlFor="file" className="text-sm font-medium">
                  Dataset File *
                </label>
                <input
                  type="file"
                  id="file"
                  name="file"
                  onChange={handleFileChange}
                  accept=".csv,.json,.parquet,.xlsx,.xml,.txt,.zip,.tar.gz"
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Supported formats: CSV, JSON, Parquet, Excel, XML, TXT, ZIP, TAR.GZ
                </p>
                {formData.file && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {formData.file.name} ({(formData.file.size / (1024 * 1024)).toFixed(2)} MB)
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/datasets')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1"
                >
                  {isUploading ? 'Uploading...' : 'Upload Dataset'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
