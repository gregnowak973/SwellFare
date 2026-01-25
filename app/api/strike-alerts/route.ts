import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Use Node.js runtime for Supabase client compatibility
export const runtime = 'nodejs';

/**
 * POST /api/strike-alerts
 * Create a new strike alert
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, destinationId, originCode, maxPrice, minSwellHeight, minPeriod } = body;

    // Validate required fields
    if (!email || !destinationId || !originCode || !maxPrice) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert or update strike alert
    const { data, error } = await supabase
      .from('strike_alerts')
      .upsert({
        user_email: email,
        destination_id: destinationId,
        origin_code: originCode,
        max_price: maxPrice,
        min_swell_height: minSwellHeight || 0.91, // 3ft default
        min_period: minPeriod || 10,
        is_active: true,
      }, {
        onConflict: 'user_email,destination_id,origin_code',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating strike alert:', error);
      return NextResponse.json(
        { error: 'Failed to create strike alert' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, alert: data });
  } catch (error) {
    console.error('Error in strike alerts API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/strike-alerts?email=user@example.com
 * Get all active strike alerts for a user
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('strike_alerts')
      .select('*')
      .eq('user_email', email)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching strike alerts:', error);
      return NextResponse.json(
        { error: 'Failed to fetch strike alerts' },
        { status: 500 }
      );
    }

    return NextResponse.json({ alerts: data || [] });
  } catch (error) {
    console.error('Error in strike alerts API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
