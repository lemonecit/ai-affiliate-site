// Database setup and seeding script
// Run this once to initialize your MongoDB collections with sample data

import { getDatabase, COLLECTIONS } from '../src/lib/mongodb'

interface Product {
  _id?: string
  title: string
  platform: 'amazon' | 'aliexpress'
  price: number
  originalPrice?: number
  discount?: string
  rating: number
  image: string
  affiliateUrl: string
  category: string
  commission: number
  stats: {
    totalClicks: number
    totalConversions: number
    lastClickedAt?: Date
  }
}

const sampleProducts: Omit<Product, '_id'>[] = [
  {
    title: "iPhone 15 Pro Max 256GB - Titan Blue",
    platform: "amazon",
    price: 14999,
    originalPrice: 16999,
    discount: "12%",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400",
    affiliateUrl: "https://amzn.to/iphone15pro",
    category: "Electronics",
    commission: 450,
    stats: {
      totalClicks: 0,
      totalConversions: 0
    }
  },
  {
    title: "MacBook Air M3 - 15 tum, 16GB RAM, 512GB SSD",
    platform: "amazon", 
    price: 19999,
    originalPrice: 22999,
    discount: "13%",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400",
    affiliateUrl: "https://amzn.to/macbookairm3",
    category: "Computers",
    commission: 600,
    stats: {
      totalClicks: 0,
      totalConversions: 0
    }
  },
  {
    title: "AirPods Pro 2nd Generation med USB-C",
    platform: "amazon",
    price: 2499,
    originalPrice: 2999,
    discount: "17%", 
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400",
    affiliateUrl: "https://amzn.to/airpodspro2",
    category: "Audio",
    commission: 75,
    stats: {
      totalClicks: 0,
      totalConversions: 0
    }
  },
  {
    title: "Wireless Gaming Headset - 7.1 Surround Sound",
    platform: "aliexpress",
    price: 599,
    originalPrice: 999,
    discount: "40%",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
    affiliateUrl: "https://s.click.aliexpress.com/headset",
    category: "Gaming",
    commission: 30,
    stats: {
      totalClicks: 0,
      totalConversions: 0
    }
  },
  {
    title: "4K Webcam för Streaming och Videosamtal",
    platform: "aliexpress",
    price: 899,
    originalPrice: 1299,
    discount: "31%",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400",
    affiliateUrl: "https://s.click.aliexpress.com/webcam4k",
    category: "Electronics",
    commission: 45,
    stats: {
      totalClicks: 0,
      totalConversions: 0
    }
  }
]

async function setupDatabase() {
  try {
    console.log('🚀 Initialiserar databas...')
    
    const db = await getDatabase()
    
    // 1. Skapa products collection med sample data
    console.log('📦 Skapar produkter...')
    const productsCollection = db.collection(COLLECTIONS.PRODUCTS)
    
    // Rensa befintliga produkter (valfritt)
    await productsCollection.deleteMany({})
    
    // Lägg till sample produkter
    const productResult = await productsCollection.insertMany(sampleProducts)
    console.log(`✅ ${productResult.insertedCount} produkter skapade`)
    
    // 2. Skapa indexes för bättre prestanda
    console.log('🔍 Skapar databas-index...')
    
    // Clicks collection indexes
    const clicksCollection = db.collection(COLLECTIONS.CLICKS)
    await clicksCollection.createIndex({ timestamp: -1 })
    await clicksCollection.createIndex({ productId: 1 })
    await clicksCollection.createIndex({ platform: 1 })
    await clicksCollection.createIndex({ userId: 1 })
    
    // Products collection indexes  
    await productsCollection.createIndex({ platform: 1 })
    await productsCollection.createIndex({ category: 1 })
    await productsCollection.createIndex({ 'stats.totalClicks': -1 })
    
    console.log('✅ Index skapade')
    
    // 3. Skapa sample click data för testning
    console.log('👆 Skapar sample click data...')
    
    const productIds = Object.values(productResult.insertedIds)
    const sampleClicks = []
    
    // Skapa några sample klick för de senaste 7 dagarna
    for (let i = 0; i < 50; i++) {
      const randomProductId = productIds[Math.floor(Math.random() * productIds.length)]
      const randomDaysAgo = Math.floor(Math.random() * 7)
      const clickDate = new Date()
      clickDate.setDate(clickDate.getDate() - randomDaysAgo)
      
      sampleClicks.push({
        productId: String(randomProductId),
        platform: Math.random() > 0.5 ? 'amazon' : 'aliexpress',
        timestamp: clickDate,
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: 'Mozilla/5.0 (sample)',
        sessionId: `session_${i}`,
        converted: Math.random() > 0.85, // 15% conversion rate
        commissionEarned: Math.random() > 0.85 ? Math.floor(Math.random() * 100) + 10 : 0,
        referrer: Math.random() > 0.5 ? 'google.com' : 'direct',
        metadata: {
          source: 'web',
          browserLanguage: 'sv-SE'
        }
      })
    }
    
    const clickResult = await clicksCollection.insertMany(sampleClicks)
    console.log(`✅ ${clickResult.insertedCount} sample klick skapade`)
    
    // 4. Uppdatera produkt-statistik baserat på klick
    console.log('📊 Uppdaterar produkt-statistik...')
    
    for (const productId of productIds) {
      const productClicks = await clicksCollection.countDocuments({ 
        productId: productId.toString() 
      })
      const productConversions = await clicksCollection.countDocuments({ 
        productId: productId.toString(),
        converted: true 
      })
      
      await productsCollection.updateOne(
        { _id: productId },
        { 
          $set: { 
            'stats.totalClicks': productClicks,
            'stats.totalConversions': productConversions,
            'stats.lastClickedAt': new Date()
          }
        }
      )
    }
    
    console.log('✅ Produkt-statistik uppdaterad')
    
    console.log('\n🎉 Databas-setup komplett!')
    console.log('📝 Du kan nu:')
    console.log('   - Testa admin-dashboard (/admin)')
    console.log('   - Se analytics data (/api/analytics)')
    console.log('   - Klicka på produkter för click tracking')
    console.log('   - Övervaka klick i real-tid (/api/clicks)')
    
  } catch (error) {
    console.error('❌ Fel vid databas-setup:', error)
  }
}

// Kör setup om filen körs direkt
if (require.main === module) {
  setupDatabase().then(() => {
    console.log('✨ Setup klar, avslutar...')
    process.exit(0)
  }).catch((error) => {
    console.error('💥 Setup misslyckades:', error)
    process.exit(1)
  })
}

export { setupDatabase, sampleProducts }
