# AI Affiliate Store 🛍️

En smart AI-styrd affiliate-webbsida med Amazon och AliExpress integration, klickspårning och SEO-optimering.

## 🌟 Funktioner

### ✨ AI-Driven Features
- **Smart Produktrekommendationer**: AI analyserar användarbeteende och ger personliga förslag
- **Automatisk Innehållsgenerering**: SEO-optimerat innehåll skapas automatiskt
- **Intelligent Prisjämförelse**: AI jämför priser mellan Amazon och AliExpress
- **Trendanalys**: Upptäcker populära produkter i realtid

### 📊 Dashboard & Analytics
- **Klickspårning**: Fullständig spårning av alla affiliate-klick
- **Konverteringsanalys**: Detaljerad rapport om försäljning och provisioner
- **Realtidsdata**: Live-statistik över klick, intäkter och trender
- **Plattformsjämförelse**: Jämför prestanda mellan Amazon och AliExpress

### 🔧 Admin Panel
- **Länkhantering**: Enkelt lägg till, redigera och ta bort affiliate-länkar
- **Produktkatalog**: Hantera produktbilder, beskrivningar och priser
- **Kategorisering**: Organisera produkter i kategorier
- **Status-övervakning**: Övervaka aktiva/inaktiva länkar

### 🚀 SEO & Performance
- **Advanced SEO**: Meta-tags, Schema markup, Open Graph
- **Responsiv Design**: Optimerad för alla enheter
- **Snabb Laddning**: Optimerad prestanda med Next.js
- **Sökmotor-vänlig**: SEO-optimerade URL:er och innehåll

## 🛠️ Teknisk Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB
- **AI**: OpenAI GPT-4
- **Charts**: Recharts
- **Icons**: Lucide React

## 📦 Installation

1. **Klona projektet**
   \`\`\`bash
   git clone <din-repo-url>
   cd ai-affiliate-site
   \`\`\`

2. **Installera dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Konfigurera miljövariabler**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Fyll i dina API-nycklar i \`.env.local\`:
   - MongoDB URI
   - OpenAI API Key
   - Amazon Affiliate Keys
   - AliExpress API Keys

4. **Starta utvecklingsservern**
   \`\`\`bash
   npm run dev
   \`\`\`

## 🔑 API Keys Setup

### MongoDB
Skapa en gratis MongoDB Atlas databas på [mongodb.com](https://www.mongodb.com/cloud/atlas)

### OpenAI
Få din API-nyckel från [platform.openai.com](https://platform.openai.com/api-keys)

### Amazon Associates
Registrera dig för Amazon Associates programmet och få dina API-nycklar

### AliExpress
Gå med i AliExpress Affiliate programmet för API-access

## 📈 Användning

### Dashboard
Gå till \`/dashboard\` för att se:
- Klickstatistik
- Intäktsrapporter
- Toppresterade produkter
- Plattformsjämförelse

### Admin Panel
Besök \`/admin\` för att:
- Lägga till nya affiliate-länkar
- Hantera produktkatalog
- Övervaka prestanda
- Konfigurera inställningar

### AI Rekommendationer
API endpoint \`/api/ai/recommendations\` ger:
- Personliga produktförslag
- Trendande produkter
- Kategoriserade rekommendationer

## 🎯 API Endpoints

### Klickspårning
- \`POST /api/clicks\` - Spåra affiliate-klick
- \`GET /api/clicks/recent\` - Hämta senaste klick
- \`GET /api/analytics\` - Hämta analysdata

### Admin
- \`GET /api/admin/links\` - Hämta alla länkar
- \`POST /api/admin/links\` - Skapa ny länk
- \`PUT /api/admin/links/[id]\` - Uppdatera länk
- \`DELETE /api/admin/links/[id]\` - Ta bort länk

### AI
- \`POST /api/ai/recommendations\` - Få AI-rekommendationer
- \`GET /api/ai/recommendations\` - Trendande produkter

## 🎨 Komponenter

### AffiliateButton
Smart knapp som spårar klick och öppnar affiliate-länkar

### ProductCard  
Visar produktinformation med bild, pris och affiliate-länk

### SEO
Automatisk SEO-optimering med meta-tags och schema markup

### Dashboard Charts
Interaktiva grafer för analytics med Recharts

## 📱 Responsive Design

Webbsidan är fullt responsiv och fungerar perfekt på:
- 📱 Mobiler
- 💻 Tablets  
- 🖥️ Desktop
- 📺 Stora skärmar

## 🔐 Säkerhet

- JWT-baserad autentisering
- Säker hantering av API-nycklar
- CORS-skydd
- Rate limiting på API:er

## 📊 Monetiering

- **Amazon Associates**: 1-10% kommission
- **AliExpress**: 3-50% kommission
- **Display Ads**: Extra intäktskälla
- **Premium Features**: Prenumerationsmodell

## 🚀 Deployment

### Vercel (Rekommenderas)
1. Koppla till GitHub repo
2. Konfigurera miljövariabler
3. Deploy automatiskt

### Andra alternativ
- Netlify
- AWS
- DigitalOcean
- Railway

## 📈 Skalning

Projektet är byggt för att hantera:
- Tusentals produkter
- Miljontals klick per månad
- Hundratusentals användare
- Real-time analytics

## 🤝 Bidrag

1. Fork projektet
2. Skapa feature branch
3. Commit dina ändringar  
4. Push till branch
5. Öppna Pull Request

## 📄 Licens

MIT License - se [LICENSE](LICENSE) fil för detaljer

## 📞 Support

- 📧 Email: support@aiaffiliatestore.com
- 💬 Discord: [Gå med i vår server](https://discord.gg/affiliate)
- 📖 Docs: [docs.aiaffiliatestore.com](https://docs.aiaffiliatestore.com)

## 🏆 Features Roadmap

- [ ] Multi-språkstöd
- [ ] Cryptocurrency betalningar
- [ ] Voice search med AI
- [ ] AR produktvisning
- [ ] Social media integration
- [ ] Influencer partnerships
- [ ] Advanced A/B testing
- [ ] Machine learning optimering

---

**Gjord med ❤️ för affiliate marketers som vill använda AI:s kraft**
