'use client'

import { useState } from 'react'
import { ExternalLink, TrendingUp, DollarSign } from 'lucide-react'

interface AffiliateLink {
  id: string
  url: string
  platform: 'amazon' | 'aliexpress'
  productName: string
  price?: string
  originalPrice?: string
  discount?: string
  rating?: number
  image?: string
  category?: string
  commission?: number
}

interface Props {
  link: AffiliateLink
  className?: string
}

export default function AffiliateButton({ link, className = '' }: Props) {
  const [isTracking, setIsTracking] = useState(false)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    setIsTracking(true)

    try {
      // Track the click
      await fetch('/api/clicks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: link.url,
          platform: link.platform,
          productId: link.id,
          productName: link.productName,
          commission: link.commission
        }),
      })

      // Open the affiliate link
      window.open(link.url, '_blank', 'noopener,noreferrer')
    } catch (error) {
      console.error('Error tracking click:', error)
      // Still open the link even if tracking fails
      window.open(link.url, '_blank', 'noopener,noreferrer')
    } finally {
      setIsTracking(false)
    }
  }

  const getPlatformColor = (platform: string) => {
    return platform === 'amazon' 
      ? 'from-orange-400 to-orange-600' 
      : 'from-red-400 to-red-600'
  }

  const getPlatformName = (platform: string) => {
    return platform === 'amazon' ? 'Amazon' : 'AliExpress'
  }

  return (
    <button
      onClick={handleClick}
      disabled={isTracking}
      className={`group relative bg-gradient-to-r ${getPlatformColor(link.platform)} text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <div className="flex items-center justify-center space-x-2">
        {isTracking ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        ) : (
          <>
            <ExternalLink className="h-4 w-4" />
            <span>Köp på {getPlatformName(link.platform)}</span>
            {link.price && (
              <span className="font-bold">{link.price}</span>
            )}
          </>
        )}
      </div>
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-200"></div>
    </button>
  )
}

// Product Card Component
interface ProductCardProps {
  link: AffiliateLink
}

export function ProductCard({ link }: ProductCardProps) {
  return (
    <div className="card group hover:shadow-2xl transition-all duration-300">
      {link.image && (
        <div className="relative overflow-hidden rounded-lg mb-4">
          <img 
            src={link.image} 
            alt={link.productName}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {link.discount && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold">
              -{link.discount}
            </div>
          )}
          <div className={`absolute top-2 left-2 px-2 py-1 rounded-lg text-xs font-medium text-white ${
            link.platform === 'amazon' ? 'bg-orange-500' : 'bg-red-500'
          }`}>
            {getPlatformName(link.platform)}
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {link.productName}
        </h3>
        
        {link.rating && (
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(link.rating!) 
                    ? 'text-yellow-400' 
                    : 'text-gray-300'
                }`}
              >
                ⭐
              </div>
            ))}
            <span className="text-sm text-gray-600 ml-1">({link.rating})</span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            {link.price && (
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900">{link.price}</span>
                {link.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">{link.originalPrice}</span>
                )}
              </div>
            )}
            {link.commission && (
              <div className="flex items-center text-green-600 text-sm">
                <DollarSign className="h-3 w-3 mr-1" />
                <span>Kommission: ${link.commission}</span>
              </div>
            )}
          </div>
        </div>
        
        <AffiliateButton link={link} className="w-full" />
      </div>
    </div>
  )
}

function getPlatformName(platform: string) {
  return platform === 'amazon' ? 'Amazon' : 'AliExpress'
}
