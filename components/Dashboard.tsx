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
  // Cache deals for both types separately to avoid reloading when switching
  const [barrelDeals, setBarrelDeals] = useState<DealCardProps[]>([]);
  const [logDeals, setLogDeals] = useState<DealCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadedTypes, setLoadedTypes] = useState<Set<'barrel' | 'log'>>(new Set());

  // Get current deals based on desire - instant switch, no re-fetching
  const deals = useMemo(() => {
    const cached = desire === 'barrel' ? barrelDeals : logDeals;
    if (cached.length > 0) {
      return cached;
    }
    // Fallback to mock data while loading
    return mockDeals.filter(deal => deal.swellType === desire);
  }, [desire, barrelDeals, logDeals]);

  // Fetch deals for both types on initial load only
  useEffect(() => {
    let isMounted = true;
    const controllers = {
      barrel: new AbortController(),
      log: new AbortController(),
    };
    const timeouts: { barrel: NodeJS.Timeout | null; log: NodeJS.Timeout | null } = {
      barrel: null,
      log: null,
    };

    async function fetchDealsForType(type: SurfDesire) {
      try {
        if (!isMounted) return;
        
        // Only show loading on initial load (when nothing is cached yet)
        if (!loadedTypes.has('barrel') && !loadedTypes.has('log')) {
          setLoading(true);
        }
        setError(null);
        
        // Add timeout to prevent hanging
        timeouts[type] = setTimeout(() => {
          if (isMounted) {
            controllers[type].abort();
          }
        }, 30000); // 30 second timeout

        // Fetch with cache=false to force API calls if database cache is empty
        const timestamp = Date.now();
        const response = await fetch(`/api/deals?desire=${type}&limit=10&cache=false&_t=${timestamp}`, {
          signal: controllers[type].signal,
          cache: 'no-store',
        });
        
        if (timeouts[type]) {
          clearTimeout(timeouts[type]!);
          timeouts[type] = null;
        }

        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Unknown error');
          throw new Error(`API error (${response.status}): ${errorText || response.statusText}`);
        }

        const data = await response.json();
        
        if (!isMounted) return;

        if (data.deals && data.deals.length > 0) {
          if (process.env.NODE_ENV === 'development') {
            console.log(`✅ Setting real deals for ${type}:`, data.deals.length);
          }
          if (type === 'barrel') {
            setBarrelDeals(data.deals);
          } else {
            setLogDeals(data.deals);
          }
          setError(null);
        } else {
          // Fall back to mock data if API returns no deals
          const filteredMock = mockDeals.filter(deal => deal.swellType === type);
          if (process.env.NODE_ENV === 'development') {
            console.log(`⚠️ Using mock data for ${type}:`, filteredMock.length);
          }
          
          if (type === 'barrel') {
            setBarrelDeals(filteredMock);
          } else {
            setLogDeals(filteredMock);
          }
          
          // Only show error if it's for the currently selected type
          if (type === desire) {
            let errorMsg = 'No deals found. Showing sample data.';
            if (data.debug?.message) {
              errorMsg = data.debug.message;
            } else if (data.message) {
              errorMsg = data.message;
            }
            setError(errorMsg);
          }
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error(`❌ Error fetching deals for ${type}:`, err);
        }
        if (!isMounted) return;
        
        // Fall back to mock data on error
        const filteredMock = mockDeals.filter(deal => deal.swellType === type);
        if (type === 'barrel') {
          setBarrelDeals(filteredMock);
        } else {
          setLogDeals(filteredMock);
        }
        
        // Only show error if it's for the currently selected type
        if (type === desire) {
          if (err instanceof Error && err.name === 'AbortError') {
            setError('Request timed out. Showing sample data. API may be slow or unavailable.');
          } else {
            setError('Failed to load real-time data. Showing sample data.');
          }
        }
      } finally {
        // Mark this type as loaded
        setLoadedTypes(prev => {
          const updated = new Set([...prev, type]);
          if (isMounted && updated.size === 2) {
            // Both types loaded, hide loading
            setLoading(false);
          } else if (isMounted && updated.size === 1 && type === desire) {
            // At least one type loaded, and it's the current desire, hide loading
            setLoading(false);
          }
          return updated;
        });
      }
    }

    // Fetch both types in parallel on initial load
    fetchDealsForType('barrel');
    fetchDealsForType('log');

    // Cleanup function
    return () => {
      isMounted = false;
      if (timeouts.barrel) {
        clearTimeout(timeouts.barrel);
      }
      if (timeouts.log) {
        clearTimeout(timeouts.log);
      }
      controllers.barrel.abort();
      controllers.log.abort();
    };
  }, []); // Only run once on mount

  // Update error message when switching filters - NO API CALLS, just UI updates
  useEffect(() => {
    // This effect ONLY runs when switching filters (desire changes)
    // It does NOT trigger any API calls - data is already cached
    const currentDeals = desire === 'barrel' ? barrelDeals : logDeals;
    
    // Ensure loading is always false when switching (data is cached)
    setLoading(false);
    
    if (currentDeals.length === 0 && loadedTypes.has(desire)) {
      // This type was loaded but has no deals
      const otherType = desire === 'barrel' ? 'Soft & Longboard' : 'Heaving Barrels';
      setError(`No ${desire} deals found. Try switching to "${otherType}" for more options.`);
    } else if (currentDeals.length > 0) {
      // We have data, clear error
      setError(null);
    }
  }, [desire, barrelDeals, logDeals, loadedTypes]);, [desire]); // Re-fetch when desire changes

  // Filter deals by current surf desire and get top 10
  // The deals array already contains the correct type (from cache), but filter to be safe
  const filteredDeals = useMemo(() => {
    return deals
      .filter(deal => deal.swellType === desire)
      .sort((a, b) => b.valueScore - a.valueScore)
      .slice(0, 10);
  }, [deals, desire]);

  // Debug logging (only in development)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Dashboard state:', {
        desire,
        dealsCount: deals.length,
        filteredCount: filteredDeals.length,
        loading,
        error,
      });
    }
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
            <div className="mt-4 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
              <div className="flex items-start gap-2">
                <span className="text-yellow-400 text-lg">⚠️</span>
                <div className="flex-1">
                  <p className="text-yellow-400 text-sm font-medium mb-1">No Real-Time Deals Found</p>
                  <p className="text-yellow-300/80 text-sm">{error}</p>
                  {error.includes('Try switching') && (
                    <button
                      onClick={() => setDesire(desire === 'barrel' ? 'log' : 'barrel')}
                      className="mt-2 px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 rounded-md text-yellow-400 text-sm font-medium transition-colors"
                    >
                      Switch to {desire === 'barrel' ? 'Soft & Longboard' : 'Heaving Barrels'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
          {loading && (
            <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg animate-pulse">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-blue-400 text-sm">
                  Loading real-time surf and flight data for <strong>{desire === 'barrel' ? 'Heaving Barrels' : 'Soft & Longboard'}</strong>... This may take 3-10 seconds.
                </p>
              </div>
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
                  ? 'Shows destinations with larger, more powerful waves (Height > 0.8m, Period > 9s)'
                  : 'Shows destinations with smaller, longer-period waves (Height < 1.8m, Period 6-14s)'
                }
              </p>
            </div>
          </div>
          <div>
            <StrikeAlerts />
          </div>
        </div>

        {/* Surf-Fare Feed */}
        <div className="mb-8 transition-opacity duration-300">
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

