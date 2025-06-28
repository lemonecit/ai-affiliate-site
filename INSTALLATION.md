## AI Affiliate Store - Utvecklingsguide

### Problem med installation
Det verkar som diskutrymmet är fullt. Här är några lösningar:

### Alternativ 1: Frigör diskutrymme
```bash
# Rensa npm cache
npm cache clean --force

# Rensa temp-filer
cleanmgr

# Ta bort onödiga filer från C:\Users\{username}\AppData\Local\npm-cache
```

### Alternativ 2: Använd en annan disk
```bash
# Flytta till F:\ med mer utrymme
cd F:\
mkdir ai-affiliate-site
cd ai-affiliate-site

# Kopiera projektet hit
```

### Alternativ 3: Minimal installation
```bash
# Installera bara det viktigaste
npm init -y
npm install next react react-dom
npm install --save-dev typescript @types/react @types/node
```

### Vad som är skapat hittills:

1. **Komplett projektstruktur** med Next.js 15 och TypeScript
2. **Dashboard** för klickspårning och analytics (`/dashboard`)
3. **Admin panel** för att hantera affiliate-länkar (`/admin`)
4. **AI-integration** för produktrekommendationer
5. **SEO-optimering** med meta-tags och schema markup
6. **Affiliate-klickspårning** med MongoDB
7. **Responsiv design** med Tailwind CSS

### Viktiga filer som skapats:

- `src/app/page.tsx` - Huvudsida med hero-sektion
- `src/app/dashboard/page.tsx` - Analytics dashboard
- `src/app/admin/page.tsx` - Admin panel för länkhantering
- `src/components/AffiliateButton.tsx` - Smart affiliate-knapp
- `src/components/SEO.tsx` - SEO-komponenter
- `src/app/api/clicks/route.ts` - API för klickspårning
- `src/app/api/analytics/route.ts` - API för analytics
- `src/app/api/ai/recommendations/route.ts` - AI-rekommendationer

### För att köra projektet:

1. **Frigör diskutrymme** (minst 500MB)
2. **Installera dependencies**: `npm install`
3. **Konfigurera .env.local** med dina API-nycklar
4. **Starta utvecklingsserver**: `npm run dev`

### Nästa steg efter installation:

1. Konfigurera MongoDB databas
2. Sätt upp OpenAI API-nyckel
3. Konfigurera Amazon & AliExpress affiliate-konton
4. Testa klickspårning
5. Lägg till dina första produkter

Projektet är redo att köra när diskutrymme-problemet är löst!
