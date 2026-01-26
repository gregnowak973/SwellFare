import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import { fetchCurrentSwell } from '@/lib/api/stormglass';
import { getCheapestFlight } from '@/lib/api/amadeus';
import { GOLDEN_20_DESTINATIONS } from '@/lib/destinations';
import { categorizeSwell, calculateValueScore, calculateWindAlignment } from '@/lib/surfLogic';
import { isPrimeStrike } from '@/lib/strikeLogic';

export const runtime = 'nodejs';

/**
 * GET /api/test-deal
 * Test fetching a single deal with real API data
 * Tests one destination end-to-end
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const destinationIndex = parseInt(searchParams.get('dest') || '0');
    const originCode = searchParams.get('origin') || 'LAX';
    const desire = (searchParams.get('desire') || 'barrel') as 'barrel' | 'log';

    // Get API keys
    const stormglassKey = process.env.STORMGLASS_API_KEY;
    const amadeusClientId = process.env.AMADEUS_CLIENT_ID;
    const amadeusClientSecret = process.env.AMADEUS_CLIENT_SECRET;

    if (!stormglassKey || !amadeusClientId || !amadeusClientSecret) {
      return NextResponse.json({
        error: 'API keys not configured',
        message: 'Please add STORMGLASS_API_KEY, AMADEUS_CLIENT_ID, and AMADEUS_CLIENT_SECRET to environment variables.',
      }, { status: 400 });
    }

    const dest = GOLDEN_20_DESTINATIONS[destinationIndex];
    if (!dest) {
      return NextResponse.json({
        error: 'Invalid destination index',
        available: GOLDEN_20_DESTINATIONS.length,
      }, { status: 400 });
    }

    const testResult = {
      destination: dest.name,
      airportCode: dest.airportCode,
      coordinates: {
        latitude: dest.latitude,
        longitude: dest.longitude,
      },
      steps: {
        swellFetch: { started: true, completed: false, error: null as string | null, data: null as any },
        flightFetch: { started: false, completed: false, error: null as string | null, data: null as any },
        calculations: { started: false, completed: false, error: null as string | null, data: null as any },
      },
      finalDeal: null as any,
    };

    // Step 1: Fetch swell data
    try {
      const swell = await fetchCurrentSwell(
        dest.latitude,
        dest.longitude,
        { apiKey: stormglassKey }
      );

      if (!swell) {
        testResult.steps.swellFetch.error = 'No swell data returned';
        return NextResponse.json(testResult);
      }

      testResult.steps.swellFetch.completed = true;
      testResult.steps.swellFetch.data = {
        height: swell.height,
        period: swell.period,
        windSpeed: swell.windSpeed,
        windDirection: swell.windDirection,
      };

      // Step 2: Categorize swell
      const categorized = categorizeSwell(swell, desire);
      testResult.steps.calculations.started = true;

      // Step 3: Fetch flight price
      testResult.steps.flightFetch.started = true;
      const departureDate = new Date();
      departureDate.setDate(departureDate.getDate() + 7);
      const returnDate = new Date(departureDate);
      returnDate.setDate(returnDate.getDate() + 7);

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

      if (!flight) {
        testResult.steps.flightFetch.error = 'No flight data returned';
        return NextResponse.json(testResult);
      }

      testResult.steps.flightFetch.completed = true;
      testResult.steps.flightFetch.data = {
        price: flight.price.total,
        currency: flight.price.currency,
        departureDate: departureDate.toISOString().split('T')[0],
        returnDate: returnDate.toISOString().split('T')[0],
      };

      const price = parseFloat(flight.price.total);

      // Step 4: Calculate values
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

      testResult.steps.calculations.completed = true;
      testResult.steps.calculations.data = {
        windAlignment,
        valueScore,
        primeStrike,
        swellType: categorized.type,
      };

      // Final deal
      testResult.finalDeal = {
        destination: dest.name,
        airportCode: dest.airportCode,
        price,
        currency: 'USD',
        swellHeight: swell.height,
        swellPeriod: swell.period,
        swellType: categorized.type,
        valueScore,
        primeStrike,
        departureDate: departureDate.toISOString().split('T')[0],
        returnDate: returnDate.toISOString().split('T')[0],
        windSpeed: swell.windSpeed || 0,
        windDirection: swell.windDirection || 0,
      };

      return NextResponse.json({
        success: true,
        ...testResult,
      });
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        ...testResult,
      }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

