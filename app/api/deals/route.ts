import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import { fetchCurrentSwell } from '@/lib/api/stormglass';
import { getCheapestFlight } from '@/lib/api/amadeus';
import { GOLDEN_20_DESTINATIONS } from '@/lib/destinations';
import { categorizeSwell, calculateValueScore, calculateWindAlignment } from '@/lib/surfLogic';
import { isPrimeStrike } from '@/lib/strikeLogic';

export const runtime = 'nodejs';

/**
 * GET /api/deals
 * Fetch real-time surf-fare deals by fetching swell data and flight prices
 * 
 * Query params:
 * - desire: 'barrel' | 'log' (optional, defaults to 'barrel')
 * - origin: airport code (optional, defaults to 'LAX')
 * - limit: number of results (optional, defaults to 10)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const desire = (searchParams.get('desire') || 'barrel') as 'barrel' | 'log';
    const originCode = searchParams.get('origin') || 'LAX';
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get API keys from environment
    const stormglassKey = process.env.STORMGLASS_API_KEY;
    const amadeusClientId = process.env.AMADEUS_CLIENT_ID;
    const amadeusClientSecret = process.env.AMADEUS_CLIENT_SECRET;

    if (!stormglassKey || !amadeusClientId || !amadeusClientSecret) {
      // Return mock data if APIs not configured
      return NextResponse.json({
        deals: [],
        message: 'API keys not configured. Please add STORMGLASS_API_KEY, AMADEUS_CLIENT_ID, and AMADEUS_CLIENT_SECRET to environment variables.',
      });
    }

    const deals = [];
    const departureDate = new Date();
    departureDate.setDate(departureDate.getDate() + 7); // 7 days from now
    const returnDate = new Date(departureDate);
    returnDate.setDate(returnDate.getDate() + 7); // 7 day trip

    // Fetch data for each destination
    for (const dest of GOLDEN_20_DESTINATIONS.slice(0, limit * 2)) { // Fetch more to filter
      try {
        // Fetch current swell data
        const swell = await fetchCurrentSwell(
          dest.latitude,
          dest.longitude,
          { apiKey: stormglassKey }
        );

        if (!swell) continue;

        // Categorize swell
        const categorized = categorizeSwell(swell, desire);
        if (categorized.type !== desire) continue; // Filter by desire

        // Fetch flight price
        const flight = await getCheapestFlight(
          {
            originCode,
            destinationCode: dest.airportCode,
            departureDate: departureDate.toISOString().split('T')[0],
            returnDate: returnDate.toISOString().split('T')[0],
            currency: 'USD',
          },
          {
            clientId: amadeusClientId,
            clientSecret: amadeusClientSecret,
          }
        );

        if (!flight) continue;

        const price = parseFloat(flight.price.total);

        // Calculate wind alignment
        const windAlignment = calculateWindAlignment(
          swell.windDirection || 0,
          dest.idealSwellDirection
        );

        // Calculate value score
        const valueScore = calculateValueScore(
          swell.height,
          swell.period,
          windAlignment,
          price
        );

        // Check if Prime Strike
        const primeStrike = isPrimeStrike({
          swellHeight: swell.height,
          swellPeriod: swell.period,
          flightPrice: price,
        });

        deals.push({
          destination: dest.name,
          airportCode: dest.airportCode,
          price,
          currency: 'USD',
          swellHeight: swell.height,
          swellPeriod: swell.period,
          swellType: categorized.type,
          valueScore,
          departureDate: departureDate.toISOString().split('T')[0],
          returnDate: returnDate.toISOString().split('T')[0],
          windSpeed: swell.windSpeed || 0,
          windDirection: swell.windDirection || 0,
          primeStrike,
        });
      } catch (error) {
        console.error(`Error fetching data for ${dest.name}:`, error);
        // Continue to next destination
        continue;
      }
    }

    // Sort by value score and limit
    deals.sort((a, b) => b.valueScore - a.valueScore);
    const topDeals = deals.slice(0, limit);

    return NextResponse.json({
      deals: topDeals,
      count: topDeals.length,
    });
  } catch (error) {
    console.error('Error fetching deals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deals', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

