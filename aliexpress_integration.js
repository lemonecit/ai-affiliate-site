// AliExpress Integration för Admin Panel
// Hanterar AliExpress produkter i admin-gränssnittet

class AliExpressManager {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.setupEventListeners();
        this.renderProducts();
        this.updateStats();
    }

    async loadProducts() {
        try {
            const response = await fetch('aliexpress_products.json');
            this.products = await response.json();
            this.filteredProducts = [...this.products];
            console.log(`✅ Laddat ${this.products.length} AliExpress produkter`);
        } catch (error) {
            console.error('Fel vid laddning av AliExpress produkter:', error);
            this.products = [];
            this.filteredProducts = [];
        }
    }

    setupEventListeners() {
        // Sök-funktionalitet
        const searchInput = document.getElementById('aliexpress-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchProducts(e.target.value);
            });
        }

        // Kategori-filter
        const categoryFilter = document.getElementById('aliexpress-category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filterByCategory(e.target.value);
            });
        }

        // Pris-sortering
        const priceSort = document.getElementById('aliexpress-price-sort');
        if (priceSort) {
            priceSort.addEventListener('change', (e) => {
                this.sortByPrice(e.target.value);
            });
        }

        // Uppdatera produkter-knapp
        const updateBtn = document.getElementById('update-aliexpress-products');
        if (updateBtn) {
            updateBtn.addEventListener('click', () => {
                this.updateProducts();
            });
        }
    }

    searchProducts(query) {
        if (!query.trim()) {
            this.filteredProducts = [...this.products];
        } else {
            const searchTerm = query.toLowerCase();
            this.filteredProducts = this.products.filter(product =>
                product.title.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm) ||
                product.store_name.toLowerCase().includes(searchTerm)
            );
        }
        this.currentPage = 1;
        this.renderProducts();
        this.updateStats();
    }

    filterByCategory(category) {
        if (category === 'all') {
            this.filteredProducts = [...this.products];
        } else {
            this.filteredProducts = this.products.filter(product =>
                product.category.toLowerCase() === category.toLowerCase()
            );
        }
        this.currentPage = 1;
        this.renderProducts();
        this.updateStats();
    }

    sortByPrice(sortType) {
        switch (sortType) {
            case 'low-high':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'high-low':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'discount':
                this.filteredProducts.sort((a, b) => {
                    const discountA = ((a.original_price - a.price) / a.original_price) * 100;
                    const discountB = ((b.original_price - b.price) / b.original_price) * 100;
                    return discountB - discountA;
                });
                break;
            case 'rating':
                this.filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            default:
                // Ingen sortering
                break;
        }
        this.renderProducts();
    }

    renderProducts() {
        const container = document.getElementById('aliexpress-products-grid');
        if (!container) return;

        // Paginering
        const start = (this.currentPage - 1) * this.productsPerPage;
        const end = start + this.productsPerPage;
        const productsToShow = this.filteredProducts.slice(start, end);

        if (productsToShow.length === 0) {
            container.innerHTML = `
                <div class="no-products">
                    <h3>Inga AliExpress produkter hittades</h3>
                    <p>Prova att ändra sökkriterier eller uppdatera produktlistan</p>
                </div>
            `;
            return;
        }

        container.innerHTML = productsToShow.map(product => this.createProductCard(product)).join('');
        this.renderPagination();
    }

    createProductCard(product) {
        const discountPercent = product.original_price > product.price 
            ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
            : 0;

        const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));

        return `
            <div class="product-card aliexpress-product" data-id="${product.id}">
                <div class="product-image-container">
                    <img src="${product.image_url}" alt="${product.title}" class="product-image">
                    <div class="product-badges">
                        <span class="platform-badge aliexpress">AliExpress</span>
                        ${discountPercent > 0 ? `<span class="discount-badge">-${discountPercent}%</span>` : ''}
                    </div>
                </div>
                
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    
                    <div class="product-pricing">
                        <span class="current-price">$${product.price}</span>
                        ${product.original_price > product.price ? 
                            `<span class="original-price">$${product.original_price}</span>` : ''}
                    </div>
                    
                    <div class="product-rating">
                        <span class="stars">${stars}</span>
                        <span class="rating-text">${product.rating} (${product.review_count.toLocaleString()})</span>
                    </div>
                    
                    <div class="product-meta">
                        <span class="category">${product.category}</span>
                        <span class="store">${product.store_name}</span>
                    </div>
                    
                    <div class="shipping-info">
                        <span class="shipping">${product.shipping}</span>
                    </div>
                </div>
                
                <div class="product-actions">
                    <button class="btn btn-primary" onclick="aliexpressManager.viewProduct('${product.id}')">
                        <i class="fas fa-eye"></i> Visa Detaljer
                    </button>
                    <button class="btn btn-success" onclick="aliexpressManager.addToSite('${product.id}')">
                        <i class="fas fa-plus"></i> Lägg till på sajt
                    </button>
                    <button class="btn btn-secondary" onclick="aliexpressManager.copyLink('${product.product_url}')">
                        <i class="fas fa-link"></i> Kopiera länk
                    </button>
                </div>
            </div>
        `;
    }

    renderPagination() {
        const paginationContainer = document.getElementById('aliexpress-pagination');
        if (!paginationContainer) return;

        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let paginationHTML = '<div class="pagination">';
        
        // Föregående sida
        if (this.currentPage > 1) {
            paginationHTML += `<button class="page-btn" onclick="aliexpressManager.goToPage(${this.currentPage - 1})">‹ Föregående</button>`;
        }
        
        // Sidnummer
        for (let i = Math.max(1, this.currentPage - 2); i <= Math.min(totalPages, this.currentPage + 2); i++) {
            paginationHTML += `<button class="page-btn ${i === this.currentPage ? 'active' : ''}" onclick="aliexpressManager.goToPage(${i})">${i}</button>`;
        }
        
        // Nästa sida
        if (this.currentPage < totalPages) {
            paginationHTML += `<button class="page-btn" onclick="aliexpressManager.goToPage(${this.currentPage + 1})">Nästa ›</button>`;
        }
        
        paginationHTML += '</div>';
        paginationContainer.innerHTML = paginationHTML;
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderProducts();
        
        // Scrolla till toppen av produktlistan
        const container = document.getElementById('aliexpress-products-grid');
        if (container) {
            container.scrollIntoView({ behavior: 'smooth' });
        }
    }

    updateStats() {
        // Uppdatera statistik i UI
        const totalProducts = document.getElementById('aliexpress-total-products');
        const avgPrice = document.getElementById('aliexpress-avg-price');
        const topCategory = document.getElementById('aliexpress-top-category');

        if (totalProducts) {
            totalProducts.textContent = this.filteredProducts.length;
        }

        if (avgPrice && this.filteredProducts.length > 0) {
            const average = this.filteredProducts.reduce((sum, p) => sum + p.price, 0) / this.filteredProducts.length;
            avgPrice.textContent = `$${average.toFixed(2)}`;
        }

        if (topCategory && this.filteredProducts.length > 0) {
            const categories = {};
            this.filteredProducts.forEach(p => {
                categories[p.category] = (categories[p.category] || 0) + 1;
            });
            const topCat = Object.keys(categories).reduce((a, b) => categories[a] > categories[b] ? a : b);
            topCategory.textContent = topCat;
        }
    }

    async updateProducts() {
        const updateBtn = document.getElementById('update-aliexpress-products');
        if (updateBtn) {
            updateBtn.disabled = true;
            updateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uppdaterar...';
        }

        try {
            // Simulera API-anrop (i verkligheten skulle detta trigga Python-scriptet)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Ladda om produkter
            await this.loadProducts();
            this.renderProducts();
            this.updateStats();
            
            this.showNotification('AliExpress produkter uppdaterade!', 'success');
        } catch (error) {
            console.error('Fel vid uppdatering:', error);
            this.showNotification('Fel vid uppdatering av produkter', 'error');
        } finally {
            if (updateBtn) {
                updateBtn.disabled = false;
                updateBtn.innerHTML = '<i class="fas fa-sync"></i> Uppdatera Produkter';
            }
        }
    }

    viewProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        // Öppna produktdetaljer i modal eller ny flik
        const modal = document.getElementById('product-modal');
        if (modal) {
            this.showProductModal(product);
        } else {
            // Öppna i ny flik
            window.open(product.product_url, '_blank');
        }
    }

    showProductModal(product) {
        const modal = document.getElementById('product-modal');
        const modalContent = modal.querySelector('.modal-content');
        
        const discountPercent = product.original_price > product.price 
            ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
            : 0;

        modalContent.innerHTML = `
            <div class="modal-header">
                <h2>${product.title}</h2>
                <span class="close" onclick="this.closest('.modal').style.display='none'">&times;</span>
            </div>
            <div class="modal-body">
                <div class="product-modal-content">
                    <img src="${product.image_url}" alt="${product.title}" class="modal-product-image">
                    <div class="modal-product-info">
                        <div class="price-info">
                            <span class="current-price">$${product.price}</span>
                            ${product.original_price > product.price ? 
                                `<span class="original-price">$${product.original_price}</span>
                                 <span class="discount">${discountPercent}% OFF</span>` : ''}
                        </div>
                        <div class="rating-info">
                            <span class="rating">${product.rating}/5 ⭐</span>
                            <span class="reviews">(${product.review_count.toLocaleString()} recensioner)</span>
                        </div>
                        <div class="meta-info">
                            <p><strong>Kategori:</strong> ${product.category}</p>
                            <p><strong>Butik:</strong> ${product.store_name}</p>
                            <p><strong>Frakt:</strong> ${product.shipping}</p>
                        </div>
                        <div class="modal-actions">
                            <a href="${product.product_url}" target="_blank" class="btn btn-primary">
                                <i class="fas fa-external-link-alt"></i> Visa på AliExpress
                            </a>
                            <button class="btn btn-success" onclick="aliexpressManager.addToSite('${product.id}')">
                                <i class="fas fa-plus"></i> Lägg till på sajt
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
    }

    addToSite(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        // Lägg till produkt i huvudsajten (simulerat)
        this.showNotification(`"${product.title}" tillagd på sajten!`, 'success');
        
        // Här skulle du spara produkten till din databas eller lokal storage
        console.log('Produkt tillagd:', product);
    }

    copyLink(url) {
        navigator.clipboard.writeText(url).then(() => {
            this.showNotification('Länk kopierad!', 'success');
        }).catch(() => {
            this.showNotification('Kunde inte kopiera länk', 'error');
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}-circle"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove efter 3 sekunder
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Hämta kategorier för filter
    getCategories() {
        const categories = [...new Set(this.products.map(p => p.category))];
        return categories.sort();
    }

    // Exportera produktdata
    exportProducts() {
        const dataStr = JSON.stringify(this.filteredProducts, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'aliexpress_products_export.json';
        link.click();
        
        this.showNotification('Produkter exporterade!', 'success');
    }
}

// Globala funktioner för enkel åtkomst
let aliexpressManager;

// Initiera när DOM är redo
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('aliexpress-products-grid')) {
        aliexpressManager = new AliExpressManager();
    }
});

// Exportera för användning i andra scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AliExpressManager;
}
