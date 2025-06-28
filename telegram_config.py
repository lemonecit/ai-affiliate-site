"""
Telegram Bot Konfiguration
Uppdatera dessa inställningar för din bot
"""

# ======= TELEGRAM BOT INSTÄLLNINGAR =======

# Bot Token från @BotFather (OBLIGATORISK)
BOT_TOKEN = "YOUR_TELEGRAM_BOT_TOKEN_HERE"

# Test-kanal för utveckling (rekommenderat att börja med)
TEST_CHANNEL = "@your_test_channel"  # Skapa en privat kanal först

# Publika kanaler för live-posting (lägg till när du är redo)
LIVE_CHANNELS = [
    "@your_affiliate_deals",
    "@your_tech_deals",
    # Lägg till fler kanaler här
]

# ======= POSTING SCHEMA =======

# Automatiska poster (24-timmars format)
DAILY_POST_TIMES = ["09:00", "15:00", "20:00"]

# Kategori-specifika poster
CATEGORY_POSTS = {
    "12:00": "Elektronik",
    "18:00": "Gaming"
}

# Helgspecials (veckodag: tid)
WEEKEND_SPECIALS = {
    "friday": "16:00"
}

# ======= MEDDELANDE INSTÄLLNINGAR =======

# Anpassade emojis per plattform
PLATFORM_EMOJIS = {
    "amazon": "🟠",
    "aliexpress": "🔴"
}

# Hashtags för kategorier
CATEGORY_HASHTAGS = {
    "Elektronik": "#elektronik #tech",
    "Gaming": "#gaming #spel",
    "Sport & Hälsa": "#sport #hälsa",
    "Hem & Trädgård": "#hem #trädgård"
}

# ======= KLICKSPÅRNING =======

# UTM-parametrar för bättre spårning
UTM_PARAMS = {
    "utm_source": "telegram",
    "utm_medium": "affiliate",
    "utm_campaign": "autopost"
}

# Webbsida URLs (uppdatera för din setup)
WEBSITE_URLS = {
    "main": "file:///F:/ai-affiliate-site/simple.html",
    "dashboard": "file:///F:/ai-affiliate-site/dashboard.html",
    "admin": "file:///F:/ai-affiliate-site/admin.html"
}

# ======= AVANCERADE INSTÄLLNINGAR =======

# Minimala rabatter för olika poster
MIN_DISCOUNT_DAILY = 15      # Dagliga poster
MIN_DISCOUNT_CATEGORY = 20   # Kategori-poster
MIN_DISCOUNT_WEEKEND = 30    # Helgspecials

# Rate limiting (sekunder mellan poster)
POST_DELAY = 2

# Loggnivå (DEBUG, INFO, WARNING, ERROR)
LOG_LEVEL = "INFO"

# ======= SETUP-HJÄLP =======

SETUP_INSTRUCTIONS = """
🛠️ Telegram Bot Setup Guide:

1. Skapa en Telegram Bot:
   - Gå till @BotFather på Telegram
   - Skriv /newbot
   - Följ instruktionerna 
   - Kopiera BOT_TOKEN

2. Skapa kanaler:
   - Skapa en test-kanal först
   - Lägg till din bot som admin
   - Uppdatera TEST_CHANNEL i denna fil

3. Testa boten:
   - Kör telegram_bot.py
   - Testa /test kommandot
   - Kontrollera att poster fungerar

4. Publika kanaler:
   - Skapa publika kanaler
   - Lägg till bot som admin  
   - Uppdatera LIVE_CHANNELS

5. Schema:
   - Anpassa POST_TIMES efter din målgrupp
   - Ändra kategorier efter dina produkter
   - Testa olika tider för bästa resultat

💡 Tips:
- Använd test-kanalen först
- Starta med få poster per dag
- Övervaka engagement och anpassa
- Använd analytics för att optimera
"""


def print_setup_help():
    """Skriver ut setup-hjälp"""
    print(SETUP_INSTRUCTIONS)


def validate_config():
    """Validerar konfigurationen"""
    errors = []

    if BOT_TOKEN == "YOUR_TELEGRAM_BOT_TOKEN_HERE":
        errors.append("❌ BOT_TOKEN måste uppdateras")

    if TEST_CHANNEL == "@your_test_channel":
        errors.append("⚠️ TEST_CHANNEL bör uppdateras")

    if not DAILY_POST_TIMES:
        errors.append("⚠️ Inga posting-tider konfigurerade")

    return errors


if __name__ == "__main__":
    print("🔧 Telegram Bot Konfiguration")
    print("=" * 40)

    errors = validate_config()
    if errors:
        print("Konfigurationsproblem:")
        for error in errors:
            print(f"  {error}")
        print()

    print_setup_help()
