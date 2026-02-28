# 🧪 Testing Real-Time Data APIs

## Quick Test Endpoints

I've created two test endpoints to verify your API connections:

### 1. Test API Connections
**Endpoint:** `/api/test-apis`

Tests if your API keys are configured and working.

**Usage:**
```bash
# Visit in browser or use curl
https://swellfare.ai/api/test-apis
```

**What it tests:**
- ✅ Stormglass API connection (swell data)
- ✅ Amadeus API connection (flight prices)
- ✅ Returns sample data from each API

**Expected Response:**
```json
{
  "summary": {
    "allConfigured": true,
    "allWorking": true,
    "status": "✅ All APIs working"
  },
  "stormglass": {
    "configured": true,
    "tested": true,
    "success": true,
    "data": {
      "destination": "Malibu, California",
      "swell": {
        "height": 1.2,
        "period": 12,
        "windSpeed": 10,
        "windDirection": 270
      }
    }
  },
  "amadeus": {
    "configured": true,
    "tested": true,
    "success": true,
    "data": {
      "route": "LAX → SFO",
      "price": "250.00",
      "currency": "USD"
    }
  }
}
```

---

### 2. Test Single Deal
**Endpoint:** `/api/test-deal`

Tests fetching a complete deal (swell + flight + calculations) for one destination.

**Query Parameters:**
- `dest` - Destination index (0-19, default: 0)
- `origin` - Origin airport code (default: LAX)
- `desire` - Surf desire: 'barrel' or 'log' (default: barrel)

**Usage:**
```bash
# Test first destination (Malibu)
https://swellfare.ai/api/test-deal

# Test 5th destination (Nosara, Costa Rica)
https://swellfare.ai/api/test-deal?dest=3

# Test with different origin
https://swellfare.ai/api/test-deal?origin=JFK&desire=log
```

**What it tests:**
- ✅ Fetches swell data for destination
- ✅ Fetches flight price
- ✅ Calculates wind alignment
- ✅ Calculates Value Score
- ✅ Detects Prime Strike
- ✅ Returns complete deal object

**Expected Response:**
```json
{
  "success": true,
  "destination": "Malibu, California",
  "steps": {
    "swellFetch": { "completed": true, "data": {...} },
    "flightFetch": { "completed": true, "data": {...} },
    "calculations": { "completed": true, "data": {...} }
  },
  "finalDeal": {
    "destination": "Malibu, California",
    "price": 380,
    "swellHeight": 1.0,
    "swellPeriod": 11,
    "valueScore": 0.029,
    "primeStrike": false
  }
}
```

---

## How to Test

### Step 1: Test API Connections

1. Visit: `https://swellfare.ai/api/test-apis`
2. Check the response:
   - If `allConfigured: false` → Add API keys to Vercel
   - If `allWorking: false` → Check error messages
   - If `allWorking: true` → APIs are working! ✅

### Step 2: Test Single Deal

1. Visit: `https://swellfare.ai/api/test-deal`
2. Check each step:
   - `swellFetch.completed` → Stormglass working
   - `flightFetch.completed` → Amadeus working
   - `calculations.completed` → Calculations working
   - `finalDeal` → Complete deal object

### Step 3: Test Multiple Destinations

Try different destination indices:
- `?dest=0` - Malibu, California
- `?dest=3` - Nosara, Costa Rica
- `?dest=9` - Uluwatu, Bali
- `?dest=17` - Teahupo'o, Tahiti

---

## Troubleshooting

### "API keys not configured"
- Go to Vercel → Settings → Environment Variables
- Add: `STORMGLASS_API_KEY`, `AMADEUS_CLIENT_ID`, `AMADEUS_CLIENT_SECRET`
- Redeploy

### "No swell data returned"
- Check Stormglass API key is valid
- Check API quota (free tier: 50 requests/day)
- Wait a few minutes and try again

### "No flight data returned"
- Check Amadeus credentials are valid
- Check API quota (free tier: 2,000 requests/month)
- Try a different route (some routes may not have data)

### Timeout Errors
- API calls can take 10-30 seconds
- Check Vercel function timeout settings
- Try testing one destination at a time

---

## Expected Results

### ✅ Success Case
- Both APIs return data
- Calculations complete
- Deal object created
- Ready to use in production

### ⚠️ Partial Success
- One API works, one doesn't
- Check the failing API's error message
- Verify API keys and quotas

### ❌ Failure Case
- APIs not configured
- Invalid API keys
- API quota exceeded
- Network issues

---

## Next Steps

Once tests pass:
1. ✅ APIs are working
2. ✅ Visit main site - should load real data
3. ✅ Set up automatic data sync
4. ✅ Monitor API usage

Test your APIs now! 🚀


