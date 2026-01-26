'use client';

import React from 'react';
import { DealCard, DealCardProps } from './DealCard';
import { Zap, TrendingUp } from 'lucide-react';

export interface SurfFareFeedProps {
  deals: DealCardProps[];
}

export function SurfFareFeed({ deals }: SurfFareFeedProps) {
  // Separate Prime Strikes from regular deals
  // Use useMemo to prevent recalculation on every render
  const { primeStrikes, regularDeals } = React.useMemo(() => {
    const prime = deals.filter((deal) => {
      const heightInMeters = deal.swellHeight;
      return heightInMeters > 0.91 && deal.swellPeriod > 10 && deal.price < 500;
    });

    const regular = deals.filter((deal) => {
      const heightInMeters = deal.swellHeight;
      return !(heightInMeters > 0.91 && deal.swellPeriod > 10 && deal.price < 500);
    });

    return { primeStrikes: prime, regularDeals: regular };
  }, [deals]);

  return (
    <div>
      {primeStrikes.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-6 h-6 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">
              ⚡ Prime Strikes
            </h2>
            <span className="px-3 py-1 bg-yellow-400/20 text-yellow-400 rounded-full text-xs font-semibold border border-yellow-400/30">
              Swell &gt; 3ft • Period &gt; 10s • Flight &lt; $500
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {primeStrikes.map((deal, index) => (
              <div 
                key={`prime-${deal.destination}-${deal.airportCode}-${index}`} 
                className="relative animate-in fade-in slide-in-from-bottom-4 duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="bg-yellow-400 text-slate-900 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                    PRIME STRIKE
                  </div>
                </div>
                <DealCard {...deal} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-6 h-6 text-deep-sea-accent" />
          <h2 className="text-2xl font-bold text-white">
            Surf-Fare Feed
          </h2>
          <span className="text-sm text-slate-500 ml-2">
            ({deals.length} destinations)
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularDeals.map((deal, index) => (
            <div
              key={`deal-${deal.destination}-${deal.airportCode}-${index}`}
              className="animate-in fade-in slide-in-from-bottom-4 duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <DealCard {...deal} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

