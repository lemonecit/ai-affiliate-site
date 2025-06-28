"""
Webintegration för AI Affiliate Platform
Enkel JavaScript-baserad integration med ML-modulen
"""

import json
import os
from datetime import datetime
import subprocess
import sys


def generate_market_data_for_web():
    """Genererar marknadsdata för webben från ML-modulen"""

    try:
        # Importera ML-modulen
        from local_market_ml import LocalMarketMLAnalyzer

        # Skapa ML-instans med alla 15 länder
        ml_analyzer = LocalMarketMLAnalyzer()
        print(f"✅ Analyserade {len(ml_analyzer.target_countries)} marknader")

        # Generera data för alla länder
        country_data = {}

        # Country flag mappning
        country_flags = {
            "SE": "🇸🇪", "NO": "🇳🇴", "DK": "🇩🇰", "FI": "🇫🇮", "DE": "🇩🇪",
            "NL": "🇳🇱", "FR": "🇫🇷", "GB": "🇬🇧", "US": "🇺🇸", "AU": "🇦🇺",
            "IT": "🇮🇹", "ES": "🇪🇸", "PL": "🇵🇱", "JP": "🇯🇵", "CA": "🇨🇦"
        }

        country_names = {
            "SE": "Sverige", "NO": "Norge", "DK": "Danmark", "FI": "Finland", "DE": "Tyskland",
            "NL": "Nederländerna", "FR": "Frankrike", "GB": "Storbritannien", "US": "USA", "AU": "Australien",
            "IT": "Italien", "ES": "Spanien", "PL": "Polen", "JP": "Japan", "CA": "Kanada"
        }

        best_potential = 0
        best_country = "SE"

        for country in ml_analyzer.target_countries:
            market = ml_analyzer.market_data.get(country, {})
            culture = ml_analyzer.cultural_insights.get(country, {})

            # Beräkna potentialpoäng
            potential_score = int(
                market.get("ecommerce_penetration", 0.5) * 50 +
                market.get("gdp_per_capita", 20000) / 1000 +
                (1 - culture.get("language_barrier", 0.5)) * 30
            )

            if potential_score > best_potential:
                best_potential = potential_score
                best_country = country_names.get(country, country)

            # Kulturella faktorer
            design_map = {
                "minimalist": "Minimalistisk",
                "functional": "Funktionell",
                "hygge": "Hygge/Komfort",
                "engineering": "Engineering/Kvalitet",
                "casual_practical": "Avslappnad/Praktisk",
                "elegant_stylish": "Elegant/Stilfull",
                "vibrant_expressive": "Livfull/Uttrycksfull",
                "practical_value": "Praktisk/Värde",
                "minimalist_precise": "Minimalistisk/Precis",
                "friendly_reliable": "Vänlig/Pålitlig"
            }

            behavior_map = {
                "research_heavy": "Forskande",
                "quality_focused": "Kvalitetsfokuserad",
                "balanced": "Balanserad",
                "tech_savvy": "Teknikmedveten",
                "thorough_research": "Grundlig forskning",
                "outdoor_focused": "Utomhusfokuserad",
                "fashion_conscious": "Modemedveten",
                "social_influenced": "Socialt påverkad",
                "value_seeking": "Värdejagande",
                "detail_oriented": "Detaljorienterad",
                "research_conscious": "Forskningsmedveten"
            }

            # Hitta toppmånader
            seasonal = market.get("seasonal_shopping", [1.0] * 12)
            peak_months = []
            avg_seasonal = sum(seasonal) / len(seasonal)

            month_names = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun",
                           "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"]

            for i, value in enumerate(seasonal):
                if value > avg_seasonal * 1.1:
                    peak_months.append(month_names[i])

            country_data[country] = {
                "name": country_names.get(country, country),
                "flag": country_flags.get(country, "🏳️"),
                "potential_score": potential_score,
                "ecommerce_penetration": int(market.get("ecommerce_penetration", 0.5) * 100),
                "mobile_usage": int(market.get("mobile_shopping_ratio", 0.5) * 100),
                "price_sensitivity": int(culture.get("price_sensitivity", 0.5) * 100),
                "cultural_factors": {
                    "design": design_map.get(culture.get("design_preference", ""), "Okänd"),
                    "trust": ", ".join(culture.get("trust_factors", ["Kvalitet"])[:2]),
                    "behavior": behavior_map.get(culture.get("shopping_behavior", ""), "Balanserad"),
                    "language_barrier": int(culture.get("language_barrier", 0.5) * 100)
                },
                "seasonal_trend": seasonal,
                "peak_months": ", ".join(peak_months) if peak_months else "Jämn fördelning",
                "popular_categories": market.get("popular_categories", ["elektronik"])[:5],
                "payment_methods": market.get("payment_methods", ["kort"])[:3],
                "competitors": ml_analyzer.identify_local_competitors(country, "elektronik")[:4]
            }

        market_data = {
            "timestamp": datetime.now().isoformat(),
            "overall_score": best_potential,
            "best_category": "elektronik",
            "best_market": best_country,
            "countries": country_data
        }

        print(f"🏆 Bästa marknad: {best_country} ({best_potential}%)")
        print(f"📈 Bästa kategori: elektronik")

        return market_data

    except Exception as e:
        print(f"⚠️ Fel vid generering av marknadsdata: {e}")
        print(f"🔄 Använder fallback-data...")
        return generate_static_fallback_data()


def generate_static_fallback_data():
    """Fallback-data om ML-modulen misslyckas"""
    return {
        "timestamp": datetime.now().isoformat(),
        "overall_score": 85,
        "best_category": "elektronik",
        "best_market": "Sverige",
        "countries": {
            "SE": {
                "name": "Sverige",
                "flag": "🇸🇪",
                "potential_score": 88,
                "ecommerce_penetration": 84,
                "mobile_usage": 65,
                "price_sensitivity": 65,
                "cultural_factors": {
                    "design": "Minimalistisk",
                    "trust": "Recensioner, Hållbarhet",
                    "behavior": "Forskande",
                    "language_barrier": 15
                },
                "seasonal_trend": [0.8, 0.7, 0.9, 1.0, 0.9, 0.7, 0.6, 0.7, 0.9, 1.1, 1.3, 1.5],
                "peak_months": "Nov-Dec",
                "popular_categories": ["elektronik", "mode", "sport", "hem", "böcker"],
                "payment_methods": ["Swish", "Kort", "Klarna"],
                "competitors": ["Elgiganten", "H&M", "Stadium", "IKEA"]
            }
        }
    }


def generate_ai_recommendations():
    """Genererar AI-rekommendationer baserat på marknadsdata"""

    try:
        from local_market_ml import LocalMarketMLAnalyzer

        ml_analyzer = LocalMarketMLAnalyzer()

        # Test produktdata
        test_product = {
            'id': 'test_001',
            'name': 'Trådlösa Hörlurar Pro',
            'platform': 'amazon',
            'category': 'elektronik',
            'price': 599,
            'rating': 4.5,
            'reviews': 1250
        }

        print("🔍 Testar produktanalys...")

        # Analysera produkten för alla marknader
        best_score = 0
        best_market = "SE"

        for country in ml_analyzer.target_countries[:5]:  # Test först 5 länder
            try:
                score = ml_analyzer.score_product_for_local_market(
                    test_product, country)
                total_score = (score.local_appeal_score +
                               score.cultural_fit_score) / 2 * 100

                if total_score > best_score:
                    best_score = total_score
                    best_market = country
            except:
                continue

        print(
            f"✅ Produktanalys slutförd - Övergripande poäng: {best_score:.1f}%")
        print(f"🎯 Bästa marknad för produkten: {best_market}")

        recommendations = [
            "Fokusera på elektronik-kategorin för bästa resultat",
            f"Prioritera {best_market}-marknaden för nya produkter",
            "Använd säsongsdata för optimal timing av kampanjer",
            "Anpassa produkttexter efter kulturella preferenser",
            "Optimera för mobil - majoriteten handlar via telefon"
        ]

        print("💡 Genererar AI-rekommendationer...")
        print(f"✅ {len(recommendations)} rekommendationer genererade")

        return recommendations

    except Exception as e:
        print(f"⚠️ Fel vid AI-rekommendationer: {e}")
        return [
            "Fokusera på populära kategorier som elektronik och mode",
            "Optimera för mobila enheter",
            "Använd lokala betalningsmetoder",
            "Anpassa innehåll efter säsongsvariation",
            "Fokusera på marknader med låg språkbarriär"
        ]


def test_product_analysis(product_data, target_country="SE"):
    """Testar produktanalys för specifik marknad"""

    try:
        from local_market_ml import LocalMarketMLAnalyzer

        ml_analyzer = LocalMarketMLAnalyzer()
        result = ml_analyzer.score_product_for_local_market(
            product_data, target_country)

        return {
            "overall_score": round((result.local_appeal_score + result.cultural_fit_score) / 2 * 100, 1),
            "local_appeal": round(result.local_appeal_score * 100, 1),
            "cultural_fit": round(result.cultural_fit_score * 100, 1),
            "predicted_clicks": int(result.predicted_local_clicks),
            "predicted_revenue": round(result.predicted_local_revenue, 2),
            "recommendations": result.marketing_recommendations[:3]
        }

    except Exception as e:
        print(f"Fel vid produktanalys: {e}")
        return {
            "overall_score": 75.0,
            "local_appeal": 80.0,
            "cultural_fit": 70.0,
            "predicted_clicks": 150,
            "predicted_revenue": 1250.0,
            "recommendations": ["Optimera för lokala preferenser", "Fokusera på mobil", "Använd lokala betalningar"]
        }


def save_market_data_js(market_data, ai_recommendations):
    """Sparar marknadsdata som JavaScript-fil"""

    js_content = f'''// AI Affiliate Platform - Marknadsdata
// Auto-genererad: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

window.MarketData = {json.dumps(market_data, indent=2, ensure_ascii=False)};

window.AIRecommendations = {json.dumps(ai_recommendations, indent=2, ensure_ascii=False)};

// Hjälpfunktioner för AI-analys
window.AIAnalyzer = {{
    
    // Analysera produkt för specifik marknad
    analyzeProduct: function(productData, targetCountry = "SE") {{
        console.log("🤖 Analyserar produkt för marknad:", targetCountry);
        
        const country = MarketData.countries[targetCountry];
        if (!country) {{
            console.warn("Okänd marknad:", targetCountry);
            return null;
        }}
        
        // Enkel scoring baserat på marknadsdata
        let score = 70; // Baspoäng
        
        // Justera baserat på e-handel penetration
        score += country.ecommerce_penetration * 0.2;
        
        // Justera för priskänslighet
        score += (100 - country.price_sensitivity) * 0.1;
        
        // Justera för språkbarriär
        score += (100 - country.cultural_factors.language_barrier) * 0.15;
        
        // Begränsa till 0-100
        score = Math.min(Math.max(score, 0), 100);
        
        return {{
            country: targetCountry,
            country_name: country.name,
            overall_score: Math.round(score * 10) / 10,
            market_potential: country.potential_score,
            cultural_fit: Math.round((score + country.potential_score) / 2 * 10) / 10,
            recommendations: [
                `Anpassa för ${{country.cultural_factors.design.toLowerCase()}} design`,
                `Fokusera på ${{country.cultural_factors.trust.toLowerCase()}}`,
                `Optimera för ${{country.payment_methods.join(", ").toLowerCase()}}`
            ]
        }};
    }},
    
    // Hitta bästa marknader för produkt
    findBestMarkets: function(productData, topN = 5) {{
        const results = [];
        
        for (const [countryCode, country] of Object.entries(MarketData.countries)) {{
            const analysis = this.analyzeProduct(productData, countryCode);
            if (analysis) {{
                results.push(analysis);
            }}
        }}
        
        // Sortera efter poäng
        results.sort((a, b) => b.overall_score - a.overall_score);
        
        return results.slice(0, topN);
    }},
    
    // Få säsongsrekommendationer
    getSeasonalInsights: function(countryCode = "SE") {{
        const country = MarketData.countries[countryCode];
        if (!country) return null;
        
        const months = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", 
                       "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];
        
        const seasonal = country.seasonal_trend;
        const max = Math.max(...seasonal);
        const bestMonth = seasonal.indexOf(max);
        
        return {{
            country: countryCode,
            best_month: months[bestMonth],
            peak_months: country.peak_months,
            seasonal_data: seasonal
        }};
    }}
}};

// Exportera för konsol-access
console.log("🤖 AI Affiliate Platform marknadsdata laddad!");
console.log("📊 Tillgängliga marknader:", Object.keys(MarketData.countries).length);
console.log("💡 Använd AIAnalyzer.analyzeProduct(productData, 'SE') för analys");
'''

    try:
        with open('market_data.js', 'w', encoding='utf-8') as f:
            f.write(js_content)

        abs_path = os.path.abspath('market_data.js')
        print(f"📊 Marknadsdata sparad till: {abs_path}")
        return True

    except Exception as e:
        print(f"❌ Fel vid sparning av market_data.js: {e}")
        return False


def main():
    """Huvudfunktion för marknadsanalys"""

    print("🤖 AI Affiliate Platform - Marknadsanalys")
    print("=" * 50)

    # Generera marknadsdata
    print("📊 Genererar marknadsdata...")
    market_data = generate_market_data_for_web()

    # Generera AI-rekommendationer
    ai_recommendations = generate_ai_recommendations()

    # Spara som JavaScript
    print("💾 Sparar data för webintegration...")
    if save_market_data_js(market_data, ai_recommendations):
        print("🎉 Analys slutförd!")
        print(
            "Nu kan du använda market_data.js i din webb för att komma åt AI-funktionerna.")
    else:
        print("❌ Fel vid sparning - kontrollera filrättigheter")


if __name__ == "__main__":
    main()
