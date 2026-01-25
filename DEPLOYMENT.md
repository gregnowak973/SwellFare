# Deployment Guide

## Prerequisites

- GitHub repository connected
- Supabase project created
- API keys: Stormglass, Amadeus

## Deploy to Vercel

### 1. Import Project
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import `SwellFare` from GitHub
3. Click "Deploy" (Vercel auto-detects Next.js)

### 2. Environment Variables

**Navigate:** Vercel → Your Project → Settings → Environment Variables

**Add these 5 variables:**

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Value: Your Supabase project URL (e.g., `https://xxxxx.supabase.co`)
   - Get from: Supabase Dashboard → Settings → API → Project URL

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Value: Supabase anon public key (JWT token starting with `eyJ...`)
   - Get from: Supabase Dashboard → Settings → API → `anon` `public` key

3. **STORMGLASS_API_KEY**
   - Value: Your Stormglass API key
   - Get from: [stormglass.io](https://stormglass.io) → API Keys

4. **AMADEUS_CLIENT_ID**
   - Value: Your Amadeus Client ID
   - Get from: [developers.amadeus.com](https://developers.amadeus.com) → My Apps

5. **AMADEUS_CLIENT_SECRET**
   - Value: Your Amadeus Client Secret
   - Get from: Same as above

**Important:** 
- Use actual values, NOT `@secret` references
- Select all environments: ✅ Production ✅ Preview ✅ Development
- Click "Save" after each variable

### 3. Connect Domain (swellfare.ai)

**In Vercel:**
1. Settings → Domains → Add `swellfare.ai`
2. Add `www.swellfare.ai` (optional)
3. Copy DNS records shown

**In Cloudflare:**
1. DNS → Add records:
   - **Root domain:** A record pointing to Vercel IP (or CNAME if shown)
   - **www:** CNAME to `cname.vercel-dns.com`
2. Enable Proxy (orange cloud) ✅
3. SSL/TLS → Set to "Full" ✅
4. Enable "Always Use HTTPS" ✅

**Wait 5-10 minutes** for DNS propagation.

### 4. Database Setup

1. Go to Supabase Dashboard → SQL Editor
2. Run `supabase/migrations/001_initial_schema.sql`
3. Run `supabase/migrations/002_discovery_features.sql`
4. Verify tables are created

### 5. Redeploy

After adding environment variables:
- Deployments → "..." → Redeploy

## Post-Deployment Checklist

- [ ] Site loads at `swellfare.ai`
- [ ] HTTPS is working (green lock)
- [ ] Environment variables are set
- [ ] Database migrations are run
- [ ] Test all features
- [ ] Check browser console for errors

## Troubleshooting

**Build fails:** Check build logs in Vercel dashboard
**Environment variables not working:** Redeploy after adding variables
**Domain not working:** Wait 5-10 minutes for DNS propagation
**SSL errors:** Check Cloudflare SSL/TLS settings

## Next Steps

- Set up cron jobs for data fetching (optional)
- Configure email service for Strike Alerts (optional)
- Monitor usage and scale as needed
