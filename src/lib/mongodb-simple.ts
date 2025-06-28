// Simple mock MongoDB for Vercel deployment
export const COLLECTIONS = {
  CLICKS: 'clicks',
  PRODUCTS: 'products', 
  USERS: 'users',
  ANALYTICS: 'analytics',
  AFFILIATE_LINKS: 'affiliate_links',
  AI_INSIGHTS: 'ai_insights'
};

// Mock database functions
export async function getDatabase() {
  return {
    collection: () => ({
      find: () => ({ toArray: () => Promise.resolve([]) }),
      findOne: () => Promise.resolve(null),
      insertOne: () => Promise.resolve({ insertedId: 'mock' }),
      updateOne: () => Promise.resolve({ modifiedCount: 0 }),
      deleteMany: () => Promise.resolve({ deletedCount: 0 }),
      aggregate: () => ({ toArray: () => Promise.resolve([]) })
    })
  };
}

// Mock analytics
export const analytics = {
  trackClick: (data: any) => {
    console.log('Mock track click:', data);
    return Promise.resolve(true);
  },
  getClickStats: () => Promise.resolve({ period_days: 7, sources: {} }),
  getTrendingProducts: () => Promise.resolve([])
};
