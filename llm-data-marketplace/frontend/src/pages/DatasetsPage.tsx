import React, { useState } from 'react'
import { useDatasets } from '../hooks/useApi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Link } from 'react-router-dom'
import { Search, Filter, Database } from 'lucide-react'
import PageTransition from '../components/animations/PageTransition'

export const DatasetsPage: React.FC = () => {
  const { data: datasets, isLoading, error } = useDatasets()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Filter datasets based on search and category
  const filteredDatasets = datasets?.filter((dataset) => {
    const matchesSearch = dataset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataset.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || 
                           dataset.category === selectedCategory

    return matchesSearch && matchesCategory
  }) || []

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(
    datasets?.map(d => d.category).filter(Boolean) || []
  ))]

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-4">
            Error Loading Datasets
          </h2>
          <p className="text-muted-foreground">
            Unable to load datasets. Please try again later.
          </p>
        </div>
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8" style={{ backgroundColor: '#0B0E11', fontFamily: 'Space Grotesk, sans-serif' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Browse Datasets
        </h1>
        <p className="text-lg text-muted-foreground">
          Discover high-quality datasets for your machine learning projects
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search datasets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          {isLoading ? (
            'Loading datasets...'
          ) : (
            `Showing ${filteredDatasets.length} of ${datasets?.length || 0} datasets`
          )}
        </p>
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
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredDatasets.length === 0 ? (
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
            No datasets found
          </h3>
          <p className="text-muted-foreground">
            {searchTerm || selectedCategory !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'No datasets are currently available'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDatasets.map((dataset) => (
            <Card key={dataset.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <span className="line-clamp-2 flex-1 mr-2">{dataset.title}</span>
                  <span className="text-primary font-bold whitespace-nowrap">
                    {dataset.price} tBNB
                  </span>
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {dataset.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {/* Metadata */}
                <div className="space-y-2 mb-4">
                  {dataset.category && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Category:</span>
                      <span className="font-medium">{dataset.category}</span>
                    </div>
                  )}
                  
                  {dataset.format && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Format:</span>
                      <span className="font-medium">{dataset.format}</span>
                    </div>
                  )}
                  
                  {dataset.license && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">License:</span>
                      <span className="font-medium">{dataset.license}</span>
                    </div>
                  )}
                  
                  {dataset.size && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Size:</span>
                      <span className="font-medium">{dataset.size}</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {dataset.tags && dataset.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {dataset.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                    {dataset.tags.length > 3 && (
                      <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                        +{dataset.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Owner: {dataset.owner.slice(0, 6)}...{dataset.owner.slice(-4)}
                  </div>
                  
                  <Link to={`/datasets/${dataset.id}`}>
                    <Button>
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      </div>
    </PageTransition>
  )
}
