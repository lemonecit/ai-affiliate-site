# API Test Script för PowerShell
# Kör med: .\test_api.ps1

$API_BASE = "http://localhost:3000/api"

# Test GET /api/products
Write-Host "🧪 Testing GET /api/products..." -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "$API_BASE/products" -Method GET -ContentType "application/json"
    Write-Host "✅ GET /api/products successful" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 3)
} catch {
    Write-Host "❌ GET /api/products failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n" -NoNewline

# Test POST /api/products
Write-Host "📦 Testing POST /api/products..." -ForegroundColor Green

$productData = @{
    platform = "amazon"
    productId = "B08N5WRWNW"
    title = "Apple iPhone 14 Pro 128GB"
    description = "Latest iPhone with A16 Bionic chip"
    price = @{
        current = 12990
        currency = "SEK"
    }
    image = "https://example.com/iphone14.jpg"
    url = "https://amazon.com/dp/B08N5WRWNW"
    affiliateUrl = "https://amazon.com/dp/B08N5WRWNW?tag=affiliate-tag"
    category = "Elektronik"
    brand = "Apple"
    rating = 4.5
    reviewCount = 2847
}

try {
    $jsonBody = $productData | ConvertTo-Json -Depth 3
    $response = Invoke-RestMethod -Uri "$API_BASE/products" -Method POST -Body $jsonBody -ContentType "application/json"
    Write-Host "✅ POST /api/products successful" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 3)
    $productId = $response.data._id
} catch {
    Write-Host "❌ POST /api/products failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response)" -ForegroundColor Red
}

Write-Host "`n" -NoNewline

# Test GET /api/products igen (nu med data)
Write-Host "📋 Testing GET /api/products (with data)..." -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "$API_BASE/products" -Method GET -ContentType "application/json"
    Write-Host "✅ GET /api/products successful" -ForegroundColor Green
    Write-Host "Products found: $($response.data.products.Count)"
} catch {
    Write-Host "❌ GET /api/products failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n" -NoNewline

# Test GET /api/analytics
Write-Host "📊 Testing GET /api/analytics..." -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "$API_BASE/analytics" -Method GET -ContentType "application/json"
    Write-Host "✅ GET /api/analytics successful" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 2)
} catch {
    Write-Host "❌ GET /api/analytics failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n" -NoNewline

# Test GET /api/ai/recommendations
Write-Host "🤖 Testing GET /api/ai/recommendations..." -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "$API_BASE/ai/recommendations" -Method GET -ContentType "application/json"
    Write-Host "✅ GET /api/ai/recommendations successful" -ForegroundColor Green
    Write-Host "Recommendations found: $($response.data.recommendedProducts.Count)"
} catch {
    Write-Host "❌ GET /api/ai/recommendations failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 API tests completed!" -ForegroundColor Cyan
