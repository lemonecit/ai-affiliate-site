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

interface TrendData {
  trendingKeywords: string[];
  trendingCategories: string[];
  calculatedAt: string;
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
  const [trends, setTrends] = useState<TrendData | null>(null);

  useEffect(() => {
    fetchRealStats()
    fetchTrends()
  }, [])

  const fetchRealStats = async () => {
    try {
      // Hämta riktig data från analytics API (MongoDB)
      const response = await fetch('/api/analytics')
      if (response.ok) {
        const result = await response.json()
        const data = result.data
        
        setStats({
          totalClicks: data.overview.totalClicks || 0,
          totalConversions: data.overview.totalConversions || 0,
          revenue: data.overview.totalCommissions || 0,
          topProducts: data.topProducts?.map((product: any) => ({
            id: product.productId,
            title: product.product?.title || `Product ${product.productId}`,
            clicks: product.clicks,
            conversions: product.conversions
          })) || []
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

  const fetchTrends = async () => {
    try {
      const response = await fetch('/api/trends');
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setTrends(result.data);
        } else {
          setTrends(null);
        }
      } else {
        setTrends(null);
      }
    } catch (error) {
      console.error('Error fetching trends:', error);
      setTrends(null);
    }
  };

  const handleUpdateProducts = async () => {
    setActionStatus({ isLoading: true, message: 'Uppdaterar produkter...', type: 'info' })
    
    try {
      const response = await fetch('/api/db/update-products', {
        method: 'POST'
      })
      
      const result = await response.json()
      console.log('Update products result:', result)
      
      if (response.ok && result.success) {
        setActionStatus({ 
          isLoading: false, 
          message: `${result.message} (${result.data?.products || 0} produkter)`, 
          type: 'success' 
        })
        // Uppdatera stats efter produktuppdatering
        fetchRealStats()
      } else {
        throw new Error(result.error || result.details || 'Failed to update products')
      }
    } catch (error) {
      console.error('Update products error:', error)
      setActionStatus({ 
        isLoading: false, 
        message: `Fel vid uppdatering av produkter: ${error instanceof Error ? error.message : 'Okänt fel'}`, 
        type: 'error' 
      })
    }
    
    // Rensa meddelandet efter 5 sekunder
    setTimeout(() => {
      setActionStatus({ isLoading: false, message: '', type: 'info' })
    }, 5000)
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
        // Uppdatera stats och trender efter analys
        fetchRealStats()
        fetchTrends()
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

  const testApiConnectivity = async () => {
    setActionStatus({ isLoading: true, message: 'Testar MongoDB-anslutning...', type: 'info' })
    
    try {
      const response = await fetch('/api/test-mongo', {
        method: 'POST'
      })
      const result = await response.json()
      console.log('MongoDB test result:', result)
      
      if (response.ok && result.success) {
        setActionStatus({ 
          isLoading: false, 
          message: `MongoDB fungerar! Miljö: ${result.debug?.vercelEnv || result.debug?.nodeEnv}`, 
          type: 'success' 
        })
      } else {
        setActionStatus({ 
          isLoading: false, 
          message: `MongoDB-fel: ${result.error}`, 
          type: 'error' 
        })
      }
    } catch (error) {
      console.error('MongoDB test error:', error)
      setActionStatus({ 
        isLoading: false, 
        message: `Test misslyckades: ${error instanceof Error ? error.message : 'Okänt fel'}`, 
        type: 'error' 
      })
    }
    
    setTimeout(() => {
      setActionStatus({ isLoading: false, message: '', type: 'info' })
    }, 5000)
  }

  const handleSetupDatabase = async () => {
    if (!confirm('Detta kommer att ersätta all befintlig data med sample-data. Fortsätt?')) {
      return
    }

    setActionStatus({ isLoading: true, message: 'Initialiserar databas med sample-data...', type: 'info' })
    
    try {
      console.log('Calling /api/final-setup...')
      const response = await fetch('/api/final-setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)
      
      if (response.ok) {
        const result = await response.json()
        console.log('Setup result:', result)
        setActionStatus({ 
          isLoading: false, 
          message: `Databas initialiserad! ${result.data?.products || 'Okänt antal'} produkter, ${result.data?.clicks || 'Okänt antal'} klick skapade`, 
          type: 'success' 
        })
        // Uppdatera stats efter setup
        fetchRealStats()
        fetchTrends()
      } else {
        const responseText = await response.text()
        console.error('Setup failed with status:', response.status)
        console.error('Response text:', responseText)
        
        let errorData;
        try {
          errorData = JSON.parse(responseText)
        } catch {
          errorData = { error: responseText || `HTTP ${response.status}` }
        }
        
        throw new Error(errorData.error || `HTTP ${response.status}: ${errorData.details || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Setup database error:', error)
      setActionStatus({ 
        isLoading: false, 
        message: `Fel vid initialisering av databas: ${error instanceof Error ? error.message : 'Okänt fel'}`, 
        type: 'error' 
      })
    }
    
    setTimeout(() => {
      setActionStatus({ isLoading: false, message: '', type: 'info' })
    }, 5000)
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
          <p className="text-gray-600">AI Affiliate Platform Analytics & Control Center</p>
          
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
              <button 
                onClick={handleSetupDatabase}
                disabled={actionStatus.isLoading}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionStatus.isLoading && actionStatus.message.includes('databas') ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Initialiserar...
                  </div>
                ) : (
                  '🚀 Setup Database (Sample Data)'
                )}
              </button>
              
              {/* MongoDB Test Button */}
              <button
                onClick={testApiConnectivity}
                disabled={actionStatus.isLoading}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {actionStatus.isLoading && actionStatus.message.includes('MongoDB') ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Testar...
                  </div>
                ) : (
                  '🔍 Test MongoDB Connection'
                )}
              </button>
              
              {/* Quick Test Link */}
              <div className="mt-2">
                <a 
                  href="/api/test-mongo" 
                  target="_blank" 
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  🔗 Test MongoDB direkt (öppnar nytt fönster)
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Senaste Trendanalys</h3>
            {trends && trends.calculatedAt ? (
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-700">🔥 Heta Sökord:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(trends.trendingKeywords || []).map(keyword => (
                      <span key={keyword} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">{keyword}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-700">📊 Heta Kategorier:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(trends.trendingCategories || []).map(category => (
                      <span key={category} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">{category}</span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500 pt-2">
                  Senast beräknad: {new Date(trends.calculatedAt).toLocaleString('sv-SE')}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Ingen trenddata tillgänglig. Kör en analys för att se resultat.</p>
            )}
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
