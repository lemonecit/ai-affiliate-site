'use client';

import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AnalyticsData {
  total_clicks: number
  total_conversions: number
  total_revenue: number
  conversion_rate: number
  sources: {
    [key: string]: {
      clicks: number
      conversions: number
      revenue: number
      conversion_rate: number
    }
  }
}

interface TrendingProduct {
  product_id: string
  clicks: number
  conversions: number
  revenue: number
  conversion_rate: number
  sources: string[]
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [trending, setTrending] = useState<TrendingProduct[]>([])
  const [timeRange, setTimeRange] = useState('7')
  const [loading, setLoading] = useState(true)

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/analytics?days=${timeRange}`)
      const data = await response.json()
      
      if (data.success) {
        setAnalytics(data.data)
      }
    } catch (error) {
      console.error('Fel vid hämtning av analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTrendingProducts = async () => {
    try {
      const response = await fetch(`/api/products?sort=clicks&days=${timeRange}&limit=10`)
      const data = await response.json()
      
      if (data.success) {
        // Mock trending data based on products
        const mockTrending = data.data.products.slice(0, 10).map((product: any, index: number) => ({
          product_id: product.id,
          clicks: Math.floor(Math.random() * 100) + 20,
          conversions: Math.floor(Math.random() * 10) + 1,
          revenue: Math.floor(Math.random() * 1000) + 100,
          conversion_rate: Math.floor(Math.random() * 15) + 5,
          sources: ['website', 'telegram', 'social']
        }))
        setTrending(mockTrending)
      }
    } catch (error) {
      console.error('Fel vid hämtning av trending produkter:', error)
    }
  }

  useEffect(() => {
    fetchAnalytics()
    fetchTrendingProducts()
  }, [timeRange])

  const generateChartData = () => {
    if (!analytics) return null

    const sources = Object.keys(analytics.sources)
    const clicksData = sources.map(source => analytics.sources[source].clicks)
    const conversionsData = sources.map(source => analytics.sources[source].conversions)
    const revenueData = sources.map(source => analytics.sources[source].revenue)

    return {
      clicks: {
        labels: sources,
        datasets: [
          {
            label: 'Klick',
            data: clicksData,
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 2,
          },
        ],
      },
      conversions: {
        labels: sources,
        datasets: [
          {
            label: 'Konverteringar',
            data: conversionsData,
            backgroundColor: 'rgba(16, 185, 129, 0.5)',
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 2,
          },
        ],
      },
      revenue: {
        labels: sources,
        datasets: [
          {
            label: 'Intäkter (kr)',
            data: revenueData,
            backgroundColor: 'rgba(245, 158, 11, 0.5)',
            borderColor: 'rgba(245, 158, 11, 1)',
            borderWidth: 2,
          },
        ],
      },
      sourceDistribution: {
        labels: sources,
        datasets: [
          {
            data: clicksData,
            backgroundColor: [
              '#3B82F6',
              '#10B981',
              '#F59E0B',
              '#EF4444',
              '#8B5CF6',
              '#F97316'
            ],
          },
        ],
      }
    }
  }

  const chartData = generateChartData()

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Laddar dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">📊 Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Oversikt över affiliate-prestanda och analytics
          </p>
          
          {/* Time Range Selector */}
          <div className="mt-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">Senaste 24h</option>
              <option value="7">Senaste 7 dagarna</option>
              <option value="30">Senaste 30 dagarna</option>
              <option value="90">Senaste 90 dagarna</option>
            </select>
          </div>
        </div>

        {/* KPI Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold">👆</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Klick</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.total_clicks.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 font-bold">✅</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Konverteringar</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.total_conversions.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-yellow-600 font-bold">💰</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Intäkter</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.total_revenue.toLocaleString()} kr
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 font-bold">📈</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Konverteringsgrad</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.conversion_rate.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts */}
        {chartData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            
            {/* Clicks Chart */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📊 Klick per Källa
              </h3>
              <Bar data={chartData.clicks} options={chartOptions} />
            </div>

            {/* Revenue Chart */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                💰 Intäkter per Källa
              </h3>
              <Line data={chartData.revenue} options={chartOptions} />
            </div>

            {/* Source Distribution */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🥧 Trafikfördelning
              </h3>
              <Doughnut 
                data={chartData.sourceDistribution} 
                options={{
                  ...chartOptions,
                  plugins: {
                    legend: {
                      position: 'right' as const,
                    },
                  },
                }}
              />
            </div>

            {/* Conversions Chart */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                ✅ Konverteringar per Källa
              </h3>
              <Bar data={chartData.conversions} options={chartOptions} />
            </div>
          </div>
        )}

        {/* Trending Products Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              🔥 Trending Produkter
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produkt ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Klick
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Konverteringar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Intäkter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conv. Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Källor
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {trending.map((product, index) => (
                  <tr key={product.product_id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.product_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.clicks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.conversions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.revenue} kr
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.conversion_rate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.sources.join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors">
            🔄 Uppdatera Produkter
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors">
            📊 Exportera Rapport
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors">
            🚀 Starta Telegram Bot
          </button>
        </div>

      </div>
    </div>
  )
}
