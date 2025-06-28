# 🤖 AI Affiliate Telegram Bot

En avancerad Telegr# Testa bot först
python telegram_bot.py test

# Skicka manuell post
python telegram_bot.py manual

# Starta automatisk bot
python telegram_bot.py

# Eller använd launcher
python start_telegram_bot.py
```

### 4. Skapa Telegram-kanaler
```bash
# Skapa en privat test-kanal först:
# 1. Öppna Telegram
# 2. Ny kanal -> Privat
# 3. Namn: "Test Affiliate Deals" 
# 4. Lägg till din bot som admin
# 5. Kopiera kanal-länken (t.ex. @test_affiliate_deals)

# För publika kanaler:
# 1. Skapa publik kanal
# 2. Lägg till bot som admin med post-rättigheter
# 3. Uppdatera LIVE_CHANNELS i telegram_config.py
```

## 🔧 Konfigurationt som automatiskt postar affiliate-deals från din webbsida för att öka klick och försäljning.

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
pip install -r requirements.txt

# Eller använd starter-skriptet
python start_telegram_bot.py

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
python -c "from telegram_config import BOT_TOKEN; print('Token OK' if BOT_TOKEN != 'YOUR_TELEGRAM_BOT_TOKEN_HERE' else 'Token saknas')"

# Testa bot-anslutning
python telegram_bot.py test
```

### Får "Chat not found" fel
- Bot måste vara admin i kanalen
- Kanal-namn måste börja med @ (t.ex. @min_kanal)
- För privata kanaler: Lägg till bot först, sedan gör admin

### Inga poster visas
- Kontrollera att `affiliate_suggestions.json` finns och innehåller produkter
- Kolla loggar: Kör med `python telegram_bot.py` för att se felmeddelanden
- Testa manuell post: `python telegram_bot.py manual`

### Dependencies-problem
```bash
# Installera på nytt
pip install --force-reinstall -r requirements.txt

# Eller específik version
pip install python-telegram-bot==20.7
```

### "No module named" fel
```bash
# Kontrollera Python-path
python -c "import sys; print(sys.path)"

# Installera i rätt environment
python -m pip install -r requirements.txt
```

## 🎯 Setup-Guide Steg-för-Steg

### Steg 1: Skapa Telegram Bot
1. Öppna Telegram och sök efter `@BotFather`
2. Skriv `/newbot`
3. Följ instruktionerna och få din `BOT_TOKEN`
4. Kopiera token till `telegram_config.py`

### Steg 2: Skapa Test-kanal
1. Skapa ny privat kanal i Telegram
2. Namn: "Test Affiliate" 
3. Lägg till din bot (sök efter bot-namnet)
4. Gör bot till admin med post-rättigheter
5. Kopiera kanal-länk till `TEST_CHANNEL` i config

### Steg 3: Testa Setup
```bash
# Kör test
python start_telegram_bot.py
# Välj alternativ 1 (Testa bot)
```

### Steg 4: Skicka Test-post
```bash
# Kör manuell post
python start_telegram_bot.py  
# Välj alternativ 2 (Manuell post)
```

### Steg 5: Gå Live
1. Skapa publik kanal för riktiga poster
2. Lägg till i `LIVE_CHANNELS` 
3. Starta automatisk bot: `python telegram_bot.py`

## 📊 Analytics & Tracking

### UTM-parametrar
Alla länkar får automatiska UTM-parametrar:
```
?utm_source=telegram
&utm_medium=bot  
&utm_campaign=auto_deals
```

### Click Tracking
Bot kopplar till din sites click-tracking API för att mäta:
- Klick från Telegram vs andra källor
- Konverteringsrate per kanal
- Bästa produkter och kategorier

### Rapporter
Använd Google Analytics för att se:
- Traffic från `utm_source=telegram`
- Conversion rate per kampanj
- Revenue attribution

## 🚀 Avancerade Funktioner

### Custom Scheduling
```python
# I telegram_config.py - lägg till egen schema
CUSTOM_POSTS = {
    "monday": {"time": "10:00", "category": "Elektronik"},
    "wednesday": {"time": "14:00", "category": "Gaming"},
    "friday": {"time": "16:00", "type": "high_discount"}
}
```

### A/B Testing
```python
# Testa olika meddelande-format
MESSAGE_VARIANTS = [
    "standard",  # Nuvarande format  
    "short",     # Kortare meddelanden
    "emoji_heavy" # Fler emojis
]
```

### Smart Product Selection
Bot väljer produkter baserat på:
- **Rabatt** (högre = bättre)
- **Rating** (4+ stjärnor prioriteras)
- **Kategori-popularity** (trender)
- **Tidigare klickrate** (lär sig vad som fungerar)

## 📈 Optimering för Bästa Resultat

### 1. Timing
- **Morgon**: 09:00 - Deals för dagen
- **Lunch**: 12:00 - Kategori-specifikt  
- **Kväll**: 20:00 - Premium-produkter
- **Helger**: Specialerbjudanden med högre rabatter

### 2. Innehåll som Fungerar
- ✅ Rabatter över 25%
- ✅ Produkter med 4.5+ stjärnor
- ✅ Trending kategorier (gaming, elektronik)
- ✅ Begränsad tid ("Idag endast!")

### 3. Kanal-hantering
- Börja med 1 test-kanal
- Lägg till publika kanaler gradvis
- Monitora engagement-rate
- Ta bort underpresterande kanaler

### 4. Följ Up med Analytics
```bash
# Kolla klick-statistik varje vecka
python -c "
import json
with open('click_stats.json') as f:
    stats = json.load(f)
    telegram_clicks = [c for c in stats if c['source'] == 'telegram']
    print(f'Telegram klick senaste veckan: {len(telegram_clicks)}')
"
```

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
