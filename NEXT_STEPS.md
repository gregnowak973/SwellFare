# 🎉 Deployment Successful! Next Steps

## ✅ What's Done
- ✅ Code deployed to Vercel
- ✅ Build successful
- ✅ Application is live

---

## 🚀 Next Steps

### 1. **Add Environment Variables** (Required for API to work)

Go to your Vercel Dashboard → Your Project → Settings → Environment Variables

Add these 5 variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://anzlvwcgryygjaypdpty.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuemx2d2Nncnl5Z2pheXBkcHR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNTM4NDEsImV4cCI6MjA4NDkyOTg0MX0.Dm--toI3Qqld3Q3WNDXMrtrBEItD1_zhDTjNw97CMRU
AMADEUS_CLIENT_ID=your_amadeus_client_id
AMADEUS_CLIENT_SECRET=your_amadeus_client_secret
STORMGLASS_API_KEY=your_stormglass_api_key
```

**Important:** After adding variables, trigger a new deployment:
- Go to Deployments tab
- Click "..." on latest deployment → "Redeploy"

---

### 2. **Connect Your Domain** (swellfare.ai)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Click "Add Domain"
3. Enter: `swellfare.ai`
4. Follow DNS instructions:
   - Add a CNAME record pointing to Vercel
   - Or use Vercel's nameservers (if using Cloudflare)

**Cloudflare Setup:**
- Go to Cloudflare DNS settings
- Add CNAME: `@` → `cname.vercel-dns.com`
- Or add A record: `@` → Vercel's IP (they'll provide it)

---

### 3. **Set Up Supabase Database**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Open your project
3. Go to SQL Editor
4. Run the migration files in order:
   - Copy/paste contents of `supabase/migrations/001_initial_schema.sql`
   - Click "Run"
   - Then run `supabase/migrations/002_discovery_features.sql`

This creates:
- `destinations` table
- `swell_data` table
- `flight_fares` table
- `board_bag_fees` table
- `strike_alerts` table
- Views and functions for Value Score calculations

---

### 4. **Get API Keys** (Optional for MVP)

**Amadeus (Flight Data):**
- Sign up at [Amadeus for Developers](https://developers.amadeus.com/)
- Free tier: 2,000 API calls/month
- Get Client ID and Client Secret

**Stormglass (Swell Data):**
- Sign up at [Stormglass.io](https://stormglass.io/)
- Free tier: 50 requests/day
- Get API key

**Note:** For MVP testing, you can use mock data without these APIs.

---

### 5. **Test Your Application**

1. Visit your Vercel URL (e.g., `swellfare-xxx.vercel.app`)
2. Test features:
   - ✅ View Surf-Fare Feed
   - ✅ Toggle between "Barrel Hunter" and "Cruiser"
   - ✅ Use Board-Bag Calculator
   - ✅ Set up Strike Alerts (requires Supabase setup)

---

### 6. **Populate Initial Data** (Optional)

Add some test destinations to Supabase:
- Go to Table Editor → `destinations`
- Insert a few rows manually, or
- Use Supabase SQL Editor to insert test data

---

## 🎯 Priority Order

1. **Add Environment Variables** (Critical - API won't work without Supabase)
2. **Set Up Database** (Critical - Strike Alerts need tables)
3. **Connect Domain** (Nice to have - can do later)
4. **Get API Keys** (Optional - app works with mock data)

---

## 🐛 Troubleshooting

**If API routes return errors:**
- Check environment variables are set correctly
- Make sure you redeployed after adding env vars
- Check Supabase tables exist

**If domain doesn't work:**
- Wait 24-48 hours for DNS propagation
- Check Cloudflare DNS settings
- Verify CNAME/A records are correct

---

## 🎉 You're Live!

Your SwellFare MVP is deployed and ready! Time to catch some waves! 🏄‍♂️

