import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import { fetchCurrentSwell } from '@/lib/api/stormglass';
import { GOLDEN_20_DESTINATIONS } from '@/lib/destinations';

export const runtime = 'nodejs';

/**
 * POST /api/sync-swell-data
 * Sync current swell data for all destinations to database
 * This should be called periodically (via cron or scheduled function)
 */
export async function POST(request: NextRequest) {
  try {
    const stormglassKey = process.env.STORMGLASS_API_KEY;

    if (!stormglassKey) {
      return NextResponse.json(
        { error: 'STORMGLASS_API_KEY not configured' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();
    let synced = 0;
    let errors = 0;

    // Get all destinations from database
    const { data: destinations, error: destError } = await supabase
      .from('destinations')
      .select('*');

    if (destError || !destinations) {
      return NextResponse.json(
        { error: 'Failed to fetch destinations', message: destError?.message },
        { status: 500 }
      );
    }

    // Sync swell data for each destination
    for (const dest of destinations) {
      try {
        const swell = await fetchCurrentSwell(
          dest.latitude,
          dest.longitude,
          { apiKey: stormglassKey }
        );

        if (!swell) {
          errors++;
          continue;
        }

        // Determine swell type
        const type = swell.height > 1.5 && swell.period > 12 ? 'barrel' : 'log';

        // Insert swell data
        const { error: insertError } = await supabase
          .from('swell_data')
          .insert({
            destination_id: dest.id,
            height: swell.height,
            period: swell.period,
            wind_speed: swell.windSpeed || 0,
            wind_direction: swell.windDirection || 0,
            type,
            timestamp: new Date().toISOString(),
          });

        if (insertError) {
          console.error(`Error inserting swell data for ${dest.name}:`, insertError);
          errors++;
        } else {
          synced++;
        }
      } catch (error) {
        console.error(`Error syncing ${dest.name}:`, error);
        errors++;
      }
    }

    return NextResponse.json({
      success: true,
      synced,
      errors,
      total: destinations.length,
    });
  } catch (error) {
    console.error('Error syncing swell data:', error);
    return NextResponse.json(
      { error: 'Failed to sync swell data', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


