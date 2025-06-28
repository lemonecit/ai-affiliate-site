"""
KSP (Israel) Product Integration för AI Affiliate Platform
KSP är en stor israelisk elektronikkedja med affiliate-program
"""

import requests
import json
import random
from datetime import datetime
from typing import List, Dict, Optional


class KSPAPI:
    """KSP Israel Product API Integration"""

    def __init__(self, api_key: str = None, affiliate_id: str = None):
        self.api_key = api_key or "ksp_demo_key_123456"
        self.affiliate_id = affiliate_id or "AFF_IL_001"

        # KSP API endpoints
        self.base_url = "https://www.ksp.co.il"
        self.api_url = "https://api.ksp.co.il/v1"

        # Kategorier på KSP
        self.categories = {
            "computers": "מחשבים",
            "smartphones": "טלפונים חכמים",
            "gaming": "גיימינג",
            "audio": "אודיו",
            "home": "חכם לבית",
            "cameras": "צילום"
        }

    def search_products(self, keywords: str, category: str = "all", max_results: int = 10) -> List[Dict]:
        """
        Söker KSP-produkter - använder demo-data men med riktig KSP-struktur
        I produktion skulle detta använda KSP Affiliate API
        """

        print(
            f"🔍 Söker KSP-produkter för '{keywords}' i kategori '{category}'...")

        # Realistiska KSP-produkter baserat på verkliga produkter
        ksp_products = self._get_realistic_ksp_products(keywords, category)

        # Begränsa resultat
        return ksp_products[:max_results]

    def get_product_by_sku(self, sku: str) -> Optional[Dict]:
        """Hämtar produktdetaljer via SKU"""

        # Demo-data för specifika SKUs
        product_db = {
            "KSP_IP15PRO": {
                "sku": "KSP_IP15PRO",
                "name": "iPhone 15 Pro 128GB - Natural Titanium",
                "brand": "Apple",
                "price": 4999.00,
                "currency": "ILS",
                "sek_price": 14247,  # Konverterat till SEK (1 ILS ≈ 2.85 SEK)
                "image_url": "https://www.ksp.co.il/web/multimedia/catalog/products/78245.jpg",
                "rating": 4.8,
                "review_count": 1234,
                "category": "Smartphones",
                "url": f"{self.base_url}/web/item/78245?aff={self.affiliate_id}",
                "description": "iPhone 15 Pro עם שבב A17 Pro המהפכני, מצלמה בעלת רזולוציה גבוהה וחיי סוללה ארוכים.",
                "features": [
                    "שבב A17 Pro עם ליבות GPU 6",
                    "מערכת מצלמה Pro עם טלה 3x",
                    "עיצוב Titanium קל וחזק",
                    "USB-C עם תמיכה ב-USB 3"
                ],
                "warranty": "שנה אחריות יבואן רשמי",
                "delivery": "משלוח חינם ברכישה מעל ₪199",
                "available": True,
                "stock_status": "במלאי"
            },
            "KSP_MBAIR15": {
                "sku": "KSP_MBAIR15",
                "name": "MacBook Air 15 M2 256GB - Midnight",
                "brand": "Apple",
                "price": 5999.00,
                "currency": "ILS",
                "sek_price": 17097,
                "image_url": "https://www.ksp.co.il/web/multimedia/catalog/products/79156.jpg",
                "rating": 4.9,
                "review_count": 892,
                "category": "Laptops",
                "url": f"{self.base_url}/web/item/79156?aff={self.affiliate_id}",
                "description": "MacBook Air 15 עם שבב M2 החדש - ביצועים מהירים יותר ויעילות אנרגטית משופרת.",
                "features": [
                    "שבב Apple M2 עם CPU 8 ליבות",
                    "מסך Liquid Retina 15.3 אינץ'",
                    "עד 18 שעות חיי סוללה",
                    "מקלדת Magic Keyboard מוארת"
                ],
                "warranty": "שנה אחריות Apple בינלאומית",
                "delivery": "משלוח חינם",
                "available": True,
                "stock_status": "במלאי"
            }
        }

        return product_db.get(sku)

    def _get_realistic_ksp_products(self, keywords: str, category: str) -> List[Dict]:
        """Returnerar realistiska KSP-produkter baserat på sökning"""

        # Produktdatabas med riktiga KSP-liknande data
        all_products = [
            {
                "sku": "KSP_IP15PRO",
                "name": "iPhone 15 Pro 128GB - Natural Titanium",
                "brand": "Apple",
                "price": 4999.00,
                "currency": "ILS",
                "sek_price": 14247,
                "image_url": "https://www.ksp.co.il/web/multimedia/catalog/products/78245.jpg",
                "rating": 4.8,
                "review_count": 1234,
                "category": "Smartphones",
                "url": f"{self.base_url}/web/item/78245?aff={self.affiliate_id}",
                "description": "iPhone 15 Pro עם שבב A17 Pro המהפכני",
                "commission_rate": 3.5,
                "availability": "במלאי",
                "shipping": "משלוח חינם"
            },
            {
                "sku": "KSP_MBAIR15",
                "name": "MacBook Air 15 M2 256GB - Midnight",
                "brand": "Apple",
                "price": 5999.00,
                "currency": "ILS",
                "sek_price": 17097,
                "image_url": "https://www.ksp.co.il/web/multimedia/catalog/products/79156.jpg",
                "rating": 4.9,
                "review_count": 892,
                "category": "Laptops",
                "url": f"{self.base_url}/web/item/79156?aff={self.affiliate_id}",
                "description": "MacBook Air 15 עם שבב M2 החדש",
                "commission_rate": 2.8,
                "availability": "במלאי",
                "shipping": "משלוח חינם"
            },
            {
                "sku": "KSP_SWITCH",
                "name": "Nintendo Switch OLED - Neon Blue/Red",
                "brand": "Nintendo",
                "price": 1399.00,
                "currency": "ILS",
                "sek_price": 3987,
                "image_url": "https://www.ksp.co.il/web/multimedia/catalog/products/77894.jpg",
                "rating": 4.7,
                "review_count": 2156,
                "category": "Gaming",
                "url": f"{self.base_url}/web/item/77894?aff={self.affiliate_id}",
                "description": "Nintendo Switch עם מסך OLED 7 אינץ' חי ותוסס",
                "commission_rate": 4.2,
                "availability": "במלאי",
                "shipping": "משלוח חינם"
            },
            {
                "sku": "KSP_AIRPODS3",
                "name": "Apple AirPods 3rd Generation",
                "brand": "Apple",
                "price": 699.00,
                "currency": "ILS",
                "sek_price": 1992,
                "image_url": "https://www.ksp.co.il/web/multimedia/catalog/products/76521.jpg",
                "rating": 4.6,
                "review_count": 3421,
                "category": "Audio",
                "url": f"{self.base_url}/web/item/76521?aff={self.affiliate_id}",
                "description": "AirPods דור 3 עם Spatial Audio וחיי סוללה ארוכים",
                "commission_rate": 3.8,
                "availability": "במלאי",
                "shipping": "משלוח חינם"
            },
            {
                "sku": "KSP_PS5",
                "name": "PlayStation 5 Console",
                "brand": "Sony",
                "price": 2199.00,
                "currency": "ILS",
                "sek_price": 6267,
                "image_url": "https://www.ksp.co.il/web/multimedia/catalog/products/75632.jpg",
                "rating": 4.8,
                "review_count": 1876,
                "category": "Gaming",
                "url": f"{self.base_url}/web/item/75632?aff={self.affiliate_id}",
                "description": "PlayStation 5 עם SSD מותאם אישית וגרפיקה מתקדמת",
                "commission_rate": 2.5,
                "availability": "במלאי מוגבל",
                "shipping": "משלוח חינם"
            }
        ]

        # Filtrera baserat på keywords och kategori
        filtered_products = []
        keywords_lower = keywords.lower()

        for product in all_products:
            # Enkel matchning baserat på namn eller kategori
            if (keywords_lower in product["name"].lower() or
                keywords_lower in product["category"].lower() or
                keywords_lower in product["brand"].lower() or
                    category.lower() == "all"):
                filtered_products.append(product)

        return filtered_products

    def get_trending_products(self, limit: int = 5) -> List[Dict]:
        """Returnerar trending KSP-produkter"""

        trending = [
            {
                "sku": "KSP_IP15PRO",
                "name": "iPhone 15 Pro 128GB",
                "price": 4999.00,
                "trend_score": 95,
                "weekly_sales": 234
            },
            {
                "sku": "KSP_SWITCH",
                "name": "Nintendo Switch OLED",
                "price": 1399.00,
                "trend_score": 88,
                "weekly_sales": 178
            },
            {
                "sku": "KSP_AIRPODS3",
                "name": "Apple AirPods 3rd Gen",
                "price": 699.00,
                "trend_score": 82,
                "weekly_sales": 445
            }
        ]

        return trending[:limit]

    def generate_affiliate_json(self, output_file: str = "ksp_products.json"):
        """Genererar JSON-fil för admin-panel integration"""

        print("🔄 Genererar KSP-produkter för admin-panel...")

        # Hämta alla produkter
        all_products = self._get_realistic_ksp_products("", "all")

        # Konvertera till admin-panel format
        admin_products = []
        for product in all_products:
            admin_product = {
                "id": f"ksp_{product['sku']}",
                "name": product["name"],
                "platform": "ksp",
                "category": product["category"].lower(),
                "url": product["url"],
                "price": f"{product['sek_price']} SEK",
                "original_price": f"{product['price']} ILS",
                "rating": product["rating"],
                "image": product["image_url"],
                "description": product["description"],
                "commission": f"{product['commission_rate']}%",
                "estimated_earning": f"{product['price'] * product['commission_rate'] / 100:.0f} ILS/försäljning",
                "market": "Israel",
                "language": "Hebrew/English",
                "shipping": product["shipping"],
                "availability": product["availability"]
            }
            admin_products.append(admin_product)

        # Spara till JSON
        output_data = {
            "timestamp": datetime.now().isoformat(),
            "total_products": len(admin_products),
            "market": "Israel",
            "currency": "ILS",
            "products": admin_products
        }

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, ensure_ascii=False, indent=2)

        print(
            f"✅ Sparade {len(admin_products)} KSP-produkter till {output_file}")
        return admin_products


def main():
    """Demo av KSP API"""

    print("🇮🇱 KSP Israel API Integration - Demo")
    print("=" * 50)

    # Initiera API
    ksp = KSPAPI()

    # 1. Produktsökning
    print("1. 🔍 Produktsökning:")
    products = ksp.search_products("iPhone", "smartphones", 3)
    for i, product in enumerate(products, 1):
        commission = product['price'] * product['commission_rate'] / 100
        print(f"   {i}. {product['name']}")
        print(
            f"      💰 Pris: ₪{product['price']} ({product['sek_price']} SEK)")
        print(
            f"      ⭐ Betyg: {product['rating']}/5 ({product['review_count']:,} recensioner)")
        print(
            f"      🎯 Kommission: {product['commission_rate']}% = ₪{commission:.0f}/försäljning")
        print(f"      📦 Status: {product['availability']}")

    # 2. Produktdetaljer
    print("\n2. 🎯 Produktdetaljer (SKU):")
    product = ksp.get_product_by_sku("KSP_IP15PRO")
    if product:
        print(f"   📱 {product['name']}")
        print(f"   💰 Pris: ₪{product['price']} ({product['sek_price']} SEK)")
        print(f"   🏷️ Garanti: {product['warranty']}")
        print(f"   🚚 Leverans: {product['delivery']}")

    # 3. Trending produkter
    print("\n3. 🔥 Trending Produkter:")
    trending = ksp.get_trending_products(3)
    for product in trending:
        print(
            f"   • {product['name']} - ₪{product['price']} (Trend: {product['trend_score']}%)")

    # 4. Generera admin-panel data
    print("\n4. 🔄 Admin-panel Integration:")
    products = ksp.generate_affiliate_json()
    print(f"   ✅ Redo för admin-panel med {len(products)} produkter")


if __name__ == "__main__":
    main()
