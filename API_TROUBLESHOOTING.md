# API Error Troubleshooting Guide

## Problem: "Unexpected token '<', '<!DOCTYPE'... is not valid JSON"

### Root Cause
This error occurs when the JavaScript code expects JSON but receives HTML instead. This typically happens when:

1. **Next.js server has crashed** - The server returns HTML error pages instead of API responses
2. **Wrong URL/endpoint** - Requesting a non-existent API endpoint that returns 404 HTML
3. **Server not running** - The request falls back to static HTML files

### Additional Issue: Corrupted Product Cards
If you see malformed HTML in product search results like:
```
iphone - Apple Product 2AMAZON'" loading="lazy" style="max-height: 120px; object-fit: cover;">
```

This indicates HTML injection due to improper escaping of special characters in product data, especially in image URLs containing SVG data URIs.

### Quick Fix Steps

#### 1. Check Server Status
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000

# If no process is listening on port 3000, the server is not running
```

#### 2. Restart Next.js Server
```bash
# Kill any existing processes (if needed)
taskkill /F /PID [PID_NUMBER]

# Clean build cache
Remove-Item -Recurse -Force .next

# Start fresh server
npm run dev
```

#### 3. Test API Endpoints
```bash
# Test products endpoint
curl -H "Accept: application/json" http://localhost:3000/api/products

# Test search endpoint
curl -H "Accept: application/json" "http://localhost:3000/api/amazon/search?keywords=test"
```

### Expected Responses

#### ✅ Correct JSON Response:
```json
{
  "success": true,
  "data": {
    "products": [...]
  }
}
```

#### ❌ HTML Error Response:
```html
<!DOCTYPE html>
<html>
<head>
...
```

### Prevention Tips

1. **Use VS Code Tasks**: Use the configured "Start Dev Server" task instead of manual commands
2. **Monitor Console**: Watch the terminal for Next.js errors
3. **Environment Check**: Ensure `.env.local` file exists with proper MongoDB connection
4. **Port Conflicts**: Make sure no other services are using port 3000
5. **Product Card Fixes**: Recent updates fixed HTML injection in search results by:
   - Using data attributes instead of inline onclick handlers
   - Proper URL handling for SVG data URIs
   - Event listener delegation for dynamic content

### Common Next.js Errors

#### Module Resolution Error:
```
Cannot find module 'F:\ai-affiliate-site\.next\server\pages\_document.js'
```
**Solution**: This indicates the server is running in Pages Router mode for an App Router project. Clean restart fixes this.

#### Database Connection Error:
```
MongoServerError: Authentication failed
```  
**Solution**: Check MongoDB connection string in `.env.local`

### API Integration Status

When the admin panel loads, it should show:
- ✅ Server online (green status)
- 🔌 API Integration: Aktiverad

If you see:
- ❌ Server offline (red status)
- API connection errors

Follow the restart procedure above.

### Files to Check

1. **`.env.local`** - Database connection string
2. **`package.json`** - Ensure Next.js is properly configured
3. **`src/app/api/`** - API route files exist
4. **Console logs** - Check browser developer tools for detailed errors

### Emergency Fallback

If API continues to fail, the admin panel can still function with:
- Mock data for product display
- Static product management
- Local form submissions

The search functionality will show "Using mock data" message when API is unavailable.
