# 📊 Analytics & Tracking Setup Guide

## 🚀 Fas 1: Analytics & Tracking - IMPLEMENTATION KLAR!

### ✅ **Vad som implementerats:**

#### 1. **MongoDB Atlas Integration**
- `src/lib/mongodb.ts` - Komplett databasklient 
- `analytics_tracker.py` - Python standalone-versioner
- Click tracking med full metadata
- Aggregation pipelines för statistik
- Trending products analysis

#### 2. **Google Analytics 4 Integration** 
- `src/lib/google-analytics.ts` - Client-side tracking
- `google_analytics.py` - Server-side tracking
- Affiliate event tracking
- Conversion tracking med revenue
- Custom client ID hantering

#### 3. **API Endpoints**
- `src/app/api/analytics/route.ts` - Click tracking API
- MongoDB + GA4 integration
- UTM parameter tracking
- Real-time statistics

#### 4. **TypeScript Types**
- `src/types/index.ts` - Kompletta types
- Analytics interfaces
- API response types
- Database schemas

---

## 🔧 **Setup Instructions**

### 1. **MongoDB Atlas (Gratis)**
```bash
# 1. Gå till https://cloud.mongodb.com
# 2. Skapa gratis Atlas account  
# 3. Skapa nytt projekt: "AI Affiliate Platform"
# 4. Skapa gratis M0 cluster (512MB)
# 5. Sätt whitelist: 0.0.0.0/0 (alla IP)
# 6. Skapa database user med read/write
# 7. Kopiera connection string
```

### 2. **Google Analytics 4**
```bash
# 1. Gå till https://analytics.google.com
# 2. Skapa ny GA4 property 
# 3. Kopiera Measurement ID (G-XXXXXXXXXX)
# 4. Admin > Data Streams > Measurement Protocol
# 5. Skapa API secret för server-side tracking
```

### 3. **Environment Variables**
Lägg till i `.env.local`:
```bash
# MongoDB Atlas
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/ai_affiliate_platform?retryWrites=true&w=majority"

# Google Analytics 4
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
GA4_API_SECRET="your-measurement-protocol-secret"

# Befintliga
AMAZON_ASSOCIATE_TAG="lemonec-20"
ALIEXPRESS_APP_KEY="514666"
```

### 4. **Testa Implementation**
```bash
# Test MongoDB
python analytics_tracker.py

# Test Next.js API
npm run dev
# POST till http://localhost:3000/api/analytics

# Test GA4
# Öppna browser, se Network tab för gtag calls
```

---

## 📈 **Använda Analytics**

### **Client-Side Tracking (Next.js)**
```typescript
import { useGoogleAnalytics, getClientId } from '@/lib/google-analytics'

function ProductButton({ productId, platform, category }) {
  const ga = useGoogleAnalytics()
  
  const handleClick = async () => {
    // Track i MongoDB + GA4
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId,
        platform, 
        category,
        source: 'website',
        clientId: getClientId()
      })
    })
    
    // Öppna affiliate-länk
    window.open(affiliateUrl, '_blank')
  }
  
  return <button onClick={handleClick}>Köp nu</button>
}
```

### **Server-Side Statistics**
```typescript
// Hämta klick-statistik
const response = await fetch('/api/analytics?days=7')
const stats = await response.json()

console.log('Senaste veckan:')
console.log(`Total klick: ${stats.data.total_clicks}`)
console.log(`Konverteringar: ${stats.data.total_conversions}`)
console.log(`Konverteringsgrad: ${stats.data.conversion_rate}%`)
```

### **Python Analytics (Standalone)**
```python
from analytics_tracker import init_analytics, analytics

# Initiera
init_analytics()

# Spåra klick
analytics.track_click("product_123", "telegram", "telegram", "bot", "auto_deals")

# Hämta statistik
stats = analytics.get_click_stats(7)
trending = analytics.get_trending_products(7, 10)

print("📊 Klickstatistik:", stats)
print("🔥 Trending produkter:", trending)
```

---

## 🎯 **Dashboard & Admin**

### **Real-time Statistics**
- Total klick senaste 24h/7d/30d
- Konverteringsgrad per källa
- Trending produkter
- Revenue per plattform

### **UTM Tracking**
Alla källor spåras automatiskt:
- `website` - Direkt från siten
- `telegram` - Telegram bot-poster  
- `social` - Social media
- `email` - Email-kampanjer
- `organic` - Google sök

### **Performance Metrics**
- Click-through rate per produkt
- Conversion rate per källa
- Revenue attribution
- A/B test resultat

---

## ✅ **Status: KLART FÖR ANVÄNDNING**

Analytics & tracking är nu 100% implementerat med:
- ✅ MongoDB Atlas cloud database
- ✅ Google Analytics 4 integration  
- ✅ Click tracking API
- ✅ UTM parameter spårning
- ✅ Real-time statistics
- ✅ TypeScript types
- ✅ Fallback till localStorage

**Nästa steg**: Konfigurera MongoDB Atlas och GA4, sedan fortsätta med Fas 2!

---

## 🚀 **Nästa: Fas 2 - Fler Produkter & API**

Med analytics på plats kan vi nu mäta allt medan vi bygger:
- Utökad produktdatabas
- Automatisk produktimport  
- Fler kategorier och plattformar
- A/B testing av produktval
