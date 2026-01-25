# Step-by-Step: Connecting swellfare.ai Domain to Vercel

## Prerequisites
- ✅ Your site is deployed on Vercel
- ✅ You own the domain `swellfare.ai` in Cloudflare
- ✅ You're logged into both Vercel and Cloudflare

---

## Part 1: Add Domain in Vercel

### Step 1: Navigate to Domain Settings

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click on your **SwellFare** project
3. Click on the **"Settings"** tab
4. In the left sidebar, click **"Domains"**

### Step 2: Add Root Domain (swellfare.ai)

1. In the Domains section, you'll see an input field
2. Type: `swellfare.ai`
3. Click **"Add"** button
4. Vercel will show you DNS configuration instructions
5. **Don't close this page** - you'll need the DNS records!

### Step 3: Add WWW Subdomain (Optional but Recommended)

1. In the same Domains section
2. Type: `www.swellfare.ai`
3. Click **"Add"** button
4. Vercel will automatically configure this as a CNAME

---

## Part 2: Configure DNS in Cloudflare

### Step 1: Log into Cloudflare

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Sign in to your account
3. Click on the domain **"swellfare.ai"**

### Step 2: Go to DNS Settings

1. In the left sidebar, click **"DNS"**
2. You'll see your current DNS records

### Step 3: Add Root Domain Record (swellfare.ai)

**Option A: If Vercel shows an A Record:**

1. Click **"Add record"** button
2. Configure:
   - **Type:** `A`
   - **Name:** `@` (or leave blank, represents root domain)
   - **IPv4 address:** Paste the IP address from Vercel (usually `76.76.21.21`)
   - **Proxy status:** ✅ **Proxied** (orange cloud ON)
3. Click **"Save"**

**Option B: If Vercel shows a CNAME Record:**

1. Click **"Add record"** button
2. Configure:
   - **Type:** `CNAME`
   - **Name:** `@`
   - **Target:** `cname.vercel-dns.com` (or what Vercel shows)
   - **Proxy status:** ✅ **Proxied** (orange cloud ON)
3. Click **"Save"**

**Note:** Cloudflare will warn about CNAME on root domain - this is OK, click "Continue" if prompted.

### Step 4: Add WWW Subdomain Record

1. Click **"Add record"** button again
2. Configure:
   - **Type:** `CNAME`
   - **Name:** `www`
   - **Target:** `cname.vercel-dns.com` (or what Vercel shows)
   - **Proxy status:** ✅ **Proxied** (orange cloud ON)
3. Click **"Save"**

---

## Part 3: Configure SSL/TLS in Cloudflare

### Step 1: Go to SSL/TLS Settings

1. In Cloudflare dashboard, click **"SSL/TLS"** in left sidebar
2. You'll see encryption mode options

### Step 2: Set Encryption Mode

1. Under **"SSL/TLS encryption mode"**
2. Select: **"Full"** or **"Full (strict)"** ✅
   - **Full** = Works with Vercel's SSL
   - **Full (strict)** = More secure (recommended if Vercel cert is valid)
3. The setting saves automatically

### Step 3: Enable Always Use HTTPS

1. Scroll down to **"Always Use HTTPS"**
2. Toggle it **ON** ✅
3. This redirects all HTTP traffic to HTTPS

---

## Part 4: Verify Domain Connection

### Step 1: Check Vercel Status

1. Go back to Vercel → Settings → Domains
2. You should see:
   - `swellfare.ai` - Status: **"Valid Configuration"** ✅
   - `www.swellfare.ai` - Status: **"Valid Configuration"** ✅

**Note:** It may take 5-10 minutes for DNS to propagate.

### Step 2: Test Your Domain

1. Open a new browser tab
2. Visit: `https://swellfare.ai`
3. You should see your SwellFare site!

### Step 3: Test WWW Subdomain

1. Visit: `https://www.swellfare.ai`
2. Should redirect or show the same site

---

## Troubleshooting

### Domain Shows "Invalid Configuration"

**Check DNS Records:**
- Make sure you added the correct records in Cloudflare
- Verify the IP address or CNAME target matches Vercel's instructions
- Ensure proxy is enabled (orange cloud)

**Wait for Propagation:**
- DNS changes can take up to 24 hours (usually 5-10 minutes)
- Use [whatsmydns.net](https://www.whatsmydns.net) to check propagation

### SSL Certificate Error

**Check SSL/TLS Settings:**
- Make sure SSL/TLS mode is set to "Full" or "Full (strict)"
- Vercel automatically provisions SSL certificates

**Wait for Certificate:**
- Vercel needs a few minutes to issue the SSL certificate
- Check Vercel dashboard → Domains for certificate status

### Site Not Loading

**Check DNS Propagation:**
```bash
# In terminal, check DNS:
dig swellfare.ai
nslookup swellfare.ai
```

**Clear Browser Cache:**
- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)

**Check Cloudflare Proxy:**
- Make sure the orange cloud is ON (proxied)
- If OFF (gray cloud), DNS won't work properly

---

## Quick Checklist

- [ ] Added `swellfare.ai` in Vercel Domains
- [ ] Added `www.swellfare.ai` in Vercel Domains
- [ ] Added A or CNAME record for root domain in Cloudflare
- [ ] Added CNAME record for www in Cloudflare
- [ ] Enabled proxy (orange cloud) for both records
- [ ] Set SSL/TLS mode to "Full" in Cloudflare
- [ ] Enabled "Always Use HTTPS" in Cloudflare
- [ ] Verified domain shows "Valid Configuration" in Vercel
- [ ] Tested `https://swellfare.ai` in browser
- [ ] Tested `https://www.swellfare.ai` in browser

---

## Expected DNS Records in Cloudflare

After setup, you should have:

| Type | Name | Content/Target | Proxy |
|------|------|----------------|-------|
| A or CNAME | @ | Vercel IP or `cname.vercel-dns.com` | ✅ Proxied |
| CNAME | www | `cname.vercel-dns.com` | ✅ Proxied |

---

## What Happens Next?

1. **DNS Propagation:** 5-10 minutes (can take up to 24 hours)
2. **SSL Certificate:** Vercel issues automatically (5-10 minutes)
3. **Site Live:** Your site will be accessible at `swellfare.ai`!

**Note:** Vercel will show "Valid Configuration" when everything is set up correctly. If it shows an error, check the troubleshooting section above.

---

## Need Help?

- **Vercel Docs:** [vercel.com/docs/concepts/projects/domains](https://vercel.com/docs/concepts/projects/domains)
- **Cloudflare Docs:** [developers.cloudflare.com/dns](https://developers.cloudflare.com/dns)

Your domain should be live in about 10 minutes! 🚀

