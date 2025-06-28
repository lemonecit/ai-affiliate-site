'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TrendingUp, ExternalLink, Clock, Tag, Star, ShoppingCart } from 'lucide-react'
import affiliateManager from '@/lib/affiliate-manager'

interface Product {
  id: string
  title: string
  category: string
  price: string
  affiliateUrl: string
  platform: string
  source: string
  trending: boolean
  keywords: string[]
  buttonText: string
  disclaimer: string
  commission?: string
  discount?: string
  originalPrice?: string
}

export default function ProductDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedPlatform, setSelectedPlatform] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, selectedCategory, selectedPlatform, searchQuery])

  const loadProducts = async () => {
    try {
      // Ladda riktiga affiliate produkter
      const affiliateProducts = affiliateManager.getAllTrendingProducts()
      setProducts(affiliateProducts)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    let filtered = products

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    if (selectedPlatform !== 'All') {
      filtered = filtered.filter(product => product.platform === selectedPlatform)
    }

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.keywords.some(keyword => 
          keyword.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }

    setFilteredProducts(filtered)
  }

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))]
  const platforms = ['All', 'Amazon', 'AliExpress']

  const handleProductClick = (product: Product) => {
    // Spåra klick för analytics
    fetch('/api/clicks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId: product.id,
        productName: product.title,
        platform: product.source,
        url: product.affiliateUrl,
        timestamp: new Date().toISOString()
      })
    }).catch(console.error)

    // Öppna affiliate länk i ny flik
    window.open(product.affiliateUrl, '_blank', 'noopener,noreferrer')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Laddar trending produkter...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <TrendingUp className="h-8 w-8 text-blue-600 mr-3" />
                Trending Produkter
              </h1>
              <p className="text-gray-600 mt-2">
                AI-drivna produktrekommendationer baserat på Google Trends • 
                <span className="text-blue-600 font-medium"> {products.length} produkter</span>
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Link 
                href="/admin" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
              >
                Admin Panel
              </Link>
              <Link 
                href="/content/trending-hub-2025" 
                className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors text-center"
              >
                Trending Guides
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sök produkter</label>
              <input
                type="text"
                placeholder="Sök efter produkter eller keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Plattform</label>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {platforms.map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedCategory('All')
                  setSelectedPlatform('All')
                  setSearchQuery('')
                }}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Rensa filter
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Totala Produkter</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Trending Nu</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter(p => p.trending).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Plattformar</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Array.from(new Set(products.map(p => p.platform))).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              
              {/* Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.platform === 'Amazon' 
                        ? 'bg-orange-100 text-orange-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.platform}
                    </span>
                    {product.trending && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {product.category}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.title}
                </h3>

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-green-600">
                      {product.price}
                    </span>
                    {product.originalPrice && (
                      <>
                        <span className="text-sm text-gray-500 line-through">
                          {product.originalPrice}
                        </span>
                        {product.discount && (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                            -{product.discount}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  {product.commission && (
                    <p className="text-sm text-blue-600 mt-1">
                      Kommission: {product.commission}
                    </p>
                  )}
                </div>

                {/* Keywords */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {product.keywords.slice(0, 3).map((keyword, index) => (
                      <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                        #{keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 pb-6">
                <button
                  onClick={() => handleProductClick(product)}
                  className={`w-full font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center ${
                    product.platform === 'Amazon'
                      ? 'bg-orange-600 hover:bg-orange-700 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {product.buttonText}
                  <ExternalLink className="h-4 w-4 ml-2" />
                </button>
                
                <p className="text-xs text-gray-500 mt-3 text-center">
                  {product.disclaimer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <ShoppingCart className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Inga produkter hittades</h3>
            <p className="text-gray-600 mb-4">
              Prova att ändra dina filter eller sökord.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All')
                setSelectedPlatform('All')
                setSearchQuery('')
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Visa alla produkter
            </button>
          </div>
        )}

        {/* Affiliate Info */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🔗 Affiliate Information</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Amazon Associates</h3>
              <p className="text-gray-600 mb-2">
                <strong>Associate Tag:</strong> <code className="bg-gray-100 px-2 py-1 rounded">lemonec-20</code>
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Active Products:</strong> {products.filter(p => p.platform === 'Amazon').length}
              </p>
              <p className="text-sm text-gray-500">
                Som Amazon Associate tjänar vi på kvalificerade köp.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">AliExpress Affiliate</h3>
              <p className="text-gray-600 mb-2">
                <strong>App Key:</strong> <code className="bg-gray-100 px-2 py-1 rounded">514666</code>
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Active Products:</strong> {products.filter(p => p.platform === 'AliExpress').length}
              </p>
              <p className="text-sm text-gray-500">
                Som AliExpress partner får vi provision på köp via våra länkar.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
