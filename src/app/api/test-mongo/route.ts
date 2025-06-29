import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  console.log('=== MONGODB TEST START ===');
  
  try {
    const mongoUri = process.env.MONGODB_URI;
    console.log('MongoDB URI exists:', !!mongoUri);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('VERCEL_ENV:', process.env.VERCEL_ENV);
    
    if (!mongoUri) {
      console.log('ERROR: No MongoDB URI found');
      return NextResponse.json({
        success: false,
        error: 'MongoDB URI saknas i environment variables',
        debug: {
          nodeEnv: process.env.NODE_ENV,
          vercelEnv: process.env.VERCEL_ENV,
          hasUri: false
        }
      }, { status: 500 });
    }

    const { MongoClient } = await import('mongodb');
    console.log('MongoDB client imported successfully');
    
    const client = new MongoClient(mongoUri);
    console.log('Client created, attempting connection...');
    
    // Test connection with timeout
    await client.connect();
    console.log('Connected to MongoDB successfully!');
    
    // Test database access
    const db = client.db('affiliate-store');
    const collections = await db.listCollections().toArray();
    console.log('Collections found:', collections.length);
    
    // Test basic operation
    const testCollection = db.collection('test');
    const testDoc = { test: true, timestamp: new Date() };
    await testCollection.insertOne(testDoc);
    console.log('Test document inserted');
    
    // Clean up test document
    await testCollection.deleteOne({ test: true });
    console.log('Test document removed');
    
    await client.close();
    console.log('Connection closed successfully');
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection test successful!',
      debug: {
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV,
        collectionsCount: collections.length,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('MONGODB TEST ERROR:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack?.substring(0, 500) : 'No stack trace',
      debug: {
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV,
        hasUri: !!process.env.MONGODB_URI
      }
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'MongoDB test endpoint ready',
    method: 'Use POST to test connection',
    mongoUri: !!process.env.MONGODB_URI
  });
}
