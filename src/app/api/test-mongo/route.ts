import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    // Kontrollera miljövariabler
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      return NextResponse.json({
        success: false,
        error: 'MONGODB_URI miljövariabel saknas',
        debug: {
          hasMongoUri: false,
          nodeEnv: process.env.NODE_ENV,
          vercelEnv: process.env.VERCEL_ENV
        }
      }, { status: 500 });
    }

    // Försök bara ansluta utan att göra något
    const { MongoClient } = await import('mongodb');
    const client = new MongoClient(mongoUri);
    
    await client.connect();
    await client.close();

    return NextResponse.json({
      success: true,
      message: 'MongoDB anslutning fungerar!',
      debug: {
        hasMongoUri: true,
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Okänt fel',
      debug: {
        errorType: error?.constructor?.name,
        stack: error instanceof Error ? error.stack : 'No stack'
      }
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Kontrollera miljövariabler
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      return NextResponse.json({
        success: false,
        error: 'MONGODB_URI miljövariabel saknas',
        debug: {
          hasMongoUri: false,
          nodeEnv: process.env.NODE_ENV,
          vercelEnv: process.env.VERCEL_ENV
        }
      }, { status: 500 });
    }

    // Försök bara ansluta utan att göra något
    const { MongoClient } = await import('mongodb');
    const client = new MongoClient(mongoUri);
    
    await client.connect();
    await client.close();

    return NextResponse.json({
      success: true,
      message: 'MongoDB anslutning fungerar!',
      debug: {
        hasMongoUri: true,
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Okänt fel',
      debug: {
        errorType: error?.constructor?.name,
        stack: error instanceof Error ? error.stack?.substring(0, 500) : 'No stack'
      }
    }, { status: 500 });
  }
}
