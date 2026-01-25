# SwellFare API Services Explained

## Overview

SwellFare uses three external services to power the discovery engine. Here's what each does and how much they cost.

---

## 1. Supabase (Database)

### What It Is
**Supabase** is a Firebase alternative built on PostgreSQL. It provides:
- PostgreSQL database (where we store destinations, swell data, flight prices, alerts)
- Real-time subscriptions
- Authentication (if you add user accounts later)
- Storage (for images/files if needed)
- API auto-generation from your database schema

### Why We Use It
- **Free tier** is generous for MVP
- PostgreSQL is powerful and reliable
- Easy to set up (no server management)
- Built-in dashboard for managing data
- Perfect for storing:
  - The "Golden 20" destinations
  - Swell data from Stormglass
  - Flight prices from Amadeus
  - User strike alerts
  - Board bag fees

### Cost: **FREE** for MVP ✅

**Free Tier Includes:**
- 500 MB database storage
- 2 GB bandwidth/month
- Unlimited API requests
- 50,000 monthly active users
- 2 projects

**Paid Plans Start At:**
- **Pro:** $25/month (if you exceed free tier)
- **Team:** $599/month (for larger scale)

**For MVP:** Free tier is more than enough! You'd only need to pay if you scale significantly.

---

## 2. Stormglass (Swell Data)

### What It Is
**Stormglass** is a marine weather API that provides:
- Wave height (swell height)
- Wave period (swell period)
- Wind speed and direction
- Tide data
- Water temperature
- Forecast data (up to 7 days)

### Why We Use It
- **Most developer-friendly** swell data API
- No scraping needed (unlike Surfline which doesn't have a public API)
- Accurate data from multiple sources (NOAA, Meteo, etc.)
- Easy to integrate
- Provides the exact data we need for Prime Strike detection

### Cost: **FREE** for MVP ✅

**Free Tier Includes:**
- 50 requests/day
- 1,500 requests/month
- Historical data access
- 7-day forecasts

**Paid Plans:**
- **Starter:** $10/month (10,000 requests/month)
- **Professional:** $50/month (100,000 requests/month)
- **Enterprise:** Custom pricing

**For MVP:** 
- Free tier (50 requests/day) = ~1,500 requests/month
- If you check 20 destinations once per day = 20 requests/day ✅
- Perfect for MVP! You can upgrade later if needed.

**Note:** You might want to upgrade to Starter ($10/month) if you:
- Check more destinations
- Update data more frequently (every few hours)
- Add more users

---

## 3. Amadeus (Flight Prices)

### What It Is
**Amadeus** is a travel technology company that provides:
- Flight search API
- Real-time flight prices
- Availability checking
- Booking capabilities (if you add booking later)

### Why We Use It
- **Best documentation** for flight search APIs
- Self-service API (easy to get started)
- Real-time pricing data
- Covers most major airlines globally
- Industry standard (used by many travel sites)

**Alternatives Considered:**
- **Duffel:** Also good, but Amadeus has better docs
- **Skyscanner API:** Limited availability
- **Google Flights:** No public API

### Cost: **FREE** for MVP ✅

**Free Tier (Self-Service API):**
- **Test Environment:** Completely free, unlimited
- **Production:** Free up to certain limits
- No credit card required for test environment

**Paid Plans:**
- **Self-Service Production:** Pay-per-use (very cheap, ~$0.01-0.05 per search)
- **Enterprise:** Custom pricing (for high volume)

**For MVP:**
- Start with **Test Environment** = **FREE** ✅
- Test environment has realistic data (not real bookings)
- Perfect for MVP/demo purposes
- When you go live, production pricing is very affordable

**Estimated Production Costs:**
- If you do 1,000 flight searches/month = ~$10-50/month
- Very affordable even at scale

---

## Total Monthly Cost Breakdown

### MVP Phase (Free Tier):
- **Supabase:** $0 ✅
- **Stormglass:** $0 ✅
- **Amadeus:** $0 ✅
- **Vercel Hosting:** $0 ✅
- **Domain (swellfare.ai):** Already paid ✅

**Total: $0/month** 🎉

### When You Scale (Optional Upgrades):
- **Supabase Pro:** $25/month (if you exceed free tier)
- **Stormglass Starter:** $10/month (if you need more requests)
- **Amadeus Production:** ~$10-50/month (based on usage)
- **Vercel Pro:** $20/month (optional, for more features)

**Total at Scale: ~$45-105/month** (still very affordable!)

---

## Why These Services?

### Alternative Approaches (and why we didn't use them):

**1. Build Your Own Database Server:**
- ❌ Requires server management
- ❌ More expensive (AWS RDS = $15+/month minimum)
- ❌ More complex setup
- ✅ Supabase is easier and free

**2. Scrape Surfline for Swell Data:**
- ❌ Against terms of service
- ❌ Unreliable (breaks when they change HTML)
- ❌ Legal issues
- ✅ Stormglass is legitimate and has an API

**3. Scrape Flight Prices:**
- ❌ Against airline terms of service
- ❌ Unreliable and breaks frequently
- ❌ Legal issues
- ✅ Amadeus is the industry standard

**4. Use Free Alternatives:**
- ❌ Limited functionality
- ❌ Unreliable data
- ❌ No support
- ✅ Paid services are worth it for reliability

---

## Cost Optimization Tips

### Keep Costs Low:
1. **Cache data** - Don't fetch swell/flight data on every page load
2. **Batch requests** - Check multiple destinations at once
3. **Use free tiers** - They're generous for MVP
4. **Monitor usage** - Set up alerts before hitting limits
5. **Upgrade gradually** - Only pay when you need more

### When to Upgrade:
- **Supabase:** When you exceed 500 MB storage or 2 GB bandwidth
- **Stormglass:** When you exceed 1,500 requests/month
- **Amadeus:** When you move from test to production (still cheap!)

---

## Summary

| Service | Purpose | MVP Cost | Scale Cost |
|---------|---------|----------|------------|
| **Supabase** | Database | FREE ✅ | $25/month |
| **Stormglass** | Swell data | FREE ✅ | $10/month |
| **Amadeus** | Flight prices | FREE ✅ | $10-50/month |
| **Vercel** | Hosting | FREE ✅ | $20/month |
| **Total** | | **$0/month** 🎉 | **$45-105/month** |

**Bottom Line:** You can launch and run SwellFare MVP for **$0/month**. Only pay when you scale and need more resources. Perfect for validating your idea before investing more!

---

## Getting Started

All three services offer free tiers with no credit card required (except Amadeus production, but test is free). You can:

1. **Sign up** for all three (takes 5 minutes each)
2. **Get your API keys** (free)
3. **Start building** (free)
4. **Launch MVP** (free)
5. **Upgrade later** (only if needed)

No upfront costs, no risk! 🚀

