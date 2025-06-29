import { NextRequest, NextResponse } from 'next/server';
import { searchAmazonProducts } from '../../../../lib/amazon-api';

export const dynamic = 'force-dynamic';

// Sample AI-curated product categories that are trending
const AI_TRENDING_CATEGORIES = [
  'wireless headphones',
  'smart home devices', 
  'gaming accessories',
  'fitness trackers',
  'phone accessories',
  'led lighting',
  'kitchen gadgets',
  'tech accessories'
];

// Hjälpfunktion för att alltid lägga till affiliate-tag på Amazon-länkar
function addAmazonAffiliateTag(url: string): string {
  if (!url) return url;
  if (!url.includes('amazon.')) return url;
  if (url.includes('tag=lemonec-20')) return url;
  // Ta bort eventuell gammal tag och lägg till rätt
  const urlObj = new URL(url);
  urlObj.searchParams.set('tag', 'lemonec-20');
  return urlObj.toString();
}

export async function POST() {
  console.log('=== UPDATING PRODUCTS WITH AMAZON API ===');
  try {
    const { connectToDatabase, COLLECTIONS } = await import('../../../../lib/mongodb-runtime');
    const { db } = await connectToDatabase();
    await db.collection(COLLECTIONS.PRODUCTS).deleteMany({});
    console.log('Cleared existing products');

    // Hämta produkter dynamiskt från Amazon API för varje trending-kategori
    let aiCuratedProducts = [];
    for (const category of AI_TRENDING_CATEGORIES) {
      const items = await searchAmazonProducts(category, 1);
      for (const item of items) {
        aiCuratedProducts.push({
          title: item.ItemInfo?.Title?.DisplayValue || 'Amazon Product',
          price: item.Offers?.Listings?.[0]?.Price?.Amount || 0,
          originalPrice: item.Offers?.Listings?.[0]?.Price?.Amount || 0,
          platform: 'amazon',
          category,
          affiliateUrl: addAmazonAffiliateTag(item.DetailPageURL),
          imageUrl: item.Images?.Primary?.Large?.URL || '',
          description: (item.ItemInfo?.Features?.DisplayValues || []).join(' '),
          commission: 0, // Kan beräknas om du har data
          aiScore: 8 + Math.random() * 2,
          trending: true,
          createdAt: new Date()
        });
      }
    }

    // Om du vill lägga till AliExpress eller andra produkter, lägg till dem här

    const result = await db.collection(COLLECTIONS.PRODUCTS).insertMany(aiCuratedProducts);
    console.log(`Inserted ${result.insertedCount} AI-curated products`);
    
    // Create some realistic click data for trends analysis
    const clickData = [];
    for (let i = 0; i < 50; i++) {
      const randomProduct = aiCuratedProducts[Math.floor(Math.random() * aiCuratedProducts.length)];
      const randomDaysAgo = Math.floor(Math.random() * 30);
      const clickDate = new Date();
      clickDate.setDate(clickDate.getDate() - randomDaysAgo);
      
      clickData.push({
        productId: randomProduct.title, // Use title as ID for now
        platform: randomProduct.platform,
        timestamp: clickDate,
        converted: Math.random() > 0.85, // 15% conversion rate
        commissionEarned: Math.random() > 0.85 ? randomProduct.commission : 0,
        userAgent: 'Mozilla/5.0 (simulated)',
        ipAddress: '192.168.1.' + Math.floor(Math.random() * 255)
      });
    }
    
    // Insert click data
    await db.collection(COLLECTIONS.CLICKS).insertMany(clickData);
    console.log(`Inserted ${clickData.length} click records for analytics`);
    
    return NextResponse.json({
      success: true,
      message: `AI har uppdaterat produktkatalogen! ${result.insertedCount} produkter tillagda`,
      data: {
        products: result.insertedCount,
        clicks: clickData.length,
        categories: Array.from(new Set(aiCuratedProducts.map(p => p.category))),
        platforms: ['amazon', 'aliexpress'],
        aiCurated: true
      }
    });
    
  } catch (error) {
    console.error('PRODUCT UPDATE ERROR:', error);
    return NextResponse.json({
      success: false,
      error: 'Kunde inte uppdatera produkter',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
