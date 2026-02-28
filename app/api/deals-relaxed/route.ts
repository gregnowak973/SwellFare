import { NextRequest, NextResponse } from 'next/server';
import { fetchCurrentSwell } from '@/lib/api/stormglass';
import { getCheapestFlight } from '@/lib/api/amadeus';
import { GOLDEN_20_DESTINATIONS } from '@/lib/destinations';
import { categorizeSwell, calculateValueScore, calculateWindAlignment } from '@/lib/surfLogic';
import { isPrimeStrike } from '@/lib/strikeLogic';
import { validateSwellData, validateFlightOffer, validateDeal } from '@/lib/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/deals-relaxed
 * Same as /api/deals but with relaxed criteria for testing
 * Barrel: Height > 1.0m AND Period > 10s (instead of 1.5m and 12s)
 * Log: Height < 1.5m AND Period 7-12s (instead of 1.2m and 8-11s)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const desire = (searchParams.get('desire') || 'barrel') as 'barrel' | 'log';
    const originCode = searchParams.get('origin') || 'LAX';
    const limit = parseInt(searchParams.get('limit') || '10');

    const stormglassKey = process.env.STORMGLASS_API_KEY;
    const amadeusClientId = process.env.AMADEUS_CLIENT_ID;
    const amadeusClientSecret = process.env.AMADEUS_CLIENT_SECRET;

    if (!stormglassKey || !amadeusClientId || !amadeusClientSecret) {
      return NextResponse.json({
        deals: [],
        message: 'API keys not configured',
        debug: {
          stormglassConfigured: !!stormglassKey,
          amadeusConfigured: !!(amadeusClientId && amadeusClientSecret),
        },
      });
    }

    const deals = [];
    const departureDate = new Date();
    departureDate.setDate(departureDate.getDate() + 7);
    const returnDate = new Date(departureDate);
    returnDate.setDate(returnDate.getDate() + 7);

    const maxDestinationsToCheck = Math.min(limit + 5, 10);
    const destinationsToCheck = GOLDEN_20_DESTINATIONS.slice(0, maxDestinationsToCheck);
    
    // RELAXED CRITERIA for testing
    const destinationPromises = destinationsToCheck.map(async (dest) => {
      try {
        const swell = await fetchCurrentSwell(
          dest.latitude,
          dest.longitude,
          { apiKey: stormglassKey }
        );

        if (!swell || !validateSwellData(swell)) {
          return null;
        }

        // RELAXED CRITERIA: Check if swell matches relaxed desire criteria
        let matchesDesire = false;
        if (desire === 'barrel') {
          // Relaxed: Height > 1.0m AND Period > 10s (instead of 1.5m and 12s)
          matchesDesire = swell.height > 1.0 && swell.period > 10;
        } else {
          // Relaxed: Height < 1.5m AND Period 7-12s (instead of 1.2m and 8-11s)
          matchesDesire = swell.height < 1.5 && swell.period >= 7 && swell.period <= 12;
        }

        if (!matchesDesire) {
          return null;
        }

        // Categorize for display (use original logic)
        const categorized = categorizeSwell(swell, desire);

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

        if (!flight || !validateFlightOffer(flight)) {
          return null;
        }

        const price = parseFloat(flight.price.total);
        if (isNaN(price) || price <= 0) {
          return null;
        }

        const windAlignment = calculateWindAlignment(
          swell.windDirection || 0,
          dest.idealSwellDirection
        );

        const valueScore = calculateValueScore(
          swell.height,
          swell.period,
          windAlignment,
          price
        );

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

    const results = await Promise.all(destinationPromises);
    const validDeals = results.filter((deal): deal is NonNullable<typeof deal> => deal !== null);
    deals.push(...validDeals);

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
        criteria: 'relaxed',
        message: deals.length === 0 
          ? `No ${desire} conditions found even with relaxed criteria.`
          : `Found ${deals.length} deals with relaxed criteria.`,
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


