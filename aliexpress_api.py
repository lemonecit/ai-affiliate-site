#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AliExpress Affiliate API Integration
Hämtar produkter från AliExpress Portals API
"""

import requests
import json
import hashlib
import time
import urllib.parse
from datetime import datetime

class AliExpressAPI:
    def __init__(self, app_key, secret_key):
        self.app_key = app_key
        self.secret_key = secret_key
        self.base_url = "https://api-sg.aliexpress.com/sync"
        
    def _generate_signature(self, params):
        """Generera signatur för AliExpress API"""
        # Sortera parametrar
        sorted_params = sorted(params.items())
        
        # Skapa sträng för signering
        sign_string = self.secret_key
        for key, value in sorted_params:
            sign_string += f"{key}{value}"
        sign_string += self.secret_key
        
        # MD5 hash
        return hashlib.md5(sign_string.encode('utf-8')).hexdigest().upper()
    
    def search_products(self, keywords="electronics", category_id=None, page_no=1, page_size=20):
        """Sök produkter på AliExpress"""
        try:
            # API parametrar
            params = {
                'method': 'aliexpress.affiliate.product.query',
                'app_key': self.app_key,
                'timestamp': str(int(time.time() * 1000)),
                'format': 'json',
                'v': '2.0',
                'sign_method': 'md5',
                'keywords': keywords,
                'page_no': str(page_no),
                'page_size': str(page_size),
                'sort': 'SALE_PRICE_ASC'
            }
            
            if category_id:
                params['category_ids'] = str(category_id)
            
            # Generera signatur
            params['sign'] = self._generate_signature(params)
            
            # Gör API-anrop
            response = requests.get(self.base_url, params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                return self._process_products(data)
            else:
                print(f"API Error: {response.status_code}")
                return self._get_demo_products()
                
        except Exception as e:
            print(f"AliExpress API Error: {e}")
            return self._get_demo_products()
    
    def _process_products(self, api_data):
        """Processera API-data till enhetligt format"""
        products = []
        
        try:
            if 'aliexpress_affiliate_product_query_response' in api_data:
                result = api_data['aliexpress_affiliate_product_query_response']['result']
                if result.get('products'):
                    for item in result['products']['product']:
                        product = {
                            'id': str(item.get('product_id', '')),
                            'title': item.get('product_title', 'AliExpress Product'),
                            'price': float(item.get('target_sale_price', '0').replace('$', '').replace(',', '')),
                            'original_price': float(item.get('target_original_price', '0').replace('$', '').replace(',', '')),
                            'currency': 'USD',
                            'image_url': item.get('product_main_image_url', ''),
                            'product_url': item.get('promotion_link', ''),
                            'rating': float(item.get('evaluate_rate', '0').replace('%', '')) / 20,  # Convert % to 5-star
                            'review_count': int(item.get('orders_count', 0)),
                            'discount': item.get('discount', '0%'),
                            'shipping': item.get('ship_to_days', 'Free shipping'),
                            'store_name': item.get('shop_name', 'AliExpress Store'),
                            'category': item.get('second_level_category_name', 'Electronics'),
                            'source': 'aliexpress'
                        }
                        
                        # Beräkna discount percent
                        if product['original_price'] > product['price']:
                            discount_percent = ((product['original_price'] - product['price']) / product['original_price']) * 100
                            product['discount'] = f"{discount_percent:.0f}% OFF"
                        
                        products.append(product)
        except Exception as e:
            print(f"Error processing AliExpress data: {e}")
            return self._get_demo_products()
        
        return products
    
    def _get_demo_products(self):
        """Demo-produkter om API inte fungerar"""
        return [
            {
                'id': 'ae001',
                'title': 'Wireless Bluetooth Earbuds Pro Max',
                'price': 25.99,
                'original_price': 49.99,
                'currency': 'USD',
                'image_url': 'https://via.placeholder.com/300x300/1890FF/white?text=AliExpress+Earbuds',
                'product_url': 'https://aliexpress.com/item/demo1.html',
                'rating': 4.5,
                'review_count': 2847,
                'discount': '48% OFF',
                'shipping': 'Free shipping',
                'store_name': 'TechWorld Official Store',
                'category': 'Electronics',
                'source': 'aliexpress'
            },
            {
                'id': 'ae002',
                'title': 'Smart Watch Fitness Tracker 2024',
                'price': 19.99,
                'original_price': 39.99,
                'currency': 'USD',
                'image_url': 'https://via.placeholder.com/300x300/FF6B35/white?text=Smart+Watch',
                'product_url': 'https://aliexpress.com/item/demo2.html',
                'rating': 4.3,
                'review_count': 1523,
                'discount': '50% OFF',
                'shipping': 'Free shipping',
                'store_name': 'WearTech Store',
                'category': 'Wearables',
                'source': 'aliexpress'
            },
            {
                'id': 'ae003',
                'title': 'USB-C Fast Charging Cable 3-Pack',
                'price': 8.99,
                'original_price': 19.99,
                'currency': 'USD',
                'image_url': 'https://via.placeholder.com/300x300/28A745/white?text=USB-C+Cable',
                'product_url': 'https://aliexpress.com/item/demo3.html',
                'rating': 4.7,
                'review_count': 892,
                'discount': '55% OFF',
                'shipping': 'Free shipping',
                'store_name': 'Cable Pro Store',
                'category': 'Accessories',
                'source': 'aliexpress'
            },
            {
                'id': 'ae004',
                'title': 'Portable Phone Stand Adjustable Desk Holder',
                'price': 12.99,
                'original_price': 24.99,
                'currency': 'USD',
                'image_url': 'https://via.placeholder.com/300x300/6F42C1/white?text=Phone+Stand',
                'product_url': 'https://aliexpress.com/item/demo4.html',
                'rating': 4.4,
                'review_count': 634,
                'discount': '48% OFF',
                'shipping': 'Free shipping',
                'store_name': 'MobileAcc Store',
                'category': 'Phone Accessories',
                'source': 'aliexpress'
            },
            {
                'id': 'ae005',
                'title': 'LED Desk Lamp with Wireless Charging Base',
                'price': 35.99,
                'original_price': 69.99,
                'currency': 'USD',
                'image_url': 'https://via.placeholder.com/300x300/FD7E14/white?text=LED+Lamp',
                'product_url': 'https://aliexpress.com/item/demo5.html',
                'rating': 4.6,
                'review_count': 445,
                'discount': '49% OFF',
                'shipping': 'Free shipping',
                'store_name': 'HomeLight Store',
                'category': 'Home & Garden',
                'source': 'aliexpress'
            },
            {
                'id': 'ae006',
                'title': 'Gaming Mouse RGB Backlit 6000 DPI',
                'price': 18.99,
                'original_price': 45.99,
                'currency': 'USD',
                'image_url': 'https://via.placeholder.com/300x300/E03131/white?text=Gaming+Mouse',
                'product_url': 'https://aliexpress.com/item/demo6.html',
                'rating': 4.5,
                'review_count': 1276,
                'discount': '59% OFF',
                'shipping': 'Free shipping',
                'store_name': 'GameGear Pro',
                'category': 'Computer & Office',
                'source': 'aliexpress'
            }
        ]

def main():
    """Test AliExpress API"""
    # Använd nycklar från .env filen (demo-värden här)
    app_key = "514666"
    secret_key = "ZSaX6DUcdANbkXaBFdDVHZagV9u9Evkl"
    
    # Skapa API-instans
    api = AliExpressAPI(app_key, secret_key)
    
    print("🔍 Hämtar AliExpress produkter...")
    
    # Sök produkter
    categories = [
        {"name": "Electronics", "keywords": "electronics gadgets"},
        {"name": "Phone Accessories", "keywords": "phone case charger"},
        {"name": "Home & Garden", "keywords": "home decor gadgets"},
        {"name": "Sports", "keywords": "fitness workout gear"}
    ]
    
    all_products = []
    
    for category in categories:
        print(f"📱 Hämtar {category['name']} produkter...")
        products = api.search_products(
            keywords=category['keywords'],
            page_size=5
        )
        all_products.extend(products)
        time.sleep(1)  # Rate limiting
    
    # Spara till JSON
    output_file = 'aliexpress_products.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_products, f, indent=2, ensure_ascii=False)
    
    print(f"✅ {len(all_products)} AliExpress produkter sparade till {output_file}")
    
    # Visa exempel
    if all_products:
        print(f"\n📦 Exempel produkt:")
        product = all_products[0]
        print(f"Titel: {product['title']}")
        print(f"Pris: ${product['price']}")
        print(f"Tidigare pris: ${product['original_price']}")
        print(f"Rabatt: {product['discount']}")
        print(f"Betyg: {product['rating']}/5 ({product['review_count']} recensioner)")
        print(f"Butik: {product['store_name']}")

if __name__ == "__main__":
    main()
