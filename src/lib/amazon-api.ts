// src/lib/amazon-api.ts
// Wrapper för Amazon Product Advertising API (npm install amazon-pa-api50)
const { ApiClient } = require('amazon-pa-api50');

const ACCESS_KEY = process.env.AMAZON_ACCESS_KEY || '';
const SECRET_KEY = process.env.AMAZON_SECRET_KEY || '';
const PARTNER_TAG = 'lemonec-20';
const MARKETPLACE = 'www.amazon.com';

const client = new ApiClient({
  accessKey: ACCESS_KEY,
  secretKey: SECRET_KEY,
  partnerTag: PARTNER_TAG,
  marketplace: MARKETPLACE,
});

async function searchAmazonProducts(keywords, maxResults = 3) {
  const result = await client.searchItems({
    Keywords: keywords,
    ItemCount: maxResults,
    Resources: [
      'Images.Primary.Large',
      'ItemInfo.Title',
      'Offers.Listings.Price',
      'Offers.Listings.Availability',
      'ItemInfo.Features',
      'ItemInfo.ProductInfo',
      'DetailPageURL',
    ],
  });
  return result.ItemsResult?.Items || [];
}

module.exports = { searchAmazonProducts };
