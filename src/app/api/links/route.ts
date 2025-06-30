import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

// Enkel gratis geolocation-tjänst (ip-api.com)
async function getCountryFromIP(ip: string): Promise<string | null> {
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.countryCode || null;
  } catch {
    return null;
  }
}

export const dynamic = 'force-dynamic';

// GET /api/links?productId=...  (eller ?category=...)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');
  const category = searchParams.get('category');

  // Hämta IP-adress från request headers (X-Forwarded-For för Vercel/proxy)
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || request.ip || '';
  const country = await getCountryFromIP(ip);

  // Hämta produkt(er) från DB
  const { connectToDatabase, COLLECTIONS } = await import('../../../lib/mongodb-runtime');
  const { db } = await connectToDatabase();
  let query: any = {};
  if (productId) query._id = new ObjectId(productId);
  if (category) query.category = category;
  if (country) query.country = country;

  // Om ingen produkt för land, hämta global/all
  let product = await db.collection(COLLECTIONS.PRODUCTS).findOne(query);
  if (!product && productId) {
    // Fallback: hämta utan land
    product = await db.collection(COLLECTIONS.PRODUCTS).findOne({ _id: new ObjectId(productId) });
  }

  return NextResponse.json({
    success: true,
    country,
    product: product ? {
      id: product._id?.toString(),
      title: product.title,
      affiliateUrl: product.affiliateUrl,
      country: product.country,
      platform: product.platform,
      network: product.network
    } : null
  });
}
