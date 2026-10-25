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
  BarChart3,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Target,
  TrendingUp,
  Award,
  Info,
  ShieldCheck,
  ShoppingCart as ShoppingCartIcon,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Eye,
  Wallet
} from 'lucide-react'
import { apiClient } from '../api/client'
import { DatasetPreviewModal } from '../components/DatasetPreviewModal'

export const DatasetDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: dataset, isLoading, error } = useDataset(id!)
  const { data: feasibilityData } = useDatasetFeasibility(id!)
  const { isConnected, account, balance, setRole, connect, isConnecting, isUploader } = useWallet()
  const [isScoreExplainerOpen, setIsScoreExplainerOpen] = React.useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false)

  const handleContinueToPurchase = () => {
    setIsPreviewOpen(false)
    const purchaseEl = document.getElementById('purchase-section')
    if (purchaseEl) {
      purchaseEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

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

  const isOwner = Boolean(account && dataset.owner && account.toLowerCase() === dataset.owner.toLowerCase())

  const handleDownloadOwner = async () => {
    try {
      const blob = await apiClient.downloadDatasetFile(dataset.id)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `dataset_${dataset.id}_owner.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (e: any) {
      alert(`Download failed: ${e.message || 'Unknown error'}`)
    }
  }

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

      {/* 2-Role Transaction Basis Indicator Banner */}
      <div className={`mb-6 p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
        isUploader
          ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
          : 'bg-blue-950/30 border-blue-500/40 text-blue-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isUploader ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>
            {isUploader ? <ShieldCheck className="w-5 h-5" /> : <ShoppingCartIcon className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">
                Active Transaction Role: {isUploader ? '👑 Uploader / Seller Role' : '🛒 Buyer Role'}
              </span>
              <span className="text-[11px] bg-white/10 px-2 py-0.5 rounded-full font-mono text-gray-300">
                {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Not Connected'}
              </span>
            </div>
            <div className="text-xs text-gray-300 mt-0.5">
              {isUploader
                ? 'You are in the uploader/seller role. Buyer transactions deposit 0.001 tBNB into your wallet.'
                : 'You are browsing as a buyer. Purchasing will submit an on-chain transaction sending tBNB to the seller.'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isUploader ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setRole('buyer')}
              className="border-blue-500/40 text-blue-300 hover:bg-blue-500/20 text-xs flex items-center gap-1.5"
            >
              <ShoppingCartIcon className="w-3.5 h-3.5" />
              Switch to Buyer Role
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setRole('uploader')}
              className="border-amber-500/40 text-amber-300 hover:bg-amber-500/20 text-xs flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Switch to Uploader Role
            </Button>
          )}
        </div>
      </div>

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
                {dataset.author && (
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-semibold">Author</div>
                      <div className="text-muted-foreground">
                        {dataset.author}
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
                      {new Date(dataset.createdAt * 1000).toLocaleDateString()}
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

                {/* Expandable Explanation: How is the Feasibility Score Calculated? */}
                <div className="pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setIsScoreExplainerOpen(!isScoreExplainerOpen)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors text-left group"
                    aria-expanded={isScoreExplainerOpen}
                  >
                    <span className="flex items-center space-x-2 text-sm font-semibold text-foreground">
                      <HelpCircle className="h-4 w-4 text-primary" />
                      <span>How is the Feasibility Score Calculated?</span>
                    </span>
                    {isScoreExplainerOpen ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    )}
                  </button>

                  {isScoreExplainerOpen && (
                    <div className="mt-3 p-4 rounded-lg bg-background border text-xs space-y-4">
                      {/* What score out of 100 means */}
                      <div>
                        <h5 className="font-semibold text-foreground text-sm mb-1 flex items-center">
                          <Target className="h-3.5 w-3.5 mr-1.5 text-primary" />
                          What the Score (0–100) Means
                        </h5>
                        <p className="text-muted-foreground leading-relaxed">
                          The feasibility score is an automated health rating from <strong>0 to 100</strong> assessing technical dataset cleanliness, sample completeness, and readiness for machine learning workflows. Every dataset starts with a baseline score of <strong>100 points</strong>, with penalty deductions applied for structural defects and strengths highlighted for healthy properties.
                        </p>
                      </div>

                      {/* Factors affecting score */}
                      <div>
                        <h5 className="font-semibold text-foreground text-sm mb-1.5 flex items-center">
                          <BarChart3 className="h-3.5 w-3.5 mr-1.5 text-primary" />
                          Factors & Penalty Deductions
                        </h5>
                        <ul className="space-y-1.5 text-muted-foreground">
                          <li className="flex items-start">
                            <span className="font-medium text-foreground mr-1.5">• Missing Data:</span>
                            <span>&gt;50% missing data triggers a <strong>-30 pt</strong> deduction; 20%–50% missing triggers <strong>-15 pts</strong>; &lt;5% is recorded as a key strength.</span>
                          </li>
                          <li className="flex items-start">
                            <span className="font-medium text-foreground mr-1.5">• Sample Volume:</span>
                            <span>&lt;100 rows deducts <strong>-25 pts</strong> (critical sample deficit); 100–499 rows deducts <strong>-10 pts</strong>; &gt;1,000 rows indicates healthy sample size.</span>
                          </li>
                          <li className="flex items-start">
                            <span className="font-medium text-foreground mr-1.5">• Feature Count:</span>
                            <span>&lt;3 features deducts <strong>-15 pts</strong> (insufficient signal); &gt;50 features deducts <strong>-5 pts</strong> (curse of dimensionality); 3–50 features is optimal.</span>
                          </li>
                          <li className="flex items-start">
                            <span className="font-medium text-foreground mr-1.5">• Duplicate Rows:</span>
                            <span>&gt;10% duplicated rows deducts <strong>-10 pts</strong> due to redundancy and overfitting risk.</span>
                          </li>
                          <li className="flex items-start">
                            <span className="font-medium text-foreground mr-1.5">• Data Types:</span>
                            <span>&gt;30% numeric columns reinforces numeric data quality for quantitative machine learning.</span>
                          </li>
                        </ul>
                      </div>

                      {/* Grade thresholds */}
                      <div>
                        <h5 className="font-semibold text-foreground text-sm mb-1.5 flex items-center">
                          <Award className="h-3.5 w-3.5 mr-1.5 text-primary" />
                          Grade Thresholds
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-muted-foreground">
                          <div className="p-2 rounded bg-muted/30 border">
                            <span className="font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded text-[11px] mr-1.5">Grade A (≥ 90)</span>
                            <span>Excellent quality; clean and ready for direct enterprise ML pipelines.</span>
                          </div>
                          <div className="p-2 rounded bg-muted/30 border">
                            <span className="font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded text-[11px] mr-1.5">Grade B (80–89)</span>
                            <span>Good quality; minor gaps or moderate sample size with solid foundations.</span>
                          </div>
                          <div className="p-2 rounded bg-muted/30 border">
                            <span className="font-bold text-yellow-700 bg-yellow-100 px-1.5 py-0.5 rounded text-[11px] mr-1.5">Grade C (70–79)</span>
                            <span>Acceptable; viable for ML with light cleaning or imputation.</span>
                          </div>
                          <div className="p-2 rounded bg-muted/30 border">
                            <span className="font-bold text-orange-700 bg-orange-100 px-1.5 py-0.5 rounded text-[11px] mr-1.5">Grade D (60–69)</span>
                            <span>Marginal; noticeable missing values or low row counts requiring curation.</span>
                          </div>
                          <div className="p-2 rounded bg-muted/30 border sm:col-span-2">
                            <span className="font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded text-[11px] mr-1.5">Grade F (&lt; 60)</span>
                            <span>Poor; severe data sparseness or structural corruption requiring extensive overhaul.</span>
                          </div>
                        </div>
                      </div>

                      {/* ML-Readiness */}
                      <div>
                        <h5 className="font-semibold text-foreground text-sm mb-1 flex items-center">
                          <CheckCircle className="h-3.5 w-3.5 mr-1.5 text-primary" />
                          What the "ML Ready" Label Means
                        </h5>
                        <p className="text-muted-foreground leading-relaxed">
                          The analyzer sets <strong className="text-foreground">ML Ready</strong> if the score is <strong>≥ 70 (Grade C or above)</strong>. Datasets scoring 70+ have passed baseline structural, dimensional, and completeness checks. Scores below 70 are marked <strong className="text-foreground">Needs Work</strong>, indicating remediation is necessary before training algorithms.
                        </p>
                      </div>

                      {/* Holistic Review & Disclaimer */}
                      <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200/80 text-amber-900 space-y-1.5">
                        <div className="font-semibold flex items-center text-xs text-amber-950">
                          <AlertCircle className="h-4 w-4 mr-1.5 text-amber-600 shrink-0" />
                          Review Strengths, Issues & Disclaimer
                        </div>
                        <p className="text-[11px] leading-relaxed text-amber-800">
                          A single summary score cannot convey every nuance of your specific modeling goals. Always inspect the specific <strong>Strengths</strong>, <strong>Areas for Improvement</strong>, and <strong>Recommended Use Cases</strong> above.
                        </p>
                        <p className="text-[11px] leading-relaxed text-amber-800">
                          <strong>Disclaimer:</strong> The feasibility score estimates dataset hygiene, integrity, and technical suitability—it <strong>does not guarantee downstream model accuracy</strong> or predictive success.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
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
          <Card id="purchase-section" className="border-2 border-primary/20">
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
              {/* Preview Dataset Button */}
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPreviewOpen(true)}
                className="w-full flex items-center justify-center gap-2 border-primary/40 hover:bg-primary/5 text-primary font-medium"
              >
                <Eye className="w-4 h-4" />
                <span>Preview Dataset</span>
              </Button>
              {!isConnected ? (
                <div className="text-center py-2 space-y-3">
                  <p className="text-muted-foreground text-sm">
                    Connect your wallet to purchase this dataset
                  </p>
                  <Button 
                    onClick={connect} 
                    disabled={isConnecting}
                    className="w-full flex items-center justify-center gap-2 font-medium shadow-md"
                    style={{ backgroundColor: '#F0B90B', color: '#0B0E11' }}
                  >
                    <Wallet className="w-4 h-4" />
                    <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
                  </Button>
                </div>
              ) : (isUploader && isOwner) ? (
                <div className="space-y-3">
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-center">
                    <CheckCircle className="h-8 w-8 text-amber-400 mx-auto mb-1.5" />
                    <p className="font-semibold text-amber-300 text-sm">
                      You own this dataset
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Uploader / Seller Role (Direct Access)
                    </p>
                  </div>

                  <Button
                    onClick={handleDownloadOwner}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Download File (Owner)
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRole('buyer')}
                    className="w-full text-xs border-blue-500/40 text-blue-300 hover:bg-blue-500/20 flex items-center justify-center gap-1.5"
                  >
                    <ShoppingCartIcon className="w-3.5 h-3.5" />
                    Switch to Buyer Role (to test buying)
                  </Button>

                  <div className="text-[11px] text-gray-400 text-center">
                    Payments from buyers are deposited into this wallet on BSC Testnet.
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-xs bg-blue-500/10 border border-blue-500/20 text-blue-300 p-2 rounded text-center">
                    Connected as Buyer: <span className="font-mono">{account ? `${account.slice(0, 6)}...${account.slice(-4)}` : ''}</span>
                  </div>

                  <PurchaseButton
                    type="dataset"
                    itemId={dataset.id}
                    price={dataset.price}
                    userBalance={balance ? parseFloat(balance) : 0}
                    itemTitle={dataset.title}
                    blockchainDatasetId={dataset.blockchain_dataset_id}
                    datasetObj={dataset}
                    className="w-full"
                  />
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setRole('uploader')}
                    className="w-full text-xs text-amber-400 hover:bg-amber-500/10 flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Switch to Uploader Role
                  </Button>

                  <div className="text-xs text-muted-foreground text-center">
                    <p>✓ Instant delivery after payment</p>
                    <p>✓ Secure blockchain transaction</p>
                    <p>✓ Full ownership rights</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dataset Author */}
          {dataset.author && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Author</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="px-3 py-2 bg-primary/10 text-primary rounded-md text-sm font-medium">
                  {dataset.author}
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
                  {new Date(dataset.createdAt * 1000).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dataset Preview Modal */}
      <DatasetPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onContinueToPurchase={handleContinueToPurchase}
        dataset={dataset}
        feasibility={feasibilityData?.feasibility_analysis}
      />
    </div>
  )
}
