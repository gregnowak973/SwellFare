import { NextRequest, NextResponse } from 'next/server';
import { fetchSwellData } from '@/lib/api/stormglass';
import { GOLDEN_20_DESTINATIONS } from '@/lib/destinations';

export const runtime = 'nodejs';

/**
 * GET /api/test-historical-data
 * Test what historical data is available from APIs
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const daysBack = parseInt(searchParams.get('days') || '30');
  
  const stormglassKey = process.env.STORMGLASS_API_KEY;
  
  if (!stormglassKey) {
    return NextResponse.json({
      error: 'STORMGLASS_API_KEY not configured',
    }, { status: 400 });
  }

  const results = {
    stormglass: {
      tested: false,
      success: false,
      error: null as string | null,
      historicalRange: null as { start: string; end: string; days: number } | null,
      dataPoints: 0,
    },
    amadeus: {
      note: 'Amadeus API does not provide historical flight prices. Only current/future prices available.',
      historicalAvailable: false,
    },
    recommendations: [] as string[],
  };

  // Test Stormglass historical data
  try {
    results.stormglass.tested = true;
    
    // Test with Malibu (first destination)
    const testDest = GOLDEN_20_DESTINATIONS[0];
    
    // Try to fetch data from X days ago
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);
    
    const swells = await fetchSwellData(
      testDest.latitude,
      testDest.longitude,
      startDate,
      endDate,
      { apiKey: stormglassKey }
    );

    if (swells && swells.length > 0) {
      results.stormglass.success = true;
      results.stormglass.historicalRange = {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        days: daysBack,
      };
      results.stormglass.dataPoints = swells.length;
      
      // Calculate average data points per day
      const avgPerDay = swells.length / daysBack;
      results.recommendations.push(
        `Stormglass provides ~${Math.round(avgPerDay)} data points per day (hourly data)`
      );
      results.recommendations.push(
        `Historical swell data available for at least ${daysBack} days back`
      );
    } else {
      results.stormglass.error = 'No historical data returned';
      results.recommendations.push('Try a shorter date range (7-14 days)');
    }
  } catch (error) {
    results.stormglass.success = false;
    results.stormglass.error = error instanceof Error ? error.message : 'Unknown error';
    
    // Check if it's a date range error
    if (error instanceof Error && error.message.includes('date')) {
      results.recommendations.push('Date range may be too large. Try 7-30 days.');
    }
  }

  // Test different date ranges
  const testRanges = [7, 14, 30, 60, 90];
  results.recommendations.push(
    `Test different ranges: ${testRanges.join(', ')} days back`
  );

  return NextResponse.json({
    summary: {
      stormglassHistorical: results.stormglass.success,
      amadeusHistorical: false,
      recommendation: results.stormglass.success
        ? 'Historical swell data is available. Store it in your database for analysis.'
        : 'Check API limits and date range restrictions.',
    },
    ...results,
  });
}


