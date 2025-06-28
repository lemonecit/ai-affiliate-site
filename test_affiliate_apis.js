// Test script för Amazon och AliExpress API:er
// Kör: node test_affiliate_apis.js

const API_BASE = 'http://localhost:3000/api';

async function testRequest(endpoint, method = 'GET', data = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    console.log(`\n🧪 Testing ${method} ${endpoint}...`);
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const result = await response.json();
    
    console.log(`Status: ${response.status}`);
    console.log(`Success: ${result.success}`);
    
    if (result.success) {
      console.log(`✅ ${result.message || 'Success'}`);
      if (result.data?.products) {
        console.log(`📦 Found ${result.data.products.length} products`);
      }
    } else {
      console.log(`❌ Error: ${result.error}`);
    }
    
    return result;
  } catch (error) {
    console.error(`💥 Request failed: ${error.message}`);
    return null;
  }
}

async function testAmazonAPI() {
  console.log('\n🛒 Testing Amazon API...');
  
  // Test search
  await testRequest('/amazon/search?keywords=iphone&limit=3');
  
  // Test add by ASIN
  await testRequest('/amazon/search', 'POST', {
    asin: 'B08N5WRWNW',
    save: true
  });
}

async function testAliExpressAPI() {
  console.log('\n🛍️ Testing AliExpress API...');
  
  // Test search (will use mock data)
  await testRequest('/aliexpress/search?keywords=headphones&limit=3');
  
  // Test add by URL
  await testRequest('/aliexpress/search', 'POST', {
    productUrl: 'https://aliexpress.com/item/123456789.html',
    save: true
  });
}

async function testExistingAPIs() {
  console.log('\n📊 Testing existing APIs...');
  
  // Test products API
  await testRequest('/products?limit=5');
  
  // Test analytics
  await testRequest('/analytics');
}

async function runAllTests() {
  console.log('🚀 Starting Affiliate API Tests...');
  console.log('Make sure Next.js server is running on localhost:3000');
  
  try {
    await testExistingAPIs();
    await testAmazonAPI();
    await testAliExpressAPI();
    
    console.log('\n✅ All tests completed!');
    console.log('\nℹ️  Note: Amazon API might fail without valid credentials');
    console.log('ℹ️  AliExpress API uses mock data for development');
  } catch (error) {
    console.error('\n💥 Test suite failed:', error);
  }
}

// Run if called directly
if (typeof window === 'undefined') {
  runAllTests();
}
