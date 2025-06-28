import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    // Import MongoDB functions at runtime, not build-time
    const { connectToDatabase, COLLECTIONS } = await import('../../../../lib/mongodb-runtime');
    
    const { db } = await connectToDatabase();
    
    // Clear existing data
    await db.collection(COLLECTIONS.PRODUCTS).deleteMany({});
    await db.collection(COLLECTIONS.CLICKS).deleteMany({});
    
    // Insert sample products
    const sampleProducts = [
      {
        _id: '685fff5dc594bff072f3931b',
        title: 'Gaming Laptop Pro',
        price: 899.99,
        originalPrice: 1199.99,
        platform: 'amazon',
        category: 'Electronics',
        rating: 4.5,
        affiliate_url: 'https://amazon.com/gaming-laptop',
        image: 'https://images-na.ssl-images-amazon.com/laptop.jpg'
      },
      {
        _id: '685fff5dc594bff072f39318',
        title: 'Wireless Headphones',
        price: 79.99,
        originalPrice: 129.99,
        platform: 'amazon',
        category: 'Electronics', 
        rating: 4.2,
        affiliate_url: 'https://amazon.com/headphones',
        image: 'https://images-na.ssl-images-amazon.com/headphones.jpg'
      },
      {
        _id: '685fff5dc594bff072f39319',
        title: 'Smart Watch',
        price: 199.99,
        originalPrice: 299.99,
        platform: 'aliexpress',
        category: 'Electronics',
        rating: 4.0,
        affiliate_url: 'https://aliexpress.com/smartwatch',
        image: 'https://ae01.alicdn.com/smartwatch.jpg'
      },
      {
        _id: '685fff5dc594bff072f3931a',
        title: 'Bluetooth Speaker',
        price: 49.99,
        originalPrice: 89.99,
        platform: 'amazon',
        category: 'Electronics',
        rating: 4.3,
        affiliate_url: 'https://amazon.com/speaker',
        image: 'https://images-na.ssl-images-amazon.com/speaker.jpg'
      },
      {
        _id: '685fff5dc594bff072f3931c',
        title: 'Phone Case',
        price: 15.99,
        originalPrice: 29.99,
        platform: 'aliexpress',
        category: 'Accessories',
        rating: 3.8,
        affiliate_url: 'https://aliexpress.com/phonecase',
        image: 'https://ae01.alicdn.com/phonecase.jpg'
      }
    ];
    
    await db.collection(COLLECTIONS.PRODUCTS).insertMany(sampleProducts as any);
    
    // Insert sample clicks
    const sampleClicks = [];
    const platforms = ['amazon', 'aliexpress'];
    const productIds = sampleProducts.map(p => p._id);
    
    for (let i = 0; i < 50; i++) {
      const clickDate = new Date();
      clickDate.setDate(clickDate.getDate() - Math.floor(Math.random() * 30));
      
      sampleClicks.push({
        productId: productIds[Math.floor(Math.random() * productIds.length)],
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        source: 'website',
        timestamp: clickDate,
        userId: `user_${Math.floor(Math.random() * 20)}`,
        userIp: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: 'Mozilla/5.0 (Sample)',
        converted: Math.random() > 0.8, // 20% conversion rate
        commissionEarned: Math.random() > 0.8 ? Math.floor(Math.random() * 50) + 10 : 0
      });
    }
    
    await db.collection(COLLECTIONS.CLICKS).insertMany(sampleClicks as any);
    
    // Create indexes
    await db.collection(COLLECTIONS.CLICKS).createIndex({ productId: 1 });
    await db.collection(COLLECTIONS.CLICKS).createIndex({ timestamp: -1 });
    await db.collection(COLLECTIONS.CLICKS).createIndex({ platform: 1 });
    await db.collection(COLLECTIONS.PRODUCTS).createIndex({ platform: 1 });
    await db.collection(COLLECTIONS.PRODUCTS).createIndex({ category: 1 });
    
    return NextResponse.json({
      success: true,
      message: 'Databas initialiserad framgångsrikt!',
      data: {
        products: sampleProducts.length,
        clicks: sampleClicks.length,
        indexes: 5
      }
    });
  } catch (error) {
    console.error('Setup database error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Databasinitialisering misslyckades',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
