"""
MongoDB Atlas Integration för Click Tracking
Ersätter localStorage med cloud-baserad databas
"""

import os
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import json

# MongoDB Atlas dependencies (installeras automatiskt)
try:
    from pymongo import MongoClient
    from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
except ImportError:
    print("Installerar MongoDB dependencies...")
    os.system("pip install pymongo dnspython")
    from pymongo import MongoClient
    from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError


class AnalyticsTracker:
    def __init__(self):
        # MongoDB Atlas connection (gratis tier)
        self.connection_string = os.getenv(
            'MONGODB_URI', 'mongodb://localhost:27017/')
        self.client = None
        self.db = None
        self.clicks_collection = None
        self.products_collection = None
        self.users_collection = None

    def connect(self):
        """Anslut till MongoDB Atlas"""
        try:
            self.client = MongoClient(self.connection_string)
            # Testa anslutningen
            self.client.admin.command('ping')

            # Välj databas och collections
            self.db = self.client['ai_affiliate_platform']
            self.clicks_collection = self.db['clicks']
            self.products_collection = self.db['products']
            self.users_collection = self.db['users']

            # Skapa index för bättre prestanda
            self.clicks_collection.create_index([("timestamp", -1)])
            self.clicks_collection.create_index([("product_id", 1)])
            self.clicks_collection.create_index([("source", 1)])

            print("✅ MongoDB Atlas ansluten")
            return True

        except (ConnectionFailure, ServerSelectionTimeoutError) as e:
            print(f"❌ MongoDB anslutning misslyckades: {e}")
            return False

    def track_click(self, product_id: str, source: str = "website",
                    utm_source: str = None, utm_medium: str = None,
                    utm_campaign: str = None, user_ip: str = None,
                    user_agent: str = None) -> bool:
        """Spåra produktklick"""
        try:
            click_data = {
                "product_id": product_id,
                "source": source,
                "utm_source": utm_source,
                "utm_medium": utm_medium,
                "utm_campaign": utm_campaign,
                "user_ip": user_ip,
                "user_agent": user_agent,
                "timestamp": datetime.utcnow(),
                "converted": False  # Uppdateras vid köp
            }

            result = self.clicks_collection.insert_one(click_data)
            print(f"✅ Klick spårat: {product_id} från {source}")
            return bool(result.inserted_id)

        except Exception as e:
            print(f"❌ Fel vid klickspårning: {e}")
            return False

    def track_conversion(self, product_id: str, revenue: float = 0.0) -> bool:
        """Markera klick som konverterat"""
        try:
            result = self.clicks_collection.update_many(
                {"product_id": product_id, "converted": False},
                {
                    "$set": {
                        "converted": True,
                        "conversion_timestamp": datetime.utcnow(),
                        "revenue": revenue
                    }
                }
            )

            print(
                f"✅ Konvertering spårad: {product_id}, Revenue: {revenue} kr")
            return result.modified_count > 0

        except Exception as e:
            print(f"❌ Fel vid konverteringsspårning: {e}")
            return False

    def get_click_stats(self, days: int = 7) -> Dict:
        """Hämta klickstatistik för senaste dagarna"""
        try:
            start_date = datetime.utcnow() - timedelta(days=days)

            # Aggregation pipeline för statistik
            pipeline = [
                {"$match": {"timestamp": {"$gte": start_date}}},
                {
                    "$group": {
                        "_id": {
                            "source": "$source",
                            "product_id": "$product_id"
                        },
                        "clicks": {"$sum": 1},
                        "conversions": {
                            "$sum": {
                                "$cond": [{"$eq": ["$converted", True]}, 1, 0]
                            }
                        },
                        "revenue": {"$sum": "$revenue"}
                    }
                },
                {
                    "$group": {
                        "_id": "$_id.source",
                        "total_clicks": {"$sum": "$clicks"},
                        "total_conversions": {"$sum": "$conversions"},
                        "total_revenue": {"$sum": "$revenue"},
                        "products": {
                            "$push": {
                                "product_id": "$_id.product_id",
                                "clicks": "$clicks",
                                "conversions": "$conversions",
                                "revenue": "$revenue"
                            }
                        }
                    }
                }
            ]

            results = list(self.clicks_collection.aggregate(pipeline))

            # Formatera resultat
            stats = {
                "period_days": days,
                "total_clicks": 0,
                "total_conversions": 0,
                "total_revenue": 0.0,
                "conversion_rate": 0.0,
                "sources": {}
            }

            for result in results:
                source = result["_id"]
                clicks = result["total_clicks"]
                conversions = result["total_conversions"]
                revenue = result["total_revenue"]

                stats["total_clicks"] += clicks
                stats["total_conversions"] += conversions
                stats["total_revenue"] += revenue

                stats["sources"][source] = {
                    "clicks": clicks,
                    "conversions": conversions,
                    "revenue": revenue,
                    "conversion_rate": (conversions / clicks * 100) if clicks > 0 else 0,
                    "products": result["products"]
                }

            # Beräkna total conversion rate
            if stats["total_clicks"] > 0:
                stats["conversion_rate"] = stats["total_conversions"] / \
                    stats["total_clicks"] * 100

            return stats

        except Exception as e:
            print(f"❌ Fel vid hämtning av statistik: {e}")
            return {}

    def get_trending_products(self, days: int = 7, limit: int = 10) -> List[Dict]:
        """Hämta mest klickade produkter"""
        try:
            start_date = datetime.utcnow() - timedelta(days=days)

            pipeline = [
                {"$match": {"timestamp": {"$gte": start_date}}},
                {
                    "$group": {
                        "_id": "$product_id",
                        "clicks": {"$sum": 1},
                        "conversions": {
                            "$sum": {
                                "$cond": [{"$eq": ["$converted", True]}, 1, 0]
                            }
                        },
                        "revenue": {"$sum": "$revenue"},
                        "sources": {"$addToSet": "$source"}
                    }
                },
                {"$sort": {"clicks": -1}},
                {"$limit": limit}
            ]

            results = list(self.clicks_collection.aggregate(pipeline))

            # Formatera resultat
            trending = []
            for result in results:
                product = {
                    "product_id": result["_id"],
                    "clicks": result["clicks"],
                    "conversions": result["conversions"],
                    "revenue": result["revenue"],
                    "conversion_rate": (result["conversions"] / result["clicks"] * 100)
                    if result["clicks"] > 0 else 0,
                    "sources": result["sources"]
                }
                trending.append(product)

            return trending

        except Exception as e:
            print(f"❌ Fel vid hämtning av trending produkter: {e}")
            return []

    def export_analytics_data(self, days: int = 30) -> Dict:
        """Exportera all analytics-data för rapporter"""
        try:
            stats = self.get_click_stats(days)
            trending = self.get_trending_products(days, 20)

            # Lägg till tidsstämpel
            export_data = {
                "export_timestamp": datetime.utcnow().isoformat(),
                "period_days": days,
                "summary": stats,
                "trending_products": trending
            }

            return export_data

        except Exception as e:
            print(f"❌ Fel vid export av analytics: {e}")
            return {}


# Singleton instance
analytics = AnalyticsTracker()


def init_analytics():
    """Initialisera analytics-systemet"""
    if analytics.connect():
        print("🎯 Analytics-systemet är redo!")
        return True
    else:
        print("⚠️ Analytics körs i fallback-läge (localStorage)")
        return False


if __name__ == "__main__":
    # Test analytics
    init_analytics()

    # Test click tracking
    analytics.track_click("test_product_123", "website",
                          "google", "organic", "test_campaign")

    # Test stats
    stats = analytics.get_click_stats(7)
    print("📊 Klickstatistik:")
    print(json.dumps(stats, indent=2, default=str))
