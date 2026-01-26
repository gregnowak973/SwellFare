# 🧪 Quick Test Commands

## Test Your APIs Right Now

After Vercel deploys (usually 1-2 minutes), test these endpoints:

### 1. Test API Connections
```bash
curl https://swellfare.ai/api/test-apis
```

Or visit in browser:
```
https://swellfare.ai/api/test-apis
```

### 2. Test Single Deal
```bash
curl https://swellfare.ai/api/test-deal
```

Or visit in browser:
```
https://swellfare.ai/api/test-deal
```

### 3. Test Different Destinations
```bash
# Test Nosara, Costa Rica (index 3)
curl "https://swellfare.ai/api/test-deal?dest=3"

# Test with different origin
curl "https://swellfare.ai/api/test-deal?origin=JFK&desire=log"
```

## What to Look For

### ✅ Success Response
- `"allWorking": true` - APIs are working!
- `"success": true` - Deal fetched successfully
- Real data in response (swell heights, flight prices)

### ❌ Error Response
- `"allConfigured": false` - Need to add API keys
- `"error": "..."` - Check error message
- `"success": false` - Something failed

## Next Steps

1. Wait for Vercel deployment (check dashboard)
2. Test the endpoints above
3. Check the responses
4. If APIs work, your main site will show real data!

