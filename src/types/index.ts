import { ObjectId } from 'mongodb';

// Base product interface
export interface Product {
  _id?: ObjectId;
  platform: 'amazon' | 'aliexpress' | 'ksp';
  productId: string;
  title: string;
  description?: string;
  price: {
    current: number;
    original?: number;
    currency: string;
  };
  image: string;
  url: string;
  affiliateUrl: string;
  category: string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  availability: boolean;
  commission?: {
    rate: number;
    amount: number;
  };
  metadata?: {
    tags: string[];
    features: string[];
    specifications?: Record<string, any>;
  };
  aiInsights?: {
    trendScore: number;
    popularityScore: number;
    priceScore: number;
    overallScore: number;
    lastAnalyzed: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

// User interface
export interface User {
  _id?: ObjectId;
  email: string;
  password: string; // hashed
  role: 'admin' | 'user';
  profile: {
    name: string;
    avatar?: string;
  };
  preferences: {
    favoriteCategories: string[];
    priceRange: {
      min: number;
      max: number;
    };
  };
  stats: {
    totalClicks: number;
    totalCommissions: number;
    joinDate: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Click tracking
export interface ClickEvent {
  _id?: ObjectId;
  productId: string;
  userId?: string;
  platform: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  referrer?: string;
  sessionId: string;
  converted: boolean;
  commissionEarned?: number;
  metadata?: Record<string, any>;
}

// Affiliate link management
export interface AffiliateLink {
  _id?: ObjectId;
  originalUrl: string;
  affiliateUrl: string;
  shortCode: string;
  platform: string;
  productId: string;
  clicks: number;
  conversions: number;
  commissionEarned: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Analytics data
export interface AnalyticsData {
  _id?: ObjectId;
  date: Date;
  metrics: {
    totalClicks: number;
    totalConversions: number;
    totalCommissions: number;
    topProducts: Array<{
      productId: string;
      clicks: number;
      conversions: number;
    }>;
    platformBreakdown: Record<string, {
      clicks: number;
      conversions: number;
      commissions: number;
    }>;
  };
  createdAt: Date;
}

// AI Insights
export interface AIInsight {
  _id?: ObjectId;
  productId: string;
  analysis: {
    trendScore: number;
    popularityScore: number;
    priceScore: number;
    overallScore: number;
    reasoning: string;
    recommendations: string[];
  };
  marketData: {
    competitorPrices: number[];
    averagePrice: number;
    pricePosition: 'low' | 'medium' | 'high';
  };
  predictions: {
    nextMonthTrend: 'up' | 'down' | 'stable';
    confidence: number;
  };
  generatedAt: Date;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

// API Request types
export interface ProductCreateRequest {
  platform: Product['platform'];
  productId: string;
  title: string;
  description?: string;
  price: Product['price'];
  image: string;
  url: string;
  affiliateUrl: string;
  category: string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  metadata?: Product['metadata'];
}

export interface ProductUpdateRequest extends Partial<ProductCreateRequest> {
  _id: string;
}

export interface ProductSearchQuery {
  platform?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'price' | 'rating' | 'popularity' | 'date';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Analytics and tracking types
export interface ClickData {
  productId: string;
  platform: string;
  category: string;
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  clientId?: string;
  userIp?: string;
  userAgent?: string;
}

export interface ClickStats {
  period_days: number;
  total_clicks: number;
  total_conversions: number;
  total_revenue: number;
  conversion_rate: number;
  sources: {
    [key: string]: {
      clicks: number;
      conversions: number;
      revenue: number;
      conversion_rate: number;
      products: ProductStats[];
    };
  };
}

export interface ProductStats {
  product_id: string;
  clicks: number;
  conversions: number;
  revenue: number;
  conversion_rate: number;
  sources: string[];
}

export interface GoogleAnalyticsEvent {
  client_id: string;
  event_name: string;
  parameters: {
    [key: string]: any;
  };
}

export interface MongoClickRecord {
  _id?: string;
  product_id: string;
  source: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  user_ip?: string;
  user_agent?: string;
  timestamp: Date;
  converted: boolean;
  conversion_timestamp?: Date;
  revenue?: number;
  platform?: string;
  category?: string;
}
