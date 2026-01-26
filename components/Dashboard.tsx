'use client';

import { useState, useEffect, useMemo } from 'react';
import { DealCard, DealCardProps } from './DealCard';
import { DesireToggle } from './DesireToggle';
import { SurfFareFeed } from './SurfFareFeed';
import { BoardBagCalculator } from './BoardBagCalculator';
import { StrikeAlerts } from './StrikeAlerts';
import { SurfDesire } from '@/lib/surfLogic';

// Mock data - fallback when API is not available
const mockDeals: DealCardProps[] = [
  // Prime Strikes (Swell > 3ft AND Period > 10s AND Flight < $500)
  {
    destination: 'Nosara, Costa Rica',
    airportCode: 'SJO',
    price: 420,
    currency: 'USD',
    swellHeight: 1.2, // ~4ft
    swellPeriod: 12,
    swellType: 'log',
    valueScore: 0.034,
    departureDate: '2024-02-16',
    returnDate: '2024-02-23',
    windSpeed: 10,
    windDirection: 90,
  },
  {
    destination: 'Malibu, California',
    airportCode: 'LAX',
    price: 380,
    currency: 'USD',
    swellHeight: 1.0, // ~3.3ft
    swellPeriod: 11,
    swellType: 'log',
    valueScore: 0.029,
    departureDate: '2024-02-18',
    returnDate: '2024-02-25',
    windSpeed: 8,
    windDirection: 270,
  },
  {
    destination: 'Tamarindo, Costa Rica',
    airportCode: 'LIR',
    price: 450,
    currency: 'USD',
    swellHeight: 1.1, // ~3.6ft
    swellPeriod: 13,
    swellType: 'barrel',
    valueScore: 0.032,
    departureDate: '2024-02-20',
    returnDate: '2024-02-27',
    windSpeed: 12,
    windDirection: 225,
  },
  // Regular deals
  {
    destination: 'Pipeline, Oahu',
    airportCode: 'HNL',
    price: 650,
    currency: 'USD',
    swellHeight: 2.1,
    swellPeriod: 14,
    swellType: 'barrel',
    valueScore: 0.045,
    departureDate: '2024-02-15',
    returnDate: '2024-02-22',
    windSpeed: 12,
    windDirection: 180,
  },
  {
    destination: 'Raglan, New Zealand',
    airportCode: 'AKL',
    price: 680,
    currency: 'USD',
    swellHeight: 1.8,
    swellPeriod: 13,
    swellType: 'barrel',
    valueScore: 0.034,
    departureDate: '2024-02-20',
    returnDate: '2024-02-27',
    windSpeed: 15,
    windDirection: 200,
  },
  {
    destination: 'Uluwatu, Bali',
    airportCode: 'DPS',
    price: 720,
    currency: 'USD',
    swellHeight: 2.0,
    swellPeriod: 14,
    swellType: 'barrel',
    valueScore: 0.039,
    departureDate: '2024-02-22',
    returnDate: '2024-03-01',
    windSpeed: 10,
    windDirection: 225,
  },
  {
    destination: 'Ericeira, Portugal',
    airportCode: 'LIS',
    price: 580,
    currency: 'USD',
    swellHeight: 1.5,
    swellPeriod: 12,
    swellType: 'barrel',
    valueScore: 0.031,
    departureDate: '2024-02-19',
    returnDate: '2024-02-26',
    windSpeed: 14,
    windDirection: 270,
  },
  {
    destination: 'Byron Bay, Australia',
    airportCode: 'BNE',
    price: 890,
    currency: 'USD',
    swellHeight: 0.8,
    swellPeriod: 9,
    swellType: 'log',
    valueScore: 0.008,
    departureDate: '2024-02-25',
    returnDate: '2024-03-04',
    windSpeed: 8,
    windDirection: 135,
  },
  {
    destination: 'Jeffreys Bay, South Africa',
    airportCode: 'CPT',
    price: 920,
    currency: 'USD',
    swellHeight: 2.3,
    swellPeriod: 15,
    swellType: 'barrel',
    valueScore: 0.038,
    departureDate: '2024-02-22',
    returnDate: '2024-03-01',
    windSpeed: 18,
    windDirection: 220,
  },
  {
    destination: 'Canggu, Bali',
    airportCode: 'DPS',
    price: 750,
    currency: 'USD',
    swellHeight: 0.9,
    swellPeriod: 8,
    swellType: 'log',
    valueScore: 0.010,
    departureDate: '2024-02-24',
    returnDate: '2024-03-03',
    windSpeed: 7,
    windDirection: 225,
  },
];

export function Dashboard() {
  const [desire, setDesire] = useState<SurfDesire>('barrel');
  const [deals, setDeals] = useState<DealCardProps[]>(mockDeals);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch real deals from API with debouncing
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    let timeoutId: NodeJS.Timeout;

    async function fetchDeals() {
      try {
        setLoading(true);
        setError(null);
        
        // Add timeout to prevent hanging
        timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        // Add cache-busting timestamp to ensure fresh data
        const timestamp = Date.now();
        const response = await fetch(`/api/deals?desire=${desire}&limit=10&_t=${timestamp}`, {
          signal: controller.signal,
          cache: 'no-store', // Prevent caching
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }

        const data = await response.json();
        
        console.log('API response:', {
          desire,
          dealsCount: data.deals?.length || 0,
          message: data.message,
          timestamp: data.timestamp,
          debug: data.debug,
        });

        // Check if component is still mounted
        if (!isMounted) return;

        if (data.deals && data.deals.length > 0) {
          console.log('Setting real deals:', data.deals.length);
          setDeals(data.deals);
          setError(null);
        } else {
          // Fall back to mock data if API returns no deals
          // Filter mock data by desire
          const filteredMock = mockDeals.filter(deal => deal.swellType === desire);
          console.log('Using mock data (filtered):', filteredMock.length);
          setDeals(filteredMock);
          
          // Build detailed error message
          let errorMsg = 'No deals found. Showing sample data.';
          if (data.message) {
            errorMsg = data.message;
          }
          if (data.debug) {
            errorMsg += ` (Debug: ${JSON.stringify(data.debug)})`;
          }
          setError(errorMsg);
        }
      } catch (err) {
        console.error('Error fetching deals:', err);
        // Fall back to mock data on error - filter by desire
        const filteredMock = mockDeals.filter(deal => deal.swellType === desire);
        console.log('Error - using filtered mock data:', filteredMock.length);
        setDeals(filteredMock);
        if (err instanceof Error && err.name === 'AbortError') {
          setError('Request timed out. Showing sample data. API may be slow or unavailable.');
        } else {
          setError('Failed to load real-time data. Showing sample data.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    // Debounce rapid filter changes (300ms)
    const debounceTimer = setTimeout(() => {
      fetchDeals();
    }, 300);

    // Cleanup function
    return () => {
      isMounted = false;
      clearTimeout(debounceTimer);
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [desire]); // Re-fetch when desire changes

  // Filter deals by current surf desire and get top 10
  // Note: API already filters by desire, but we filter again in case of mock data fallback
  // Also ensures UI updates immediately when deals change
  const filteredDeals = useMemo(() => {
    return deals
      .filter(deal => deal.swellType === desire)
      .sort((a, b) => b.valueScore - a.valueScore)
      .slice(0, 10);
  }, [deals, desire]);

  // Debug logging
  useEffect(() => {
    console.log('Dashboard state:', {
      desire,
      dealsCount: deals.length,
      filteredCount: filteredDeals.length,
      loading,
      error,
    });
  }, [desire, deals, filteredDeals, loading, error]);

  return (
    <div className="min-h-screen bg-deep-sea-bg">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">SwellFare</h1>
          <p className="text-slate-400 text-lg">
            Discovery engine for surfers: Find cheap flights to perfect swells
          </p>
          {error && (
            <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-400 text-sm">{error}</p>
            </div>
          )}
          {loading && (
            <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
              <p className="text-blue-400 text-sm">
                Loading real-time surf and flight data for <strong>{desire === 'barrel' ? 'Heaving Barrels' : 'Soft & Longboard'}</strong>... This may take 10-30 seconds.
              </p>
            </div>
          )}
          <div className="mt-2 text-xs text-slate-500">
            Showing {filteredDeals.length} {desire === 'barrel' ? 'barrel' : 'log'} deals
          </div>
        </div>

        {/* Top Row: Skill Filter and Strike Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Skill Filter
              </label>
              <DesireToggle currentDesire={desire} onDesireChange={setDesire} />
              <p className="text-xs text-slate-500 mt-2">
                {desire === 'barrel' 
                  ? 'Prevents beginners from booking flights to heaving barrels'
                  : 'Perfect for soft, longboard-friendly waves'
                }
              </p>
            </div>
          </div>
          <div>
            <StrikeAlerts />
          </div>
        </div>

        {/* Surf-Fare Feed */}
        <div className="mb-8">
          <SurfFareFeed deals={filteredDeals} />
        </div>

        {/* Board Bag Calculator */}
        <div className="mb-8">
          <BoardBagCalculator />
        </div>
      </div>
    </div>
  );
}

