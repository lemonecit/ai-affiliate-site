// src/lib/amazon-api.ts
// Enkel wrapper för Amazon Product Advertising API (npm install amazon-pa-api50)
import { PAAPI } from 'amazon-pa-api50';

const ACCESS_KEY = process.env.AMAZON_ACCESS_KEY || '';
const SECRET_KEY = process.env.AMAZON_SECRET_KEY || '';
const PARTNER_TAG = 'lemonec-20';
const PARTNER_TYPE = 'Associates';
const MARKETPLACE = 'www.amazon.com';

const paapi = new PAAPI({
  accessKey: ACCESS_KEY,
  secretKey: SECRET_KEY,
  partnerTag: PARTNER_TAG,
  partnerType: PARTNER_TYPE,
  marketplace: MARKETPLACE,
});

export async function searchAmazonProducts(keywords: string, maxResults = 3) {
  const result = await paapi.searchItems({
    Keywords: keywords,
    ItemCount: maxResults,
    Resources: [
      'Images.Primary.Large',
      'ItemInfo.Title',
      'Offers.Listings.Price',
      'Offers.Listings.Availability',
      'ItemInfo.Features',
      'ItemInfo.ProductInfo',
    ],
  });
  return result.ItemsResult?.Items || [];
}
