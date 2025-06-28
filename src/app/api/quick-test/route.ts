import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const hasMongoUri = !!process.env.MONGODB_URI;
  
  return NextResponse.json({
    success: hasMongoUri,
    message: hasMongoUri ? 'MongoDB URI finns!' : 'MongoDB URI saknas!',
    environment: {
      hasMongoUri,
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
      timestamp: new Date().toISOString()
    }
  });
}

export async function POST() {
  return NextResponse.json({ redirect: 'Use GET instead' });
}
