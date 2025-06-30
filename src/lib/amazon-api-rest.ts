// src/lib/amazon-api-rest.ts
// Amazon PA-API v5 REST helper for Next.js (no external SDK)
import crypto from 'crypto';

const ACCESS_KEY = process.env.AMAZON_ACCESS_KEY || '';
const SECRET_KEY = process.env.AMAZON_SECRET_KEY || '';
const PARTNER_TAG = process.env.AMAZON_ASSOCIATE_TAG || '';
const HOST = 'webservices.amazon.com';
const REGION = 'us-east-1';
const SERVICE = 'ProductAdvertisingAPI';
const ENDPOINT = `https://${HOST}/paapi5/searchitems`;

function getAmzDate(date: Date) {
  return date.toISOString().replace(/[:-]|\..*$/g, '');
}

function sign(key: Buffer, msg: string) {
  return crypto.createHmac('sha256', key).update(msg, 'utf8').digest();
}

function getSignatureKey(key: string, dateStamp: string, regionName: string, serviceName: string) {
  const kDate = sign(Buffer.from('AWS4' + key, 'utf8'), dateStamp);
  const kRegion = sign(kDate, regionName);
  const kService = sign(kRegion, serviceName);
  const kSigning = sign(kService, 'aws4_request');
  return kSigning;
}

export async function searchAmazonProductsREST(keywords: string, maxResults = 3) {
  const now = new Date();
  const amzDate = getAmzDate(now);
  const dateStamp = amzDate.slice(0, 8);

  const payload = JSON.stringify({
    Keywords: keywords,
    ItemCount: maxResults,
    PartnerTag: PARTNER_TAG,
    PartnerType: 'Associates',
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

  const headers = {
    'content-encoding': 'amz-1.0',
    'content-type': 'application/json; charset=UTF-8',
    host: HOST,
    'x-amz-date': amzDate,
    'x-amz-target': 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems',
  };

  // Create canonical request
  const canonicalHeaders = `content-encoding:${headers['content-encoding']}
content-type:${headers['content-type']}
host:${headers.host}
x-amz-date:${headers['x-amz-date']}
x-amz-target:${headers['x-amz-target']}
`;
  const signedHeaders = 'content-encoding;content-type;host;x-amz-date;x-amz-target';
  const payloadHash = crypto.createHash('sha256').update(payload, 'utf8').digest('hex');
  const canonicalRequest = [
    'POST',
    '/paapi5/searchitems',
    '',
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n');

  // Create string to sign
  const algorithm = 'AWS4-HMAC-SHA256';
  const credentialScope = `${dateStamp}/${REGION}/${SERVICE}/aws4_request`;
  const stringToSign = [
    algorithm,
    amzDate,
    credentialScope,
    crypto.createHash('sha256').update(canonicalRequest, 'utf8').digest('hex'),
  ].join('\n');

  // Calculate signature
  const signingKey = getSignatureKey(SECRET_KEY, dateStamp, REGION, SERVICE);
  const signature = crypto.createHmac('sha256', signingKey).update(stringToSign, 'utf8').digest('hex');

  // Build authorization header
  const authorizationHeader =
    `${algorithm} Credential=${ACCESS_KEY}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  // Final headers
  const finalHeaders = {
    ...headers,
    Authorization: authorizationHeader,
  };

  // Make the request
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: finalHeaders,
    body: payload,
  });
  if (!res.ok) {
    throw new Error(`Amazon API error: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return data.ItemsResult?.Items || [];
}
