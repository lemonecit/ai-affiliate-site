import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('=== FETCHING PRODUCTS FOR PUBLIC DISPLAY ===');
    
    const { connectToDatabase, COLLECTIONS } = await import('../../../lib/mongodb-runtime');
    
    console.log('Connecting to database...');
    const { db } = await connectToDatabase();
    console.log('Connected to database successfully');
    
    // First, check if we have any products at all
    const totalCount = await db.collection(COLLECTIONS.PRODUCTS).countDocuments();
    console.log(`Total products in database: ${totalCount}`);
    
    if (totalCount === 0) {
      console.log('No products found in database - returning empty result');
      return NextResponse.json({
        success: true,
        message: 'Inga produkter tillgängliga. Kör "Uppdatera Produkter" i admin först.',
        data: {
          products: [],
          total: 0,
          categories: ['All'],
          platforms: ['All']
        }
      });
    }
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const category = searchParams.get('category');
    const platform = searchParams.get('platform');
    const trending = searchParams.get('trending');
    
    // Build query
    let query: any = {};
    if (category && category !== 'All') {
      query.category = category;
    }
    if (platform && platform !== 'All') {
      query.platform = platform;
    }
    if (trending === 'true') {
      query.trending = true;
    }
    
    console.log('Query:', query);
    
    // Get products from database
    const products = await db.collection(COLLECTIONS.PRODUCTS)
      .find(query)
      .limit(limit)
      .sort({ createdAt: -1 })
      .toArray();
    
    console.log(`Found ${products.length} products`);
    
    // Transform products for frontend
    const transformedProducts = products.map(product => ({
      id: product._id.toString(),
      title: product.title,
      category: product.category,
      price: product.price, // Return as number
      originalPrice: product.originalPrice || undefined, // Return as number
      discount: product.originalPrice ? 
        `${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%` : 
        undefined,
      affiliateUrl: product.affiliateUrl,
      platform: product.platform,
      source: product.platform,
      trending: product.trending || false,
      keywords: product.title.toLowerCase().split(' ').filter((word: string) => word.length > 3),
      buttonText: product.platform === 'amazon' ? 'Köp på Amazon' : 'Köp på AliExpress',
      disclaimer: `Som Amazon/AliExpress affiliate tjänar vi provision på kvalificerade köp.`,
      commission: product.commission || undefined, // Return as number
      imageUrl: product.imageUrl,
      description: product.description,
      aiScore: product.aiScore,
      stats: product.stats || { totalClicks: 0, lastClicked: null }
    }));
    
    // Get available categories and platforms
    const categories = Array.from(new Set(products.map(p => p.category)));
    const platforms = Array.from(new Set(products.map(p => p.platform)));
    
    return NextResponse.json({
      success: true,
      data: {
        products: transformedProducts,
        total: products.length,
        categories: ['All', ...categories],
        platforms: ['All', ...platforms]
      }
    });
    
  } catch (error) {
    console.error('=== PRODUCTS API ERROR ===');
    console.error('Error details:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack');
    
    return NextResponse.json({
      success: false,
      error: 'Kunde inte hämta produkter från databasen',
      details: error instanceof Error ? error.message : 'Unknown error',
      debug: {
        mongoUri: !!process.env.MONGODB_URI,
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV
      }
    }, { status: 500 });
  }
}
