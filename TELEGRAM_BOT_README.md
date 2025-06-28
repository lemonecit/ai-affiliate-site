# 🤖 AI Affiliate Telegram Bot

En avancerad Telegram-bot som automatiskt postar affiliate-deals från din webbsida för att öka klick och försäljning.

## ✨ Funktioner

### 🔄 Automatisk Posting
- **Dagliga deals**: Postar automatiskt kl 09:00, 15:00 och 20:00
- **Kategori-specifika deals**: Elektronik kl 12:00, Gaming kl 18:00
- **Helgspecials**: Fredagar kl 16:00 med extra höga rabatter
- **Anti-duplikat**: Förhindrar samma produkt från att postas flera gånger

### 📊 Avancerad Spårning
- **UTM-parametrar**: Spårar klick från Telegram automatiskt
- **Plattformsspecifik spårning**: Separat spårning för Amazon och AliExpress
- **Analytics-integration**: Kopplar till din befintliga analytics

### 🎯 Smart Targeting
- **AI-rekommendationer**: Väljer bästa deals baserat på rabatt och rating
- **Kategori-filtrering**: Postar rätt produkter till rätt tider
- **Engagement-optimering**: Använder emojis och hashtags för bättre reach

### 🛡️ Säkerhet & Kontroll
- **Test-läge**: Testa på privat kanal innan live-posting
- **Admin-kommandon**: Manuell kontroll över poster
- **Felhantering**: Robust mot nätverksproblem och API-fel

## 🚀 Quick Start

### 1. Skapa Telegram Bot
```bash
# Gå till @BotFather på Telegram
# Skriv: /newbot
# Följ instruktionerna
# Kopiera BOT_TOKEN
```

### 2. Konfigurera Bot
Redigera `telegram_config.py`:
```python
BOT_TOKEN = "din_bot_token_här"
TEST_CHANNEL = "@din_test_kanal"
LIVE_CHANNELS = ["@din_publika_kanal"]
```

### 3. Installera & Starta
```bash
# Installera dependencies
pip install python-telegram-bot aiohttp

# Starta boten
python telegram_bot.py
```

## ⚙️ Konfiguration

### Posting-schema
```python
# telegram_config.py
DAILY_POST_TIMES = ["09:00", "15:00", "20:00"]
CATEGORY_POSTS = {
    "12:00": "Elektronik",
    "18:00": "Gaming"
}
WEEKEND_SPECIALS = {
    "friday": "16:00"
}
```

### Kanaler
```python
# Test-kanal (rekommenderat att börja med)
TEST_CHANNEL = "@din_test_kanal"

# Live-kanaler (publika kanaler för riktiga poster)
LIVE_CHANNELS = [
    "@affiliate_deals_sv",
    "@tech_deals_sweden"
]
```

### Rabattgränser
```python
MIN_DISCOUNT_DAILY = 15      # Minst 15% rabatt för dagliga poster
MIN_DISCOUNT_WEEKEND = 30    # Minst 30% rabatt för helgspecials
```

## 📱 Bot-kommandon

### Användarkommandon
- `/start` - Välkomstmeddelande och navigation
- `/deals` - Visa senaste erbjudanden  
- `/categories` - Bläddra produktkategorier
- `/stats` - Visa bot-statistik

### Admin-kommandon
- `/autopost` - Manuell autopost
- `/test` - Testa posting till test-kanal

## 🛠️ Setup Guide

### Steg 1: Skapa Telegram Bot
1. Öppna Telegram och sök efter `@BotFather`
2. Starta konversation och skriv `/newbot`
3. Följ instruktionerna för att skapa din bot
4. Kopiera BOT_TOKEN som du får

### Steg 2: Skapa Test-kanal
1. Skapa en privat Telegram-kanal
2. Lägg till din bot som admin
3. Kopiera kanal-namnet (börjar med @)

### Steg 3: Konfigurera Bot
1. Öppna `telegram_config.py`
2. Ersätt `BOT_TOKEN` med din riktiga token
3. Ersätt `TEST_CHANNEL` med din test-kanal
4. Anpassa posting-schema efter dina behov

### Steg 4: Testa Bot
```bash
python telegram_bot.py
```
1. Använd `/test` kommandot i din bot
2. Kontrollera att poster visas i test-kanalen
3. Testa alla kommandon

### Steg 5: Gå Live
1. Skapa publika kanaler för dina deals
2. Lägg till bot som admin i kanalerna
3. Uppdatera `LIVE_CHANNELS` i konfigurationen
4. Starta om boten

## 📊 Analytics & Spårning

### UTM-parametrar
Boten lägger automatiskt till UTM-parametrar för spårning:
```
utm_source=telegram
utm_medium=affiliate
utm_campaign=autopost
utm_content=[product_id]
```

### Klickspårning
- Alla klick från Telegram spåras automatiskt
- Data skickas till din befintliga analytics
- Möjlighet att se ROI per kanal

### Performance Metrics
- Antal poster per dag
- Klickfrekvens per produkt
- Bästa posting-tider
- Mest populära kategorier

## 🔧 Avancerade Inställningar

### Anpassa Meddelanden
```python
# telegram_config.py
PLATFORM_EMOJIS = {
    "amazon": "🟠",
    "aliexpress": "🔴"
}

CATEGORY_HASHTAGS = {
    "Elektronik": "#elektronik #tech",
    "Gaming": "#gaming #spel"
}
```

### Rate Limiting
```python
POST_DELAY = 2  # Sekunder mellan poster
```

### Logging
```python
LOG_LEVEL = "INFO"  # DEBUG, INFO, WARNING, ERROR
```

## 🚨 Troubleshooting

### Bot startar inte
```bash
# Kontrollera BOT_TOKEN
python -c "from telegram_config import BOT_TOKEN; print(BOT_TOKEN)"

# Kontrollera internetanslutning
ping telegram.org
```

### Inga poster visas
- Kontrollera att bot är admin i kanalen
- Kontrollera kanal-namn (måste börja med @)
- Kontrollera att produkter finns tillgängliga

### Dependencies-problem
```bash
pip install --upgrade python-telegram-bot aiohttp
```

## 📈 Optimering för Bästa Resultat

### 1. Timing
- Testa olika posting-tider
- Anpassa efter din målgrupps aktivitet
- Använd analytics för att hitta bästa tiderna

### 2. Innehåll
- Fokusera på höga rabatter (25%+)
- Välj produkter med höga ratings (4.5+)
- Använd engagerande beskrivningar

### 3. Frekvens
- Börja med färre poster (2-3/dag)
- Öka gradvis baserat på engagement
- Undvik spam - kvalitet över kvantitet

### 4. Kanaler
- Börja med en test-kanal
- Lägg till live-kanaler gradvis
- Övervaka engagement per kanal

## 🔗 Integration med Webbsida

Boten hämtar produkter från din befintliga affiliate-sida:
- Läser från `simple.html`
- Använder samma produktdata
- Kopplar till dashboard för analytics

## 📞 Support

För hjälp och frågor:
1. Kontrollera denna README
2. Kolla `telegram_config.py` för inställningar
3. Använd `/test` kommandot för debugging
4. Kontrollera logs för felmeddelanden

## 🎯 Resultat

Med korrekt setup kan du förvänta dig:
- **50-200% ökning** av klick från Telegram
- **Automatisk posting** 24/7 utan manuellt arbete
- **Bättre analytics** med UTM-spårning
- **Högre engagement** med optimerade meddelanden

Lycka till med din affiliate-marknadsföring! 🚀
