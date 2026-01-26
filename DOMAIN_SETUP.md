# 🌐 Connect swellfare.ai Domain to Vercel

## Step-by-Step Domain Setup

### Option 1: Using Cloudflare DNS (Recommended)

Since you bought the domain from Cloudflare, this is the easiest method.

#### Step 1: Add Domain in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your **SwellFare** project
3. Go to **Settings** → **Domains**
4. Click **"Add Domain"**
5. Enter: `swellfare.ai`
6. Click **"Add"**

Vercel will show you DNS configuration options.

#### Step 2: Configure Cloudflare DNS

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select your domain: **swellfare.ai**
3. Go to **DNS** → **Records**
4. Add/Update these records:

**For Root Domain (swellfare.ai):**
- **Type:** `CNAME`
- **Name:** `@` (or leave blank for root)
- **Target:** `cname.vercel-dns.com`
- **Proxy status:** 🟠 Proxied (orange cloud) or ⚪ DNS only (gray cloud)
- Click **"Save"**

**OR use A Records (if CNAME doesn't work):**
- **Type:** `A`
- **Name:** `@`
- **IPv4 address:** `76.76.21.21` (Vercel's IP - they'll show you the exact IP)
- **Proxy status:** 🟠 Proxied
- Click **"Save"**

**For www subdomain (optional):**
- **Type:** `CNAME`
- **Name:** `www`
- **Target:** `cname.vercel-dns.com`
- **Proxy status:** 🟠 Proxied
- Click **"Save"**

#### Step 3: Verify in Vercel

1. Go back to Vercel → Settings → Domains
2. You should see `swellfare.ai` with status "Valid Configuration"
3. Wait 5-10 minutes for DNS propagation
4. Click **"Refresh"** if needed

#### Step 4: Test Your Domain

1. Wait 10-30 minutes for DNS to propagate
2. Visit: `https://swellfare.ai`
3. You should see your SwellFare app!

---

### Option 2: Using Vercel Nameservers (Alternative)

If CNAME doesn't work, you can use Vercel's nameservers:

1. In Vercel → Settings → Domains → `swellfare.ai`
2. Click **"Configure"** or **"Use Vercel Nameservers"**
3. Vercel will show you nameservers like:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`
4. In Cloudflare:
   - Go to **DNS** → **Nameservers**
   - Click **"Change"**
   - Select **"Custom nameservers"**
   - Enter Vercel's nameservers
   - Click **"Save"**

**Note:** This method disables Cloudflare's proxy/CDN features.

---

## 🔒 Enable HTTPS (Automatic)

Vercel automatically provisions SSL certificates via Let's Encrypt:
- ✅ HTTPS will be enabled automatically
- ✅ Takes 5-10 minutes after domain is connected
- ✅ Both `swellfare.ai` and `www.swellfare.ai` will work

---

## ⚙️ Cloudflare Proxy Settings

**🟠 Proxied (Orange Cloud):**
- ✅ Cloudflare CDN enabled
- ✅ DDoS protection
- ✅ Faster global access
- ⚠️ May need to configure SSL settings

**⚪ DNS Only (Gray Cloud):**
- ✅ Direct connection to Vercel
- ✅ Simpler setup
- ✅ Vercel handles SSL automatically

**Recommendation:** Start with **DNS Only** (gray cloud) for simplicity, then enable proxy later if needed.

---

## 🐛 Troubleshooting

### Domain not working after 30 minutes?

1. **Check DNS Records:**
   - Verify CNAME/A records are correct in Cloudflare
   - Make sure no conflicting records exist

2. **Check Vercel Status:**
   - Go to Vercel → Settings → Domains
   - Look for error messages
   - Click "Refresh" to re-check

3. **Verify DNS Propagation:**
   - Use [whatsmydns.net](https://www.whatsmydns.net/#CNAME/swellfare.ai)
   - Check if DNS has propagated globally

4. **Clear DNS Cache:**
   ```bash
   # On Mac/Linux
   sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
   
   # Or restart your router
   ```

### SSL Certificate Issues?

- Wait 10-15 minutes after domain connection
- Vercel automatically provisions SSL
- Check Vercel → Settings → Domains → SSL status

### www vs root domain?

- Vercel handles both automatically
- Add `www` CNAME record in Cloudflare if you want `www.swellfare.ai`
- Or configure redirect in Vercel settings

---

## ✅ Quick Checklist

- [ ] Domain added in Vercel Dashboard
- [ ] DNS records configured in Cloudflare
- [ ] Waited 10-30 minutes for propagation
- [ ] Tested `https://swellfare.ai`
- [ ] SSL certificate active (automatic)
- [ ] Both root and www work (optional)

---

## 🎉 You're Done!

Once DNS propagates (usually 10-30 minutes), your domain will be live at:
- ✅ `https://swellfare.ai`
- ✅ `https://www.swellfare.ai` (if configured)

Your SwellFare app is now accessible at your custom domain! 🏄‍♂️

