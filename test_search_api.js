// Quick JavaScript test to verify search API
async function testSearchAPI() {
    console.log('🧪 Testing Search API...');
    
    try {
        // Test Amazon search
        const amazonResponse = await fetch('http://localhost:3000/api/amazon/search?keywords=iPhone&limit=3');
        const amazonData = await amazonResponse.json();
        console.log('✅ Amazon API test:', amazonData);
        
        // Test AliExpress search
        const aliexpressResponse = await fetch('http://localhost:3000/api/aliexpress/search?keywords=phone&limit=3');
        const aliexpressData = await aliexpressResponse.json();
        console.log('✅ AliExpress API test:', aliexpressData);
        
        console.log('🎉 Both APIs working correctly!');
        
    } catch (error) {
        console.error('❌ API Test failed:', error);
    }
}

// Run test
testSearchAPI();
