import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering - prevent static generation at build time
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// ...existing code...