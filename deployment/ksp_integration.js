/**
 * KSP Israel Integration för Admin Panel
 * Hanterar KSP-produkter och affiliate-funktioner
 */

class KSPIntegration {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.init();
    }

    async init() {
        await this.loadKSPProducts();
        this.setupKSPSection();
        this.bindEvents();
    }

    async loadKSPProducts() {
        try {
            const response = await fetch('ksp_products.json');
            const data = await response.json();
            this.products = data.products || [];
            this.filteredProducts = [...this.products];
            console.log(`📦 Laddade ${this.products.length} KSP-produkter`);
        } catch (error) {
            console.error('❌ Fel vid laddning av KSP-produkter:', error);
            this.products = [];
            this.filteredProducts = [];
        }
    }

    setupKSPSection() {
        // Skapa KSP-sektion i admin-panelen
        const mainContainer = document.querySelector('.main-content');
        if (!mainContainer) return;

        const kspSection = document.createElement('div');
        kspSection.className = 'admin-section';
        kspSection.id = 'ksp-section';
        kspSection.style.display = 'none';

        kspSection.innerHTML = `
            <div class="section-header">
                <h2>🇮🇱 KSP Israel Products</h2>
                <div class="ksp-stats">
                    <span class="stat-item">📦 ${this.products.length} produkter</span>
                    <span class="stat-item">💰 ILS/SEK priser</span>
                    <span class="stat-item">🎯 Affiliate-redo</span>
                </div>
            </div>

            <div class="ksp-controls">
                <div class="search-filter-row">
                    <input type="text" id="ksp-search" placeholder="🔍 Sök KSP-produkter..." class="search-input">
                    <select id="ksp-category-filter" class="filter-select">
                        <option value="">Alla kategorier</option>
                        <option value="smartphones">📱 Smartphones</option>
                        <option value="laptops">💻 Laptops</option>
                        <option value="gaming">🎮 Gaming</option>
                        <option value="audio">🎧 Audio</option>
                    </select>
                    <select id="ksp-price-filter" class="filter-select">
                        <option value="">Alla priser</option>
                        <option value="0-1000">₪0-1,000</option>
                        <option value="1000-3000">₪1,000-3,000</option>
                        <option value="3000-6000">₪3,000-6,000</option>
                        <option value="6000+">₪6,000+</option>
                    </select>
                    <button id="ksp-refresh" class="btn btn-secondary">🔄 Uppdatera</button>
                </div>
            </div>

            <div id="ksp-products-grid" class="products-grid">
                <!-- KSP-produkter kommer att laddas här -->
            </div>
        `;

        mainContainer.appendChild(kspSection);
        this.renderKSPProducts();
    }

    renderKSPProducts() {
        const grid = document.getElementById('ksp-products-grid');
        if (!grid) return;

        if (this.filteredProducts.length === 0) {
            grid.innerHTML = `
                <div class="no-products">
                    <h3>🔍 Inga KSP-produkter hittades</h3>
                    <p>Prova att ändra sökkriterier eller uppdatera produktlistan.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.filteredProducts.map(product => `
            <div class="product-card ksp-product" data-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    <div class="product-badges">
                        <span class="badge badge-ksp">KSP</span>
                        <span class="badge badge-market">🇮🇱 Israel</span>
                        ${product.availability === 'במלאי' ? '<span class="badge badge-available">✅ I lager</span>' : ''}
                    </div>
                </div>
                
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    
                    <div class="product-pricing">
                        <span class="price-sek">${product.price}</span>
                        <span class="price-original">${product.original_price}</span>
                        <span class="commission">💰 ${product.commission}</span>
                    </div>
                    
                    <div class="product-rating">
                        ${'⭐'.repeat(Math.floor(product.rating))} ${product.rating}/5
                    </div>
                    
                    <div class="product-meta">
                        <span class="meta-item">📦 ${product.shipping}</span>
                        <span class="meta-item">💵 ${product.estimated_earning}</span>
                    </div>
                </div>
                
                <div class="product-actions">
                    <button class="btn btn-primary ksp-add-to-list" data-id="${product.id}">
                        ➕ Lägg till i affiliate-lista
                    </button>
                    <button class="btn btn-secondary ksp-analyze" data-id="${product.id}">
                        🤖 AI-analys
                    </button>
                    <a href="${product.url}" target="_blank" class="btn btn-outline">
                        🔗 Visa på KSP
                    </a>
                </div>
            </div>
        `).join('');

        this.bindProductEvents();
    }

    bindEvents() {
        // Sök
        const searchInput = document.getElementById('ksp-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterProducts();
            });
        }

        // Kategorifilter
        const categoryFilter = document.getElementById('ksp-category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                this.filterProducts();
            });
        }

        // Prisfilter
        const priceFilter = document.getElementById('ksp-price-filter');
        if (priceFilter) {
            priceFilter.addEventListener('change', () => {
                this.filterProducts();
            });
        }

        // Uppdatera-knapp
        const refreshBtn = document.getElementById('ksp-refresh');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshKSPProducts();
            });
        }
    }

    bindProductEvents() {
        // Lägg till i affiliate-lista
        document.querySelectorAll('.ksp-add-to-list').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.dataset.id;
                this.addToAffiliateList(productId);
            });
        });

        // AI-analys
        document.querySelectorAll('.ksp-analyze').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.dataset.id;
                this.analyzeProduct(productId);
            });
        });
    }

    filterProducts() {
        const searchTerm = document.getElementById('ksp-search')?.value.toLowerCase() || '';
        const category = document.getElementById('ksp-category-filter')?.value || '';
        const priceRange = document.getElementById('ksp-price-filter')?.value || '';

        this.filteredProducts = this.products.filter(product => {
            // Sökfilter
            const matchesSearch = !searchTerm || 
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm);

            // Kategorifilter
            const matchesCategory = !category || product.category === category;

            // Prisfilter
            let matchesPrice = true;
            if (priceRange) {
                const priceILS = parseFloat(product.original_price.replace(/[^0-9.]/g, ''));
                switch (priceRange) {
                    case '0-1000':
                        matchesPrice = priceILS <= 1000;
                        break;
                    case '1000-3000':
                        matchesPrice = priceILS > 1000 && priceILS <= 3000;
                        break;
                    case '3000-6000':
                        matchesPrice = priceILS > 3000 && priceILS <= 6000;
                        break;
                    case '6000+':
                        matchesPrice = priceILS > 6000;
                        break;
                }
            }

            return matchesSearch && matchesCategory && matchesPrice;
        });

        this.renderKSPProducts();
    }

    async refreshKSPProducts() {
        const refreshBtn = document.getElementById('ksp-refresh');
        if (refreshBtn) {
            refreshBtn.innerHTML = '🔄 Uppdaterar...';
            refreshBtn.disabled = true;
        }

        await this.loadKSPProducts();
        this.renderKSPProducts();

        if (refreshBtn) {
            refreshBtn.innerHTML = '🔄 Uppdatera';
            refreshBtn.disabled = false;
        }

        this.showNotification('✅ KSP-produkter uppdaterade!', 'success');
    }

    addToAffiliateList(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        // Lägg till i huvud-affiliate-listan
        const affiliateProduct = {
            id: `aff_${product.id}`,
            name: product.name,
            category: product.category,
            url: product.url,
            price: product.price,
            platform: 'ksp',
            market: 'Israel',
            image: product.image,
            commission: product.commission,
            added_date: new Date().toISOString()
        };

        // Lägg till i localStorage (eller skicka till backend)
        let affiliateList = JSON.parse(localStorage.getItem('affiliate_products') || '[]');
        affiliateList.push(affiliateProduct);
        localStorage.setItem('affiliate_products', JSON.stringify(affiliateList));

        this.showNotification(`✅ "${product.name}" tillagd i affiliate-lista!`, 'success');
        
        // Uppdatera produkträknare om det finns
        this.updateProductCounter();
    }

    analyzeProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        // Simulera AI-analys för israelisk marknad
        const analysis = this.generateKSPAnalysis(product);
        this.showProductAnalysis(product, analysis);
    }

    generateKSPAnalysis(product) {
        // AI-analys baserat på israelisk marknad
        const marketScore = Math.floor(Math.random() * 30) + 70; // 70-100
        const competitiveness = ['Låg', 'Medel', 'Hög'][Math.floor(Math.random() * 3)];
        const seasonality = ['Året runt', 'Hög under semester', 'Tekniklanseringar'][Math.floor(Math.random() * 3)];

        return {
            market_score: marketScore,
            competitiveness,
            seasonality,
            target_audience: 'Israeliska tech-entusiaster, 25-45 år',
            best_time: 'Söndagar 19:00-21:00 (lokaltid)',
            profit_potential: product.commission,
            local_insights: [
                '🇮🇱 Stark tech-marknad i Israel',
                '💳 Hög e-handelsanvändning',
                '📱 Mobil-first shopping-beteende',
                '🎯 Kvalitetsmedveten målgrupp'
            ],
            recommendations: [
                'Fokusera på teknikspecifikationer',
                'Använd hebreiska i marknadsföring',
                'Betona garanti och kundservice',
                'Marknadsför under helger och semester'
            ]
        };
    }

    showProductAnalysis(product, analysis) {
        // Skapa modal för AI-analys
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content ksp-analysis-modal">
                <div class="modal-header">
                    <h3>🤖 AI-Analys: ${product.name}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                
                <div class="modal-body">
                    <div class="analysis-score">
                        <div class="score-circle">
                            <span class="score-value">${analysis.market_score}</span>
                            <span class="score-label">Marknadspoäng</span>
                        </div>
                    </div>
                    
                    <div class="analysis-grid">
                        <div class="analysis-item">
                            <h4>🎯 Målgrupp</h4>
                            <p>${analysis.target_audience}</p>
                        </div>
                        
                        <div class="analysis-item">
                            <h4>⏰ Bästa tid</h4>
                            <p>${analysis.best_time}</p>
                        </div>
                        
                        <div class="analysis-item">
                            <h4>🏆 Konkurrens</h4>
                            <p>${analysis.competitiveness}</p>
                        </div>
                        
                        <div class="analysis-item">
                            <h4>📈 Säsong</h4>
                            <p>${analysis.seasonality}</p>
                        </div>
                    </div>
                    
                    <div class="insights-section">
                        <h4>💡 Marknadsinsikter</h4>
                        <ul>
                            ${analysis.local_insights.map(insight => `<li>${insight}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="recommendations-section">
                        <h4>🚀 Rekommendationer</h4>
                        <ul>
                            ${analysis.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button class="btn btn-primary">💾 Spara analys</button>
                    <button class="btn btn-secondary modal-close">Stäng</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Bind close events
        modal.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                modal.remove();
            });
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    updateProductCounter() {
        const counter = document.querySelector('.product-counter');
        if (counter) {
            const affiliateList = JSON.parse(localStorage.getItem('affiliate_products') || '[]');
            counter.textContent = affiliateList.length;
        }
    }

    // Visa KSP-sektion
    show() {
        const section = document.getElementById('ksp-section');
        if (section) {
            section.style.display = 'block';
        }
    }

    // Dölj KSP-sektion
    hide() {
        const section = document.getElementById('ksp-section');
        if (section) {
            section.style.display = 'none';
        }
    }
}

// Initiera KSP-integration när DOM är redo
document.addEventListener('DOMContentLoaded', () => {
    window.kspIntegration = new KSPIntegration();
});

// Exportera för användning i admin.html
window.KSPIntegration = KSPIntegration;
