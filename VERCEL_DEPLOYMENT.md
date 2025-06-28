# Vercel Deployment Guide för AI Affiliate Platform

## 🚀 Deployment Steps

### 1. Förberedelser
```bash
npm run build  # Kontrollera att build fungerar
```

### 2. Vercel CLI Installation (om inte redan installerat)
```bash
npm i -g vercel
```

### 3. Deploy till Vercel
```bash
vercel --prod
```

### 4. Environment Variables (Lägg till i Vercel Dashboard)
Gå till Vercel Dashboard → Settings → Environment Variables och lägg till:

```
MONGODB_URI=mongodb+srv://lemonec:<password>@cluster0.uutenrl.mongodb.net/affiliate-store?retryWrites=true&w=majority&appName=Cluster0
OPENAI_API_KEY=your_openai_api_key
AMAZON_ACCESS_KEY=your_amazon_access_key  
AMAZON_SECRET_KEY=your_amazon_secret_key
AMAZON_ASSOCIATE_TAG=your_amazon_associate_tag
ALIEXPRESS_APP_KEY=your_aliexpress_app_key
ALIEXPRESS_SECRET_KEY=your_aliexpress_secret_key
BOT_TOKEN=your_telegram_bot_token (valfritt)
```

### 5. Domän (Valfritt)
- Lägg till custom domain i Vercel Dashboard
- Konfigurera DNS records hos din domän-provider

## ✅ Vad som deployeras:

### Frontend:
- ✅ Modern React/Next.js UI med Tailwind CSS
- ✅ Responsiv design för mobil & desktop
- ✅ SEO-optimerade sidor
- ✅ Admin dashboard med funktionella knappar

### API Endpoints:
- ✅ `/api/analytics` - Analytics tracking & data
- ✅ `/api/admin/update-products` - Produktuppdatering 
- ✅ `/api/admin/trends-analysis` - Google Trends analys
- ✅ `/api/admin/activate-telegram` - Telegram bot aktivering
- ✅ `/api/admin/links` - Länkhantering
- ✅ `/api/clicks` - Click tracking

### Admin Features:
- ✅ `/admin` - Admin dashboard
- ✅ `/admin/links` - Länkhanterare
- ✅ Funktionella Quick Actions knappar
- ✅ Real-time status updates

### Affiliate Integration:
- ✅ Amazon affiliate länkar
- ✅ AliExpress affiliate länkar  
- ✅ Click tracking & analytics
- ✅ Commission beräkning

## 🔧 Efter Deployment:

1. **Testa admin-panelen**: `https://yoursite.vercel.app/admin`
2. **Aktivera Telegram bot** (om BOT_TOKEN är konfigurerat)
3. **Kör produktuppdatering** via admin-panelen
4. **Testa affiliate-länkar** och click tracking

## 📊 Monitoring:
- Vercel Analytics för performance
- MongoDB Atlas för databas monitoring  
- Admin dashboard för affiliate metrics

Plattformen är nu production-ready! 🎉
