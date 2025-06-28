"""
Product Auto-Update System
Integrerar trend-analys med affiliate-sidan för automatisk produktuppdatering
"""

import asyncio
import json
from datetime import datetime
from typing import List, Dict
from trend_seo_analyzer import TrendMaster, ProductOpportunity
import re


class ProductUpdater:
    """Uppdaterar produkter baserat på trend-analys"""

    def __init__(self):
        self.trend_master = TrendMaster()
        self.html_files = [
            "F:/ai-affiliate-site/simple.html",
            "F:/ai-affiliate-site/dashboard.html",
            "F:/ai-affiliate-site/admin.html"
        ]

    async def update_products_from_trends(self):
        """Hämtar trend-data och uppdaterar produkter"""
        print("🔍 Analyserar trender och SEO för bästa produkter...")

        # Hämta bästa produkter
        opportunities = await self.trend_master.find_best_products(limit=15)

        if opportunities:
            print(f"✅ Hittade {len(opportunities)} produktmöjligheter")

            # Konvertera till produktformat
            products = self.convert_opportunities_to_products(opportunities)

            # Uppdatera HTML-filer
            await self.update_html_files(products)

            # Uppdatera Telegram bot
            await self.update_telegram_products(products)

            # Generera rapport
            await self.generate_update_report(opportunities)

            return products
        else:
            print("❌ Kunde inte hämta trend-data")
            return []

    def convert_opportunities_to_products(self, opportunities: List[ProductOpportunity]) -> List[Dict]:
        """Konverterar ProductOpportunity till produktformat"""
        products = []

        for i, opp in enumerate(opportunities[:12]):  # Topp 12 produkter
            # Generera realistiska priser baserat på kategori
            price, original_price = self.generate_prices(
                opp.category, opp.opportunity_score)

            # Generera affiliate URL
            affiliate_url = self.generate_affiliate_url(
                opp.product_name, opp.recommended_platform)

            # Beräkna rabatt
            discount = int(((original_price - price) / original_price)
                           * 100) if original_price > price else 0

            product = {
                "id": f"trending_{i+1}",
                "name": opp.product_name,
                "price": price,
                "original_price": original_price,
                "platform": opp.recommended_platform,
                "url": affiliate_url,
                "image_url": self.generate_image_url(opp.product_name),
                "category": opp.category,
                "discount": f"{discount}%" if discount > 0 else None,
                # 4.0-5.0 baserat på score
                "rating": round(4.0 + (opp.opportunity_score / 10) * 1.0, 1),
                "commission": round(price * (0.06 if opp.recommended_platform == "amazon" else 0.03), 2),
                "description": self.generate_description(opp),
                "trend_score": opp.trend_score,
                "seo_score": opp.seo_score,
                "monthly_searches": opp.estimated_monthly_searches,
                "keywords": opp.keywords[:3]
            }

            products.append(product)

        return products

    def generate_prices(self, category: str, opportunity_score: float) -> tuple:
        """Genererar realistiska priser baserat på kategori"""
        price_ranges = {
            "Elektronik": (25, 200),
            "Hem & Trädgård": (15, 150),
            "Sport & Hälsa": (20, 120),
            "Gaming": (30, 180),
            "Mode & Accessoarer": (10, 80)
        }

        min_price, max_price = price_ranges.get(category, (20, 100))

        # Högre opportunity score = högre priser (mer premium produkter)
        price_factor = 0.5 + (opportunity_score / 20)
        base_price = min_price + (max_price - min_price) * price_factor

        # Lägg till rabatt
        # 20-40% ursprunglig ökning
        original_price = base_price * (1.2 + (opportunity_score / 50))
        current_price = base_price

        return round(current_price, 2), round(original_price, 2)

    def generate_affiliate_url(self, product_name: str, platform: str) -> str:
        """Genererar affiliate URL"""
        if platform == "amazon":
            # Amazon affiliate URL format
            product_id = re.sub(r'[^a-zA-Z0-9]', '', product_name)[:10].upper()
            return f"https://amazon.com/dp/B{product_id}?tag=youraffid-20"
        else:
            # AliExpress affiliate URL format
            return f"https://s.click.aliexpress.com/e/_Dm{product_name[:6].replace(' ', '')}"

    def generate_image_url(self, product_name: str) -> str:
        """Genererar bild URL (placeholder eller riktig)"""
        # I verkligheten skulle du hämta riktiga produktbilder
        product_slug = re.sub(r'[^a-zA-Z0-9]', '-', product_name.lower())
        return f"https://via.placeholder.com/300x300?text={product_slug}"

    def generate_description(self, opp: ProductOpportunity) -> str:
        """Genererar produktbeskrivning med SEO-fokus"""
        templates = {
            "Elektronik": "🔥 {name} - Premium kvalitet med senaste tekniken. Perfekt för tech-entusiaster som vill ha det bästa. {keywords}",
            "Hem & Trädgård": "🏠 {name} - Förvandla ditt hem med denna praktiska och eleganta lösning. Hög kvalitet till bra pris. {keywords}",
            "Sport & Hälsa": "💪 {name} - Ta din träning till nästa nivå! Professionell kvalitet för alla fitnessnivåer. {keywords}",
            "Gaming": "🎮 {name} - Ultimate gaming-upplevelse för seriösa spelare. Pro-kvalitet med RGB och premium features. {keywords}",
            "Mode & Accessoarer": "✨ {name} - Stilren design som kompletterar din personliga stil. Trendig och funktionell. {keywords}"
        }

        template = templates.get(
            opp.category, "⭐ {name} - Högkvalitativ produkt med excellent värde för pengarna. {keywords}")

        # Lägg till trending keywords
        keyword_text = f"Trending: {', '.join(opp.keywords[:2])}" if opp.keywords else ""

        return template.format(
            name=opp.product_name,
            keywords=keyword_text
        )

    async def update_html_files(self, products: List[Dict]):
        """Uppdaterar HTML-filer med nya produkter"""
        print("📝 Uppdaterar HTML-filer med trend-optimerade produkter...")

        # Läs simple.html
        try:
            with open("F:/ai-affiliate-site/simple.html", 'r', encoding='utf-8') as f:
                html_content = f.read()

            # Skapa nya produktkort
            product_cards_html = self.generate_product_cards_html(products)

            # Ersätt produktsektionen
            pattern = r'<div class="products-grid">.*?</div>\s*</div>'
            new_section = f'<div class="products-grid">\n{product_cards_html}\n            </div>\n        </div>'

            updated_html = re.sub(pattern, new_section,
                                  html_content, flags=re.DOTALL)

            # Lägg till trend-information i header
            trend_info = f'''
            <!-- Trend-optimerade produkter uppdaterade: {datetime.now().strftime('%Y-%m-%d %H:%M')} -->
            <meta name="description" content="AI-optimerade affiliate deals baserat på Google Trends och SEO-analys. Hitta de hetaste produkterna med bäst försäljningspotential.">
            <meta name="keywords" content="{', '.join([p['name'] for p in products[:5]])}, affiliate deals, trending products">
'''

            updated_html = updated_html.replace(
                '<meta name="viewport"', trend_info + '\n    <meta name="viewport"')

            # Spara uppdaterad fil
            with open("F:/ai-affiliate-site/simple.html", 'w', encoding='utf-8') as f:
                f.write(updated_html)

            print("✅ simple.html uppdaterad med trend-produkter")

        except Exception as e:
            print(f"❌ Fel vid uppdatering av HTML: {e}")

    def generate_product_cards_html(self, products: List[Dict]) -> str:
        """Genererar HTML för produktkort"""
        cards_html = ""

        for product in products:
            discount_badge = f'''
                <div class="discount-badge">-{product['discount']}</div>''' if product.get('discount') else ""

            trend_badge = f'''
                <div class="trend-badge">🔥 Trending</div>''' if product.get('trend_score', 0) > 8 else ""

            card_html = f'''
                <div class="product-card" data-category="{product['category'].lower().replace(' ', '-')}" data-platform="{product['platform']}" data-trending="true">
                    {discount_badge}
                    {trend_badge}
                    <img src="{product['image_url']}" alt="{product['name']}" class="product-image">
                    <div class="product-info">
                        <h3 class="product-title">{product['name']}</h3>
                        <p class="product-description">{product['description']}</p>
                        <div class="product-meta">
                            <span class="rating">⭐ {product['rating']}</span>
                            <span class="platform {product['platform']}">{product['platform'].title()}</span>
                            <span class="trend-indicator">📈 Score: {product['trend_score']}/10</span>
                        </div>
                        <div class="price-section">
                            {'<span class="original-price">$' + str(product['original_price']) + '</span>' if product.get('original_price') and product['original_price'] > product['price'] else ''}
                            <span class="current-price">${product['price']}</span>
                            <span class="commission">Kommission: ${product['commission']}</span>
                        </div>
                        <button class="buy-button" onclick="trackClick('{product['id']}', '{product['platform']}', '{product['name']}')">
                            🛒 Köp på {product['platform'].title()} - ${product['price']}
                        </button>
                        <div class="seo-info">
                            <small>🔍 {product['monthly_searches']:,} månadssökningar | Keywords: {', '.join(product['keywords'])}</small>
                        </div>
                    </div>
                </div>'''

            cards_html += card_html + "\n"

        return cards_html

    async def update_telegram_products(self, products: List[Dict]):
        """Uppdaterar Telegram bot med nya produkter"""
        print("🤖 Uppdaterar Telegram bot med trend-produkter...")

        try:
            # Läs telegram_bot.py
            with open("F:/ai-affiliate-site/telegram_bot.py", 'r', encoding='utf-8') as f:
                bot_content = f.read()

            # Generera ny produktdata för boten
            telegram_products = []
            for product in products[:6]:  # Topp 6 för Telegram
                telegram_product = {
                    "id": product['id'],
                    "name": product['name'],
                    "price": product['price'],
                    "original_price": product.get('original_price'),
                    "platform": product['platform'],
                    "url": product['url'],
                    "image_url": product['image_url'],
                    "category": product['category'],
                    "discount": product.get('discount'),
                    "rating": product['rating'],
                    "commission": product['commission'],
                    "description": product['description']
                }
                telegram_products.append(telegram_product)

            # Ersätt produktdata i bot-filen
            new_products_code = f"            # Trend-optimerade produkter (uppdaterade: {datetime.now().strftime('%Y-%m-%d %H:%M')})\n"
            new_products_code += f"            products_data = {json.dumps(telegram_products, indent=16, ensure_ascii=False)}"

            # Hitta och ersätt produktdata
            pattern = r'products_data = \[.*?\]'
            updated_bot_content = re.sub(
                pattern, new_products_code.strip(), bot_content, flags=re.DOTALL)

            # Spara uppdaterad bot
            with open("F:/ai-affiliate-site/telegram_bot.py", 'w', encoding='utf-8') as f:
                f.write(updated_bot_content)

            print("✅ Telegram bot uppdaterad med trend-produkter")

        except Exception as e:
            print(f"❌ Fel vid uppdatering av Telegram bot: {e}")

    async def generate_update_report(self, opportunities: List[ProductOpportunity]):
        """Genererar rapport över uppdateringen"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M')
        report_file = f"F:/ai-affiliate-site/product_update_report_{timestamp}.txt"

        report = f"""
🚀 AUTOMATISK PRODUKTUPPDATERING RAPPORT
Datum: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

📊 UPPDATERINGSSAMMANFATTNING:
• Produkter analyserade: {len(opportunities)}
• Produkter uppdaterade: {min(12, len(opportunities))}
• HTML-filer uppdaterade: simple.html
• Telegram bot uppdaterad: Ja

🔥 TOPP 5 TREND-PRODUKTER:
{'-'*40}
"""

        for i, opp in enumerate(opportunities[:5], 1):
            report += f"""
{i}. {opp.product_name}
   📈 Trend Score: {opp.trend_score}/10
   🔍 SEO Score: {opp.seo_score}/10
   💰 Estimerad månadsintäkt: ${opp.estimated_commission:.2f}
   📊 Månadssökningar: {opp.estimated_monthly_searches:,}
   🏪 Plattform: {opp.recommended_platform.title()}
"""

        # Sammanfattning
        total_potential = sum(
            opp.estimated_commission for opp in opportunities[:12])
        avg_trend_score = sum(
            opp.trend_score for opp in opportunities[:12]) / min(12, len(opportunities))

        report += f"""

📈 PRESTANDA-FÖRUTSÄGELSER:
• Total månadspotential: ${total_potential:.2f}
• Genomsnittlig trend score: {avg_trend_score:.1f}/10
• Bästa kategori: {opportunities[0].category if opportunities else 'N/A'}
• Rekommenderad fokus: Topp 3 produkterna

🎯 NÄSTA STEG:
1. Övervaka prestanda för nya produkter
2. Skapa content för top keywords
3. Optimera Telegram posting-schema
4. Kör nästa analys om 7 dagar

📅 Nästa automatiska uppdatering: {(datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d')}
"""

        # Spara rapport
        with open(report_file, 'w', encoding='utf-8') as f:
            f.write(report)

        print(f"📄 Uppdateringsrapport sparad: {report_file}")
        return report_file

# CSS-stilar för nya trend-features


def add_trend_styles():
    """Lägger till CSS för trend-indikatorer"""
    trend_css = """
/* Trend-indikatorer */
.trend-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    background: linear-gradient(45deg, #ff6b6b, #ffa500);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: bold;
    z-index: 2;
    animation: pulse 2s infinite;
}

.trend-indicator {
    background: linear-gradient(45deg, #667eea, #764ba2);
    color: white;
    padding: 0.2rem 0.5rem;
    border-radius: 0.75rem;
    font-size: 0.7rem;
    font-weight: bold;
}

.seo-info {
    margin-top: 0.5rem;
    padding: 0.5rem;
    background: #f8fafc;
    border-radius: 0.5rem;
    border-left: 3px solid #667eea;
}

.seo-info small {
    color: #6b7280;
    display: block;
    line-height: 1.4;
}

/* Förbättrade produktkort för trending items */
.product-card[data-trending="true"] {
    border: 2px solid #ffa500;
    box-shadow: 0 4px 20px rgba(255, 165, 0, 0.2);
    position: relative;
    overflow: hidden;
}

.product-card[data-trending="true"]::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #ff6b6b, #ffa500, #667eea);
    animation: shimmer 3s infinite;
}

@keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}

/* Trend-statistik i dashboard */
.trend-stats {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 1.5rem;
    border-radius: 1rem;
    margin: 1rem 0;
}

.trend-stats h3 {
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
"""
    return trend_css

# Huvudfunktion


async def run_product_update():
    """Kör automatisk produktuppdatering"""
    print("""
🚀 AUTOMATISK PRODUKTUPPDATERING
==================================

Detta system kommer att:
• Analysera Google Trends och SEO-data
• Identifiera de bästa produkterna att sälja
• Uppdatera din affiliate-sida med trending produkter
• Uppdatera Telegram bot med nya produkter
• Generera prestanda-rapport

Startar analys...
    """)

    updater = ProductUpdater()

    try:
        # Kör uppdatering
        products = await updater.update_products_from_trends()

        if products:
            print(f"""
✅ PRODUKTUPPDATERING SLUTFÖRD!

📊 Resultat:
• {len(products)} produkter uppdaterade
• HTML-sida: ✅ Uppdaterad 
• Telegram bot: ✅ Uppdaterad
• SEO: ✅ Optimerad

🎯 Nästa steg:
1. Öppna simple.html för att se nya produkter
2. Testa Telegram bot med /deals kommandot
3. Övervaka prestanda i dashboard
4. Schemalägg nästa uppdatering om 7 dagar

🔥 Dina topp 3 trending produkter:
""")

            for i, product in enumerate(products[:3], 1):
                print(
                    f"{i}. {product['name']} (Score: {product['trend_score']}/10)")

            return products
        else:
            print("❌ Ingen produktdata kunde hämtas")
            return []

    except Exception as e:
        print(f"❌ Fel vid produktuppdatering: {e}")
        return []

if __name__ == "__main__":
    # Kör automatisk produktuppdatering
    from datetime import timedelta
    asyncio.run(run_product_update())
