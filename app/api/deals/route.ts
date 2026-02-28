import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import { fetchCurrentSwell } from '@/lib/api/stormglass';
import { checkSwellWindow } from '@/lib/api/swellWindow';
import { getCheapestFlight, searchFlights } from '@/lib/api/amadeus';
import { GOLDEN_20_DESTINATIONS } from '@/lib/destinations';
import { categorizeSwell, calculateValueScore, calculateWindAlignment, isBarrelCondition, isLogCondition } from '@/lib/surfLogic';
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
    const useCache = searchParams.get('cache') !== 'false'; // Default to using cache

    // Get API keys from environment
    const stormglassKey = process.env.STORMGLASS_API_KEY;
    const amadeusClientId = process.env.AMADEUS_CLIENT_ID;
    const amadeusClientSecret = process.env.AMADEUS_CLIENT_SECRET;

    if (!stormglassKey || !amadeusClientId || !amadeusClientSecret) {
      return NextResponse.json({
        deals: [],
        message: 'API keys not configured. Please add STORMGLASS_API_KEY, AMADEUS_CLIENT_ID, and AMADEUS_CLIENT_SECRET to environment variables. Showing sample data.',
        debug: {
          stormglassConfigured: !!stormglassKey,
          amadeusConfigured: !!(amadeusClientId && amadeusClientSecret),
        },
      });
    }

    // Try to get deals from database first (if cache is enabled)
    if (useCache) {
      try {
        const supabase = getSupabaseClient();
        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

        // Get deals from database (swell data from last hour, matching flight fares)
        const { data: cachedDeals, error: dbError } = await supabase
          .from('swell_fare_deals')
          .select('*')
          .eq('swell_type', desire)
          .gte('swell_timestamp', oneHourAgo.toISOString())
          .order('value_score', { ascending: false })
          .limit(limit);

        if (!dbError && cachedDeals && cachedDeals.length > 0) {
          // Transform database format to API format
          const transformedDeals = cachedDeals.map((deal: any) => ({
            destination: deal.destination_name,
            airportCode: deal.airport_code,
            price: parseFloat(deal.price),
            currency: deal.currency,
            swellHeight: deal.swell_height,
            swellPeriod: deal.swell_period,
            swellType: deal.swell_type,
            valueScore: deal.value_score,
            departureDate: deal.departure_date,
            returnDate: deal.return_date,
            windSpeed: deal.wind_speed,
            windDirection: deal.wind_direction,
            primeStrike: isPrimeStrike({
              swellHeight: deal.swell_height,
              swellPeriod: deal.swell_period,
              flightPrice: parseFloat(deal.price),
            }),
          }));

          return NextResponse.json({
            deals: transformedDeals,
            count: transformedDeals.length,
            timestamp: new Date().toISOString(),
            source: 'database',
            debug: {
              destinationsChecked: 'cached',
              dealsFound: transformedDeals.length,
              filteredByDesire: desire,
            },
          }, {
            headers: {
              'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
            },
          });
        }
      } catch (cacheError) {
        // If cache fails, fall through to API calls
        if (process.env.NODE_ENV === 'development') {
          console.log('Cache miss or error, fetching from API:', cacheError);
        }
      }
    }

    const deals = [];
    const departureDate = new Date();
    departureDate.setDate(departureDate.getDate() + 7); // 7 days from now
    const returnDate = new Date(departureDate);
    returnDate.setDate(returnDate.getDate() + 7); // 7 day trip

    // Check fewer destinations initially to improve performance
    // Process in batches to avoid overwhelming APIs
    const maxDestinationsToCheck = Math.min(limit + 5, 10); // Check 10 max for faster response
    const destinationsToCheck = GOLDEN_20_DESTINATIONS.slice(0, maxDestinationsToCheck);
    
    // Process destinations in smaller batches to avoid rate limits
    const BATCH_SIZE = 3; // Process 3 at a time
    const destinationPromises = destinationsToCheck.map(async (dest, index) => {
      // Add small delay between batches to avoid rate limiting
      if (index > 0 && index % BATCH_SIZE === 0) {
        await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay between batches
      }
      try {
        // Check 6-day window: 3 days back + 3 days forward (optimized for speed)
        // Include destination if ANY time in this window has good surf
        const windowResult = await checkSwellWindow(
          dest.latitude,
          dest.longitude,
          3, // days back (reduced from 7 for faster API calls)
          3, // days forward (reduced from 7 for faster API calls)
          desire,
          { apiKey: stormglassKey }
        );

        // Only include if there's good surf in the window
        if (!windowResult.hasGoodSurf || !windowResult.bestConditions) {
          if (process.env.NODE_ENV === 'development') {
            console.log(`${dest.name}: No good surf in 14-day window`);
          }
          return null;
        }

        // Use the best conditions from the window
        const swell = windowResult.bestConditions;

        // Validate swell data
        if (!swell || !validateSwellData(swell)) {
          return null;
        }

        // Categorize swell based on best conditions found
        const barrelMatch = isBarrelCondition(swell);
        const logMatch = isLogCondition(swell);
        
        // Determine which type this swell is closest to
        let swellType: 'barrel' | 'log';
        if (barrelMatch && logMatch) {
          swellType = desire;
        } else if (barrelMatch) {
          swellType = 'barrel';
        } else if (logMatch) {
          swellType = 'log';
        } else {
          swellType = swell.height > 1.0 ? 'barrel' : 'log';
        }
        
        // Very lenient matching - show almost everything
        const matchesDesire = swellType === desire || 
          (desire === 'barrel' && (swell.height > 0.2 || swell.period > 5)) ||
          (desire === 'log' && swell.height < 3.5 && swell.period > 3);
        
        if (!matchesDesire) {
          if (process.env.NODE_ENV === 'development') {
            console.log(`${dest.name}: Best conditions don't match ${desire} - Height: ${swell.height}m, Period: ${swell.period}s`);
          }
          return null;
        }

        // Fetch flight prices - get multiple options, not just cheapest
        // Amadeus returns up to 10 flights, we'll use the cheapest 3 for variety
        const flights = await searchFlights(
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

        // Filter valid flights and sort by price
        const validFlights = flights
          .filter(flight => validateFlightOffer(flight))
          .map(flight => ({
            ...flight,
            price: parseFloat(flight.price.total),
          }))
          .filter(flight => !isNaN(flight.price) && flight.price > 0)
          .sort((a, b) => a.price - b.price)
          .slice(0, 3); // Use top 3 cheapest flights for variety

        if (validFlights.length === 0) {
          return null;
        }

        // Create deals for each valid flight (up to 3 per destination)
        return validFlights.map(flight => {
          const price = flight.price;

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
            swellType: swellType,
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
        }).filter((deal): deal is NonNullable<typeof deal> => deal !== null);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error(`Error fetching data for ${dest.name}:`, error);
        }
        return null;
      }
    });

    // Wait for all promises with a timeout to prevent hanging
    // Each destination can return multiple deals (one per flight option)
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout: API calls took too long')), 45000); // 45 second total timeout
    });

    const results = await Promise.race([
      Promise.all(destinationPromises),
      timeoutPromise,
    ]).catch((error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error in batch processing:', error);
      }
      // Return empty results if timeout or error
      return [];
    });

    const validDeals = results
      .flat() // Flatten array of arrays (each destination can have multiple deals)
      .filter((deal): deal is NonNullable<typeof deal> => deal !== null);
    deals.push(...validDeals);

    // Sort by value score and limit
    deals.sort((a, b) => b.valueScore - a.valueScore);
    const topDeals = deals.slice(0, limit);

    // Collect statistics about why deals weren't found
    const stats = {
      destinationsChecked: maxDestinationsToCheck,
      totalDestinations: GOLDEN_20_DESTINATIONS.length,
      dealsFound: deals.length,
      filteredByDesire: desire,
      message: deals.length === 0 
        ? `No ${desire} conditions found. Current swells may not meet the criteria (${desire === 'barrel' ? 'Height > 0.8m AND Period > 9s' : 'Height < 1.8m AND Period 6-14s'}). Try the other filter or check back later!`
        : undefined,
    };

    return NextResponse.json({
      deals: topDeals,
      count: topDeals.length,
      timestamp: new Date().toISOString(),
      debug: stats,
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

