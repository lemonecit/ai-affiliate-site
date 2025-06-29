import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Sample AI-curated product categories that are trending
const AI_TRENDING_CATEGORIES = [
  'wireless headphones',
  'smart home devices', 
  'gaming accessories',
  'fitness trackers',
  'phone accessories',
  'led lighting',
  'kitchen gadgets',
  'tech accessories'
];

export async function POST() {
  console.log('=== UPDATING PRODUCTS WITH AI RECOMMENDATIONS ===');
  
  try {
    const { connectToDatabase, COLLECTIONS } = await import('../../../../lib/mongodb-runtime');
    const { db } = await connectToDatabase();
    
    // Clear existing products
    await db.collection(COLLECTIONS.PRODUCTS).deleteMany({});
    console.log('Cleared existing products');
    
    // Generate AI-curated sample products (until we implement real APIs)
    const aiCuratedProducts = [
      {
        title: 'Sony WH-1000XM4 Wireless Noise Canceling Headphones',
        price: 2499,
        originalPrice: 3499,
        platform: 'amazon',
        category: 'Electronics',
        affiliateUrl: 'https://amazon.com/dp/B0863TXGM3?tag=lemonec-20',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        description: 'Industry-leading noise canceling with Dual Noise Sensor technology',
        commission: 124.95,
        aiScore: 9.2,
        trending: true,
        createdAt: new Date()
      },
      {
        title: 'Apple AirPods Pro (2nd generation)',
        price: 1899,
        originalPrice: 2299,
        platform: 'amazon', 
        category: 'Electronics',
        affiliateUrl: 'https://amazon.com/dp/B0BDHWDR12?tag=lemonec-20',
        imageUrl: 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=400',
        description: 'Active Noise Cancellation, Adaptive Transparency, Spatial Audio',
        commission: 94.95,
        aiScore: 9.5,
        trending: true,
        createdAt: new Date()
      },
      {
        title: 'Echo Dot (5th Gen) Smart Speaker with Alexa',
        price: 399,
        originalPrice: 599,
        platform: 'amazon',
        category: 'Smart Home',
        affiliateUrl: 'https://amazon.com/dp/B09B8V1LZ3?tag=lemonec-20',
        imageUrl: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=400',
        description: 'Our best sounding Echo Dot yet - Smart speaker with Alexa',
        commission: 19.95,
        aiScore: 8.8,
        trending: true,
        createdAt: new Date()
      },
      {
        title: 'Logitech MX Master 3 Advanced Wireless Mouse',
        price: 899,
        originalPrice: 1199,
        platform: 'amazon',
        category: 'Electronics',
        affiliateUrl: 'https://amazon.com/dp/B07S395RWD?tag=lemonec-20',
        imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
        description: 'Advanced wireless mouse with ultra-fast scrolling',
        commission: 44.95,
        aiScore: 9.0,
        trending: false,
        createdAt: new Date()
      },
      {
        title: 'RGB LED Strip Lights 16.4ft Smart WiFi',
        price: 299,
        originalPrice: 499,
        platform: 'aliexpress',
        category: 'Smart Home',
        affiliateUrl: 'https://s.click.aliexpress.com/e/_DCxkWz1',
        imageUrl: 'https://images.unsplash.com/photo-1558618047-dd5ee3b2ad99?w=400',
        description: 'Smart WiFi LED strips with app control and voice commands',
        commission: 14.95,
        aiScore: 8.5,
        trending: true,
        createdAt: new Date()
      },
      {
        title: 'Anker PowerCore 10000 Portable Charger',
        price: 249,
        originalPrice: 349,
        platform: 'amazon',
        category: 'Electronics',
        affiliateUrl: 'https://amazon.com/dp/B019GJLER8?tag=lemonec-20',
        imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400',
        description: 'Ultra-compact 10000mAh portable charger with PowerIQ',
        commission: 12.45,
        aiScore: 8.7,
        trending: false,
        createdAt: new Date()
      }
    ];
    
    // Insert AI-curated products
    const result = await db.collection(COLLECTIONS.PRODUCTS).insertMany(aiCuratedProducts);
    console.log(`Inserted ${result.insertedCount} AI-curated products`);
    
    // Create some realistic click data for trends analysis
    const clickData = [];
    for (let i = 0; i < 50; i++) {
      const randomProduct = aiCuratedProducts[Math.floor(Math.random() * aiCuratedProducts.length)];
      const randomDaysAgo = Math.floor(Math.random() * 30);
      const clickDate = new Date();
      clickDate.setDate(clickDate.getDate() - randomDaysAgo);
      
      clickData.push({
        productId: randomProduct.title, // Use title as ID for now
        platform: randomProduct.platform,
        timestamp: clickDate,
        converted: Math.random() > 0.85, // 15% conversion rate
        commissionEarned: Math.random() > 0.85 ? randomProduct.commission : 0,
        userAgent: 'Mozilla/5.0 (simulated)',
        ipAddress: '192.168.1.' + Math.floor(Math.random() * 255)
      });
    }
    
    // Insert click data
    await db.collection(COLLECTIONS.CLICKS).insertMany(clickData);
    console.log(`Inserted ${clickData.length} click records for analytics`);
    
    return NextResponse.json({
      success: true,
      message: `AI har uppdaterat produktkatalogen! ${result.insertedCount} produkter tillagda`,
      data: {
        products: result.insertedCount,
        clicks: clickData.length,
        categories: Array.from(new Set(aiCuratedProducts.map(p => p.category))),
        platforms: ['amazon', 'aliexpress'],
        aiCurated: true
      }
    });
    
  } catch (error) {
    console.error('PRODUCT UPDATE ERROR:', error);
    return NextResponse.json({
      success: false,
      error: 'Kunde inte uppdatera produkter',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
