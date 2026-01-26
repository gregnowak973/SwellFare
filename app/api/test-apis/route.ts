import { NextRequest, NextResponse } from 'next/server';
import { fetchCurrentSwell } from '@/lib/api/stormglass';
import { getCheapestFlight } from '@/lib/api/amadeus';
import { GOLDEN_20_DESTINATIONS } from '@/lib/destinations';

export const runtime = 'nodejs';

/**
 * GET /api/test-apis
 * Test API connections and return sample data
 * Useful for debugging and verifying API keys are working
 */
export async function GET(request: NextRequest) {
  const results = {
    timestamp: new Date().toISOString(),
    stormglass: {
      configured: !!process.env.STORMGLASS_API_KEY,
      tested: false,
      success: false,
      error: null as string | null,
      data: null as any,
    },
    amadeus: {
      configured: !!(process.env.AMADEUS_CLIENT_ID && process.env.AMADEUS_CLIENT_SECRET),
      tested: false,
      success: false,
      error: null as string | null,
      data: null as any,
    },
  };

  // Test Stormglass API
  if (process.env.STORMGLASS_API_KEY) {
    try {
      results.stormglass.tested = true;
      // Test with Malibu, California (first destination)
      const testDest = GOLDEN_20_DESTINATIONS[0];
      const swell = await fetchCurrentSwell(
        testDest.latitude,
        testDest.longitude,
        { apiKey: process.env.STORMGLASS_API_KEY }
      );

      if (swell) {
        results.stormglass.success = true;
        results.stormglass.data = {
          destination: testDest.name,
          latitude: testDest.latitude,
          longitude: testDest.longitude,
          swell: {
            height: swell.height,
            period: swell.period,
            windSpeed: swell.windSpeed,
            windDirection: swell.windDirection,
          },
        };
      } else {
        results.stormglass.success = false;
        results.stormglass.error = 'No swell data returned';
      }
    } catch (error) {
      results.stormglass.success = false;
      results.stormglass.error = error instanceof Error ? error.message : 'Unknown error';
      console.error('Stormglass API test error:', error);
    }
  } else {
    results.stormglass.error = 'STORMGLASS_API_KEY not configured';
  }

  // Test Amadeus API
  if (process.env.AMADEUS_CLIENT_ID && process.env.AMADEUS_CLIENT_SECRET) {
    try {
      results.amadeus.tested = true;
      // Test with a simple route: LAX to SFO (San Francisco)
      const departureDate = new Date();
      departureDate.setDate(departureDate.getDate() + 7);
      const returnDate = new Date(departureDate);
      returnDate.setDate(returnDate.getDate() + 3);

      const flight = await getCheapestFlight(
        {
          originCode: 'LAX',
          destinationCode: 'SFO',
          departureDate: departureDate.toISOString().split('T')[0],
          returnDate: returnDate.toISOString().split('T')[0],
          currency: 'USD',
        },
        {
          clientId: process.env.AMADEUS_CLIENT_ID,
          clientSecret: process.env.AMADEUS_CLIENT_SECRET,
        }
      );

      if (flight) {
        results.amadeus.success = true;
        results.amadeus.data = {
          route: 'LAX → SFO',
          price: flight.price.total,
          currency: flight.price.currency,
          departureDate: departureDate.toISOString().split('T')[0],
          returnDate: returnDate.toISOString().split('T')[0],
        };
      } else {
        results.amadeus.success = false;
        results.amadeus.error = 'No flight data returned';
      }
    } catch (error) {
      results.amadeus.success = false;
      results.amadeus.error = error instanceof Error ? error.message : 'Unknown error';
      console.error('Amadeus API test error:', error);
    }
  } else {
    results.amadeus.error = 'AMADEUS_CLIENT_ID or AMADEUS_CLIENT_SECRET not configured';
  }

  // Return results
  const allConfigured = results.stormglass.configured && results.amadeus.configured;
  const allWorking = results.stormglass.success && results.amadeus.success;

  return NextResponse.json({
    summary: {
      allConfigured,
      allWorking,
      status: allWorking ? '✅ All APIs working' : allConfigured ? '⚠️ APIs configured but some failing' : '❌ APIs not configured',
    },
    ...results,
  });
}

