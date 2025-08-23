import React from 'react'
import { useDatasets } from '../hooks/useApi'
import { useWallet } from '../hooks/useWallet'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Link } from 'react-router-dom'
import { ShoppingCart, Wallet, Database } from 'lucide-react'
import PageTransition from '../components/animations/PageTransition'
import AnimateOnScroll from '../components/animations/AnimateOnScroll'

export const MarketplacePage: React.FC = () => {
  const { data: datasets, isLoading, error } = useDatasets()
  const { isConnected } = useWallet()

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-4">
            Error Loading Marketplace
          </h2>
          <p className="text-muted-foreground">
            Unable to load marketplace data. Please try again later.
          </p>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Wallet className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-muted-foreground mb-6">
            Please connect your MetaMask wallet to access the marketplace
          </p>
        </div>
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8" style={{ backgroundColor: '#0B0E11', fontFamily: 'Space Grotesk, sans-serif' }}>
        {/* Header */}
        <AnimateOnScroll direction="up">
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <ShoppingCart className="h-8 w-8" style={{ color: '#F0B90B' }} />
              <h1 className="text-4xl font-bold" style={{ color: '#FFFFFF' }}>
                Marketplace
              </h1>
            </div>
            <p className="text-lg" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Purchase datasets instantly with tBNB using smart contracts
            </p>
          </div>
        </AnimateOnScroll>

      {/* Marketplace Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Available Datasets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {datasets?.length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {datasets && datasets.length > 0
                ? (datasets.reduce((sum, d) => sum + d.price, 0) / datasets.length).toFixed(2)
                : '0'} tBNB
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {datasets?.reduce((sum, d) => sum + d.price, 0).toFixed(2) || '0'} tBNB
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Datasets Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !datasets || datasets.length === 0 ? (
        <div className="text-center py-12">
          <Database className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: '16px',
              fontWeight: 400,
              lineHeight: '24px',
              color: 'rgb(196, 197, 203)',
              letterSpacing: 'normal'
            }}
            className="mb-2"
          >
            No datasets available
          </h3>
          <p className="text-muted-foreground">
            The marketplace is currently empty. Check back later for new datasets.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {datasets.map((dataset) => (
            <Card key={dataset.id} className="hover:shadow-lg transition-shadow border-2 hover:border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <span className="line-clamp-2 flex-1 mr-2">{dataset.title}</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {dataset.price}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      tBNB
                    </div>
                  </div>
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {dataset.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-muted/50 rounded-md">
                  <div className="text-center">
                    <div className="text-lg font-semibold">
                      {dataset.format || 'N/A'}
                    </div>
                    <div className="text-xs text-muted-foreground">Format</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">
                      {dataset.size || 'N/A'}
                    </div>
                    <div className="text-xs text-muted-foreground">Size</div>
                  </div>
                </div>

                {/* Feasibility Score */}
                {dataset.feasibility_analysis && (
                  <div className="mb-4">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                      dataset.feasibility_analysis.score >= 80 ? 'bg-green-100 text-green-600' :
                      dataset.feasibility_analysis.score >= 60 ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      Quality Score: {dataset.feasibility_analysis.score}/100 ({dataset.feasibility_analysis.grade})
                    </div>
                  </div>
                )}

                {/* Category Badge */}
                {dataset.category && (
                  <div className="mb-4">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                      {dataset.category}
                    </span>
                  </div>
                )}

                {/* Owner Info */}
                <div className="mb-4 p-2 bg-card border rounded-md">
                  <div className="text-xs text-muted-foreground mb-1">Seller</div>
                  <div className="text-sm font-mono">
                    {dataset.owner.slice(0, 6)}...{dataset.owner.slice(-4)}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Link to={`/datasets/${dataset.id}`} className="block">
                    <Button className="w-full" variant="outline">
                      View Details
                    </Button>
                  </Link>
                  
                  <Link to={`/datasets/${dataset.id}`} className="block">
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Purchase Dataset
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Bottom CTA */}
      {datasets && datasets.length > 0 && (
        <div className="mt-12 text-center p-8 bg-card/50 rounded-lg border">
          <h3 
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: '16px',
              fontWeight: 400,
              lineHeight: '24px',
              color: 'rgb(196, 197, 203)',
              letterSpacing: 'normal'
            }}
            className="mb-2"
          >
            Ready to start your ML project?
          </h3>
          <p className="mb-4" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            All purchases are secured by smart contracts on BNB Smart Chain
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            <span>✓ Instant delivery</span>
            <span>✓ Secure payments</span>
            <span>✓ Verified datasets</span>
          </div>
        </div>
      )}
      </div>
    </PageTransition>
  )
}
