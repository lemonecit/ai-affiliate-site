#!/usr/bin/env python3
"""
Automated Google Trends Scheduler for AI Affiliate Platform
Kör trends-analys automatiskt och uppdaterar affiliate-produkter
"""

import schedule
import time
import json
import os
import requests
from datetime import datetime, timedelta
from real_google_trends_analyzer import RealGoogleTrendsAnalyzer

class AutomatedTrendsScheduler:
    def __init__(self):
        self.analyzer = RealGoogleTrendsAnalyzer()
        self.trends_file = 'real_trends_data.json'
        self.affiliate_suggestions_file = 'affiliate_suggestions.json'
        
    def daily_trends_update(self):
        """Kör daglig trends-analys"""
        print(f"🔄 {datetime.now().strftime('%Y-%m-%d %H:%M')} - Starting daily trends update...")
        
        try:
            # Hämta trending keywords
            trends = self.analyzer.get_trending_keywords()
            
            # Analysera specifika produkter baserat på trending keywords
            top_keywords = [t['keyword'] for t in trends[:10]]
            product_trends = self.analyzer.get_product_trends(top_keywords)
            
            # Få säsongsinsikter
            seasonal = self.analyzer.get_seasonal_insights()
            
            # Kombinera all data
            full_data = {
                'trending_keywords': trends,
                'product_trends': product_trends,
                'seasonal_insights': seasonal,
                'generated_at': datetime.now().isoformat(),
                'source': 'automated_scheduler',
                'update_frequency': 'daily'
            }
            
            # Spara till fil
            with open(self.trends_file, 'w', encoding='utf-8') as f:
                json.dump(full_data, f, indent=2, ensure_ascii=False)
            
            # Generera affiliate-förslag
            suggestions = self.generate_affiliate_suggestions(trends, product_trends)
            self.save_affiliate_suggestions(suggestions)
            
            print(f"✅ Daily trends update complete - {len(trends)} keywords analyzed")
            
        except Exception as e:
            print(f"❌ Error in daily update: {e}")
    
    def weekly_deep_analysis(self):
        """Kör veckovis djupanalys"""
        print(f"🔍 {datetime.now().strftime('%Y-%m-%d %H:%M')} - Starting weekly deep analysis...")
        
        try:
            # Expandera kategorier för djupare analys
            extended_categories = [
                'elektronik', 'mode', 'hem', 'sport', 'hälsa', 
                'barn', 'kök', 'trädgård', 'bil', 'verktyg',
                'skönhet', 'husdjur', 'bok', 'musik', 'gaming'
            ]
            
            deep_trends = self.analyzer.get_trending_keywords(extended_categories)
            
            # Analysera konkurrenskraft för varje trend
            competitive_analysis = self.analyze_competition(deep_trends)
            
            # Skapa veckorapport
            weekly_report = {
                'deep_trends': deep_trends,
                'competitive_analysis': competitive_analysis,
                'opportunity_score': self.calculate_opportunity_scores(deep_trends),
                'week_of': datetime.now().strftime('%Y-W%U'),
                'generated_at': datetime.now().isoformat()
            }
            
            # Spara veckorapport
            with open(f"weekly_trends_{datetime.now().strftime('%Y%m%d')}.json", 'w', encoding='utf-8') as f:
                json.dump(weekly_report, f, indent=2, ensure_ascii=False)
            
            print(f"✅ Weekly deep analysis complete - {len(deep_trends)} trends analyzed")
            
        except Exception as e:
            print(f"❌ Error in weekly analysis: {e}")
    
    def generate_affiliate_suggestions(self, trends, product_trends):
        """Generera affiliate-förslag baserat på trends"""
        suggestions = []
        
        # Förslag baserat på trending keywords
        for trend in trends[:10]:
            if trend['interest_score'] > 40 and trend['trend_direction'] in ['up', 'stable']:
                suggestion = {
                    'keyword': trend['keyword'],
                    'category': trend['category'],
                    'priority': 'high' if trend['interest_score'] > 60 else 'medium',
                    'reasoning': f"Trending keyword with {trend['interest_score']} interest score and {trend['trend_direction']} trend",
                    'suggested_platforms': self.get_suggested_platforms(trend['category']),
                    'estimated_potential': self.estimate_earning_potential(trend),
                    'action_items': [
                        f"Search for {trend['keyword']} products on suggested platforms",
                        f"Create affiliate links for top {trend['keyword']} products",
                        f"Write SEO content targeting '{trend['keyword']}' keyword"
                    ]
                }
                suggestions.append(suggestion)
        
        # Förslag baserat på produkttrender
        for product in product_trends:
            if product['recommendation'] in ['high_priority', 'medium_priority']:
                suggestion = {
                    'product': product['product'],
                    'priority': product['recommendation'].replace('_priority', ''),
                    'current_interest': product['current_interest'],
                    'trend_direction': product['trend_direction'],
                    'reasoning': f"Product with {product['current_interest']} interest and {product['trend_direction']} trend",
                    'suggested_platforms': ['amazon', 'aliexpress'],
                    'action_items': [
                        f"Find top {product['product']} products on Amazon",
                        f"Create affiliate links for {product['product']}",
                        f"Monitor {product['product']} price trends"
                    ]
                }
                suggestions.append(suggestion)
        
        return suggestions
    
    def get_suggested_platforms(self, category):
        """Föreslå bästa affiliate-plattformar för varje kategori"""
        platform_mapping = {
            'elektronik': ['amazon', 'aliexpress', 'ksp'],
            'mode': ['aliexpress', 'amazon'],
            'hem': ['amazon', 'aliexpress'],
            'sport': ['amazon', 'aliexpress'],
            'hälsa': ['amazon', 'aliexpress'],
            'kök': ['amazon', 'aliexpress'],
            'gaming': ['amazon', 'ksp'],
            'default': ['amazon', 'aliexpress']
        }
        return platform_mapping.get(category, platform_mapping['default'])
    
    def estimate_earning_potential(self, trend):
        """Uppskatta intäktspotential baserat på trend-data"""
        base_potential = {
            '100K+': 500,
            '50K-100K': 300,
            '10K-50K': 150,
            '1K-10K': 50,
            '<1K': 20
        }
        
        base = base_potential.get(trend['search_volume'], 50)
        
        # Justera baserat på trend-riktning
        multiplier = {
            'up': 1.5,
            'stable': 1.0,
            'down': 0.7
        }
        
        estimated = base * multiplier.get(trend['trend_direction'], 1.0)
        return f"${int(estimated)}-{int(estimated * 2)}/month"
    
    def analyze_competition(self, trends):
        """Analysera konkurrens för trending keywords"""
        competition_analysis = []
        
        for trend in trends[:5]:  # Analysera top 5
            analysis = {
                'keyword': trend['keyword'],
                'competition_level': self.estimate_competition_level(trend),
                'seo_difficulty': self.estimate_seo_difficulty(trend),
                'opportunity_score': self.calculate_opportunity_score(trend)
            }
            competition_analysis.append(analysis)
        
        return competition_analysis
    
    def estimate_competition_level(self, trend):
        """Uppskatta konkurrensnivå"""
        if trend['interest_score'] > 70:
            return 'high'
        elif trend['interest_score'] > 40:
            return 'medium'
        else:
            return 'low'
    
    def estimate_seo_difficulty(self, trend):
        """Uppskatta SEO-svårighet"""
        # Enkel heuristik baserat på popularitet
        if trend['interest_score'] > 80:
            return 'hard'
        elif trend['interest_score'] > 50:
            return 'medium'
        else:
            return 'easy'
    
    def calculate_opportunity_score(self, trend):
        """Beräkna möjlighetspoäng (1-100)"""
        interest = trend['interest_score']
        direction_bonus = {'up': 20, 'stable': 10, 'down': -10}
        
        score = interest + direction_bonus.get(trend['trend_direction'], 0)
        return min(100, max(0, score))
    
    def calculate_opportunity_scores(self, trends):
        """Beräkna möjlighetspoäng för alla trends"""
        scored_trends = []
        for trend in trends:
            scored_trend = trend.copy()
            scored_trend['opportunity_score'] = self.calculate_opportunity_score(trend)
            scored_trends.append(scored_trend)
        
        # Sortera efter möjlighetspoäng
        scored_trends.sort(key=lambda x: x['opportunity_score'], reverse=True)
        return scored_trends[:10]  # Top 10 möjligheter
    
    def save_affiliate_suggestions(self, suggestions):
        """Spara affiliate-förslag till fil"""
        data = {
            'suggestions': suggestions,
            'generated_at': datetime.now().isoformat(),
            'total_suggestions': len(suggestions),
            'high_priority_count': len([s for s in suggestions if s.get('priority') == 'high']),
            'next_review_date': (datetime.now() + timedelta(days=1)).isoformat()
        }
        
        with open(self.affiliate_suggestions_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(f"💡 Generated {len(suggestions)} affiliate suggestions")
    
    def start_scheduler(self):
        """Starta automatisk schemaläggning"""
        print("🚀 Starting Automated Google Trends Scheduler...")
        print("📅 Schedule:")
        print("  - Daily trends update: 06:00")
        print("  - Weekly deep analysis: Monday 08:00")
        
        # Schemalägg jobb
        schedule.every().day.at("06:00").do(self.daily_trends_update)
        schedule.every().monday.at("08:00").do(self.weekly_deep_analysis)
        
        # Kör omedelbar uppdatering
        print("🔄 Running initial trends update...")
        self.daily_trends_update()
        
        print("✅ Scheduler started! Running continuously...")
        print("Press Ctrl+C to stop")
        
        try:
            while True:
                schedule.run_pending()
                time.sleep(60)  # Vänta 1 minut mellan kontroller
        except KeyboardInterrupt:
            print("\n⏹️  Scheduler stopped by user")

def main():
    """Kör automatisk trends-scheduler"""
    scheduler = AutomatedTrendsScheduler()
    
    # För testning - kör en gång istället för kontinuerligt
    print("🧪 Running one-time trends analysis for testing...")
    scheduler.daily_trends_update()
    
    # Uncomment för kontinuerlig körning:
    # scheduler.start_scheduler()

if __name__ == "__main__":
    main()
