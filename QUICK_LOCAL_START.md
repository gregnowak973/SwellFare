# 🚀 Quick Local Deployment Guide

## Step-by-Step

### 1. Install Dependencies
```bash
cd /Users/gregnowak/Documents/GitHub/SwellFare
npm install
```

### 2. Set Up Environment Variables
```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local and add your API keys
# (You can get these from Vercel dashboard or your API providers)
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Open in Browser
**http://localhost:3000**

## What Happens

- ✅ Next.js dev server starts
- ✅ Hot reload enabled (changes auto-refresh)
- ✅ All features work locally
- ✅ Uses your local `.env.local` for API keys

## Stop the Server

Press `Ctrl + C` in the terminal

## Troubleshooting

**If npm not found:**
- Install Node.js: https://nodejs.org
- Or: `brew install node`

**If port 3000 in use:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

**If build errors:**
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run dev
```


