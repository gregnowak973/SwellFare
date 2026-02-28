# 🔑 API Keys Setup Guide

## ⚠️ Missing API Keys

Your `.env.local` file has empty API keys. You need to add them to get real data.

## 📋 Current `.env.local` Status

The file exists at: `/Users/gregnowak/Documents/GitHub/SwellFare/.env.local`

Current content:
```
STORMGLASS_API_KEY=
AMADEUS_CLIENT_ID=
AMADEUS_CLIENT_SECRET=
```

## 🎯 Quick Fix

### Option 1: Edit in Terminal
```bash
cd /Users/gregnowak/Documents/GitHub/SwellFare
nano .env.local
# Or use your preferred editor
```

### Option 2: Edit in Cursor/VS Code
1. Open `.env.local` file
2. Add your keys after the `=` sign
3. Save the file

## 🔑 Where to Get Keys

### Stormglass (Swell Data)
1. Visit: https://stormglass.io
2. Sign up (free)
3. Go to Dashboard → API Keys
4. Copy your key
5. Add to `.env.local`: `STORMGLASS_API_KEY=your_key_here`

### Amadeus (Flight Data)
1. Visit: https://developers.amadeus.com
2. Sign up (free)
3. Create an app
4. Get Client ID and Client Secret
5. Add to `.env.local`:
   ```
   AMADEUS_CLIENT_ID=your_id_here
   AMADEUS_CLIENT_SECRET=your_secret_here
   ```

## ✅ After Adding Keys

1. **Save** `.env.local`
2. **Restart** the dev server:
   ```bash
   # Stop server (Ctrl+C in terminal)
   npm run dev
   ```
3. **Refresh** the debug page at `/debug`

## 🧪 Test Your Keys

Visit these URLs to test:
- `http://localhost:3000/debug` - Should show real data
- `http://localhost:3000/api/debug-deals?desire=barrel` - Should return results

## 💡 Pro Tip

You can test if keys work by checking the debug page - it will show:
- ✅ "Made Cut" if keys work and data is found
- ❌ "Error" if keys are invalid
- ⚠️ "No Data" if keys work but no surf found


