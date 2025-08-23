import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useModel, useModelFeasibility } from '../hooks/useApi'
import { useWallet } from '../hooks/useWallet'
import PurchaseButton from '../components/PurchaseButton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { 
  ArrowLeft, 
  Download, 
  Brain, 
  FileText, 
  Calendar,
  User,
  Tag,
  BarChart3,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Cpu,
  Activity,
  Clock,
  HardDrive,
  Zap,
  Target,
  TrendingUp,
  Award,
  Info
} from 'lucide-react'

export const ModelDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: model, isLoading, error } = useModel(id!)
  const { data: feasibilityData } = useModelFeasibility(id!)
  const { isConnected, account } = useWallet()

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Models
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="h-8 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-4/5"></div>
                    <div className="h-4 bg-muted rounded w-3/5"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-12 bg-muted rounded"></div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !model) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="outline" onClick={() => navigate('/models')} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Models
        </Button>
        
        <div className="text-center py-12">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-destructive mb-4">Model Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The model you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/models')}>
            Browse Other Models
          </Button>
        </div>
      </div>
    )
  }

  const isOwner = account && account.toLowerCase() === model.owner.toLowerCase()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button variant="outline" onClick={() => navigate('/models')} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Models
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Model Header */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-3xl font-bold flex items-center">
                    <Brain className="h-8 w-8 mr-3 text-primary" />
                    {model.name}
                  </CardTitle>
                  <CardDescription className="mt-2 flex items-center flex-wrap gap-2">
                    <Badge variant="secondary" className="mr-2">
                      {model.framework}
                    </Badge>
                    <Badge variant="outline">
                      {model.model_type}
                    </Badge>
                    {model.license && (
                      <Badge variant="outline">
                        {model.license}
                      </Badge>
                    )}
                  </CardDescription>
                </div>
                {model.active && (
                  <Badge variant="default" className="bg-green-500">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {model.description}
              </p>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {model.accuracy && (
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Target className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <div className="text-2xl font-bold">{(model.accuracy * 100).toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Accuracy</div>
                  </div>
                )}
                {model.f1_score && (
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Activity className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <div className="text-2xl font-bold">{(model.f1_score * 100).toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">F1 Score</div>
                  </div>
                )}
                {model.precision && (
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Zap className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                    <div className="text-2xl font-bold">{(model.precision * 100).toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Precision</div>
                  </div>
                )}
                {model.recall && (
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                    <div className="text-2xl font-bold">{(model.recall * 100).toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Recall</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Technical Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Cpu className="h-5 w-5 mr-2" />
                Technical Specifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {model.training_time && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-3 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Training Time</div>
                        <div className="text-sm text-muted-foreground">{model.training_time}</div>
                      </div>
                    </div>
                  )}
                  {model.model_size && (
                    <div className="flex items-center">
                      <HardDrive className="h-4 w-4 mr-3 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Model Size</div>
                        <div className="text-sm text-muted-foreground">{model.model_size}</div>
                      </div>
                    </div>
                  )}
                  {model.dataset_used && (
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-3 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Training Dataset</div>
                        <div className="text-sm text-muted-foreground">{model.dataset_used}</div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-3 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Owner</div>
                      <div className="text-sm text-muted-foreground font-mono">
                        {model.owner.slice(0, 6)}...{model.owner.slice(-4)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-3 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Created</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(model.created_at * 1000).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feasibility Score */}
          {feasibilityData && feasibilityData.feasibility_analysis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Feasibility Analysis</span>
                </CardTitle>
                <CardDescription>
                  AI-powered model quality assessment and deployment readiness
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
                    feasibilityData.feasibility_analysis.deployment_ready 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {feasibilityData.feasibility_analysis.deployment_ready ? 'Deploy Ready' : 'Needs Work'}
                  </div>
                </div>

                {/* Model Info */}
                {feasibilityData.feasibility_analysis.model_info && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">
                        {feasibilityData.feasibility_analysis.model_info.model_size_mb?.toFixed(1) || 'N/A'}MB
                      </div>
                      <div className="text-sm text-muted-foreground">Model Size</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">
                        {feasibilityData.feasibility_analysis.complexity_level || 'N/A'}
                      </div>
                      <div className="text-sm text-muted-foreground">Complexity</div>
                    </div>
                  </div>
                )}

                {/* Performance Metrics */}
                {feasibilityData.feasibility_analysis.estimated_inference_time && (
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">Inference Time</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {feasibilityData.feasibility_analysis.estimated_inference_time}
                      </span>
                    </div>
                    {feasibilityData.feasibility_analysis.memory_requirements && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <HardDrive className="h-4 w-4 text-purple-500" />
                          <span className="text-sm font-medium">Memory Needed</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {feasibilityData.feasibility_analysis.memory_requirements}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Framework & Type */}
                {feasibilityData.feasibility_analysis.model_info && (
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-blue-700">
                        {feasibilityData.feasibility_analysis.model_info.model_type || 'Unknown Type'}
                      </div>
                      <div className="text-xs text-blue-600">
                        {feasibilityData.feasibility_analysis.framework || 'Unknown Framework'}
                      </div>
                    </div>
                    <Cpu className="h-5 w-5 text-blue-500" />
                  </div>
                )}

                {/* Recommendations */}
                {feasibilityData.feasibility_analysis.recommendations && feasibilityData.feasibility_analysis.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-orange-700 mb-2 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Recommendations
                    </h4>
                    <ul className="space-y-1">
                      {feasibilityData.feasibility_analysis.recommendations.slice(0, 2).map((rec: any, index: number) => (
                        <li key={index} className="text-sm text-orange-600 flex items-start">
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                          <span>{rec.action || rec.issue}</span>
                        </li>
                      ))}
                    </ul>
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

          {/* Tags */}
          {model.tags && model.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="h-5 w-5 mr-2" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {model.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Purchase Card */}
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Purchase Model</CardTitle>
              <div className="text-3xl font-bold text-primary">
                {model.price} tBNB
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isConnected ? (
                <div className="text-center py-4">
                  <AlertCircle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-3">
                    Connect your wallet to purchase this model
                  </p>
                </div>
              ) : isOwner ? (
                <div className="text-center py-4">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    You own this model
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <PurchaseButton
                    type="model"
                    itemId={model.id}
                    price={model.price}
                    itemTitle={model.name}
                    className="w-full"
                  />
                </div>
              )}

              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Framework:</span>
                  <span className="font-medium">{model.framework}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium">{model.model_type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">License:</span>
                  <span className="font-medium">{model.license}</span>
                </div>
              </div>

              {/* Additional Actions */}
              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full" disabled>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Documentation
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Model Files */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Download className="h-5 w-5 mr-2" />
                Model Files
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm">Model File</span>
                  <Badge variant="outline">Available</Badge>
                </div>
                {model.config_file_url && (
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <span className="text-sm">Config File</span>
                    <Badge variant="outline">Available</Badge>
                  </div>
                )}
                {model.weights_file_url && (
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <span className="text-sm">Weights File</span>
                    <Badge variant="outline">Available</Badge>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Files will be available after purchase
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
