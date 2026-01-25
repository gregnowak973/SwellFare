/**
 * Supabase Client Configuration
 * Initialize your Supabase client here
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Database Types (generated from Supabase schema)
 */
export interface Destination {
  id: string;
  name: string;
  airport_code: string;
  latitude: number;
  longitude: number;
  timezone: string;
  ideal_swell_direction: number;
  created_at: string;
  updated_at: string;
}

export interface SwellDataRow {
  id: string;
  destination_id: string;
  timestamp: string;
  height: number;
  period: number;
  wind_speed: number;
  wind_direction: number;
  type: 'barrel' | 'log';
  created_at: string;
}

export interface FlightFare {
  id: string;
  destination_id: string;
  origin_code: string;
  price: number;
  departure_date: string;
  return_date: string;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface SwellFareDeal {
  destination_id: string;
  destination_name: string;
  airport_code: string;
  latitude: number;
  longitude: number;
  timezone: string;
  swell_id: string;
  swell_timestamp: string;
  swell_height: number;
  swell_period: number;
  wind_speed: number;
  wind_direction: number;
  swell_type: 'barrel' | 'log';
  fare_id: string;
  origin_code: string;
  price: number;
  departure_date: string;
  return_date: string;
  currency: string;
  value_score: number;
}

/**
 * Supabase Client Configuration
 * Initialize your Supabase client here
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create Supabase client only if environment variables are set
// This prevents build errors when env vars aren't available
let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.warn('Failed to initialize Supabase client:', error);
  }
} else {
  console.warn('Supabase environment variables are not set');
}

// Export a function that returns the client or throws an error
export function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    throw new Error('Supabase client is not initialized. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.');
  }
  return supabase;
}

// Export the client directly for backward compatibility
// But it will be null if env vars aren't set
export { supabase };

/**
 * Database Types (generated from Supabase schema)
 */
export interface Destination {
  id: string;
  name: string;
  airport_code: string;
  latitude: number;
  longitude: number;
  timezone: string;
  ideal_swell_direction: number;
  created_at: string;
  updated_at: string;
}

export interface SwellDataRow {
  id: string;
  destination_id: string;
  timestamp: string;
  height: number;
  period: number;
  wind_speed: number;
  wind_direction: number;
  type: 'barrel' | 'log';
  created_at: string;
}

export interface FlightFare {
  id: string;
  destination_id: string;
  origin_code: string;
  price: number;
  departure_date: string;
  return_date: string;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface SwellFareDeal {
  destination_id: string;
  destination_name: string;
  airport_code: string;
  latitude: number;
  longitude: number;
  timezone: string;
  swell_id: string;
  swell_timestamp: string;
  swell_height: number;
  swell_period: number;
  wind_speed: number;
  wind_direction: number;
  swell_type: 'barrel' | 'log';
  fare_id: string;
  origin_code: string;
  price: number;
  departure_date: string;
  return_date: string;
  currency: string;
  value_score: number;
}

/**
 * Fetch top deals from the swell_fare_deals view
 */
export async function getTopDeals(
  surfType: 'barrel' | 'log',
  limit: number = 5
): Promise<SwellFareDeal[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('swell_fare_deals')
    .select('*')
    .eq('swell_type', surfType)
    .order('value_score', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching deals:', error);
    throw error;
  }

  return data || [];
}

