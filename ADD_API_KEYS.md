# 🔑 Adding API Keys

## Current Status

Your `.env.local` file exists but the API keys are empty. You need to add your API keys to get real data.

## 📝 How to Add API Keys

### Step 1: Open `.env.local`

The file is located at:
```
/Users/gregnowak/Documents/GitHub/SwellFare/.env.local
```

### Step 2: Add Your API Keys

Edit the file and add your keys after the `=` sign:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://anzlvwcgryygjaypdpty.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuemx2d2Nncnl5Z2pheXBkcHR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNTM4NDEsImV4cCI6MjA4NDkyOTg0MX0.Dm--toI3Qqld3Q3WNDXMrtrBEItD1_zhDTjNw97CMRU
STORMGLASS_API_KEY=your_stormglass_key_here
AMADEUS_CLIENT_ID=your_amadeus_client_id_here
AMADEUS_CLIENT_SECRET=your_amadeus_client_secret_here
```

## 🔍 Where to Get API Keys

### Stormglass API Key
1. Go to: https://stormglass.io
2. Sign up for a free account
3. Navigate to API Keys section
4. Copy your API key
5. Paste it after `STORMGLASS_API_KEY=`

**Free Tier**: 50 requests/day
**Cost**: Free for development

### Amadeus API Keys
1. Go to: https://developers.amadeus.com
2. Sign up for a free account
3. Create a new app
4. Get your `Client ID` and `Client Secret`
5. Paste them after `AMADEUS_CLIENT_ID=` and `AMADEUS_CLIENT_SECRET=`

**Free Tier**: 2,000 requests/month
**Cost**: Free for development

## ⚠️ Important Notes

- **Never commit `.env.local` to Git** - It's already in `.gitignore`
- **Restart the server** after adding keys
- **Keys are case-sensitive** - Make sure there are no extra spaces

## 🚀 After Adding Keys

1. Save the `.env.local` file
2. Restart the dev server:
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```
3. Refresh the debug page to see real data

## ✅ Quick Test

After adding keys, visit:
- `/debug` - Should show real swell data
- `/api/debug-deals?desire=barrel` - Should return results

## 🆘 If You Don't Have Keys Yet

The app will still work but show:
- Empty states (no deals)
- Error messages about missing keys
- Mock data won't be shown (we removed that)

You can still test the UI and see the structure, but you'll need API keys for real data.


