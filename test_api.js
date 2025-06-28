// API Test Script - Testa och populera databasen
// Kör med: node test_api.js

import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001/api';

// Test data för produkter
const testProducts = [
  {
    platform: 'amazon',
    productId: 'B08N5WRWNW',
    title: 'Apple iPhone 14 Pro 128GB',
    description: 'Latest iPhone with A16 Bionic chip',
    price: { current: 12990, currency: 'SEK' },
    image: 'https://example.com/iphone14.jpg',
    url: 'https://amazon.com/dp/B08N5WRWNW',
    affiliateUrl: 'https://amazon.com/dp/B08N5WRWNW?tag=affiliate-tag',
    category: 'Elektronik',
    brand: 'Apple',
    rating: 4.5,
    reviewCount: 2847
  },
  {
    platform: 'aliexpress',
    productId: 'AE001',
    title: 'Wireless Bluetooth Earbuds',
    description: 'High quality wireless earbuds with noise cancellation',
    price: { current: 299, currency: 'SEK' },
    image: 'https://example.com/earbuds.jpg',
    url: 'https://aliexpress.com/item/AE001',
    affiliateUrl: 'https://aliexpress.com/item/AE001?aff_platform=affiliate',
    category: 'Elektronik',
    brand: 'NoName',
    rating: 4.2,
    reviewCount: 1234
  },
  {
    platform: 'ksp',
    productId: 'KSP123',
    title: 'Samsung Galaxy S24 Ultra',
    description: 'Premium Samsung smartphone with S Pen',
    price: { current: 4999, currency: 'ILS' },
    image: 'https://example.com/galaxy.jpg',
    url: 'https://ksp.co.il/web/item/KSP123',
    affiliateUrl: 'https://ksp.co.il/web/item/KSP123?ref=affiliate',
    category: 'Elektronik',
    brand: 'Samsung',
    rating: 4.7,
    reviewCount: 567
  }
];

// Hjälpfunktion för HTTP requests
async function makeRequest(endpoint, method = 'GET', data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const result = await response.json();
    
    console.log(`${method} ${endpoint}:`, response.status);
    console.log('Response:', JSON.stringify(result, null, 2));
    
    return { success: response.ok, data: result, status: response.status };
  } catch (error) {
    console.error(`Error with ${method} ${endpoint}:`, error.message);
    return { success: false, error: error.message };
  }
}

// Test funktioner
async function testProductsAPI() {
  console.log('\n🧪 Testing Products API...\n');
  
  // 1. Test GET /api/products (tom databas)
  await makeRequest('/products');
  
  // 2. Test POST /api/products (lägg till testprodukter)
  console.log('\n📦 Adding test products...\n');
  const createdProducts = [];
  
  for (const product of testProducts) {
    const result = await makeRequest('/products', 'POST', product);
    if (result.success) {
      createdProducts.push(result.data.data);
    }
  }
  
  // 3. Test GET /api/products (nu med data)
  console.log('\n📋 Fetching all products...\n');
  await makeRequest('/products');
  
  // 4. Test GET /api/products med filter
  console.log('\n🔍 Testing filters...\n');
  await makeRequest('/products?platform=amazon');
  await makeRequest('/products?category=Elektronik');
  await makeRequest('/products?minPrice=1000&maxPrice=5000');
  
  // 5. Test GET /api/products/[id]
  if (createdProducts.length > 0) {
    console.log('\n🎯 Testing single product fetch...\n');
    await makeRequest(`/products/${createdProducts[0]._id}`);
  }
  
  return createdProducts;
}

async function testClicksAPI() {
  console.log('\n🖱️ Testing Clicks API...\n');
  
  // Test click tracking
  const clickData = {
    productId: '507f1f77bcf86cd799439011', // Dummy ObjectId
    platform: 'amazon',
    sessionId: 'session_123',
    referrer: 'https://google.com'
  };
  
  await makeRequest('/clicks', 'POST', clickData);
  
  // Test getting clicks
  await makeRequest('/clicks');
}

async function testAnalyticsAPI() {
  console.log('\n📊 Testing Analytics API...\n');
  
  await makeRequest('/analytics');
  await makeRequest('/analytics?platform=amazon');
}

async function testAIAPI() {
  console.log('\n🤖 Testing AI Recommendations API...\n');
  
  // Test AI recommendations
  await makeRequest('/ai/recommendations');
  await makeRequest('/ai/recommendations?category=Elektronik&limit=5');
}

// Huvudfunktion
async function runTests() {
  console.log('🚀 Starting API Tests...\n');
  console.log('Make sure Next.js server is running on http://localhost:3001\n');
  
  try {
    // Test all endpoints
    const products = await testProductsAPI();
    await testClicksAPI();
    await testAnalyticsAPI();
    await testAIAPI();
    
    console.log('\n✅ All API tests completed!');
    console.log('\n📝 Summary:');
    console.log(`- Created ${products.length} test products`);
    console.log('- All main endpoints tested');
    console.log('- Check MongoDB Atlas for data');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error);
  }
}

// Kör tester om scriptet körs direkt
runTests();
