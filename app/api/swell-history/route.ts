import { NextRequest, NextResponse } from 'next/server';
import { fetchHistoricalSwell } from '@/lib/api/historical';
import { GOLDEN_20_DESTINATIONS } from '@/lib/destinations';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/swell-history
 * Fetch historical swell data for a destination
 * 
 * Query params:
 * - destination: airport code (required)
 * - days: number of days back (default: 30)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const destinationCode = searchParams.get('destination');
    const daysBack = parseInt(searchParams.get('days') || '30');

    if (!destinationCode) {
      return NextResponse.json(
        { error: 'Destination airport code is required' },
        { status: 400 }
      );
    }

    const stormglassKey = process.env.STORMGLASS_API_KEY;
    if (!stormglassKey) {
      return NextResponse.json(
        { error: 'STORMGLASS_API_KEY not configured' },
        { status: 500 }
      );
    }

    // Find destination
    const destination = GOLDEN_20_DESTINATIONS.find(
      d => d.airportCode === destinationCode.toUpperCase()
    );

    if (!destination) {
      return NextResponse.json(
        { error: `Destination ${destinationCode} not found` },
        { status: 404 }
      );
    }

    // Fetch historical data
    const historicalData = await fetchHistoricalSwell(
      destination.latitude,
      destination.longitude,
      daysBack,
      { apiKey: stormglassKey }
    );

    // Group by day for easier display
    const dailyData = historicalData.reduce((acc, swell, index) => {
      const date = new Date();
      date.setDate(date.getDate() - daysBack + index);
      const dayKey = date.toISOString().split('T')[0];

      if (!acc[dayKey]) {
        acc[dayKey] = {
          date: dayKey,
          heights: [],
          periods: [],
          windSpeeds: [],
        };
      }

      acc[dayKey].heights.push(swell.height);
      acc[dayKey].periods.push(swell.period);
      if (swell.windSpeed) acc[dayKey].windSpeeds.push(swell.windSpeed);

      return acc;
    }, {} as Record<string, { date: string; heights: number[]; periods: number[]; windSpeeds: number[] }>);

    // Calculate daily averages and maxes
    const history = Object.values(dailyData).map(day => ({
      date: day.date,
      avgHeight: day.heights.reduce((a, b) => a + b, 0) / day.heights.length,
      maxHeight: Math.max(...day.heights),
      avgPeriod: day.periods.reduce((a, b) => a + b, 0) / day.periods.length,
      maxPeriod: Math.max(...day.periods),
      avgWindSpeed: day.windSpeeds.length > 0
        ? day.windSpeeds.reduce((a, b) => a + b, 0) / day.windSpeeds.length
        : 0,
    }));

    return NextResponse.json({
      destination: destination.name,
      airportCode: destination.airportCode,
      history,
      rawData: historicalData.slice(-24), // Last 24 hours of hourly data
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

