# 🚀 Migration till Netlify - Steg-för-Steg Guide

## 📋 **FÖRBEREDELSER (5 minuter)**

### **1. Kontrollera att allt fungerar lokalt:**
```bash
# Testa att dev-servern startar:
npm run dev

# Kontrollera att build fungerar:
npm run build
npm start
```

### **2. Skapa Netlify-konto:**
- Gå till https://netlify.com
- Registrera med GitHub (rekommenderat)
- Bekräfta email

---

## 🔧 **MIGRATION PROCESS**

### **Steg 1: Repository Setup (2 minuter)**
```bash
# Om du inte redan har GitHub repo:
git init
git add .
git commit -m "Initial commit - AI Affiliate Platform"

# Skapa repo på GitHub och push:
git remote add origin [YOUR-GITHUB-URL]
git push -u origin main
```

### **Steg 2: Netlify Deployment (3 minuter)**
```bash
# På Netlify Dashboard:
1. "New site from Git"
2. Välj GitHub provider
3. Välj ditt repository
4. Build settings:
   - Build command: npm run build
   - Publish directory: .next (för Next.js)
   - Node version: 18.x
```

### **Steg 3: Environment Variables (5 minuter)**
```bash
# I Netlify Dashboard > Site Settings > Environment Variables:
AMAZON_ASSOCIATE_TAG=lemonec-20
MONGODB_URI=mongodb+srv://... (kommer senare)
NEXT_PUBLIC_API_BASE_URL=https://your-site.netlify.app
```

### **Steg 4: Custom Domain (10 minuter)**
```bash
# Rekommenderade domäner (snabbt tillgängliga):
1. smartlemon.ai ($12/år)
2. lemo.store ($8/år)  
3. lemonsavings.com ($12/år)

# I Netlify:
Domain Settings > Add custom domain > Configure DNS
```

---

## ⚙️ **NETLIFY-SPECIFIK KONFIGURATION**

### **netlify.toml (lägg till i root):**
```toml
[build]
  command = "npm run build"
  functions = "netlify/functions"
  publish = ".next"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

### **next.config.js uppdatering:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // För Netlify serverless functions:
  experimental: {
    outputFileTracingRoot: process.cwd(),
  }
}

module.exports = nextConfig
```

---

## 🔧 **MIGRATION CHECKLIST**

### **Pre-Migration:**
- [ ] Lokal build fungerar (`npm run build`)
- [ ] Alla miljövariabler dokumenterade
- [ ] GitHub repository skapat
- [ ] Backup av lokala filer

### **During Migration:**
- [ ] Netlify-konto skapat
- [ ] Repository kopplat
- [ ] Build settings konfigurerade
- [ ] Environment variables satta
- [ ] Första deployment lyckad

### **Post-Migration:**
- [ ] Alla sidor laddas korrekt
- [ ] API endpoints fungerar
- [ ] Admin panel tillgänglig
- [ ] Produktsökning fungerar
- [ ] Affiliate links fungerar

---

## 🚨 **VANLIGA PROBLEM & LÖSNINGAR**

### **Problem 1: Build Errors**
```bash
# Lösning: Kontrollera package.json scripts
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "export": "next export"
}
```

### **Problem 2: API Routes på Netlify**
```bash
# Lösning: Använd Netlify Functions istället
# Flytta /api routes till /netlify/functions/
```

### **Problem 3: Environment Variables**
```bash
# Lösning: Sätt alla i Netlify Dashboard
# Kom ihåg NEXT_PUBLIC_ prefix för client-side vars
```

---

## 🎯 **POST-MIGRATION PRIORITERINGAR**

### **Omedelbart (första timmen):**
1. **Testa alla funktioner** på live site
2. **Konfigurera Google Analytics** 
3. **Setup Google Search Console**
4. **Första SEO-optimering**

### **Samma dag:**
1. **Ansök Amazon Associates** (med live URL)
2. **Ansök AliExpress Affiliate** (med live URL)
3. **Social media setup** (Twitter, LinkedIn)
4. **Första content creation**

### **Första veckan:**
1. **Google Trends integration** (nu med riktig data)
2. **MongoDB Atlas** för produktionsdatabas
3. **Analytics implementation**
4. **Performance optimization**

---

## 💰 **ESTIMATED COSTS**

### **Månadsvis:**
- **Netlify**: $0 (gratis tier räcker för start)
- **Domän**: $1-2/månad
- **MongoDB Atlas**: $0 (gratis tier)
- **Total**: $1-2/månad (extremt billigt!)

### **Årligen:**
- **Domän**: $8-15/år
- **Eventuell Netlify Pro**: $19/månad (vid skalning)

---

## 🚀 **NÄSTA STEG EFTER MIGRATION**

1. **Live Testing** (30 min)
2. **Affiliate Applications** (1 timme) 
3. **Google Trends Activation** (30 min)
4. **Content Creation** (1-2 timmar)
5. **Social Media Announcement** (30 min)

---

**Vill du att jag hjälper dig börja migrationen nu? Vi kan ta det steg för steg!**
