# 📅 14-Day Window Feature

## ✅ What's New

The app now checks a **14-day window** (7 days back + 7 days forward) to find good surf conditions!

## 🎯 How It Works

### **Time Window Check**
- **Last 7 days**: Checks historical swell data
- **Next 7 days**: Checks forecast swell data
- **Total window**: 14 days of data analyzed
- **Result**: Includes destination if **ANY** time in this window has good surf

### **Smart Inclusion Logic**
1. Fetches all swell data for the 14-day window
2. Checks if any hour has good conditions matching the desired surf type
3. Finds the **best conditions** in that window
4. Uses those best conditions for display
5. Includes destination even if current conditions aren't perfect

## 🔧 Technical Details

### **New Function: `checkSwellWindow()`**
- Location: `lib/api/swellWindow.ts`
- Fetches 14 days of hourly swell data
- Checks every hour for good conditions
- Returns best conditions found in the window
- Very lenient: includes if there's ANY surfable wave

### **Updated APIs**
- **`/api/deals`**: Now checks 14-day window before including destinations
- **`/api/map-data`**: Also checks 14-day window for map display

### **Benefits**
- **More results**: Shows destinations that had/will have good surf
- **Better coverage**: Catches swells that might have passed or are coming
- **User-friendly**: Don't miss good spots just because it's flat right now

## 📊 What You'll See

### **More Destinations**
- Destinations that had good surf in the last week
- Destinations with good surf forecast in the next week
- Best conditions from the window are displayed

### **Better Data**
- Shows the peak conditions from the 14-day window
- Not just current conditions
- More comprehensive view of surf potential

## 🎨 Example

**Before**: Only shows if current conditions are good
- Pipeline: Current = 0.5m → **Excluded**

**After**: Shows if ANY time in 14-day window is good
- Pipeline: Had 2.5m yesterday → **Included** (shows best: 2.5m)

## ⚡ Performance

- **Parallel fetching**: All destinations checked simultaneously
- **Efficient**: Only fetches data once per destination
- **Cached**: Best conditions stored for quick access

## 📝 Files Changed

- `lib/api/swellWindow.ts` - New utility for window checking
- `app/api/deals/route.ts` - Updated to use 14-day window
- `app/api/map-data/route.ts` - Updated to use 14-day window
- `components/MapView.tsx` - Passes desire filter to API

## 🚀 Result

You should now see **tons more results** because we're checking a 14-day window instead of just current conditions!


