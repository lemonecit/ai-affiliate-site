// Amazon Products Integration för Admin Panel
// Laddar och visar riktiga Amazon-produkter

class AmazonProductManager {
    constructor() {
        this.products = [];
        this.loadAmazonProducts();
    }

    async loadAmazonProducts() {
        try {
            const response = await fetch('amazon_products.json');
            const data = await response.json();
            this.products = data.products || [];
            
            console.log(`✅ Laddade ${this.products.length} Amazon-produkter`);
            this.displayAmazonSection();
            
        } catch (error) {
            console.warn('⚠️ Kunde inte ladda Amazon-produkter:', error);
            this.showAmazonError();
        }
    }

    displayAmazonSection() {
        // Hitta rätt container i admin-panelen
        const mainContent = document.querySelector('.main') || document.querySelector('.container') || document.body;
        
        // Ta bort befintlig Amazon-sektion om den finns
        const existingSection = document.getElementById('amazon-products-section');
        if (existingSection) {
            existingSection.remove();
        }
        
        const amazonSection = document.createElement('div');
        amazonSection.id = 'amazon-products-section';
        amazonSection.className = 'admin-section';
        amazonSection.style.display = 'none'; // Börja med dold
        amazonSection.innerHTML = `
            <div class="section-header">
                <h2>🛒 Amazon Produkter</h2>
                <div class="amazon-stats">
                    <span class="stat">📦 ${this.products.length} produkter</span>
                    <span class="stat">🎯 Din tag: lemonec-20</span>
                    <button id="refreshAmazonBtn" class="btn btn-secondary">🔄 Uppdatera</button>
                </div>
            </div>
            
            <div class="amazon-controls">
                <input type="text" id="amazonSearch" placeholder="🔍 Sök Amazon produkter..." class="search-input">
                <select id="amazonCategory" class="category-select">
                    <option value="">Alla kategorier</option>
                    <option value="electronics">Elektronik</option>
                    <option value="fashion">Mode</option>
                    <option value="home">Hem & Trädgård</option>
                    <option value="sports">Sport</option>
                </select>
                <button id="searchAmazonBtn" class="btn btn-primary">🔍 Sök på Amazon</button>
            </div>
            
            <div id="amazonProductsGrid" class="products-grid">
                ${this.renderProducts()}
            </div>
        `;
        
        // Lägg till sektionen i rätt container
        mainContent.appendChild(amazonSection);
        
        this.attachEventListeners();
        this.addAmazonStyles();
    }

    renderProducts() {
        if (this.products.length === 0) {
            return `
                <div class="no-products">
                    <p>🔍 Inga Amazon-produkter hittades</p>
                    <button class="btn btn-primary" onclick="amazonManager.searchProducts('trending')">
                        Ladda Trending Produkter
                    </button>
                </div>
            `;
        }

        return this.products.map(product => `
            <div class="amazon-product-card" data-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/200x200/f8f9fa/6c757d?text=Amazon'">
                    <div class="rating-badge">⭐ ${product.rating}</div>
                </div>
                
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-price">${product.price}</p>
                    <p class="product-commission">💰 Kommission: ${product.commission}</p>
                    
                    <div class="product-features">
                        ${product.features ? product.features.slice(0, 2).map(feature => 
                            `<span class="feature-tag">✓ ${feature}</span>`
                        ).join('') : ''}
                    </div>
                </div>
                
                <div class="product-actions">
                    <button class="btn btn-primary" onclick="amazonManager.addToAffiliate('${product.id}')">
                        ➕ Lägg till i Affiliate
                    </button>
                    <button class="btn btn-secondary" onclick="amazonManager.analyzeProduct('${product.id}')">
                        🤖 AI-Analys
                    </button>
                    <a href="${product.url}" target="_blank" class="btn btn-outline">
                        🔗 Visa på Amazon
                    </a>
                </div>
            </div>
        `).join('');
    }

    attachEventListeners() {
        // Sök-funktionalitet
        const searchBtn = document.getElementById('searchAmazonBtn');
        const searchInput = document.getElementById('amazonSearch');
        const categorySelect = document.getElementById('amazonCategory');
        const refreshBtn = document.getElementById('refreshAmazonBtn');

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const query = searchInput.value.trim();
                const category = categorySelect.value;
                this.searchProducts(query, category);
            });
        }

        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = searchInput.value.trim();
                    const category = categorySelect.value;
                    this.searchProducts(query, category);
                }
            });
        }

        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshAmazonProducts();
            });
        }
    }

    async searchProducts(query, category = '') {
        console.log(`🔍 Söker Amazon-produkter: "${query}" i kategori: "${category}"`);
        
        // Visa loading
        const grid = document.getElementById('amazonProductsGrid');
        if (grid) {
            grid.innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p>🔍 Söker på Amazon...</p>
                </div>
            `;
        }

        try {
            // I verklig implementation skulle detta anropa backend
            // För demo simulerar vi en sökning
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulera API-call
            
            // Demo-resultat baserat på sökning
            const searchResults = this.getSearchResults(query, category);
            this.products = searchResults;
            
            // Uppdatera grid
            if (grid) {
                grid.innerHTML = this.renderProducts();
            }
            
            // Uppdatera stats
            const statsElement = document.querySelector('.amazon-stats .stat');
            if (statsElement) {
                statsElement.textContent = `📦 ${this.products.length} produkter`;
            }
            
        } catch (error) {
            console.error('Fel vid Amazon-sökning:', error);
            if (grid) {
                grid.innerHTML = `
                    <div class="error-message">
                        ❌ Fel vid sökning. Försök igen senare.
                    </div>
                `;
            }
        }
    }

    getSearchResults(query, category) {
        // Demo-sökresultat baserat på query
        const allProducts = [
            {
                id: "amazon_B08N5WRWNW",
                name: "Echo Dot (4th Gen) - Smart speaker med Alexa",
                platform: "amazon",
                category: "electronics",
                url: "https://amazon.com/dp/B08N5WRWNW?tag=lemonec-20",
                price: "549 SEK",
                rating: 4.7,
                image: "https://m.media-amazon.com/images/I/714Rq4k05UL._AC_SX466_.jpg",
                commission: "3.0%",
                features: ["Röststyrning", "Spotify/Amazon Music", "Smart hem-kontroll"]
            },
            {
                id: "amazon_B0BDHB9Y8H",
                name: "Apple AirPods Pro (2nd Generation)",
                platform: "amazon", 
                category: "electronics",
                url: "https://amazon.com/dp/B0BDHB9Y8H?tag=lemonec-20",
                price: "2749 SEK",
                rating: 4.4,
                image: "https://m.media-amazon.com/images/I/61f1YfTkTdL._AC_SX466_.jpg",
                commission: "2.5%",
                features: ["Aktiv brusreducering", "30h batteritid", "Spatial Audio"]
            },
            {
                id: "amazon_B09G5JGJ49",
                name: "Samsung Galaxy Watch5 - Smartwatch",
                platform: "amazon",
                category: "electronics", 
                url: "https://amazon.com/dp/B09G5JGJ49?tag=lemonec-20",
                price: "3629 SEK",
                rating: 4.3,
                image: "https://m.media-amazon.com/images/I/61KIb7RF9OL._AC_SX466_.jpg",
                commission: "3.5%",
                features: ["Hälsoövervakning", "40h batteritid", "Vattenresistent"]
            }
        ];

        // Filtrera baserat på sökning och kategori
        let filtered = allProducts;

        if (query) {
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(query.toLowerCase())
            );
        }

        if (category) {
            filtered = filtered.filter(product => 
                product.category === category
            );
        }

        return filtered;
    }

    addToAffiliate(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        console.log(`➕ Lägger till i affiliate: ${product.name}`);

        // Lägg till i befintlig produktlista
        if (typeof addProduct === 'function') {
            addProduct({
                name: product.name,
                platform: product.platform,
                category: product.category,
                url: product.url,
                description: `Amazon produkt: ${product.name}. Betyg: ${product.rating}/5. Kommission: ${product.commission}`
            });
        }

        // Visa bekräftelse
        this.showNotification(`✅ ${product.name} tillagd i affiliate-listan!`, 'success');
    }

    analyzeProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        console.log(`🤖 AI-analyserar: ${product.name}`);

        // Använd befintlig AI-analys om tillgänglig
        if (typeof AIAnalyzer !== 'undefined' && AIAnalyzer.analyzeProduct) {
            const analysis = AIAnalyzer.analyzeProduct(product, 'SE');
            
            this.showProductAnalysis(product, analysis);
        } else {
            // Enkel demo-analys
            const demoAnalysis = {
                overall_score: Math.round((product.rating / 5 * 100) + Math.random() * 10),
                market_potential: Math.round(85 + Math.random() * 15),
                recommendations: [
                    `Optimal för svenska marknaden (betyg: ${product.rating}/5)`,
                    `Hög kommission: ${product.commission}`,
                    `Rekommenderas för elektronik-kategorin`
                ]
            };
            
            this.showProductAnalysis(product, demoAnalysis);
        }
    }

    showProductAnalysis(product, analysis) {
        const modal = document.createElement('div');
        modal.className = 'analysis-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>🤖 AI-Analys: ${product.name}</h3>
                    <button class="close-btn" onclick="this.closest('.analysis-modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="analysis-scores">
                        <div class="score-item">
                            <span class="score-label">Övergripande Poäng:</span>
                            <span class="score-value">${analysis.overall_score || 85}%</span>
                        </div>
                        <div class="score-item">
                            <span class="score-label">Marknadspotential:</span>
                            <span class="score-value">${analysis.market_potential || 90}%</span>
                        </div>
                    </div>
                    <div class="recommendations">
                        <h4>📊 Rekommendationer:</h4>
                        <ul>
                            ${(analysis.recommendations || []).map(rec => `<li>${rec}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="amazonManager.addToAffiliate('${product.id}')">
                        ➕ Lägg till i Affiliate
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Auto-stäng efter 10 sekunder
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 10000);
    }

    async refreshAmazonProducts() {
        console.log('🔄 Uppdaterar Amazon-produkter...');
        
        const refreshBtn = document.getElementById('refreshAmazonBtn');
        if (refreshBtn) {
            refreshBtn.textContent = '⏳ Uppdaterar...';
            refreshBtn.disabled = true;
        }

        try {
            // Simulera API-uppdatering
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Ladda om produkter
            await this.loadAmazonProducts();
            
            this.showNotification('✅ Amazon-produkter uppdaterade!', 'success');
            
        } catch (error) {
            console.error('Fel vid uppdatering:', error);
            this.showNotification('❌ Fel vid uppdatering', 'error');
        } finally {
            if (refreshBtn) {
                refreshBtn.textContent = '🔄 Uppdatera';
                refreshBtn.disabled = false;
            }
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Auto-remove efter 3 sekunder
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    showAmazonError() {
        const adminContainer = document.querySelector('.admin-container') || document.body;
        
        const errorSection = document.createElement('div');
        errorSection.className = 'amazon-error-section';
        errorSection.innerHTML = `
            <div class="error-banner">
                <h3>⚠️ Amazon Integration</h3>
                <p>Kunde inte ladda Amazon-produkter. Kontrollera din internetanslutning och försök igen.</p>
                <button class="btn btn-primary" onclick="location.reload()">🔄 Försök igen</button>
            </div>
        `;
        
        adminContainer.appendChild(errorSection);
    }

    addAmazonStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .amazon-products-section {
                background: white;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }

            .section-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                border-bottom: 2px solid #f8f9fa;
                padding-bottom: 15px;
            }

            .amazon-stats {
                display: flex;
                gap: 15px;
                align-items: center;
            }

            .amazon-stats .stat {
                background: #e3f2fd;
                padding: 5px 12px;
                border-radius: 15px;
                font-size: 0.9em;
                color: #1976d2;
            }

            .amazon-controls {
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
                flex-wrap: wrap;
            }

            .search-input, .category-select {
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 5px;
                font-size: 14px;
            }

            .search-input {
                flex: 1;
                min-width: 200px;
            }

            .products-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 20px;
            }

            .amazon-product-card {
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                overflow: hidden;
                transition: transform 0.2s, box-shadow 0.2s;
                background: white;
            }

            .amazon-product-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }

            .product-image {
                position: relative;
                height: 200px;
                overflow: hidden;
                background: #f8f9fa;
            }

            .product-image img {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }

            .rating-badge {
                position: absolute;
                top: 10px;
                right: 10px;
                background: #ff9800;
                color: white;
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 0.8em;
                font-weight: bold;
            }

            .product-info {
                padding: 15px;
            }

            .product-title {
                margin: 0 0 10px 0;
                font-size: 1.1em;
                line-height: 1.3;
                height: 2.6em;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }

            .product-price {
                font-size: 1.2em;
                font-weight: bold;
                color: #d32f2f;
                margin: 5px 0;
            }

            .product-commission {
                font-size: 0.9em;
                color: #4caf50;
                margin: 5px 0;
            }

            .product-features {
                margin: 10px 0;
            }

            .feature-tag {
                display: inline-block;
                background: #e8f5e8;
                color: #2e7d32;
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 0.8em;
                margin: 2px;
            }

            .product-actions {
                padding: 15px;
                border-top: 1px solid #f0f0f0;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .loading-spinner {
                text-align: center;
                padding: 40px;
                grid-column: 1 / -1;
            }

            .spinner {
                border: 3px solid #f3f3f3;
                border-top: 3px solid #3498db;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
                margin: 0 auto 10px;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            .analysis-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }

            .modal-content {
                background: white;
                border-radius: 8px;
                width: 90%;
                max-width: 500px;
                max-height: 80vh;
                overflow-y: auto;
            }

            .modal-header {
                padding: 20px;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .close-btn {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #666;
            }

            .modal-body {
                padding: 20px;
            }

            .analysis-scores {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin-bottom: 20px;
            }

            .score-item {
                text-align: center;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 8px;
            }

            .score-value {
                display: block;
                font-size: 1.5em;
                font-weight: bold;
                color: #4caf50;
                margin-top: 5px;
            }

            .modal-footer {
                padding: 20px;
                border-top: 1px solid #eee;
                text-align: center;
            }

            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 5px;
                color: white;
                z-index: 1001;
                animation: slideIn 0.3s ease;
            }

            .notification.success { background: #4caf50; }
            .notification.error { background: #f44336; }
            .notification.info { background: #2196f3; }

            @keyframes slideIn {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
            }

            .no-products, .error-message {
                text-align: center;
                padding: 40px;
                grid-column: 1 / -1;
                color: #666;
            }

            @media (max-width: 768px) {
                .products-grid {
                    grid-template-columns: 1fr;
                }
                
                .amazon-controls {
                    flex-direction: column;
                }
                
                .section-header {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 10px;
                }
            }
        `;

        document.head.appendChild(style);
    }

    // Visa Amazon-sektion
    show() {
        const section = document.getElementById('amazon-products-section');
        if (section) {
            section.style.display = 'block';
            console.log('📦 Amazon-sektion visas');
        } else {
            console.warn('⚠️ Amazon-sektion hittades inte');
        }
    }

    // Dölj Amazon-sektion
    hide() {
        const section = document.getElementById('amazon-products-section');
        if (section) {
            section.style.display = 'none';
        }
    }
}

// Initiera Amazon Product Manager när sidan laddas
let amazonManager;

document.addEventListener('DOMContentLoaded', () => {
    // Vänta lite för att admin-panelen ska vara redo
    setTimeout(() => {
        amazonManager = new AmazonProductManager();
        // Sätt global referens för admin-panelen
        window.amazonIntegration = amazonManager;
    }, 500);
});

// Exportera för användning i admin.html
window.AmazonProductManager = AmazonProductManager;

console.log('🛒 Amazon Product Integration laddad!');
