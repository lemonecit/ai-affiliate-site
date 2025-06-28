"""
Google Analytics 4 Integration
Automatisk spårning av affiliate-events och conversions
"""

import os
import requests
import json
from datetime import datetime
from typing import Dict, List, Optional


class GoogleAnalytics4:
    def __init__(self):
        # GA4 Measurement ID (kommer från Google Analytics)
        self.measurement_id = os.getenv('GA4_MEASUREMENT_ID', 'G-XXXXXXXXXX')
        self.api_secret = os.getenv('GA4_API_SECRET', 'your-api-secret')

        # GA4 Measurement Protocol endpoint
        self.endpoint = f"https://www.google-analytics.com/mp/collect?measurement_id={self.measurement_id}&api_secret={self.api_secret}"

    def track_event(self, client_id: str, event_name: str, parameters: Dict = None) -> bool:
        """Skicka event till GA4"""
        try:
            if parameters is None:
                parameters = {}

            # GA4 event payload
            payload = {
                "client_id": client_id,
                "events": [
                    {
                        "name": event_name,
                        "params": {
                            "timestamp_micros": int(datetime.now().timestamp() * 1000000),
                            **parameters
                        }
                    }
                ]
            }

            response = requests.post(
                self.endpoint,
                json=payload,
                headers={"Content-Type": "application/json"}
            )

            if response.status_code == 204:
                print(f"✅ GA4 Event skickat: {event_name}")
                return True
            else:
                print(f"❌ GA4 fel: {response.status_code}")
                return False

        except Exception as e:
            print(f"❌ GA4 tracking fel: {e}")
            return False

    def track_affiliate_click(self, client_id: str, product_id: str,
                              platform: str, category: str, source: str = "website") -> bool:
        """Spåra affiliate-klick"""
        parameters = {
            "product_id": product_id,
            "platform": platform,
            "category": category,
            "source": source,
            "currency": "SEK"
        }

        return self.track_event(client_id, "affiliate_click", parameters)

    def track_affiliate_conversion(self, client_id: str, product_id: str,
                                   revenue: float, platform: str) -> bool:
        """Spåra affiliate-konvertering"""
        parameters = {
            "product_id": product_id,
            "platform": platform,
            "value": revenue,
            "currency": "SEK",
            "transaction_id": f"aff_{product_id}_{int(datetime.now().timestamp())}"
        }

        return self.track_event(client_id, "purchase", parameters)

    def track_page_view(self, client_id: str, page_title: str,
                        page_location: str, page_referrer: str = None) -> bool:
        """Spåra sidvisning"""
        parameters = {
            "page_title": page_title,
            "page_location": page_location
        }

        if page_referrer:
            parameters["page_referrer"] = page_referrer

        return self.track_event(client_id, "page_view", parameters)


# Global instance
ga4 = GoogleAnalytics4()


def setup_ga4_tracking():
    """Setup instruktioner för GA4"""
    instructions = """
    🎯 Google Analytics 4 Setup:
    
    1. Gå till https://analytics.google.com
    2. Skapa ny GA4 property för din site
    3. Kopiera Measurement ID (G-XXXXXXXXXX)
    4. Skapa Measurement Protocol API Secret:
       - Gå till Admin > Data Streams > välj stream
       - Klicka på "Measurement Protocol API secrets"
       - Skapa ny secret
    5. Lägg till i .env.local:
       GA4_MEASUREMENT_ID=G-XXXXXXXXXX
       GA4_API_SECRET=your-api-secret
    """
    print(instructions)

    return instructions


if __name__ == "__main__":
    # Visa setup-instruktioner
    setup_ga4_tracking()

    # Test tracking (kräver riktiga credentials)
    test_client_id = "test.user.123456"
    ga4.track_affiliate_click(
        test_client_id, "test_product", "amazon", "elektronik")
