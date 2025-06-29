import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('Fetching trends data...');
    
    // Import MongoDB functions at runtime
    const { connectToDatabase, COLLECTIONS } = await import('../../../lib/mongodb-runtime');
    const { db } = await connectToDatabase();
    
    // Get the latest trends data
    const latestTrends = await db.collection(COLLECTIONS.AI_INSIGHTS)
      .findOne({}, { sort: { calculatedAt: -1 } });
    
    if (!latestTrends) {
      console.log('No trends data found');
      return NextResponse.json({
        success: false,
        message: 'Ingen trenddata tillgänglig. Kör en trends-analys först.',
        data: null
      });
    }
    
    console.log('Found trends data:', latestTrends);
    
    return NextResponse.json({
      success: true,
      message: 'Trenddata hämtad framgångsrikt',
      data: {
        trendingKeywords: latestTrends.trendingKeywords || [],
        trendingCategories: latestTrends.trendingCategories || [],
        calculatedAt: latestTrends.calculatedAt || new Date().toISOString(),
        analysisRange: latestTrends.analysisRange || '30 days',
        totalClicks: latestTrends.totalClicks || 0
      }
    });
    
  } catch (error) {
    console.error('Error fetching trends:', error);
    return NextResponse.json({
      success: false,
      error: 'Kunde inte hämta trenddata',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
