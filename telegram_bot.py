"""
AI Affiliate Telegram Bot
Automatiska affiliate-deals från AI-driven trendanalys
"""

import asyncio
import json
import logging
import os
import schedule
import time
from datetime import datetime, timedelta
from typing import Dict, List, Optional

import aiohttp
from telegram import Bot
from telegram.error import TelegramError

# Importera konfiguration
from telegram_config import (
    BOT_TOKEN, TEST_CHANNEL, LIVE_CHANNELS,
    DAILY_POST_TIMES, CATEGORY_POSTS, WEEKEND_SPECIALS,
    PLATFORM_EMOJIS, CATEGORY_HASHTAGS
)

# Logging setup
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class AffiliateBot:
    def __init__(self):
        self.bot = Bot(token=BOT_TOKEN)
        self.base_url = "https://ai-affiliate-site.vercel.app"  # Din live site
        self.posted_products = set()  # Förhindra duplikater
        self.session = None
        
    async def initialize(self):
        """Initialisera asynkron session"""
        self.session = aiohttp.ClientSession()
        
    async def cleanup(self):
        """Stäng asynkron session"""
        if self.session:
            await self.session.close()
    
    async def get_trending_products(self) -> List[Dict]:
        """Hämta trending produkter från din site"""
        try:
            # Läs från lokala JSON-filer eller API
            with open('affiliate_suggestions.json', 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Filtrera bort redan postade produkter
            new_products = []
            for product in data.get('suggestions', []):
                product_key = f"{product.get('title', '')}-{product.get('platform', '')}"
                if product_key not in self.posted_products:
                    new_products.append(product)
                    
            return new_products[:5]  # Max 5 produkter per batch
            
        except Exception as e:
            logger.error(f"Fel vid hämtning av produkter: {e}")
            return []
    
    async def format_product_message(self, product: Dict) -> str:
        """Formatera produktmeddelande för Telegram"""
        try:
            title = product.get('title', 'Okänd produkt')
            platform = product.get('platform', 'unknown')
            category = product.get('category', 'Övrigt')
            price = product.get('price', 'Pris på förfrågan')
            rating = product.get('rating', 0)
            discount = product.get('discount', 0)
            
            # Emojis
            platform_emoji = PLATFORM_EMOJIS.get(platform, "🔗")
            rating_stars = "⭐" * min(int(rating), 5)
            
            # Bygg affiliate-länk med UTM-parametrar
            product_id = product.get('id', 'unknown')
            affiliate_url = f"{self.base_url}/product/{product_id}?utm_source=telegram&utm_medium=bot&utm_campaign=auto_deals"
            
            # Formatera meddelande
            message = f"""
{platform_emoji} **{title}**

💰 **Pris**: {price}
{rating_stars} **Betyg**: {rating}/5
{'🔥 **Rabatt**: ' + str(discount) + '%' if discount > 0 else ''}

🛒 **Köp här**: {affiliate_url}

{CATEGORY_HASHTAGS.get(category, '#deals #affiliate')}
#trending #ai #recommendations
            """.strip()
            
            return message
            
        except Exception as e:
            logger.error(f"Fel vid formatering av meddelande: {e}")
            return f"🔗 Kolla in denna deal: {self.base_url}"
    
    async def send_to_channel(self, channel: str, message: str) -> bool:
        """Skicka meddelande till kanal"""
        try:
            await self.bot.send_message(
                chat_id=channel,
                text=message,
                parse_mode='Markdown',
                disable_web_page_preview=False
            )
            logger.info(f"Meddelande skickat till {channel}")
            return True
            
        except TelegramError as e:
            logger.error(f"Telegram-fel för kanal {channel}: {e}")
            return False
        except Exception as e:
            logger.error(f"Okänt fel för kanal {channel}: {e}")
            return False
    
    async def post_daily_deals(self):
        """Posta dagliga deals"""
        try:
            products = await self.get_trending_products()
            if not products:
                logger.warning("Inga produkter att posta")
                return
            
            # Välj bästa produkten baserat på rabatt och rating
            best_product = max(products, key=lambda p: (
                p.get('discount', 0) * 0.6 + 
                p.get('rating', 0) * 0.4
            ))
            
            message = await self.format_product_message(best_product)
            
            # Posta till test-kanal först
            if TEST_CHANNEL:
                await self.send_to_channel(TEST_CHANNEL, f"🧪 **TEST POST**\n\n{message}")
            
            # Posta till live-kanaler
            for channel in LIVE_CHANNELS:
                success = await self.send_to_channel(channel, message)
                if success:
                    # Markera som postad
                    product_key = f"{best_product.get('title', '')}-{best_product.get('platform', '')}"
                    self.posted_products.add(product_key)
                
                # Paus mellan kanaler för att undvika rate limiting
                await asyncio.sleep(2)
                
        except Exception as e:
            logger.error(f"Fel vid posting av dagliga deals: {e}")
    
    async def post_category_deals(self, category: str):
        """Posta kategori-specifika deals"""
        try:
            products = await self.get_trending_products()
            
            # Filtrera efter kategori
            category_products = [
                p for p in products 
                if p.get('category', '').lower() == category.lower()
            ]
            
            if not category_products:
                logger.warning(f"Inga produkter för kategori: {category}")
                return
            
            # Välj bästa produkten i kategorin
            best_product = max(category_products, key=lambda p: p.get('rating', 0))
            
            message = await self.format_product_message(best_product)
            category_header = f"🎯 **{category.upper()} SPECIAL**\n\n"
            
            # Posta till alla kanaler
            for channel in LIVE_CHANNELS:
                await self.send_to_channel(channel, category_header + message)
                await asyncio.sleep(2)
                
            # Markera som postad
            product_key = f"{best_product.get('title', '')}-{best_product.get('platform', '')}"
            self.posted_products.add(product_key)
            
        except Exception as e:
            logger.error(f"Fel vid kategori-posting: {e}")
    
    async def post_weekend_special(self):
        """Posta helgspecials med högre rabatter"""
        try:
            products = await self.get_trending_products()
            
            # Filtrera produkter med höga rabatter (>20%)
            high_discount_products = [
                p for p in products 
                if p.get('discount', 0) > 20
            ]
            
            if not high_discount_products:
                # Fallback till bästa produkten
                high_discount_products = products[:1]
            
            if not high_discount_products:
                return
            
            best_product = max(high_discount_products, key=lambda p: p.get('discount', 0))
            
            message = await self.format_product_message(best_product)
            weekend_header = f"🎉 **HELGSPECIAL** 🎉\n\n"
            
            for channel in LIVE_CHANNELS:
                await self.send_to_channel(channel, weekend_header + message)
                await asyncio.sleep(2)
                
            product_key = f"{best_product.get('title', '')}-{best_product.get('platform', '')}"
            self.posted_products.add(product_key)
            
        except Exception as e:
            logger.error(f"Fel vid helgspecial: {e}")
    
    def schedule_posts(self):
        """Schemalägg automatiska poster"""
        # Dagliga poster
        for post_time in DAILY_POST_TIMES:
            schedule.every().day.at(post_time).do(
                lambda: asyncio.create_task(self.post_daily_deals())
            )
        
        # Kategori-specifika poster
        for post_time, category in CATEGORY_POSTS.items():
            schedule.every().day.at(post_time).do(
                lambda cat=category: asyncio.create_task(self.post_category_deals(cat))
            )
        
        # Helgspecials
        for day, post_time in WEEKEND_SPECIALS.items():
            getattr(schedule.every(), day).at(post_time).do(
                lambda: asyncio.create_task(self.post_weekend_special())
            )
        
        logger.info("Schemaläggning klar - poster kommer att köras automatiskt")
    
    async def test_bot(self):
        """Testa bot-funktionalitet"""
        try:
            # Testa bot-token
            me = await self.bot.get_me()
            logger.info(f"Bot ansluten: @{me.username}")
            
            # Testa med en produkt
            test_product = {
                "title": "Test Produkt",
                "platform": "amazon",
                "category": "Elektronik",
                "price": "199 kr",
                "rating": 4.5,
                "discount": 25,
                "id": "test123"
            }
            
            message = await self.format_product_message(test_product)
            
            if TEST_CHANNEL:
                success = await self.send_to_channel(
                    TEST_CHANNEL, 
                    f"🧪 **BOT TEST**\n\n{message}"
                )
                if success:
                    logger.info("Test lyckades! Bot är redo att användas.")
                    return True
            else:
                logger.warning("Ingen test-kanal konfigurerad")
                
        except Exception as e:
            logger.error(f"Bot-test misslyckades: {e}")
            return False
    
    async def run_manual_post(self):
        """Manuell post för testning"""
        await self.initialize()
        await self.post_daily_deals()
        await self.cleanup()

def run_bot():
    """Kör bot i bakgrunden"""
    bot = AffiliateBot()
    
    async def main():
        await bot.initialize()
        
        # Testa bot först
        test_success = await bot.test_bot()
        if not test_success:
            logger.error("Bot-test misslyckades. Kontrollera konfiguration.")
            return
        
        # Schemalägg poster
        bot.schedule_posts()
        
        # Kör scheduler
        while True:
            schedule.run_pending()
            await asyncio.sleep(60)  # Kolla varje minut
    
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Bot stoppad av användare")
    except Exception as e:
        logger.error(f"Bot kraschade: {e}")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        if sys.argv[1] == "test":
            # Kör test
            bot = AffiliateBot()
            asyncio.run(bot.test_bot())
        elif sys.argv[1] == "manual":
            # Manuell post
            bot = AffiliateBot()
            asyncio.run(bot.run_manual_post())
    else:
        # Kör full bot
        run_bot()
