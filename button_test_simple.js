// Simple test to check if search buttons work properly
const testSearchAPI = async () => {
    try {
        console.log('🔍 Testing search API...');
        
        const response = await fetch('http://localhost:3000/api/amazon/search?q=echo');
        const data = await response.json();
        
        console.log('API Response:', data);
        
        if (data.success && data.data.products) {
            console.log(`✅ Found ${data.data.products.length} products`);
            
            // Test first product data structure
            const firstProduct = data.data.products[0];
            console.log('First product structure:', {
                title: firstProduct.title,
                price: firstProduct.price,
                platform: firstProduct.platform,
                productId: firstProduct.productId,
                url: firstProduct.url,
                image: typeof firstProduct.image
            });
            
            return data.data.products;
        } else {
            console.error('❌ API call failed:', data);
            return [];
        }
    } catch (error) {
        console.error('❌ Error testing API:', error);
        return [];
    }
};

// Run the test
testSearchAPI().then(products => {
    console.log('🎯 Test completed with', products.length, 'products');
});
