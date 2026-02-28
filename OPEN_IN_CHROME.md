# 🌐 Opening SwellFare in Google Chrome

## ✅ Your Server is Running!

The development server is active at: **http://localhost:3000**

## How to Open in Chrome

### Option 1: Direct Link
1. Open Google Chrome
2. Type in the address bar: `http://localhost:3000`
3. Press Enter

### Option 2: From Terminal
```bash
open -a "Google Chrome" http://localhost:3000
```

### Option 3: Copy & Paste
Copy this URL and paste it into Chrome:
```
http://localhost:3000
```

## What You'll See

- **Dashboard** with surf-fare deals
- **Prime Strikes** section (best deals)
- **Surf-Fare Feed** (all destinations)
- **Board Bag Calculator**
- **Strike Alerts** button
- **Forecast & History** charts (expandable on each deal card)

## Features to Test

1. **Switch Filters**: Toggle between "Heaving Barrels" and "Soft & Longboard"
2. **View Forecast**: Click "7-Day Forecast" on any deal card
3. **View History**: Click "30-Day History" on any deal card
4. **Board Bag Calculator**: Select an airline to see fees

## Troubleshooting

If Chrome doesn't open automatically:
- Manually open Chrome
- Type `localhost:3000` in the address bar
- Make sure the server is still running (check your terminal)

## Server Status

The server is running in the background. To stop it:
- Find the terminal where `npm run dev` is running
- Press `Ctrl + C`

To restart:
```bash
cd /Users/gregnowak/Documents/GitHub/SwellFare
npm run dev
```


