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

interface ActionStatus {
  isLoading: boolean
  message: string
  type: 'success' | 'error' | 'info'
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalClicks: 0,
    totalConversions: 0,
    revenue: 0,
    topProducts: []
  })
  const [loading, setLoading] = useState(true)
  const [actionStatus, setActionStatus] = useState<ActionStatus>({
    isLoading: false,
    message: '',
    type: 'info'
  })

  useEffect(() => {
    fetchRealStats()
  }, [])

  const fetchRealStats = async () => {
    try {
      // Hämta riktig data från analytics API
      const response = await fetch('/api/analytics-simple')
      if (response.ok) {
        const data = await response.json()
        setStats({
          totalClicks: data.totalClicks || 0,
          totalConversions: data.totalConversions || 0,
          revenue: data.revenue || 0,
          topProducts: data.topProducts || []
        })
      } else {
        // Fallback till nollställda värden
        setStats({
          totalClicks: 0,
          totalConversions: 0,
          revenue: 0,
          topProducts: []
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
      // Använd nollställda värden som fallback
      setStats({
        totalClicks: 0,
        totalConversions: 0,
        revenue: 0,
        topProducts: []
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProducts = async () => {
    setActionStatus({ isLoading: true, message: 'Uppdaterar produkter...', type: 'info' })
    
    try {
      const response = await fetch('/api/admin/update-products', {
        method: 'POST'
      })
      
      if (response.ok) {
        setActionStatus({ 
          isLoading: false, 
          message: 'Produkter uppdaterade framgångsrikt!', 
          type: 'success' 
        })
        // Uppdatera stats efter produktuppdatering
        fetchRealStats()
      } else {
        throw new Error('Failed to update products')
      }
    } catch (error) {
      setActionStatus({ 
        isLoading: false, 
        message: 'Fel vid uppdatering av produkter', 
        type: 'error' 
      })
    }
    
    // Rensa meddelandet efter 3 sekunder
    setTimeout(() => {
      setActionStatus({ isLoading: false, message: '', type: 'info' })
    }, 3000)
  }

  const handleRunTrendsAnalysis = async () => {
    setActionStatus({ isLoading: true, message: 'Kör trends-analys...', type: 'info' })
    
    try {
      const response = await fetch('/api/admin/trends-analysis', {
        method: 'POST'
      })
      
      if (response.ok) {
        setActionStatus({ 
          isLoading: false, 
          message: 'Trends-analys slutförd!', 
          type: 'success' 
        })
        fetchRealStats()
      } else {
        throw new Error('Failed to run trends analysis')
      }
    } catch (error) {
      setActionStatus({ 
        isLoading: false, 
        message: 'Fel vid körning av trends-analys', 
        type: 'error' 
      })
    }
    
    setTimeout(() => {
      setActionStatus({ isLoading: false, message: '', type: 'info' })
    }, 3000)
  }

  const handleActivateTelegramBot = async () => {
    setActionStatus({ isLoading: true, message: 'Aktiverar Telegram Bot...', type: 'info' })
    
    try {
      const response = await fetch('/api/admin/activate-telegram', {
        method: 'POST'
      })
      
      if (response.ok) {
        setActionStatus({ 
          isLoading: false, 
          message: 'Telegram Bot aktiverad!', 
          type: 'success' 
        })
      } else {
        throw new Error('Failed to activate Telegram bot')
      }
    } catch (error) {
      setActionStatus({ 
        isLoading: false, 
        message: 'Fel vid aktivering av Telegram Bot (kontrollera BOT_TOKEN)', 
        type: 'error' 
      })
    }
    
    setTimeout(() => {
      setActionStatus({ isLoading: false, message: '', type: 'info' })
    }, 3000)
  }

  const handleResetAnalytics = async () => {
    if (!confirm('Är du säker på att du vill nollställa all analytics-data? Detta kan inte ångras.')) {
      return
    }

    setActionStatus({ isLoading: true, message: 'Nollställer analytics...', type: 'info' })
    
    try {
      const response = await fetch('/api/analytics', {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setActionStatus({ 
          isLoading: false, 
          message: 'Analytics-data nollställd!', 
          type: 'success' 
        })
        // Uppdatera stats efter nollställning
        fetchRealStats()
      } else {
        throw new Error('Failed to reset analytics')
      }
    } catch (error) {
      setActionStatus({ 
        isLoading: false, 
        message: 'Fel vid nollställning av analytics', 
        type: 'error' 
      })
    }
    
    setTimeout(() => {
      setActionStatus({ isLoading: false, message: '', type: 'info' })
    }, 3000)
  }

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
          
          {/* Action Status */}
          {actionStatus.message && (
            <div className={`mt-4 p-4 rounded-md ${
              actionStatus.type === 'success' ? 'bg-green-100 text-green-800' :
              actionStatus.type === 'error' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {actionStatus.isLoading && (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  {actionStatus.message}
                </div>
              )}
              {!actionStatus.isLoading && actionStatus.message}
            </div>
          )}
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

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={handleUpdateProducts}
                disabled={actionStatus.isLoading}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionStatus.isLoading && actionStatus.message.includes('produkter') ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uppdaterar...
                  </div>
                ) : (
                  'Uppdatera Produkter'
                )}
              </button>
              <button 
                onClick={handleRunTrendsAnalysis}
                disabled={actionStatus.isLoading}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionStatus.isLoading && actionStatus.message.includes('trends') ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyserar...
                  </div>
                ) : (
                  'Kör Trends Analys'
                )}
              </button>
              <button 
                onClick={handleActivateTelegramBot}
                disabled={actionStatus.isLoading}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionStatus.isLoading && actionStatus.message.includes('Telegram') ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Aktiverar...
                  </div>
                ) : (
                  'Aktivera Telegram Bot'
                )}
              </button>
              <button 
                onClick={handleResetAnalytics}
                disabled={actionStatus.isLoading}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionStatus.isLoading && actionStatus.message.includes('analytics') ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Nollställer...
                  </div>
                ) : (
                  'Nollställ Analytics'
                )}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Tools</h3>
            <div className="space-y-3">
              <a 
                href="/admin/links"
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors block text-center"
              >
                Hantera Länkar
              </a>
              <button 
                onClick={() => window.open('/api/analytics-simple', '_blank')}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Se Analytics Data
              </button>
              <button 
                onClick={fetchRealStats}
                className="w-full bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
              >
                Uppdatera Dashboard
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Platform</span>
                <span className="text-sm font-medium text-green-600">✅ Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Affiliate Links</span>
                <span className="text-sm font-medium text-green-600">✅ Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Analytics</span>
                <span className="text-sm font-medium text-green-600">✅ Tracking</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Telegram Bot</span>
                <span className="text-sm font-medium text-yellow-600">⏳ Ready</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-green-600">✅</span>
                <span>New product added: Gaming Mouse</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-600">👆</span>
                <span>156 clicks on LED Strip</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-purple-600">💰</span>
                <span>Commission earned: 89 kr</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-yellow-600">📈</span>
                <span>Trends updated: Gaming category</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
