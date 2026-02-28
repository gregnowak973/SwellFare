# 🚀 Local Development - Quick Start

## Step 1: Install Dependencies

Open Terminal and run:

```bash
cd /Users/gregnowak/Documents/GitHub/SwellFare
npm install
```

This will install all required packages (Next.js, React, Supabase, etc.)

## Step 2: Create Environment Variables

Create a `.env.local` file in the project root:

```bash
# Create the file
touch .env.local
```

Then add your API keys (you can get these from Vercel or your API providers):

```env
NEXT_PUBLIC_SUPABASE_URL=https://anzlvwcgryygjaypdpty.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuemx2d2Nncnl5Z2pheXBkcHR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNTM4NDEsImV4cCI6MjA4NDkyOTg0MX0.Dm--toI3Qqld3Q3WNDXMrtrBEItD1_zhDTjNw97CMRU
STORMGLASS_API_KEY=your_stormglass_key_here
AMADEUS_CLIENT_ID=your_amadeus_client_id_here
AMADEUS_CLIENT_SECRET=your_amadeus_client_secret_here
```

**Note:** Replace the placeholder values with your actual API keys.

## Step 3: Run Development Server

```bash
npm run dev
```

You should see:
```
▲ Next.js 14.2.35
- Local:        http://localhost:3000
```

## Step 4: Open in Browser

Open: **http://localhost:3000**

## What You'll See

- ✅ Dashboard with deals
- ✅ Forecast and history charts (expandable in each deal card)
- ✅ Filter switching (Barrel vs Log)
- ✅ All features working locally

## Hot Reload

- Changes to code will automatically refresh the browser
- No need to restart the server

## Stop the Server

Press `Ctrl + C` in the terminal to stop the dev server.

## Troubleshooting

### "npm: command not found"
- Install Node.js from https://nodejs.org
- Or use Homebrew: `brew install node`

### "Port 3000 already in use"
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### "Module not found" errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Environment variables not working
- Make sure file is named `.env.local` (not `.env`)
- Restart the dev server after adding variables
- Check that variables don't have quotes around values

## Current Branch

You're on `develop` branch - perfect for testing new features!


