# Historical Data Availability

## Stormglass API - Historical Swell Data

### ✅ **YES - Historical Data Available**

**How it works:**
- The `fetchSwellData()` function accepts `startDate` and `endDate` parameters
- You can request data for **any date range** (past or future)
- Stormglass stores historical swell data going back

**Current Implementation:**
```typescript
// Current: Fetches data for "now" to "tomorrow"
fetchCurrentSwell(lat, lng, config)

// Historical: Can fetch any date range
fetchSwellData(lat, lng, startDate, endDate, config)
```

**What you can get:**
- Historical swell height
- Historical swell period
- Historical wind conditions
- Hourly data for any date range

**Limitations:**
- Free tier: Limited requests per day
- Paid tier: More historical data access
- Data quality may vary for very old dates

---

## Amadeus API - Historical Flight Prices

### ❌ **NO - No Historical Price Data**

**Why:**
- Amadeus provides **current/real-time** flight prices only
- Flight prices change constantly (supply/demand)
- Airlines don't typically provide historical pricing data

**What Amadeus provides:**
- Current flight prices for specific dates
- Future flight prices (up to ~11 months ahead)
- Real-time availability

**What you CAN do:**
- Store prices in your database as you fetch them
- Build your own historical price database
- Track price changes over time (if you query regularly)

**Current Implementation:**
```typescript
// Fetches current price for specific dates
getCheapestFlight({
  originCode: 'LAX',
  destinationCode: 'SJO',
  departureDate: '2024-02-15', // Specific date
  returnDate: '2024-02-22'
})
```

---

## Your Current Historical Data Setup

Looking at your codebase, you already have:

### ✅ Historical Swell Data
- `lib/api/historical.ts` - Functions for fetching historical swell data
- `app/api/historical-deals/route.ts` - API endpoint for historical deals
- Database stores historical swell data in `swell_data` table

### ✅ Historical Flight Prices (Your Own Database)
- You can store flight prices in `flight_fares` table as you fetch them
- Build your own historical price database over time
- Query past prices from your database

---

## Recommendations

### For Historical Swell Data:
1. ✅ **Use Stormglass** - It supports historical queries
2. ✅ **Store in database** - Save historical data to `swell_data` table
3. ✅ **Query your database** - Faster than API calls for past data

### For Historical Flight Prices:
1. ❌ **Can't get from Amadeus** - They don't provide historical prices
2. ✅ **Build your own database** - Store prices as you fetch them
3. ✅ **Track over time** - Query your `flight_fares` table for past prices
4. 💡 **Alternative**: Use other services that track flight price history (like Google Flights API, but it's limited)

---

## Summary

| Data Type | Historical Available? | Source |
|-----------|----------------------|--------|
| **Swell Data** | ✅ Yes | Stormglass API |
| **Flight Prices** | ❌ No | Build your own database |
| **Your Database** | ✅ Yes | Store data as you fetch it |

**Bottom Line:**
- **Swell data**: Historical available from Stormglass ✅
- **Flight prices**: Need to build your own historical database ❌
- **Your app**: Already set up to store historical data in Supabase ✅

