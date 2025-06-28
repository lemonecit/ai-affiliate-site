"""
Telegram Bot Demo - Visa hur meddelanden ser ut
Kör detta för att se exempel på bot-poster utan att skicka till Telegram
"""

import json
import asyncio
from datetime import datetime


class TelegramBotDemo:
    def __init__(self):
        self.platform_emojis = {
            "amazon": "🟠",
            "aliexpress": "🔴"
        }
        self.category_hashtags = {
            "Elektronik": "#elektronik #tech",
            "Gaming": "#gaming #spel",
            "Sport & Hälsa": "#sport #hälsa",
            "Hem & Trädgård": "#hem #trädgård"
        }

    def get_sample_products(self):
        """Demo-produkter"""
        return [
            {
                "title": "Trådlösa Gaming-hörlurar med RGB",
                "platform": "amazon",
                "category": "Gaming",
                "price": "299 kr",
                "rating": 4.7,
                "discount": 35,
                "id": "gaming_headset_001"
            },
            {
                "title": "Smart Fitness-tracker med Pulsmätare",
                "platform": "aliexpress",
                "category": "Sport & Hälsa",
                "price": "199 kr",
                "rating": 4.4,
                "discount": 28,
                "id": "fitness_tracker_002"
            },
            {
                "title": "LED Strip 5m RGB med App-kontroll",
                "platform": "amazon",
                "category": "Elektronik",
                "price": "149 kr",
                "rating": 4.6,
                "discount": 42,
                "id": "led_strip_003"
            }
        ]

    def format_product_message(self, product):
        """Formatera meddelande som i riktiga boten"""
        title = product.get('title', 'Okänd produkt')
        platform = product.get('platform', 'unknown')
        category = product.get('category', 'Övrigt')
        price = product.get('price', 'Pris på förfrågan')
        rating = product.get('rating', 0)
        discount = product.get('discount', 0)

        # Emojis
        platform_emoji = self.platform_emojis.get(platform, "🔗")
        rating_stars = "⭐" * min(int(rating), 5)

        # Demo affiliate-länk
        product_id = product.get('id', 'unknown')
        affiliate_url = f"https://ai-affiliate-site.vercel.app/product/{product_id}?utm_source=telegram&utm_medium=bot&utm_campaign=auto_deals"

        # Formatera meddelande
        message = f"""
{platform_emoji} **{title}**

💰 **Pris**: {price}
{rating_stars} **Betyg**: {rating}/5
{'🔥 **Rabatt**: ' + str(discount) + '%' if discount > 0 else ''}

🛒 **Köp här**: {affiliate_url}

{self.category_hashtags.get(category, '#deals #affiliate')}
#trending #ai #recommendations
        """.strip()

        return message

    def demo_daily_post(self):
        """Demo av daglig post"""
        products = self.get_sample_products()
        best_product = max(products, key=lambda p: (
            p.get('discount', 0) * 0.6 +
            p.get('rating', 0) * 0.4
        ))

        message = self.format_product_message(best_product)

        print("=" * 60)
        print("📱 DAGLIG DEAL - Demo av Telegram-post")
        print("=" * 60)
        print(f"🕐 Tid: {datetime.now().strftime('%H:%M')}")
        print(f"📢 Kanal: @demo_affiliate_deals")
        print("-" * 60)
        print(message)
        print("=" * 60)

        return message

    def demo_category_post(self, category="Gaming"):
        """Demo av kategori-specifik post"""
        products = self.get_sample_products()
        category_products = [
            p for p in products
            if p.get('category', '').lower() == category.lower()
        ]

        if not category_products:
            print(f"❌ Inga produkter för kategori: {category}")
            return

        best_product = max(category_products, key=lambda p: p.get('rating', 0))
        message = self.format_product_message(best_product)
        category_header = f"🎯 **{category.upper()} SPECIAL**\n\n"

        print("=" * 60)
        print(f"🎮 {category.upper()} SPECIAL - Demo av Telegram-post")
        print("=" * 60)
        print(f"🕐 Tid: {datetime.now().strftime('%H:%M')}")
        print(f"📢 Kanal: @demo_gaming_deals")
        print("-" * 60)
        print(category_header + message)
        print("=" * 60)

        return message

    def demo_weekend_special(self):
        """Demo av helgspecial"""
        products = self.get_sample_products()

        # Produkter med höga rabatter
        high_discount_products = [
            p for p in products
            if p.get('discount', 0) > 30
        ]

        if high_discount_products:
            best_product = max(high_discount_products,
                               key=lambda p: p.get('discount', 0))
        else:
            best_product = products[0]

        message = self.format_product_message(best_product)
        weekend_header = f"🎉 **HELGSPECIAL** 🎉\n\n"

        print("=" * 60)
        print("🎊 HELGSPECIAL - Demo av Telegram-post")
        print("=" * 60)
        print(f"🕐 Tid: Fredag {datetime.now().strftime('%H:%M')}")
        print(f"📢 Kanal: @demo_weekend_deals")
        print("-" * 60)
        print(weekend_header + message)
        print("=" * 60)

        return message

    def show_all_demos(self):
        """Visa alla demo-typer"""
        print("\n🤖 AI Affiliate Telegram Bot - LIVE DEMO")
        print("Så här ser dina automatiska poster ut:\n")

        # Daglig post
        self.demo_daily_post()

        print("\n" + "⏰" * 20)
        print("SENARE SAMMA DAG...")
        print("⏰" * 20 + "\n")

        # Kategori-post
        self.demo_category_post("Gaming")

        print("\n" + "📅" * 20)
        print("FREDAG EFTERMIDDAG...")
        print("📅" * 20 + "\n")

        # Helgspecial
        self.demo_weekend_special()

        print("\n" + "=" * 60)
        print("✨ Demo slutförd!")
        print("=" * 60)
        print("Så här ser dina Telegram-poster ut!")
        print("För att aktivera riktiga poster:")
        print("1. Konfigurera telegram_config.py med din BOT_TOKEN")
        print("2. Skapa Telegram-kanaler")
        print("3. Kör: python telegram_bot.py")
        print("=" * 60)


def main():
    demo = TelegramBotDemo()
    demo.show_all_demos()


if __name__ == "__main__":
    main()
