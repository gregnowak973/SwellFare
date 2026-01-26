'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Calendar, Waves, Wind } from 'lucide-react';

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
        const endpoint = type === 'forecast' 
          ? `/api/swell-forecast?destination=${airportCode}&days=${days}`
          : `/api/swell-history?destination=${airportCode}&days=${days}`;
        
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${type} data`);
        }
        
        const result = await response.json();
        setData(type === 'forecast' ? result.forecast : result.history);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [airportCode, type, days]);

  if (loading) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-deep-sea-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-800/50 border border-red-500/30 rounded-lg p-4">
        <p className="text-red-400 text-sm">Error loading {type} data: {error}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
        <p className="text-slate-400 text-sm">No {type} data available</p>
      </div>
    );
  }

  // Calculate max values for scaling
  const maxHeight = Math.max(...data.map(d => d.maxHeight));
  const maxPeriod = Math.max(...data.map(d => d.maxPeriod));

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">
            {type === 'forecast' ? '📈 Forecast' : '📊 History'} - {destination}
          </h3>
          <p className="text-xs text-slate-400">{data.length} days</p>
        </div>
        {type === 'forecast' ? (
          <TrendingUp className="w-5 h-5 text-cyan-400" />
        ) : (
          <TrendingDown className="w-5 h-5 text-emerald-400" />
        )}
      </div>

      {/* Chart */}
      <div className="space-y-4">
        {/* Height Chart */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Waves className="w-4 h-4 text-deep-sea-accent" />
            <span className="text-sm font-medium text-slate-300">Wave Height (m)</span>
          </div>
          <div className="flex items-end gap-1 h-32 bg-slate-900/50 rounded p-2">
            {data.map((point, index) => {
              const heightPercent = (point.maxHeight / maxHeight) * 100;
              const avgHeightPercent = (point.avgHeight / maxHeight) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col items-center justify-end" style={{ height: '100%' }}>
                    {/* Max height bar */}
                    <div
                      className="w-full bg-cyan-500/30 rounded-t"
                      style={{ height: `${heightPercent}%`, minHeight: '2px' }}
                      title={`Max: ${point.maxHeight.toFixed(1)}m`}
                    />
                    {/* Avg height bar */}
                    <div
                      className="w-full bg-deep-sea-accent rounded-t"
                      style={{ height: `${avgHeightPercent}%`, minHeight: '2px' }}
                      title={`Avg: ${point.avgHeight.toFixed(1)}m`}
                    />
                  </div>
                  <span className="text-xs text-slate-500 mt-1">
                    {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Period Chart */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Waves className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-slate-300">Period (s)</span>
          </div>
          <div className="flex items-end gap-1 h-32 bg-slate-900/50 rounded p-2">
            {data.map((point, index) => {
              const periodPercent = (point.maxPeriod / maxPeriod) * 100;
              const avgPeriodPercent = (point.avgPeriod / maxPeriod) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col items-center justify-end" style={{ height: '100%' }}>
                    {/* Max period bar */}
                    <div
                      className="w-full bg-emerald-500/30 rounded-t"
                      style={{ height: `${periodPercent}%`, minHeight: '2px' }}
                      title={`Max: ${point.maxPeriod.toFixed(1)}s`}
                    />
                    {/* Avg period bar */}
                    <div
                      className="w-full bg-emerald-400 rounded-t"
                      style={{ height: `${avgPeriodPercent}%`, minHeight: '2px' }}
                      title={`Avg: ${point.avgPeriod.toFixed(1)}s`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-700">
          <div className="text-center">
            <p className="text-xs text-slate-400 mb-1">Avg Height</p>
            <p className="text-sm font-bold text-white">
              {(data.reduce((sum, d) => sum + d.avgHeight, 0) / data.length).toFixed(1)}m
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400 mb-1">Avg Period</p>
            <p className="text-sm font-bold text-white">
              {(data.reduce((sum, d) => sum + d.avgPeriod, 0) / data.length).toFixed(1)}s
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400 mb-1">Peak Height</p>
            <p className="text-sm font-bold text-cyan-400">
              {maxHeight.toFixed(1)}m
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

