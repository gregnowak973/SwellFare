'use client';

import { useState } from 'react';
import { Plane, DollarSign, Info } from 'lucide-react';

export interface BoardBagFee {
  airlineCode: string;
  airlineName: string;
  feeOneWay: number;
  feeRoundTrip: number;
  currency: string;
  policyNotes?: string;
}

const BOARD_BAG_FEES: BoardBagFee[] = [
  { airlineCode: 'UA', airlineName: 'United Airlines', feeOneWay: 200, feeRoundTrip: 400, currency: 'USD', policyNotes: 'Each way, applies to oversized bags' },
  { airlineCode: 'AA', airlineName: 'American Airlines', feeOneWay: 150, feeRoundTrip: 300, currency: 'USD', policyNotes: 'Each way for surfboards' },
  { airlineCode: 'DL', airlineName: 'Delta Air Lines', feeOneWay: 200, feeRoundTrip: 400, currency: 'USD', policyNotes: 'Each way, must be in board bag' },
  { airlineCode: 'BA', airlineName: 'British Airways', feeOneWay: 75, feeRoundTrip: 150, currency: 'GBP', policyNotes: 'Included in checked baggage if under weight' },
  { airlineCode: 'LH', airlineName: 'Lufthansa', feeOneWay: 100, feeRoundTrip: 200, currency: 'EUR', policyNotes: 'Each way, subject to size restrictions' },
  { airlineCode: 'AF', airlineName: 'Air France', feeOneWay: 100, feeRoundTrip: 200, currency: 'EUR', policyNotes: 'Each way for oversized sports equipment' },
  { airlineCode: 'QF', airlineName: 'Qantas', feeOneWay: 150, feeRoundTrip: 300, currency: 'AUD', policyNotes: 'Each way, must be properly packed' },
  { airlineCode: 'JL', airlineName: 'Japan Airlines', feeOneWay: 200, feeRoundTrip: 400, currency: 'USD', policyNotes: 'Each way for sports equipment' },
  { airlineCode: 'SQ', airlineName: 'Singapore Airlines', feeOneWay: 100, feeRoundTrip: 200, currency: 'USD', policyNotes: 'Each way, included in some fare classes' },
  { airlineCode: 'EK', airlineName: 'Emirates', feeOneWay: 50, feeRoundTrip: 100, currency: 'USD', policyNotes: 'Each way, varies by route' },
  { airlineCode: 'CX', airlineName: 'Cathay Pacific', feeOneWay: 100, feeRoundTrip: 200, currency: 'USD', policyNotes: 'Each way for sports equipment' },
  { airlineCode: 'VS', airlineName: 'Virgin Atlantic', feeOneWay: 75, feeRoundTrip: 150, currency: 'GBP', policyNotes: 'Each way, check weight limits' },
  { airlineCode: 'TK', airlineName: 'Turkish Airlines', feeOneWay: 100, feeRoundTrip: 200, currency: 'USD', policyNotes: 'Each way for oversized baggage' },
  { airlineCode: 'NZ', airlineName: 'Air New Zealand', feeOneWay: 150, feeRoundTrip: 300, currency: 'NZD', policyNotes: 'Each way, must be in protective bag' },
  { airlineCode: 'AS', airlineName: 'Alaska Airlines', feeOneWay: 100, feeRoundTrip: 200, currency: 'USD', policyNotes: 'Each way, included for some credit card holders' },
];

export function BoardBagCalculator() {
  const [selectedAirline, setSelectedAirline] = useState<BoardBagFee | null>(null);
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('round-trip');

  const totalFee = selectedAirline
    ? tripType === 'round-trip' ? selectedAirline.feeRoundTrip : selectedAirline.feeOneWay
    : 0;

  return (
    <div className="rounded-2xl border border-surf-border bg-surf-surface/80 backdrop-blur-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-surf-border">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-surf-accent/15">
            <Plane className="w-5 h-5 text-surf-accent" />
          </div>
          <h2 className="text-lg font-semibold text-white">Board Bag Calculator</h2>
        </div>
        <p className="text-sm text-slate-500">Hidden cost of traveling with your board</p>
      </div>

      <div className="p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Airline</label>
          <select
            value={selectedAirline?.airlineCode || ''}
            onChange={(e) => {
              const airline = BOARD_BAG_FEES.find((f) => f.airlineCode === e.target.value);
              setSelectedAirline(airline || null);
            }}
            className="w-full px-4 py-3 rounded-xl bg-surf-bg border border-surf-border text-white focus:outline-none focus:ring-2 focus:ring-surf-accent/50 focus:border-surf-accent/50 transition-all appearance-none"
          >
            <option value="">Choose airline...</option>
            {BOARD_BAG_FEES.map((a) => (
              <option key={a.airlineCode} value={a.airlineCode}>
                {a.airlineName}
              </option>
            ))}
          </select>
        </div>

        {selectedAirline && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Trip type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setTripType('one-way')}
                  className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    tripType === 'one-way'
                      ? 'bg-surf-accent text-surf-bg'
                      : 'bg-surf-bg/60 border border-surf-border text-slate-400 hover:text-slate-300'
                  }`}
                >
                  One-way
                </button>
                <button
                  onClick={() => setTripType('round-trip')}
                  className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    tripType === 'round-trip'
                      ? 'bg-surf-accent text-surf-bg'
                      : 'bg-surf-bg/60 border border-surf-border text-slate-400 hover:text-slate-300'
                  }`}
                >
                  Round-trip
                </button>
              </div>
            </div>

            <div className="rounded-xl bg-surf-bg/60 border border-surf-border p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 text-sm">Total board bag fee</span>
                <div className="flex items-baseline gap-2">
                  <DollarSign className="w-5 h-5 text-surf-emerald" />
                  <span className="text-2xl font-bold text-surf-emerald">
                    {selectedAirline.currency} {totalFee.toLocaleString()}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                {tripType === 'round-trip' ? `${selectedAirline.currency} ${selectedAirline.feeOneWay} each way` : 'One-way fee'}
              </p>
              {selectedAirline.policyNotes && (
                <div className="mt-4 pt-4 border-t border-surf-border flex gap-2">
                  <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-500">{selectedAirline.policyNotes}</p>
                </div>
              )}
            </div>
          </>
        )}

        {!selectedAirline && (
          <div className="py-12 text-center text-slate-500 text-sm">
            Select an airline to see board bag fees
          </div>
        )}
      </div>
    </div>
  );
}
