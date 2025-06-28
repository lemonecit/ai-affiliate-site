import { MongoClient, Db, Collection } from 'mongodb';

// Environment variables
const MONGODB_URI = process.env.MONGODB_URI;
const HAS_MONGODB = !!MONGODB_URI;

export const COLLECTIONS = {
  CLICKS: 'clicks',
  PRODUCTS: 'products', 
  USERS: 'users',
  ANALYTICS: 'analytics',
  AFFILIATE_LINKS: 'affiliate_links',
  AI_INSIGHTS: 'ai_insights'
} as const;

// Mock database for when MongoDB is not available
const mockDb = {
  collection: () => ({
    find: () => ({ 
      toArray: () => Promise.resolve([]),
      sort: () => ({ toArray: () => Promise.resolve([]) }),
      skip: () => ({ limit: () => ({ toArray: () => Promise.resolve([]) }) }),
      limit: () => ({ toArray: () => Promise.resolve([]) })
    }),
    findOne: () => Promise.resolve(null),
    insertOne: () => Promise.resolve({ insertedId: 'mock-id' }),
    insertMany: () => Promise.resolve({ insertedCount: 0, insertedIds: {} }),
    updateOne: () => Promise.resolve({ modifiedCount: 0 }),
    deleteMany: () => Promise.resolve({ deletedCount: 0 }),
    countDocuments: () => Promise.resolve(0),
    aggregate: () => ({ toArray: () => Promise.resolve([]) }),
    createIndex: () => Promise.resolve('mock-index'),
    distinct: () => Promise.resolve([])
  })
};

const mockClient = {
  connect: () => Promise.resolve(mockClient),
  db: () => mockDb
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (HAS_MONGODB) {
  const uri = MONGODB_URI!;
  const options = {};

  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
} else {
  // Use mock client when MongoDB is not available
  clientPromise = Promise.resolve(mockClient as any);
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

// Helper function to get database
export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db('ai-affiliate-db');
}

// Analytics-specifika funktioner
export class AnalyticsDB {
  private static instance: AnalyticsDB
  private db: Db | null = null

  private constructor() {}

  public static getInstance(): AnalyticsDB {
    if (!AnalyticsDB.instance) {
      AnalyticsDB.instance = new AnalyticsDB()
    }
    return AnalyticsDB.instance
  }

  async init() {
    this.db = await getDatabase()
  }

  async trackClick(data: {
    productId: string
    source: string
    utmSource?: string
    utmMedium?: string  
    utmCampaign?: string
    userIp?: string
    userAgent?: string
  }) {
    if (!HAS_MONGODB) return false;
    
    if (!this.db) await this.init()
    
    const clicksCollection = this.db!.collection(COLLECTIONS.CLICKS)
    
    const clickData = {
      product_id: data.productId,
      source: data.source,
      utm_source: data.utmSource,
      utm_medium: data.utmMedium,
      utm_campaign: data.utmCampaign,
      user_ip: data.userIp,
      user_agent: data.userAgent,
      timestamp: new Date(),
      converted: false
    }

    try {
      const result = await clicksCollection.insertOne(clickData)
      return !!result.insertedId
    } catch (error) {
      console.error('MongoDB click tracking error:', error)
      return false
    }
  }

  async getClickStats(days: number = 7) {
    if (!HAS_MONGODB) return { period_days: days, sources: {} };
    
    if (!this.db) await this.init()
    
    const clicksCollection = this.db!.collection(COLLECTIONS.CLICKS)
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    try {
      const pipeline = [
        { $match: { timestamp: { $gte: startDate } } },
        {
          $group: {
            _id: '$source',
            total_clicks: { $sum: 1 },
            unique_products: { $addToSet: '$product_id' },
            conversions: {
              $sum: { $cond: [{ $eq: ['$converted', true] }, 1, 0] }
            }
          }
        }
      ]

      const results = await clicksCollection.aggregate(pipeline).toArray()
      
      return {
        period_days: days,
        sources: results.reduce((acc: any, result: any) => {
          acc[result._id] = {
            clicks: result.total_clicks,
            unique_products: result.unique_products.length,
            conversions: result.conversions,
            conversion_rate: result.total_clicks > 0 
              ? (result.conversions / result.total_clicks * 100).toFixed(2)
              : 0
          }
          return acc
        }, {})
      }
    } catch (error) {
      console.error('MongoDB stats error:', error)
      return { period_days: days, sources: {} }
    }
  }

  async getTrendingProducts(days: number = 7, limit: number = 10) {
    if (!HAS_MONGODB) return [];
    
    if (!this.db) await this.init()
    
    const clicksCollection = this.db!.collection(COLLECTIONS.CLICKS)
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    try {
      const pipeline = [
        { $match: { timestamp: { $gte: startDate } } },
        {
          $group: {
            _id: '$product_id',
            clicks: { $sum: 1 },
            sources: { $addToSet: '$source' },
            conversions: {
              $sum: { $cond: [{ $eq: ['$converted', true] }, 1, 0] }
            }
          }
        },
        { $sort: { clicks: -1 } },
        { $limit: limit }
      ]

      const results = await clicksCollection.aggregate(pipeline).toArray()
      return results.map((result: any) => ({
        product_id: result._id,
        clicks: result.clicks,
        sources: result.sources,
        conversions: result.conversions,
        conversion_rate: result.clicks > 0 
          ? (result.conversions / result.clicks * 100).toFixed(2)
          : 0
      }))
    } catch (error) {
      console.error('MongoDB trending error:', error)
      return []
    }
  }
}

export const analytics = AnalyticsDB.getInstance()
