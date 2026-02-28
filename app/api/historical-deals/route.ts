import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import { fetchHistoricalSwell } from '@/lib/api/historical';
import { GOLDEN_20_DESTINATIONS } from '@/lib/destinations';
import { categorizeSwell, calculateValueScore, calculateWindAlignment } from '@/lib/surfLogic';
import { isPrimeStrike } from '@/lib/strikeLogic';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/historical-deals
 * Fetch historical deals from database and/or API
 * 
 * Query params:
 * - days: number of days back (default: 30)
 * - destination: airport code (optional, all if not specified)
 * - desire: 'barrel' | 'log' (optional)
 * - minValueScore: minimum value score (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const daysBack = parseInt(searchParams.get('days') || '30');
    const destinationCode = searchParams.get('destination');
    const desire = searchParams.get('desire') as 'barrel' | 'log' | null;
    const minValueScore = parseFloat(searchParams.get('minValueScore') || '0');

    const supabase = getSupabaseClient();
    const stormglassKey = process.env.STORMGLASS_API_KEY;

    // Get historical data from database
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);
    const endDate = new Date();

    // Query swell_data table
    let swellQuery = supabase
      .from('swell_data')
      .select(`
        *,
        destinations (
          id,
          name,
          airport_code,
          latitude,
          longitude,
          ideal_swell_direction
        )
      `)
      .gte('timestamp', startDate.toISOString())
      .lte('timestamp', endDate.toISOString())
      .order('timestamp', { ascending: false });

    if (destinationCode) {
      // Get destination ID first
      const { data: dest } = await supabase
        .from('destinations')
        .select('id')
        .eq('airport_code', destinationCode.toUpperCase())
        .single();

      if (dest) {
        swellQuery = swellQuery.eq('destination_id', dest.id);
      }
    }

    if (desire) {
      swellQuery = swellQuery.eq('type', desire);
    }

    const { data: swellData, error: swellError } = await swellQuery;

    if (swellError) {
      console.error('Error fetching historical swell data:', swellError);
    }

    // Query flight_fares table for historical prices
    let fareQuery = supabase
      .from('flight_fares')
      .select(`
        *,
        destinations (
          id,
          name,
          airport_code
        )
      `)
      .gte('departure_date', startDate.toISOString().split('T')[0])
      .lte('departure_date', endDate.toISOString().split('T')[0])
      .order('departure_date', { ascending: false });

    if (destinationCode) {
      const { data: dest } = await supabase
        .from('destinations')
        .select('id')
        .eq('airport_code', destinationCode.toUpperCase())
        .single();

      if (dest) {
        fareQuery = fareQuery.eq('destination_id', dest.id);
      }
    }

    const { data: fareData, error: fareError } = await fareQuery;

    if (fareError) {
      console.error('Error fetching historical fare data:', fareError);
    }

    // Combine and calculate deals
    const deals: any[] = [];

    if (swellData && fareData) {
      // Match swell data with flight fares by destination and date
      for (const swell of swellData) {
        const destination = swell.destinations;
        if (!destination) continue;

        // Find matching fare (same destination, closest date)
        const matchingFare = fareData.find(
          (fare: any) => fare.destination_id === swell.destination_id
        );

        if (!matchingFare) continue;

        const price = parseFloat(matchingFare.price.toString());
        const windAlignment = calculateWindAlignment(
          swell.wind_direction,
          destination.ideal_swell_direction
        );

        const valueScore = calculateValueScore(
          parseFloat(swell.height.toString()),
          parseFloat(swell.period.toString()),
          windAlignment,
          price
        );

        if (valueScore < minValueScore) continue;

        const primeStrike = isPrimeStrike({
          swellHeight: parseFloat(swell.height.toString()),
          swellPeriod: parseFloat(swell.period.toString()),
          flightPrice: price,
        });

        deals.push({
          destination: destination.name,
          airportCode: destination.airport_code,
          price,
          currency: matchingFare.currency,
          swellHeight: parseFloat(swell.height.toString()),
          swellPeriod: parseFloat(swell.period.toString()),
          swellType: swell.type,
          valueScore,
          primeStrike,
          timestamp: swell.timestamp,
          departureDate: matchingFare.departure_date,
          returnDate: matchingFare.return_date,
          windSpeed: parseFloat(swell.wind_speed.toString()),
          windDirection: swell.wind_direction,
        });
      }
    }

    // Sort by timestamp (most recent first) or value score
    deals.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return dateB - dateA;
    });

    return NextResponse.json({
      deals,
      count: deals.length,
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        days: daysBack,
      },
      filters: {
        destination: destinationCode || 'all',
        desire: desire || 'all',
        minValueScore,
      },
    });
  } catch (error) {
    console.error('Error fetching historical deals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch historical deals', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


