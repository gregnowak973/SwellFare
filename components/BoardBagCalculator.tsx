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

// Top 15 international airlines board bag fees
const BOARD_BAG_FEES: BoardBagFee[] = [
  { airlineCode: 'UA', airlineName: 'United Airlines', feeOneWay: 200, feeRoundTrip: 400, currency: 'USD', policyNotes: 'Each way, applies to oversized bags' },
  { airlineCode: 'AA', airlineName: 'American Airlines', feeOneWay: 150, feeRoundTrip: 300, currency: 'USD', policyNotes: 'Each way for surfboards' },
  { airlineCode: 'DL', airlineName: 'Delta Air Lines', feeOneWay: 200, feeRoundTrip: 400, currency: 'USD', policyNotes: 'Each way, must be in board bag' },
  { airlineCode: 'BA', airlineName: 'British Airways', feeOneWay: 75, feeRoundTrip: 150, currency: 'GBP', policyNotes: 'Included in checked baggage allowance if under weight' },
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

  const handleAirlineChange = (airlineCode: string) => {
    const airline = BOARD_BAG_FEES.find(fee => fee.airlineCode === airlineCode);
    setSelectedAirline(airline || null);
  };

  const calculateTotalFee = () => {
    if (!selectedAirline) return 0;
    return tripType === 'round-trip' 
      ? selectedAirline.feeRoundTrip 
      : selectedAirline.feeOneWay;
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Plane className="w-5 h-5 text-deep-sea-accent" />
        <h2 className="text-xl font-bold text-white">Board Bag Calculator</h2>
      </div>
      <p className="text-sm text-slate-400 mb-6">
        Calculate the hidden cost of traveling with your surfboard
      </p>

      {/* Airline Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Select Airline
        </label>
        <select
          value={selectedAirline?.airlineCode || ''}
          onChange={(e) => handleAirlineChange(e.target.value)}
          className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-deep-sea-accent"
        >
          <option value="">Choose an airline...</option>
          {BOARD_BAG_FEES.map(airline => (
            <option key={airline.airlineCode} value={airline.airlineCode}>
              {airline.airlineName}
            </option>
          ))}
        </select>
      </div>

      {/* Trip Type Selector */}
      {selectedAirline && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Trip Type
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setTripType('one-way')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                tripType === 'one-way'
                  ? 'bg-deep-sea-accent text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              One-Way
            </button>
            <button
              onClick={() => setTripType('round-trip')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                tripType === 'round-trip'
                  ? 'bg-deep-sea-accent text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Round-Trip
            </button>
          </div>
        </div>
      )}

      {/* Fee Display */}
      {selectedAirline && (
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400">Total Board Bag Fee</span>
            <div className="flex items-baseline gap-2">
              <DollarSign className="w-5 h-5 text-deep-sea-accent-green" />
              <span className="text-3xl font-bold text-deep-sea-accent-green">
                {selectedAirline.currency} {calculateTotalFee().toLocaleString()}
              </span>
            </div>
          </div>
          
          <div className="text-xs text-slate-500 mt-2">
            {tripType === 'round-trip' 
              ? `${selectedAirline.currency} ${selectedAirline.feeOneWay} each way`
              : 'One-way fee'
            }
          </div>

          {selectedAirline.policyNotes && (
            <div className="mt-4 pt-4 border-t border-slate-700">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-slate-400">{selectedAirline.policyNotes}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {!selectedAirline && (
        <div className="text-center py-8 text-slate-500 text-sm">
          Select an airline to see board bag fees
        </div>
      )}
    </div>
  );
}

