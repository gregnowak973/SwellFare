# Quick Reference: Environment Variables & Domain Setup

## 🎯 Environment Variables (5 minutes)

1. **Vercel** → Your Project → Settings → Environment Variables
2. Add these 5 variables (get values from respective dashboards):

```
NEXT_PUBLIC_SUPABASE_URL          → Supabase Dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_ANON_KEY     → Supabase Dashboard → Settings → API
STORMGLASS_API_KEY                → stormglass.io → API Keys
AMADEUS_CLIENT_ID                 → developers.amadeus.com → My Apps
AMADEUS_CLIENT_SECRET             → developers.amadeus.com → My Apps
```

3. Select **all environments** (Production, Preview, Development) ✅
4. **Redeploy** your project

📖 **Full Guide:** See `ENV_VARIABLES_GUIDE.md`

---

## 🌐 Domain Setup (10 minutes)

### In Vercel:
1. Settings → Domains → Add `swellfare.ai`
2. Add `www.swellfare.ai`
3. Copy DNS records shown

### In Cloudflare:
1. DNS → Add records (A or CNAME for root, CNAME for www)
2. Enable **Proxy** (orange cloud) ✅
3. SSL/TLS → Set to **"Full"** ✅
4. Enable **"Always Use HTTPS"** ✅

📖 **Full Guide:** See `DOMAIN_SETUP_GUIDE.md`

---

## ✅ Verification

- [ ] All 5 environment variables added
- [ ] Variables set for all environments
- [ ] Project redeployed
- [ ] Domain added in Vercel
- [ ] DNS records added in Cloudflare
- [ ] SSL/TLS set to "Full"
- [ ] Site loads at `https://swellfare.ai`

Done! 🎉

