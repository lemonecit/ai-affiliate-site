import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function POST() {
  let client: MongoClient | null = null;
  
  try {
    // Enkel MongoDB-anslutning
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      return NextResponse.json({ 
        success: false, 
        error: 'MongoDB URI saknas' 
      }, { status: 500 });
    }

    client = new MongoClient(uri);
    await client.connect();
    const db = client.db('affiliate-store');

    // Rensa och skapa sample data
    await db.collection('products').deleteMany({});
    await db.collection('clicks').deleteMany({});

    const products = [
      {
        title: 'Gaming Laptop',
        price: 899.99,
        platform: 'amazon',
        category: 'Electronics'
      },
      {
        title: 'Wireless Headphones', 
        price: 79.99,
        platform: 'amazon',
        category: 'Electronics'
      }
    ];

    const clicks = [
      {
        productId: 'test-1',
        platform: 'amazon',
        timestamp: new Date(),
        converted: true
      }
    ];

    await db.collection('products').insertMany(products);
    await db.collection('clicks').insertMany(clicks);

    return NextResponse.json({
      success: true,
      message: 'Databas konfigurerad!',
      data: { products: products.length, clicks: clicks.length }
    });

  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Databasfel: ' + (error instanceof Error ? error.message : 'Okänt fel')
    }, { status: 500 });
  } finally {
    if (client) {
      await client.close();
    }
  }
}

export async function GET() {
  return NextResponse.json({ message: 'POST required' }, { status: 405 });
}
