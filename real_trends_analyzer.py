"""
Real Google Trends Implementation for AI Affiliate Platform
Ersätt mock data med riktiga Google Trends
"""

from pytrends.request import TrendReq
import pandas as pd
from datetime import datetime, timedelta
import time
import logging

class RealTrendsAnalyzer:
    def __init__(self, geo='SE', language='sv-SE'):
        """
        Initialize with Swedish market focus
        """
        self.pytrends = TrendReq(hl=language, tz=360)
        self.geo = geo
        self.logger = logging.getLogger(__name__)
        
    def get_trending_products(self, categories=['electronics', 'fashion', 'home']):
        """
        Get current trending products for affiliate marketing
        """
        try:
            # Get daily trending searches for Sweden
            trending_searches = self.pytrends.trending_searches(pn='sweden')
            
            # Filter for product-related searches
            product_keywords = []
            product_indicators = [
                'köp', 'bäst', 'test', 'review', 'pris', 'billig', 
                'erbjudande', 'rea', 'kampanj', 'kvalitet'
            ]
            
            for trend in trending_searches[0][:20]:  # Top 20 trends
                if any(indicator in trend.lower() for indicator in product_indicators):
                    product_keywords.append(trend)
            
            # Analyze interest over time for each keyword
            trending_data = []
            for keyword in product_keywords[:5]:  # Limit to 5 to avoid rate limiting
                
                try:
                    # Build payload for this keyword
                    self.pytrends.build_payload([keyword], timeframe='today 12-m', geo=self.geo)
                    
                    # Get interest over time
                    interest_over_time = self.pytrends.interest_over_time()
                    
                    if not interest_over_time.empty:
                        # Calculate trend score
                        recent_avg = interest_over_time[keyword].tail(4).mean()  # Last 4 weeks
                        older_avg = interest_over_time[keyword].head(8).mean()   # First 8 weeks
                        
                        growth_rate = ((recent_avg - older_avg) / older_avg * 100) if older_avg > 0 else 0
                        
                        # Get related queries
                        related_queries = self.pytrends.related_queries()
                        rising_queries = []
                        if keyword in related_queries and related_queries[keyword]['rising'] is not None:
                            rising_queries = related_queries[keyword]['rising']['query'].head(3).tolist()
                        
                        trend_data = {
                            'keyword': keyword,
                            'trend_score': int(recent_avg),
                            'growth_rate': f"{growth_rate:+.1f}%",
                            'category': self._categorize_keyword(keyword),
                            'affiliate_potential': self._assess_affiliate_potential(keyword, recent_avg, growth_rate),
                            'rising_queries': rising_queries,
                            'last_updated': datetime.now().isoformat()
                        }
                        
                        trending_data.append(trend_data)
                        
                        # Rate limiting - Google Trends has strict limits
                        time.sleep(1)
                        
                except Exception as e:
                    self.logger.warning(f"Could not analyze keyword '{keyword}': {e}")
                    continue
            
            return trending_data
            
        except Exception as e:
            self.logger.error(f"Error getting trending products: {e}")
            return []
    
    def _categorize_keyword(self, keyword):
        """
        Categorize keywords for affiliate marketing
        """
        categories = {
            'electronics': ['hörlurar', 'telefon', 'dator', 'tv', 'kamera', 'gaming', 'mus', 'tangentbord'],
            'fashion': ['kläder', 'skor', 'jacka', 'jeans', 'tröja', 'kjol', 'mode'],
            'home': ['möbler', 'kök', 'vardagsrum', 'sovrum', 'dekoration', 'förvaring'],
            'fitness': ['träning', 'gym', 'yoga', 'löpning', 'cykel', 'protein', 'hälsa'],
            'beauty': ['makeup', 'hudvård', 'parfym', 'hår', 'naglar', 'skönhet']
        }
        
        keyword_lower = keyword.lower()
        for category, terms in categories.items():
            if any(term in keyword_lower for term in terms):
                return category
        
        return 'other'
    
    def _assess_affiliate_potential(self, keyword, trend_score, growth_rate):
        """
        Assess affiliate marketing potential
        """
        # High potential indicators
        high_potential_terms = ['köp', 'bäst', 'test', 'pris', 'billig', 'erbjudande']
        
        if any(term in keyword.lower() for term in high_potential_terms):
            if trend_score > 70 and growth_rate > 20:
                return 'VERY HIGH'
            elif trend_score > 50 and growth_rate > 10:
                return 'HIGH'
            else:
                return 'MEDIUM'
        else:
            if trend_score > 80 and growth_rate > 30:
                return 'HIGH'
            elif trend_score > 60 and growth_rate > 15:
                return 'MEDIUM'
            else:
                return 'LOW'
    
    def get_seasonal_trends(self, keyword, timeframe='today 12-m'):
        """
        Get seasonal trend data for a specific keyword
        """
        try:
            self.pytrends.build_payload([keyword], timeframe=timeframe, geo=self.geo)
            interest_over_time = self.pytrends.interest_over_time()
            
            if not interest_over_time.empty:
                # Extract seasonal patterns
                monthly_data = interest_over_time.groupby(interest_over_time.index.month)[keyword].mean()
                
                peak_months = monthly_data.nlargest(3).index.tolist()
                low_months = monthly_data.nsmallest(3).index.tolist()
                
                month_names = {
                    1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'Maj', 6: 'Jun',
                    7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Okt', 11: 'Nov', 12: 'Dec'
                }
                
                return {
                    'keyword': keyword,
                    'peak_months': [month_names[m] for m in peak_months],
                    'low_months': [month_names[m] for m in low_months],
                    'current_month_score': monthly_data.get(datetime.now().month, 0),
                    'is_peak_season': datetime.now().month in peak_months
                }
            
        except Exception as e:
            self.logger.error(f"Error getting seasonal trends for '{keyword}': {e}")
            
        return None

# Usage example:
if __name__ == "__main__":
    # Initialize for Swedish market
    analyzer = RealTrendsAnalyzer(geo='SE', language='sv-SE')
    
    # Get current trending products
    trending = analyzer.get_trending_products()
    
    print("🔥 REAL GOOGLE TRENDS DATA:")
    for trend in trending:
        print(f"📈 {trend['keyword']}: {trend['trend_score']} ({trend['growth_rate']})")
        print(f"   Category: {trend['category']}")
        print(f"   Potential: {trend['affiliate_potential']}")
        if trend['rising_queries']:
            print(f"   Rising: {', '.join(trend['rising_queries'])}")
        print()
        
    # Example: Get seasonal data for a specific product
    seasonal = analyzer.get_seasonal_trends('bluetooth hörlurar')
    if seasonal:
        print(f"📅 Seasonal data for '{seasonal['keyword']}':")
        print(f"   Peak months: {', '.join(seasonal['peak_months'])}")
        print(f"   Low months: {', '.join(seasonal['low_months'])}")
        print(f"   Current season: {'PEAK' if seasonal['is_peak_season'] else 'NORMAL'}")
