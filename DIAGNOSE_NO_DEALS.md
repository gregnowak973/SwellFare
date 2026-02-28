# 🔍 Diagnosing "No Deals Found" Issue

## Quick Diagnostic Steps

### Step 1: Check API Configuration

Visit: `https://swellfare.ai/api/check-config`

This will show you:
- ✅ Which API keys are configured
- ✅ Which are missing
- ✅ Status of each service

**Expected Result:**
```json
{
  "apis": {
    "stormglass": { "configured": true },
    "amadeus": { "configured": true },
    "supabase": { "configured": true }
  },
  "allConfigured": true
}
```

### Step 2: Check Browser Console

1. Open your site: `https://swellfare.ai`
2. Press `F12` → Go to **Console** tab
3. Look for these logs:
   - `"API response:"` - Shows what the API returned
   - `"Using mock data"` - Means API failed
   - `"Setting real deals"` - Means API worked

### Step 3: Test APIs Directly

**Test Stormglass:**
```
https://swellfare.ai/api/test-apis
```

**Test Single Deal:**
```
https://swellfare.ai/api/test-deal?dest=0
```

---

## Common Issues & Fixes

### Issue 1: API Keys Not Configured

**Symptom:** Error message says "API keys not configured"

**Fix:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add these 3 variables:
   - `STORMGLASS_API_KEY`
   - `AMADEUS_CLIENT_ID`
   - `AMADEUS_CLIENT_SECRET`
3. **Redeploy** after adding (Deployments → "..." → Redeploy)

### Issue 2: APIs Configured But No Deals

**Symptom:** APIs work but return 0 deals

**Possible Causes:**
- **Filtering too strict:** Current swell conditions don't match barrel/log criteria
- **No flights found:** Amadeus has no flights for those routes/dates
- **API errors:** Check Vercel function logs

**Debug:**
- Check browser console for error details
- Visit `/api/test-deal` to see if single destination works
- Check Vercel function logs for API errors

### Issue 3: Timeout

**Symptom:** Request times out after 30 seconds

**Possible Causes:**
- APIs are slow (fetching 10 destinations takes time)
- Network issues
- API rate limits

**Fix:**
- Reduce number of destinations checked
- Check API quotas/limits
- Try again later

### Issue 4: API Errors

**Symptom:** Console shows API errors

**Check:**
- Vercel function logs (Dashboard → Functions → View logs)
- API key validity
- API quotas (free tiers have limits)

---

## What the Debug Info Shows

When you see "No deals found", check the error message. It now includes:

- `debug.stormglassConfigured` - Is Stormglass key set?
- `debug.amadeusConfigured` - Are Amadeus keys set?
- `debug.destinationsChecked` - How many destinations were checked
- `debug.dealsFound` - How many deals were found before filtering

---

## Next Steps

1. **Check `/api/check-config`** - Verify API keys
2. **Check browser console** - See detailed logs
3. **Test individual APIs** - Use `/api/test-apis` and `/api/test-deal`
4. **Check Vercel logs** - See server-side errors

The debugging will help identify exactly what's wrong! 🔍


