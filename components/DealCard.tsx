'use client';

import { useState } from 'react';
import { Waves, Plane, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
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
  windSpeed,
  windDirection,
}: DealCardProps) {
  const [showForecast, setShowForecast] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const isBarrel = swellType === 'barrel';
  const badgeColor = isBarrel 
    ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' 
    : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  const badgeText = isBarrel ? '🔥 Firing Barrels' : '🌊 Clean Logs';

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{destination}</h3>
          <p className="text-sm text-slate-400 flex items-center gap-1">
            <Plane className="w-4 h-4" />
            {airportCode}
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full border text-xs font-semibold ${badgeColor}`}>
          {badgeText}
        </div>
      </div>

      {/* Value Score - Trading Terminal Style */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-slate-500 text-sm font-mono">$V$</span>
          <span className="text-3xl font-bold font-mono text-deep-sea-accent">
            {valueScore.toFixed(2)}
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">Value Score</p>
      </div>

      {/* Swell Info */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-900/50 rounded p-3">
          <div className="flex items-center gap-2 mb-1">
            <Waves className="w-4 h-4 text-deep-sea-accent" />
            <span className="text-xs text-slate-400">Height</span>
          </div>
          <p className="text-lg font-bold text-white">{swellHeight.toFixed(1)}m</p>
        </div>
        <div className="bg-slate-900/50 rounded p-3">
          <div className="flex items-center gap-2 mb-1">
            <Waves className="w-4 h-4 text-deep-sea-accent" />
            <span className="text-xs text-slate-400">Period</span>
          </div>
          <p className="text-lg font-bold text-white">{swellPeriod.toFixed(1)}s</p>
        </div>
      </div>

      {/* Flight Info */}
      <div className="border-t border-slate-700 pt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-400">Price</span>
          <span className="text-2xl font-bold text-deep-sea-accent-green">
            {currency} {price.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{new Date(departureDate).toLocaleDateString()}</span>
          </div>
          <span>→</span>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{new Date(returnDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Forecast & History Toggles */}
      <div className="border-t border-slate-700 pt-4 mt-4 space-y-2">
        <button
          onClick={() => setShowForecast(!showForecast)}
          className="w-full flex items-center justify-between p-2 bg-slate-900/50 hover:bg-slate-900 rounded text-sm text-slate-300 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Waves className="w-4 h-4 text-cyan-400" />
            <span>7-Day Forecast</span>
          </span>
          {showForecast ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        
        {showForecast && (
          <div className="mt-2">
            <SwellChart
              airportCode={airportCode}
              destination={destination}
              type="forecast"
              days={7}
            />
          </div>
        )}

        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full flex items-center justify-between p-2 bg-slate-900/50 hover:bg-slate-900 rounded text-sm text-slate-300 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Waves className="w-4 h-4 text-emerald-400" />
            <span>30-Day History</span>
          </span>
          {showHistory ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        
        {showHistory && (
          <div className="mt-2">
            <SwellChart
              airportCode={airportCode}
              destination={destination}
              type="history"
              days={30}
            />
          </div>
        )}
      </div>
    </div>
  );
}

