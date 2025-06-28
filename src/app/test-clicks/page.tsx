'use client'

import { useState } from 'react'
import AffiliateButton, { ProductCard } from '@/components/AffiliateButton'

// Test produkter för click tracking
const testProducts = [
  {
    id: '1',
    url: 'https://amzn.to/test1',
    platform: 'amazon' as const,
    productName: 'iPhone 15 Pro Max - Test Product',
    price: '12,999 kr',
    originalPrice: '14,999 kr',
    discount: '13%',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400',
    category: 'Electronics',
    commission: 390
  },
  {
    id: '2',
    url: 'https://s.click.aliexpress.com/test2',
    platform: 'aliexpress' as const,
    productName: 'Wireless Headphones - Gaming Pro',
    price: '599 kr',
    originalPrice: '899 kr',
    discount: '33%',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400',
    category: 'Audio',
    commission: 45
  }
]

export default function ClickTrackingTestPage() {
  const [clickLog, setClickLog] = useState<string[]>([])

  const addToLog = (message: string) => {
    setClickLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Click Tracking Test
          </h1>
          <p className="text-xl text-gray-600">
            Testa affiliate click tracking med dessa exempelprodukter
          </p>
          <div className="mt-4 p-4 bg-blue-100 rounded-lg">
            <p className="text-blue-800">
              🔍 <strong>Instruktioner:</strong> Klicka på köp-knapparna nedan. 
              Varje klick spåras i MongoDB och visas i loggen.
            </p>
          </div>
        </div>

        {/* Test produkter */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {testProducts.map((product) => (
            <div key={product.id}>
              <ProductCard link={product} />
            </div>
          ))}
        </div>

        {/* Enkel click log */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Click Log (Live)</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {clickLog.length === 0 ? (
              <p className="text-gray-500 italic">Inga klick registrerade än...</p>
            ) : (
              clickLog.map((log, index) => (
                <div key={index} className="text-sm font-mono bg-gray-50 p-2 rounded">
                  {log}
                </div>
              ))
            )}
          </div>
          <button 
            onClick={() => setClickLog([])}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Rensa Log
          </button>
        </div>

        {/* Navigation till admin */}
        <div className="mt-8 text-center">
          <div className="space-x-4">
            <a 
              href="/admin"
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 inline-block"
            >
              Se Analytics i Admin
            </a>
            <a 
              href="/dashboard"
              className="bg-secondary-600 text-white px-6 py-3 rounded-lg hover:bg-secondary-700 inline-block"
            >
              Se Dashboard
            </a>
          </div>
        </div>

        {/* API Test knappar */}
        <div className="mt-8 bg-gray-100 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Manuell API Test</h3>
          <div className="space-x-4">
            <button 
              onClick={async () => {
                try {
                  const response = await fetch('/api/analytics', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      productId: 'test-product-1',
                      platform: 'amazon',
                      source: 'manual-test'
                    })
                  })
                  const result = await response.json()
                  addToLog(`Manual click tracked: ${JSON.stringify(result)}`)
                } catch (error) {
                  addToLog(`Error: ${error}`)
                }
              }}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Test Analytics API
            </button>
            
            <button 
              onClick={async () => {
                try {
                  const response = await fetch('/api/clicks', {
                    method: 'GET'
                  })
                  const result = await response.json()
                  addToLog(`Recent clicks: ${result.data?.clicks?.length || 0} found`)
                } catch (error) {
                  addToLog(`Error fetching clicks: ${error}`)
                }
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Get Recent Clicks
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
