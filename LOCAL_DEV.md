# 🚀 Local Development Setup

## Quick Start

```bash
# 1. Make sure you're on develop branch
git checkout develop

# 2. Install dependencies (if not already done)
npm install

# 3. Create environment variables file
cp .env.example .env.local
# Then edit .env.local with your API keys

# 4. Run development server
npm run dev
```

## Environment Variables

Create a `.env.local` file in the root directory with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
STORMGLASS_API_KEY=your_stormglass_key
AMADEUS_CLIENT_ID=your_amadeus_client_id
AMADEUS_CLIENT_SECRET=your_amadeus_client_secret
```

## Access the App

Once `npm run dev` is running:
- Open: http://localhost:3000
- The app will hot-reload when you make changes

## Troubleshooting

### Port 3000 already in use?
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### Dependencies not installed?
```bash
npm install
```

### Build errors?
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```


