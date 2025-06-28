#!/usr/bin/env python3
"""
Real Google Trends API Integration for AI Affiliate Platform
Ersätter mock trends med riktig data från Google Trends
"""

import pandas as pd
import json
import time
import random
from datetime import datetime, timedelta
from pytrends.request import TrendReq

class RealGoogleTrendsAnalyzer:
    def __init__(self):
        """Initialize Google Trends connection"""
        try:
            # Create connection to Google Trends
            self.pytrends = TrendReq(hl='sv-SE', tz=60)  # Swedish locale
            print("✅ Google Trends connection established")
        except Exception as e:
            print(f"❌ Error connecting to Google Trends: {e}")
            self.pytrends = None
    
    def get_trending_keywords(self, categories=['elektronik', 'mode', 'hem', 'sport', 'hälsa']):
        """Get real trending keywords from Google Trends"""
        trending_data = []
        
        if not self.pytrends:
            return self._get_fallback_trends()
        
        try:
            for category in categories:
                print(f"📊 Analyzing trends for: {category}")
                
                # Build keyword list for this category
                keywords = self._get_category_keywords(category)
                
                # Get trends data (max 5 keywords at a time)
                for i in range(0, len(keywords), 5):
                    batch = keywords[i:i+5]
                    try:
                        self.pytrends.build_payload(batch, timeframe='now 7-d', geo='SE')
                        interest_df = self.pytrends.interest_over_time()
                        
                        if not interest_df.empty:
                            # Get average interest for each keyword
                            for keyword in batch:
                                if keyword in interest_df.columns:
                                    avg_interest = interest_df[keyword].mean()
                                    if avg_interest > 10:  # Only include trending keywords
                                        trending_data.append({
                                            'keyword': keyword,
                                            'category': category,
                                            'interest_score': int(avg_interest),
                                            'trend_direction': self._calculate_trend_direction(interest_df[keyword]),
                                            'search_volume': self._estimate_search_volume(avg_interest),
                                            'last_updated': datetime.now().isoformat()
                                        })
                        
                        # Respect rate limits
                        time.sleep(random.uniform(1, 3))
                        
                    except Exception as e:
                        print(f"⚠️ Error processing batch {batch}: {e}")
                        continue
                        
        except Exception as e:
            print(f"❌ Error getting trends: {e}")
            return self._get_fallback_trends()
        
        # Sort by interest score
        trending_data.sort(key=lambda x: x['interest_score'], reverse=True)
        return trending_data[:20]  # Top 20 trends
    
    def get_product_trends(self, product_keywords):
        """Analyze trends for specific product keywords"""
        product_trends = []
        
        if not self.pytrends:
            return self._get_fallback_product_trends()
        
        try:
            # Process products in batches
            for i in range(0, len(product_keywords), 5):
                batch = product_keywords[i:i+5]
                
                try:
                    self.pytrends.build_payload(batch, timeframe='today 3-m', geo='SE')
                    interest_df = self.pytrends.interest_over_time()
                    
                    if not interest_df.empty:
                        for product in batch:
                            if product in interest_df.columns:
                                recent_interest = interest_df[product].tail(7).mean()
                                trend_direction = self._calculate_trend_direction(interest_df[product])
                                
                                product_trends.append({
                                    'product': product,
                                    'current_interest': int(recent_interest) if recent_interest > 0 else 1,
                                    'trend_direction': trend_direction,
                                    'peak_interest': int(interest_df[product].max()),
                                    'recommendation': self._get_product_recommendation(recent_interest, trend_direction),
                                    'last_updated': datetime.now().isoformat()
                                })
                    
                    time.sleep(random.uniform(1, 2))
                    
                except Exception as e:
                    print(f"⚠️ Error processing product batch {batch}: {e}")
                    continue
                    
        except Exception as e:
            print(f"❌ Error getting product trends: {e}")
            return self._get_fallback_product_trends()
        
        return product_trends
    
    def get_seasonal_insights(self):
        """Get seasonal trending insights"""
        current_month = datetime.now().month
        seasonal_keywords = {
            12: ['julklappar', 'vintersport', 'värmekälla'],
            1: ['träning', 'hälsa', 'organisering'],
            2: ['valentines', 'choklad', 'romantik'],
            3: ['vårstädning', 'trädgård', 'allergi'],
            4: ['påsk', 'cykel', 'utomhus'],
            5: ['mothers day', 'trädgård', 'sommar'],
            6: ['midsommar', 'grill', 'semester'],
            7: ['semester', 'camping', 'badkläder'],
            8: ['skola', 'back to school', 'höst'],
            9: ['skola', 'jackor', 'inredning'],
            10: ['halloween', 'höst', 'belysning'],
            11: ['black friday', 'jul', 'shopping']
        }
        
        current_keywords = seasonal_keywords.get(current_month, ['mode', 'elektronik', 'hem'])
        return self.get_trending_keywords(current_keywords)
    
    def _get_category_keywords(self, category):
        """Get relevant keywords for each category"""
        category_keywords = {
            'elektronik': ['iphone', 'samsung', 'laptop', 'hörlurar', 'tv', 'kamera', 'gaming'],
            'mode': ['sneakers', 'jeans', 'klänning', 'väska', 'klocka', 'smycken', 'jacka'],
            'hem': ['möbler', 'lampor', 'kök', 'vardagsrum', 'säng', 'förvaring', 'inredning'],
            'sport': ['löpning', 'gym', 'yoga', 'cykel', 'fotboll', 'tennis', 'träning'],
            'hälsa': ['kosttillskott', 'hudvård', 'massage', 'wellness', 'meditation', 'sömn']
        }
        return category_keywords.get(category, ['produkter', 'shopping', 'online'])
    
    def _calculate_trend_direction(self, data_series):
        """Calculate if trend is up, down, or stable"""
        if len(data_series) < 2:
            return 'stable'
        
        recent_avg = data_series.tail(3).mean()
        older_avg = data_series.head(3).mean()
        
        if recent_avg > older_avg * 1.2:
            return 'up'
        elif recent_avg < older_avg * 0.8:
            return 'down'
        else:
            return 'stable'
    
    def _estimate_search_volume(self, interest_score):
        """Estimate search volume from interest score"""
        # Rough estimation based on Google Trends scaling
        volume_ranges = {
            (80, 100): '100K+',
            (60, 79): '50K-100K',
            (40, 59): '10K-50K',
            (20, 39): '1K-10K',
            (0, 19): '<1K'
        }
        
        for (min_score, max_score), volume in volume_ranges.items():
            if min_score <= interest_score <= max_score:
                return volume
        return '<1K'
    
    def _get_product_recommendation(self, interest, trend_direction):
        """Get recommendation based on interest and trend"""
        if interest > 50 and trend_direction == 'up':
            return 'high_priority'
        elif interest > 30 and trend_direction in ['up', 'stable']:
            return 'medium_priority'
        elif trend_direction == 'down':
            return 'low_priority'
        else:
            return 'monitor'
    
    def _get_fallback_trends(self):
        """Fallback trending data if API fails"""
        return [
            {'keyword': 'iphone 15', 'category': 'elektronik', 'interest_score': 85, 'trend_direction': 'up', 'search_volume': '50K-100K'},
            {'keyword': 'air fryer', 'category': 'hem', 'interest_score': 72, 'trend_direction': 'stable', 'search_volume': '10K-50K'},
            {'keyword': 'gaming headset', 'category': 'elektronik', 'interest_score': 68, 'trend_direction': 'up', 'search_volume': '10K-50K'},
            {'keyword': 'yoga mat', 'category': 'sport', 'interest_score': 55, 'trend_direction': 'stable', 'search_volume': '1K-10K'},
            {'keyword': 'skincare routine', 'category': 'hälsa', 'interest_score': 45, 'trend_direction': 'up', 'search_volume': '1K-10K'}
        ]
    
    def _get_fallback_product_trends(self):
        """Fallback product trends if API fails"""
        return [
            {'product': 'wireless earbuds', 'current_interest': 75, 'trend_direction': 'up', 'recommendation': 'high_priority'},
            {'product': 'smart watch', 'current_interest': 65, 'trend_direction': 'stable', 'recommendation': 'medium_priority'},
            {'product': 'robot vacuum', 'current_interest': 58, 'trend_direction': 'up', 'recommendation': 'medium_priority'}
        ]

def main():
    """Test the Google Trends analyzer"""
    print("🚀 Starting Real Google Trends Analysis...")
    
    analyzer = RealGoogleTrendsAnalyzer()
    
    # Get general trending keywords
    print("\n📈 Getting trending keywords...")
    trends = analyzer.get_trending_keywords()
    
    print(f"\n✅ Found {len(trends)} trending keywords:")
    for trend in trends[:5]:  # Show top 5
        print(f"  🔥 {trend['keyword']} - {trend['category']} - Score: {trend['interest_score']} ({trend['trend_direction']})")
    
    # Analyze specific products
    print("\n📊 Analyzing product trends...")
    product_keywords = ['iphone', 'samsung galaxy', 'airpods', 'nintendo switch', 'ps5']
    product_trends = analyzer.get_product_trends(product_keywords)
    
    print(f"\n✅ Product trend analysis:")
    for product in product_trends[:3]:  # Show top 3
        print(f"  📱 {product['product']} - Interest: {product['current_interest']} - {product['recommendation']}")
    
    # Get seasonal insights
    print("\n🌟 Getting seasonal insights...")
    seasonal = analyzer.get_seasonal_insights()
    
    print(f"\n✅ Seasonal trends:")
    for trend in seasonal[:3]:
        print(f"  🎯 {trend['keyword']} - Score: {trend['interest_score']}")
    
    # Save results to JSON
    results = {
        'trending_keywords': trends,
        'product_trends': product_trends,
        'seasonal_insights': seasonal,
        'generated_at': datetime.now().isoformat(),
        'source': 'google_trends_api'
    }
    
    with open('real_trends_data.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print(f"\n💾 Results saved to real_trends_data.json")
    print("🎉 Google Trends analysis complete!")

if __name__ == "__main__":
    main()
