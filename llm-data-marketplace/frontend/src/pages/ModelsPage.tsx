import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useModels } from '../hooks/useApi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Database, Download, TrendingUp, Filter, Search } from 'lucide-react'
import PageTransition from '../components/animations/PageTransition'
import AnimateOnScroll from '../components/animations/AnimateOnScroll'

export const ModelsPage: React.FC = () => {
  const { data: models, isLoading, error } = useModels()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFramework, setSelectedFramework] = useState('all')

  // Ensure models is an array
  const modelsList = models || []

  // Filter models based on search and framework
  const filteredModels = modelsList.filter((model) => {
  const matchesSearch = (typeof model.name === 'string' && model.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
             (typeof model.description === 'string' && model.description.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesFramework = selectedFramework === 'all' || 
                           model.framework === selectedFramework

    return matchesSearch && matchesFramework
  })

  // Get unique frameworks
  const frameworks = ['all', ...Array.from(new Set(
    modelsList.map(m => m.framework).filter(Boolean)
  ))] as string[]

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-4">Error Loading Models</h2>
          <p className="text-muted-foreground mb-6">
            Failed to load models. Please try again later.
          </p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
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
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Browse Models
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover and purchase pre-trained machine learning models
            </p>
          </div>
        </AnimateOnScroll>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Framework Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={selectedFramework}
            onChange={(e) => setSelectedFramework(e.target.value)}
            className="px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {frameworks.map(framework => (
              <option key={framework} value={framework}>
                {framework === 'all' ? 'All Frameworks' : framework}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          {isLoading ? (
            'Loading models...'
          ) : (
            `Showing ${filteredModels.length} of ${modelsList.length} models`
          )}
        </p>
      </div>

      {/* Models Grid */}
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
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredModels.length === 0 ? (
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
            No models found
          </h3>
          <p className="text-muted-foreground">
            {searchTerm || selectedFramework !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'No models are currently available'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModels.map((model) => (
            <Card key={model.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-1">
                      {model.name}
                    </CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Badge variant="secondary" className="mr-2">
                        {model.framework}
                      </Badge>
                      <Badge variant="outline">
                        {model.model_type}
                      </Badge>
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">
                      {model.price} tBNB
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {model.description}
                </p>

                {/* Feasibility Score */}
                {model.feasibility_analysis && (
                  <div className="mb-4">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                      model.feasibility_analysis.score >= 80 ? 'bg-green-100 text-green-600' :
                      model.feasibility_analysis.score >= 60 ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      Quality Score: {model.feasibility_analysis.score}/100 ({model.feasibility_analysis.grade})
                    </div>
                  </div>
                )}

                <div className="space-y-2 mb-4">
                  {model.accuracy && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Accuracy:</span>
                      <span className="font-medium">{(model.accuracy * 100).toFixed(1)}%</span>
                    </div>
                  )}
                  {model.training_time && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Training Time:</span>
                      <span className="font-medium">{model.training_time}</span>
                    </div>
                  )}
                  {model.model_size && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Model Size:</span>
                      <span className="font-medium">{model.model_size}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                    {(
                      Array.isArray(model.tags)
                        ? model.tags
                        : typeof model.tags === 'string'
                          ? (model.tags as string).split(',').map((tag: string) => tag.trim()).filter(Boolean)
                          : []
                    ).map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t gap-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>Active</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link to={`/models/${model.id}`}>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </Link>
                    <Button size="sm">
                      <Download className="h-3 w-3 mr-1" />
                      Purchase
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {filteredModels.length > 0 && (
        <AnimateOnScroll direction="up" delay={0.2}>
          <div className="text-center mt-12">
            <Button variant="outline" className="hover-scale">
              Load More Models
            </Button>
          </div>
        </AnimateOnScroll>
      )}
      </div>
    </PageTransition>
  )
}
