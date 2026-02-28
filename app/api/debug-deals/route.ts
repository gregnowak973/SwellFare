import { NextRequest, NextResponse } from 'next/server';
import { fetchCurrentSwell } from '@/lib/api/stormglass';
import { checkSwellWindow } from '@/lib/api/swellWindow';
import { getCheapestFlight, searchFlights } from '@/lib/api/amadeus';
import { GOLDEN_20_DESTINATIONS } from '@/lib/destinations';
import { isBarrelCondition, isLogCondition } from '@/lib/surfLogic';

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
    const detailed = searchParams.get('detailed') === 'true';

    const stormglassKey = process.env.STORMGLASS_API_KEY;
    const amadeusClientId = process.env.AMADEUS_CLIENT_ID;
    const amadeusClientSecret = process.env.AMADEUS_CLIENT_SECRET;

    const results: any[] = [];

    // Check destinations in smaller batches to avoid rate limits
    const destinationsToCheck = GOLDEN_20_DESTINATIONS.slice(0, 10); // Limit to 10 for debug page
    const destinationPromises = destinationsToCheck.map(async (dest, index) => {
      // Add delay between requests to avoid rate limiting
      if (index > 0) {
        await new Promise(resolve => setTimeout(resolve, 300)); // 300ms delay
      }
      const result: any = {
        destination: dest.name,
        airportCode: dest.airportCode,
        latitude: dest.latitude,
        longitude: dest.longitude,
        status: 'error',
        error: null,
        reason: null,
        swellHeight: null,
        swellPeriod: null,
        swellType: null,
        hasGoodSurf: false,
        windowChecked: false,
        bestConditions: null,
      };

      try {
        // Check 6-day window for good surf (optimized for speed)
        if (stormglassKey) {
          const windowResult = await checkSwellWindow(
            dest.latitude,
            dest.longitude,
            3, // days back (reduced from 7)
            3, // days forward (reduced from 7)
            desire,
            { apiKey: stormglassKey }
          );

          result.windowChecked = true;
          result.hasGoodSurf = windowResult.hasGoodSurf;

          if (windowResult.bestConditions) {
            result.swellHeight = windowResult.bestConditions.height;
            result.swellPeriod = windowResult.bestConditions.period;
            result.bestConditions = {
              height: windowResult.bestConditions.height,
              period: windowResult.bestConditions.period,
            };

            // Determine type
            const barrelMatch = isBarrelCondition(windowResult.bestConditions);
            const logMatch = isLogCondition(windowResult.bestConditions);
            
            if (barrelMatch && logMatch) {
              result.swellType = windowResult.bestConditions.height > 1.0 ? 'barrel' : 'log';
            } else if (barrelMatch) {
              result.swellType = 'barrel';
            } else if (logMatch) {
              result.swellType = 'log';
            } else {
              result.swellType = windowResult.bestConditions.height > 1.0 ? 'barrel' : 'log';
            }

            // Check if it matches desire
            const matchesDesire = result.swellType === desire || 
              (desire === 'barrel' && (windowResult.bestConditions.height > 0.2 || windowResult.bestConditions.period > 5)) ||
              (desire === 'log' && windowResult.bestConditions.height < 3.5 && windowResult.bestConditions.period > 3);

            if (matchesDesire && windowResult.bestConditions.height > 0.1 && windowResult.bestConditions.period > 3) {
              result.status = 'success';
              result.reason = `Good ${result.swellType} conditions found in 14-day window`;
            } else {
              result.status = 'filtered-out';
              result.reason = `Conditions don't match ${desire} criteria (Height: ${windowResult.bestConditions.height.toFixed(2)}m, Period: ${windowResult.bestConditions.period.toFixed(1)}s)`;
            }
          } else {
            result.status = 'no-data';
            result.reason = 'No good surf found in 14-day window';
          }
        } else {
          result.error = 'STORMGLASS_API_KEY not configured';
          result.reason = 'API key missing';
        }

        // If detailed, also check for flights
        if (detailed && result.status === 'success' && amadeusClientId && amadeusClientSecret) {
          try {
            const departureDate = new Date();
            departureDate.setDate(departureDate.getDate() + 7);
            const returnDate = new Date(departureDate);
            returnDate.setDate(returnDate.getDate() + 7);

            const flights = await searchFlights(
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

            if (flights && flights.length > 0) {
              result.hasFlight = true;
              result.flightPrice = parseFloat(flights[0].price.total);
              result.reason += ` | Flight: $${result.flightPrice}`;
            } else {
              result.hasFlight = false;
              result.reason += ' | No flights found';
            }
          } catch (flightError) {
            result.hasFlight = false;
            result.flightError = flightError instanceof Error ? flightError.message : 'Unknown error';
          }
        }
      } catch (error) {
        result.status = 'error';
        result.error = error instanceof Error ? error.message : 'Unknown error';
        result.reason = `Error: ${result.error}`;
      }

      return result;
    });

    const allResults = await Promise.all(destinationPromises);

    return NextResponse.json({
      desire,
      timestamp: new Date().toISOString(),
      results: allResults,
      summary: {
        total: allResults.length,
        success: allResults.filter(r => r.status === 'success').length,
        filteredOut: allResults.filter(r => r.status === 'filtered-out').length,
        noData: allResults.filter(r => r.status === 'no-data').length,
        errors: allResults.filter(r => r.status === 'error').length,
        withGoodSurf: allResults.filter(r => r.hasGoodSurf).length,
        windowChecked: allResults.filter(r => r.windowChecked).length,
      },
      apiConfig: {
        stormglassConfigured: !!stormglassKey,
        amadeusConfigured: !!(amadeusClientId && amadeusClientSecret),
      },
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      results: [],
    }, { status: 500 });
  }
}

