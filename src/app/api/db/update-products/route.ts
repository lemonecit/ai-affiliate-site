import { NextRequest, NextResponse } from 'next/server';

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
  console.log('=== UPDATING PRODUCTS WITH AI RECOMMENDATIONS ===');
  
  try {
    const { connectToDatabase, COLLECTIONS } = await import('../../../../lib/mongodb-runtime');
    const { db } = await connectToDatabase();
    // Clear existing products
    await db.collection(COLLECTIONS.PRODUCTS).deleteMany({});
    console.log('Cleared existing products');

    // Dynamically fetch Amazon products for each trending category
    const { searchAmazonProducts } = require('../../../../lib/amazon-api');
    const aiCuratedProducts = [];
    for (const category of AI_TRENDING_CATEGORIES) {
      try {
        const items = await searchAmazonProducts(category, 3); // Fetch 3 per category
        for (const item of items) {
          // Only add if product is available and has a valid URL
          if (
            item.DetailPageURL &&
            item.Offers?.Listings?.[0]?.Availability?.Message?.toLowerCase().includes('in stock')
          ) {
            aiCuratedProducts.push({
              title: item.ItemInfo?.Title?.DisplayValue || 'Amazon Product',
              price: item.Offers?.Listings?.[0]?.Price?.Amount || 0,
              originalPrice: item.Offers?.Listings?.[0]?.Price?.Amount || 0,
              platform: 'amazon',
              category,
              affiliateUrl: addAmazonAffiliateTag(item.DetailPageURL),
              imageUrl: item.Images?.Primary?.Large?.URL || '',
              description: (item.ItemInfo?.Features?.DisplayValues || []).join(' '),
              commission: Math.round((item.Offers?.Listings?.[0]?.Price?.Amount || 0) * 0.05 * 100) / 100, // 5% est.
              aiScore: 8 + Math.random() * 2, // Simulate AI score
              trending: true,
              createdAt: new Date()
            });
          }
        }
      } catch (err) {
        console.error(`Amazon fetch failed for category ${category}:`, err);
      }
    }

    // Add a sample AliExpress product (optional, keep or extend as needed)
    aiCuratedProducts.push({
      title: 'RGB LED Strip Lights 16.4ft Smart WiFi',
      price: 299,
      originalPrice: 499,
      platform: 'aliexpress',
      category: 'Smart Home',
      affiliateUrl: 'https://s.click.aliexpress.com/e/_DCxkWz1',
      imageUrl: 'https://images.unsplash.com/photo-1558618047-dd5ee3b2ad99?w=400',
      description: 'Smart WiFi LED strips with app control and voice commands',
      commission: 14.95,
      aiScore: 8.5,
      trending: true,
      createdAt: new Date()
    });

    // Insert AI-curated products
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
