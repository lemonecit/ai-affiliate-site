#!/usr/bin/env python3
"""
MongoDB Connection Test Script
Testar anslutning till MongoDB Atlas och grundläggande operationer
"""

import os
import sys
from datetime import datetime
from dotenv import load_dotenv

try:
    from pymongo import MongoClient
    from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
except ImportError:
    print("❌ PyMongo är inte installerat!")
    print("Installera med: pip install pymongo")
    sys.exit(1)


def test_mongodb_connection():
    """Testar MongoDB-anslutning och grundläggande operationer"""

    # Ladda environment variables
    load_dotenv('.env.local')

    mongodb_uri = os.getenv('MONGODB_URI')

    if not mongodb_uri:
        print("❌ MONGODB_URI saknas i .env.local")
        print("Kontrollera att du har kopierat .env.example till .env.local och fyllt i dina värden")
        return False

    print("🔄 Testar MongoDB-anslutning...")
    # Visa bara början av URI för säkerhet
    print(f"URI: {mongodb_uri[:50]}...")

    try:
        # Skapa klient med timeout
        client = MongoClient(mongodb_uri, serverSelectionTimeoutMS=5000)

        # Testa anslutningen
        print("🔄 Ansluter till MongoDB Atlas...")
        client.admin.command('ping')
        print("✅ Anslutning lyckades!")

        # Välj databas och kollektion
        db = client['affiliate-store']
        test_collection = db['connection_test']

        # Testa skrivning
        print("🔄 Testar skrivning...")
        test_doc = {
            'test': True,
            'timestamp': datetime.now(),
            'message': 'MongoDB connection test successful!'
        }
        result = test_collection.insert_one(test_doc)
        print(f"✅ Dokument infogat med ID: {result.inserted_id}")

        # Testa läsning
        print("🔄 Testar läsning...")
        found_doc = test_collection.find_one({'_id': result.inserted_id})
        if found_doc:
            print(f"✅ Dokument läst: {found_doc['message']}")

        # Lista databaser
        print("🔄 Listar tillgängliga databaser...")
        db_list = client.list_database_names()
        print(f"📂 Databaser: {', '.join(db_list)}")

        # Lista kollektioner i vår databas
        if 'affiliate-store' in db_list:
            collections = db.list_collection_names()
            print(
                f"📁 Kollektioner i 'affiliate-store': {', '.join(collections) if collections else 'Inga kollektioner än'}")

        # Rensa test-dokument
        print("🔄 Rensar test-data...")
        test_collection.delete_one({'_id': result.inserted_id})
        print("✅ Test-data rensad")

        # Stäng anslutning
        client.close()
        print("✅ MongoDB-test komplett! Allt fungerar perfekt.")
        return True

    except ConnectionFailure as e:
        print(f"❌ Anslutningsfel: {e}")
        print("Kontrollera:")
        print("- Internet-anslutning")
        print("- MongoDB URI är korrekt")
        print("- Användarnamn och lösenord är rätt")
        return False

    except ServerSelectionTimeoutError as e:
        print(f"❌ Timeout vid serverval: {e}")
        print("Kontrollera:")
        print("- MongoDB cluster är igång")
        print("- IP-adress är whitelistade (0.0.0.0/0 för alla)")
        print("- Brandvägg blockerar inte utgående anslutningar")
        return False

    except Exception as e:
        print(f"❌ Oväntat fel: {e}")
        return False


def check_environment():
    """Kontrollerar environment setup"""
    print("🔄 Kontrollerar environment...")

    # Kontrollera .env.local
    if not os.path.exists('.env.local'):
        print("❌ .env.local saknas!")
        print("Kopiera .env.example till .env.local och fyll i dina värden")
        return False

    load_dotenv('.env.local')

    required_vars = ['MONGODB_URI']
    missing_vars = []

    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)

    if missing_vars:
        print(f"❌ Saknade environment variables: {', '.join(missing_vars)}")
        return False

    print("✅ Environment OK")
    return True


if __name__ == "__main__":
    print("=" * 50)
    print("🧪 MongoDB Connection Test")
    print("=" * 50)

    # Kontrollera environment först
    if not check_environment():
        sys.exit(1)

    # Testa anslutning
    success = test_mongodb_connection()

    print("=" * 50)
    if success:
        print("🎉 Alla tester lyckades! MongoDB är redo att användas.")
    else:
        print("❌ Test misslyckades. Se felmeddelanden ovan.")
        sys.exit(1)
