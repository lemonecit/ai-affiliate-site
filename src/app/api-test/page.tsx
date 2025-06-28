'use client'

import { useState } from 'react'

export default function ApiTestPage() {
  const [results, setResults] = useState<any[]>([])

  const addResult = (test: string, result: any) => {
    setResults(prev => [...prev, { test, result, time: new Date().toLocaleTimeString() }])
  }

  const testAnalyticsAPI = async () => {
    try {
      const response = await fetch('/api/analytics')
      const result = await response.json()
      addResult('GET /api/analytics', { status: response.status, ...result })
    } catch (error) {
      addResult('GET /api/analytics ERROR', { message: String(error) })
    }
  }

  const testAnalyticsPost = async () => {
    try {
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: 'test-456',
          platform: 'amazon',
          source: 'website'
        })
      })
      const result = await response.json()
      addResult('POST /api/analytics', { status: response.status, ...result })
    } catch (error) {
      addResult('POST /api/analytics ERROR', { message: String(error) })
    }
  }

  const testAnalyticsSimple = async () => {
    try {
      const response = await fetch('/api/analytics-simple')
      const result = await response.json()
      addResult('GET /api/analytics-simple', { status: response.status, ...result })
    } catch (error) {
      addResult('GET /api/analytics-simple ERROR', { message: String(error) })
    }
  }

  const setupDatabase = async () => {
    try {
      const response = await fetch('/api/admin/setup-database', {
        method: 'POST'
      })
      const result = await response.json()
      addResult('Setup Database', result)
    } catch (error) {
      addResult('Setup Database ERROR', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">API Debug Test</h1>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button onClick={setupDatabase} className="bg-purple-600 text-white p-4 rounded hover:bg-purple-700">
            🚀 Setup Database First
          </button>
          <button onClick={testAnalyticsPost} className="bg-red-600 text-white p-4 rounded hover:bg-red-700">
            Test POST /api/analytics (Track Click)
          </button>
          <button onClick={testAnalyticsAPI} className="bg-yellow-600 text-white p-4 rounded hover:bg-yellow-700">
            Test GET /api/analytics (Get Stats)
          </button>
          <button onClick={testAnalyticsSimple} className="bg-green-600 text-white p-4 rounded hover:bg-green-700">
            Test GET /api/analytics-simple
          </button>
          <button onClick={() => setResults([])} className="bg-gray-600 text-white p-4 rounded hover:bg-gray-700">
            Clear Results
          </button>
          <div></div> {/* Empty space for grid alignment */}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">API Test Results</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {results.length === 0 ? (
              <p className="text-gray-500">No tests run yet...</p>
            ) : (
              results.map((result, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="font-bold text-sm text-gray-600">
                    {result.time} - {result.test}
                  </div>
                  <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                    {JSON.stringify(result.result, null, 2)}
                  </pre>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <a href="/admin" className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700">
            Back to Admin
          </a>
        </div>
      </div>
    </div>
  )
}
