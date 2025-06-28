// API Integration för Admin Panel
// Lägg till denna JavaScript till admin.html för att integrera med Next.js API:er

class AffiliateAPI {
  constructor(baseUrl = 'http://localhost:3000/api') {
    this.baseUrl = baseUrl;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Products API
  async getProducts(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/products?${params}`);
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  }

  async updateProduct(id, productData) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE'
    });
  }

  // Click tracking
  async trackClick(clickData) {
    return this.request('/clicks', {
      method: 'POST',
      body: JSON.stringify(clickData)
    });
  }

  async getClickStats(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/clicks?${params}`);
  }

  // Analytics
  async getAnalytics(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/analytics?${params}`);
  }

  // AI Recommendations (när det fungerar)
  async getAIRecommendations(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/ai/recommendations?${params}`);
  }

  async generateAIAnalysis(productId) {
    return this.request('/ai/recommendations', {
      method: 'POST',
      body: JSON.stringify({ productId })
    });
  }
}

// Global API instans
const api = new AffiliateAPI();

// Uppdatera befintliga funktioner i admin.html
async function loadProductsFromAPI() {
  try {
    showLoadingState();
    const response = await api.getProducts({ limit: 50 });
    
    if (response.success) {
      displayAPIProducts(response.data.products);
      updatePaginationInfo(response.data.pagination);
    }
  } catch (error) {
    showError('Kunde inte ladda produkter från API: ' + error.message);
  } finally {
    hideLoadingState();
  }
}

function displayAPIProducts(products) {
  const container = document.getElementById('product-results');
  if (!container) return;

  container.innerHTML = products.map(product => `
    <div class="product-card api-product" data-id="${product._id}">
      <div class="product-header">
        <span class="platform-badge ${product.platform}">${product.platform.toUpperCase()}</span>
        <span class="price">${product.price.current} ${product.price.currency}</span>
      </div>
      <div class="product-image">
        <img src="${product.image}" alt="${product.title}" onerror="this.src='data:image/svg+xml,<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"200\\" height=\\"150\\"><rect width=\\"100%\\" height=\\"100%\\" fill=\\"#f0f0f0\\"/><text x=\\"50%\\" y=\\"50%\\" text-anchor=\\"middle\\" dy=\\".3em\\" fill=\\"#999\\">Bild</text></svg>'">
      </div>
      <div class="product-info">
        <h4>${product.title}</h4>
        <p class="category">${product.category}</p>
        ${product.rating ? `<div class="rating">★ ${product.rating} (${product.reviewCount || 0})</div>` : ''}
      </div>
      <div class="product-actions">
        <button onclick="editAPIProduct('${product._id}')" class="btn-edit">✏️ Redigera</button>
        <button onclick="deleteAPIProduct('${product._id}')" class="btn-delete">🗑️ Ta bort</button>
        <button onclick="viewAPIProduct('${product.url}')" class="btn-view">👁️ Visa</button>
        <button onclick="generateAIAnalysisForProduct('${product._id}')" class="btn-ai">🤖 AI Analys</button>
      </div>
    </div>
  `).join('');
}

async function addProductToAPI() {
  const form = document.getElementById('affiliate-form');
  if (!form) return;

  const formData = new FormData(form);
  const productData = {
    platform: formData.get('platform'),
    productId: formData.get('productId') || Date.now().toString(),
    title: formData.get('title'),
    description: formData.get('description'),
    price: {
      current: parseFloat(formData.get('price')),
      currency: formData.get('currency') || 'SEK'
    },
    image: formData.get('image'),
    url: formData.get('url'),
    affiliateUrl: formData.get('affiliateUrl'),
    category: formData.get('category'),
    brand: formData.get('brand')
  };

  try {
    showLoadingState();
    const response = await api.createProduct(productData);
    
    if (response.success) {
      showSuccess('Produkt tillagd i databasen!');
      form.reset();
      loadProductsFromAPI(); // Ladda om produktlistan
    }
  } catch (error) {
    showError('Kunde inte lägga till produkt: ' + error.message);
  } finally {
    hideLoadingState();
  }
}

async function generateAIAnalysisForProduct(productId) {
  try {
    showAILoading(productId);
    const response = await api.generateAIAnalysis(productId);
    
    if (response.success) {
      displayAIResults(response.data);
    }
  } catch (error) {
    showError('AI-analys misslyckades: ' + error.message);
  }
}

async function loadAnalyticsDashboard() {
  try {
    const response = await api.getAnalytics();
    
    if (response.success) {
      updateAnalyticsDashboard(response.data);
    }
  } catch (error) {
    console.error('Analytics loading failed:', error);
  }
}

// Hjälpfunktioner
function showLoadingState() {
  const btn = document.querySelector('.loading-btn');
  if (btn) btn.classList.add('loading');
}

function hideLoadingState() {
  const btn = document.querySelector('.loading-btn');
  if (btn) btn.classList.remove('loading');
}

function showSuccess(message) {
  // Implementera success notification
  console.log('Success:', message);
}

function showError(message) {
  // Implementera error notification
  console.error('Error:', message);
}

// Lägg till event listeners när DOM är redo
document.addEventListener('DOMContentLoaded', function() {
  // Ersätt "Lägg till produkt" knappen med API-version
  const addButton = document.querySelector('button[onclick="addAffiliateProduct()"]');
  if (addButton) {
    addButton.onclick = addProductToAPI;
  }
  
  // Ladda produkter från API vid start
  loadProductsFromAPI();
  
  // Ladda analytics
  loadAnalyticsDashboard();
});

console.log('🚀 Affiliate API Integration loaded!');
