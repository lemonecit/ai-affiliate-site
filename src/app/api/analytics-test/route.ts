import { NextRequest, NextResponse } from 'next/server';

// Import MongoDB functions safely
let getDatabase: any;
let COLLECTIONS: any;
let analytics: any;

try {
  const mongoModule = require('../../../lib/mongodb');
  getDatabase = mongoModule.getDatabase;
  COLLECTIONS = mongoModule.COLLECTIONS;
  analytics = mongoModule.analytics;
} catch (error) {
  console.warn('MongoDB module failed to load:', error);
  getDatabase = async () => { throw new Error('MongoDB not available'); };
  COLLECTIONS = { CLICKS: 'clicks', PRODUCTS: 'products' };
  analytics = { trackClick: () => Promise.resolve(false) };
}

export async function GET(request: NextRequest) {
  try {
    console.log('Analytics-test GET request received');
    
    // Try to connect to database
    let db;
    try {
      db = await getDatabase();
      console.log('MongoDB connection successful');
    } catch (dbError) {
      console.warn('Database connection failed, returning mock data:', dbError);
      // Return mock data if database is not available
      const mockResponse = {
        success: true,
        source: 'mock',
        data: {
          overview: {
            totalClicks: 10,
            totalConversions: 2,
            totalCommissions: 50.25,
            uniqueUsers: 8,
            uniqueProducts: 5,
            conversionRate: 20
          },
          platformBreakdown: [
            { platform: 'amazon', clicks: 6, conversions: 1, commissions: 30.25, conversionRate: 16.67 },
            { platform: 'aliexpress', clicks: 4, conversions: 1, commissions: 20, conversionRate: 25 }
          ],
          topProducts: [
            { productId: 'prod-1', clicks: 3, conversions: 1, commissions: 25 },
            { productId: 'prod-2', clicks: 2, conversions: 0, commissions: 0 }
          ],
          dailyTrends: [
            { _id: '2025-06-27', clicks: 5, conversions: 1, commissions: 25 },
            { _id: '2025-06-28', clicks: 5, conversions: 1, commissions: 25.25 }
          ]
        }
      };
      return NextResponse.json(mockResponse);
    }

    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const platform = searchParams.get('platform');

    console.log('Analytics GET params:', { startDate, endDate, platform });

    // Build date filter
    const dateFilter: any = {};
    if (startDate || endDate) {
      dateFilter.timestamp = {};
      if (startDate) dateFilter.timestamp.$gte = new Date(startDate);
      if (endDate) dateFilter.timestamp.$lte = new Date(endDate);
    }

    // Platform filter
    const platformFilter = platform ? { platform } : {};
    const filter = { ...dateFilter, ...platformFilter };

    console.log('Query filter:', filter);

    // Get total metrics from database
    const totalMetrics = await db.collection(COLLECTIONS.CLICKS).aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalClicks: { $sum: 1 },
          totalConversions: { $sum: { $cond: ['$converted', 1, 0] } },
          totalCommissions: { $sum: { $ifNull: ['$commissionEarned', 0] } },
          uniqueUsers: { $addToSet: '$userId' },
          uniqueProducts: { $addToSet: '$productId' }
        }
      },
      {
        $project: {
          totalClicks: 1,
          totalConversions: 1,
          totalCommissions: 1,
          uniqueUsers: { $size: '$uniqueUsers' },
          uniqueProducts: { $size: '$uniqueProducts' },
          conversionRate: {
            $cond: [
              { $eq: ['$totalClicks', 0] },
              0,
              { $multiply: [{ $divide: ['$totalConversions', '$totalClicks'] }, 100] }
            ]
          }
        }
      }
    ]).toArray();

    // Get platform breakdown
    const platformBreakdown = await db.collection(COLLECTIONS.CLICKS).aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$platform',
          clicks: { $sum: 1 },
          conversions: { $sum: { $cond: ['$converted', 1, 0] } },
          commissions: { $sum: { $ifNull: ['$commissionEarned', 0] } }
        }
      }
    ]).toArray();

    // Get top products
    const topProducts = await db.collection(COLLECTIONS.CLICKS).aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$productId',
          clicks: { $sum: 1 },
          conversions: { $sum: { $cond: ['$converted', 1, 0] } },
          commissions: { $sum: { $ifNull: ['$commissionEarned', 0] } }
        }
      },
      { $sort: { clicks: -1 } },
      { $limit: 10 }
    ]).toArray();

    const overview = totalMetrics[0] || {
      totalClicks: 0,
      totalConversions: 0,
      totalCommissions: 0,
      uniqueUsers: 0,
      uniqueProducts: 0,
      conversionRate: 0
    };

    console.log('Analytics result from database:', { 
      overview, 
      platformBreakdownCount: platformBreakdown.length, 
      topProductsCount: topProducts.length
    });

    const response = {
      success: true,
      source: 'database',
      data: {
        overview,
        platformBreakdown,
        topProducts,
        dailyTrends: [] // Simplified for now
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Analytics-test POST received:', body);

    const { productId, platform, source = 'website', utm_source, utm_medium, utm_campaign } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID är obligatorisk' },
        { status: 400 }
      );
    }

    // Get user info
    const userIp = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    console.log('Tracking click for:', { productId, platform, source });

    // Try to track in MongoDB
    let mongoTracked = false;
    try {
      mongoTracked = await analytics.trackClick({
        productId,
        source,
        utmSource: utm_source,
        utmMedium: utm_medium, 
        utmCampaign: utm_campaign,
        userIp,
        userAgent,
        platform
      });
      console.log('MongoDB tracking successful:', mongoTracked);
    } catch (mongoError) {
      console.warn('MongoDB tracking failed:', mongoError);
    }

    const response = {
      success: true,
      data: {
        tracked: {
          productId,
          platform,
          source,
          mongodb: mongoTracked,
          timestamp: new Date().toISOString(),
          userIp: userIp,
          userAgent: userAgent
        }
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Click tracking error:', error);
    
    const errorResponse = {
      success: false,
      error: 'Tracking misslyckades',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
