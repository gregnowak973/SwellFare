'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, RefreshCw, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { GOLDEN_20_DESTINATIONS } from '@/lib/destinations';

interface DebugResult {
  destination: string;
  airportCode: string;
  latitude: number;
  longitude: number;
  status: 'success' | 'error' | 'no-data' | 'filtered-out';
  swellHeight?: number;
  swellPeriod?: number;
  swellType?: 'barrel' | 'log';
  hasGoodSurf?: boolean;
  error?: string;
  reason?: string;
  windowChecked?: boolean;
  bestConditions?: {
    height: number;
    period: number;
  };
}

export function DebugView() {
  const [results, setResults] = useState<DebugResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [desire, setDesire] = useState<'barrel' | 'log'>('barrel');
  const [refreshing, setRefreshing] = useState(false);

  const fetchDebugData = async () => {
    try {
      setLoading(true);
      setRefreshing(true);

      // Fetch from debug endpoint
      const response = await fetch(`/api/debug-deals?desire=${desire}&detailed=true&t=${Date.now()}`, {
        cache: 'no-store',
      });

      if (response.ok) {
        const data = await response.json();
        
        // Transform the data into our format
        const debugResults: DebugResult[] = GOLDEN_20_DESTINATIONS.map(dest => {
          const result = data.results?.find((r: any) => 
            r.destination === dest.name || r.airportCode === dest.airportCode
          );

          if (result) {
            return {
              destination: dest.name,
              airportCode: dest.airportCode,
              latitude: dest.latitude,
              longitude: dest.longitude,
              status: result.status || 'error',
              swellHeight: result.swellHeight,
              swellPeriod: result.swellPeriod,
              swellType: result.swellType,
              hasGoodSurf: result.hasGoodSurf,
              error: result.error,
              reason: result.reason,
              windowChecked: result.windowChecked,
              bestConditions: result.bestConditions,
            };
          }

          // If no result found, mark as error
          return {
            destination: dest.name,
            airportCode: dest.airportCode,
            latitude: dest.latitude,
            longitude: dest.longitude,
            status: 'error',
            error: 'No data returned from API',
          };
        });

        setResults(debugResults);
      } else {
        // If API fails, create results from destinations
        const debugResults: DebugResult[] = GOLDEN_20_DESTINATIONS.map(dest => ({
          destination: dest.name,
          airportCode: dest.airportCode,
          latitude: dest.latitude,
          longitude: dest.longitude,
          status: 'error',
          error: `API returned ${response.status}: ${response.statusText}`,
        }));
        setResults(debugResults);
      }
    } catch (error) {
      console.error('Error fetching debug data:', error);
      const debugResults: DebugResult[] = GOLDEN_20_DESTINATIONS.map(dest => ({
        destination: dest.name,
        airportCode: dest.airportCode,
        latitude: dest.latitude,
        longitude: dest.longitude,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
      setResults(debugResults);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDebugData();
  }, [desire]);

  const passed = results.filter(r => r.status === 'success');
  const failed = results.filter(r => r.status !== 'success');
  const errors = results.filter(r => r.status === 'error');
  const noData = results.filter(r => r.status === 'no-data');
  const filtered = results.filter(r => r.status === 'filtered-out');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'no-data':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'filtered-out':
        return <XCircle className="w-5 h-5 text-slate-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusBadge = (result: DebugResult) => {
    if (result.status === 'success') {
      return (
        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs font-semibold">
          ✅ Made Cut
        </span>
      );
    } else if (result.status === 'filtered-out') {
      return (
        <span className="px-2 py-1 bg-slate-500/20 text-slate-400 rounded text-xs font-semibold">
          ❌ Filtered Out
        </span>
      );
    } else if (result.status === 'no-data') {
      return (
        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-semibold">
          ⚠️ No Data
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-semibold">
          🚫 Error
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-deep-sea-bg">
      {/* Header */}
      <header className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-white hover:text-cyan-400 transition-colors"
              >
                <Home className="w-5 h-5" />
                <span className="font-semibold">Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-slate-700"></div>
              <h1 className="text-2xl font-bold text-white">Debug & Analytics</h1>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={desire}
                onChange={(e) => setDesire(e.target.value as 'barrel' | 'log')}
                className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
              >
                <option value="barrel">Heaving Barrels</option>
                <option value="log">Soft & Longboard</option>
              </select>
              <button
                onClick={fetchDebugData}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-white transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="text-3xl font-bold text-white mb-1">{results.length}</div>
            <div className="text-sm text-slate-400">Total Checked</div>
          </div>
          <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-4">
            <div className="text-3xl font-bold text-emerald-400 mb-1">{passed.length}</div>
            <div className="text-sm text-emerald-300">✅ Made Cut</div>
          </div>
          <div className="bg-slate-500/20 border border-slate-500/30 rounded-lg p-4">
            <div className="text-3xl font-bold text-slate-400 mb-1">{filtered.length}</div>
            <div className="text-sm text-slate-300">❌ Filtered Out</div>
          </div>
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
            <div className="text-3xl font-bold text-yellow-400 mb-1">{noData.length}</div>
            <div className="text-sm text-yellow-300">⚠️ No Data</div>
          </div>
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
            <div className="text-3xl font-bold text-red-400 mb-1">{errors.length}</div>
            <div className="text-sm text-red-300">🚫 Errors</div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            <span className="ml-3 text-slate-400">Loading debug data...</span>
          </div>
        ) : (
          <>
            {/* Results Table */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-900/50 border-b border-slate-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Destination</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Airport</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Swell Height</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Period</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">14-Day Window</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {results.map((result, index) => (
                      <tr
                        key={`${result.destination}-${index}`}
                        className={`hover:bg-slate-800/30 transition-colors ${
                          result.status === 'success' ? 'bg-emerald-500/5' : ''
                        }`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(result.status)}
                            {getStatusBadge(result)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-white">{result.destination}</div>
                          <div className="text-xs text-slate-500">
                            {result.latitude?.toFixed(2) || 'N/A'}, {result.longitude?.toFixed(2) || 'N/A'}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-slate-300 font-mono">{result.airportCode}</span>
                        </td>
                        <td className="px-4 py-3">
                          {result.swellHeight !== undefined && result.swellHeight !== null ? (
                            <span className="text-white font-semibold">{result.swellHeight.toFixed(2)}m</span>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {result.swellPeriod !== undefined && result.swellPeriod !== null ? (
                            <span className="text-white font-semibold">{result.swellPeriod.toFixed(1)}s</span>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {result.swellType ? (
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              result.swellType === 'barrel'
                                ? 'bg-cyan-500/20 text-cyan-400'
                                : 'bg-emerald-500/20 text-emerald-400'
                            }`}>
                              {result.swellType === 'barrel' ? '🔥 Barrel' : '🌊 Log'}
                            </span>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {result.windowChecked !== undefined ? (
                            <span className={`text-xs ${result.windowChecked ? 'text-emerald-400' : 'text-slate-500'}`}>
                              {result.windowChecked ? '✅ Checked' : '❌ Not checked'}
                            </span>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-xs text-slate-400 max-w-xs">
                            {result.reason && (
                              <div className="mb-1">{result.reason}</div>
                            )}
                            {result.error && (
                              <div className="text-red-400">{result.error}</div>
                            )}
                            {result.bestConditions && result.bestConditions.height && result.bestConditions.period && (
                              <div className="text-slate-500 mt-1">
                                Best: {result.bestConditions.height.toFixed(2)}m @ {result.bestConditions.period.toFixed(1)}s
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* API Info */}
            <div className="mt-8 bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">API Configuration</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Stormglass API:</span>
                  <span className="ml-2 text-white">
                    {process.env.NEXT_PUBLIC_STORMGLASS_API_KEY ? '✅ Configured' : '❌ Not configured'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Amadeus API:</span>
                  <span className="ml-2 text-white">
                    {process.env.NEXT_PUBLIC_AMADEUS_CLIENT_ID ? '✅ Configured' : '❌ Not configured'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Surf Type Filter:</span>
                  <span className="ml-2 text-white capitalize">{desire}</span>
                </div>
                <div>
                  <span className="text-slate-400">Window Checked:</span>
                  <span className="ml-2 text-white">14 days (7 back + 7 forward)</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

