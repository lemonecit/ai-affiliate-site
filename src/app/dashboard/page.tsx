'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, MousePointer, DollarSign, Eye, Calendar, Filter } from 'lucide-react'

interface ClickData {
  id: string
  url: string
  platform: 'amazon' | 'aliexpress'
  timestamp: string
  ip: string
  userAgent: string
  referrer: string
  productId?: string
  productName?: string
  commission?: number
}

interface AnalyticsData {
  totalClicks: number
  totalCommission: number
  conversionRate: number
  topProducts: Array<{
    name: string
    clicks: number
    commission: number
  }>
  clicksByDay: Array<{
    date: string
    amazon: number
    aliexpress: number
  }>
  platformDistribution: Array<{
    name: string
    value: number
    color: string
  }>
}

export default function DashboardPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [recentClicks, setRecentClicks] = useState<ClickData[]>([])
  const [loading, setLoading] = useState(true)
  const [dateFilter, setDateFilter] = useState('7d')

  useEffect(() => {
    fetchAnalyticsData()
    fetchRecentClicks()
  }, [dateFilter])

  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch(`/api/analytics?period=${dateFilter}`)
      const data = await response.json()
      setAnalyticsData(data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentClicks = async () => {
    try {
      const response = await fetch('/api/clicks/recent')
      const data = await response.json()
      setRecentClicks(data)
    } catch (error) {
      console.error('Error fetching recent clicks:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Laddar dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">Övervaka dina affiliate-klick och intäkter</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <select 
                value={dateFilter} 
                onChange={(e) => setDateFilter(e.target.value)}
                className="input-field"
              >
                <option value="24h">Senaste 24h</option>
                <option value="7d">Senaste 7 dagarna</option>
                <option value="30d">Senaste 30 dagarna</option>
                <option value="90d">Senaste 90 dagarna</option>
              </select>
              
              <button className="btn-primary flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Exportera Rapport
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Totala Klick</p>
                <p className="text-3xl font-bold text-gray-900">{analyticsData?.totalClicks.toLocaleString() || '0'}</p>
              </div>
              <MousePointer className="h-12 w-12 text-primary-500" />
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 text-sm font-medium">+12.5%</span>
              <span className="text-gray-500 text-sm ml-1">från förra veckan</span>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Kommission</p>
                <p className="text-3xl font-bold text-gray-900">${analyticsData?.totalCommission.toFixed(2) || '0.00'}</p>
              </div>
              <DollarSign className="h-12 w-12 text-green-500" />
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 text-sm font-medium">+8.2%</span>
              <span className="text-gray-500 text-sm ml-1">från förra veckan</span>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Konverteringsgrad</p>
                <p className="text-3xl font-bold text-gray-900">{analyticsData?.conversionRate.toFixed(1) || '0.0'}%</p>
              </div>
              <Eye className="h-12 w-12 text-blue-500" />
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 text-sm font-medium">+2.1%</span>
              <span className="text-gray-500 text-sm ml-1">från förra veckan</span>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Genomsnittlig Order</p>
                <p className="text-3xl font-bold text-gray-900">$45.67</p>
              </div>
              <TrendingUp className="h-12 w-12 text-purple-500" />
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 text-sm font-medium">+5.3%</span>
              <span className="text-gray-500 text-sm ml-1">från förra veckan</span>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Clicks Over Time */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Klick över tid</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData?.clicksByDay || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amazon" stroke="#ff9500" strokeWidth={2} name="Amazon" />
                <Line type="monotone" dataKey="aliexpress" stroke="#ff6b35" strokeWidth={2} name="AliExpress" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Platform Distribution */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Plattformsfördelning</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData?.platformDistribution || []}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {analyticsData?.platformDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Toppresterade Produkter</h3>
            <div className="space-y-4">
              {analyticsData?.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.clicks} klick</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">${product.commission.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Clicks */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Senaste Klick</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {recentClicks.map((click) => (
                <div key={click.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {click.productName || 'Okänd produkt'}
                    </p>
                    <div className="flex items-center mt-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        click.platform === 'amazon' 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {click.platform === 'amazon' ? 'Amazon' : 'AliExpress'}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        {new Date(click.timestamp).toLocaleString('sv-SE')}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    {click.commission && (
                      <p className="text-sm font-medium text-green-600">
                        ${click.commission.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
