import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { useWallet } from '../hooks/useWallet'
import { useUploadModel } from '../hooks/useApi'
import { useToast } from '../components/ui/use-toast'
import { Upload, Database, DollarSign, Tag, BarChart3, FileText, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react'

export const UploadModelPage: React.FC = () => {
  const navigate = useNavigate()
  const { isConnected, account } = useWallet()
  const { toast } = useToast()
  const uploadModelMutation = useUploadModel()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    framework: '',
    model_type: '',
    accuracy: '',
    parameters: '',
    training_dataset: '',
    license: 'MIT',
    tags: '',
    file: null as File | null
  })

  const [isUploading, setIsUploading] = useState(false)
  const [feasibilityResults, setFeasibilityResults] = useState<any>(null)
  const [showResults, setShowResults] = useState(false)

  const categories = [
    'Computer Vision',
    'Natural Language Processing',
    'Speech Recognition',
    'Time Series Forecasting',
    'Recommendation Systems',
    'Generative Models',
    'Reinforcement Learning',
    'Anomaly Detection',
    'Classification',
    'Regression',
    'Other'
  ]

  const frameworks = [
    'TensorFlow',
    'PyTorch',
    'Keras',
    'Scikit-learn',
    'XGBoost',
    'Hugging Face',
    'ONNX',
    'JAX',
    'MXNet',
    'Other'
  ]

  const modelTypes = [
    'Neural Network',
    'Transformer',
    'CNN',
    'RNN/LSTM',
    'GAN',
    'VAE',
    'Random Forest',
    'SVM',
    'Linear Model',
    'Ensemble',
    'Other'
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFormData(prev => ({ ...prev, file }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to upload models",
        variant: "destructive"
      });
      return;
    }
    if (!formData.file) {
      toast({
        title: "No Model File Selected",
        description: "Please select a model file to upload",
        variant: "destructive"
      });
      return;
    }
    setIsUploading(true);
    try {
      // Create FormData for file upload (backend expects 'file' and 'metadata')
      const uploadData = new FormData();
      uploadData.append('file', formData.file);
      uploadData.append('metadata', JSON.stringify({
        title: formData.title,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        framework: formData.framework,
        model_type: formData.model_type,
        accuracy: formData.accuracy,
        parameters: formData.parameters,
        training_dataset: formData.training_dataset,
        license: formData.license,
        tags: formData.tags,
      }));
      if (typeof account === 'string') {
        uploadData.append('owner', account);
      }
      const result = await uploadModelMutation.mutateAsync(uploadData);
      if (result.feasibility_analysis) {
        setFeasibilityResults(result.feasibility_analysis);
        setShowResults(true);
      }
      toast({
        title: "Model Uploaded Successfully!",
        description: `Model "${result.data.name}" has been added to the marketplace` + (result.feasibility_analysis ? " with feasibility analysis" : "")
      });
      setFormData({
        title: '',
        description: '',
        price: '',
        category: '',
        framework: '',
        model_type: '',
        accuracy: '',
        parameters: '',
        training_dataset: '',
        license: 'MIT',
        tags: '',
        file: null
      });
      if (!result.feasibility_analysis) {
        navigate('/models');
      }
    } catch (error: any) {
      console.error('Upload failed:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload model. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Database className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-muted-foreground mb-6">
            Please connect your MetaMask wallet to upload ML models to the marketplace
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center">
            <Upload className="h-8 w-8 mr-3 text-primary" />
            Upload ML Model
          </h1>
          <p className="text-lg text-muted-foreground">
            Share your trained machine learning models and earn tBNB
          </p>
        </div>

        {/* Upload Form */}
        <Card>
          <CardHeader>
            <CardTitle>Model Information</CardTitle>
            <CardDescription>
              Provide comprehensive details about your ML model to help buyers understand its capabilities
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
                    Model Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter a descriptive title for your model"
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
                    placeholder="Describe your model architecture, training process, use cases, and performance characteristics"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <option value="">Select category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Framework *
                    </label>
                    <select
                      name="framework"
                      value={formData.framework}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select framework</option>
                      {frameworks.map(framework => (
                        <option key={framework} value={framework}>{framework}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Model Type *
                    </label>
                    <select
                      name="model_type"
                      value={formData.model_type}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select type</option>
                      {modelTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
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
                    placeholder="0.5"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Set a fair price for your trained model in tBNB tokens
                  </p>
                </div>
              </div>

              {/* Model Metrics */}
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
                  Performance Metrics
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Accuracy (%)
                    </label>
                    <input
                      type="number"
                      name="accuracy"
                      value={formData.accuracy}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      step="0.01"
                      className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="95.5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Parameters (M)
                    </label>
                    <input
                      type="text"
                      name="parameters"
                      value={formData.parameters}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="e.g., 175B, 7.5M"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Training Dataset
                    </label>
                    <input
                      type="text"
                      name="training_dataset"
                      value={formData.training_dataset}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="ImageNet, COCO, etc."
                    />
                  </div>
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
                    placeholder="computer vision, classification, pretrained, high accuracy"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Add relevant tags to help users discover your model
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
                  Model File
                </h3>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Model File * (.pkl, .h5, .pth, .onnx, .pb)
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    required
                    accept=".pkl,.h5,.pth,.onnx,.pb,.joblib,.json,.bin"
                    className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Supported formats: PKL, H5, PTH, ONNX, PB, JSON, BIN
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
                  onClick={() => navigate('/models')}
                  disabled={isUploading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1"
                >
                  {isUploading ? 'Uploading...' : 'Upload Model'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Upload Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Ensure your model is well-trained and validated</p>
              <p>• Include comprehensive documentation</p>
              <p>• Test inference code before uploading</p>
              <p>• Provide performance metrics and benchmarks</p>
              <p>• Verify you own rights to the model</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Model Marketplace</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Earn tBNB for high-quality models</p>
              <p>• Build reputation in the ML community</p>
              <p>• Instant payments via smart contracts</p>
              <p>• Global distribution platform</p>
              <p>• Support for all major ML frameworks</p>
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
                  Model Feasibility Analysis Results
                </CardTitle>
                <CardDescription>
                  Analysis completed for your uploaded model
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

                {/* Model Info */}
                {feasibilityResults.model_info && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Model Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>Size: {feasibilityResults.model_info.size_mb} MB</div>
                      <div>Framework: {feasibilityResults.model_info.framework || 'N/A'}</div>
                      <div>Type: {feasibilityResults.model_info.model_type || 'N/A'}</div>
                      <div>Parameters: {feasibilityResults.model_info.parameters || 'N/A'}</div>
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
                  <Button onClick={() => navigate('/models')} className="flex-1">
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
  )
}
