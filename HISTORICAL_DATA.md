# 📊 Historical Data Analysis

## API Historical Data Capabilities

### Stormglass API ✅
**Historical Data:** ✅ **YES**

- **Range:** Typically 1-90 days back (depends on plan)
- **Frequency:** Hourly data points
- **Free Tier:** Limited historical access (check your plan)
- **Data Points:** ~24 per day (hourly)
- **Example:** 30 days = ~720 data points per destination

**What's Available:**
- Swell height (historical)
- Swell period (historical)
- Wind speed (historical)
- Wind direction (historical)

**Limitations:**
- Date range may be limited by API plan
- Rate limits apply
- Some historical data may require paid plans

### Amadeus API ❌
**Historical Data:** ❌ **NO**

- **Only Current/Future:** Amadeus only provides current and future flight prices
- **No Historical Prices:** Cannot get past flight prices
- **Workaround:** Store prices in your database as you fetch them

**What You Can Do:**
- Store current prices in Supabase `flight_fares` table
- Build historical price database over time
- Track price trends as you collect data

---

## Your Database Historical Data

### Current Schema Support

Your `swell_data` table stores:
- `timestamp` - When the data was recorded
- `height`, `period`, `wind_speed`, `wind_direction`
- Can query by date range

Your `flight_fares` table stores:
- `departure_date`, `return_date`
- `price` - Current price at time of fetch
- Can build historical price database over time

### How Much Data Do You Have?

**Check your database:**
```sql
-- Count swell data points
SELECT COUNT(*) as total_points,
       MIN(timestamp) as earliest,
       MAX(timestamp) as latest,
       COUNT(DISTINCT destination_id) as destinations
FROM swell_data;

-- Count flight fares
SELECT COUNT(*) as total_fares,
       MIN(departure_date) as earliest,
       MAX(departure_date) as latest
FROM flight_fares;
```

---

## Recommendations

### 1. Store Historical Data
- Run `/api/sync-swell-data` daily to build historical database
- Store flight prices when fetched (already in schema)
- Build up historical dataset over time

### 2. Historical Range Limits
- **Stormglass:** Test with 7, 14, 30, 60, 90 days
- **Your Database:** Unlimited (as long as you store it)
- **Flight Prices:** Build over time (no API historical access)

### 3. Filter Implementation
Create filters for:
- **Date Range:** Last 7/14/30/60/90 days
- **Destination:** Filter by specific spots
- **Swell Type:** Barrel vs Log
- **Price Range:** Min/max flight price
- **Value Score:** Min value score

---

## Test Historical Data

Visit: `https://swellfare.ai/api/test-historical-data?days=30`

This will test:
- ✅ Stormglass historical data availability
- ✅ Date range support
- ✅ Data point frequency
- ❌ Amadeus (will note it's not available)


