// Real Amazon Affiliate Link Generator
// Använder dina riktiga Amazon Associate credentials

export class AmazonAffiliate {
  constructor() {
    this.associateTag = 'lemonec-20';  // Din riktiga Amazon Associate tag
    this.baseUrl = 'https://www.amazon.com';
    this.baseUrlSE = 'https://www.amazon.se';  // För svenska kunder
  }

  // Generera Amazon affiliate länk med din tag
  generateAffiliateLink(productId, marketplace = 'US') {
    const baseUrl = marketplace === 'SE' ? this.baseUrlSE : this.baseUrl;
    // Uppdaterat format som är mer kompatibelt
    return `${baseUrl}/dp/${productId}?tag=${this.associateTag}&linkCode=ogi&th=1&psc=1`;
  }

  // Generera search-baserad länk (alltid fungerar)
  generateSearchLink(searchTerm, marketplace = 'US') {
    const baseUrl = marketplace === 'SE' ? this.baseUrlSE : this.baseUrl;
    const encodedTerm = encodeURIComponent(searchTerm);
    return `${baseUrl}/s?k=${encodedTerm}&tag=${this.associateTag}&linkCode=ogi`;
  }

  // Skapa komplett produktlänk med tracking
  createProductLink(product, marketplace = 'US') {
    const affiliateUrl = this.generateAffiliateLink(product.asin, marketplace);
    
    return {
      url: affiliateUrl,
      displayUrl: `amazon.${marketplace === 'SE' ? 'se' : 'com'}`,
      trackingTag: this.associateTag,
      marketplace: marketplace,
      commission: this.getCommissionRate(product.category),
      isAffiliate: true
    };
  }

  // Kommissionsrater per kategori (ungefärliga)
  getCommissionRate(category) {
    const rates = {
      'Electronics': '2-4%',
      'Home & Garden': '3-8%',
      'Health & Personal Care': '1-4%',
      'Sports & Outdoors': '3-8%',
      'Toys & Games': '3-8%',
      'Fashion': '4-10%',
      'Books': '4.5%',
      'Kitchen': '3-8%',
      'default': '1-8%'
    };
    return rates[category] || rates.default;
  }

  // Populära trending produkter med verifierade ASINs
  getTrendingProducts() {
    return [
      {
        asin: 'B0D1XD1ZV3',
        title: 'Echo Dot (5th Gen, 2022 release) Smart speaker',
        category: 'Electronics',
        price: '$49.99',
        trending: true,
        keywords: ['smart home', 'alexa', 'voice assistant'],
        searchTerm: 'Echo Dot 5th generation smart speaker'
      },
      {
        asin: 'B0BSFQVDWZ', 
        title: 'Ninja Creami, Ice Cream Maker',
        category: 'Kitchen',
        price: '$199.99', 
        trending: true,
        keywords: ['kitchen', 'ice cream', 'dessert'],
        searchTerm: 'Ninja Creami ice cream maker'
      },
      {
        asin: 'B0BDHB9Y8H',
        title: 'Apple AirPods Pro (2nd Generation)',
        category: 'Electronics',
        price: '$249.99',
        trending: true,
        keywords: ['apple', 'wireless', 'noise cancelling'],
        searchTerm: 'Apple AirPods Pro 2nd generation'
      },
      {
        asin: 'B08XQYBKXD',
        title: 'Resistance Loop Exercise Bands Set',
        category: 'Sports & Outdoors', 
        price: '$11.99',
        trending: true,
        keywords: ['fitness', 'home workout', 'exercise'],
        searchTerm: 'resistance bands exercise set'
      },
      {
        asin: 'B08L8KC1J7',
        title: 'Govee Immersion WiFi TV LED Backlights',
        category: 'Electronics',
        price: '$79.99',
        trending: true,
        keywords: ['gaming', 'tv', 'ambient lighting'],
        searchTerm: 'Govee TV LED backlights'
      }
    ];
  }

  // Skapa trending produktkort med affiliate länkar
  createTrendingProductCard(product, marketplace = 'US') {
    // Använd search-länk istället för direkt ASIN för bättre kompatibilitet
    const searchUrl = this.generateSearchLink(product.searchTerm, marketplace);
    const directUrl = this.generateAffiliateLink(product.asin, marketplace);
    
    return {
      id: product.asin,
      title: product.title,
      category: product.category,
      price: product.price,
      commission: this.getCommissionRate(product.category),
      affiliateUrl: searchUrl, // Använd search-länk för bättre framgång
      directUrl: directUrl,   // Behåll direkt-länk som backup
      displayUrl: marketplace === 'SE' ? 'amazon.se' : 'amazon.com',
      trackingTag: this.associateTag,
      trending: product.trending,
      keywords: product.keywords,
      searchTerm: product.searchTerm,
      marketplace: marketplace,
      cta: `Köp på ${marketplace === 'SE' ? 'amazon.se' : 'amazon.com'}`,
      buttonText: 'Se pris på Amazon',
      disclaimer: `Som Amazon Associate tjänar vi på kvalificerade köp. Pris kan variera.`
    };
  }

  // Generera Amazon search länkar för trending keywords
  generateSearchLink(keyword, marketplace = 'US') {
    const baseUrl = marketplace === 'SE' ? this.baseUrlSE : this.baseUrl;
    const encodedKeyword = encodeURIComponent(keyword);
    return `${baseUrl}/s?k=${encodedKeyword}&tag=${this.associateTag}&linkCode=ogi`;
  }
}

// AliExpress Affiliate Integration
export class AliExpressAffiliate {
  constructor() {
    this.appKey = '514666';  // Din riktiga AliExpress App Key
    this.trackingId = 'lemonec'; // Baserat på ditt Amazon tag
    this.baseUrl = 'https://s.click.aliexpress.com';
  }

  // Generera AliExpress affiliate länk
  generateAffiliateLink(productId, originalUrl) {
    // AliExpress affiliate länk format
    return `${this.baseUrl}/e/_${productId}?bz=${this.appKey}`;
  }

  // Trending AliExpress produkter
  getTrendingProducts() {
    return [
      {
        id: 'AE001',
        title: 'Wireless Bluetooth Earbuds',
        category: 'Electronics',
        price: '$15.99',
        originalPrice: '$45.99',
        discount: '65%',
        trending: true,
        keywords: ['wireless', 'bluetooth', 'earbuds']
      },
      {
        id: 'AE002', 
        title: 'LED Gaming Keyboard RGB',
        category: 'Gaming',
        price: '$29.99',
        originalPrice: '$89.99',
        discount: '67%',
        trending: true,
        keywords: ['gaming', 'keyboard', 'rgb', 'mechanical']
      },
      {
        id: 'AE003',
        title: 'Massage Gun Deep Tissue',
        category: 'Health & Beauty',
        price: '$39.99',
        originalPrice: '$149.99', 
        discount: '73%',
        trending: true,
        keywords: ['massage', 'recovery', 'muscle', 'fitness']
      },
      {
        id: 'AE004',
        title: 'Smart Watch Fitness Tracker',
        category: 'Electronics',
        price: '$24.99',
        originalPrice: '$99.99',
        discount: '75%',
        trending: true,
        keywords: ['smartwatch', 'fitness', 'health', 'tracker']
      },
      {
        id: 'AE005',
        title: 'Silicone Kitchen Utensils Set',
        category: 'Kitchen',
        price: '$12.99',
        originalPrice: '$39.99',
        discount: '68%',
        trending: true,
        keywords: ['kitchen', 'cooking', 'utensils', 'silicone']
      }
    ];
  }

  // Skapa AliExpress produktkort
  createProductCard(product) {
    const affiliateUrl = this.generateAffiliateLink(product.id);
    
    return {
      id: product.id,
      title: product.title,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      affiliateUrl: affiliateUrl,
      displayUrl: 'aliexpress.com',
      appKey: this.appKey,
      trending: product.trending,
      keywords: product.keywords,
      cta: 'Köp på AliExpress',
      buttonText: 'Se erbjudande',
      disclaimer: 'Som AliExpress partner får vi provision på köp. Priser kan variera.'
    };
  }
}

// Combined Affiliate Manager
export class AffiliateManager {
  constructor() {
    this.amazon = new AmazonAffiliate();
    this.aliexpress = new AliExpressAffiliate();
  }

  // Hämta alla trending produkter från båda plattformarna
  getAllTrendingProducts() {
    const amazonProducts = this.amazon.getTrendingProducts().map(product => ({
      ...this.amazon.createTrendingProductCard(product),
      platform: 'Amazon',
      source: 'amazon'
    }));

    const aliexpressProducts = this.aliexpress.getTrendingProducts().map(product => ({
      ...this.aliexpress.createProductCard(product),
      platform: 'AliExpress', 
      source: 'aliexpress'
    }));

    return [...amazonProducts, ...aliexpressProducts];
  }

  // Sök produkter baserat på trending keywords
  searchByTrendingKeyword(keyword) {
    const allProducts = this.getAllTrendingProducts();
    return allProducts.filter(product => 
      product.keywords.some(k => 
        k.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  }

  // Generera affiliate rapport
  generateAffiliateReport() {
    const allProducts = this.getAllTrendingProducts();
    
    return {
      totalProducts: allProducts.length,
      amazonProducts: allProducts.filter(p => p.source === 'amazon').length,
      aliexpressProducts: allProducts.filter(p => p.source === 'aliexpress').length,
      categories: [...new Set(allProducts.map(p => p.category))],
      platforms: {
        amazon: {
          tag: this.amazon.associateTag,
          products: allProducts.filter(p => p.source === 'amazon').length
        },
        aliexpress: {
          appKey: this.aliexpress.appKey,
          products: allProducts.filter(p => p.source === 'aliexpress').length
        }
      },
      lastUpdated: new Date().toISOString()
    };
  }
}

// Export default instance
export default new AffiliateManager();
