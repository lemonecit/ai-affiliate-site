import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    console.log('Starting real trends analysis...');
    
    // Import MongoDB functions at runtime, not build-time
    const { connectToDatabase, COLLECTIONS } = await import('../../../../lib/mongodb-runtime');
    const { db } = await connectToDatabase();
    
    // Analyze clicks from the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Get product clicks with product details
    const clicksWithProducts = await db.collection(COLLECTIONS.CLICKS).aggregate([
      { $match: { timestamp: { $gte: thirtyDaysAgo } } },
      {
        $lookup: {
          from: COLLECTIONS.PRODUCTS,
          localField: 'productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$productId',
          title: { $first: '$product.title' },
          category: { $first: '$product.category' },
          clicks: { $sum: 1 }
        }
      },
      { $sort: { clicks: -1 } }
    ]).toArray();
    
    // Extract trending keywords from product titles
    const trendingKeywords: Array<{keyword: string, count: number}> = [];
    const categoryCount: Record<string, number> = {};
    
    for (const item of clicksWithProducts) {
      // Extract keywords from product titles
      const words = item.title.toLowerCase()
        .split(/[^a-zA-Z0-9]/)
        .filter((word: string) => word.length > 3)
        .filter((word: string) => !['with', 'and', 'the', 'for', 'pro'].includes(word));
      
      words.forEach((word: string) => {
        const existing = trendingKeywords.find(k => k.keyword === word);
        if (existing) {
          existing.count += item.clicks;
        } else {
          trendingKeywords.push({ keyword: word, count: item.clicks });
        }
      });
      
      // Count categories
      if (categoryCount[item.category]) {
        categoryCount[item.category] += item.clicks;
      } else {
        categoryCount[item.category] = item.clicks;
      }
    }
    
    // Sort and get top results
    const topKeywords = trendingKeywords
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map(k => k.keyword);
    
    const topCategories = Object.entries(categoryCount)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([category]) => category);
    
    // Save trends to database
    const trendData = {
      trendingKeywords: topKeywords,
      trendingCategories: topCategories,
      calculatedAt: new Date().toISOString(),
      analysisRange: '30 days',
      totalClicks: clicksWithProducts.reduce((sum, item) => sum + item.clicks, 0)
    };
    
    // Remove old trends and insert new one
    await db.collection(COLLECTIONS.AI_INSIGHTS).deleteMany({});
    await db.collection(COLLECTIONS.AI_INSIGHTS).insertOne(trendData);
    
    console.log('Trends analysis completed:', trendData);
    
    return NextResponse.json({ 
      success: true, 
      message: `Trends-analys slutförd! Analyserade ${clicksWithProducts.length} produkter`,
      data: trendData
    });
    
  } catch (error) {
    console.error('Error running trends analysis:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Kunde inte köra trends-analys',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
