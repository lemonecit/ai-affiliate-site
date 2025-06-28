'use client'

import { useState, useEffect } from 'react'
import { useGoogleAnalytics, getClientId } from '@/lib/google-analytics'

interface Product {
  id: string
  title: string
  platform: 'amazon' | 'aliexpress' | 'ksp'
  category: string
  price: string
  original_price?: string
  discount?: number
  rating: number
  reviews_count?: number
  image_url?: string
  affiliate_url: string
  description?: string
  features?: string[]
  availability?: boolean
}

interface Filters {
  category: string
  platform: string
  search: string
  minRating: number
  maxPrice: string
  sortBy: string
}

export default function AdvancedProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<Filters>({
    category: '',
    platform: '',
    search: '',
    minRating: 0,
    maxPrice: '',
    sortBy: 'rating'
  })

  const ga = useGoogleAnalytics()

  const categories = [
    { value: '', label: 'Alla kategorier' },
    { value: 'elektronik', label: 'Elektronik' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'sport', label: 'Sport & Hälsa' },
    { value: 'hem', label: 'Hem & Trädgård' }
  ]

  const platforms = [
    { value: '', label: 'Alla plattformar' },
    { value: 'amazon', label: 'Amazon' },
    { value: 'aliexpress', label: 'AliExpress' }
  ]

  const sortOptions = [
    { value: 'rating', label: 'Högst betyg' },
    { value: 'price', label: 'Lägsta pris' },
    { value: 'discount', label: 'Högsta rabatt' },
    { value: 'updated', label: 'Senast uppdaterad' }
  ]

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.category) params.append('category', filters.category)
      if (filters.platform) params.append('platform', filters.platform)
      if (filters.search) params.append('search', filters.search)
      if (filters.minRating > 0) params.append('min_rating', filters.minRating.toString())
      if (filters.maxPrice) params.append('max_price', filters.maxPrice)
      params.append('sort', filters.sortBy)
      params.append('page', page.toString())
      params.append('per_page', '12')

      const response = await fetch(`/api/products?${params}`)
      const data = await response.json()

      if (data.success) {
        setProducts(data.data.products)
        setTotal(data.data.total)
      }
    } catch (error) {
      console.error('Fel vid hämtning av produkter:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [filters, page])

  const handleFilterChange = (key: keyof Filters, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(1) // Reset to first page when filtering
  }

  const handleProductClick = async (product: Product) => {
    // Track click in analytics
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          platform: product.platform,
          category: product.category,
          source: 'product_search',
          clientId: getClientId()
        })
      })

      // Track in Google Analytics
      ga.trackAffiliateClick(product.id, product.platform, product.category, 'product_search')
    } catch (error) {
      console.error('Analytics tracking failed:', error)
    }

    // Open affiliate link
    window.open(product.affiliate_url, '_blank')
  }

  const getPlatformEmoji = (platform: string) => {
    switch (platform) {
      case 'amazon': return '🟠'
      case 'aliexpress': return '🔴'
      case 'ksp': return '🟦'
      default: return '🔗'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🛒 AI-Driven Produktsökning
          </h1>
          <p className="text-xl text-gray-600">
            Hitta de bästa deals med smart filtrering och AI-rekommendationer
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔍 Sök produkter
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Sök efter produkter..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📂 Kategori
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Platform */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🏪 Plattform
              </label>
              <select
                value={filters.platform}
                onChange={(e) => handleFilterChange('platform', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {platforms.map(platform => (
                  <option key={platform.value} value={platform.value}>{platform.label}</option>
                ))}
              </select>
            </div>

            {/* Min Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ⭐ Min betyg
              </label>
              <select
                value={filters.minRating}
                onChange={(e) => handleFilterChange('minRating', parseInt(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>Alla betyg</option>
                <option value={4}>4+ stjärnor</option>
                <option value={4.5}>4.5+ stjärnor</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📊 Sortera
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
          </div>

          {/* Results info */}
          <div className="mt-4 text-sm text-gray-600">
            {!loading && (
              <span>Visar {products.length} av {total} produkter</span>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Laddar produkter...</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                
                {/* Product Image */}
                <div className="relative h-48 bg-gray-200">
                  {product.image_url && (
                    <img 
                      src={product.image_url} 
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  
                  {/* Platform badge */}
                  <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded-full text-sm font-semibold">
                    {getPlatformEmoji(product.platform)} {product.platform.toUpperCase()}
                  </div>

                  {/* Discount badge */}
                  {product.discount && product.discount > 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                      -{product.discount}%
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.title}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400">
                      {'⭐'.repeat(Math.floor(product.rating || 0))}
                    </div>
                    <span className="ml-1 text-sm text-gray-600">
                      {product.rating} ({product.reviews_count || 0} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-green-600">
                      {product.price}
                    </span>
                    {product.original_price && (
                      <span className="ml-2 text-sm text-gray-500 line-through">
                        {product.original_price}
                      </span>
                    )}
                  </div>

                  {/* Features */}
                  {product.features && product.features.length > 0 && (
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {product.features.slice(0, 2).map((feature, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Buy Button */}
                  <button
                    onClick={() => handleProductClick(product)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    🛒 Köp nu
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && total > 12 && (
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              {page > 1 && (
                <button
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Föregående
                </button>
              )}
              
              <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
                Sida {page} av {Math.ceil(total / 12)}
              </span>
              
              {page < Math.ceil(total / 12) && (
                <button
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Nästa
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
