'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { SurfMap } from './SurfMap';
import { DesireToggle } from './DesireToggle';
import { SurfDesire } from '@/lib/surfLogic';
import { Map, Home, Search, Filter } from 'lucide-react';
import { GOLDEN_20_DESTINATIONS } from '@/lib/destinations';

interface Deal {
  destination: string;
  airportCode: string;
  price: number;
  currency: string;
  swellHeight: number;
  swellPeriod: number;
  swellType: 'barrel' | 'log';
  valueScore: number;
}

interface DestinationWithSwell {
  name: string;
  airportCode: string;
  latitude: number;
  longitude: number;
  swell: {
    height: number;
    period: number;
    windSpeed: number;
    windDirection: number;
    type: 'barrel' | 'log';
  } | null;
  hasData: boolean;
}

export function MapView() {
  const [desire, setDesire] = useState<SurfDesire>('barrel');
  const [deals, setDeals] = useState<Deal[]>([]);
  const [destinations, setDestinations] = useState<DestinationWithSwell[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    async function fetchMapData() {
      try {
        setLoading(true);
        const [dealsRes, mapRes] = await Promise.all([
          fetch(`/api/deals?desire=${desire}&limit=50&cache=false`),
          fetch(`/api/map-data?desire=${desire}&t=${Date.now()}`, { cache: 'no-store' }),
        ]);
        if (dealsRes.ok) {
          const d = await dealsRes.json();
          setDeals(d.deals || []);
        }
        if (mapRes.ok) {
          const m = await mapRes.json();
          setDestinations(m.destinations || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMapData();
  }, [desire]);

  const filteredDestinations = useMemo(() => {
    let filtered =
      destinations.length > 0
        ? destinations
        : GOLDEN_20_DESTINATIONS.map((d) => ({ ...d, swell: null, hasData: false }));
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (d) => d.name.toLowerCase().includes(q) || d.airportCode.toLowerCase().includes(q)
      );
    }
    if (desire) {
      filtered = filtered.filter((d) => !d.swell || d.swell.type === desire);
    }
    return filtered;
  }, [destinations, searchQuery, desire]);

  const visibleDeals = useMemo(() => {
    const withPrice = deals.filter((d) =>
      filteredDestinations.some((dest) => dest.name === d.destination || dest.airportCode === d.airportCode)
    );
    const swellOnly = filteredDestinations
      .filter(
        (d) =>
          d.swell &&
          d.hasData &&
          !withPrice.some((deal) => deal.airportCode === d.airportCode)
      )
      .map((d) => ({
        destination: d.name,
        airportCode: d.airportCode,
        price: 0,
        currency: 'USD',
        swellHeight: d.swell!.height,
        swellPeriod: d.swell!.period,
        swellType: d.swell!.type,
        valueScore: 0,
        hasPrice: false,
      }));
    return [...withPrice, ...swellOnly];
  }, [deals, filteredDestinations]);

  return (
    <div className="min-h-screen bg-surf-bg flex flex-col">
      <header className="sticky top-0 z-50 bg-surf-surface/95 backdrop-blur-md border-b border-surf-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-surf-surface-elevated transition-colors font-medium text-sm"
              >
                <Home className="w-4 h-4" />
                Dashboard
              </Link>
              <div className="h-6 w-px bg-surf-border" />
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-surf-accent/15">
                  <Map className="w-4 h-4 text-surf-accent" />
                </div>
                <h1 className="text-lg font-semibold text-white">Surf Map</h1>
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-colors ${
                showFilters
                  ? 'bg-surf-accent/15 text-surf-accent border border-surf-accent/30'
                  : 'bg-surf-surface-elevated text-slate-400 hover:text-white border border-surf-border'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>
      </header>

      {showFilters && (
        <div className="border-b border-surf-border bg-surf-surface/80">
          <div className="container mx-auto px-6 py-4">
            <div className="flex flex-col md:flex-row gap-4 md:items-center">
              <div className="flex-1 w-full md:w-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search destinations, spots, airports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-surf-bg border border-surf-border text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-surf-accent/50 focus:border-surf-accent/50 transition-all"
                  />
                </div>
              </div>
              <div className="flex-shrink-0">
                <label className="block text-sm font-medium text-slate-500 mb-2">Surf type</label>
                <DesireToggle currentDesire={desire} onDesireChange={setDesire} />
              </div>
              <div className="flex-shrink-0 text-sm text-slate-500">
                <span className="text-white font-semibold">{visibleDeals.filter((d) => (d as { hasPrice?: boolean }).hasPrice !== false).length}</span> deals
                <span className="mx-1">•</span>
                <span className="text-white font-semibold">{filteredDestinations.filter((d) => d.hasData).length}</span> with swell
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 relative min-h-0">
        <div className="absolute inset-0 w-full h-full">
          <SurfMap deals={visibleDeals} filterType={desire} />
        </div>
      </div>

      <footer className="px-6 py-3 border-t border-surf-border bg-surf-surface/80">
        <div className="container mx-auto flex items-center justify-between text-xs text-slate-500">
          <span>
            <span className="text-white font-medium">{visibleDeals.filter((d) => (d as { hasPrice?: boolean }).hasPrice !== false).length}</span> deals
            <span className="mx-1">•</span>
            <span className="text-white font-medium">{filteredDestinations.filter((d) => d.hasData).length}</span> spots with swell
            {searchQuery && (
              <span> for &quot;<span className="text-white">{searchQuery}</span>&quot;</span>
            )}
          </span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-surf-accent" />
              <span>Barrels</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-surf-emerald" />
              <span>Logs</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
