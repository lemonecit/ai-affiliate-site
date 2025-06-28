'use client'

import { useState, useEffect } from 'react'

interface AdminStats {
  totalClicks: number
  totalConversions: number
  revenue: number
  topProducts: Array<{
    id: string
    title: string
    clicks: number
    conversions: number
  }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalClicks: 0,
    totalConversions: 0,
    revenue: 0,
    topProducts: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulera data för nu
    setTimeout(() => {
      setStats({
        totalClicks: 1247,
        totalConversions: 23,
        revenue: 2899,
        topProducts: [
          { id: '1', title: 'Gaming Headset', clicks: 156, conversions: 8 },
          { id: '2', title: 'Wireless Mouse', clicks: 134, conversions: 6 },
          { id: '3', title: 'LED Strip', clicks: 98, conversions: 4 },
          { id: '4', title: 'Phone Case', clicks: 87, conversions: 3 },
          { id: '5', title: 'Bluetooth Speaker', clicks: 76, conversions: 2 }
        ]
      })
      setLoading(false)
    }, 1000)
  }, [])

  const conversionRate = stats.totalClicks > 0 
    ? ((stats.totalConversions / stats.totalClicks) * 100).toFixed(2)
    : '0.00'

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Laddar admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">AI Affiliate Platform Analytics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Klick</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalClicks.toLocaleString()}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <span className="text-blue-600 text-xl">👆</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Konverteringar</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalConversions}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <span className="text-green-600 text-xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Konverteringsgrad</p>
                <p className="text-3xl font-bold text-gray-900">{conversionRate}%</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <span className="text-yellow-600 text-xl">📈</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Intäkter</p>
                <p className="text-3xl font-bold text-gray-900">{stats.revenue.toLocaleString()} kr</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <span className="text-purple-600 text-xl">💰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Bästa Produkter</h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produkt
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Klick
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Konverteringar
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Konverteringsgrad
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.topProducts.map((product) => {
                    const productConversionRate = product.clicks > 0 
                      ? ((product.conversions / product.clicks) * 100).toFixed(1)
                      : '0.0'
                    
                    return (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {product.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.clicks}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.conversions}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {productConversionRate}%
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
