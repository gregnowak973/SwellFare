# SwellFare Deployment Roadmap

## Phase 1: GitHub Setup & Code Push

### 1. Create GitHub Repository
1. Go to [github.com](https://github.com) and create a new repository named `SwellFare`
2. **Don't** initialize with README (we already have one)
3. Copy the repository URL

### 2. Connect Local Repo to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/SwellFare.git
git branch -M main
git push -u origin main
```

## Phase 2: Deploy to Vercel (Recommended for Next.js)

### 1. Deploy via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project"
3. Import your `SwellFare` repository
4. Vercel will auto-detect Next.js settings

### 2. Configure Environment Variables in Vercel
Add these in Vercel project settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
STORMGLASS_API_KEY=your_stormglass_api_key
AMADEUS_CLIENT_ID=your_amadeus_client_id
AMADEUS_CLIENT_SECRET=your_amadeus_secret
```

### 3. Connect Domain (swellfare.ai)
1. In Vercel project settings → Domains
2. Add `swellfare.ai` and `www.swellfare.ai`
3. Vercel will provide DNS records to add in Cloudflare

## Phase 3: Cloudflare Domain Configuration

### 1. Update DNS Records in Cloudflare
Add these DNS records in Cloudflare dashboard:

**Type A Record:**
- Name: `@` (or `swellfare.ai`)
- Content: Vercel's IP (Vercel will provide this)
- Proxy: Enabled (orange cloud)

**Type CNAME Record:**
- Name: `www`
- Content: `cname.vercel-dns.com`
- Proxy: Enabled

**Note:** Vercel will provide exact DNS values after you add the domain

### 2. SSL/TLS Settings
- Set SSL/TLS encryption mode to **Full** or **Full (strict)**
- Enable **Always Use HTTPS**

## Phase 4: Database Setup

### 1. Set Up Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy Project URL and anon key

### 2. Run Migrations
1. Go to Supabase SQL Editor
2. Run `supabase/migrations/001_initial_schema.sql`
3. Run `supabase/migrations/002_discovery_features.sql`

### 3. Seed Initial Data (Optional)
- Insert Golden 20 destinations
- Verify board_bag_fees are populated

## Phase 5: API Keys Setup

### 1. Stormglass API
1. Sign up at [stormglass.io](https://stormglass.io)
2. Get your API key
3. Add to Vercel environment variables

### 2. Amadeus API
1. Sign up at [developers.amadeus.com](https://developers.amadeus.com)
2. Create a new app
3. Get Client ID and Secret
4. Add to Vercel environment variables

## Phase 6: Production Checklist

### Immediate
- [ ] Push code to GitHub
- [ ] Deploy to Vercel
- [ ] Configure domain in Cloudflare
- [ ] Set up environment variables
- [ ] Run database migrations
- [ ] Test live site

### Post-Launch
- [ ] Set up cron jobs for data fetching (Vercel Cron or external service)
- [ ] Configure email service for Strike Alerts (Resend, SendGrid)
- [ ] Set up error monitoring (Sentry)
- [ ] Add analytics (Vercel Analytics or Google Analytics)
- [ ] Test all features on production
- [ ] Set up backup strategy for database

## Phase 7: Data Population

### Set Up Automated Data Fetching
Create API routes or cron jobs to:
1. Fetch swell data from Stormglass daily
2. Fetch flight prices from Amadeus (multiple times per day)
3. Update `swell_data` and `flight_fares` tables
4. Check `strike_alerts` and send notifications

## Quick Start Commands

```bash
# Push to GitHub (after creating repo)
git remote add origin https://github.com/YOUR_USERNAME/SwellFare.git
git push -u origin main

# After Vercel deployment, verify
curl https://swellfare.ai
```

## Recommended Services

- **Hosting**: Vercel (free tier, perfect for Next.js)
- **Database**: Supabase (free tier, PostgreSQL)
- **Email**: Resend (developer-friendly) or SendGrid
- **Monitoring**: Sentry (error tracking)
- **Analytics**: Vercel Analytics (built-in)

## Next Immediate Steps

1. **Create GitHub repo** and push code
2. **Deploy to Vercel** (takes 2 minutes)
3. **Configure domain** in Cloudflare
4. **Set up Supabase** and run migrations
5. **Add API keys** to Vercel
6. **Test the live site**

Your domain `swellfare.ai` is ready - let's get it live! 🚀

