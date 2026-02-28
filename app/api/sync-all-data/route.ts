import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import { fetchCurrentSwell } from '@/lib/api/stormglass';
import { getCheapestFlight } from '@/lib/api/amadeus';
import { GOLDEN_20_DESTINATIONS } from '@/lib/destinations';
import { categorizeSwell, calculateValueScore, calculateWindAlignment } from '@/lib/surfLogic';
import { isPrimeStrike } from '@/lib/strikeLogic';
import { validateSwellData, validateFlightOffer } from '@/lib/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/sync-all-data
 * Preloads and stores swell data and flight prices for all destinations
 * This should be run periodically (e.g., every hour via Vercel Cron)
 * 
 * Query params:
 * - origin: airport code (optional, defaults to 'LAX')
 */
export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const originCode = searchParams.get('origin') || 'LAX';

    const stormglassKey = process.env.STORMGLASS_API_KEY;
    const amadeusClientId = process.env.AMADEUS_CLIENT_ID;
    const amadeusClientSecret = process.env.AMADEUS_CLIENT_SECRET;

    if (!stormglassKey || !amadeusClientId || !amadeusClientSecret) {
      return NextResponse.json({
        error: 'API keys not configured',
      }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    const results = {
      destinationsProcessed: 0,
      swellDataStored: 0,
      flightDataStored: 0,
      errors: [] as string[],
    };

    const departureDate = new Date();
    departureDate.setDate(departureDate.getDate() + 7);
    const returnDate = new Date(departureDate);
    returnDate.setDate(returnDate.getDate() + 7);

    // Process all destinations in parallel batches
    const batchSize = 5; // Process 5 at a time to avoid rate limits
    for (let i = 0; i < GOLDEN_20_DESTINATIONS.length; i += batchSize) {
      const batch = GOLDEN_20_DESTINATIONS.slice(i, i + batchSize);
      
      await Promise.all(batch.map(async (dest) => {
        try {
          results.destinationsProcessed++;

          // Get or create destination in database
          let { data: destination, error: destError } = await supabase
            .from('destinations')
            .select('id')
            .eq('airport_code', dest.airportCode)
            .single();

          if (destError || !destination) {
            // Create destination if it doesn't exist
            const { data: newDest, error: createError } = await supabase
              .from('destinations')
              .insert({
                name: dest.name,
                airport_code: dest.airportCode,
                latitude: dest.latitude,
                longitude: dest.longitude,
                timezone: dest.timezone || 'UTC',
                ideal_swell_direction: dest.idealSwellDirection,
              })
              .select('id')
              .single();

            if (createError || !newDest) {
              results.errors.push(`${dest.name}: Failed to create destination`);
              return;
            }
            destination = newDest;
          }

          const destinationId = destination.id;

          // Fetch and store swell data
          try {
            const swell = await fetchCurrentSwell(
              dest.latitude,
              dest.longitude,
              { apiKey: stormglassKey }
            );

            if (swell && validateSwellData(swell)) {
              const categorized = categorizeSwell(swell, 'barrel'); // Categorize for storage
              
              const { error: swellError } = await supabase
                .from('swell_data')
                .upsert({
                  destination_id: destinationId,
                  timestamp: new Date().toISOString(),
                  height: swell.height,
                  period: swell.period,
                  wind_speed: swell.windSpeed || 0,
                  wind_direction: swell.windDirection || 0,
                  type: categorized.type,
                }, {
                  onConflict: 'destination_id,timestamp',
                });

              if (!swellError) {
                results.swellDataStored++;
              } else {
                results.errors.push(`${dest.name}: Swell data error - ${swellError.message}`);
              }
            }
          } catch (swellErr) {
            results.errors.push(`${dest.name}: Swell fetch error - ${swellErr instanceof Error ? swellErr.message : 'Unknown'}`);
          }

          // Fetch and store flight data
          try {
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

            if (flight && validateFlightOffer(flight)) {
              const price = parseFloat(flight.price.total);
              
              const { error: flightError } = await supabase
                .from('flight_fares')
                .upsert({
                  destination_id: destinationId,
                  origin_code: originCode,
                  price: price.toString(),
                  departure_date: departureDate.toISOString().split('T')[0],
                  return_date: returnDate.toISOString().split('T')[0],
                  currency: 'USD',
                }, {
                  onConflict: 'destination_id,origin_code,departure_date',
                });

              if (!flightError) {
                results.flightDataStored++;
              } else {
                results.errors.push(`${dest.name}: Flight data error - ${flightError.message}`);
              }
            }
          } catch (flightErr) {
            results.errors.push(`${dest.name}: Flight fetch error - ${flightErr instanceof Error ? flightErr.message : 'Unknown'}`);
          }

          // Small delay to avoid rate limits
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          results.errors.push(`Error processing ${dest.name}: ${error instanceof Error ? error.message : 'Unknown'}`);
        }
      }));
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results,
      message: `Synced ${results.destinationsProcessed} destinations. Stored ${results.swellDataStored} swell records and ${results.flightDataStored} flight records.`,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

/**
 * GET /api/sync-all-data
 * Check sync status
 */
export async function GET() {
  try {
    const supabase = getSupabaseClient();
    
    const { count: swellCount } = await supabase
      .from('swell_data')
      .select('*', { count: 'exact', head: true })
      .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()); // Last 24 hours

    const { count: flightCount } = await supabase
      .from('flight_fares')
      .select('*', { count: 'exact', head: true })
      .gte('departure_date', new Date().toISOString().split('T')[0]);

    return NextResponse.json({
      status: 'ok',
      dataFreshness: {
        swellRecordsLast24h: swellCount || 0,
        flightRecordsToday: flightCount || 0,
      },
      message: 'Use POST to trigger sync',
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}


