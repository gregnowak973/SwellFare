# Quick Deployment Guide

## Step 1: Push to GitHub

```bash
# Create a new repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/SwellFare.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project" → Import `SwellFare`
4. Add environment variables (see below)
5. Deploy!

## Step 3: Connect Domain (swellfare.ai)

### In Vercel:
1. Project Settings → Domains
2. Add `swellfare.ai` and `www.swellfare.ai`
3. Copy DNS records provided

### In Cloudflare:
1. DNS → Add records (Vercel will provide exact values)
2. SSL/TLS → Set to "Full"
3. Enable "Always Use HTTPS"

## Environment Variables Needed

Add these in Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
STORMGLASS_API_KEY=
AMADEUS_CLIENT_ID=
AMADEUS_CLIENT_SECRET=
```

## Database Setup

1. Create Supabase project
2. Run migrations:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_discovery_features.sql`

## That's It!

Your site will be live at `swellfare.ai` in ~5 minutes! 🏄‍♂️

