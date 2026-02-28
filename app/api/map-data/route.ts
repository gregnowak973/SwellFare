import { NextRequest, NextResponse } from 'next/server';
import { fetchCurrentSwell } from '@/lib/api/stormglass';
import { checkSwellWindow } from '@/lib/api/swellWindow';
import { GOLDEN_20_DESTINATIONS } from '@/lib/destinations';
import { isBarrelCondition, isLogCondition } from '@/lib/surfLogic';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/map-data
 * Fetch real-time swell data for all destinations on the map
 * This provides current conditions even if there are no deals
 */
export async function GET(request: NextRequest) {
  try {
    const stormglassKey = process.env.STORMGLASS_API_KEY;

    if (!stormglassKey) {
      return NextResponse.json(
        { 
          error: 'STORMGLASS_API_KEY not configured',
          destinations: GOLDEN_20_DESTINATIONS.map(dest => ({
            ...dest,
            swell: null,
            hasData: false,
          }))
        },
        { status: 200 } // Return 200 so map still works, just without real data
      );
    }

    // Get desire type from query params (optional, defaults to checking both)
    const searchParams = request.nextUrl.searchParams;
    const desire = (searchParams.get('desire') as 'barrel' | 'log') || null;

    // Fetch swell data for all destinations in parallel
    // Check 14-day window (7 days back + 7 days forward) for each destination
    const destinationData = await Promise.all(
      GOLDEN_20_DESTINATIONS.map(async (dest) => {
        try {
          // Check 14-day window for good surf
          // If no desire specified, check for barrel conditions (more common)
          const checkDesire = desire || 'barrel';
          const windowResult = await checkSwellWindow(
            dest.latitude,
            dest.longitude,
            7, // days back
            7, // days forward
            checkDesire,
            { apiKey: stormglassKey }
          );

          if (!windowResult.hasGoodSurf || !windowResult.bestConditions) {
            // Also check the other type if no desire specified
            if (!desire) {
              const otherDesire = checkDesire === 'barrel' ? 'log' : 'barrel';
              const otherWindowResult = await checkSwellWindow(
                dest.latitude,
                dest.longitude,
                7,
                7,
                otherDesire,
                { apiKey: stormglassKey }
              );
              
              if (otherWindowResult.hasGoodSurf && otherWindowResult.bestConditions) {
                // Use the better conditions from either type
                const best = windowResult.bestConditions && 
                  (windowResult.bestConditions.height * windowResult.bestConditions.period) >
                  (otherWindowResult.bestConditions.height * otherWindowResult.bestConditions.period)
                  ? windowResult.bestConditions : otherWindowResult.bestConditions;
                
                const swell = best;
                const barrelMatch = isBarrelCondition(swell);
                const logMatch = isLogCondition(swell);
                const swellType = barrelMatch && swell.height > 1.0 ? 'barrel' : 'log';
                
                return {
                  ...dest,
                  swell: {
                    height: swell.height,
                    period: swell.period,
                    windSpeed: swell.windSpeed || 0,
                    windDirection: swell.windDirection || 0,
                    type: swellType,
                  },
                  hasData: true,
                };
              }
            }
            
            return {
              ...dest,
              swell: null,
              hasData: false,
            };
          }

          // Use best conditions from the window
          const swell = windowResult.bestConditions;
          const barrelMatch = isBarrelCondition(swell);
          const logMatch = isLogCondition(swell);
          
          let swellType: 'barrel' | 'log';
          if (barrelMatch && logMatch) {
            swellType = swell.height > 1.0 ? 'barrel' : 'log';
          } else if (barrelMatch) {
            swellType = 'barrel';
          } else if (logMatch) {
            swellType = 'log';
          } else {
            swellType = swell.height > 1.0 ? 'barrel' : 'log';
          }

          return {
            ...dest,
            swell: {
              height: swell.height,
              period: swell.period,
              windSpeed: swell.windSpeed || 0,
              windDirection: swell.windDirection || 0,
              type: swellType,
            },
            hasData: true,
          };
        } catch (error) {
          console.error(`Error fetching swell for ${dest.name}:`, error);
          return {
            ...dest,
            swell: null,
            hasData: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      })
    );

    return NextResponse.json({
      destinations: destinationData,
      timestamp: new Date().toISOString(),
      total: destinationData.length,
      withData: destinationData.filter(d => d.hasData).length,
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      },
    });
  } catch (error) {
    console.error('Error in map-data API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch map data',
        message: error instanceof Error ? error.message : 'Unknown error',
        destinations: GOLDEN_20_DESTINATIONS.map(dest => ({
          ...dest,
          swell: null,
          hasData: false,
        }))
      },
      { status: 500 }
    );
  }
}

