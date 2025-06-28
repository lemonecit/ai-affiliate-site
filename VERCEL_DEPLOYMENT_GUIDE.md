# 🚀 Vercel Deployment Guide - AI Affiliate Platform

## ✅ **PRE-DEPLOYMENT CHECKLIST**

Din app är redan redo! Här är vad vi har:
- ✅ Next.js 14 konfigurerad
- ✅ package.json med build scripts
- ✅ next.config.js med environment variables
- ✅ TypeScript setup
- ✅ Tailwind CSS konfigurerad

---

## 🚀 **STEG 1: INSTALLERA VERCEL CLI (5 min)**

```bash
# Installera Vercel CLI globalt
npm install -g vercel

# Verifiera installation
vercel --version
```

---

## 🔗 **STEG 2: GITHUB REPOSITORY SETUP (10 min)**

### **A. Skapa GitHub Repository:**
```bash
# Om du inte redan har Git initierat:
git init
git add .
git commit -m "Initial commit - AI Affiliate Platform"

# Skapa repository på GitHub.com:
# 1. Gå till https://github.com/new
# 2. Repository name: "ai-affiliate-platform"
# 3. Public eller Private (rekommenderar Private för affiliate keys)
# 4. Create repository

# Länka till GitHub:
git remote add origin https://github.com/DITT-USERNAME/ai-affiliate-platform.git
git branch -M main
git push -u origin main
```

### **B. Alternativ: Använd GitHub Desktop**
- Öppna GitHub Desktop
- File → Add Local Repository
- Välj f:\ai-affiliate-site
- Publish repository

---

## 🌐 **STEG 3: VERCEL DEPLOYMENT (10 min)**

### **A. Login till Vercel:**
```bash
# Logga in (öppnar browser)
vercel login

# Välj GitHub för enklaste integration
```

### **B. Deploy Your App:**
```bash
# Från din projekt-katalog (f:\ai-affiliate-site)
vercel

# Första gången kommer den fråga:
# ? Set up and deploy "f:\ai-affiliate-site"? [Y/n] y
# ? Which scope do you want to deploy to? [Din account]
# ? Link to existing project? [N/y] n
# ? What's your project's name? ai-affiliate-platform
# ? In which directory is your code located? ./
# ? Want to modify these settings? [N/y] n
```

### **C. Production Deploy:**
```bash
# Deploy till production
vercel --prod

# Din app kommer nu vara live på: https://ai-affiliate-platform.vercel.app
```

---

## ⚙️ **STEG 4: ENVIRONMENT VARIABLES (15 min)**

### **A. Lägg till Environment Variables:**
```bash
# Via Vercel CLI:
vercel env add MONGODB_URI
vercel env add OPENAI_API_KEY
vercel env add AMAZON_ACCESS_KEY
vercel env add AMAZON_SECRET_KEY
vercel env add AMAZON_ASSOCIATE_TAG
vercel env add ALIEXPRESS_APP_KEY
vercel env add ALIEXPRESS_SECRET_KEY
vercel env add JWT_SECRET

# Eller via Vercel Dashboard:
# 1. Gå till https://vercel.com/dashboard
# 2. Välj ditt projekt
# 3. Settings → Environment Variables
# 4. Lägg till alla variabler
```

### **B. Environment Variables du behöver:**
```bash
# CRITICAL för affiliate-plattform:
MONGODB_URI=mongodb+srv://... (få från MongoDB Atlas)
AMAZON_ASSOCIATE_TAG=din-affiliate-tag-20
JWT_SECRET=random-string-för-säkerhet

# OPTIONAL för mock-data (kan vänta):
AMAZON_ACCESS_KEY=kommer-från-amazon-associates
AMAZON_SECRET_KEY=kommer-från-amazon-associates
ALIEXPRESS_APP_KEY=kommer-från-aliexpress
ALIEXPRESS_SECRET_KEY=kommer-från-aliexpress
OPENAI_API_KEY=för-ai-features
```

---

## 🌍 **STEG 5: CUSTOM DOMAIN (20 min)**

### **A. Välj Domän:**
```bash
# Rekommenderade domäner för affiliate:
lemondeals.co          # Om .com är upptagen
smartlemon.ai          # AI-fokus
lemonsavings.com       # Tydlig sparfokus
dealfinder.se          # Svenskt fokus
```

### **B. Köp Domän:**
```bash
# Rekommenderade registrars:
- Namecheap (billigt, bra service)
- Google Domains (enkelt)
- CloudFlare (bra integration)
- Binero (svenskt)
```

### **C. Konfigurera Domän i Vercel:**
```bash
# Via CLI:
vercel domains add yourdomain.com

# Via Dashboard:
# 1. Project Settings → Domains
# 2. Add Domain → yourdomain.com
# 3. Följ DNS-instruktioner från din registrar
```

### **D. DNS Settings:**
```bash
# Lägg till dessa DNS records hos din registrar:
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.19.19
```

---

## 🔧 **STEG 6: POST-DEPLOYMENT OPTIMERING (10 min)**

### **A. Verifiera Deployment:**
```bash
# Testa alla sidor:
https://yourdomain.com          # Hemsida
https://yourdomain.com/admin    # Admin panel
https://yourdomain.com/api/amazon/search?keywords=electronics
```

### **B. Aktivera Analytics:**
```bash
# Vercel Analytics (gratis):
# 1. Vercel Dashboard → Project → Analytics
# 2. Enable Analytics
# 3. Se real-time traffic data
```

### **C. Performance Check:**
```bash
# Testa prestanda:
- Google PageSpeed Insights
- GTmetrix
- WebPageTest

# Mål: 90+ score för affiliate conversion
```

---

## 📊 **STEG 7: MONITORING & ANALYTICS (15 min)**

### **A. Google Analytics 4:**
```javascript
// Lägg till i src/app/layout.tsx:
<Script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID" />
<Script id="google-analytics">
{`
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
`}
</Script>
```

### **B. Google Search Console:**
```bash
# 1. Gå till https://search.google.com/search-console
# 2. Add Property → yourdomain.com
# 3. Verify via DNS eller HTML file
# 4. Submit sitemap: yourdomain.com/sitemap.xml
```

---

## 🎯 **SUCCESS VALIDATION CHECKLIST**

Efter deployment, verifiera:
- [ ] ✅ Site laddas snabbt (< 3 sekunder)
- [ ] ✅ Admin panel fungerar
- [ ] ✅ API endpoints svarar
- [ ] ✅ Affiliate links fungerar
- [ ] ✅ Mobile responsive
- [ ] ✅ SSL certificate aktivt
- [ ] ✅ Analytics tracking aktiv
- [ ] ✅ Search Console verifierad

---

## 🚀 **NÄSTA STEG EFTER DEPLOYMENT**

### **DAG 1: Post-Deployment**
```bash
✅ Amazon Associates ansökan (med live URL)
✅ AliExpress Affiliate ansökan (med live URL)  
✅ Google Trends API setup
✅ Social media accounts (Twitter, LinkedIn)
```

### **DAG 2-3: Content & SEO**
```bash
✅ Första trending content
✅ SEO meta tags optimering
✅ Google Business Profile
✅ Basic backlink building
```

---

## 💡 **PRO TIPS**

### **Vercel-Specific:**
```bash
# Auto-deploy på Git push:
git push origin main  # Automatisk deploy till preview
git push origin production  # Deploy till production

# Preview deployments:
# Varje branch får egen preview URL
# Perfekt för testing innan production
```

### **Performance:**
```bash
# Vercel optimerar automatiskt:
✅ Image optimization
✅ Code splitting  
✅ Edge caching
✅ Gzip compression
```

### **Monitoring:**
```bash
# Vercel Dashboard visar:
- Real-time traffic
- Function executions
- Build times
- Error rates
```

---

## 🆘 **TROUBLESHOOTING**

### **Common Issues:**

**Build Errors:**
```bash
# Om build failar:
npm run build  # Test locally först
vercel logs    # Se deployment logs
```

**Environment Variables:**
```bash
# Om API inte fungerar:
vercel env ls     # Lista alla env vars
vercel env pull   # Pull till .env.local för testing
```

**Domain Issues:**
```bash
# Om domain inte fungerar:
vercel domains ls     # Lista domäner
nslookup yourdomain.com  # Verifiera DNS
```

**Ready att börja? Vilken steg vill du starta med först?**
