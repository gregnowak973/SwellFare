# Step-by-Step: Adding Environment Variables in Vercel

## Prerequisites
- ✅ Your SwellFare project is deployed on Vercel
- ✅ You have accounts for: Supabase, Stormglass, and Amadeus

---

## Step 1: Navigate to Your Project Settings

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click on your **SwellFare** project
3. Click on the **"Settings"** tab (top navigation)
4. In the left sidebar, click **"Environment Variables"**

---

## Step 2: Add Supabase Variables

### Get Your Supabase Credentials:

1. Go to [supabase.com](https://supabase.com) and sign in
2. Select your project (or create a new one)
3. Click **"Settings"** (gear icon) in the left sidebar
4. Click **"API"** under Project Settings
5. You'll see:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

### Add to Vercel:

1. Back in Vercel → Environment Variables
2. Click **"Add New"** button
3. Fill in:
   - **Key:** `NEXT_PUBLIC_SUPABASE_URL`
   - **Value:** Paste your Supabase Project URL
   - **Environment:** Select all three (Production, Preview, Development) ✅
4. Click **"Save"**

5. Click **"Add New"** again
6. Fill in:
   - **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value:** Paste your Supabase anon public key
   - **Environment:** Select all three (Production, Preview, Development) ✅
7. Click **"Save"**

---

## Step 3: Add Stormglass API Key

### Get Your Stormglass Key:

1. Go to [stormglass.io](https://stormglass.io) and sign in
2. Click on **"API Keys"** in the dashboard
3. Copy your API key (or create a new one if needed)

### Add to Vercel:

1. In Vercel → Environment Variables
2. Click **"Add New"**
3. Fill in:
   - **Key:** `STORMGLASS_API_KEY`
   - **Value:** Paste your Stormglass API key
   - **Environment:** Select all three ✅
4. Click **"Save"**

---

## Step 4: Add Amadeus Credentials

### Get Your Amadeus Credentials:

1. Go to [developers.amadeus.com](https://developers.amadeus.com)
2. Sign in (or create account)
3. Go to **"My Self-Service"** → **"My Apps"**
4. Click on your app (or create a new one)
5. You'll see:
   - **API Key** (Client ID)
   - **API Secret** (Client Secret)

### Add to Vercel:

1. In Vercel → Environment Variables
2. Click **"Add New"**
3. Fill in:
   - **Key:** `AMADEUS_CLIENT_ID`
   - **Value:** Paste your Amadeus API Key (Client ID)
   - **Environment:** Select all three ✅
4. Click **"Save"**

5. Click **"Add New"** again
6. Fill in:
   - **Key:** `AMADEUS_CLIENT_SECRET`
   - **Value:** Paste your Amadeus API Secret
   - **Environment:** Select all three ✅
7. Click **"Save"**

---

## Step 5: Verify All Variables Are Added

You should now have **5 environment variables**:

✅ `NEXT_PUBLIC_SUPABASE_URL`
✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
✅ `STORMGLASS_API_KEY`
✅ `AMADEUS_CLIENT_ID`
✅ `AMADEUS_CLIENT_SECRET`

---

## Step 6: Redeploy Your Application

**Important:** After adding environment variables, you need to redeploy:

1. Go to **"Deployments"** tab
2. Click the **"..."** (three dots) menu on your latest deployment
3. Click **"Redeploy"**
4. Confirm the redeploy

**OR** simply push a new commit to trigger automatic redeploy:
```bash
git commit --allow-empty -m "Trigger redeploy with env vars"
git push
```

---

## Troubleshooting

**Variables not working?**
- Make sure you selected all environments (Production, Preview, Development)
- Redeploy after adding variables
- Check for typos in variable names (case-sensitive!)

**Can't find Supabase credentials?**
- Make sure you're in the correct Supabase project
- Check Settings → API (not Database)

**Amadeus credentials not working?**
- Make sure you're using the Self-Service API (not Enterprise)
- Test credentials are different from production

---

## Quick Checklist

- [ ] Added `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Added `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Added `STORMGLASS_API_KEY`
- [ ] Added `AMADEUS_CLIENT_ID`
- [ ] Added `AMADEUS_CLIENT_SECRET`
- [ ] Selected all environments for each variable
- [ ] Redeployed the application

Done! Your environment variables are now configured. 🎉

