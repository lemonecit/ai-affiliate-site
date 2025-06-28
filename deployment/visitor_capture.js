
/**
 * Smart Visitor Capture & Conversion Strategy
 * Implementerar avancerade tekniker för att fånga besökare
 */

class VisitorCaptureEngine {
    constructor() {
        this.strategies = [];
        this.activePopups = new Set();
        this.userBehavior = {
            entryTime: Date.now(),
            scrollDepth: 0,
            pagesViewed: 1,
            isReturning: this.checkReturningVisitor(),
            device: this.detectDevice(),
            exitIntentTriggered: false
        };
        
        this.init();
    }
    
    init() {
        this.trackBehavior();
        this.setupTriggers();
        this.startSocialProofNotifications();
        this.loadPersonalizedContent();
    }
    
    trackBehavior() {
        // Scroll tracking
        window.addEventListener('scroll', () => {
            const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            this.userBehavior.scrollDepth = Math.max(this.userBehavior.scrollDepth, scrolled);
            
            // Trigger på 70% scroll
            if (scrolled >= 70 && !this.activePopups.has('scroll_70')) {
                this.triggerScrollOffer();
            }
        });
        
        // Exit intent detection
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0 && !this.userBehavior.exitIntentTriggered) {
                this.userBehavior.exitIntentTriggered = true;
                this.triggerExitIntent();
            }
        });
        
        // Time-based triggers
        setTimeout(() => this.triggerTimeBasedOffer(30), 30000);   // 30s
        setTimeout(() => this.triggerTimeBasedOffer(120), 120000); // 2min
    }
    
    setupTriggers() {
        // First visitor welcome (efter 5 sekunder)
        if (!this.userBehavior.isReturning) {
            setTimeout(() => this.showFirstVisitorWelcome(), 5000);
        } else {
            setTimeout(() => this.showReturningVisitorOffer(), 3000);
        }
    }
    
    triggerExitIntent() {
        if (this.activePopups.size >= 2) return; // Max 2 popups per session
        
        const offers = [
            {
                title: "⚡ Vänta! Missa inte dessa deals!",
                subtitle: "Få 15% extra rabatt på alla produkter",
                description: "Använd koden STAY15 för att få extra rabatt på din första beställning",
                cta: "🎯 Få rabattkoden nu",
                code: "STAY15",
                type: "exit_intent"
            },
            {
                title: "🎁 Innan du går...",
                subtitle: "Gratis frakt på din första beställning", 
                description: "Vi skickar din första beställning helt gratis, oavsett storlek",
                cta: "✅ Aktivera gratis frakt",
                type: "free_shipping"
            }
        ];
        
        this.showPopup(offers[Math.floor(Math.random() * offers.length)]);
    }
    
    triggerScrollOffer() {
        this.activePopups.add('scroll_70');
        
        const offer = {
            title: "🔥 Du har hittat våra bästa deals!",
            subtitle: "Specialerbjudande för engagerade besökare",
            description: "Eftersom du kollar igenom våra produkter får du 20% extra rabatt",
            cta: "🛒 Shoppa med rabatt",
            code: "SCROLL20",
            type: "scroll_reward"
        };
        
        this.showSlideInNotification(offer);
    }
    
    triggerTimeBasedOffer(seconds) {
        const timeOnSite = (Date.now() - this.userBehavior.entryTime) / 1000;
        
        if (seconds === 30 && timeOnSite >= 30) {
            this.showHelpOffer();
        } else if (seconds === 120 && timeOnSite >= 120) {
            this.showCommunityInvite();
        }
    }
    
    showFirstVisitorWelcome() {
        const offer = {
            title: "👋 Välkommen till AI Affiliate Store!",
            subtitle: "Få 20% rabatt på din första beställning", 
            description: "Vi har handplockat de bästa dealsen från Amazon, AliExpress och fler",
            cta: "🎁 Få välkomstrabatt",
            code: "WELCOME20",
            features: [
                "✅ Handplockat av AI",
                "✅ Bästa priser garanterat",
                "✅ Snabb leverans", 
                "✅ 30 dagars returrätt"
            ],
            type: "welcome"
        };
        
        this.showPopup(offer);
    }
    
    showReturningVisitorOffer() {
        const offer = {
            title: "🙌 Välkommen tillbaka!",
            subtitle: "Vi har nya deals sedan ditt senaste besök",
            description: "Kolla in våra senaste AI-rekommenderade produkter", 
            cta: "👀 Se nya deals",
            code: "LOYAL15",
            type: "returning"
        };
        
        this.showSlideInNotification(offer);
    }
    
    showPopup(offer) {
        if (this.activePopups.size >= 2) return;
        
        const popup = document.createElement('div');
        popup.className = 'visitor-capture-popup';
        popup.innerHTML = `
            <div class="popup-overlay">
                <div class="popup-content">
                    <button class="popup-close">&times;</button>
                    <div class="popup-header">
                        <h2>${offer.title}</h2>
                        <h3>${offer.subtitle}</h3>
                    </div>
                    <div class="popup-body">
                        <p>${offer.description}</p>
                        ${offer.features ? `
                            <ul class="feature-list">
                                ${offer.features.map(feature => `<li>${feature}</li>`).join('')}
                            </ul>
                        ` : ''}
                        ${offer.code ? `
                            <div class="promo-code">
                                <span>Rabattkod:</span> 
                                <code>${offer.code}</code>
                                <button onclick="navigator.clipboard.writeText('${offer.code}')">📋 Kopiera</button>
                            </div>
                        ` : ''}
                    </div>
                    <div class="popup-footer">
                        <button class="cta-button" onclick="this.closest('.visitor-capture-popup').remove(); captureEngine.convertVisitor('${offer.type}')">
                            ${offer.cta}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
        this.activePopups.add(offer.type);
        
        // Auto-remove after 30 seconds
        setTimeout(() => {
            if (popup.parentNode) {
                popup.remove();
                this.activePopups.delete(offer.type);
            }
        }, 30000);
        
        // Close button
        popup.querySelector('.popup-close').onclick = () => {
            popup.remove();
            this.activePopups.delete(offer.type);
        };
        
        // Click outside to close
        popup.querySelector('.popup-overlay').onclick = (e) => {
            if (e.target === e.currentTarget) {
                popup.remove();
                this.activePopups.delete(offer.type);
            }
        };
    }
    
    showSlideInNotification(offer) {
        const notification = document.createElement('div');
        notification.className = 'slide-in-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <button class="notification-close">&times;</button>
                <h4>${offer.title}</h4>
                <p>${offer.description}</p>
                ${offer.code ? `<div class="mini-code">Kod: <strong>${offer.code}</strong></div>` : ''}
                <button class="mini-cta" onclick="captureEngine.convertVisitor('${offer.type}')">${offer.cta}</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }, 10000);
        
        notification.querySelector('.notification-close').onclick = () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        };
    }
    
    startSocialProofNotifications() {
        const notifications = [
            "🔥 Anna från Stockholm köpte precis iPhone 15 Pro",
            "⭐ Magnus från Göteborg gav 5 stjärnor till AirPods Pro", 
            "🛒 15 personer har köpt Gaming Mus Pro senaste timmen",
            "💬 Sara från Malmö: 'Bästa affiliate-sidan jag hittat!'",
            "🎯 Erik från Uppsala sparade 2,450 kr på sin beställning",
            "🔥 Endast 3 kvar av MacBook Air M2 till detta pris",
            "⏰ 8 personer tittar på Nintendo Switch just nu"
        ];
        
        let index = 0;
        setInterval(() => {
            this.showSocialProofNotification(notifications[index % notifications.length]);
            index++;
        }, 15000); // Var 15:e sekund
    }
    
    showSocialProofNotification(text) {
        const notification = document.createElement('div');
        notification.className = 'social-proof-notification';
        notification.textContent = text;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }
    
    convertVisitor(type) {
        // Spåra konvertering
        console.log(`🎯 Visitor converted via: ${type}`);
        
        // Skicka till analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'visitor_capture_conversion', {
                'capture_type': type,
                'time_on_site': (Date.now() - this.userBehavior.entryTime) / 1000
            });
        }
        
        // Visa success meddelande
        this.showSuccessMessage(type);
    }
    
    showSuccessMessage(type) {
        const messages = {
            'welcome': '🎉 Välkomstrabatt aktiverad! Koda: WELCOME20',
            'exit_intent': '✅ Rabattkod sparad! Använd STAY15 i kassan',
            'scroll_reward': '🏆 Grattis! Du får 20% rabatt med SCROLL20',
            'returning': '💝 Tack för din lojalitet! Koda: LOYAL15'
        };
        
        const message = messages[type] || '✅ Erbjudande aktiverat!';
        this.showToast(message, 'success');
    }
    
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
        }, 5000);
    }
    
    checkReturningVisitor() {
        const visited = localStorage.getItem('ai_affiliate_visited');
        if (!visited) {
            localStorage.setItem('ai_affiliate_visited', Date.now());
            return false;
        }
        return true;
    }
    
    detectDevice() {
        return window.innerWidth <= 768 ? 'mobile' : 'desktop';
    }
}

// CSS Styles
const captureStyles = `
    .visitor-capture-popup {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    .popup-overlay {
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(5px);
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
    }
    
    .popup-content {
        background: white;
        max-width: 500px;
        width: 90%;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        animation: slideIn 0.4s ease;
        position: relative;
    }
    
    .popup-close {
        position: absolute;
        top: 15px;
        right: 20px;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
        z-index: 1;
    }
    
    .popup-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 30px 20px;
        text-align: center;
    }
    
    .popup-header h2 {
        margin: 0 0 10px 0;
        font-size: 24px;
        font-weight: 700;
    }
    
    .popup-header h3 {
        margin: 0;
        font-size: 16px;
        opacity: 0.9;
        font-weight: 400;
    }
    
    .popup-body {
        padding: 30px 20px;
    }
    
    .popup-body p {
        color: #333;
        line-height: 1.6;
        margin-bottom: 20px;
    }
    
    .feature-list {
        list-style: none;
        padding: 0;
        margin: 20px 0;
    }
    
    .feature-list li {
        padding: 8px 0;
        color: #555;
        font-size: 14px;
    }
    
    .promo-code {
        background: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
        text-align: center;
        margin: 20px 0;
        border: 2px dashed #ddd;
    }
    
    .promo-code code {
        background: #007bff;
        color: white;
        padding: 8px 16px;
        border-radius: 4px;
        font-weight: bold;
        font-size: 16px;
        margin: 0 10px;
    }
    
    .popup-footer {
        padding: 0 20px 30px 20px;
    }
    
    .cta-button {
        width: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 15px 30px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.2s ease;
    }
    
    .cta-button:hover {
        transform: translateY(-2px);
    }
    
    .slide-in-notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        max-width: 350px;
        transform: translateX(400px);
        transition: transform 0.5s ease;
        z-index: 9999;
        border-left: 4px solid #007bff;
    }
    
    .slide-in-notification.show {
        transform: translateX(0);
    }
    
    .notification-content {
        padding: 20px;
        position: relative;
    }
    
    .notification-close {
        position: absolute;
        top: 10px;
        right: 15px;
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: #999;
    }
    
    .notification-content h4 {
        margin: 0 0 10px 0;
        color: #333;
        font-size: 16px;
    }
    
    .notification-content p {
        margin: 0 0 15px 0;
        color: #666;
        font-size: 14px;
        line-height: 1.4;
    }
    
    .mini-code {
        background: #f8f9fa;
        padding: 8px;
        border-radius: 4px;
        font-size: 12px;
        margin-bottom: 15px;
        text-align: center;
    }
    
    .mini-cta {
        width: 100%;
        background: #007bff;
        color: white;
        border: none;
        padding: 10px;
        border-radius: 6px;
        font-size: 14px;
        cursor: pointer;
    }
    
    .social-proof-notification {
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: rgba(0, 0, 0, 0.85);
        color: white;
        padding: 12px 20px;
        border-radius: 25px;
        font-size: 14px;
        transform: translateX(-400px);
        transition: transform 0.5s ease;
        z-index: 9998;
        backdrop-filter: blur(10px);
    }
    
    .social-proof-notification.show {
        transform: translateX(0);
    }
    
    .toast {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        transform: translateY(-100px);
        transition: transform 0.3s ease;
        z-index: 10001;
    }
    
    .toast.show {
        transform: translateY(0);
    }
    
    .toast-success {
        background: #22c55e;
    }
    
    .toast-info {
        background: #3b82f6;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideIn {
        from { transform: translateY(-50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    @media (max-width: 768px) {
        .popup-content {
            margin: 20px;
            width: calc(100% - 40px);
        }
        
        .slide-in-notification {
            right: 10px;
            bottom: 10px;
            max-width: calc(100% - 20px);
        }
        
        .social-proof-notification {
            left: 10px;
            bottom: 10px;
            font-size: 12px;
        }
    }
`;

// Lägg till styles
const styleSheet = document.createElement('style');
styleSheet.textContent = captureStyles;
document.head.appendChild(styleSheet);

// Initiera när DOM är redo
document.addEventListener('DOMContentLoaded', () => {
    window.captureEngine = new VisitorCaptureEngine();
});

console.log('🎯 Visitor Capture Engine loaded!');
        