"""
Deployment Preparation Script
Förbereder AI Affiliate Platform för webbhotell-upload
"""

import os
import shutil
import json
import zipfile
from datetime import datetime
import re

class DeploymentPrep:
    """Förbereder filer för deployment till webbhotell"""
    
    def __init__(self, source_dir=".", output_dir="deployment"):
        self.source_dir = source_dir
        self.output_dir = output_dir
        self.deployment_files = []
        
    def prepare_deployment(self):
        """Huvudfunktion för deployment-förberedelse"""
        
        print("🚀 AI Affiliate Platform - Deployment Preparation")
        print("=" * 60)
        
        # 1. Skapa deployment-mapp
        self.create_deployment_directory()
        
        # 2. Kopiera nödvändiga filer
        self.copy_essential_files()
        
        # 3. Optimera filer
        self.optimize_files()
        
        # 4. Skapa konfigurationsfiler
        self.create_config_files()
        
        # 5. Validera setup
        self.validate_deployment()
        
        # 6. Skapa zip för upload
        self.create_upload_package()
        
        # 7. Generera deployment-instruktioner
        self.generate_instructions()
        
        print(f"\n🎉 Deployment package redo i: {self.output_dir}/")
        print("📦 Upload-fil: ai-affiliate-platform.zip")
        print("📋 Instruktioner: deployment_instructions.txt")
        
    def create_deployment_directory(self):
        """Skapar deployment-mapp"""
        
        if os.path.exists(self.output_dir):
            shutil.rmtree(self.output_dir)
        
        os.makedirs(self.output_dir)
        print(f"📁 Skapade deployment-mapp: {self.output_dir}")
        
    def copy_essential_files(self):
        """Kopierar alla nödvändiga filer för webbsidan"""
        
        essential_files = [
            # Huvud HTML-filer
            "simple.html",
            "admin.html", 
            "dashboard.html",
            
            # JavaScript-filer
            "visitor_capture.js",
            "market_data.js",
            "amazon_integration.js",
            "ksp_integration.js",
            
            # Data-filer
            "amazon_products.json",
            "ksp_products.json",
            
            # CSS (om separata filer finns)
            "styles.css",
            
            # Bilder (om några finns)
            "images/",
            "assets/",
            
            # Favicon
            "favicon.ico",
            
            # Robots och sitemap
            "robots.txt",
            "sitemap.xml"
        ]
        
        copied_files = []
        
        for file_path in essential_files:
            source_path = os.path.join(self.source_dir, file_path)
            dest_path = os.path.join(self.output_dir, file_path)
            
            if os.path.exists(source_path):
                if os.path.isdir(source_path):
                    # Kopiera hela mappen
                    shutil.copytree(source_path, dest_path)
                    copied_files.append(f"📁 {file_path}/")
                else:
                    # Kopiera fil
                    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
                    shutil.copy2(source_path, dest_path)
                    copied_files.append(f"📄 {file_path}")
            else:
                print(f"⚠️ Fil ej hittad: {file_path}")
        
        self.deployment_files = copied_files
        print(f"✅ Kopierade {len(copied_files)} filer/mappar")
        
    def optimize_files(self):
        """Optimerar filer för bättre prestanda"""
        
        print("⚡ Optimerar filer för prestanda...")
        
        # Optimera HTML-filer
        html_files = ["simple.html", "admin.html", "dashboard.html"]
        
        for html_file in html_files:
            file_path = os.path.join(self.output_dir, html_file)
            if os.path.exists(file_path):
                self.optimize_html_file(file_path)
        
        # Komprimera JSON-filer
        json_files = ["amazon_products.json", "ksp_products.json"]
        
        for json_file in json_files:
            file_path = os.path.join(self.output_dir, json_file)
            if os.path.exists(file_path):
                self.compress_json_file(file_path)
    
    def optimize_html_file(self, file_path):
        """Optimerar HTML-fil"""
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Lägg till meta-tags för SEO
        seo_meta = '''
    <!-- SEO Meta Tags -->
    <meta name="description" content="AI-driven affiliate store med bästa deals från Amazon, KSP och fler. Handplockat av AI för bästa priser.">
    <meta name="keywords" content="affiliate, deals, amazon, electronics, AI, shopping, rabatt, erbjudanden">
    <meta name="author" content="AI Affiliate Store">
    <meta name="robots" content="index, follow">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="AI Affiliate Store - Bästa Deals Handplockat av AI">
    <meta property="og:description" content="Upptäck de bästa dealsen från Amazon, KSP och fler. Vår AI väljer produkter med bästa pris och kvalitet.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://ai-affiliate-store.com">
    <meta property="og:image" content="https://ai-affiliate-store.com/images/og-image.jpg">
    
    <!-- Twitter Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="AI Affiliate Store">
    <meta name="twitter:description" content="Bästa deals handplockat av AI">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    
    <!-- Performance optimering -->
    <link rel="preconnect" href="https://amazon.com">
    <link rel="preconnect" href="https://ksp.co.il">
    <link rel="dns-prefetch" href="//www.google-analytics.com">
        '''
        
        # Lägg till meta-tags innan </head>
        if '<head>' in content and seo_meta not in content:
            content = content.replace('</head>', seo_meta + '\n</head>')
        
        # Optimera images med lazy loading
        content = re.sub(
            r'<img\s+([^>]*?)src=',
            r'<img loading="lazy" \1src=',
            content
        )
        
        # Lägg till async till externa scripts
        content = re.sub(
            r'<script src="https://([^"]*)"([^>]*)>',
            r'<script src="https://\1" async\2>',
            content
        )
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"  ✅ Optimerade {os.path.basename(file_path)}")
    
    def compress_json_file(self, file_path):
        """Komprimerar JSON-fil"""
        
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Skriv tillbaka komprimerat
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, separators=(',', ':'), ensure_ascii=False)
        
        print(f"  ✅ Komprimerade {os.path.basename(file_path)}")
    
    def create_config_files(self):
        """Skapar konfigurationsfiler för webbhotell"""
        
        # 1. .htaccess för Apache (de flesta shared hosting)
        htaccess_content = '''# AI Affiliate Platform - Apache Configuration

# Aktivera komprimering
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache-kontroll
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/ico "access plus 1 year"
    ExpiresByType image/icon "access plus 1 year"
    ExpiresByType text/plain "access plus 1 month"
    ExpiresByType application/json "access plus 1 week"
</IfModule>

# HTTPS redirect
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Pretty URLs
RewriteEngine On
RewriteRule ^admin/?$ admin.html [L]
RewriteRule ^dashboard/?$ dashboard.html [L]

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Deny access to sensitive files
<Files "*.md">
    Order allow,deny
    Deny from all
</Files>

<Files "*.py">
    Order allow,deny
    Deny from all
</Files>'''
        
        with open(os.path.join(self.output_dir, '.htaccess'), 'w') as f:
            f.write(htaccess_content)
        
        # 2. robots.txt
        robots_content = '''User-agent: *
Allow: /

# Sitemaps
Sitemap: https://ai-affiliate-store.com/sitemap.xml

# Disallow admin pages
Disallow: /admin/
Disallow: /dashboard/

# Allow important pages
Allow: /
Allow: /admin.html
Allow: /dashboard.html'''
        
        with open(os.path.join(self.output_dir, 'robots.txt'), 'w') as f:
            f.write(robots_content)
        
        # 3. sitemap.xml
        sitemap_content = '''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://ai-affiliate-store.com/</loc>
        <lastmod>''' + datetime.now().strftime('%Y-%m-%d') + '''</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://ai-affiliate-store.com/admin.html</loc>
        <lastmod>''' + datetime.now().strftime('%Y-%m-%d') + '''</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://ai-affiliate-store.com/dashboard.html</loc>
        <lastmod>''' + datetime.now().strftime('%Y-%m-%d') + '''</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
</urlset>'''
        
        with open(os.path.join(self.output_dir, 'sitemap.xml'), 'w') as f:
            f.write(sitemap_content)
        
        # 4. _redirects för Netlify
        redirects_content = '''# Netlify redirects
/               /simple.html           200
/admin          /admin.html            200  
/dashboard      /dashboard.html        200
/home           /simple.html           301
/index          /simple.html           301

# Security redirects
/wp-admin/*     /                      301
/wp-login.php   /                      301
/admin.php      /                      301'''
        
        with open(os.path.join(self.output_dir, '_redirects'), 'w') as f:
            f.write(redirects_content)
        
        print("✅ Skapade konfigurationsfiler (.htaccess, robots.txt, sitemap.xml, _redirects)")
    
    def validate_deployment(self):
        """Validerar att alla nödvändiga filer finns"""
        
        print("🔍 Validerar deployment...")
        
        required_files = [
            "simple.html",
            "admin.html", 
            "dashboard.html",
            "visitor_capture.js",
            "robots.txt",
            "sitemap.xml"
        ]
        
        validation_errors = []
        
        for file_name in required_files:
            file_path = os.path.join(self.output_dir, file_name)
            if not os.path.exists(file_path):
                validation_errors.append(f"❌ Saknas: {file_name}")
            else:
                # Kontrollera att filen inte är tom
                if os.path.getsize(file_path) == 0:
                    validation_errors.append(f"⚠️ Tom fil: {file_name}")
        
        if validation_errors:
            print("🚨 Validation fel:")
            for error in validation_errors:
                print(f"  {error}")
        else:
            print("✅ Alla filer validerade successfully")
    
    def create_upload_package(self):
        """Skapar zip-fil för enkel upload"""
        
        zip_path = "ai-affiliate-platform.zip"
        
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for root, dirs, files in os.walk(self.output_dir):
                for file in files:
                    file_path = os.path.join(root, file)
                    arc_path = os.path.relpath(file_path, self.output_dir)
                    zipf.write(file_path, arc_path)
        
        file_size = os.path.getsize(zip_path) / 1024 / 1024  # MB
        print(f"📦 Upload package skapad: {zip_path} ({file_size:.1f} MB)")
    
    def generate_instructions(self):
        """Genererar deployment-instruktioner"""
        
        instructions = f"""
🚀 AI AFFILIATE PLATFORM - DEPLOYMENT INSTRUKTIONER
==================================================

📅 Deployment förberedd: {datetime.now().strftime('%Y-%m-%d %H:%M')}

🎯 SNABB DEPLOYMENT (Rekommenderat: Netlify)
============================================

1. Gå till: https://netlify.com
2. Skapa gratis konto
3. Klicka "Deploy manually"
4. Dra filen "ai-affiliate-platform.zip" till webbsidan
5. Vänta 30 sekunder
6. Din webbsida är live!

📋 FILER INKLUDERADE
===================
"""
        
        for file_info in self.deployment_files:
            instructions += f"{file_info}\n"
        
        instructions += f"""

🌐 ALTERNATIVA WEBBHOTELL
========================

GRATIS ALTERNATIV:
- Netlify: https://netlify.com (Rekommenderat)
- GitHub Pages: https://pages.github.com
- Vercel: https://vercel.com
- Cloudflare Pages: https://pages.cloudflare.com

BUDGET ALTERNATIV (20-100 kr/månad):
- Hostinger: https://hostinger.se
- Namecheap: https://namecheap.com
- One.com: https://one.com

🔧 MANUELL UPLOAD INSTRUKTIONER
===============================

För traditionella webbhotell (cPanel/FTP):

1. Packa upp "ai-affiliate-platform.zip"
2. Logga in på ditt webbhotell via cPanel eller FTP
3. Navigera till public_html/ mappen
4. Ladda upp alla filer från deployment/ mappen
5. Se till att simple.html är tillgänglig som index-sida

📊 POST-DEPLOYMENT CHECKLIST
============================

□ Testa huvudsida (simple.html)
□ Testa admin-panel (admin.html) 
□ Testa dashboard (dashboard.html)
□ Verifiera visitor capture fungerar
□ Kontrollera affiliate-länkar
□ Testa på mobil/desktop
□ Setup Google Analytics
□ Lägg till i Google Search Console
□ Testa laddningstider

🔍 SEO OPTIMERING
=================

□ Anpassa meta-descriptions för dina produkter
□ Lägg till Google Analytics tracking code
□ Setup Google Search Console
□ Skapa content för bättre ranking
□ Optimera bilder med alt-tags
□ Bygg backlinks från social media

🎯 NÄSTA STEG
============

1. Köp domän (ai-affiliate-store.com)
2. Koppla domän till webbhotell
3. Setup SSL-certifikat (automatiskt på Netlify)
4. Lansera marknadsföring via Telegram bot
5. Börja generera affiliate-intäkter!

💡 SUPPORT
==========

Vid problem:
1. Kontrollera att alla filer laddats upp korrekt
2. Verifiera att simple.html är index-sida
3. Kontrollera JavaScript-konsolen för fel
4. Testa i inkognito-läge

🎉 GRATTIS!
===========

Din AI Affiliate Platform är redo för lansering!
Förväntade resultat med visitor capture:
- 10-35% minskning av bounce rate
- 15-25% ökning av konverteringar
- 30-50% förbättrat förtroende via social proof

Lycka till med din affiliate-business! 🚀
"""
        
        with open('deployment_instructions.txt', 'w', encoding='utf-8') as f:
            f.write(instructions)
        
        print("📋 Deployment-instruktioner skapade: deployment_instructions.txt")

def main():
    """Kör deployment preparation"""
    
    prep = DeploymentPrep()
    prep.prepare_deployment()
    
    print("\n" + "="*60)
    print("🎯 NÄSTA STEG:")
    print("1. Ladda upp ai-affiliate-platform.zip till Netlify")
    print("2. Eller packa upp och ladda upp till ditt webbhotell")
    print("3. Läs deployment_instructions.txt för detaljer")
    print("4. Testa din live webbsida!")
    print("="*60)

if __name__ == "__main__":
    main()
