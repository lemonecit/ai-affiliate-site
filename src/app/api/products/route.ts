import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching products for public display...');
    
    const { connectToDatabase, COLLECTIONS } = await import('../../../lib/mongodb-runtime');
    const { db } = await connectToDatabase();
    
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
      price: `${product.price} kr`,
      originalPrice: product.originalPrice ? `${product.originalPrice} kr` : undefined,
      discount: product.originalPrice ? 
        `${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF` : 
        undefined,
      affiliateUrl: product.affiliateUrl,
      platform: product.platform,
      source: product.platform,
      trending: product.trending || false,
      keywords: product.title.toLowerCase().split(' ').filter((word: string) => word.length > 3),
      buttonText: product.platform === 'amazon' ? 'Köp på Amazon' : 'Köp på AliExpress',
      disclaimer: `Som Amazon/AliExpress affiliate tjänar vi provision på kvalificerade köp.`,
      commission: product.commission ? `${product.commission} kr` : undefined,
      imageUrl: product.imageUrl,
      description: product.description,
      aiScore: product.aiScore
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
    console.error('Error fetching products:', error);
    return NextResponse.json({
      success: false,
      error: 'Kunde inte hämta produkter',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
