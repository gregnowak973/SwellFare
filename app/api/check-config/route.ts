import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * GET /api/check-config
 * Check if API keys are configured and return status
 */
export async function GET() {
  const stormglassKey = process.env.STORMGLASS_API_KEY;
  const amadeusClientId = process.env.AMADEUS_CLIENT_ID;
  const amadeusClientSecret = process.env.AMADEUS_CLIENT_SECRET;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return NextResponse.json({
    apis: {
      stormglass: {
        configured: !!stormglassKey,
        keyLength: stormglassKey?.length || 0,
        keyPrefix: stormglassKey?.substring(0, 10) || 'not set',
      },
      amadeus: {
        configured: !!(amadeusClientId && amadeusClientSecret),
        clientIdLength: amadeusClientId?.length || 0,
        clientSecretLength: amadeusClientSecret?.length || 0,
      },
      supabase: {
        configured: !!(supabaseUrl && supabaseKey),
        urlSet: !!supabaseUrl,
        keySet: !!supabaseKey,
      },
    },
    allConfigured: !!(stormglassKey && amadeusClientId && amadeusClientSecret),
    message: !!(stormglassKey && amadeusClientId && amadeusClientSecret)
      ? 'All API keys are configured'
      : 'Some API keys are missing. Check Vercel environment variables.',
  });
}


