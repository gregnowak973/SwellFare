# 🌐 Viewing Development Website

## Option 1: Vercel Preview Deployments (Recommended)

Vercel can automatically create preview deployments for any branch. Here's how to set it up:

### Step 1: Enable Preview Deployments in Vercel
1. Go to: https://vercel.com/dashboard
2. Open your **SwellFare** project
3. Go to **Settings** → **Git**
4. Under **"Production Branch"**, make sure `main` is selected
5. Under **"Preview Deployments"**, make sure it's **enabled** ✅
6. This will create preview URLs for every branch push

### Step 2: Push to Develop Branch
```bash
# Make sure you're on develop
git checkout develop

# Push any changes
git push origin develop
```

### Step 3: Get Preview URL
1. Go to Vercel Dashboard → **Deployments** tab
2. Find the deployment for `develop` branch
3. Click on it to get the preview URL
4. URL will look like: `swellfare-git-develop-xxxxx.vercel.app`

**Note:** Preview URLs are created automatically when you push to any branch (except main).

---

## Option 2: Run Locally (Fastest for Development)

```bash
# Make sure you're on develop branch
git checkout develop

# Install dependencies (if needed)
npm install

# Run development server
npm run dev

# Open browser to:
# http://localhost:3000
```

This is the fastest way to see changes as you develop!

---

## Option 3: Manual Deploy from Develop Branch

If preview deployments aren't working, you can manually deploy:

1. Go to Vercel Dashboard → **Deployments**
2. Click **"Create Deployment"**
3. Select branch: `develop`
4. Click **"Deploy"**
5. Get the deployment URL

---

## Quick Check: Is Preview Enabled?

To see if preview deployments are working:

1. **Push to develop branch** (if you haven't already)
2. **Check Vercel Dashboard** → Deployments
3. **Look for** a deployment with branch name `develop`
4. **Click it** to get the preview URL

If you don't see a preview deployment:
- Go to Settings → Git → Enable "Preview Deployments"
- Or push a new commit to develop branch

---

## Recommended Setup

**For Development:**
- Use `npm run dev` locally (fastest, instant feedback)
- Preview URL for sharing/testing

**For Production:**
- Only `main` branch deploys to production
- Preview URLs for other branches

---

## Current Status

- ✅ `develop` branch exists on GitHub
- ⚠️ Need to check if Vercel preview deployments are enabled
- ✅ Can always run locally with `npm run dev`

**Quickest way right now:** Run `npm run dev` locally to see your development version!

