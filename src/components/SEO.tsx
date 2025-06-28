import Head from 'next/head'

interface SEOProps {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  product?: {
    name: string
    price: string
    currency: string
    availability: string
    brand?: string
    category?: string
  }
}

export default function SEO({
  title,
  description,
  keywords = [],
  image = '/images/og-default.jpg',
  url,
  type = 'website',
  product
}: SEOProps) {
  const siteName = 'AI Affiliate Store'
  const fullTitle = `${title} | ${siteName}`
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href={currentUrl} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="sv_SE" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Product Schema (if product type) */}
      {product && type === 'product' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              "name": product.name,
              "description": description,
              "image": image,
              "offers": {
                "@type": "Offer",
                "price": product.price,
                "priceCurrency": product.currency,
                "availability": `https://schema.org/${product.availability}`,
                "url": currentUrl
              },
              ...(product.brand && { "brand": { "@type": "Brand", "name": product.brand } }),
              ...(product.category && { "category": product.category })
            })
          }}
        />
      )}
      
      {/* Website Schema */}
      {type === 'website' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "WebSite",
              "name": siteName,
              "description": "AI-driven affiliate marketing platform med Amazon och AliExpress integration",
              "url": currentUrl,
              "potentialAction": {
                "@type": "SearchAction",
                "target": `${currentUrl}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      )}
      
      {/* Additional Meta Tags for SEO */}
      <meta name="author" content={siteName} />
      <meta name="language" content="Swedish" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="web" />
      <meta name="rating" content="general" />
      
      {/* Favicon and Icons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
    </Head>
  )
}

// Hook for generating SEO-friendly URLs
export function generateSEOUrl(title: string, id?: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[åä]/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  
  return id ? `${slug}-${id}` : slug
}

// Generate meta description from product info
export function generateProductDescription(product: any): string {
  const { name, price, platform, category } = product
  const platformName = platform === 'amazon' ? 'Amazon' : 'AliExpress'
  
  return `Köp ${name} för ${price} på ${platformName}. ${category ? `Bästa pris inom ${category}.` : ''} Jämför priser och få de bästa erbjudandena med AI-rekommendationer.`
}

// Generate keywords from product data
export function generateProductKeywords(product: any): string[] {
  const { name, category, platform, brand } = product
  const baseKeywords = ['köpa', 'pris', 'erbjudande', 'rabatt', 'bästa', 'billig']
  const platformKeywords = platform === 'amazon' ? ['amazon', 'amazon sverige'] : ['aliexpress', 'aliexpress sverige']
  
  const productKeywords = name
    .toLowerCase()
    .split(' ')
    .filter((word: string) => word.length > 2)
    .slice(0, 5)
  
  return [
    ...productKeywords,
    ...baseKeywords,
    ...platformKeywords,
    ...(category ? [category.toLowerCase()] : []),
    ...(brand ? [brand.toLowerCase()] : [])
  ]
}
