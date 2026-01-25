# Why Do You Need Amadeus?

## What Amadeus Does for SwellFare

**Amadeus** provides the **flight price data** that powers SwellFare's core feature: matching cheap flights with good surf conditions.

---

## The Core Problem SwellFare Solves

Surfers want to know:
- **"Where are the waves good right now?"** ← Stormglass answers this
- **"How much does it cost to fly there?"** ← **Amadeus answers this**
- **"Is this a good deal?"** ← SwellFare calculates this using both

Without flight prices, you can't answer the fundamental question: **"Is it worth flying to this destination for these waves?"**

---

## What Amadeus Provides

### 1. Real-Time Flight Prices
- Current prices for flights to surf destinations
- Multiple airlines and routes
- Different dates and times
- Round-trip and one-way options

### 2. Availability Data
- Which flights are available
- When flights are available
- How many seats left

### 3. Route Information
- Which airports connect to surf destinations
- Flight duration
- Number of stops
- Airline information

---

## How SwellFare Uses Amadeus

### Example Use Case:

**User asks:** "Show me cheap flights to destinations with good waves"

**SwellFare needs to:**
1. ✅ Get swell data (Stormglass) → "Pipeline has 6ft waves"
2. ✅ Get flight prices (Amadeus) → "Flight to HNL costs $450"
3. ✅ Calculate Value Score → `(Wave Height × Period × Wind) / Price`
4. ✅ Show user: "Pipeline: 6ft waves, $450 flight = Great deal!"

**Without Amadeus:** You'd only know about waves, but not if it's affordable to get there.

---

## Why Not Alternatives?

### ❌ Scraping Airlines Directly
- **Problem:** Against terms of service, illegal, breaks frequently
- **Why not:** Legal issues, unreliable, maintenance nightmare

### ❌ Google Flights
- **Problem:** No public API available
- **Why not:** Can't programmatically access prices

### ❌ Skyscanner API
- **Problem:** Limited availability, harder to get approved
- **Why not:** Amadeus has better documentation and easier setup

### ❌ Manual Entry
- **Problem:** Prices change constantly, too much work
- **Why not:** Not scalable, outdated data

### ✅ Amadeus
- **Why yes:** Industry standard, reliable API, good documentation, affordable

---

## What Happens Without Amadeus?

### Scenario: SwellFare without flight prices

**What you'd have:**
- ✅ Swell data (waves are good at Pipeline)
- ❌ No flight prices
- ❌ Can't calculate Value Score
- ❌ Can't identify "Prime Strikes" (Swell > 3ft AND Period > 10s AND Flight < $500)
- ❌ Can't show "cheap flights to good waves"

**Result:** You'd just have a surf forecast app, not a "surf + flight deals" discovery engine.

---

## The MVP Features That Need Amadeus

### 1. Surf-Fare Feed
- **Needs:** Current flight prices to show "wave height vs flight price"
- **Without Amadeus:** Can't show prices ❌

### 2. Prime Strike Detection
- **Needs:** Flight price to check if it's < $500
- **Without Amadeus:** Can't detect Prime Strikes ❌

### 3. Strike Alerts
- **Needs:** Monitor flight prices dropping below threshold
- **Without Amadeus:** Can't send price alerts ❌

### 4. Value Score Calculation
- **Needs:** Price in the formula: `V = (Height × Period × Wind) / Price`
- **Without Amadeus:** Can't calculate value ❌

---

## Cost Consideration

### Amadeus Pricing:
- **Test Environment:** FREE ✅ (unlimited, perfect for MVP)
- **Production:** Pay-per-use (~$0.01-0.05 per search)
- **Estimated Cost:** $0-10/month for MVP, $10-50/month at scale

### Is It Worth It?

**YES**, because:
- ✅ Free for MVP (test environment)
- ✅ Very cheap at scale
- ✅ Essential for core functionality
- ✅ No alternative that's legal and reliable
- ✅ Industry standard (used by major travel sites)

---

## Can You Build SwellFare Without Amadeus?

### Option 1: Without Flight Prices (Not Recommended)
- You'd have a surf forecast app
- Users would need to check flights manually elsewhere
- Loses the "discovery engine" value proposition
- **Not really SwellFare anymore**

### Option 2: With Manual Flight Entry (Not Scalable)
- You manually enter flight prices
- Prices change constantly (daily/hourly)
- Too much work to maintain
- **Not sustainable**

### Option 3: With Amadeus (Recommended) ✅
- Automated flight price fetching
- Real-time, accurate data
- Scalable and legal
- **This is the way**

---

## Summary

**Why you need Amadeus:**
1. **Core Feature:** Flight prices are essential for SwellFare's value proposition
2. **No Alternative:** No legal, reliable way to get flight prices without an API
3. **Affordable:** FREE for MVP, very cheap at scale
4. **Industry Standard:** Used by major travel companies
5. **Easy Integration:** Good documentation, easy to set up

**Without Amadeus, SwellFare becomes:**
- Just a surf forecast app
- Missing the "cheap flights" part
- Can't calculate Value Scores
- Can't detect Prime Strikes
- Can't send price alerts

**Bottom Line:** Amadeus is essential for SwellFare to work as intended. It's the difference between a surf forecast app and a "surf + flight deals" discovery engine.

---

## Next Steps

1. **Sign up:** [developers.amadeus.com](https://developers.amadeus.com)
2. **Create app:** Get Client ID and Secret
3. **Start with test environment:** FREE, unlimited
4. **Add to Vercel:** When you're ready to go live

The test environment is free and perfect for MVP! 🚀

