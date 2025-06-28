"""
Flask API för AI Affiliate Platform
Kopplar samman ML-analys med webben
"""

from flask import Flask, jsonify, request, render_template_string
from flask_cors import CORS
import json
import os
from datetime import datetime
import threading
import time

# Importera vår ML-modul
from local_market_ml import LocalMarketMLAnalyzer

app = Flask(__name__)
CORS(app)  # Tillåt cross-origin requests från webben

# Globala variabler
ml_analyzer = None
last_analysis = None
analysis_in_progress = False


def initialize_ml():
    """Initialisera ML-analyzer"""
    global ml_analyzer
    try:
        ml_analyzer = LocalMarketMLAnalyzer(
            primary_country="SE",
            target_countries=["SE", "NO", "DK", "FI", "DE"]
        )
        print("✅ ML Analyzer initialiserad")
    except Exception as e:
        print(f"❌ Fel vid ML-initialisering: {e}")


@app.route('/')
def index():
    """Huvudsida med API-dokumentation"""
    return render_template_string("""
    <!DOCTYPE html>
    <html>
    <head>
        <title>AI Affiliate API</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; }
            .endpoint { background: #f8fafc; padding: 1rem; margin: 1rem 0; border-radius: 0.5rem; border-left: 4px solid #2563eb; }
            .method { background: #22c55e; color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; }
            code { background: #f3f4f6; padding: 0.25rem 0.5rem; border-radius: 0.25rem; }
        </style>
    </head>
    <body>
        <h1>🤖 AI Affiliate Platform API</h1>
        <p>REST API för marknadsanalys och ML-funktioner</p>
        
        <h2>📡 Tillgängliga Endpoints</h2>
        
        <div class="endpoint">
            <div><span class="method">GET</span> <code>/api/market/overview</code></div>
            <p>Hämtar övergripande marknadsöversikt för alla länder</p>
        </div>
        
        <div class="endpoint">
            <div><span class="method">GET</span> <code>/api/market/country/{country_code}</code></div>
            <p>Detaljerad marknadsanalys för specifikt land (SE, NO, DK, FI, DE)</p>
        </div>
        
        <div class="endpoint">
            <div><span class="method">POST</span> <code>/api/analysis/product</code></div>
            <p>Analysera specifik produkt för alla marknader</p>
            <pre>{"name": "iPhone 15", "category": "elektronik", "price": 12000, "platform": "amazon"}</pre>
        </div>
        
        <div class="endpoint">
            <div><span class="method">POST</span> <code>/api/analysis/bulk</code></div>
            <p>Bulk-analys av flera produkter</p>
        </div>
        
        <div class="endpoint">
            <div><span class="method">GET</span> <code>/api/recommendations</code></div>
            <p>AI-genererade marknadsföringsrekommendationer</p>
        </div>
        
        <div class="endpoint">
            <div><span class="method">GET</span> <code>/api/report/generate</code></div>
            <p>Generera fullständig marknadsrapport</p>
        </div>
        
        <h2>📊 Status</h2>
        <p><strong>ML Analyzer:</strong> {{ 'Aktiv' if ml_analyzer else 'Inte initialiserad' }}</p>
        <p><strong>Senaste analys:</strong> {{ last_analysis.get('timestamp', 'Aldrig') if last_analysis else 'Aldrig' }}</p>
        <p><strong>Server tid:</strong> {{ now }}</p>
    </body>
    </html>
    """, ml_analyzer=ml_analyzer, last_analysis=last_analysis, now=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))


@app.route('/api/market/overview')
def market_overview():
    """Övergripande marknadsöversikt"""
    if not ml_analyzer:
        return jsonify({"error": "ML Analyzer inte initialiserad"}), 500

    try:
        overview = {
            "timestamp": datetime.now().isoformat(),
            "markets": {},
            "summary": {
                "total_markets": len(ml_analyzer.target_countries),
                "best_market": None,
                "best_category": None,
                "overall_score": 0
            }
        }

        # Analysera varje marknad
        market_scores = {}
        for country in ml_analyzer.target_countries:
            market_data = ml_analyzer.market_data[country]
            cultural_data = ml_analyzer.cultural_insights[country]

            # Beräkna marknadspoäng
            market_score = (
                market_data["gdp_per_capita"] / 50000 * 0.3 +
                market_data["ecommerce_penetration"] * 0.4 +
                market_data["internet_penetration"] * 0.3
            ) * 100

            market_scores[country] = market_score

            overview["markets"][country] = {
                "score": round(market_score, 1),
                "population": market_data["population"],
                "ecommerce_penetration": market_data["ecommerce_penetration"] * 100,
                "mobile_usage": market_data["mobile_shopping_ratio"] * 100,
                "price_sensitivity": cultural_data["price_sensitivity"] * 100,
                "popular_categories": market_data["popular_categories"][:3],
                "payment_methods": market_data["payment_methods"][:2]
            }

        # Bestäm bästa marknad
        best_market = max(market_scores, key=market_scores.get)
        overview["summary"]["best_market"] = best_market
        overview["summary"]["overall_score"] = round(
            sum(market_scores.values()) / len(market_scores), 1)

        # Bestäm bästa kategori (mest populär totalt)
        category_counts = {}
        for country_data in overview["markets"].values():
            for category in country_data["popular_categories"]:
                category_counts[category] = category_counts.get(
                    category, 0) + 1

        if category_counts:
            overview["summary"]["best_category"] = max(
                category_counts, key=category_counts.get)

        return jsonify(overview)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/market/country/<country_code>')
def market_country_details(country_code):
    """Detaljerad marknadsanalys för specifikt land"""
    if not ml_analyzer:
        return jsonify({"error": "ML Analyzer inte initialiserad"}), 500

    country_code = country_code.upper()
    if country_code not in ml_analyzer.target_countries:
        return jsonify({"error": f"Land {country_code} stöds inte"}), 400

    try:
        # Analysera varje kategori för landet
        categories = ["elektronik", "mode", "sport", "hem", "resor", "böcker"]
        category_analysis = {}

        for category in categories:
            market_insight = ml_analyzer.analyze_local_market(
                country_code, category)
            category_analysis[category] = {
                "popularity_score": round(market_insight.popularity_score * 100, 1),
                "peak_months": market_insight.peak_months,
                "local_competitors": market_insight.local_competitors[:3],
                "cultural_fit": {
                    "design_fit": round(market_insight.cultural_factors["design_fit"] * 100, 1),
                    "trust_alignment": round(market_insight.cultural_factors["trust_alignment"] * 100, 1),
                    "behavior_match": round(market_insight.cultural_factors["behavior_match"] * 100, 1)
                }
            }

        # Grundläggande marknadsdata
        market_data = ml_analyzer.market_data[country_code]
        cultural_data = ml_analyzer.cultural_insights[country_code]

        result = {
            "country": country_code,
            "timestamp": datetime.now().isoformat(),
            "market_overview": {
                "population": market_data["population"],
                "gdp_per_capita": market_data["gdp_per_capita"],
                "ecommerce_penetration": market_data["ecommerce_penetration"] * 100,
                "mobile_shopping": market_data["mobile_shopping_ratio"] * 100,
                "avg_order_value": market_data["avg_order_value"]
            },
            "cultural_insights": {
                "design_preference": cultural_data["design_preference"],
                "trust_factors": cultural_data["trust_factors"],
                "shopping_behavior": cultural_data["shopping_behavior"],
                "language_barrier": cultural_data["language_barrier"] * 100,
                "price_sensitivity": cultural_data["price_sensitivity"] * 100,
                "brand_loyalty": cultural_data["brand_loyalty"] * 100
            },
            "seasonal_trends": market_data["seasonal_shopping"],
            "category_analysis": category_analysis,
            "payment_methods": market_data["payment_methods"],
            "recommendations": ml_analyzer.generate_marketing_recommendations(
                {"category": "allmän", "platform": "allmän"},
                ml_analyzer.analyze_local_market(country_code, "allmän"),
                cultural_data
            )
        }

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/analysis/product', methods=['POST'])
def analyze_product():
    """Analysera specifik produkt för alla marknader"""
    if not ml_analyzer:
        return jsonify({"error": "ML Analyzer inte initialiserad"}), 500

    try:
        product_data = request.get_json()

        if not product_data:
            return jsonify({"error": "Produktdata saknas"}), 400

        # Validera obligatoriska fält
        required_fields = ['name', 'category', 'price', 'platform']
        for field in required_fields:
            if field not in product_data:
                return jsonify({"error": f"Obligatoriskt fält saknas: {field}"}), 400

        result = {
            "product": product_data,
            "timestamp": datetime.now().isoformat(),
            "market_analysis": {}
        }

        # Analysera för varje marknad
        for country in ml_analyzer.target_countries:
            local_score = ml_analyzer.score_product_for_local_market(
                product_data, country)

            result["market_analysis"][country] = {
                "local_appeal_score": round(local_score.local_appeal_score * 100, 1),
                "cultural_fit_score": round(local_score.cultural_fit_score * 100, 1),
                "predicted_monthly_clicks": local_score.predicted_local_clicks,
                "predicted_monthly_revenue": round(local_score.predicted_local_revenue, 2),
                "language_barrier": round(local_score.language_barrier_score * 100, 1),
                "shipping_feasibility": round(local_score.shipping_feasibility * 100, 1),
                "competition_level": round(local_score.local_competition_level * 100, 1),
                "recommended_pricing": local_score.recommended_pricing,
                "marketing_recommendations": local_score.marketing_recommendations[:3]
            }

        # Bestäm bästa marknader
        market_scores = {country: data["local_appeal_score"]
                         for country, data in result["market_analysis"].items()}
        sorted_markets = sorted(market_scores.items(),
                                key=lambda x: x[1], reverse=True)

        result["summary"] = {
            "best_markets": [{"country": country, "score": score} for country, score in sorted_markets[:3]],
            "total_predicted_clicks": sum(data["predicted_monthly_clicks"] for data in result["market_analysis"].values()),
            "total_predicted_revenue": round(sum(data["predicted_monthly_revenue"] for data in result["market_analysis"].values()), 2)
        }

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/analysis/bulk', methods=['POST'])
def bulk_analysis():
    """Bulk-analys av flera produkter"""
    if not ml_analyzer:
        return jsonify({"error": "ML Analyzer inte initialiserad"}), 500

    try:
        data = request.get_json()
        products = data.get('products', [])

        if not products:
            return jsonify({"error": "Produktlista saknas"}), 400

        # Generera rapport för alla produkter
        report = ml_analyzer.generate_market_report(products)

        # Formatera för API
        api_response = {
            "timestamp": report["generated_at"],
            "total_products": report["total_products"],
            "countries_analyzed": report["countries_analyzed"],
            "summary": report["strategic_insights"],
            "market_analysis": report["market_analysis"],
            "top_recommendations": {}
        }

        # Hämta topp-rekommendationer per marknad
        for country, recommendations in report["product_recommendations"].items():
            # Top 5
            api_response["top_recommendations"][country] = recommendations[:5]

        return jsonify(api_response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/recommendations')
def get_recommendations():
    """AI-genererade marknadsföringsrekommendationer"""
    if not ml_analyzer:
        return jsonify({"error": "ML Analyzer inte initialiserad"}), 500

    try:
        recommendations = {
            "timestamp": datetime.now().isoformat(),
            "general": [
                {
                    "title": "📱 Mobil-optimering är kritisk",
                    "description": "Genomsnittligt 63% av all nordisk e-handel sker via mobil",
                    "priority": "high",
                    "impact": "high"
                },
                {
                    "title": "🛒 Black Friday-förberedelser",
                    "description": "November-December visar 40-60% högre aktivitet i alla nordiska marknader",
                    "priority": "high",
                    "impact": "high"
                },
                {
                    "title": "🌱 Hållbarhetsfokus",
                    "description": "Nordiska kunder prioriterar miljövänliga alternativ (70%+ viktigt)",
                    "priority": "medium",
                    "impact": "medium"
                },
                {
                    "title": "💳 Lokala betalningsmetoder",
                    "description": "Swish (SE), Vipps (NO), MobilePay (DK) ökar konvertering med 25%",
                    "priority": "medium",
                    "impact": "high"
                }
            ],
            "country_specific": {}
        }

        # Lägg till landspecifika rekommendationer
        for country in ml_analyzer.target_countries:
            market_insight = ml_analyzer.analyze_local_market(
                country, "allmän")
            culture = ml_analyzer.cultural_insights[country]

            country_recs = ml_analyzer.generate_marketing_recommendations(
                {"category": "allmän", "platform": "allmän"},
                market_insight,
                culture
            )

            recommendations["country_specific"][country] = [
                {"text": rec, "priority": "medium"} for rec in country_recs[:4]
            ]

        return jsonify(recommendations)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/report/generate')
def generate_report():
    """Generera fullständig marknadsrapport"""
    global analysis_in_progress, last_analysis

    if not ml_analyzer:
        return jsonify({"error": "ML Analyzer inte initialiserad"}), 500

    if analysis_in_progress:
        return jsonify({"error": "Analys pågår redan"}), 409

    try:
        analysis_in_progress = True

        # Exempel-produkter för rapport
        sample_products = [
            {
                "id": "1",
                "name": "iPhone 15 Pro",
                "category": "elektronik",
                "platform": "amazon",
                "price": 12000,
                "rating": 4.5,
                "reviews_count": 1500
            },
            {
                "id": "2",
                "name": "Nike Air Max",
                "category": "sport",
                "platform": "amazon",
                "price": 1200,
                "rating": 4.3,
                "reviews_count": 800
            },
            {
                "id": "3",
                "name": "IKEA Desk Lamp",
                "category": "hem",
                "platform": "amazon",
                "price": 299,
                "rating": 4.1,
                "reviews_count": 250
            }
        ]

        # Generera rapport
        report = ml_analyzer.generate_market_report(sample_products)

        # Spara senaste analys
        last_analysis = {
            "timestamp": datetime.now().isoformat(),
            "summary": report["strategic_insights"]
        }

        analysis_in_progress = False
        return jsonify(report)

    except Exception as e:
        analysis_in_progress = False
        return jsonify({"error": str(e)}), 500


@app.route('/api/status')
def api_status():
    """API-status och hälsokontroll"""
    return jsonify({
        "status": "active",
        "timestamp": datetime.now().isoformat(),
        "ml_analyzer": ml_analyzer is not None,
        "analysis_in_progress": analysis_in_progress,
        "last_analysis": last_analysis["timestamp"] if last_analysis else None,
        "supported_countries": ml_analyzer.target_countries if ml_analyzer else [],
        "version": "1.0.0"
    })

# Hjälpfunktioner för utveckling


@app.route('/api/test/sample-data')
def get_sample_data():
    """Returnera exempel-data för testning"""
    return jsonify({
        "sample_product": {
            "name": "Gaming Headset Pro",
            "category": "elektronik",
            "platform": "amazon",
            "price": 899,
            "rating": 4.4,
            "reviews_count": 342
        },
        "sample_products": [
            {
                "name": "Wireless Mouse",
                "category": "elektronik",
                "platform": "amazon",
                "price": 299,
                "rating": 4.2,
                "reviews_count": 156
            },
            {
                "name": "Running Shoes",
                "category": "sport",
                "platform": "amazon",
                "price": 1299,
                "rating": 4.6,
                "reviews_count": 89
            }
        ]
    })


if __name__ == '__main__':
    print("🚀 Startar AI Affiliate Platform API...")

    # Initialisera ML i bakgrunden
    print("🤖 Initialiserar ML Analyzer...")
    initialize_ml()

    # Starta Flask-server
    app.run(
        host='127.0.0.1',
        port=5000,
        debug=True,
        threaded=True
    )
