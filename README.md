# SwellFare MVP - Discovery Engine

A discovery-focused MVP that helps surfers find cheap flights to destinations with active swells, without the complexity of a full booking engine.

## MVP Features

- **Surf-Fare Feed**: Top destinations showing wave height vs flight price
- **Board-Bag Calculator**: Airline board bag fees for top 15 airlines
- **Skill-Filter**: Toggle between "Heaving Barrels" vs "Soft & Longboard"
- **Strike Alerts**: Email notifications for Prime Strike deals

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
STORMGLASS_API_KEY=your_stormglass_key
AMADEUS_CLIENT_ID=your_amadeus_client_id
AMADEUS_CLIENT_SECRET=your_amadeus_secret
```

### 3. Database Setup
Run migrations in Supabase SQL Editor:
- `supabase/migrations/001_initial_schema.sql`
- `supabase/migrations/002_discovery_features.sql`

### 4. Run Development Server
```bash
npm run dev
```

## Deployment

See `DEPLOYMENT.md` for detailed deployment instructions.

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **APIs**: Stormglass (swell data), Amadeus (flight prices)
- **Hosting**: Vercel

## Project Structure

```
SwellFare/
├── app/              # Next.js app directory
├── components/       # React components
├── lib/             # Utilities and API handlers
└── supabase/        # Database migrations
```

## License

MIT
