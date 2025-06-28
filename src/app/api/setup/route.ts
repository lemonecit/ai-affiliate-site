import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      return NextResponse.json({
        success: false,
        error: 'MongoDB URI saknas'
      }, { status: 500 });
    }

    const { MongoClient } = await import('mongodb');
    const client = new MongoClient(mongoUri);
    
    await client.connect();
    const db = client.db('affiliate-store');
    
    await db.collection('products').deleteMany({});
    await db.collection('clicks').deleteMany({});
    
    const product = {
      title: 'Gaming Laptop',
      price: 899.99,
      platform: 'amazon',
      category: 'Electronics'
    };
    
    const click = {
      productId: 'test-1',
      platform: 'amazon',
      timestamp: new Date(),
      converted: true
    };
    
    await db.collection('products').insertOne(product);
    await db.collection('clicks').insertOne(click);
    await client.close();
    
    return NextResponse.json({
      success: true,
      message: 'Databas initialiserad!',
      data: { products: 1, clicks: 1 }
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Okänt fel'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ready' });
}

// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    console.log('=== SETUP DATABASE START ===');
    
    // Check environment first
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI missing');
      return NextResponse.json(
        { 
          success: false, 
          error: 'MONGODB_URI miljövariabel saknas - kontrollera Vercel environment variables',
          details: 'Environment variable MONGODB_URI not found'
        },
        { status: 500 }
      );
    }
    
    console.log('MONGODB_URI found, attempting connection...');
    
    // Direct MongoDB connection without abstractions
    const { MongoClient } = await import('mongodb');
    const client = new MongoClient(process.env.MONGODB_URI);
    
    try {
      await client.connect();
      console.log('MongoDB connection successful');
      
      const db = client.db('affiliate-store');
      
      // Simple cleanup and insert
      await db.collection('products').deleteMany({});
      await db.collection('clicks').deleteMany({});
      console.log('Collections cleared');
      
      const sampleData = [
        { title: 'Test Product', price: 99.99, platform: 'amazon' }
      ];
      
      await db.collection('products').insertMany(sampleData);
      console.log('Sample data inserted');
      
      return NextResponse.json({
        success: true,
        message: 'Databas initialiserad framgångsrikt!',
        data: { products: 1, message: 'Setup completed successfully' }
      });
      
    } finally {
      await client.close();
      console.log('MongoDB connection closed');
    }
    
  } catch (error) {
    console.error('=== SETUP ERROR ===', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Databasfel: ' + (error instanceof Error ? error.message : 'Okänt fel'),
        details: error instanceof Error ? error.stack?.substring(0, 500) : 'No details'
      },
      { status: 500 }
    );
  }
}
    
    console.log('Clearing existing data...');
    // Clear existing data
    await db.collection(COLLECTIONS.PRODUCTS).deleteMany({});
    await db.collection(COLLECTIONS.CLICKS).deleteMany({});
    console.log('Existing data cleared');
    
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
    
    console.log('Inserting sample products...');
    await db.collection(COLLECTIONS.PRODUCTS).insertMany(sampleProducts as any);
    console.log(`${sampleProducts.length} products inserted`);
    
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
    
    console.log('Inserting sample clicks...');
    await db.collection(COLLECTIONS.CLICKS).insertMany(sampleClicks as any);
    console.log(`${sampleClicks.length} clicks inserted`);
    
    // Create indexes
    console.log('Creating indexes...');
    await db.collection(COLLECTIONS.CLICKS).createIndex({ productId: 1 });
    await db.collection(COLLECTIONS.CLICKS).createIndex({ timestamp: -1 });
    await db.collection(COLLECTIONS.CLICKS).createIndex({ platform: 1 });
    await db.collection(COLLECTIONS.PRODUCTS).createIndex({ platform: 1 });
    await db.collection(COLLECTIONS.PRODUCTS).createIndex({ category: 1 });
    console.log('Indexes created successfully');
    
    console.log('Database setup completed successfully');
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
