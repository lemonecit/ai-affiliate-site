import { NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'API is working',
    timestamp: new Date().toISOString(),
    environment: {
      hasMongoUri: !!process.env.MONGODB_URI,
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV
    }
  });
}

export async function POST() {
  return NextResponse.json({
    success: true,
    message: 'POST API is working',
    timestamp: new Date().toISOString(),
    environment: {
      hasMongoUri: !!process.env.MONGODB_URI,
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV
    }
  });
}
