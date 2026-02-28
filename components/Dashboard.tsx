'use client';

import { useState, useEffect, useMemo } from 'react';
import { DealCard, DealCardProps } from './DealCard';
import { DesireToggle } from './DesireToggle';
import { SurfFareFeed } from './SurfFareFeed';
import { BoardBagCalculator } from './BoardBagCalculator';
import { StrikeAlerts } from './StrikeAlerts';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { SurfDesire } from '@/lib/surfLogic';
import { Waves, MapPin, Activity } from 'lucide-react';

const SurfMap = dynamic(
  () => import('./SurfMap').then((mod) => ({ default: mod.SurfMap })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[560px] w-full rounded-2xl bg-surf-surface border border-surf-border flex items-center justify-center overflow-hidden">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-surf-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm font-medium">Loading map...</p>
        </div>
      </div>
    ),
  }
);

export function Dashboard() {
  const [desire, setDesire] = useState<SurfDesire>('barrel');
  const [barrelDeals, setBarrelDeals] = useState<DealCardProps[]>([]);
  const [logDeals, setLogDeals] = useState<DealCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadedTypes, setLoadedTypes] = useState<Set<'barrel' | 'log'>>(new Set());

  const deals = useMemo(() => {
    const cached = desire === 'barrel' ? barrelDeals : logDeals;
    return cached;
  }, [desire, barrelDeals, logDeals]);

  useEffect(() => {
    let isMounted = true;
    const controllers = { barrel: new AbortController(), log: new AbortController() };
    const timeouts: { barrel: NodeJS.Timeout | null; log: NodeJS.Timeout | null } = { barrel: null, log: null };

    async function fetchDealsForType(type: SurfDesire) {
      try {
        if (!isMounted) return;
        if (!loadedTypes.has('barrel') && !loadedTypes.has('log')) setLoading(true);
        setError(null);
        timeouts[type] = setTimeout(() => { if (isMounted) controllers[type].abort(); }, 30000);

        const response = await fetch(`/api/deals?desire=${type}&limit=10&cache=false&_t=${Date.now()}`, {
          signal: controllers[type].signal,
          cache: 'no-store',
        });

        if (timeouts[type]) { clearTimeout(timeouts[type]!); timeouts[type] = null; }
        if (!response.ok) throw new Error(`API error (${response.status})`);

        const data = await response.json();
        if (!isMounted) return;

        if (data.deals) {
          if (type === 'barrel') setBarrelDeals(data.deals);
          else setLogDeals(data.deals);
          if (data.deals.length === 0 && type === desire) {
            setError(data.debug?.message || data.message || 'No deals found.');
          } else setError(null);
        } else {
          if (type === 'barrel') setBarrelDeals([]);
          else setLogDeals([]);
          if (type === desire) setError('API returned unexpected data format.');
        }
      } catch (err) {
        if (!isMounted) return;
        if (type === 'barrel') setBarrelDeals([]);
        else setLogDeals([]);
        setLoadedTypes(prev => new Set([...prev, type]));
        if (type === desire) {
          setError(err instanceof Error && err.name === 'AbortError' ? 'Request timed out.' : 'Failed to load data. Check API keys.');
        }
      } finally {
        setLoadedTypes(prev => {
          const updated = new Set([...prev, type]);
          if (isMounted && (updated.size === 2 || (updated.size === 1 && type === desire))) setLoading(false);
          return updated;
        });
      }
    }

    fetchDealsForType('barrel');
    fetchDealsForType('log');

    return () => {
      isMounted = false;
      if (timeouts.barrel) clearTimeout(timeouts.barrel);
      if (timeouts.log) clearTimeout(timeouts.log);
      controllers.barrel.abort();
      controllers.log.abort();
    };
  }, []);

  useEffect(() => {
    const currentDeals = desire === 'barrel' ? barrelDeals : logDeals;
    setLoading(false);
    if (currentDeals.length === 0 && loadedTypes.has(desire)) {
      const otherType = desire === 'barrel' ? 'Soft & Longboard' : 'Heaving Barrels';
      setError(`No ${desire} deals found. Try "${otherType}" for more options.`);
    } else if (currentDeals.length > 0) setError(null);
  }, [desire, barrelDeals, logDeals, loadedTypes]);

  const filteredDeals = useMemo(() => {
    return deals
      .filter(deal => deal.swellType === desire)
      .sort((a, b) => b.valueScore - a.valueScore)
      .slice(0, 10);
  }, [deals, desire]);

  return (
    <div className="min-h-screen bg-surf-bg">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-surf-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-surf-accent/5 via-transparent to-surf-emerald/5" />
        <div className="absolute top-20 -right-20 w-96 h-96 bg-surf-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-72 h-72 bg-surf-emerald/10 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-6 py-12 md:py-16 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surf-accent/10 border border-surf-accent/20 text-surf-accent text-sm font-medium mb-6">
                <Waves className="w-4 h-4" />
                Real-time swell & flight data
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-4">
                Find flights to
                <span className="bg-gradient-to-r from-surf-accent to-surf-emerald bg-clip-text text-transparent"> perfect swells</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-400 max-w-xl leading-relaxed">
                Match your style with cheap flights to surf destinations. Barrels or longboard—we&apos;ve got you covered.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/map"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-surf-surface border border-surf-border hover:border-surf-accent/50 hover:bg-surf-surface-elevated text-white font-medium text-sm transition-all duration-200"
              >
                <MapPin className="w-4 h-4 text-surf-accent" />
                Full map view
              </Link>
              <Link
                href="/debug"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-surf-surface/50 border border-surf-border/50 hover:bg-surf-surface text-slate-400 hover:text-slate-300 text-sm transition-colors"
              >
                <Activity className="w-4 h-4" />
                Debug
              </Link>
            </div>
          </div>

          {/* Filter + Strike Alerts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-slate-400 mb-3">Your style</label>
              <DesireToggle currentDesire={desire} onDesireChange={setDesire} />
              <p className="text-xs text-slate-500 mt-2">
                {desire === 'barrel' ? 'Bigger waves • Height > 0.8m • Period > 9s' : 'Mellow waves • Height < 1.8m • Period 6–14s'}
              </p>
            </div>
            <div>
              <StrikeAlerts />
            </div>
          </div>

          {error && (
            <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
              <span className="text-amber-400 text-xl">⚠</span>
              <div className="flex-1">
                <p className="text-amber-200 font-medium text-sm">No deals found</p>
                <p className="text-amber-200/80 text-sm mt-0.5">{error}</p>
                {error.includes('Try') && (
                  <button
                    onClick={() => setDesire(desire === 'barrel' ? 'log' : 'barrel')}
                    className="mt-3 px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-200 text-sm font-medium"
                  >
                    Switch to {desire === 'barrel' ? 'Soft & Longboard' : 'Heaving Barrels'}
                  </button>
                )}
              </div>
            </div>
          )}

          {loading && (
            <div className="mt-6 p-4 rounded-xl bg-surf-accent/10 border border-surf-accent/20 flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-surf-accent border-t-transparent rounded-full animate-spin" />
              <p className="text-surf-accent text-sm">
                Loading surf & flight data for <strong>{desire === 'barrel' ? 'Heaving Barrels' : 'Soft & Longboard'}</strong>...
              </p>
            </div>
          )}

          <p className="mt-4 text-sm text-slate-500">
            {filteredDeals.length} {desire === 'barrel' ? 'barrel' : 'log'} deals
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <SurfFareFeed deals={filteredDeals} />

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <BoardBagCalculator />
          </div>
          <div className="lg:col-span-7">
            <div className="h-[560px] w-full rounded-2xl overflow-hidden border border-surf-border bg-surf-surface">
              <div className="flex items-center justify-between px-4 py-3 border-b border-surf-border bg-surf-surface-elevated">
                <span className="text-sm font-medium text-slate-300">
                  {filteredDeals.length} destinations
                </span>
                <span className="text-xs text-slate-500">Click a marker to scroll to deal</span>
              </div>
              <SurfMap
                deals={filteredDeals}
                filterType={desire}
                onMarkerClick={(destination) => {
                  const slug = destination.replace(/[\s,]+/g, '-');
                  const el = document.getElementById(`deal-${slug}`);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
