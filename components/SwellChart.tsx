'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Waves } from 'lucide-react';

interface SwellDataPoint {
  date: string;
  avgHeight: number;
  maxHeight: number;
  avgPeriod: number;
  maxPeriod: number;
  avgWindSpeed: number;
}

interface SwellChartProps {
  airportCode: string;
  destination: string;
  type: 'forecast' | 'history';
  days?: number;
}

export function SwellChart({ airportCode, destination, type, days = 7 }: SwellChartProps) {
  const [data, setData] = useState<SwellDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const endpoint =
          type === 'forecast'
            ? `/api/swell-forecast?destination=${airportCode}&days=${days}`
            : `/api/swell-history?destination=${airportCode}&days=${days}`;
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error(`Failed to fetch ${type}`);
        const result = await res.json();
        setData(type === 'forecast' ? result.forecast : result.history);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [airportCode, type, days]);

  if (loading) {
    return (
      <div className="rounded-xl bg-surf-bg/60 border border-surf-border p-6 flex items-center justify-center h-40">
        <div className="w-8 h-8 border-2 border-surf-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4">
        <p className="text-red-400 text-sm">Error: {error}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-xl bg-surf-bg/60 border border-surf-border p-4">
        <p className="text-slate-500 text-sm">No {type} data</p>
      </div>
    );
  }

  const maxHeight = Math.max(...data.map((d) => d.maxHeight));
  const maxPeriod = Math.max(...data.map((d) => d.maxPeriod));

  return (
    <div className="rounded-xl bg-surf-bg/60 border border-surf-border p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white">
            {type === 'forecast' ? 'Forecast' : 'History'} — {destination}
          </h3>
          <p className="text-xs text-slate-500">{data.length} days</p>
        </div>
        {type === 'forecast' ? (
          <TrendingUp className="w-5 h-5 text-surf-accent" />
        ) : (
          <TrendingDown className="w-5 h-5 text-surf-emerald" />
        )}
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Waves className="w-4 h-4 text-surf-accent" />
            <span className="text-xs font-medium text-slate-500">Height (m)</span>
          </div>
          <div className="flex items-end gap-0.5 h-24 rounded-lg bg-surf-surface/50 p-2">
            {data.map((point, i) => {
              const pct = (point.avgHeight / maxHeight) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                  <div
                    className="w-full rounded-t bg-surf-accent/80 transition-all"
                    style={{ height: `${Math.max(pct, 4)}%` }}
                    title={`${point.avgHeight.toFixed(1)}m`}
                  />
                  <span className="text-[10px] text-slate-600 mt-1 truncate w-full text-center">
                    {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Waves className="w-4 h-4 text-surf-emerald" />
            <span className="text-xs font-medium text-slate-500">Period (s)</span>
          </div>
          <div className="flex items-end gap-0.5 h-24 rounded-lg bg-surf-surface/50 p-2">
            {data.map((point, i) => {
              const pct = (point.avgPeriod / maxPeriod) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                  <div
                    className="w-full rounded-t bg-surf-emerald/80 transition-all"
                    style={{ height: `${Math.max(pct, 4)}%` }}
                    title={`${point.avgPeriod.toFixed(1)}s`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-surf-border">
          <div className="text-center">
            <p className="text-[10px] text-slate-500 mb-0.5">Avg Height</p>
            <p className="text-sm font-semibold text-white">
              {(data.reduce((s, d) => s + d.avgHeight, 0) / data.length).toFixed(1)}m
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-slate-500 mb-0.5">Avg Period</p>
            <p className="text-sm font-semibold text-white">
              {(data.reduce((s, d) => s + d.avgPeriod, 0) / data.length).toFixed(1)}s
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-slate-500 mb-0.5">Peak</p>
            <p className="text-sm font-semibold text-surf-accent">{maxHeight.toFixed(1)}m</p>
          </div>
        </div>
      </div>
    </div>
  );
}
