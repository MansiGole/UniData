import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDataset, useDatasetFeasibility } from '../hooks/useApi'
import { useWallet } from '../hooks/useWallet'
import PurchaseButton from '../components/PurchaseButton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { 
  ArrowLeft, 
  Download, 
  Database, 
  FileText, 
  Calendar,
  User,
  Tag,
  BarChart3,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Target,
  TrendingUp,
  Award,
  Info
} from 'lucide-react'

export const DatasetDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: dataset, isLoading, error } = useDataset(id!)
  const { data: feasibilityData } = useDatasetFeasibility(id!)
  const { isConnected, account } = useWallet()

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="h-12 bg-muted rounded w-3/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="h-64 bg-muted rounded mb-6"></div>
              <div className="h-32 bg-muted rounded"></div>
            </div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !dataset) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-destructive mb-4">
            Dataset Not Found
          </h2>
          <p className="text-muted-foreground mb-6">
            The dataset you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/datasets')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Datasets
          </Button>
        </div>
      </div>
    )
  }

  const isOwner = account && account.toLowerCase() === dataset.owner.toLowerCase()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={() => navigate('/datasets')}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Datasets
      </Button>

      {/* Header with Feasibility Score */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {dataset.title}
            </h1>
            <p className="text-lg text-muted-foreground">
              {dataset.description}
            </p>
          </div>
          
          {/* Feasibility Score Badge */}
          {feasibilityData && feasibilityData.feasibility_analysis && (
            <div className="ml-6 text-center">
              <div className={`inline-flex items-center px-6 py-4 rounded-xl border-2 ${
                feasibilityData.feasibility_analysis.score >= 80 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-800'
                  : feasibilityData.feasibility_analysis.score >= 60 
                  ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 text-yellow-800'
                  : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200 text-red-800'
              }`}>
                <Award className="h-6 w-6 mr-3" />
                <div>
                  <div className="text-2xl font-bold">
                    {feasibilityData.feasibility_analysis.score}/100
                  </div>
                  <div className="text-sm font-medium">
                    Grade {feasibilityData.feasibility_analysis.grade} • Feasibility Score
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full mt-1 ${
                    feasibilityData.feasibility_analysis.ml_readiness 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {feasibilityData.feasibility_analysis.ml_readiness ? 'ML Ready' : 'Needs Work'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dataset Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Dataset Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dataset.category && (
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-semibold">Category</div>
                      <div className="text-muted-foreground">
                        {dataset.category}
                      </div>
                    </div>
                  </div>
                )}

                {dataset.format && (
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-semibold">Format</div>
                      <div className="text-muted-foreground">
                        {dataset.format}
                      </div>
                    </div>
                  </div>
                )}

                {dataset.size && (
                  <div className="flex items-center space-x-3">
                    <Download className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-semibold">File Size</div>
                      <div className="text-muted-foreground">
                        {dataset.size}
                      </div>
                    </div>
                  </div>
                )}

                {dataset.license && (
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-semibold">License</div>
                      <div className="text-muted-foreground">
                        {dataset.license}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-semibold">Created</div>
                    <div className="text-muted-foreground">
                      {new Date(dataset.created_at * 1000).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-semibold">Status</div>
                    <div className="text-green-600 capitalize">
                      {dataset.active ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          {dataset.tags && dataset.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Tag className="h-5 w-5" />
                  <span>Tags</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {dataset.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Feasibility Score */}
          {feasibilityData && feasibilityData.feasibility_analysis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Feasibility Analysis</span>
                </CardTitle>
                <CardDescription>
                  AI-powered quality assessment and ML readiness score
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Overall Score */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      feasibilityData.feasibility_analysis.score >= 80 ? 'bg-green-100 text-green-600' :
                      feasibilityData.feasibility_analysis.score >= 60 ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-lg">
                        Score: {feasibilityData.feasibility_analysis.score}/100
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Grade: {feasibilityData.feasibility_analysis.grade}
                      </div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    feasibilityData.feasibility_analysis.ml_readiness 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {feasibilityData.feasibility_analysis.ml_readiness ? 'ML Ready' : 'Needs Work'}
                  </div>
                </div>

                {/* Quick Stats */}
                {feasibilityData.feasibility_analysis.dataset_info && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {feasibilityData.feasibility_analysis.dataset_info.rows?.toLocaleString() || 'N/A'}
                      </div>
                      <div className="text-sm text-muted-foreground">Rows</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {feasibilityData.feasibility_analysis.dataset_info.columns || 'N/A'}
                      </div>
                      <div className="text-sm text-muted-foreground">Columns</div>
                    </div>
                  </div>
                )}

                {/* Strengths */}
                {feasibilityData.feasibility_analysis.strengths && feasibilityData.feasibility_analysis.strengths.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Strengths
                    </h4>
                    <ul className="space-y-1">
                      {feasibilityData.feasibility_analysis.strengths.slice(0, 3).map((strength: string, index: number) => (
                        <li key={index} className="text-sm text-green-600 flex items-center">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Issues */}
                {feasibilityData.feasibility_analysis.issues && feasibilityData.feasibility_analysis.issues.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-orange-700 mb-2 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Areas for Improvement
                    </h4>
                    <ul className="space-y-1">
                      {feasibilityData.feasibility_analysis.issues.slice(0, 3).map((issue: string, index: number) => (
                        <li key={index} className="text-sm text-orange-600 flex items-center">
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Use Cases */}
                {feasibilityData.feasibility_analysis.recommended_use_cases && (
                  <div>
                    <h4 className="font-semibold text-blue-700 mb-2 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Recommended Use Cases
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {feasibilityData.feasibility_analysis.recommended_use_cases.slice(0, 4).map((useCase: string, index: number) => (
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

                {/* Analysis Date */}
                {feasibilityData.feasibility_analysis.analysis_date && (
                  <div className="text-xs text-muted-foreground flex items-center">
                    <Info className="h-3 w-3 mr-1" />
                    Analysis performed: {new Date(feasibilityData.feasibility_analysis.analysis_date).toLocaleDateString()}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Owner Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Owner</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="font-mono text-sm">
                  {dataset.owner}
                </div>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on BSCScan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Purchase Card */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {dataset.price} tBNB
                </div>
                <div className="text-sm text-muted-foreground">
                  One-time purchase
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isConnected ? (
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Connect your wallet to purchase this dataset
                  </p>
                </div>
              ) : isOwner ? (
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <p className="font-semibold text-green-600">
                    You own this dataset
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <PurchaseButton
                    type="dataset"
                    itemId={dataset.id}
                    price={dataset.price}
                    itemTitle={dataset.title}
                    className="w-full"
                  />
                  
                  <div className="text-xs text-muted-foreground text-center">
                    <p>✓ Instant delivery after payment</p>
                    <p>✓ Secure blockchain transaction</p>
                    <p>✓ Full ownership rights</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dataset Category */}
          {dataset.category && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Category</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="px-3 py-2 bg-primary/10 text-primary rounded-md text-sm font-medium">
                  {dataset.category}
                </span>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dataset ID</span>
                <span className="font-mono text-sm">{dataset.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="text-green-600 capitalize font-medium">
                  {dataset.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span className="text-sm">
                  {new Date(dataset.created_at * 1000).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
