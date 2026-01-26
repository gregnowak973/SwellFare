import { NextRequest, NextResponse } from 'next/server';
import { fetchCurrentSwell } from '@/lib/api/stormglass';
import { getCheapestFlight } from '@/lib/api/amadeus';
import { GOLDEN_20_DESTINATIONS } from '@/lib/destinations';
import { validateSwellData, validateFlightOffer, validateDeal } from '@/lib/validation';
import { categorizeSwell, calculateValueScore, calculateWindAlignment } from '@/lib/surfLogic';
import { isPrimeStrike } from '@/lib/strikeLogic';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/test-data-flow
 * Test the complete data flow from APIs to UI-ready format
 * This helps verify data is flowing correctly through the system
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const destIndex = parseInt(searchParams.get('dest') || '0');
    const desire = (searchParams.get('desire') || 'barrel') as 'barrel' | 'log';
    const originCode = searchParams.get('origin') || 'LAX';

    const stormglassKey = process.env.STORMGLASS_API_KEY;
    const amadeusClientId = process.env.AMADEUS_CLIENT_ID;
    const amadeusClientSecret = process.env.AMADEUS_CLIENT_SECRET;

    if (!stormglassKey || !amadeusClientId || !amadeusClientSecret) {
      return NextResponse.json({
        error: 'API keys not configured',
        step: 'configuration',
      }, { status: 400 });
    }

    const dest = GOLDEN_20_DESTINATIONS[destIndex];
    if (!dest) {
      return NextResponse.json({
        error: 'Invalid destination index',
        step: 'destination_selection',
      }, { status: 400 });
    }

    const flow = {
      step1_stormglass: {
        started: true,
        completed: false,
        error: null as string | null,
        rawData: null as any,
        validated: false,
      },
      step2_categorization: {
        started: false,
        completed: false,
        error: null as string | null,
        categorized: null as any,
        matchesDesire: false,
      },
      step3_amadeus: {
        started: false,
        completed: false,
        error: null as string | null,
        rawData: null as any,
        validated: false,
        price: null as number | null,
      },
      step4_calculations: {
        started: false,
        completed: false,
        error: null as string | null,
        windAlignment: null as number | null,
        valueScore: null as number | null,
        primeStrike: false,
      },
      step5_final_deal: {
        completed: false,
        deal: null as any,
        validated: false,
        uiReady: false,
      },
    };

    // Step 1: Fetch Stormglass data
    try {
      const swell = await fetchCurrentSwell(
        dest.latitude,
        dest.longitude,
        { apiKey: stormglassKey }
      );

      flow.step1_stormglass.rawData = swell;
      flow.step1_stormglass.validated = swell ? validateSwellData(swell) : false;
      flow.step1_stormglass.completed = !!swell && flow.step1_stormglass.validated;

      if (!swell || !flow.step1_stormglass.validated) {
        flow.step1_stormglass.error = 'No valid swell data returned';
        return NextResponse.json({ flow, summary: 'Failed at Step 1: Stormglass data' });
      }
    } catch (error) {
      flow.step1_stormglass.error = error instanceof Error ? error.message : 'Unknown error';
      return NextResponse.json({ flow, summary: 'Failed at Step 1: Stormglass API error' });
    }

    // Step 2: Categorize swell
    try {
      flow.step2_categorization.started = true;
      const categorized = categorizeSwell(flow.step1_stormglass.rawData, desire);
      flow.step2_categorization.categorized = categorized;
      flow.step2_categorization.matchesDesire = categorized.isMatch;
      flow.step2_categorization.completed = true;

      if (!categorized.isMatch) {
        flow.step2_categorization.error = `Swell does not match ${desire} criteria`;
        return NextResponse.json({ flow, summary: 'Failed at Step 2: Swell does not match desire' });
      }
    } catch (error) {
      flow.step2_categorization.error = error instanceof Error ? error.message : 'Unknown error';
      return NextResponse.json({ flow, summary: 'Failed at Step 2: Categorization error' });
    }

    // Step 3: Fetch Amadeus flight data
    try {
      flow.step3_amadeus.started = true;
      const departureDate = new Date();
      departureDate.setDate(departureDate.getDate() + 7);
      const returnDate = new Date(departureDate);
      returnDate.setDate(returnDate.getDate() + 7);

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

      flow.step3_amadeus.rawData = flight;
      flow.step3_amadeus.validated = flight ? validateFlightOffer(flight) : false;
      flow.step3_amadeus.completed = !!flight && flow.step3_amadeus.validated;

      if (!flight || !flow.step3_amadeus.validated) {
        flow.step3_amadeus.error = 'No valid flight data returned';
        return NextResponse.json({ flow, summary: 'Failed at Step 3: Amadeus data' });
      }

      flow.step3_amadeus.price = parseFloat(flight.price.total);
    } catch (error) {
      flow.step3_amadeus.error = error instanceof Error ? error.message : 'Unknown error';
      return NextResponse.json({ flow, summary: 'Failed at Step 3: Amadeus API error' });
    }

    // Step 4: Calculate values
    try {
      flow.step4_calculations.started = true;
      const swell = flow.step1_stormglass.rawData;
      const price = flow.step3_amadeus.price!;

      const windAlignment = calculateWindAlignment(
        swell.windDirection || 0,
        dest.idealSwellDirection
      );

      const valueScore = calculateValueScore(
        swell.height,
        swell.period,
        windAlignment,
        price
      );

      const primeStrike = isPrimeStrike({
        swellHeight: swell.height,
        swellPeriod: swell.period,
        flightPrice: price,
      });

      flow.step4_calculations.windAlignment = windAlignment;
      flow.step4_calculations.valueScore = valueScore;
      flow.step4_calculations.primeStrike = primeStrike;
      flow.step4_calculations.completed = true;
    } catch (error) {
      flow.step4_calculations.error = error instanceof Error ? error.message : 'Unknown error';
      return NextResponse.json({ flow, summary: 'Failed at Step 4: Calculation error' });
    }

    // Step 5: Create final deal
    try {
      const swell = flow.step1_stormglass.rawData;
      const categorized = flow.step2_categorization.categorized;
      const price = flow.step3_amadeus.price!;

      const deal = {
        destination: dest.name,
        airportCode: dest.airportCode,
        price,
        currency: 'USD',
        swellHeight: swell.height,
        swellPeriod: swell.period,
        swellType: categorized.type,
        valueScore: flow.step4_calculations.valueScore!,
        departureDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        returnDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        windSpeed: swell.windSpeed || 0,
        windDirection: swell.windDirection || 0,
        primeStrike: flow.step4_calculations.primeStrike,
      };

      flow.step5_final_deal.deal = deal;
      flow.step5_final_deal.validated = validateDeal(deal);
      flow.step5_final_deal.uiReady = flow.step5_final_deal.validated;
      flow.step5_final_deal.completed = flow.step5_final_deal.validated;

      if (!flow.step5_final_deal.validated) {
        flow.step5_final_deal.error = 'Deal validation failed';
        return NextResponse.json({ flow, summary: 'Failed at Step 5: Deal validation' });
      }
    } catch (error) {
      flow.step5_final_deal.error = error instanceof Error ? error.message : 'Unknown error';
      return NextResponse.json({ flow, summary: 'Failed at Step 5: Deal creation error' });
    }

    return NextResponse.json({
      success: true,
      flow,
      summary: '✅ Complete data flow successful - data ready for UI',
      deal: flow.step5_final_deal.deal,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

