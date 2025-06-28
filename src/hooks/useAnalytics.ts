'use client'

import { useCallback } from 'react'

interface TrackingHook {
  trackClick: (productId: string, productTitle: string) => void
  trackConversion: (productId: string, productTitle: string, amount: number) => void
}

export function useAnalytics(): TrackingHook {
  const trackClick = useCallback(async (productId: string, productTitle: string) => {
    try {
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'click',
          productId,
          productTitle,
          timestamp: new Date().toISOString()
        })
      })
      
      if (!response.ok) {
        console.error('Failed to track click')
      }
    } catch (error) {
      console.error('Analytics tracking error:', error)
    }
  }, [])

  const trackConversion = useCallback(async (productId: string, productTitle: string, amount: number) => {
    try {
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'conversion',
          productId,
          productTitle,
          amount,
          timestamp: new Date().toISOString()
        })
      })
      
      if (!response.ok) {
        console.error('Failed to track conversion')
      }
    } catch (error) {
      console.error('Analytics tracking error:', error)
    }
  }, [])

  return { trackClick, trackConversion }
}
