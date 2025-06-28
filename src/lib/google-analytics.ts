// Google Analytics 4 Client för Next.js
'use client'

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

export class GoogleAnalytics {
  private measurementId: string
  private initialized: boolean = false

  constructor(measurementId: string = 'G-XXXXXXXXXX') {
    this.measurementId = measurementId
  }

  init() {
    if (this.initialized || typeof window === 'undefined') return

    // Lägg till Google Analytics script
    const script1 = document.createElement('script')
    script1.async = true
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`
    document.head.appendChild(script1)

    const script2 = document.createElement('script')
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${this.measurementId}', {
        page_title: document.title,
        page_location: window.location.href
      });
    `
    document.head.appendChild(script2)

    this.initialized = true
    console.log('✅ Google Analytics 4 initialiserad')
  }

  trackEvent(eventName: string, parameters: { [key: string]: any } = {}) {
    if (typeof window === 'undefined' || !window.gtag) {
      console.warn('GA4 inte tillgängligt')
      return
    }

    window.gtag('event', eventName, {
      ...parameters,
      timestamp_micros: Date.now() * 1000
    })

    console.log(`🎯 GA4 Event: ${eventName}`, parameters)
  }

  trackAffiliateClick(productId: string, platform: string, category: string, source: string = 'website') {
    this.trackEvent('affiliate_click', {
      product_id: productId,
      platform: platform,
      category: category,
      source: source,
      currency: 'SEK'
    })
  }

  trackAffiliateConversion(productId: string, platform: string, revenue: number) {
    this.trackEvent('purchase', {
      product_id: productId,
      platform: platform,
      value: revenue,
      currency: 'SEK',
      transaction_id: `aff_${productId}_${Date.now()}`
    })
  }

  trackPageView(pageTitle: string, pageLocation?: string) {
    if (typeof window === 'undefined' || !window.gtag) return

    window.gtag('config', this.measurementId, {
      page_title: pageTitle,
      page_location: pageLocation || window.location.href
    })
  }

  setUserProperties(properties: { [key: string]: any }) {
    if (typeof window === 'undefined' || !window.gtag) return

    window.gtag('set', {
      custom_map: properties
    })
  }
}

// Singleton instance
let gaInstance: GoogleAnalytics | null = null

export function getGA(): GoogleAnalytics {
  if (!gaInstance) {
    const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX'
    gaInstance = new GoogleAnalytics(measurementId)
  }
  return gaInstance
}

// React hook för Google Analytics
import { useEffect } from 'react'

export function useGoogleAnalytics() {
  useEffect(() => {
    const ga = getGA()
    ga.init()
  }, [])

  return getGA()
}

// Utility för att generera client ID
export function generateClientId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Utility för att få client ID från localStorage
export function getClientId(): string {
  if (typeof window === 'undefined') return generateClientId()
  
  let clientId = localStorage.getItem('ga_client_id')
  if (!clientId) {
    clientId = generateClientId()
    localStorage.setItem('ga_client_id', clientId)
  }
  return clientId
}
