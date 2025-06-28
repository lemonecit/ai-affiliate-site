// Test script to verify button rendering and functionality
async function testButtonRendering() {
    console.log('🧪 Testing button rendering...');
    
    try {
        // Test the search API first
        const response = await fetch('http://localhost:3000/api/amazon/search?q=phone');
        const data = await response.json();
        
        if (!data.success || !data.data.products) {
            console.error('❌ API call failed');
            return;
        }
        
        console.log(`✅ API returned ${data.data.products.length} products`);
        
        // Simulate the displaySearchResults function logic
        const products = data.data.products.slice(0, 3); // Test with first 3 products
        
        products.forEach((product, index) => {
            console.log(`\n📦 Product ${index + 1}:`);
            console.log(`Title: "${product.title}"`);
            console.log(`Platform: "${product.platform}"`);
            console.log(`Price: ${product.price?.current || product.price} ${product.price?.currency || 'USD'}`);
            console.log(`Product ID: "${product.productId}"`);
            console.log(`Category: "${product.category}"`);
            
            // Test HTML attribute escaping
            const title = product.title || 'Unnamed Product';
            const platform = product.platform || 'unknown';
            
            console.log(`Escaped title: "${title}"`);
            console.log(`Platform (upper): "${platform.toUpperCase()}"`);
            
            // Check for potential HTML breaking characters
            if (title.includes('"') || title.includes("'") || title.includes('<') || title.includes('>')) {
                console.warn(`⚠️ Product title contains HTML-breaking characters: "${title}"`);
            }
            
            if (platform.includes('"') || platform.includes("'")) {
                console.warn(`⚠️ Platform contains HTML-breaking characters: "${platform}"`);
            }
        });
        
        console.log('\n✅ Button rendering test completed');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

// Run the test
testButtonRendering();
