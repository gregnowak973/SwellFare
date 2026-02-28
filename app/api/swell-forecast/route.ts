import { NextRequest, NextResponse } from 'next/server';
import { fetchSwellData } from '@/lib/api/stormglass';
import { GOLDEN_20_DESTINATIONS } from '@/lib/destinations';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/swell-forecast
 * Fetch forecast swell data for a destination
 * 
 * Query params:
 * - destination: airport code (required)
 * - days: number of days ahead (default: 7)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const destinationCode = searchParams.get('destination');
    const daysAhead = parseInt(searchParams.get('days') || '7');

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

    // Fetch forecast data
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + daysAhead);

    const swellData = await fetchSwellData(
      destination.latitude,
      destination.longitude,
      startDate,
      endDate,
      { apiKey: stormglassKey }
    );

    // Group by day for easier display
    const dailyData = swellData.reduce((acc, swell, index) => {
      const date = new Date(startDate);
      date.setHours(date.getHours() + index);
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
    const forecast = Object.values(dailyData).map(day => ({
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
      forecast,
      rawData: swellData.slice(0, 24), // First 24 hours of hourly data
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


