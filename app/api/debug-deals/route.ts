import { NextRequest, NextResponse } from 'next/server';
import { fetchCurrentSwell } from '@/lib/api/stormglass';
import { getCheapestFlight } from '@/lib/api/amadeus';
import { GOLDEN_20_DESTINATIONS } from '@/lib/destinations';
import { categorizeSwell } from '@/lib/surfLogic';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/debug-deals
 * Debug endpoint to see why deals aren't being found
 * Shows detailed information about each destination check
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const desire = (searchParams.get('desire') || 'barrel') as 'barrel' | 'log';
    const limit = parseInt(searchParams.get('limit') || '5');

    const stormglassKey = process.env.STORMGLASS_API_KEY;
    const amadeusClientId = process.env.AMADEUS_CLIENT_ID;
    const amadeusClientSecret = process.env.AMADEUS_CLIENT_SECRET;

    if (!stormglassKey || !amadeusClientId || !amadeusClientSecret) {
      return NextResponse.json({
        error: 'API keys not configured',
      }, { status: 400 });
    }

    const debugInfo = [];
    const destinationsToCheck = GOLDEN_20_DESTINATIONS.slice(0, limit);

    for (const dest of destinationsToCheck) {
      const destDebug: any = {
        destination: dest.name,
        airportCode: dest.airportCode,
        checks: {},
      };

      try {
        // Check Stormglass
        const swell = await fetchCurrentSwell(
          dest.latitude,
          dest.longitude,
          { apiKey: stormglassKey }
        );

        destDebug.checks.stormglass = swell
          ? {
              success: true,
              height: swell.height,
              period: swell.period,
              windSpeed: swell.windSpeed,
              windDirection: swell.windDirection,
            }
          : { success: false, error: 'No swell data returned' };

        if (swell) {
          // Check categorization
          const categorized = categorizeSwell(swell, desire);
          destDebug.checks.categorization = {
            type: categorized.type,
            isMatch: categorized.isMatch,
            barrelCondition: swell.height > 1.5 && swell.period > 12,
            logCondition: swell.height < 1.2 && swell.period >= 8 && swell.period <= 11,
            actualHeight: swell.height,
            actualPeriod: swell.period,
          };

          // Only check Amadeus if swell matches
          if (categorized.isMatch) {
            const departureDate = new Date();
            departureDate.setDate(departureDate.getDate() + 7);
            const returnDate = new Date(departureDate);
            returnDate.setDate(returnDate.getDate() + 7);

            try {
              const flight = await getCheapestFlight(
                {
                  originCode: 'LAX',
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

              destDebug.checks.amadeus = flight
                ? {
                    success: true,
                    price: flight.price.total,
                    currency: flight.price.currency,
                  }
                : { success: false, error: 'No flight found' };
            } catch (error) {
              destDebug.checks.amadeus = {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
              };
            }
          } else {
            destDebug.checks.amadeus = {
              skipped: true,
              reason: 'Swell does not match desire criteria',
            };
          }
        }
      } catch (error) {
        destDebug.checks.error = error instanceof Error ? error.message : 'Unknown error';
      }

      debugInfo.push(destDebug);
    }

    return NextResponse.json({
      desire,
      destinationsChecked: limit,
      debugInfo,
      summary: {
        withSwellData: debugInfo.filter(d => d.checks.stormglass?.success).length,
        matchingDesire: debugInfo.filter(d => d.checks.categorization?.isMatch).length,
        withFlights: debugInfo.filter(d => d.checks.amadeus?.success).length,
        completeDeals: debugInfo.filter(
          d => d.checks.stormglass?.success && 
               d.checks.categorization?.isMatch && 
               d.checks.amadeus?.success
        ).length,
      },
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

