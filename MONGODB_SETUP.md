# MongoDB Atlas Setup Guide

## 1. Skapa MongoDB Atlas Account
1. Gå till https://www.mongodb.com/atlas
2. Skapa gratis konto (M0 Sandbox - gratis för alltid)
3. Skapa ett nytt cluster
4. Välj region (Stockholm/Frankfurt för bästa prestanda)

## 2. Database Användare & Säkerhet
1. Skapa database user: `Database Access` -> `Add New Database User`
   - Username: `ai-affiliate-user`
   - Password: [generera säkert lösenord]
   - Roles: `readWrite` för `ai-affiliate-db`

2. Whitelist IP: `Network Access` -> `Add IP Address`
   - För utveckling: `0.0.0.0/0` (alla IPs)
   - För produktion: Lägg till Vercel's IP ranges

## 3. Connection String
Hämta connection string från `Clusters` -> `Connect` -> `Connect your application`
Format: `mongodb+srv://ai-affiliate-user:<password>@cluster0.xxxxx.mongodb.net/ai-affiliate-db`

## 4. Lägg till i Vercel Environment Variables
1. Gå till Vercel Dashboard -> Project -> Settings -> Environment Variables
2. Lägg till:
   - `MONGODB_URI`: din connection string
   - `MONGODB_DB`: `ai-affiliate-db`

## 5. Lägg till i lokal .env.local
```
MONGODB_URI=mongodb+srv://ai-affiliate-user:<password>@cluster0.xxxxx.mongodb.net/ai-affiliate-db
MONGODB_DB=ai-affiliate-db
```

## Database Collections som skapas:
- `clicks` - Click tracking data
- `products` - Produktinformation
- `analytics` - Aggregerad analytics data
- `users` - Användardata (framtida)
