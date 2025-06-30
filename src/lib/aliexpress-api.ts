// src/lib/aliexpress-api.ts
// Helper för att skapa korrekta AliExpress affiliate shortlinks via API
import crypto from 'crypto';

const APP_KEY = process.env.ALIEXPRESS_APP_KEY || '';
const SECRET_KEY = process.env.ALIEXPRESS_SECRET_KEY || '';

// Skapa signatur enligt AliExpress API-dokumentation
function createAliExpressSignature(params: Record<string, string>, secret: string) {
  const sorted = Object.keys(params).sort().map(key => `${key}${params[key]}`).join('');
  const signStr = secret + sorted + secret;
  return crypto.createHash('md5').update(signStr, 'utf8').digest('hex').toUpperCase();
}

// Skapa affiliate shortlink från vanlig produktlänk
export async function createAliExpressShortlink(productUrl: string): Promise<string | null> {
  const method = 'aliexpress.affiliate.link.generate';
  const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const params: Record<string, string> = {
    app_key: APP_KEY,
    method,
    timestamp,
    format: 'json',
    v: '2.0',
    sign_method: 'md5',
    urls: productUrl,
    // Lägg till dina affiliate-parametrar här om du har
  };
  params.sign = createAliExpressSignature(params, SECRET_KEY);

  const searchParams = new URLSearchParams(params);
  const apiUrl = `https://gw.api.alibaba.com/openapi/param2/2/portals.open/api.listPromotionLinks/${APP_KEY}?${searchParams.toString()}`;

  const res = await fetch(apiUrl);
  if (!res.ok) return null;
  const data = await res.json();
  // Kontrollera och returnera shortlink
  const link = data.result?.promotionUrls?.[0]?.shortLinkUrl;
  return link || null;
}
