#!/usr/bin/env python3
"""
Telegram Bot Starter
Enkel launcher för AI Affiliate Telegram Bot
"""

import os
import sys
from pathlib import Path

def check_config():
    """Kontrollera att konfiguration är klar"""
    try:
        from telegram_config import BOT_TOKEN, TEST_CHANNEL
        
        if BOT_TOKEN == "YOUR_TELEGRAM_BOT_TOKEN_HERE":
            print("❌ BOT_TOKEN inte konfigurerad!")
            print("   Redigera telegram_config.py och lägg till din bot token")
            return False
            
        if not TEST_CHANNEL or TEST_CHANNEL == "@your_test_channel":
            print("⚠️  TEST_CHANNEL inte konfigurerad - rekommenderas för testning")
            
        print("✅ Grundkonfiguration OK")
        return True
        
    except ImportError as e:
        print(f"❌ Import-fel: {e}")
        return False

def install_dependencies():
    """Installera nödvändiga paket"""
    print("📦 Installerar dependencies...")
    os.system("pip install -r requirements.txt")

def main():
    print("🤖 AI Affiliate Telegram Bot Starter")
    print("=====================================")
    
    # Visa meny
    print("\nVälj alternativ:")
    print("1. 🧪 Testa bot")
    print("2. 📝 Skicka manuell post")  
    print("3. 🚀 Starta automatisk bot")
    print("4. 📦 Installera dependencies")
    print("5. 👀 Visa demo (hur poster ser ut)")
    print("0. ❌ Avsluta")
    
    choice = input("\nVal (0-5): ").strip()
    
    if choice == "5":
        print("👀 Visar demo av Telegram-poster...")
        os.system("python telegram_bot_demo.py")
        return
    elif choice == "4":
        install_dependencies()
        return
    elif choice == "0":
        print("� Hej då!")
        return
    
    # För andra alternativ, kontrollera config först
    if not check_config():
        print("\n🔧 Konfigurera telegram_config.py först!")
        print("   (Alternativ 5 fungerar utan konfiguration)")
        return
    
    if choice == "1":
        print("🧪 Testar bot...")
        os.system("python telegram_bot.py test")
    elif choice == "2":
        print("� Skickar manuell post...")
        os.system("python telegram_bot.py manual")
    elif choice == "3":
        print("� Startar automatisk bot...")
        print("   (Tryck Ctrl+C för att stoppa)")
        os.system("python telegram_bot.py")
    else:
        print("❌ Ogiltigt val")

if __name__ == "__main__":
    main()
