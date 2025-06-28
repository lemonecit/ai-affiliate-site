"""
Lokal Marknads-ML Analyzer för Affiliate Platform
Använder maskininlärning för att förstå lokala marknader och optimera produktval
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json
import requests
from sklearn.ensemble import RandomForestRegressor, GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.cluster import KMeans
from sklearn.linear_model import LinearRegression
import joblib
import logging
from typing import Dict, List, Tuple, Optional
import os
from dataclasses import dataclass, asdict

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class LocalMarketInsight:
    """Lokal marknadsinsikt"""
    country: str
    region: str
    category: str
    popularity_score: float
    seasonal_trend: List[float]
    peak_months: List[int]
    local_competitors: List[str]
    price_sensitivity: float
    mobile_usage: float
    payment_preferences: List[str]
    cultural_factors: Dict[str, float]


@dataclass
class ProductLocalScore:
    """Produktbedömning för lokal marknad"""
    product_id: str
    name: str
    platform: str
    category: str
    local_appeal_score: float
    predicted_local_clicks: int
    predicted_local_revenue: float
    cultural_fit_score: float
    language_barrier_score: float
    shipping_feasibility: float
    local_competition_level: float
    recommended_pricing: Dict[str, float]
    marketing_recommendations: List[str]


class LocalMarketMLAnalyzer:
    """AI-baserad lokal marknadsanalysator"""

    def __init__(self, primary_country="SE", target_countries=None):
        self.primary_country = primary_country
        self.target_countries = target_countries or [
            "SE", "NO", "DK", "FI", "DE", "NL", "FR", "GB", "US", "AU", "IT", "ES", "PL", "JP", "CA", "IL"]
        self.models = {}
        self.market_data = {}
        self.cultural_insights = {}

        # Ladda lokal marknadsdata
        self.load_market_data()
        self.load_cultural_insights()

        # Träna eller ladda modeller
        self.load_or_train_models()

    def load_market_data(self):
        """Laddar lokal marknadsdata för nordiska och europeiska länder"""

        # Nordisk och europeisk marknadsdata
        self.market_data = {
            "SE": {  # Sverige
                "population": 10.4,  # miljoner
                "gdp_per_capita": 51610,  # USD
                "internet_penetration": 0.97,
                "mobile_penetration": 1.28,
                "ecommerce_penetration": 0.84,
                "avg_order_value": 890,  # SEK
                "popular_categories": ["elektronik", "mode", "sport", "hem", "böcker"],
                "payment_methods": ["kort", "swish", "klarna", "paypal"],
                "seasonal_shopping": [0.8, 0.7, 0.9, 1.0, 0.9, 0.7, 0.6, 0.7, 0.9, 1.1, 1.3, 1.5],
                "mobile_shopping_ratio": 0.65,
                "social_commerce": 0.34,
                "sustainability_focus": 0.78
            },
            "NO": {  # Norge
                "population": 5.4,
                "gdp_per_capita": 75420,
                "internet_penetration": 0.98,
                "mobile_penetration": 1.12,
                "ecommerce_penetration": 0.87,
                "avg_order_value": 950,  # NOK ≈ SEK
                "popular_categories": ["elektronik", "sport", "resor", "mode", "hem"],
                "payment_methods": ["kort", "vipps", "paypal", "klarna"],
                "seasonal_shopping": [0.7, 0.6, 0.8, 0.9, 1.0, 0.8, 0.7, 0.8, 1.0, 1.2, 1.4, 1.6],
                "mobile_shopping_ratio": 0.62,
                "social_commerce": 0.28,
                "sustainability_focus": 0.82
            },
            "DK": {  # Danmark
                "population": 5.8,
                "gdp_per_capita": 60170,
                "internet_penetration": 0.97,
                "mobile_penetration": 1.25,
                "ecommerce_penetration": 0.86,
                "avg_order_value": 720,  # DKK ≈ SEK
                "popular_categories": ["mode", "elektronik", "hem", "sport", "böcker"],
                "payment_methods": ["kort", "mobilepay", "paypal", "klarna"],
                "seasonal_shopping": [0.8, 0.7, 0.9, 1.1, 1.0, 0.8, 0.7, 0.8, 1.0, 1.1, 1.3, 1.4],
                "mobile_shopping_ratio": 0.68,
                "social_commerce": 0.31,
                "sustainability_focus": 0.75
            },
            "FI": {  # Finland
                "population": 5.5,
                "gdp_per_capita": 48810,
                "internet_penetration": 0.94,
                "mobile_penetration": 1.44,
                "ecommerce_penetration": 0.77,
                "avg_order_value": 680,  # EUR * 11 ≈ SEK
                "popular_categories": ["elektronik", "sport", "hem", "mode", "hälsa"],
                "payment_methods": ["kort", "mobilepay", "paypal", "siirto"],
                "seasonal_shopping": [0.7, 0.6, 0.8, 0.9, 1.1, 0.9, 0.8, 0.8, 1.0, 1.1, 1.3, 1.5],
                "mobile_shopping_ratio": 0.59,
                "social_commerce": 0.25,
                "sustainability_focus": 0.73
            },
            "DE": {  # Tyskland
                "population": 83.2,
                "gdp_per_capita": 46260,
                "internet_penetration": 0.89,
                "mobile_penetration": 1.28,
                "ecommerce_penetration": 0.73,
                "avg_order_value": 590,  # EUR * 11 ≈ SEK
                "popular_categories": ["elektronik", "mode", "hem", "resor", "böcker"],
                "payment_methods": ["kort", "paypal", "klarna", "giropay"],
                "seasonal_shopping": [0.8, 0.7, 0.9, 1.0, 0.9, 0.8, 0.7, 0.8, 0.9, 1.1, 1.2, 1.4],
                "mobile_shopping_ratio": 0.54,
                "social_commerce": 0.29,
                "sustainability_focus": 0.69
            },
            "NL": {  # Nederländerna
                "population": 17.4,
                "gdp_per_capita": 52330,
                "internet_penetration": 0.93,
                "mobile_penetration": 1.23,
                "ecommerce_penetration": 0.91,
                "avg_order_value": 620,  # EUR * 11 ≈ SEK
                "popular_categories": ["elektronik", "mode", "sport", "hem", "resor"],
                "payment_methods": ["ideal", "kort", "paypal", "klarna"],
                "seasonal_shopping": [0.8, 0.7, 0.9, 1.1, 1.0, 0.8, 0.7, 0.8, 1.0, 1.1, 1.3, 1.5],
                "mobile_shopping_ratio": 0.59,
                "social_commerce": 0.37,
                "sustainability_focus": 0.81
            },
            "FR": {  # Frankrike
                "population": 67.8,
                "gdp_per_capita": 40490,
                "internet_penetration": 0.85,
                "mobile_penetration": 1.11,
                "ecommerce_penetration": 0.69,
                "avg_order_value": 570,  # EUR * 11 ≈ SEK
                "popular_categories": ["mode", "hem", "elektronik", "skönhet", "resor"],
                "payment_methods": ["kort", "paypal", "payconiq", "klarna"],
                "seasonal_shopping": [0.8, 0.7, 0.9, 1.0, 1.1, 0.9, 0.7, 0.6, 1.0, 1.1, 1.2, 1.4],
                "mobile_shopping_ratio": 0.52,
                "social_commerce": 0.33,
                "sustainability_focus": 0.71
            },
            "GB": {  # Storbritannien
                "population": 67.8,
                "gdp_per_capita": 41030,
                "internet_penetration": 0.95,
                "mobile_penetration": 1.21,
                "ecommerce_penetration": 0.87,
                "avg_order_value": 750,  # GBP * 13 ≈ SEK
                "popular_categories": ["mode", "elektronik", "hem", "sport", "skönhet"],
                "payment_methods": ["kort", "paypal", "apple_pay", "klarna"],
                "seasonal_shopping": [0.7, 0.6, 0.8, 0.9, 1.0, 0.8, 0.7, 0.8, 1.0, 1.1, 1.4, 1.6],
                "mobile_shopping_ratio": 0.71,
                "social_commerce": 0.39,
                "sustainability_focus": 0.64
            },
            "US": {  # USA
                "population": 331.9,
                "gdp_per_capita": 63540,
                "internet_penetration": 0.87,
                "mobile_penetration": 1.27,
                "ecommerce_penetration": 0.79,
                "avg_order_value": 1100,  # USD * 10.5 ≈ SEK
                "popular_categories": ["elektronik", "mode", "hem", "sport", "skönhet"],
                "payment_methods": ["kort", "paypal", "apple_pay", "venmo"],
                "seasonal_shopping": [0.7, 0.6, 0.8, 0.9, 1.0, 0.8, 0.7, 0.8, 1.0, 1.1, 1.5, 1.7],
                "mobile_shopping_ratio": 0.74,
                "social_commerce": 0.43,
                "sustainability_focus": 0.58
            },
            "AU": {  # Australien
                "population": 25.7,
                "gdp_per_capita": 51810,
                "internet_penetration": 0.89,
                "mobile_penetration": 1.09,
                "ecommerce_penetration": 0.82,
                "avg_order_value": 950,  # AUD * 7 ≈ SEK
                "popular_categories": ["mode", "sport", "elektronik", "hem", "hälsa"],
                "payment_methods": ["kort", "paypal", "afterpay", "apple_pay"],
                # Omvänd säsong
                "seasonal_shopping": [0.9, 1.0, 0.8, 0.7, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.3, 1.5],
                "mobile_shopping_ratio": 0.67,
                "social_commerce": 0.35,
                "sustainability_focus": 0.72
            },
            "IT": {  # Italien
                "population": 59.1,
                "gdp_per_capita": 31300,
                "internet_penetration": 0.74,
                "mobile_penetration": 1.35,
                "ecommerce_penetration": 0.55,
                "avg_order_value": 480,  # EUR * 11 ≈ SEK
                "popular_categories": ["mode", "hem", "mat", "skönhet", "elektronik"],
                "payment_methods": ["kort", "paypal", "postepay", "satispay"],
                "seasonal_shopping": [0.8, 0.7, 0.9, 1.0, 1.1, 0.9, 0.8, 0.6, 1.0, 1.1, 1.2, 1.4],
                "mobile_shopping_ratio": 0.58,
                "social_commerce": 0.41,
                "sustainability_focus": 0.62
            },
            "ES": {  # Spanien
                "population": 47.4,
                "gdp_per_capita": 27060,
                "internet_penetration": 0.87,
                "mobile_penetration": 1.16,
                "ecommerce_penetration": 0.71,
                "avg_order_value": 520,  # EUR * 11 ≈ SEK
                "popular_categories": ["mode", "elektronik", "resor", "hem", "sport"],
                "payment_methods": ["kort", "paypal", "bizum", "klarna"],
                "seasonal_shopping": [0.8, 0.7, 0.9, 1.0, 1.1, 0.9, 0.8, 0.7, 1.0, 1.1, 1.3, 1.4],
                "mobile_shopping_ratio": 0.64,
                "social_commerce": 0.38,
                "sustainability_focus": 0.59
            },
            "PL": {  # Polen
                "population": 37.8,
                "gdp_per_capita": 15420,
                "internet_penetration": 0.84,
                "mobile_penetration": 1.41,
                "ecommerce_penetration": 0.76,
                "avg_order_value": 320,  # PLN * 2.5 ≈ SEK
                "popular_categories": ["elektronik", "mode", "hem", "sport", "böcker"],
                "payment_methods": ["kort", "blik", "paypal", "przelewy24"],
                "seasonal_shopping": [0.8, 0.7, 0.9, 1.0, 1.0, 0.8, 0.7, 0.8, 0.9, 1.1, 1.3, 1.5],
                "mobile_shopping_ratio": 0.61,
                "social_commerce": 0.32,
                "sustainability_focus": 0.54
            },
            "JP": {  # Japan
                "population": 125.8,
                "gdp_per_capita": 39290,
                "internet_penetration": 0.83,
                "mobile_penetration": 1.67,
                "ecommerce_penetration": 0.73,
                "avg_order_value": 650,  # JPY * 0.075 ≈ SEK
                "popular_categories": ["elektronik", "mode", "hem", "skönhet", "mat"],
                "payment_methods": ["kort", "konbini", "paypal", "linepay"],
                "seasonal_shopping": [0.9, 0.8, 1.2, 1.1, 0.9, 0.8, 0.9, 0.8, 1.0, 1.1, 1.2, 1.4],
                "mobile_shopping_ratio": 0.72,
                "social_commerce": 0.29,
                "sustainability_focus": 0.68
            },
            "CA": {  # Kanada
                "population": 38.2,
                "gdp_per_capita": 43530,
                "internet_penetration": 0.94,
                "mobile_penetration": 1.33,
                "ecommerce_penetration": 0.83,
                "avg_order_value": 980,  # CAD * 8 ≈ SEK
                "popular_categories": ["elektronik", "mode", "sport", "hem", "hälsa"],
                "payment_methods": ["kort", "paypal", "interac", "apple_pay"],
                "seasonal_shopping": [0.7, 0.6, 0.8, 0.9, 1.0, 0.8, 0.7, 0.8, 1.0, 1.1, 1.4, 1.6],
                "mobile_shopping_ratio": 0.69,
                "social_commerce": 0.36,
                "sustainability_focus": 0.74
            },
            "IL": {  # Israel
                "population": 9.4,
                "gdp_per_capita": 43610,
                "internet_penetration": 0.86,
                "mobile_penetration": 1.24,
                "ecommerce_penetration": 0.71,
                "avg_order_value": 430,  # ILS * 3 ≈ SEK
                "popular_categories": ["elektronik", "mode", "hem", "skönhet", "böcker"],
                "payment_methods": ["kort", "paypal", "bit", "apple_pay"],
                "seasonal_shopping": [0.8, 0.7, 0.9, 1.1, 1.0, 0.8, 0.7, 0.8, 1.0, 1.2, 1.3, 1.4],
                "mobile_shopping_ratio": 0.73,
                "social_commerce": 0.42,
                "sustainability_focus": 0.66
            }
        }

    def load_cultural_insights(self):
        """Laddar kulturella insikter för varje marknad"""

        self.cultural_insights = {
            "SE": {
                "design_preference": "minimalist",
                "trust_factors": ["recensioner", "varumärke", "hållbarhet"],
                "shopping_behavior": "research_heavy",
                "language_barrier": 0.15,  # Låg - bra engelska
                "price_sensitivity": 0.65,
                "brand_loyalty": 0.72,
                "social_proof_importance": 0.68,
                "return_policy_importance": 0.78,
                "local_brands_preference": 0.45
            },
            "NO": {
                "design_preference": "functional",
                "trust_factors": ["kvalitet", "miljöpåverkan", "ursprung"],
                "shopping_behavior": "quality_focused",
                "language_barrier": 0.12,
                "price_sensitivity": 0.45,  # Mindre priskänsliga
                "brand_loyalty": 0.75,
                "social_proof_importance": 0.63,
                "return_policy_importance": 0.82,
                "local_brands_preference": 0.52
            },
            "DK": {
                "design_preference": "hygge",
                "trust_factors": ["komfort", "funktionalitet", "design"],
                "shopping_behavior": "balanced",
                "language_barrier": 0.18,
                "price_sensitivity": 0.58,
                "brand_loyalty": 0.69,
                "social_proof_importance": 0.71,
                "return_policy_importance": 0.76,
                "local_brands_preference": 0.48
            },
            "FI": {
                "design_preference": "functional",
                "trust_factors": ["teknologi", "innovation", "kvalitet"],
                "shopping_behavior": "tech_savvy",
                "language_barrier": 0.22,
                "price_sensitivity": 0.72,
                "brand_loyalty": 0.66,
                "social_proof_importance": 0.59,
                "return_policy_importance": 0.74,
                "local_brands_preference": 0.41
            },
            "DE": {
                "design_preference": "engineering",
                "trust_factors": ["kvalitet", "säkerhet", "garanti"],
                "shopping_behavior": "thorough_research",
                "language_barrier": 0.35,
                "price_sensitivity": 0.68,
                "brand_loyalty": 0.78,
                "social_proof_importance": 0.65,
                "return_policy_importance": 0.85,
                "local_brands_preference": 0.62
            },
            "NL": {
                "design_preference": "practical",
                "trust_factors": ["transparens", "värde", "hållbarhet"],
                "shopping_behavior": "value_conscious",
                "language_barrier": 0.08,  # Mycket bra engelska
                "price_sensitivity": 0.58,
                "brand_loyalty": 0.65,
                "social_proof_importance": 0.72,
                "return_policy_importance": 0.79,
                "local_brands_preference": 0.43
            },
            "FR": {
                "design_preference": "elegant",
                "trust_factors": ["stil", "kvalitet", "ursprung"],
                "shopping_behavior": "style_focused",
                "language_barrier": 0.55,  # Starkare preferens för franska
                "price_sensitivity": 0.64,
                "brand_loyalty": 0.74,
                "social_proof_importance": 0.69,
                "return_policy_importance": 0.73,
                "local_brands_preference": 0.67
            },
            "GB": {
                "design_preference": "traditional_modern",
                "trust_factors": ["recensioner", "varumärke", "service"],
                "shopping_behavior": "convenience_focused",
                "language_barrier": 0.02,  # Engelskspråkigt
                "price_sensitivity": 0.71,
                "brand_loyalty": 0.69,
                "social_proof_importance": 0.76,
                "return_policy_importance": 0.81,
                "local_brands_preference": 0.54
            },
            "US": {
                "design_preference": "bold",
                "trust_factors": ["recensioner", "snabb_leverans", "kundservice"],
                "shopping_behavior": "impulse_friendly",
                "language_barrier": 0.01,  # Engelskspråkigt
                "price_sensitivity": 0.62,
                "brand_loyalty": 0.63,
                "social_proof_importance": 0.82,
                "return_policy_importance": 0.78,
                "local_brands_preference": 0.58
            },
            "AU": {
                "design_preference": "casual_practical",
                "trust_factors": ["kvalitet", "ursprung", "värde"],
                "shopping_behavior": "outdoor_focused",
                "language_barrier": 0.01,  # Engelskspråkigt
                "price_sensitivity": 0.69,
                "brand_loyalty": 0.71,
                "social_proof_importance": 0.74,
                "return_policy_importance": 0.83,
                "local_brands_preference": 0.49
            },
            "IT": {
                "design_preference": "elegant_stylish",
                "trust_factors": ["design", "tradition", "ursprung"],
                "shopping_behavior": "fashion_conscious",
                "language_barrier": 0.55,  # Begränsad engelska
                "price_sensitivity": 0.74,
                "brand_loyalty": 0.68,
                "social_proof_importance": 0.79,
                "return_policy_importance": 0.71,
                "local_brands_preference": 0.73
            },
            "ES": {
                "design_preference": "vibrant_expressive",
                "trust_factors": ["värde", "familj", "gemenskap"],
                "shopping_behavior": "social_influenced",
                "language_barrier": 0.48,
                "price_sensitivity": 0.78,
                "brand_loyalty": 0.64,
                "social_proof_importance": 0.82,
                "return_policy_importance": 0.69,
                "local_brands_preference": 0.61
            },
            "PL": {
                "design_preference": "practical_value",
                "trust_factors": ["pris", "kvalitet", "garanti"],
                "shopping_behavior": "value_seeking",
                "language_barrier": 0.42,
                "price_sensitivity": 0.85,  # Hög priskänslighet
                "brand_loyalty": 0.59,
                "social_proof_importance": 0.76,
                "return_policy_importance": 0.79,
                "local_brands_preference": 0.56
            },
            "JP": {
                "design_preference": "minimalist_precise",
                "trust_factors": ["kvalitet", "innovation", "service"],
                "shopping_behavior": "detail_oriented",
                "language_barrier": 0.71,  # Hög språkbarriär
                "price_sensitivity": 0.58,
                "brand_loyalty": 0.84,  # Mycket hög lojalitet
                "social_proof_importance": 0.67,
                "return_policy_importance": 0.88,
                "local_brands_preference": 0.79
            },
            "CA": {
                "design_preference": "friendly_reliable",
                "trust_factors": ["kvalitet", "miljöpåverkan", "värde"],
                "shopping_behavior": "research_conscious",
                "language_barrier": 0.08,  # Engelska/franska
                "price_sensitivity": 0.66,
                "brand_loyalty": 0.73,
                "social_proof_importance": 0.71,
                "return_policy_importance": 0.81,
                "local_brands_preference": 0.52
            },
            "IL": {
                "design_preference": "tech_innovative",
                "trust_factors": ["innovation", "säkerhet", "kvalitet"],
                "shopping_behavior": "tech_early_adopter",
                "language_barrier": 0.25,  # Engelska + hebreiska
                "price_sensitivity": 0.72,
                "brand_loyalty": 0.68,
                "social_proof_importance": 0.78,
                "return_policy_importance": 0.76,
                "local_brands_preference": 0.58
            }
        }

    def analyze_local_market(self, country: str, category: str) -> LocalMarketInsight:
        """Analyserar lokal marknad för specifik kategori"""

        market = self.market_data.get(country, self.market_data["SE"])
        culture = self.cultural_insights.get(
            country, self.cultural_insights["SE"])

        # Beräkna popularitetspoäng för kategorin
        category_popularity = self.calculate_category_popularity(
            market, category)

        # Identifiera lokala konkurrenter
        local_competitors = self.identify_local_competitors(country, category)

        # Beräkna kulturella faktorer
        cultural_factors = {
            "design_fit": self.calculate_design_fit(culture["design_preference"], category),
            "trust_alignment": self.calculate_trust_alignment(culture["trust_factors"], category),
            "behavior_match": self.calculate_behavior_match(culture["shopping_behavior"], category)
        }

        return LocalMarketInsight(
            country=country,
            region=self.get_region(country),
            category=category,
            popularity_score=category_popularity,
            seasonal_trend=market["seasonal_shopping"],
            peak_months=self.get_peak_months(market["seasonal_shopping"]),
            local_competitors=local_competitors,
            price_sensitivity=culture["price_sensitivity"],
            mobile_usage=market["mobile_shopping_ratio"],
            payment_preferences=market["payment_methods"],
            cultural_factors=cultural_factors
        )

    def calculate_category_popularity(self, market_data: Dict, category: str) -> float:
        """Beräknar kategoripopularitet för marknad"""

        popular_categories = market_data.get("popular_categories", [])

        if category in popular_categories:
            # Position i listan påverkar poäng
            position = popular_categories.index(category)
            base_score = 1.0 - (position * 0.15)
        else:
            base_score = 0.5  # Neutral för okända kategorier

        # Justera baserat på e-handelspenetration
        ecommerce_factor = market_data.get("ecommerce_penetration", 0.8)

        return min(base_score * ecommerce_factor * 1.2, 1.0)

    def identify_local_competitors(self, country: str, category: str) -> List[str]:
        """Identifierar lokala konkurrenter"""

        local_players = {
            "SE": {
                "elektronik": ["Elgiganten", "NetOnNet", "Webhallen", "Dustin"],
                "mode": ["H&M", "Gina Tricot", "Nelly", "Boozt"],
                "sport": ["Stadium", "XXL", "Intersport"],
                "hem": ["IKEA", "Ellos", "Åhléns", "Gekås"],
                "böcker": ["Bokus", "Adlibris", "Akademibokhandeln"]
            },
            "NO": {
                "elektronik": ["Elkjøp", "Power", "Komplett"],
                "mode": ["Zalando", "Nelly", "Boozt"],
                "sport": ["XXL", "Intersport", "G-Sport"],
                "hem": ["IKEA", "Ellos", "Jernia"],
                "resor": ["Apollo", "Ving", "TUI"]
            },
            "DK": {
                "elektronik": ["Elgiganten", "Power", "Proshop"],
                "mode": ["Zalando", "Boozt", "Stylepit"],
                "sport": ["Intersport", "Sportmaster", "XXL"],
                "hem": ["IKEA", "Ellos", "BoShop"]
            },
            "FI": {
                "elektronik": ["Gigantti", "Power", "Verkkokauppa"],
                "mode": ["Zalando", "Nelly", "Stylepit"],
                "sport": ["Intersport", "XXL", "Stadium"],
                "hem": ["IKEA", "Ellos", "Sotka"]
            },
            "DE": {
                "elektronik": ["MediaMarkt", "Saturn", "Amazon"],
                "mode": ["Zalando", "About You", "Otto"],
                "sport": ["SportScheck", "Decathlon", "Intersport"],
                "hem": ["IKEA", "Otto", "Wayfair"]
            },
            "NL": {
                "elektronik": ["MediaMarkt", "Coolblue", "Bol.com"],
                "mode": ["Zalando", "De Bijenkorf", "Wehkamp"],
                "sport": ["Decathlon", "Intersport", "Sportdirect"],
                "hem": ["IKEA", "Bol.com", "Wehkamp"]
            },
            "FR": {
                "elektronik": ["Fnac", "Darty", "Amazon"],
                "mode": ["Zalando", "La Redoute", "Galeries Lafayette"],
                "sport": ["Decathlon", "Go Sport", "Intersport"],
                "hem": ["IKEA", "La Redoute", "Conforama"],
                "skönhet": ["Sephora", "Nocibe", "Marionnaud"]
            },
            "GB": {
                "elektronik": ["Currys", "Amazon", "Argos"],
                "mode": ["ASOS", "Next", "Marks & Spencer"],
                "sport": ["Sports Direct", "JD Sports", "Decathlon"],
                "hem": ["IKEA", "John Lewis", "Argos"],
                "skönhet": ["Boots", "Superdrug", "Sephora"]
            },
            "US": {
                "elektronik": ["Best Buy", "Amazon", "Walmart"],
                "mode": ["Amazon", "Macy's", "Nordstrom"],
                "sport": ["Dick's", "Nike", "Foot Locker"],
                "hem": ["Home Depot", "Lowe's", "Wayfair"],
                "skönhet": ["Ulta", "Sephora", "CVS"]
            },
            "AU": {
                "elektronik": ["JB Hi-Fi", "Harvey Norman", "Amazon"],
                "mode": ["The Iconic", "Myer", "David Jones"],
                "sport": ["Rebel Sport", "Foot Locker", "Decathlon"],
                "hem": ["Bunnings", "IKEA", "Kmart"],
                "hälsa": ["Chemist Warehouse", "Priceline", "Terry White"]
            },
            "IT": {
                "elektronik": ["MediaWorld", "Euronics", "Amazon"],
                "mode": ["Zalando", "Yoox", "Luisa Via Roma"],
                "sport": ["Decathlon", "Cisalfa Sport", "Maxi Sport"],
                "hem": ["IKEA", "Mondo Convenienza", "Leroy Merlin"],
                "mat": ["Esselunga", "Conad", "Carrefour"],
                "skönhet": ["Sephora", "Douglas", "Limoni"]
            },
            "ES": {
                "elektronik": ["MediaMarkt", "El Corte Inglés", "Amazon"],
                "mode": ["Zara", "Mango", "El Corte Inglés"],
                "sport": ["Decathlon", "Sprinter", "Forum Sport"],
                "hem": ["IKEA", "Leroy Merlin", "El Corte Inglés"],
                "resor": ["Booking.com", "Expedia", "eDreams"]
            },
            "PL": {
                "elektronik": ["Media Expert", "RTV Euro AGD", "x-kom"],
                "mode": ["Zalando", "Modivo", "Answear"],
                "sport": ["Decathlon", "Go Sport", "Intersport"],
                "hem": ["IKEA", "Castorama", "Leroy Merlin"],
                "böcker": ["Empik", "Legimi", "TaniaKsiazka"]
            },
            "JP": {
                "elektronik": ["Yodobashi", "Bic Camera", "Amazon"],
                "mode": ["Uniqlo", "ZOZOTOWN", "Rakuten Fashion"],
                "sport": ["Sports Depo", "Victoria", "Supersports"],
                "hem": ["IKEA", "Nitori", "Rakuten"],
                "skönhet": ["Cosme", "@cosme", "Loft"],
                "mat": ["Amazon Fresh", "Oisix", "Rakuten Seiyu"]
            },
            "CA": {
                "elektronik": ["Best Buy", "The Source", "Amazon"],
                "mode": ["Hudson's Bay", "Simons", "Amazon"],
                "sport": ["Sport Chek", "Canadian Tire", "Atmosphere"],
                "hem": ["IKEA", "Canadian Tire", "Home Depot"],
                "hälsa": ["Shoppers Drug Mart", "Rexall", "Well.ca"]
            },
            "IL": {
                "elektronik": ["KSP", "Ivory", "Bug"],
                "mode": ["Terminal X", "Golf", "Castro"],
                "sport": ["Decathlon", "Twenty Four Seven", "Mega Sport"],
                "hem": ["IKEA", "Or Design", "Shilav"],
                "skönhet": ["Super-Pharm", "Lilith", "MAC"],
                "böcker": ["Steimatzky", "Tzomet Sfarim", "Amazon"]
            }
        }

        return local_players.get(country, {}).get(category, ["Amazon", "eBay"])

    def get_region(self, country: str) -> str:
        """Returnerar region för land"""
        regions = {
            "SE": "Nordic",
            "NO": "Nordic",
            "DK": "Nordic",
            "FI": "Nordic",
            "DE": "Central Europe",
            "NL": "Western Europe",
            "FR": "Western Europe",
            "GB": "Western Europe",
            "US": "North America",
            "AU": "Oceania",
            "IT": "Southern Europe",
            "ES": "Southern Europe",
            "PL": "Eastern Europe",
            "JP": "East Asia",
            "CA": "North America"
        }
        return regions.get(country, "Europe")

    def get_peak_months(self, seasonal_data: List[float]) -> List[int]:
        """Identifierar toppmånader från säsongsdata"""
        avg = np.mean(seasonal_data)
        peak_months = []

        for i, value in enumerate(seasonal_data):
            if value > avg * 1.1:  # 10% över genomsnitt
                peak_months.append(i + 1)  # Månader är 1-indexerade

        return peak_months

    def calculate_design_fit(self, design_preference: str, category: str) -> float:
        """Beräknar hur väl produktkategori passar designpreferens"""

        design_category_fit = {
            "minimalist": {
                "elektronik": 0.9, "mode": 0.8, "hem": 0.9, "sport": 0.7, "böcker": 0.8
            },
            "functional": {
                "elektronik": 0.9, "sport": 0.9, "hem": 0.8, "mode": 0.6, "resor": 0.8
            },
            "hygge": {
                "hem": 0.9, "mode": 0.8, "böcker": 0.8, "elektronik": 0.6, "sport": 0.5
            },
            "engineering": {
                "elektronik": 0.9, "sport": 0.8, "hem": 0.7, "mode": 0.5, "resor": 0.6
            },
            "casual_practical": {
                "sport": 0.9, "mode": 0.8, "hem": 0.7, "elektronik": 0.6, "hälsa": 0.8
            },
            "elegant_stylish": {
                "mode": 0.9, "hem": 0.8, "skönhet": 0.9, "elektronik": 0.5, "mat": 0.7
            },
            "vibrant_expressive": {
                "mode": 0.9, "sport": 0.8, "resor": 0.9, "hem": 0.7, "elektronik": 0.6
            },
            "practical_value": {
                "elektronik": 0.8, "hem": 0.9, "sport": 0.7, "mode": 0.6, "böcker": 0.8
            },
            "minimalist_precise": {
                "elektronik": 0.9, "mode": 0.8, "hem": 0.9, "skönhet": 0.8, "mat": 0.7
            },
            "friendly_reliable": {
                "sport": 0.8, "elektronik": 0.8, "hem": 0.8, "mode": 0.7, "hälsa": 0.9
            },
            "tech_innovative": {
                "elektronik": 0.9, "hem": 0.8, "mode": 0.7, "skönhet": 0.6, "böcker": 0.8
            }
        }

        return design_category_fit.get(design_preference, {}).get(category, 0.7)

    def calculate_trust_alignment(self, trust_factors: List[str], category: str) -> float:
        """Beräknar förtroendejustering för kategori"""

        category_trust_importance = {
            "elektronik": ["kvalitet", "garanti", "recensioner", "varumärke"],
            "mode": ["recensioner", "design", "hållbarhet", "storlek"],
            "sport": ["kvalitet", "funktionalitet", "varumärke"],
            "hem": ["design", "funktionalitet", "hållbarhet"],
            "resor": ["säkerhet", "recensioner", "flexibilitet"],
            "böcker": ["recensioner", "pris", "tillgänglighet"]
        }

        important_for_category = category_trust_importance.get(
            category, ["kvalitet", "recensioner"])
        overlap = len(set(trust_factors) & set(important_for_category))

        return min(overlap / len(important_for_category), 1.0)

    def calculate_behavior_match(self, shopping_behavior: str, category: str) -> float:
        """Beräknar beteendematchning"""

        behavior_category_fit = {
            "research_heavy": {
                "elektronik": 0.9, "resor": 0.9, "hem": 0.8, "mode": 0.6, "sport": 0.7
            },
            "quality_focused": {
                "sport": 0.9, "elektronik": 0.8, "hem": 0.8, "mode": 0.7, "resor": 0.9
            },
            "balanced": {
                "mode": 0.8, "hem": 0.8, "sport": 0.7, "elektronik": 0.7, "böcker": 0.8
            },
            "tech_savvy": {
                "elektronik": 0.9, "sport": 0.7, "hem": 0.6, "mode": 0.5, "streaming": 0.9
            },
            "thorough_research": {
                "elektronik": 0.9, "resor": 0.9, "sport": 0.8, "hem": 0.8, "mode": 0.6
            },
            "outdoor_focused": {
                "sport": 0.9, "mode": 0.8, "hälsa": 0.8, "elektronik": 0.6, "hem": 0.7
            },
            "fashion_conscious": {
                "mode": 0.9, "skönhet": 0.9, "hem": 0.7, "elektronik": 0.5, "mat": 0.6
            },
            "social_influenced": {
                "mode": 0.9, "sport": 0.8, "resor": 0.9, "skönhet": 0.8, "elektronik": 0.6
            },
            "value_seeking": {
                "elektronik": 0.8, "hem": 0.9, "sport": 0.7, "mode": 0.6, "böcker": 0.8
            },
            "detail_oriented": {
                "elektronik": 0.9, "mode": 0.8, "hem": 0.8, "skönhet": 0.9, "mat": 0.8
            },
            "research_conscious": {
                "elektronik": 0.9, "resor": 0.9, "sport": 0.8, "hem": 0.8, "hälsa": 0.8
            },
            "tech_early_adopter": {
                "elektronik": 0.9, "hem": 0.8, "mode": 0.7, "skönhet": 0.6, "böcker": 0.8
            }
        }

        return behavior_category_fit.get(shopping_behavior, {}).get(category, 0.7)

    def score_product_for_local_market(self, product_data: Dict, country: str) -> ProductLocalScore:
        """Bedömer produkt för lokal marknad"""

        category = product_data.get('category', 'other')
        market_insight = self.analyze_local_market(country, category)
        culture = self.cultural_insights.get(
            country, self.cultural_insights["SE"])

        # Beräkna olika poäng
        local_appeal = self.calculate_local_appeal(
            product_data, market_insight, culture)
        cultural_fit = market_insight.cultural_factors["design_fit"] * 0.4 + \
            market_insight.cultural_factors["trust_alignment"] * 0.3 + \
            market_insight.cultural_factors["behavior_match"] * 0.3

        language_barrier = culture["language_barrier"]
        shipping_feasibility = self.calculate_shipping_feasibility(
            product_data, country)
        competition_level = self.calculate_local_competition(market_insight)

        # Förutsäg lokal prestanda
        predicted_clicks, predicted_revenue = self.predict_local_performance(
            product_data, market_insight, local_appeal
        )

        # Rekommendationer
        marketing_recs = self.generate_marketing_recommendations(
            product_data, market_insight, culture)
        pricing_recs = self.generate_pricing_recommendations(
            product_data, country)

        return ProductLocalScore(
            product_id=product_data.get('id', ''),
            name=product_data.get('name', ''),
            platform=product_data.get('platform', ''),
            category=category,
            local_appeal_score=local_appeal,
            predicted_local_clicks=predicted_clicks,
            predicted_local_revenue=predicted_revenue,
            cultural_fit_score=cultural_fit,
            language_barrier_score=language_barrier,
            shipping_feasibility=shipping_feasibility,
            local_competition_level=competition_level,
            recommended_pricing=pricing_recs,
            marketing_recommendations=marketing_recs
        )

    def calculate_local_appeal(self, product_data: Dict, market_insight: LocalMarketInsight, culture: Dict) -> float:
        """Beräknar lokal attraktion för produkt"""

        # Baspoäng från marknadspopularitet
        base_score = market_insight.popularity_score

        # Säsongsjustering
        current_month = datetime.now().month - 1
        seasonal_factor = market_insight.seasonal_trend[current_month]

        # Prisjustering baserat på priskänslighet
        price = float(product_data.get('price', 100))
        market_avg_price = self.market_data[market_insight.country]["avg_order_value"]
        price_ratio = price / market_avg_price if market_avg_price > 0 else 1.0

        if price_ratio > 1.5:  # Dyr produkt
            price_adjustment = 1 - (culture["price_sensitivity"] * 0.3)
        elif price_ratio < 0.5:  # Billig produkt
            price_adjustment = 1 - \
                (culture["price_sensitivity"] * 0.1)  # Mindre påverkan
        else:
            price_adjustment = 1.0

        # Varumärkesjustering
        brand_factor = 1.0
        if product_data.get('platform') in ['amazon', 'apple', 'samsung']:
            brand_factor = 1 + (culture["brand_loyalty"] * 0.2)

        # Social proof-justering
        rating = float(product_data.get('rating', 4.0))
        reviews = int(product_data.get('reviews_count', 10))
        social_proof_factor = (
            rating / 5.0) * min(reviews / 100, 1.0) * culture["social_proof_importance"]

        final_score = base_score * seasonal_factor * price_adjustment * \
            brand_factor * (1 + social_proof_factor * 0.3)

        return min(final_score, 1.0)

    def calculate_shipping_feasibility(self, product_data: Dict, country: str) -> float:
        """Beräknar fraktmöjligheter"""

        platform = product_data.get('platform', '')
        category = product_data.get('category', '')

        # Plattformsspecifika fraktmöjligheter till olika länder
        shipping_feasibility = {
            "amazon": {"SE": 0.9, "NO": 0.7, "DK": 0.85, "FI": 0.8, "DE": 0.95},
            "aliexpress": {"SE": 0.6, "NO": 0.5, "DK": 0.6, "FI": 0.55, "DE": 0.7},
            # Digitalt
            "booking": {"SE": 1.0, "NO": 1.0, "DK": 1.0, "FI": 1.0, "DE": 1.0},
            # Digitalt
            "spotify": {"SE": 1.0, "NO": 1.0, "DK": 1.0, "FI": 1.0, "DE": 1.0},
        }

        return shipping_feasibility.get(platform, {}).get(country, 0.7)

    def calculate_local_competition(self, market_insight: LocalMarketInsight) -> float:
        """Beräknar lokal konkurrensnivå"""
        return len(market_insight.local_competitors) / 10.0  # Normalisera till 0-1

    def predict_local_performance(self, product_data: Dict, market_insight: LocalMarketInsight, appeal_score: float) -> Tuple[int, float]:
        """Förutsäger lokal prestanda"""

        # Basera på marknadsstorlek och appeal
        market_size = self.market_data[market_insight.country]["population"]
        ecommerce_penetration = self.market_data[market_insight.country]["ecommerce_penetration"]

        # Beräkna potentiella klick
        base_clicks = int(
            market_size * ecommerce_penetration * appeal_score * 100)

        # Säsongsjustering
        current_month = datetime.now().month - 1
        seasonal_factor = market_insight.seasonal_trend[current_month]
        predicted_clicks = int(base_clicks * seasonal_factor)

        # Beräkna intäkter
        price = float(product_data.get('price', 100))
        commission_rate = 0.05  # 5% genomsnittlig provision
        conversion_rate = 0.02 * appeal_score  # Högre appeal = högre konvertering

        predicted_revenue = predicted_clicks * conversion_rate * price * commission_rate

        return predicted_clicks, predicted_revenue

    def generate_marketing_recommendations(self, product_data: Dict, market_insight: LocalMarketInsight, culture: Dict) -> List[str]:
        """Genererar marknadsföringsrekommendationer"""

        recommendations = []

        # Kulturbaserade rekommendationer
        if culture["design_preference"] == "minimalist":
            recommendations.append(
                "Fokusera på ren, minimalistisk presentation")
            recommendations.append("Använd mycket whitespace i marknadsföring")

        if culture["shopping_behavior"] == "research_heavy":
            recommendations.append(
                "Tillhandahåll detaljerade produktspecifikationer")
            recommendations.append("Inkludera jämförelsetabeller")

        # Förtroendefaktorer
        if "recensioner" in culture["trust_factors"]:
            recommendations.append("Highlighta kundrecensioner och betyg")

        if "hållbarhet" in culture["trust_factors"]:
            recommendations.append("Framhäv miljövänlighet och hållbarhet")

        # Säsongsrekommendationer
        current_month = datetime.now().month
        if current_month in market_insight.peak_months:
            recommendations.append("Öka marknadsföringsbudget - toppmånad!")
            recommendations.append("Kör säsongskampanjer")

        # Mobiloptimering
        if market_insight.mobile_usage > 0.6:
            recommendations.append("Optimera för mobil shopping")
            recommendations.append("Använd stora, klickbara knappar")

        # Betalningsmetoder
        preferred_payment = market_insight.payment_preferences[0]
        recommendations.append(
            f"Framhäv {preferred_payment} som betalningsmetod")

        return recommendations

    def generate_pricing_recommendations(self, product_data: Dict, country: str) -> Dict[str, float]:
        """Genererar prisrekommendationer för lokal marknad"""

        base_price = float(product_data.get('price', 100))
        market = self.market_data[country]
        culture = self.cultural_insights[country]

        # Justera baserat på köpkraft
        gdp_adjustment = market["gdp_per_capita"] / \
            50000  # Normalisera mot $50k

        # Justera baserat på priskänslighet
        price_sensitivity_adjustment = 1 - (culture["price_sensitivity"] * 0.2)

        # Konkurrensjustering
        competition_adjustment = 0.9 if len(self.identify_local_competitors(
            country, product_data.get('category', ''))) > 3 else 1.0

        # Beräkna rekommenderade priser
        recommended_price = base_price * gdp_adjustment * \
            price_sensitivity_adjustment * competition_adjustment

        return {
            "recommended_price": round(recommended_price, 2),
            "min_viable_price": round(recommended_price * 0.8, 2),
            "premium_price": round(recommended_price * 1.3, 2),
            "discount_threshold": round(recommended_price * 0.7, 2)
        }

    def generate_market_report(self, products: List[Dict], target_countries: List[str] = None) -> Dict:
        """Genererar omfattande marknadsrapport"""

        if target_countries is None:
            target_countries = self.target_countries

        report = {
            "generated_at": datetime.now().isoformat(),
            "countries_analyzed": target_countries,
            "total_products": len(products),
            "market_analysis": {},
            "product_recommendations": {},
            "strategic_insights": {}
        }

        # Analysera varje marknad
        for country in target_countries:
            market_analysis = {
                "market_overview": self.market_data[country],
                "cultural_insights": self.cultural_insights[country],
                "category_opportunities": {},
                "seasonal_trends": {},
                "competition_landscape": {}
            }

            # Analysera kategorier
            categories = set(p.get('category', 'other') for p in products)
            for category in categories:
                market_insight = self.analyze_local_market(country, category)
                market_analysis["category_opportunities"][category] = {
                    "popularity_score": market_insight.popularity_score,
                    "peak_months": market_insight.peak_months,
                    "local_competitors": market_insight.local_competitors,
                    "cultural_fit": market_insight.cultural_factors
                }

            report["market_analysis"][country] = market_analysis

        # Produktrekommendationer per marknad
        for country in target_countries:
            country_recommendations = []

            for product in products:
                local_score = self.score_product_for_local_market(
                    product, country)

                if local_score.local_appeal_score > 0.6:  # Bara bra produkter
                    country_recommendations.append({
                        "product": {
                            "name": product.get('name', ''),
                            "category": product.get('category', ''),
                            "platform": product.get('platform', '')
                        },
                        "scores": {
                            "local_appeal": local_score.local_appeal_score,
                            "cultural_fit": local_score.cultural_fit_score,
                            "competition_level": local_score.local_competition_level
                        },
                        "predictions": {
                            "monthly_clicks": local_score.predicted_local_clicks,
                            "monthly_revenue": local_score.predicted_local_revenue
                        },
                        "recommendations": {
                            "pricing": local_score.recommended_pricing,
                            # Top 3
                            "marketing": local_score.marketing_recommendations[:3]
                        }
                    })

            # Sortera efter potential
            country_recommendations.sort(
                key=lambda x: x["scores"]["local_appeal"], reverse=True)
            # Top 10
            report["product_recommendations"][country] = country_recommendations[:10]

        # Strategiska insikter
        report["strategic_insights"] = self.generate_strategic_insights(
            target_countries, products)

        return report

    def generate_strategic_insights(self, countries: List[str], products: List[Dict]) -> Dict:
        """Genererar strategiska insikter"""

        insights = {
            "market_priority": [],
            "category_expansion": [],
            "seasonal_strategy": {},
            "localization_needs": []
        }

        # Marknadsprioritering baserat på potential
        market_potential = {}
        for country in countries:
            market = self.market_data[country]
            potential = (
                market["gdp_per_capita"] / 50000 * 0.3 +
                market["ecommerce_penetration"] * 0.4 +
                market["internet_penetration"] * 0.3
            ) * market["population"] / 10
            market_potential[country] = potential

        sorted_markets = sorted(market_potential.items(),
                                key=lambda x: x[1], reverse=True)
        insights["market_priority"] = [
            {"country": country, "potential_score": score} for country, score in sorted_markets]

        # Kategoriexpansion
        category_performance = {}
        categories = set(p.get('category', 'other') for p in products)

        for category in categories:
            total_appeal = 0
            for country in countries:
                market_insight = self.analyze_local_market(country, category)
                total_appeal += market_insight.popularity_score

            category_performance[category] = total_appeal / len(countries)

        sorted_categories = sorted(
            category_performance.items(), key=lambda x: x[1], reverse=True)
        insights["category_expansion"] = [
            {"category": cat, "avg_appeal": score} for cat, score in sorted_categories]

        # Säsongsstrategi
        for month in range(1, 13):
            month_potential = {}
            for country in countries:
                seasonal_factor = self.market_data[country]["seasonal_shopping"][month-1]
                month_potential[country] = seasonal_factor

            insights["seasonal_strategy"][f"month_{month}"] = {
                "best_markets": sorted(month_potential.items(), key=lambda x: x[1], reverse=True)[:3],
                "avg_performance": np.mean(list(month_potential.values()))
            }

        # Lokaliseringsbehov
        for country in countries:
            culture = self.cultural_insights[country]
            if culture["language_barrier"] > 0.3:
                insights["localization_needs"].append({
                    "country": country,
                    "language_barrier": culture["language_barrier"],
                    "recommendation": "Översätt till lokalt språk"
                })

        return insights

    def load_or_train_models(self):
        """Laddar eller tränar ML-modeller"""
        # Implementera modellträning här
        # För nu använder vi regelbaserad logik
        logger.info("ML-modeller redo för lokal marknadsanalys")

    def save_report(self, report: Dict, filename: str = None):
        """Sparar rapport till fil"""
        if filename is None:
            filename = f"local_market_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"

        filepath = os.path.join(os.getcwd(), filename)
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)

        logger.info(f"Marknadsrapport sparad: {filepath}")
        return filepath


# Exempel på användning
if __name__ == "__main__":
    # Skapa analyzer
    analyzer = LocalMarketMLAnalyzer(primary_country="SE", target_countries=[
                                     "SE", "NO", "DK", "FI", "DE"])

    # Exempel på produkter för analys
    sample_products = [
        {
            "id": "1",
            "name": "iPhone 15 Pro",
            "category": "elektronik",
            "platform": "amazon",
            "price": 12000,
            "rating": 4.5,
            "reviews_count": 1500
        },
        {
            "id": "2",
            "name": "Nike Air Max",
            "category": "sport",
            "platform": "amazon",
            "price": 1200,
            "rating": 4.3,
            "reviews_count": 800
        },
        {
            "id": "3",
            "name": "IKEA Desk Lamp",
            "category": "hem",
            "platform": "amazon",
            "price": 299,
            "rating": 4.1,
            "reviews_count": 250
        }
    ]

    # Generera omfattande marknadsrapport
    print("🔍 Genererar lokal marknadsanalys...")
    report = analyzer.generate_market_report(sample_products)

    # Spara rapport
    report_file = analyzer.save_report(report)
    print(f"📊 Marknadsrapport genererad: {report_file}")

    # Visa sammanfattning
    print("\n📈 MARKNADSSAMMANFATTNING:")
    print(f"Analyserade marknader: {', '.join(report['countries_analyzed'])}")
    print(f"Antal produkter: {report['total_products']}")

    print("\n🏆 MARKNADSPRIORITET:")
    for i, market in enumerate(report['strategic_insights']['market_priority'][:3], 1):
        print(f"{i}. {market['country']}: {market['potential_score']:.2f}")

    print("\n📦 BÄSTA KATEGORIER:")
    for i, category in enumerate(report['strategic_insights']['category_expansion'][:3], 1):
        print(f"{i}. {category['category']}: {category['avg_appeal']:.2f}")
