
import { NextResponse } from 'next/server';
import { connectToDatabase, COLLECTIONS } from '../../../lib/mongodb-runtime';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const trends = await db.collection(COLLECTIONS.AI_INSIGHTS).find({}).sort({ calculatedAt: -1 }).limit(1).toArray();
    
    if (trends.length === 0) {
      return NextResponse.json({ success: true, data: { trendingKeywords: [], trendingCategories: [] } });
    }

    return NextResponse.json({ success: true, data: trends[0] });
  } catch (error) {
    console.error('Error fetching trends:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trends' },
      { status: 500 }
    );
  }
}
