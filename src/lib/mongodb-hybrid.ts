import { MongoClient, Db, Collection } from 'mongodb';

// Check if MongoDB URI is available, but don't throw error in production
const mongoUri = process.env.MONGODB_URI;
const isMongoAvailable = !!mongoUri;

const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

export const COLLECTIONS = {
  CLICKS: 'clicks',
  PRODUCTS: 'products', 
  USERS: 'users',
  ANALYTICS: 'analytics',
  AFFILIATE_LINKS: 'affiliate_links',
  AI_INSIGHTS: 'ai_insights'
};

// Create mock client for when MongoDB is not available
const createMockClient = () => ({
  connect: () => Promise.resolve(createMockClient()),
  db: () => ({
    collection: () => ({
      find: () => ({ toArray: () => Promise.resolve([]) }),
      findOne: () => Promise.resolve(null),
      insertOne: () => Promise.resolve({ insertedId: 'mock' }),
      updateOne: () => Promise.resolve({ modifiedCount: 0 }),
      deleteMany: () => Promise.resolve({ deletedCount: 0 }),
      aggregate: () => ({ toArray: () => Promise.resolve([]) })
    })
  })
});

if (isMongoAvailable && mongoUri) {
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(mongoUri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(mongoUri, options);
    clientPromise = client.connect();
  }
} else {
  // Use mock client when MongoDB is not available
  console.warn('MongoDB URI not found, using mock data');
  clientPromise = Promise.resolve(createMockClient() as any);
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

// Helper function to get database
export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db('affiliate-store');
}

// Analytics functions
export const analytics = {
  async trackClick(data: any) {
    try {
      if (!isMongoAvailable) {
        console.log('Mock tracking click:', data);
        return true; // Mock success
      }

      const db = await getDatabase();
      const clickData = {
        ...data,
        timestamp: new Date(),
        userId: data.userId || 'anonymous'
      };
      
      const result = await db.collection(COLLECTIONS.CLICKS).insertOne(clickData);
      return !!result.insertedId;
    } catch (error) {
      console.error('Error tracking click:', error);
      return false;
    }
  },

  async getClickStats(periodDays = 7) {
    try {
      if (!isMongoAvailable) {
        // Return mock stats
        return {
          period_days: periodDays,
          sources: {
            website: 45,
            social: 12,
            email: 8
          }
        };
      }

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
        sources: stats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
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
      if (!isMongoAvailable) {
        // Return mock trending products
        return [
          { _id: 'prod1', clicks: 25, lastClick: new Date() },
          { _id: 'prod2', clicks: 18, lastClick: new Date() },
          { _id: 'prod3', clicks: 12, lastClick: new Date() }
        ];
      }

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
