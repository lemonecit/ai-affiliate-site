import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  console.log('=== FINAL SETUP START ===');
  
  try {
    const mongoUri = process.env.MONGODB_URI;
    console.log('MongoDB URI exists:', !!mongoUri);
    
    if (!mongoUri) {
      console.log('ERROR: No MongoDB URI');
      return NextResponse.json({
        success: false,
        error: 'MongoDB URI saknas i Vercel environment variables'
      }, { status: 500 });
    }

    const { MongoClient } = await import('mongodb');
    console.log('MongoDB client imported');
    
    const client = new MongoClient(mongoUri);
    console.log('Client created, connecting...');
    
    await client.connect();
    console.log('Connected successfully!');
    
    const db = client.db('affiliate-store');
    
    // Clear and add minimal data
    await db.collection('products').deleteMany({});
    await db.collection('clicks').deleteMany({});
    console.log('Collections cleared');
    
    const testProduct = {
      title: 'Test Product',
      price: 99.99,
      platform: 'amazon',
      category: 'Electronics',
      createdAt: new Date()
    };
    
    const testClick = {
      productId: 'test-123',
      platform: 'amazon',
      timestamp: new Date(),
      converted: true,
      commissionEarned: 10
    };
    
    await db.collection('products').insertOne(testProduct);
    await db.collection('clicks').insertOne(testClick);
    console.log('Test data inserted');
    
    await client.close();
    console.log('Connection closed');
    
    return NextResponse.json({
      success: true,
      message: 'SLUTLIGEN! Databas fungerar nu!',
      data: { products: 1, clicks: 1 }
    });
    
  } catch (error) {
    console.error('FINAL ERROR:', error);
    return NextResponse.json({
      success: false,
      error: 'Fel: ' + (error instanceof Error ? error.message : String(error)),
      stack: error instanceof Error ? error.stack?.substring(0, 300) : 'No stack'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'Ready for POST',
    mongoUri: !!process.env.MONGODB_URI
  });
}
