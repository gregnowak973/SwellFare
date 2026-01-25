# Vercel Quick Start

## Option 1: Deploy via Dashboard (Easiest) ⭐

1. **Push to GitHub first:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/SwellFare.git
   git push -u origin main
   ```

2. **Go to Vercel:**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Sign in with GitHub
   - Click "Import Project"
   - Select your `SwellFare` repository
   - Click "Deploy" (Vercel auto-detects Next.js)

3. **Add Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add all 5 variables (see VERCEL_DEPLOY.md)
   - Redeploy

4. **Connect Domain:**
   - Settings → Domains → Add `swellfare.ai`
   - Follow DNS instructions for Cloudflare

## Option 2: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Production deploy
vercel --prod
```

## Environment Variables Needed

Add these in Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
STORMGLASS_API_KEY=your_stormglass_key
AMADEUS_CLIENT_ID=your_amadeus_id
AMADEUS_CLIENT_SECRET=your_amadeus_secret
```

## That's It!

Your site will be live in ~2 minutes! 🎉

See `VERCEL_DEPLOY.md` for detailed instructions.

