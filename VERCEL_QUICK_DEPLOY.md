# ⚡ Vercel Deployment - SNABBGUIDE (15-30 minuter)

## 🚀 **SUPER SNABB VÄGEN (15 minuter)**

### **Metod 1: GitHub + Vercel (Rekommenderad)**
```bash
⏱️ TOTALTID: 15-20 minuter

✅ 2 min: Push kod till GitHub
✅ 3 min: Koppla GitHub till Vercel  
✅ 5 min: Första deployment
✅ 5 min: Custom domain setup
✅ KLART!
```

### **Metod 2: Vercel CLI (Ännu snabbare)**
```bash
⏱️ TOTALTID: 10-15 minuter

✅ 2 min: npm i -g vercel
✅ 1 min: vercel login
✅ 5 min: vercel --prod  
✅ 5 min: Domain setup
✅ KLART!
```

---

## ⚡ **STEG-FÖR-STEG (CLI Metoden)**

### **STEG 1: Installera Vercel (2 minuter)**
```bash
# Installera Vercel CLI globalt
npm install -g vercel

# Login med GitHub/Google/Email
vercel login
```

### **STEG 2: Deploy App (5 minuter)**
```bash
# Från din f:\ai-affiliate-site katalog
cd f:\ai-affiliate-site

# Deploy till Vercel (auto-detekterar Next.js)
vercel --prod

# Följ prompten:
# ? Set up and deploy "f:\ai-affiliate-site"? [Y/n] Y
# ? Which scope? [Your Account]
# ? Link to existing project? [y/N] N  
# ? What's your project's name? ai-affiliate-platform
# ? In which directory is your code located? ./
```

### **STEG 3: Domain Setup (5 minuter)**
```bash
# Lägg till custom domain (om du har en)
vercel domains add yourdomain.com

# Eller använd gratis .vercel.app domain
# Exempel: ai-affiliate-platform.vercel.app
```

### **STEG 4: Environment Variables (3 minuter)**
```bash
# Lägg till API keys (viktigt för production)
vercel env add AMAZON_API_KEY
vercel env add ALIEXPRESS_API_KEY
vercel env add GOOGLE_TRENDS_API
vercel env add MONGODB_URI

# Eller via Vercel Dashboard (enklare)
```

---

## 🌐 **ALTERNATIV: GitHub Integration (Lite längre men bättre long-term)**

### **STEG 1: GitHub Repo (3 minuter)**
```bash
# Om du inte har GitHub repo än:
git init
git add .
git commit -m "Initial commit"
git branch -M main

# Skapa repo på github.com
# Push kod:
git remote add origin https://github.com/username/ai-affiliate-platform.git
git push -u origin main
```

### **STEG 2: Vercel Import (5 minuter)**
```bash
1. Gå till vercel.com
2. Klicka "New Project"
3. Välj ditt GitHub repo
4. Vercel auto-detekterar Next.js settings
5. Klicka "Deploy"
```

### **STEG 3: Auto-Deploy Setup (2 minuter)**
```bash
# Nu deployas automatiskt vid varje git push!
git add .
git commit -m "Update"
git push
# → Auto-deployment startar
```

---

## ⚠️ **VANLIGA FELSÖKNINGAR (om något går fel)**

### **Build Errors:**
```bash
# Om build failar, kör lokalt först:
npm run build

# Vanliga fix:
npm install
npm run build
# Om det fungerar lokalt → borde fungera på Vercel
```

### **Environment Variables:**
```bash
# Lägg till via Vercel Dashboard:
# vercel.com → Your Project → Settings → Environment Variables

# Eller CLI:
vercel env add NODE_ENV production
vercel env add NEXT_PUBLIC_SITE_URL https://yourdomain.com
```

### **Domain Issues:**
```bash
# DNS setup (om du använder egen domain):
# Lägg till dessa DNS records hos din domain provider:

CNAME: www → cname.vercel-dns.com
A: @ → 76.76.19.19
```

---

## 🎯 **EFTER DEPLOYMENT (5 minuter extra)**

### **Omedelbar TODO:**
```bash
✅ Testa live site: https://your-site.vercel.app
✅ Kontrollera admin panel fungerar
✅ Verifiera API endpoints svarar
✅ Test affiliate links (mock data OK för nu)
✅ Mobile responsive check
```

### **Analytics Setup:**
```bash
# Vercel Analytics (gratis):
npm install @vercel/analytics
# Lägg till i layout.tsx

# Google Analytics:
# Lägg till GA code i Head component
```

---

## 🏆 **RESULTAT EFTER 15-30 MINUTER:**

```bash
✅ Live AI Affiliate Platform
✅ Global CDN (snabb loading worldwide)  
✅ HTTPS + SSL certificate
✅ Auto-scaling
✅ Deployment analytics
✅ Custom domain (om du vill)
✅ Professional URL för affiliate ansökningar
```

---

## 💡 **PRO TIPS**

### **Snabba Domän-alternativ:**
```bash
🆓 GRATIS (Använd direkt):
your-site.vercel.app

💰 KÖPA DOMÄN (5-10 min extra):
- Namecheap.com (~$10/år)
- Google Domains (~$12/år)  
- Vercel Domains (enklast integration)

🎯 FÖRSLAG:
- aiaffiliates.com
- smartdeals.ai
- trendfinds.co
```

### **Deployment Optimization:**
```bash
# För snabbast möjlig deployment:
1. Använd CLI-metoden (vercel --prod)
2. Skippa custom domain först (använd .vercel.app)
3. Lägg till environment variables senare
4. Total tid: 10-15 minuter
```

---

## 🚀 **VILL DU BÖRJA NU?**

**Säg bara "ja" så guidar jag dig genom CLI-deployment i realtid!**

**Total tidsåtgång: 15-30 minuter beroende på metod**
- ⚡ **10-15 min**: CLI + .vercel.app domain
- 🌐 **20-30 min**: GitHub integration + custom domain

Mycket snabbare än traditionella webbhotell! 🚀
