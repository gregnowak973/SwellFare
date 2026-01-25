# SwellFare MVP - Discovery Engine

A discovery-focused MVP that helps surfers find cheap flights to destinations with active swells, without the complexity of a full booking engine.

## MVP Feature Set

### 1. The "Surf-Fare" Feed ✅
A curated list of top destinations showing current wave height vs. current flight price.
- **Why MVP**: Proves the core concept immediately
- **Implementation**: `SurfFareFeed` component with Prime Strike highlighting

### 2. Board-Bag Calculator ✅
A simple dropdown to select an airline and see their specific board fee policy.
- **Why MVP**: Solves the biggest "hidden cost" pain point
- **Implementation**: `BoardBagCalculator` component with top 15 airlines

### 3. Skill-Filter ✅
A toggle for "Soft & Longboard" vs. "Heaving Barrels."
- **Why MVP**: Prevents a beginner from booking a flight to a 10ft Teahupo'o swell
- **Implementation**: `DesireToggle` component with surf logic categorization

### 4. Strike Alerts ✅
Email notifications when a flight to a 4-star swell location drops below a "Great Deal" price threshold.
- **Why MVP**: Creates high retention and "fear of missing out"
- **Implementation**: `StrikeAlerts` component + API route

## Architecture

### Data Layer
- **Aviation**: Amadeus for Developers (Self-Service) or Duffel
- **Marine**: Stormglass.io for swell data

### Logic Layer
- **Mapping Table**: Links surf spots to nearest major airports (`lib/destinations.ts`)
- **Matching Algorithm**: Prime Strike detection (Swell > 3ft AND Period > 10s AND Flight < $500)

### Frontend
- Next.js 14 with TypeScript
- Tailwind CSS with "Deep Sea" dark theme
- Mobile-responsive web app (easier to share links)

## The "Golden 20"

20 iconic surf destinations globally:
- North America: Malibu, Pipeline, Trestles
- Central America: Nosara, Tamarindo, Playa Venao
- South America: Arpoador, Chicama, Mancora
- Europe: Nazaré, Ericeira, Hossegor
- Asia Pacific: Uluwatu, Canggu, Raglan, Byron Bay, Jeffreys Bay
- Pacific Islands: Teahupo'o, Cloudbreak

## Database Schema

### Core Tables
- `destinations` - Surf destinations with skill levels
- `swell_data` - Real-time swell conditions
- `flight_fares` - Flight pricing data
- `board_bag_fees` - Proprietary airline fee database
- `strike_alerts` - User alert preferences

### Views & Functions
- `swell_fare_deals` - Joined view with Value Scores and Prime Strike flags
- `is_prime_strike()` - Prime Strike detection function
- `get_surf_fare_feed()` - Top destinations feed

## Prime Strike Algorithm

**Criteria**: Swell > 3ft (0.91m) AND Period > 10s AND Flight < $500

This identifies the best "strike mission" opportunities where all three conditions align.

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables** (`.env.local`):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   STORMGLASS_API_KEY=your_stormglass_key
   AMADEUS_CLIENT_ID=your_amadeus_client_id
   AMADEUS_CLIENT_SECRET=your_amadeus_secret
   ```

3. **Run database migrations**:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_discovery_features.sql`

4. **Start development server**:
   ```bash
   npm run dev
   ```

## Next Steps (Post-MVP)

- Set up cron jobs to fetch swell/flight data
- Implement email notification service (SendGrid, Resend, etc.)
- Add push notifications for mobile
- Expand destination database
- Add user accounts and saved searches
- Implement sharing functionality for Strike Missions

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **APIs**: Stormglass, Amadeus
- **UI**: Lucide Icons, Custom "Deep Sea" theme
