# Where to Set Your Domain in Vercel

## Step-by-Step: Adding Domain to Vercel

### Step 1: Deploy Your Project First
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your `SwellFare` repository from GitHub
3. Click "Deploy"
4. Wait for deployment to complete

### Step 2: Add Domain in Vercel Dashboard

1. **Go to your project:**
   - After deployment, click on your **SwellFare** project
   - Or go to [vercel.com](https://vercel.com) → Click "SwellFare"

2. **Navigate to Domain Settings:**
   - Click the **"Settings"** tab (top navigation)
   - In the left sidebar, click **"Domains"**

3. **Add Your Domain:**
   - You'll see an input field that says "Add Domain" or "Add a domain"
   - Type: `swellfare.ai`
   - Click **"Add"** button

4. **Add WWW Subdomain (Optional):**
   - Type: `www.swellfare.ai`
   - Click **"Add"** button

### Step 3: Vercel Will Show DNS Instructions

After adding the domain, Vercel will show you:
- DNS records to add in Cloudflare
- IP addresses or CNAME targets
- Instructions on what to do next

**Don't close this page** - you'll need these DNS records!

### Step 4: Configure DNS in Cloudflare

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Click on your domain `swellfare.ai`
3. Go to **DNS** section
4. Add the DNS records that Vercel showed you
5. Enable Proxy (orange cloud) ✅
6. Set SSL/TLS to "Full" ✅

---

## Visual Guide

```
Vercel Dashboard
├── Your Projects
│   └── SwellFare ← Click here
│       ├── Overview
│       ├── Deployments
│       ├── Analytics
│       └── Settings ← Click here
│           ├── General
│           ├── Environment Variables
│           ├── Domains ← Click here! ✅
│           ├── Git
│           └── ...
```

---

## What You'll See

In the Domains section, you'll see:

```
┌─────────────────────────────────────────┐
│ Domains                                  │
│                                          │
│ [Add Domain]                             │
│                                          │
│ Production Domains:                      │
│ ┌─────────────────────────────────────┐ │
│ │ swellfare.ai                        │ │ ← After adding
│ │ Status: Valid Configuration ✅       │ │
│ │ [Configure] [Remove]                │ │
│ └─────────────────────────────────────┘ │
│                                          │
│ ┌─────────────────────────────────────┐ │
│ │ www.swellfare.ai                    │ │ ← After adding
│ │ Status: Valid Configuration ✅      │ │
│ │ [Configure] [Remove]                 │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## Important Notes

- **Domain is set in Vercel Dashboard**, not in code
- **Add domain AFTER deployment** (not before)
- **Vercel provides DNS records** - you add them to Cloudflare
- **Wait 5-10 minutes** for DNS to propagate after adding records

---

## Quick Checklist

- [ ] Project deployed on Vercel
- [ ] Go to Settings → Domains
- [ ] Add `swellfare.ai`
- [ ] Add `www.swellfare.ai` (optional)
- [ ] Copy DNS records from Vercel
- [ ] Add DNS records in Cloudflare
- [ ] Wait for DNS propagation
- [ ] Verify site loads at `swellfare.ai`

---

## Troubleshooting

**Can't find Domains section?**
- Make sure you're in the project (not dashboard)
- Click Settings tab first
- Look in left sidebar

**Domain shows "Invalid Configuration"?**
- Check DNS records in Cloudflare match Vercel's instructions
- Make sure proxy is enabled (orange cloud)
- Wait a few minutes for DNS propagation

**Domain not working?**
- Verify DNS records are correct
- Check SSL/TLS settings in Cloudflare
- Wait 5-10 minutes for propagation

That's where you set your domain! 🎯

