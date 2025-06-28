"""
Modern Amazon Product Integration för AI Affiliate Platform
Använder Amazon Product Advertising API 5.0 format och demo-data
"""

import requests
import json
import random
from datetime import datetime
from typing import List, Dict, Optional


class ModernAmazonAPI:
    """Modern Amazon Product API Integration"""

    def __init__(self, access_key: str = None, secret_key: str = None, associate_tag: str = None):
        self.access_key = access_key or "AKPAG67MM61750958237"
        self.secret_key = secret_key or "tTxus23Goo3QPv3TIPD0AkSUVzRyRFObkgn5iGHx"
        self.associate_tag = associate_tag or "lemonec-20"

        # PA-API 5.0 endpoints per region
        self.endpoints = {
            "US": "webservices.amazon.com",
            "CA": "webservices.amazon.ca",
            "UK": "webservices.amazon.co.uk",
            "DE": "webservices.amazon.de",
            "FR": "webservices.amazon.fr",
            "IT": "webservices.amazon.it",
            "ES": "webservices.amazon.es",
            "JP": "webservices.amazon.co.jp",
            "AU": "webservices.amazon.com.au"
        }

    def search_products(self, keywords: str, category: str = "All", max_results: int = 10) -> List[Dict]:
        """
        Söker produkter - använder demo-data men med riktig Amazon-struktur
        I produktion skulle detta använda PA-API 5.0
        """

        print(
            f"🔍 Söker Amazon-produkter för '{keywords}' i kategori '{category}'...")

        # Realistiska Amazon-produkter baserat på verkliga ASINs och data
        amazon_products = self._get_realistic_products(keywords, category)

        # Begränsa resultat
        return amazon_products[:max_results]

    def get_product_by_asin(self, asin: str) -> Optional[Dict]:
        """Hämtar produktdetaljer via ASIN"""

        # Demo-data för specifika ASINs
        product_db = {
            "B08N5WRWNW": {
                "asin": "B08N5WRWNW",
                "title": "Echo Dot (4th Gen) - Smart speaker med Alexa - Blå",
                "brand": "Amazon",
                "price": 49.99,
                "currency": "USD",
                "sek_price": 549,  # Konverterat till SEK
                "image_url": "https://m.media-amazon.com/images/I/714Rq4k05UL._AC_SX466_.jpg",
                "rating": 4.7,
                "review_count": 374580,
                "category": "Electronics",
                "subcategory": "Smart Home",
                "url": f"https://amazon.com/dp/B08N5WRWNW?tag={self.associate_tag}",
                "description": "Amazon Echo Dot (4th Gen) är vår mest populära smarta högtalare med en snygg, kompakt design. Använd din röst för att spela musik, ställa frågor, kolla väder och nyheter.",
                "features": [
                    "Kompakt design med kraftfullt ljud",
                    "Röststyrning för musik och smarta hem-enheter",
                    "Inbyggt nav för Zigbee-enheter",
                    "Skyddar din integritet med flera lager säkerhet"
                ],
                "dimensions": "3.9 x 3.9 x 3.5 tum",
                "weight": "12.9 oz",
                "prime_eligible": True,
                "available": True
            },
            "B0BDHB9Y8H": {
                "asin": "B0BDHB9Y8H",
                "title": "Apple AirPods Pro (2nd Generation) - Trådlösa hörlurar",
                "brand": "Apple",
                "price": 249.00,
                "currency": "USD",
                "sek_price": 2749,
                "image_url": "https://m.media-amazon.com/images/I/61f1YfTkTdL._AC_SX466_.jpg",
                "rating": 4.4,
                "review_count": 89234,
                "category": "Electronics",
                "subcategory": "Audio",
                "url": f"https://amazon.com/dp/B0BDHB9Y8H?tag={self.associate_tag}",
                "description": "AirPods Pro har fått en stor uppgradering. Den nya H2-chippet driver smartare brusreducering och 3D-ljud.",
                "features": [
                    "Upp till 2x bättre aktiv brusreducering",
                    "Adaptiv transparens-läge",
                    "Personaliserat spatialt ljud med dynamisk huvudspårning",
                    "Upp till 30 timmars lyssning med laddningsetui"
                ],
                "dimensions": "1.22 x 0.86 x 0.94 tum",
                "weight": "0.19 oz (per öronsnäcka)",
                "prime_eligible": True,
                "available": True
            },
            "B09G5JGJ49": {
                "asin": "B09G5JGJ49",
                "title": "Samsung Galaxy Watch5 - Smartwatch med avancerad hälsoövervakning",
                "brand": "Samsung",
                "price": 329.99,
                "currency": "USD",
                "sek_price": 3629,
                "image_url": "https://m.media-amazon.com/images/I/61KIb7RF9OL._AC_SX466_.jpg",
                "rating": 4.3,
                "review_count": 12847,
                "category": "Electronics",
                "subcategory": "Wearables",
                "url": f"https://amazon.com/dp/B09G5JGJ49?tag={self.associate_tag}",
                "description": "Samsung Galaxy Watch5 kombinerar stil med avancerad hälsoteknologi för att hjälpa dig nå dina fitnessmål.",
                "features": [
                    "Avancerad sömnanalys och snarkningsdetektering",
                    "Kroppssegmentanalys för detaljerad kroppskomposition",
                    "40mm Super AMOLED-skärm med always-on-display",
                    "Upp till 40 timmars batteritid"
                ],
                "dimensions": "39.3 x 40.4 x 9.8 mm",
                "weight": "28.7g",
                "prime_eligible": True,
                "available": True
            }
        }

        return product_db.get(asin)

    def _get_realistic_products(self, keywords: str, category: str) -> List[Dict]:
        """Genererar realistiska Amazon-produkter baserat på sökning"""

        # Keyword-baserade produkter
        keyword_products = {
            "wireless": [
                {
                    "asin": "B0BDHB9Y8H",
                    "title": "Apple AirPods Pro (2nd Generation) - Brusreducerande hörlurar",
                    "brand": "Apple",
                    "price": 249.00,
                    "sek_price": 2749,
                    "image_url": "https://m.media-amazon.com/images/I/61f1YfTkTdL._AC_SX466_.jpg",
                    "rating": 4.4,
                    "review_count": 89234,
                    "category": "Electronics",
                    "url": f"https://amazon.com/dp/B0BDHB9Y8H?tag={self.associate_tag}",
                    "prime_eligible": True,
                    "discount": 15  # 15% rabatt
                },
                {
                    "asin": "B08PZHQZF5",
                    "title": "Sony WH-1000XM4 - Premium trådlösa hörlurar",
                    "brand": "Sony",
                    "price": 348.00,
                    "sek_price": 3828,
                    "image_url": "https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_SX466_.jpg",
                    "rating": 4.6,
                    "review_count": 67892,
                    "category": "Electronics",
                    "url": f"https://amazon.com/dp/B08PZHQZF5?tag={self.associate_tag}",
                    "prime_eligible": True,
                    "discount": 0
                }
            ],
            "smart": [
                {
                    "asin": "B08N5WRWNW",
                    "title": "Echo Dot (4th Gen) - Smart speaker med Alexa",
                    "brand": "Amazon",
                    "price": 49.99,
                    "sek_price": 549,
                    "image_url": "https://m.media-amazon.com/images/I/714Rq4k05UL._AC_SX466_.jpg",
                    "rating": 4.7,
                    "review_count": 374580,
                    "category": "Electronics",
                    "url": f"https://amazon.com/dp/B08N5WRWNW?tag={self.associate_tag}",
                    "prime_eligible": True,
                    "discount": 40  # 40% rabatt
                },
                {
                    "asin": "B09G5JGJ49",
                    "title": "Samsung Galaxy Watch5 - Smartwatch 40mm",
                    "brand": "Samsung",
                    "price": 329.99,
                    "sek_price": 3629,
                    "image_url": "https://m.media-amazon.com/images/I/61KIb7RF9OL._AC_SX466_.jpg",
                    "rating": 4.3,
                    "review_count": 12847,
                    "category": "Electronics",
                    "url": f"https://amazon.com/dp/B09G5JGJ49?tag={self.associate_tag}",
                    "prime_eligible": True,
                    "discount": 20
                }
            ],
            "phone": [
                {
                    "asin": "B0CHWZ5S4G",
                    "title": "iPhone 15 Pro 128GB - Natural Titanium",
                    "brand": "Apple",
                    "price": 999.00,
                    "sek_price": 10989,
                    "image_url": "https://m.media-amazon.com/images/I/81Os1SDWpcL._AC_SX466_.jpg",
                    "rating": 4.5,
                    "review_count": 2847,
                    "category": "Electronics",
                    "url": f"https://amazon.com/dp/B0CHWZ5S4G?tag={self.associate_tag}",
                    "prime_eligible": True,
                    "discount": 0
                }
            ],
            "laptop": [
                {
                    "asin": "B0C75CYMK6",
                    "title": "MacBook Air 15-inch - M2 chip, 8GB RAM, 256GB SSD",
                    "brand": "Apple",
                    "price": 1299.00,
                    "sek_price": 14289,
                    "image_url": "https://m.media-amazon.com/images/I/71ItMeqpN3L._AC_SX466_.jpg",
                    "rating": 4.6,
                    "review_count": 1456,
                    "category": "Electronics",
                    "url": f"https://amazon.com/dp/B0C75CYMK6?tag={self.associate_tag}",
                    "prime_eligible": True,
                    "discount": 5
                }
            ]
        }

        # Hitta matchande produkter
        matching_products = []

        for keyword, products in keyword_products.items():
            if keyword.lower() in keywords.lower():
                matching_products.extend(products)

        # Om inga direkta matchningar, använd slumpmässiga populära produkter
        if not matching_products:
            all_products = []
            for products in keyword_products.values():
                all_products.extend(products)
            matching_products = random.sample(
                all_products, min(3, len(all_products)))

        # Lägg till affiliate-specifik data
        for product in matching_products:
            product['affiliate_tag'] = self.associate_tag
            product['commission_rate'] = self._get_commission_rate(
                product['category'])
            product['estimated_earning'] = round(
                product['price'] * product['commission_rate'] / 100, 2)

        return matching_products

    def _get_commission_rate(self, category: str) -> float:
        """Returnerar uppskattad kommissionsränta för kategori"""

        commission_rates = {
            "Electronics": 2.5,
            "Fashion": 4.0,
            "Home": 3.0,
            "Sports": 3.0,
            "Books": 4.5,
            "Beauty": 4.0
        }

        return commission_rates.get(category, 3.0)

    def get_trending_products(self, region: str = "US", limit: int = 10) -> List[Dict]:
        """Hämtar trending produkter för specifik region"""

        trending_asins = [
            "B08N5WRWNW",  # Echo Dot
            "B0BDHB9Y8H",  # AirPods Pro
            "B09G5JGJ49",  # Galaxy Watch
            "B0CHWZ5S4G",  # iPhone 15 Pro
            "B0C75CYMK6"   # MacBook Air
        ]

        products = []
        for asin in trending_asins[:limit]:
            product = self.get_product_by_asin(asin)
            if product:
                products.append(product)

        return products


def update_admin_with_amazon_products():
    """Uppdaterar admin-panelen med riktiga Amazon-produkter"""

    print("🔄 Uppdaterar admin-panel med Amazon-produkter...")

    api = ModernAmazonAPI()

    # Hämta trending produkter
    trending = api.get_trending_products(limit=5)

    # Konvertera till format som admin-panelen förväntar sig
    admin_products = []

    for product in trending:
        admin_product = {
            "id": f"amazon_{product['asin']}",
            "name": product['title'],
            "platform": "amazon",
            "category": product['category'].lower(),
            "url": product['url'],
            "price": f"{product['sek_price']} SEK",
            "rating": product['rating'],
            "image": product['image_url'],
            "description": product.get('description', ''),
            "features": product.get('features', []),
            "commission": f"{product.get('commission_rate', 3.0)}%",
            "estimated_earning": f"{product.get('estimated_earning', 0)} USD/försäljning"
        }
        admin_products.append(admin_product)

    # Spara som JSON för admin-panelen
    with open('amazon_products.json', 'w', encoding='utf-8') as f:
        json.dump({
            "timestamp": datetime.now().isoformat(),
            "total_products": len(admin_products),
            "products": admin_products
        }, f, indent=2, ensure_ascii=False)

    print(
        f"✅ Sparade {len(admin_products)} Amazon-produkter till amazon_products.json")
    return admin_products


def main():
    """Test och demo av Amazon-integration"""

    print("🛒 Modern Amazon API Integration - Demo")
    print("=" * 50)

    api = ModernAmazonAPI()

    # Test produktsökning
    print("\n1. 🔍 Produktsökning:")
    products = api.search_products(
        "wireless headphones", "Electronics", max_results=3)

    for i, product in enumerate(products, 1):
        print(f"\n   {i}. {product['title']}")
        print(
            f"      💰 Pris: ${product['price']} ({product['sek_price']} SEK)")
        print(
            f"      ⭐ Betyg: {product['rating']}/5 ({product['review_count']:,} recensioner)")
        print(
            f"      🎯 Kommission: {product.get('commission_rate', 0)}% = ${product.get('estimated_earning', 0)}/försäljning")
        if product.get('discount', 0) > 0:
            print(f"      🔥 Rabatt: {product['discount']}% OFF!")

    # Test ASIN-sökning
    print("\n2. 🎯 Produktdetaljer (ASIN):")
    product_detail = api.get_product_by_asin("B08N5WRWNW")
    if product_detail:
        print(f"   📱 {product_detail['title']}")
        print(f"   📏 Storlek: {product_detail.get('dimensions', 'N/A')}")
        print(f"   ⚖️ Vikt: {product_detail.get('weight', 'N/A')}")
        print(
            f"   ✅ Prime: {'Ja' if product_detail.get('prime_eligible') else 'Nej'}")

    # Test trending produkter
    print("\n3. 🔥 Trending Produkter:")
    trending = api.get_trending_products(limit=3)

    for product in trending:
        print(f"   • {product['title']} - ${product['price']}")

    # Uppdatera admin-panel
    print("\n4. 🔄 Admin-panel Integration:")
    admin_products = update_admin_with_amazon_products()
    print(f"   ✅ Redo för admin-panel med {len(admin_products)} produkter")


if __name__ == "__main__":
    main()
