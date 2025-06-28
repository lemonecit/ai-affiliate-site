"""
SEO & Trend Analysis System för AI Affiliate Store
Analyserar Google Trends, SEO-data och bestsellers för optimal produktval
"""

import asyncio
import aiohttp
import json
import time
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import logging
from dataclasses import dataclass
import re

# Konfigurera logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)


@dataclass
class TrendData:
    """Klass för trend-data"""
    keyword: str
    trend_score: float
    search_volume: int
    competition: str  # low, medium, high
    cpc: float  # cost per click
    seasonal_trend: List[float]
    rising_queries: List[str]


@dataclass
class SEOMetrics:
    """SEO-metrics för produkter"""
    keyword: str
    search_volume: int
    keyword_difficulty: float
    serp_features: List[str]
    related_keywords: List[str]
    content_gap_score: float


@dataclass
class ProductOpportunity:
    """Produktmöjlighet baserat på analys"""
    product_name: str
    category: str
    opportunity_score: float
    trend_score: float
    seo_score: float
    search_volume: int
    ranking_position: int
    click_through_rate: float
    conversion_potential: float


@dataclass
class BestsellerProduct:
    """Bästsäljande produkt med SEO-data"""
    name: str
    category: str
    platform: str
    price: float
    original_price: float
    rating: float
    reviews_count: int
    image_url: str
    affiliate_link: str
    seo_score: float
    trend_score: float
    search_volume: int
    google_ranking: int
    bestseller_rank: int
    weekly_growth: float
    seo_score: float
    competition_level: str
    estimated_monthly_searches: int
    recommended_platform: str  # amazon, aliexpress
    estimated_commission: float
    seasonal_factor: float
    keywords: List[str]
    reasons: List[str]


class TrendAnalyzer:
    """Analyserar trender och SEO-data"""

    def __init__(self):
        self.trend_data = {}
        self.seo_cache = {}

    async def analyze_google_trends(self, keywords: List[str]) -> Dict[str, TrendData]:
        """Analyserar Google Trends för keywords"""
        try:
            # Simulerar Google Trends API (i verkligheten använd pytrends eller Google Trends API)
            trend_results = {}

            for keyword in keywords:
                # Simulerad trend-data
                trend_score = self._calculate_trend_score(keyword)
                search_volume = self._estimate_search_volume(keyword)

                trend_data = TrendData(
                    keyword=keyword,
                    trend_score=trend_score,
                    search_volume=search_volume,
                    competition=self._get_competition_level(keyword),
                    cpc=self._estimate_cpc(keyword),
                    seasonal_trend=self._generate_seasonal_data(),
                    rising_queries=self._get_rising_queries(keyword)
                )

                trend_results[keyword] = trend_data
                logger.info(
                    f"✅ Trend-analys klar för '{keyword}': Score {trend_score}")

            return trend_results

        except Exception as e:
            logger.error(f"❌ Fel vid trend-analys: {e}")
            return {}

    def _calculate_trend_score(self, keyword: str) -> float:
        """Beräknar trend-score baserat på olika faktorer"""
        # Simulerad beräkning baserat på keyword
        base_scores = {
            "trådlösa hörlurar": 8.5,
            "gaming mus": 7.2,
            "fitness tracker": 8.8,
            "smart hem": 9.1,
            "bluetooth högtalare": 7.8,
            "laptop ställ": 6.9,
            "webcam": 8.0,
            "tangentbord": 7.5,
            "powerbank": 8.3,
            "smartwatch": 8.9,
            "luftrenare": 9.2,
            "robot dammsugare": 8.7,
            "led lampor": 7.1,
            "usb hub": 6.8,
            "gaming headset": 8.1,
            "phone case": 6.5,
            "car accessories": 7.4,
            "kitchen gadgets": 8.6
        }

        # Hitta närmaste match eller använd genomsnitt
        for key, score in base_scores.items():
            if key.lower() in keyword.lower() or keyword.lower() in key.lower():
                # Lägg till lite variation
                return score + (time.time() % 10) / 10

        return 7.0 + (hash(keyword) % 30) / 10  # Fallback score 7.0-9.9

    def _estimate_search_volume(self, keyword: str) -> int:
        """Estimerar månadsvis sökvolym"""
        base_volumes = {
            "trådlösa hörlurar": 45000,
            "gaming mus": 28000,
            "fitness tracker": 38000,
            "smart hem": 62000,
            "bluetooth högtalare": 25000,
            "laptop ställ": 15000,
            "webcam": 41000,
            "tangentbord": 33000,
            "powerbank": 29000,
            "smartwatch": 51000,
            "luftrenare": 35000,
            "robot dammsugare": 22000
        }

        for key, volume in base_volumes.items():
            if key.lower() in keyword.lower():
                return volume + (hash(keyword) % 10000)

        return 20000 + (hash(keyword) % 30000)

    def _get_competition_level(self, keyword: str) -> str:
        """Bedömer konkurrensnivå"""
        high_competition = ["iphone", "samsung", "apple", "sony", "nike"]
        medium_competition = ["gaming", "bluetooth", "wireless", "smart"]

        keyword_lower = keyword.lower()

        if any(comp in keyword_lower for comp in high_competition):
            return "high"
        elif any(comp in keyword_lower for comp in medium_competition):
            return "medium"
        else:
            return "low"

    def _estimate_cpc(self, keyword: str) -> float:
        """Estimerar cost per click"""
        cpc_ranges = {
            "high": (2.50, 8.00),
            "medium": (1.20, 3.50),
            "low": (0.50, 1.80)
        }

        competition = self._get_competition_level(keyword)
        min_cpc, max_cpc = cpc_ranges[competition]

        return min_cpc + ((hash(keyword) % 100) / 100) * (max_cpc - min_cpc)

    def _generate_seasonal_data(self) -> List[float]:
        """Genererar säsongsdata (12 månader)"""
        import math
        # Simulerar säsongsvariation
        return [50 + 30 * math.sin(i * math.pi / 6) + (hash(str(i)) % 20) for i in range(12)]

    def _get_rising_queries(self, keyword: str) -> List[str]:
        """Hittar relaterade stigande söktermer"""
        rising_patterns = {
            "trådlösa hörlurar": ["noise cancelling", "true wireless", "gaming headset"],
            "gaming mus": ["rgb gaming mus", "trådlös gaming", "pro gaming"],
            "fitness tracker": ["smartwatch", "pulsmätare", "stegräknare"],
            "smart hem": ["alexa", "google home", "smart lampor"]
        }

        for key, patterns in rising_patterns.items():
            if key.lower() in keyword.lower():
                return patterns

        return ["billig " + keyword, keyword + " test", "bästa " + keyword]


class SEOAnalyzer:
    """Analyserar SEO-möjligheter"""

    async def analyze_keywords(self, keywords: List[str]) -> Dict[str, SEOMetrics]:
        """Analyserar SEO-metrics för keywords"""
        try:
            seo_results = {}

            for keyword in keywords:
                metrics = SEOMetrics(
                    keyword=keyword,
                    search_volume=self._get_search_volume(keyword),
                    keyword_difficulty=self._calculate_keyword_difficulty(
                        keyword),
                    serp_features=self._get_serp_features(keyword),
                    related_keywords=self._get_related_keywords(keyword),
                    content_gap_score=self._calculate_content_gap(keyword)
                )

                seo_results[keyword] = metrics
                logger.info(
                    f"🔍 SEO-analys klar för '{keyword}': Difficulty {metrics.keyword_difficulty}")

            return seo_results

        except Exception as e:
            logger.error(f"❌ Fel vid SEO-analys: {e}")
            return {}

    def _get_search_volume(self, keyword: str) -> int:
        """Hämtar sökvolym för keyword"""
        # Använder samma logik som trend analyzer
        return TrendAnalyzer()._estimate_search_volume(keyword)

    def _calculate_keyword_difficulty(self, keyword: str) -> float:
        """Beräknar keyword difficulty (0-100)"""
        # Simulerad beräkning
        competition = TrendAnalyzer()._get_competition_level(keyword)

        difficulty_ranges = {
            "high": (70, 95),
            "medium": (40, 75),
            "low": (15, 50)
        }

        min_diff, max_diff = difficulty_ranges[competition]
        return min_diff + ((hash(keyword) % 100) / 100) * (max_diff - min_diff)

    def _get_serp_features(self, keyword: str) -> List[str]:
        """Identifierar SERP-features"""
        common_features = ["Shopping Results", "People Also Ask", "Reviews"]
        product_features = ["Product Listings",
                            "Price Comparison", "Shopping Ads"]

        if any(word in keyword.lower() for word in ["köp", "pris", "bäst", "test"]):
            return common_features + product_features

        return common_features

    def _get_related_keywords(self, keyword: str) -> List[str]:
        """Hittar relaterade keywords"""
        modifiers = ["billig", "bäst", "test", "recension", "köp", "pris"]
        return [f"{modifier} {keyword}" for modifier in modifiers[:3]]

    def _calculate_content_gap(self, keyword: str) -> float:
        """Beräknar content gap score (0-10)"""
        # Simulerar content gap analys
        return 5.0 + ((hash(keyword) % 50) / 10)


class BestsellerAnalyzer:
    """Analyserar bestsellers från olika plattformar"""

    async def get_bestselling_categories(self) -> Dict[str, List[str]]:
        """Hämtar bestselling kategorier"""
        try:
            # Simulerad data från Amazon/AliExpress bestsellers
            bestsellers = {
                "Elektronik": [
                    "Trådlösa hörlurar", "Smartwatch", "Powerbank", "Bluetooth högtalare",
                    "USB-C hub", "Webcam", "Gaming mus", "Tangentbord"
                ],
                "Hem & Trädgård": [
                    "Luftrenare", "LED lampor", "Smart hem enheter", "Robot dammsugare",
                    "Kaffebryggare", "Luftfuktare", "Väckarklocka", "Skrivbordslampa"
                ],
                "Sport & Hälsa": [
                    "Fitness tracker", "Yoga matta", "Vattenflaska", "Träningsband",
                    "Foam roller", "Viktmanschetter", "Hopprep", "Massage pistol"
                ],
                "Gaming": [
                    "Gaming headset", "Mekaniskt tangentbord", "Gaming mus", "Musmatta",
                    "Gaming stol", "Monitor arm", "RGB belysning", "Controller"
                ],
                "Mode & Accessoarer": [
                    "Phone case", "Smartwatch band", "Solglasögon", "Ryggsäck",
                    "Plånbok", "Bälte", "Klocka", "Smycken"
                ]
            }

            logger.info(
                f"✅ Bestseller-data hämtad för {len(bestsellers)} kategorier")
            return bestsellers

        except Exception as e:
            logger.error(f"❌ Fel vid bestseller-analys: {e}")
            return {}

    async def generate_bestseller_products(self, limit: int = 10) -> List[BestsellerProduct]:
        """Genererar bästsäljare-produkter baserat på SEO och trend-data"""
        try:
            # Analysera trender för att hitta de bästa produkterna
            opportunities = await self.analyze_product_opportunities()

            if not opportunities:
                return []

            # Sortera efter opportunity_score
            top_opportunities = sorted(opportunities,
                                       key=lambda x: x.opportunity_score,
                                       reverse=True)[:limit]

            bestsellers = []

            # Sample produktdata baserat på trend-analys
            sample_products = [
                {
                    "name": "Trådlösa Gaming Hörlurar Pro",
                    "category": "Elektronik",
                    "platform": "amazon",
                    "price": 149.99,
                    "original_price": 199.99,
                    "rating": 4.8,
                    "reviews_count": 2847,
                    "image_url": "🎧",
                    "affiliate_link": "https://amazon.com/wireless-gaming-headphones"
                },
                {
                    "name": "Smart Fitness Tracker Watch",
                    "category": "Hälsa & Fitness",
                    "platform": "aliexpress",
                    "price": 59.99,
                    "original_price": 99.99,
                    "rating": 4.5,
                    "reviews_count": 1923,
                    "image_url": "⌚",
                    "affiliate_link": "https://aliexpress.com/smart-fitness-tracker"
                },
                {
                    "name": "Ultrasnabb SSD 1TB",
                    "category": "Datorutrustning",
                    "platform": "amazon",
                    "price": 89.99,
                    "original_price": 129.99,
                    "rating": 4.9,
                    "reviews_count": 5642,
                    "image_url": "💾",
                    "affiliate_link": "https://amazon.com/ultrafast-ssd-1tb"
                },
                {
                    "name": "AI-Driven Robot Dammsugare",
                    "category": "Smart Hem",
                    "platform": "amazon",
                    "price": 299.99,
                    "original_price": 449.99,
                    "rating": 4.7,
                    "reviews_count": 3456,
                    "image_url": "🤖",
                    "affiliate_link": "https://amazon.com/ai-robot-vacuum"
                },
                {
                    "name": "Bluetooth Portabel Högtalare",
                    "category": "Audio",
                    "platform": "aliexpress",
                    "price": 39.99,
                    "original_price": 69.99,
                    "rating": 4.4,
                    "reviews_count": 1567,
                    "image_url": "🔊",
                    "affiliate_link": "https://aliexpress.com/bluetooth-speaker"
                },
                {
                    "name": "4K Webcam för Streaming",
                    "category": "Kameror",
                    "platform": "amazon",
                    "price": 119.99,
                    "original_price": 159.99,
                    "rating": 4.6,
                    "reviews_count": 2134,
                    "image_url": "📹",
                    "affiliate_link": "https://amazon.com/4k-streaming-webcam"
                },
                {
                    "name": "Mekaniskt Gaming Tangentbord",
                    "category": "Gaming",
                    "platform": "amazon",
                    "price": 79.99,
                    "original_price": 119.99,
                    "rating": 4.8,
                    "reviews_count": 4231,
                    "image_url": "⌨️",
                    "affiliate_link": "https://amazon.com/mechanical-gaming-keyboard"
                },
                {
                    "name": "Snabbladdning Powerbank 20000mAh",
                    "category": "Mobiltillbehör",
                    "platform": "aliexpress",
                    "price": 24.99,
                    "original_price": 39.99,
                    "rating": 4.3,
                    "reviews_count": 1876,
                    "image_url": "🔋",
                    "affiliate_link": "https://aliexpress.com/fast-charging-powerbank"
                },
                {
                    "name": "Smart LED Ljusstrip 5m",
                    "category": "Smart Hem",
                    "platform": "amazon",
                    "price": 29.99,
                    "original_price": 49.99,
                    "rating": 4.5,
                    "reviews_count": 3876,
                    "image_url": "💡",
                    "affiliate_link": "https://amazon.com/smart-led-strip"
                },
                {
                    "name": "Ergonomisk Musplatta XL",
                    "category": "Kontorsmaterial",
                    "platform": "aliexpress",
                    "price": 19.99,
                    "original_price": 34.99,
                    "rating": 4.2,
                    "reviews_count": 987,
                    "image_url": "🖱️",
                    "affiliate_link": "https://aliexpress.com/ergonomic-mousepad"
                }
            ]

            # Koppla produkter med trend-data
            for i, product in enumerate(sample_products[:len(top_opportunities)]):
                opportunity = top_opportunities[i]

                # Beräkna SEO-specifik data baserat på trend-analys
                seo_score = min(10.0, opportunity.opportunity_score)
                trend_score = min(10.0, opportunity.trend_score)
                search_volume = self._estimate_search_volume(
                    opportunity.product_name)
                # Högre SEO = bättre ranking
                google_ranking = max(1, int(11 - seo_score))
                # Tillväxt baserat på trends
                weekly_growth = max(0, (trend_score - 5) * 10)

                bestseller = BestsellerProduct(
                    name=product["name"],
                    category=product["category"],
                    platform=product["platform"],
                    price=product["price"],
                    original_price=product["original_price"],
                    rating=product["rating"],
                    reviews_count=product["reviews_count"],
                    image_url=product["image_url"],
                    affiliate_link=product["affiliate_link"],
                    seo_score=seo_score,
                    trend_score=trend_score,
                    search_volume=search_volume,
                    google_ranking=google_ranking,
                    bestseller_rank=i + 1,
                    weekly_growth=weekly_growth
                )

                bestsellers.append(bestseller)

            logger.info(
                f"✅ Genererade {len(bestsellers)} bästsäljare-produkter")
            return bestsellers

        except Exception as e:
            logger.error(f"❌ Fel vid generering av bästsäljare: {e}")
            return []

    def save_bestsellers_data(self, bestsellers: List[BestsellerProduct], filename: str = "bestsellers_data.json"):
        """Sparar bästsäljare-data till JSON-fil"""
        try:
            data = {
                "generated_at": datetime.now().isoformat(),
                "bestsellers": []
            }

            for product in bestsellers:
                product_data = {
                    "name": product.name,
                    "category": product.category,
                    "platform": product.platform,
                    "price": product.price,
                    "original_price": product.original_price,
                    "rating": product.rating,
                    "reviews_count": product.reviews_count,
                    "image_url": product.image_url,
                    "affiliate_link": product.affiliate_link,
                    "seo_score": product.seo_score,
                    "trend_score": product.trend_score,
                    "search_volume": product.search_volume,
                    "google_ranking": product.google_ranking,
                    "bestseller_rank": product.bestseller_rank,
                    "weekly_growth": product.weekly_growth,
                    "discount_percentage": round(((product.original_price - product.price) / product.original_price) * 100)
                }
                data["bestsellers"].append(product_data)

            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)

            logger.info(f"💾 Bästsäljare-data sparad i {filename}")
            return filename

        except Exception as e:
            logger.error(f"❌ Fel vid sparande av bästsäljare-data: {e}")
            return None


class OpportunityScorer:
    """Beräknar och rankar produktmöjligheter"""

    def calculate_opportunity_score(self, trend_data: TrendData, seo_metrics: SEOMetrics,
                                    category: str, platform: str = "amazon") -> ProductOpportunity:
        """Beräknar total opportunity score"""

        # Viktning av olika faktorer
        weights = {
            "trend": 0.3,
            "search_volume": 0.25,
            "competition": 0.2,
            "seasonal": 0.1,
            "content_gap": 0.15
        }

        # Normalisera scores (0-10)
        trend_score = min(trend_data.trend_score, 10)
        volume_score = min(seo_metrics.search_volume / 5000,
                           10)  # Normalisera till 0-10
        competition_score = self._convert_competition_to_score(
            seo_metrics.keyword_difficulty)
        seasonal_score = self._calculate_seasonal_score(
            trend_data.seasonal_trend)
        content_gap_score = min(seo_metrics.content_gap_score, 10)

        # Beräkna total score
        total_score = (
            trend_score * weights["trend"] +
            volume_score * weights["search_volume"] +
            competition_score * weights["competition"] +
            seasonal_score * weights["seasonal"] +
            content_gap_score * weights["content_gap"]
        )

        # Estimera kommission
        estimated_commission = self._estimate_commission(
            trend_data.search_volume, platform, trend_data.cpc
        )

        # Skapa rekommendationer
        reasons = self._generate_recommendations(
            trend_score, volume_score, competition_score, trend_data.competition
        )

        return ProductOpportunity(
            product_name=trend_data.keyword.title(),
            category=category,
            opportunity_score=round(total_score, 2),
            trend_score=round(trend_score, 2),
            seo_score=round((volume_score + competition_score) / 2, 2),
            competition_level=trend_data.competition,
            estimated_monthly_searches=seo_metrics.search_volume,
            recommended_platform=self._recommend_platform(trend_data.keyword),
            estimated_commission=round(estimated_commission, 2),
            seasonal_factor=round(seasonal_score / 10, 2),
            keywords=seo_metrics.related_keywords + trend_data.rising_queries,
            reasons=reasons
        )

    def _convert_competition_to_score(self, difficulty: float) -> float:
        """Konverterar keyword difficulty till score (lägre difficulty = högre score)"""
        return max(0, 10 - (difficulty / 10))

    def _calculate_seasonal_score(self, seasonal_data: List[float]) -> float:
        """Beräknar säsongscore"""
        current_month = datetime.now().month - 1
        current_trend = seasonal_data[current_month]
        avg_trend = sum(seasonal_data) / len(seasonal_data)

        return min(10, (current_trend / avg_trend) * 5)

    def _estimate_commission(self, search_volume: int, platform: str, cpc: float) -> float:
        """Estimerar månadskommission"""
        # Conversion rates
        conversion_rates = {"amazon": 0.08, "aliexpress": 0.05}
        commission_rates = {"amazon": 0.06, "aliexpress": 0.03}

        estimated_clicks = search_volume * 0.1  # 10% CTR från SEO
        estimated_sales = estimated_clicks * conversion_rates[platform]
        avg_order_value = cpc * 15  # Estimerad ordervolym baserat på CPC

        return estimated_sales * avg_order_value * commission_rates[platform]

    def _recommend_platform(self, keyword: str) -> str:
        """Rekommenderar bästa plattform"""
        amazon_keywords = ["premium", "quality", "brand", "professional"]
        aliexpress_keywords = ["cheap", "budget", "gadget", "accessory"]

        keyword_lower = keyword.lower()

        if any(kw in keyword_lower for kw in amazon_keywords):
            return "amazon"
        elif any(kw in keyword_lower for kw in aliexpress_keywords):
            return "aliexpress"
        else:
            return "amazon"  # Default

    def _generate_recommendations(self, trend_score: float, volume_score: float,
                                  competition_score: float, competition_level: str) -> List[str]:
        """Genererar rekommendationer"""
        reasons = []

        if trend_score >= 8:
            reasons.append("🔥 Starkt trendig - högt intresse")
        if volume_score >= 7:
            reasons.append("📊 Hög sökvolym - stor marknad")
        if competition_score >= 7:
            reasons.append("💎 Låg konkurrens - enkel att ranka")
        if competition_level == "low":
            reasons.append("🎯 Låg konkurrensnivå - bra möjlighet")

        if not reasons:
            reasons.append("📈 Stabil produktkategori med potential")

        return reasons


class TrendMaster:
    """Huvudklass som kombinerar alla analyser"""

    def __init__(self):
        self.trend_analyzer = TrendAnalyzer()
        self.seo_analyzer = SEOAnalyzer()
        self.bestseller_analyzer = BestsellerAnalyzer()
        self.opportunity_scorer = OpportunityScorer()

    async def find_best_products(self, limit: int = 20) -> List[ProductOpportunity]:
        """Hittar de bästa produkterna att sälja"""
        try:
            logger.info("🔍 Startar komplett produktanalys...")

            # Hämta bestsellers
            bestsellers = await self.bestseller_analyzer.get_bestselling_categories()

            # Skapa lista med alla produkter att analysera
            all_products = []
            for category, products in bestsellers.items():
                for product in products:
                    all_products.append((product, category))

            logger.info(f"📊 Analyserar {len(all_products)} produkter...")

            # Analysera trends och SEO
            keywords = [product[0] for product in all_products]

            # Kör analyser parallellt
            trend_results = await self.trend_analyzer.analyze_google_trends(keywords)
            seo_results = await self.seo_analyzer.analyze_keywords(keywords)

            # Beräkna opportunities
            opportunities = []

            for product, category in all_products:
                if product in trend_results and product in seo_results:
                    opportunity = self.opportunity_scorer.calculate_opportunity_score(
                        trend_results[product],
                        seo_results[product],
                        category
                    )
                    opportunities.append(opportunity)

            # Sortera efter opportunity score
            opportunities.sort(key=lambda x: x.opportunity_score, reverse=True)

            logger.info(
                f"✅ Analys klar! Hittade {len(opportunities)} möjligheter")
            return opportunities[:limit]

        except Exception as e:
            logger.error(f"❌ Fel vid produktanalys: {e}")
            return []

    async def generate_report(self, opportunities: List[ProductOpportunity]) -> str:
        """Genererar detaljerad rapport"""
        if not opportunities:
            return "❌ Inga produktmöjligheter hittades"

        report = f"""
🚀 AI AFFILIATE PRODUKTANALYS RAPPORT
Genererad: {datetime.now().strftime('%Y-%m-%d %H:%M')}

📊 TOPP 10 PRODUKTMÖJLIGHETER:
{'='*50}
"""

        for i, opp in enumerate(opportunities[:10], 1):
            report += f"""
{i}. {opp.product_name} ({opp.category})
   🎯 Opportunity Score: {opp.opportunity_score}/10
   📈 Trend Score: {opp.trend_score}/10  
   🔍 SEO Score: {opp.seo_score}/10
   📊 Månadssökningar: {opp.estimated_monthly_searches:,}
   💰 Estimerad månadsinkomst: ${opp.estimated_commission:,.2f}
   🏪 Rekommenderad plattform: {opp.recommended_platform.title()}
   🎪 Konkurrensnivå: {opp.competition_level.title()}
   
   💡 Anledningar:
   {chr(10).join(f'   • {reason}' for reason in opp.reasons)}
   
   🔥 Nyckelord: {', '.join(opp.keywords[:5])}
   
"""

        # Sammanfattning
        total_potential = sum(
            opp.estimated_commission for opp in opportunities[:10])
        avg_score = sum(
            opp.opportunity_score for opp in opportunities[:10]) / min(10, len(opportunities))

        report += f"""
📈 SAMMANFATTNING:
{'='*30}
💰 Total månadspotential (topp 10): ${total_potential:,.2f}
🎯 Genomsnittlig opportunity score: {avg_score:.1f}/10
📊 Produkter analyserade: {len(opportunities)}
🏆 Bästa kategori: {max(set(opp.category for opp in opportunities[:5]), key=lambda x: sum(opp.opportunity_score for opp in opportunities if opp.category == x))}

🚀 REKOMMENDATIONER:
• Fokusera på topp 5 produkterna först
• Börja med låg-konkurrens produkter
• Skapa innehåll för top keywords
• Övervaka trender månadsvis
• Testa båda plattformarna (Amazon & AliExpress)
"""

        return report

# Huvudfunktion för att köra analysen


async def main():
    """Kör komplett trend- och SEO-analys"""

    print("""
🚀 AI AFFILIATE TREND & SEO ANALYZER
=====================================

Denna analys kommer att:
• Analysera Google Trends för populära produkter
• Undersöka SEO-möjligheter och keyword difficulty  
• Identifiera bestselling kategorier
• Beräkna opportunity scores för varje produkt
• Generera en detaljerad rapport med rekommendationer

Startar analys...
    """)

    trend_master = TrendMaster()

    # Hitta bästa produkter
    opportunities = await trend_master.find_best_products(limit=25)

    if opportunities:
        # Generera rapport
        report = await trend_master.generate_report(opportunities)

        # Spara rapport
        report_file = f"trend_analysis_report_{datetime.now().strftime('%Y%m%d_%H%M')}.txt"
        with open(report_file, 'w', encoding='utf-8') as f:
            f.write(report)

        print(report)
        print(f"\n📄 Rapport sparad i: {report_file}")

        # Returnera data för integration med andra system
        return opportunities

    else:
        print("❌ Kunde inte generera produktanalys")
        return []

if __name__ == "__main__":
    # Kör analysen
    asyncio.run(main())
