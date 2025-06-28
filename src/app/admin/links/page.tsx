'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface AffiliateLink {
  _id: string
  name: string
  url: string
  platform: 'amazon' | 'aliexpress'
  category: string
  price?: string
  originalPrice?: string
  commission: number
  totalCommission: number
  clickCount: number
  image?: string
  description?: string
  isActive: boolean
  createdAt: string
}

export default function AdminLinksPage() {
  const [links, setLinks] = useState<AffiliateLink[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPlatform, setFilterPlatform] = useState('all')

  useEffect(() => {
    fetchLinks()
  }, [])

  const fetchLinks = async () => {
    try {
      const response = await fetch('/api/admin/links')
      if (response.ok) {
        const data = await response.json()
        setLinks(data.links || [])
      }
    } catch (error) {
      console.error('Error fetching links:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Är du säker på att du vill ta bort denna länk?')) {
      try {
        const response = await fetch(`/api/admin/links/${id}`, {
          method: 'DELETE',
        })
        
        if (response.ok) {
          await fetchLinks()
        }
      } catch (error) {
        console.error('Error deleting link:', error)
      }
    }
  }

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/links/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      })
      
      if (response.ok) {
        await fetchLinks()
      }
    } catch (error) {
      console.error('Error toggling link status:', error)
    }
  }

  const filteredLinks = links.filter(link => {
    const matchesSearch = link.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPlatform = filterPlatform === 'all' || link.platform === filterPlatform
    
    return matchesSearch && matchesPlatform
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Laddar länkar...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Länkhantering</h1>
              <p className="text-gray-600 mt-1">Hantera dina affiliate-länkar</p>
            </div>
            <Link 
              href="/admin"
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              ← Tillbaka till Dashboard
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{links.length}</p>
              <p className="text-sm text-gray-600">Totala länkar</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{links.filter(l => l.isActive).length}</p>
              <p className="text-sm text-gray-600">Aktiva länkar</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{links.reduce((sum, l) => sum + l.clickCount, 0)}</p>
              <p className="text-sm text-gray-600">Totala klick</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">${links.reduce((sum, l) => sum + l.totalCommission, 0).toFixed(2)}</p>
              <p className="text-sm text-gray-600">Total kommission</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Sök länkar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Alla plattformar</option>
              <option value="amazon">Amazon</option>
              <option value="aliexpress">AliExpress</option>
            </select>
          </div>
        </div>

        {/* Links Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produkt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plattform
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Klick
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kommission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Åtgärder
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLinks.length > 0 ? (
                  filteredLinks.map((link) => (
                    <tr key={link._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {link.image && (
                            <img 
                              src={link.image} 
                              alt={link.name}
                              className="h-10 w-10 rounded object-cover mr-3"
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                              {link.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(link.createdAt).toLocaleDateString('sv-SE')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          link.platform === 'amazon' 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {link.platform === 'amazon' ? 'Amazon' : 'AliExpress'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {link.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {link.clickCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                        ${link.totalCommission.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleActive(link._id, link.isActive)}
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium cursor-pointer ${
                            link.isActive 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {link.isActive ? 'Aktiv' : 'Inaktiv'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleDelete(link._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Ta bort
                        </button>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Öppna
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      Inga länkar hittades. Lägg till några affiliate-länkar för att komma igång.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
