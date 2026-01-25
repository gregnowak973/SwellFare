# Vercel Deployment Guide for SwellFare

## Quick Deploy Steps

### 1. Push to GitHub First
```bash
# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/SwellFare.git
git push -u origin main
```

### 2. Deploy to Vercel

#### Option A: Via Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"Add New..."** → **"Project"**
4. Import your `SwellFare` repository
5. Vercel will auto-detect Next.js settings ✅

#### Option B: Via Vercel CLI
```bash
npm i -g vercel
vercel login
vercel
```

### 3. Configure Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables, add:

| Variable | Description | Where to Get It |
|----------|-------------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key | Supabase Dashboard → Settings → API |
| `STORMGLASS_API_KEY` | Stormglass API key | [stormglass.io](https://stormglass.io) → API Keys |
| `AMADEUS_CLIENT_ID` | Amadeus Client ID | [developers.amadeus.com](https://developers.amadeus.com) → My Self-Service → Apps |
| `AMADEUS_CLIENT_SECRET` | Amadeus Client Secret | Same as above |

**Important:** 
- Add these for **Production**, **Preview**, and **Development** environments
- `NEXT_PUBLIC_*` variables are exposed to the browser
- Other variables are server-side only

### 4. Connect Domain (swellfare.ai)

1. In Vercel Dashboard → Your Project → Settings → Domains
2. Click **"Add Domain"**
3. Enter `swellfare.ai`
4. Enter `www.swellfare.ai` (optional but recommended)
5. Vercel will show DNS records to add in Cloudflare

### 5. Cloudflare DNS Configuration

Add these records in Cloudflare:

**For swellfare.ai (root domain):**
- **Type:** A
- **Name:** @
- **Content:** Vercel's IP (shown in Vercel dashboard)
- **Proxy:** ✅ Enabled (orange cloud)

**For www.swellfare.ai:**
- **Type:** CNAME
- **Name:** www
- **Content:** `cname.vercel-dns.com`
- **Proxy:** ✅ Enabled

**SSL/TLS Settings:**
- Go to Cloudflare → SSL/TLS
- Set encryption mode to **"Full"** or **"Full (strict)"**
- Enable **"Always Use HTTPS"**

### 6. Verify Deployment

After deployment completes:
```bash
# Check your site
curl https://swellfare.ai

# Or visit in browser
open https://swellfare.ai
```

## Vercel Features You'll Get

✅ **Automatic Deployments** - Every push to main deploys automatically
✅ **Preview Deployments** - Every PR gets a preview URL
✅ **Edge Network** - Fast global CDN
✅ **SSL Certificates** - Automatic HTTPS
✅ **Analytics** - Built-in web analytics (optional)
✅ **Cron Jobs** - For scheduled data fetching (Vercel Pro)

## Post-Deployment Checklist

- [ ] Site loads at `swellfare.ai`
- [ ] HTTPS is working (green lock)
- [ ] Environment variables are set
- [ ] Database migrations are run in Supabase
- [ ] Test all features (Dashboard, Board Calculator, Strike Alerts)
- [ ] Check browser console for errors
- [ ] Test on mobile devices

## Setting Up Cron Jobs (Optional)

For automated data fetching, create `vercel.json` cron config:

```json
{
  "crons": [{
    "path": "/api/cron/fetch-swell-data",
    "schedule": "0 */6 * * *"
  }]
}
```

Or use Vercel Pro's cron jobs feature.

## Troubleshooting

**Build Fails:**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Check for TypeScript errors

**Environment Variables Not Working:**
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)
- Ensure `NEXT_PUBLIC_*` prefix for client-side vars

**Domain Not Working:**
- Wait 5-10 minutes for DNS propagation
- Check DNS records match Vercel's instructions
- Verify SSL/TLS settings in Cloudflare

## Need Help?

- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Vercel Discord: [vercel.com/discord](https://vercel.com/discord)

Your site will be live in minutes! 🚀

