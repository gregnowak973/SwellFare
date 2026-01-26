import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import { fetchCurrentSwell } from '@/lib/api/stormglass';
import { getCheapestFlight } from '@/lib/api/amadeus';
import { GOLDEN_20_DESTINATIONS } from '@/lib/destinations';
import { categorizeSwell, calculateValueScore, calculateWindAlignment } from '@/lib/surfLogic';
import { isPrimeStrike } from '@/lib/strikeLogic';
import { validateSwellData, validateFlightOffer, validateDeal } from '@/lib/validation';

export const runtime = 'nodejs';

// Disable caching for real-time data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
      // Return immediately with message if APIs not configured
      return NextResponse.json({
        deals: [],
        message: 'API keys not configured. Please add STORMGLASS_API_KEY, AMADEUS_CLIENT_ID, and AMADEUS_CLIENT_SECRET to environment variables. Showing sample data.',
        debug: {
          stormglassConfigured: !!stormglassKey,
          amadeusConfigured: !!(amadeusClientId && amadeusClientSecret),
        },
      });
    }

    const deals = [];
    const departureDate = new Date();
    departureDate.setDate(departureDate.getDate() + 7); // 7 days from now
    const returnDate = new Date(departureDate);
    returnDate.setDate(returnDate.getDate() + 7); // 7 day trip

    // Limit destinations to check (to avoid timeout)
    const maxDestinationsToCheck = Math.min(limit + 5, 10);
    const destinationsToCheck = GOLDEN_20_DESTINATIONS.slice(0, maxDestinationsToCheck);
    
    // PARALLELIZE API CALLS for better performance
    const destinationPromises = destinationsToCheck.map(async (dest) => {
      try {
        // Fetch current swell data
        const swell = await fetchCurrentSwell(
          dest.latitude,
          dest.longitude,
          { apiKey: stormglassKey }
        );

        // Validate swell data
        if (!swell || !validateSwellData(swell)) {
          return null;
        }

        // Categorize swell and check if it matches the desired type
        const categorized = categorizeSwell(swell, desire);
        if (!categorized.isMatch) {
          return null; // Filter by desire - only include if it matches
        }

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

        // Validate flight data
        if (!flight || !validateFlightOffer(flight)) {
          return null;
        }

        const price = parseFloat(flight.price.total);
        if (isNaN(price) || price <= 0) {
          return null;
        }

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

        const deal = {
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
        };

        // Validate final deal
        if (!validateDeal(deal)) {
          return null;
        }

        return deal;
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error(`Error fetching data for ${dest.name}:`, error);
        }
        return null;
      }
    });

    // Wait for all promises and filter out nulls
    const results = await Promise.all(destinationPromises);
    const validDeals = results.filter((deal): deal is NonNullable<typeof deal> => deal !== null);
    deals.push(...validDeals);

    // Sort by value score and limit
    deals.sort((a, b) => b.valueScore - a.valueScore);
    const topDeals = deals.slice(0, limit);

    return NextResponse.json({
      deals: topDeals,
      count: topDeals.length,
      timestamp: new Date().toISOString(),
      debug: {
        destinationsChecked: maxDestinationsToCheck,
        dealsFound: deals.length,
        filteredByDesire: desire,
      },
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching deals:', errorMessage);
    }
    return NextResponse.json(
      { error: 'Failed to fetch deals', message: errorMessage },
      { status: 500 }
    );
  }
}

