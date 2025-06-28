#!/usr/bin/env python3
"""
Quick Google Trends Demo för AI Affiliate Platform
Kör detta för att se hur Google Trends kan hjälpa din affiliate-business
"""

import asyncio
import requests
import json
from datetime import datetime, timedelta

# Simulerar Google Trends API (använd pytrends för riktiga data)
def simulate_google_trends_for_affiliate():
    """
    Simulerar trending data för affiliate-relevanta sökord
    I verkligheten: använd pytrends.request.TrendReq
    """
    
    # Mock data baserat på verkliga trends
    trending_data = {
        "current_date": datetime.now().strftime("%Y-%m-%d"),
        "trending_products": [
            {
                "keyword": "bluetooth hörlurar",
                "trend_score": 85,
                "growth": "+45%",
                "category": "Electronics",
                "affiliate_potential": "HIGH",
                "commission_rate": "3-8%",
                "competition": "Medium",
                "seasonal": "Year-round"
            },
            {
                "keyword": "gaming mus",
                "trend_score": 78,
                "growth": "+32%", 
                "category": "Gaming",
                "affiliate_potential": "HIGH",
                "commission_rate": "4-10%",
                "competition": "High",
                "seasonal": "Holiday spike"
            },
            {
                "keyword": "yoga matta",
                "trend_score": 92,
                "growth": "+67%",
                "category": "Fitness",
                "affiliate_potential": "VERY HIGH",
                "commission_rate": "5-12%",
                "competition": "Low",
                "seasonal": "New Year spike"
            },
            {
                "keyword": "luftfuktare",
                "trend_score": 88,
                "growth": "+55%",
                "category": "Home",
                "affiliate_potential": "HIGH",
                "commission_rate": "3-7%",
                "competition": "Medium",
                "seasonal": "Winter spike"
            },
            {
                "keyword": "portable ssd",
                "trend_score": 71,
                "growth": "+28%",
                "category": "Tech",
                "affiliate_potential": "MEDIUM",
                "commission_rate": "2-5%",
                "competition": "High",
                "seasonal": "Back-to-school"
            }
        ],
        "recommendations": [
            "🔥 Yoga matta har +67% trend - lägg till nu!",
            "📈 Luftfuktare perfekt för vintersäsong",
            "🎯 Bluetooth hörlurar stable high performer",
            "⚠️ Gaming mus - hög konkurrens men bra commission",
            "💡 Portable SSD - nischad men steady"
        ]
    }
    
    return trending_data

def suggest_affiliate_products(trending_keyword, category):
    """
    Föreslår specifika affiliate-produkter baserat på trends
    """
    
    product_suggestions = {
        "bluetooth hörlurar": [
            "Sony WH-1000XM5 - Premium, $399, 8% commission",
            "Apple AirPods Pro - Populär, $249, 3% commission", 
            "Bose QuietComfort - Kvalitet, $329, 6% commission"
        ],
        "gaming mus": [
            "Logitech G Pro X - Esports, $149, 5% commission",
            "Razer DeathAdder V3 - Populär, $89, 7% commission",
            "SteelSeries Rival 650 - Wireless, $129, 6% commission"
        ],
        "yoga matta": [
            "Manduka Pro - Premium, $120, 12% commission",
            "Gaiam Yoga Mat - Budget, $25, 8% commission",
            "Liforme Yoga Mat - Eco, $140, 10% commission"
        ],
        "luftfuktare": [
            "Dyson AM10 - Premium, $299, 4% commission",
            "Levoit LV600HH - Populär, $89, 7% commission",
            "Honeywell HCM350 - Reliable, $69, 6% commission"
        ],
        "portable ssd": [
            "Samsung T7 - Fast, $199, 3% commission",
            "SanDisk Extreme Pro - Robust, $179, 4% commission",
            "WD My Passport SSD - Affordable, $129, 5% commission"
        ]
    }
    
    return product_suggestions.get(trending_keyword, ["Inga förslag tillgängliga"])

def calculate_revenue_potential(trend_score, commission_rate, competition):
    """
    Beräknar potentiell månadsintäkt från trending produkt
    """
    
    # Enkel formel baserat på trend-score
    base_clicks = trend_score * 10  # 85 score = ~850 clicks/månad
    
    # Justera för konkurrens
    competition_factor = {
        "Low": 1.2,
        "Medium": 1.0, 
        "High": 0.7
    }
    
    adjusted_clicks = base_clicks * competition_factor.get(competition, 1.0)
    
    # Antag 5% conversion rate och genomsnittlig ordervärde $50
    conversions = adjusted_clicks * 0.05
    avg_order_value = 50
    commission_percent = float(commission_rate.split('-')[0].replace('%', '')) / 100
    
    monthly_revenue = conversions * avg_order_value * commission_percent
    
    return {
        "estimated_monthly_clicks": int(adjusted_clicks),
        "estimated_conversions": int(conversions),
        "estimated_monthly_revenue": f"${monthly_revenue:.2f}",
        "confidence": "Medium" if competition == "Medium" else "High" if competition == "Low" else "Low"
    }

def main():
    """
    Kör Google Trends demo
    """
    
    print("🔥 GOOGLE TRENDS DEMO - AI AFFILIATE PLATFORM")
    print("=" * 50)
    
    # Hämta trending data
    trends = simulate_google_trends_for_affiliate()
    
    print(f"📅 Datum: {trends['current_date']}")
    print(f"📊 Hittade {len(trends['trending_products'])} trending produkter")
    print()
    
    # Visa trending produkter
    print("🏆 TOP TRENDING PRODUKTER:")
    print("-" * 30)
    
    for i, product in enumerate(trends['trending_products'], 1):
        print(f"{i}. {product['keyword'].upper()}")
        print(f"   📈 Trend Score: {product['trend_score']}/100")
        print(f"   🚀 Growth: {product['growth']}")
        print(f"   💰 Commission: {product['commission_rate']}")
        print(f"   🎯 Potential: {product['affiliate_potential']}")
        print(f"   ⚖️ Competition: {product['competition']}")
        print()
        
        # Visa produktförslag
        suggestions = suggest_affiliate_products(product['keyword'], product['category'])
        print(f"   🛍️ Föreslagna produkter:")
        for suggestion in suggestions[:2]:  # Visa top 2
            print(f"      • {suggestion}")
        
        # Beräkna intäktspotential
        revenue = calculate_revenue_potential(
            product['trend_score'], 
            product['commission_rate'], 
            product['competition']
        )
        
        print(f"   💵 Uppskattad månadsintäkt: {revenue['estimated_monthly_revenue']}")
        print(f"   👆 Förväntade klick: {revenue['estimated_monthly_clicks']}")
        print(f"   🔄 Konverteringar: {revenue['estimated_conversions']}")
        print(f"   📊 Confidence: {revenue['confidence']}")
        print()
        print("-" * 50)
    
    # Visa rekommendationer
    print("💡 ACTIONABLE REKOMMENDATIONER:")
    for i, rec in enumerate(trends['recommendations'], 1):
        print(f"{i}. {rec}")
    
    print()
    print("🎯 NÄSTA STEG:")
    print("1. Installera: pip install pytrends")
    print("2. Integrera i admin panel")
    print("3. Setup daglig trend-check")
    print("4. Automatisera produkttillägg")
    print("5. Övervaka ROI per trend")

if __name__ == "__main__":
    main()
