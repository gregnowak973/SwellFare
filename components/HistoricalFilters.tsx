'use client';

import { useState } from 'react';
import { Calendar, Filter, TrendingDown, TrendingUp } from 'lucide-react';

export interface HistoricalFilters {
  daysBack: number;
  destination: string;
  desire: 'barrel' | 'log' | 'all';
  minValueScore: number;
}

export interface HistoricalFiltersProps {
  filters: HistoricalFilters;
  onFiltersChange: (filters: HistoricalFilters) => void;
  availableDestinations: Array<{ code: string; name: string }>;
}

export function HistoricalFilters({ filters, onFiltersChange, availableDestinations }: HistoricalFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (key: keyof HistoricalFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-white font-medium mb-4"
      >
        <Filter className="w-5 h-5" />
        <span>Filters</span>
        {isOpen ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
      </button>

      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Days Back */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Time Range
            </label>
            <select
              value={filters.daysBack}
              onChange={(e) => handleChange('daysBack', parseInt(e.target.value))}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-deep-sea-accent"
            >
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={30}>Last 30 days</option>
              <option value={60}>Last 60 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>

          {/* Destination */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Destination
            </label>
            <select
              value={filters.destination}
              onChange={(e) => handleChange('destination', e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-deep-sea-accent"
            >
              <option value="all">All Destinations</option>
              {availableDestinations.map((dest) => (
                <option key={dest.code} value={dest.code}>
                  {dest.name} ({dest.code})
                </option>
              ))}
            </select>
          </div>

          {/* Surf Type */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Surf Type
            </label>
            <select
              value={filters.desire}
              onChange={(e) => handleChange('desire', e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-deep-sea-accent"
            >
              <option value="all">All Types</option>
              <option value="barrel">Heaving Barrels</option>
              <option value="log">Soft & Longboard</option>
            </select>
          </div>

          {/* Min Value Score */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Min Value Score
            </label>
            <input
              type="number"
              step="0.001"
              min="0"
              value={filters.minValueScore}
              onChange={(e) => handleChange('minValueScore', parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-deep-sea-accent"
              placeholder="0.000"
            />
          </div>
        </div>
      )}
    </div>
  );
}

