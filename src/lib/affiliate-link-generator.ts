// src/lib/affiliate-link-generator.ts
// Central helper för att generera affiliate-länkar för olika nätverk
import { createAliExpressShortlink } from './aliexpress-api';

// Amazon: lägg till affiliate-tag om den saknas
function addAmazonAffiliateTag(url: string, tag = 'lemonec-20'): string {
  if (!url) return url;
  if (!url.includes('amazon.')) return url;
  if (url.includes(`tag=${tag}`)) return url;
  const urlObj = new URL(url);
  urlObj.searchParams.set('tag', tag);
  return urlObj.toString();
}

// KSP: lägg till affiliate-id om den saknas
function addKspAffiliateTag(url: string, affiliateId: string): string {
  if (!url) return url;
  if (!affiliateId) return url;
  const urlObj = new URL(url);
  urlObj.searchParams.set('aff', affiliateId);
  return urlObj.toString();
}

// Huvudfunktion
export async function generateAffiliateLink({
  url,
  network,
  amazonTag = 'lemonec-20',
  kspAffiliateId = '',
}: {
  url: string;
  network: 'amazon' | 'aliexpress' | 'ksp' | string;
  amazonTag?: string;
  kspAffiliateId?: string;
}): Promise<string | null> {
  if (network === 'amazon') {
    return addAmazonAffiliateTag(url, amazonTag);
  }
  if (network === 'aliexpress') {
    return await createAliExpressShortlink(url);
  }
  if (network === 'ksp') {
    return addKspAffiliateTag(url, kspAffiliateId);
  }
  // Fallback: returnera url som den är
  return url;
}
