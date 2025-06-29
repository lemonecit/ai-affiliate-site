import { MongoClient, Db } from 'mongodb';

// MongoDB configuration that only runs at runtime, not build-time
export const COLLECTIONS = {
  CLICKS: 'clicks',
  PRODUCTS: 'products', 
  USERS: 'users',
  ANALYTICS: 'analytics',
  AFFILIATE_LINKS: 'affiliate_links',
  AI_INSIGHTS: 'ai_insights'
} as const;

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  // Only try to connect at runtime, not build-time
  if (typeof window !== 'undefined') {
    throw new Error('MongoDB connection should not run on client-side');
  }

  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MongoDB URI not found in environment variables');
  }

  console.log('Connecting to MongoDB Atlas...');
  
  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });

  await client.connect();
  const db = client.db('affiliate-store');

  cachedClient = client;
  cachedDb = db;

  console.log('Connected to MongoDB Atlas successfully');
  
  return { client, db };
}

export async function getDatabase(): Promise<Db> {
  const { db } = await connectToDatabase();
  return db;
}

// Analytics functions with runtime-only MongoDB access
export const analytics = {
  async trackClick(data: {
    productId: string;
    platform?: string;
    source?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    userIp?: string;
    userAgent?: string;
  }) {
    try {
      const db = await getDatabase();
      const clickData = {
        ...data,
        timestamp: new Date(),
        userId: data.userIp || 'anonymous', // Use IP as user identifier for now
        converted: false, // Default to false, can be updated later
        commissionEarned: 0 // Default to 0, can be updated later
      };
      
      const result = await db.collection(COLLECTIONS.CLICKS).insertOne(clickData);
      console.log('Click tracked successfully:', result.insertedId);
      return !!result.insertedId;
    } catch (error) {
      console.error('Error tracking click:', error);
      return false;
    }
  },

  async getClickStats(periodDays = 7) {
    try {
      const db = await getDatabase();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - periodDays);
      
      const stats = await db.collection(COLLECTIONS.CLICKS).aggregate([
        { $match: { timestamp: { $gte: startDate } } },
        {
          $group: {
            _id: '$source',
            count: { $sum: 1 }
          }
        }
      ]).toArray();

      return {
        period_days: periodDays,
        sources: stats.reduce((acc: any, stat: any) => {
          acc[stat._id || 'unknown'] = stat.count;
          return acc;
        }, {})
      };
    } catch (error) {
      console.error('Error getting click stats:', error);
      return { period_days: periodDays, sources: {} };
    }
  },

  async getTrendingProducts(limit = 10) {
    try {
      const db = await getDatabase();
      const trending = await db.collection(COLLECTIONS.CLICKS).aggregate([
        {
          $group: {
            _id: '$productId',
            clicks: { $sum: 1 },
            lastClick: { $max: '$timestamp' }
          }
        },
        { $sort: { clicks: -1, lastClick: -1 } },
        { $limit: limit }
      ]).toArray();

      return trending;
    } catch (error) {
      console.error('Error getting trending products:', error);
      return [];
    }
  }
};