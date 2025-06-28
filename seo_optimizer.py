"""
SEO & Traffic Optimering - Google Search Console Integration
Automatisk sitemap generation och meta-tags optimering
"""

import json
import os
from datetime import datetime
from pathlib import Path
from typing import Dict, List
import xml.etree.ElementTree as ET


class SEOManager:
    def __init__(self):
        self.base_url = "https://ai-affiliate-site.vercel.app"
        self.site_name = "AI Affiliate Platform"
        self.site_description = "AI-driven affiliate platform med trending produkter från Amazon och AliExpress"

    def generate_sitemap(self) -> str:
        """Generera XML sitemap för Google Search Console"""

        # Root element
        urlset = ET.Element("urlset")
        urlset.set("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9")
        urlset.set("xmlns:image",
                   "http://www.google.com/schemas/sitemap-image/1.1")

        # Static pages
        static_pages = [
            {"url": "", "priority": "1.0", "changefreq": "daily"},
            {"url": "/products", "priority": "0.9", "changefreq": "daily"},
            {"url": "/products/advanced", "priority": "0.9", "changefreq": "daily"},
            {"url": "/dashboard", "priority": "0.8", "changefreq": "weekly"},
            {"url": "/about", "priority": "0.6", "changefreq": "monthly"},
            {"url": "/privacy", "priority": "0.5", "changefreq": "yearly"},
            {"url": "/terms", "priority": "0.5", "changefreq": "yearly"},
            {"url": "/contact", "priority": "0.6", "changefreq": "monthly"}
        ]

        # Add static pages
        for page in static_pages:
            url_elem = ET.SubElement(urlset, "url")
            ET.SubElement(
                url_elem, "loc").text = f"{self.base_url}{page['url']}"
            ET.SubElement(url_elem, "lastmod").text = datetime.now().strftime(
                "%Y-%m-%d")
            ET.SubElement(url_elem, "changefreq").text = page["changefreq"]
            ET.SubElement(url_elem, "priority").text = page["priority"]

        # Add trending content pages
        content_dir = Path("content")
        if content_dir.exists():
            for md_file in content_dir.glob("*.md"):
                if md_file.name != "README.md":
                    slug = md_file.stem
                    url_elem = ET.SubElement(urlset, "url")
                    ET.SubElement(
                        url_elem, "loc").text = f"{self.base_url}/trending/{slug}"
                    ET.SubElement(url_elem, "lastmod").text = datetime.fromtimestamp(
                        md_file.stat().st_mtime).strftime("%Y-%m-%d")
                    ET.SubElement(url_elem, "changefreq").text = "weekly"
                    ET.SubElement(url_elem, "priority").text = "0.8"

        # Add dynamic product pages (from affiliate_suggestions.json)
        try:
            with open("affiliate_suggestions.json", "r", encoding="utf-8") as f:
                data = json.load(f)
                products = data.get("suggestions", [])

                for product in products[:100]:  # Limit to 100 most recent
                    product_id = product.get("id", "")
                    if product_id:
                        url_elem = ET.SubElement(urlset, "url")
                        ET.SubElement(
                            url_elem, "loc").text = f"{self.base_url}/product/{product_id}"
                        ET.SubElement(url_elem, "lastmod").text = datetime.now().strftime(
                            "%Y-%m-%d")
                        ET.SubElement(url_elem, "changefreq").text = "daily"
                        ET.SubElement(url_elem, "priority").text = "0.7"

                        # Add image if available
                        if product.get("image_url"):
                            image_elem = ET.SubElement(url_elem, "image:image")
                            ET.SubElement(
                                image_elem, "image:loc").text = product["image_url"]
                            ET.SubElement(image_elem, "image:title").text = product.get(
                                "title", "")

        except FileNotFoundError:
            print("⚠️ affiliate_suggestions.json inte hittad")

        # Generate XML string
        xml_str = ET.tostring(urlset, encoding="unicode", method="xml")

        # Add XML declaration
        sitemap_xml = '<?xml version="1.0" encoding="UTF-8"?>\n' + xml_str

        return sitemap_xml

    def save_sitemap(self, xml_content: str, filename: str = "sitemap.xml"):
        """Spara sitemap till fil"""
        with open(filename, "w", encoding="utf-8") as f:
            f.write(xml_content)

        print(f"✅ Sitemap sparad till {filename}")
        return filename

    def generate_robots_txt(self) -> str:
        """Generera robots.txt för sökmotorer"""
        robots_content = f"""User-agent: *
Allow: /

# Sitemaps
Sitemap: {self.base_url}/sitemap.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /dashboard/

# Allow all affiliate links
Allow: /product/
Allow: /products/
Allow: /trending/

# Crawl-delay for respectful crawling
Crawl-delay: 1
"""
        return robots_content

    def save_robots_txt(self, content: str, filename: str = "robots.txt"):
        """Spara robots.txt"""
        with open(filename, "w", encoding="utf-8") as f:
            f.write(content)

        print(f"✅ robots.txt sparad till {filename}")
        return filename

    def generate_meta_tags(self, page_type: str = "home", product_data: Dict = None, content_data: Dict = None) -> Dict:
        """Generera optimerade meta-tags för olika sidtyper"""

        base_meta = {
            "charset": "utf-8",
            "viewport": "width=device-width, initial-scale=1",
            "robots": "index, follow",
            "author": "AI Affiliate Platform",
            "language": "sv-SE"
        }

        if page_type == "home":
            meta = {
                **base_meta,
                "title": f"{self.site_name} - AI-drivna Affiliate Deals",
                "description": "Hitta de bästa affiliate-dealsens med AI. Trending produkter från Amazon, AliExpress och KSP. Smart produktsökning och realtidsrabatter.",
                "keywords": "affiliate, deals, rabatter, amazon, aliexpress, AI, produkter, trending, smart shopping",
                "og:title": f"{self.site_name} - AI-drivna Affiliate Deals",
                "og:description": "Hitta de bästa affiliate-dealsens med AI. Trending produkter från Amazon, AliExpress och KSP.",
                "og:type": "website",
                "og:url": self.base_url,
                "og:site_name": self.site_name,
                "twitter:card": "summary_large_image",
                "twitter:title": f"{self.site_name} - AI-drivna Affiliate Deals",
                "twitter:description": "Hitta de bästa affiliate-dealsens med AI"
            }

        elif page_type == "product" and product_data:
            title = f"{product_data.get('title', 'Produkt')} - {product_data.get('discount', 0)}% Rabatt"
            description = f"Köp {product_data.get('title', 'denna produkt')} med {product_data.get('discount', 0)}% rabatt på {product_data.get('platform', '').title()}. {product_data.get('rating', 0)} stjärnor, {product_data.get('price', 'Bra pris')}."

            meta = {
                **base_meta,
                "title": title,
                "description": description,
                "keywords": f"{product_data.get('category', '')}, {product_data.get('platform', '')}, affiliate, rabatt, {product_data.get('title', '')}",
                "og:title": title,
                "og:description": description,
                "og:type": "product",
                "og:url": f"{self.base_url}/product/{product_data.get('id', '')}",
                "og:site_name": self.site_name,
                "product:price:amount": product_data.get('price', '').replace(' kr', ''),
                "product:price:currency": "SEK",
                "twitter:card": "product",
                "twitter:title": title,
                "twitter:description": description
            }

            if product_data.get('image_url'):
                meta["og:image"] = product_data['image_url']
                meta["twitter:image"] = product_data['image_url']

        elif page_type == "trending" and content_data:
            title = f"{content_data.get('title', 'Trending Content')} - {self.site_name}"
            description = content_data.get(
                'description', f"Upptäck trending {content_data.get('category', 'produkter')} med bästa rabatterna och AI-rekommendationer.")

            meta = {
                **base_meta,
                "title": title,
                "description": description,
                "keywords": f"trending, {content_data.get('category', '')}, 2025, affiliate, rabatter, AI",
                "og:title": title,
                "og:description": description,
                "og:type": "article",
                "og:url": f"{self.base_url}/trending/{content_data.get('slug', '')}",
                "og:site_name": self.site_name,
                "twitter:card": "summary_large_image",
                "twitter:title": title,
                "twitter:description": description
            }

        else:
            meta = {
                **base_meta,
                "title": f"{page_type.title()} - {self.site_name}",
                "description": self.site_description,
                "keywords": "affiliate, deals, AI, produkter",
                "og:title": f"{page_type.title()} - {self.site_name}",
                "og:description": self.site_description,
                "og:type": "website",
                "og:url": f"{self.base_url}/{page_type}",
                "og:site_name": self.site_name
            }

        return meta

    def generate_structured_data(self, data_type: str = "website", data: Dict = None) -> Dict:
        """Generera JSON-LD structured data för Google"""

        if data_type == "website":
            return {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": self.site_name,
                "description": self.site_description,
                "url": self.base_url,
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": f"{self.base_url}/products/advanced?search={{search_term_string}}",
                    "query-input": "required name=search_term_string"
                },
                "author": {
                    "@type": "Organization",
                    "name": "AI Affiliate Platform"
                }
            }

        elif data_type == "product" and data:
            return {
                "@context": "https://schema.org",
                "@type": "Product",
                "name": data.get('title', ''),
                "description": data.get('description', ''),
                "image": data.get('image_url', ''),
                "sku": data.get('id', ''),
                "brand": {
                    "@type": "Brand",
                    "name": data.get('platform', '').title()
                },
                "offers": {
                    "@type": "Offer",
                    "price": data.get('price', '').replace(' kr', ''),
                    "priceCurrency": "SEK",
                    "availability": "https://schema.org/InStock" if data.get('availability', True) else "https://schema.org/OutOfStock",
                    "url": data.get('affiliate_url', ''),
                    "seller": {
                        "@type": "Organization",
                        "name": data.get('platform', '').title()
                    }
                },
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": data.get('rating', 0),
                    "ratingCount": data.get('reviews_count', 0),
                    "bestRating": 5,
                    "worstRating": 1
                } if data.get('rating') else None
            }

        elif data_type == "organization":
            return {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": self.site_name,
                "description": self.site_description,
                "url": self.base_url,
                "logo": f"{self.base_url}/logo.png",
                "sameAs": [],
                "contactPoint": {
                    "@type": "ContactPoint",
                    "contactType": "customer service",
                    "email": "info@ai-affiliate-platform.com"
                }
            }

        return {}

    def create_seo_package(self):
        """Skapa komplett SEO-paket för deployment"""
        print("🚀 Genererar komplett SEO-paket...")

        # Generate sitemap
        sitemap_xml = self.generate_sitemap()
        sitemap_file = self.save_sitemap(sitemap_xml)

        # Generate robots.txt
        robots_content = self.generate_robots_txt()
        robots_file = self.save_robots_txt(robots_content)

        # Copy to deployment folder
        deployment_dir = Path("deployment")
        deployment_dir.mkdir(exist_ok=True)

        # Copy sitemap and robots to deployment
        with open(deployment_dir / "sitemap.xml", "w", encoding="utf-8") as f:
            f.write(sitemap_xml)

        with open(deployment_dir / "robots.txt", "w", encoding="utf-8") as f:
            f.write(robots_content)

        # Generate meta tags examples
        meta_examples = {
            "home": self.generate_meta_tags("home"),
            "product": self.generate_meta_tags("product", {
                "id": "example_product",
                "title": "Premium Bluetooth Hörlurar",
                "platform": "amazon",
                "category": "elektronik",
                "price": "299 kr",
                "discount": 35,
                "rating": 4.6,
                "image_url": "https://example.com/image.jpg"
            }),
            "trending": self.generate_meta_tags("trending", None, {
                "title": "Gaming Setup 2025",
                "category": "gaming",
                "slug": "gaming-setup-2025",
                "description": "Bästa gaming-produkterna för 2025 med AI-rekommendationer"
            })
        }

        # Save meta examples
        with open("seo_meta_examples.json", "w", encoding="utf-8") as f:
            json.dump(meta_examples, f, indent=2, ensure_ascii=False)

        # Generate structured data examples
        structured_examples = {
            "website": self.generate_structured_data("website"),
            "organization": self.generate_structured_data("organization"),
            "product": self.generate_structured_data("product", {
                "id": "example_product",
                "title": "Premium Bluetooth Hörlurar",
                "platform": "amazon",
                "price": "299 kr",
                "rating": 4.6,
                "reviews_count": 150
            })
        }

        with open("seo_structured_data.json", "w", encoding="utf-8") as f:
            json.dump(structured_examples, f, indent=2, ensure_ascii=False)

        print("✅ SEO-paket genererat!")
        print(f"📁 Filer skapade:")
        print(f"  - {sitemap_file}")
        print(f"  - {robots_file}")
        print(f"  - deployment/sitemap.xml")
        print(f"  - deployment/robots.txt")
        print(f"  - seo_meta_examples.json")
        print(f"  - seo_structured_data.json")

        return {
            "sitemap": sitemap_file,
            "robots": robots_file,
            "meta_examples": meta_examples,
            "structured_data": structured_examples
        }


if __name__ == "__main__":
    seo = SEOManager()
    result = seo.create_seo_package()

    print("\n🎯 SEO & Traffic optimering klar!")
    print("Nästa steg:")
    print("1. Ladda upp sitemap.xml och robots.txt till Vercel")
    print("2. Lägg till i Google Search Console")
    print("3. Implementera meta-tags i Next.js komponenter")
    print("4. Lägg till structured data på produktsidor")
