'use client';

import { useState } from 'react';
import { Waves, Plane, Calendar, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import { SurfDesire } from '@/lib/surfLogic';
import { SwellChart } from './SwellChart';

export interface DealCardProps {
  destination: string;
  airportCode: string;
  price: number;
  currency: string;
  swellHeight: number;
  swellPeriod: number;
  swellType: SurfDesire;
  valueScore: number;
  departureDate: string;
  returnDate: string;
  windSpeed?: number;
  windDirection?: number;
  isPrimeStrike?: boolean;
}

export function DealCard({
    destination,
    airportCode,
    price,
    currency,
    swellHeight,
    swellPeriod,
    swellType,
    valueScore,
  departureDate,
  returnDate,
  isPrimeStrike = false,
}: DealCardProps) {
  const [showForecast, setShowForecast] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const isBarrel = swellType === 'barrel';

  return (
    <article
      className={`
        group relative rounded-2xl border transition-all duration-300 overflow-hidden
        bg-surf-surface/80 backdrop-blur-sm border-surf-border
        hover:border-surf-accent/30 hover:shadow-glow
        ${isPrimeStrike ? 'ring-1 ring-surf-amber/20' : ''}
      `}
    >
      {isPrimeStrike && (
        <div className="absolute top-3 right-3 z-10">
          <span className="px-3 py-1 rounded-full bg-surf-amber/20 text-surf-amber text-xs font-bold border border-surf-amber/30">
            PRIME
          </span>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-surf-accent transition-colors">
              {destination}
            </h3>
            <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
              <Plane className="w-3.5 h-3.5" />
              {airportCode}
            </p>
          </div>
          <div
            className={`
              px-3 py-1.5 rounded-lg text-xs font-semibold border
              ${isBarrel ? 'bg-surf-accent-dim text-surf-accent border-surf-accent/30' : 'bg-surf-emerald-dim text-surf-emerald border-surf-emerald/30'}
            `}
          >
            {isBarrel ? 'Barrels' : 'Logs'}
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-slate-500 text-sm font-mono">Value</span>
          <span className="text-2xl font-bold font-mono text-surf-accent">{valueScore.toFixed(2)}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-xl bg-surf-bg/60 border border-surf-border/50 p-3">
            <div className="flex items-center gap-2 mb-1">
              <Waves className="w-4 h-4 text-surf-accent" />
              <span className="text-xs text-slate-500">Height</span>
            </div>
            <p className="text-lg font-semibold text-white">{swellHeight.toFixed(1)}m</p>
          </div>
          <div className="rounded-xl bg-surf-bg/60 border border-surf-border/50 p-3">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-surf-emerald" />
              <span className="text-xs text-slate-500">Period</span>
            </div>
            <p className="text-lg font-semibold text-white">{swellPeriod}s</p>
          </div>
        </div>

        <div className="border-t border-surf-border pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Flight</span>
            <span className="text-xl font-bold text-surf-emerald">
              {currency} {price.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(departureDate).toLocaleDateString()}
            </div>
            <span>→</span>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(returnDate).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="border-t border-surf-border pt-4 mt-4 space-y-2">
          <button
            onClick={() => setShowForecast(!showForecast)}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-surf-bg/40 hover:bg-surf-bg/60 border border-surf-border/50 text-sm text-slate-300 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Waves className="w-4 h-4 text-surf-accent" />
              7-Day Forecast
            </span>
            {showForecast ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showForecast && (
            <div className="mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <SwellChart airportCode={airportCode} destination={destination} type="forecast" days={7} />
            </div>
          )}

          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-surf-bg/40 hover:bg-surf-bg/60 border border-surf-border/50 text-sm text-slate-300 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Waves className="w-4 h-4 text-surf-emerald" />
              30-Day History
            </span>
            {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showHistory && (
            <div className="mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <SwellChart airportCode={airportCode} destination={destination} type="history" days={30} />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
