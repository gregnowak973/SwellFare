# 🌊 Adding Real Data to SwellFare

## Overview

This guide explains how to add real data to your SwellFare app by connecting to live APIs and populating the database.

## Step 1: Seed Destinations to Database

First, populate your Supabase database with the "Golden 20" destinations.

### Option A: Using Supabase SQL Editor (Recommended)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Open your project → **SQL Editor**
3. Run this SQL to seed destinations:

```sql
-- Insert Golden 20 destinations
INSERT INTO destinations (name, airport_code, latitude, longitude, timezone, ideal_swell_direction)
VALUES
  ('Malibu, California', 'LAX', 34.0324, -118.6758, 'America/Los_Angeles', 270),
  ('Pipeline, Oahu', 'HNL', 21.6569, -158.0500, 'Pacific/Honolulu', 315),
  ('Trestles, California', 'SNA', 33.3847, -117.5892, 'America/Los_Angeles', 220),
  ('Nosara, Costa Rica', 'SJO', 9.9833, -85.6500, 'America/Costa_Rica', 225),
  ('Tamarindo, Costa Rica', 'LIR', 10.3000, -85.8333, 'America/Costa_Rica', 225),
  ('Playa Venao, Panama', 'PTY', 7.4500, -80.0167, 'America/Panama', 180),
  ('Arpoador, Rio de Janeiro', 'GIG', -22.9878, -43.1919, 'America/Sao_Paulo', 135),
  ('Chicama, Peru', 'TRU', -7.8333, -79.1500, 'America/Lima', 225),
  ('Mancora, Peru', 'PIU', -4.1000, -81.0500, 'America/Lima', 225),
  ('Nazaré, Portugal', 'LIS', 39.6011, -9.0714, 'Europe/Lisbon', 315),
  ('Ericeira, Portugal', 'LIS', 39.0167, -9.4167, 'Europe/Lisbon', 270),
  ('Hossegor, France', 'BIQ', 43.6500, -1.4000, 'Europe/Paris', 270),
  ('Uluwatu, Bali', 'DPS', -8.8292, 115.0850, 'Asia/Makassar', 225),
  ('Canggu, Bali', 'DPS', -8.6500, 115.1333, 'Asia/Makassar', 225),
  ('Raglan, New Zealand', 'AKL', -37.8000, 174.8833, 'Pacific/Auckland', 225),
  ('Byron Bay, Australia', 'BNE', -28.6474, 153.6020, 'Australia/Sydney', 135),
  ('Jeffreys Bay, South Africa', 'CPT', -34.0500, 24.9167, 'Africa/Johannesburg', 180),
  ('Teahupo''o, Tahiti', 'PPT', -17.8667, -149.2667, 'Pacific/Tahiti', 225),
  ('Cloudbreak, Fiji', 'NAN', -18.1667, 177.4500, 'Pacific/Fiji', 225)
ON CONFLICT (airport_code) DO NOTHING;
```

### Option B: Using the Seed Script

1. Create a script file `scripts/seed.ts`:

```typescript
import { seedDestinations } from '../lib/seedDestinations';

seedDestinations();
```

2. Run it (requires Node.js with environment variables set)

---

## Step 2: Add API Keys to Vercel

Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

Add these 3 variables:

```
STORMGLASS_API_KEY=your_stormglass_api_key
AMADEUS_CLIENT_ID=your_amadeus_client_id
AMADEUS_CLIENT_SECRET=your_amadeus_client_secret
```

**Important:** After adding, trigger a new deployment:
- Go to **Deployments** tab
- Click **"..."** on latest deployment → **"Redeploy"**

---

## Step 3: Get API Keys

### Stormglass (Swell Data)

1. Sign up at [stormglass.io](https://stormglass.io/)
2. Free tier: **50 requests/day**
3. Go to **API Keys** → Copy your key
4. Add to Vercel as `STORMGLASS_API_KEY`

### Amadeus (Flight Data)

1. Sign up at [developers.amadeus.com](https://developers.amadeus.com/)
2. Free tier: **2,000 API calls/month**
3. Create a new app → Get **Client ID** and **Client Secret**
4. Add to Vercel as `AMADEUS_CLIENT_ID` and `AMADEUS_CLIENT_SECRET`

**Note:** Amadeus has a test environment. Make sure to use the production URL in `lib/api/amadeus.ts` when ready.

---

## Step 4: Sync Swell Data

Once API keys are configured, you can sync swell data:

### Manual Sync

Call the API endpoint:
```bash
curl -X POST https://swellfare.ai/api/sync-swell-data
```

### Automatic Sync (Recommended)

Set up a cron job or scheduled function:

**Option A: Vercel Cron Jobs** (Pro plan)
- Add `vercel.json` cron configuration
- Runs automatically on schedule

**Option B: External Cron Service**
- Use [cron-job.org](https://cron-job.org/) or similar
- Call `/api/sync-swell-data` endpoint daily

**Option C: Supabase Edge Functions**
- Create a scheduled function in Supabase
- Calls the sync endpoint

---

## Step 5: Test Real Data

1. Visit your site: `https://swellfare.ai`
2. The Dashboard should now show:
   - ✅ Real-time swell data from Stormglass
   - ✅ Real flight prices from Amadeus
   - ✅ Calculated Value Scores
   - ✅ Prime Strike detection

3. If you see "API keys not configured" message:
   - Check environment variables in Vercel
   - Make sure you redeployed after adding keys
   - Verify API keys are correct

---

## How It Works

### Data Flow

1. **User visits site** → Dashboard component loads
2. **Dashboard calls** `/api/deals?desire=barrel&limit=10`
3. **API route fetches:**
   - Swell data from Stormglass (current conditions)
   - Flight prices from Amadeus (7 days from now)
4. **API calculates:**
   - Wind alignment
   - Value Score
   - Prime Strike status
5. **Returns deals** sorted by Value Score
6. **Dashboard displays** real-time deals

### Fallback Behavior

- If API keys not configured → Shows mock data with message
- If API fails → Falls back to mock data
- If no deals found → Shows mock data

---

## Troubleshooting

### "API keys not configured" message
- ✅ Check Vercel environment variables
- ✅ Redeploy after adding keys
- ✅ Verify variable names are correct

### No deals showing
- ✅ Check API keys are valid
- ✅ Verify destinations are seeded in database
- ✅ Check browser console for errors
- ✅ Check Vercel function logs

### Slow loading
- ✅ API calls can take 10-30 seconds (fetching 20 destinations)
- ✅ Consider caching results
- ✅ Consider reducing number of destinations checked

---

## Next Steps

1. ✅ Seed destinations
2. ✅ Add API keys
3. ✅ Test real data
4. ✅ Set up automatic data sync
5. ✅ Monitor API usage (free tiers have limits)

Your SwellFare app is now using real data! 🎉


