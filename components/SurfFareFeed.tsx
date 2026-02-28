'use client';

import React from 'react';
import { DealCard, DealCardProps } from './DealCard';
import { Zap, TrendingUp } from 'lucide-react';

function slugify(str: string): string {
  return str.replace(/[\s,]+/g, '-');
}

export interface SurfFareFeedProps {
  deals: DealCardProps[];
}

export function SurfFareFeed({ deals }: SurfFareFeedProps) {
  const { primeStrikes, regularDeals } = React.useMemo(() => {
    const prime = deals.filter(d => d.swellHeight > 0.91 && d.swellPeriod > 10 && d.price < 500);
    const regular = deals.filter(d => !(d.swellHeight > 0.91 && d.swellPeriod > 10 && d.price < 500));
    return { primeStrikes: prime, regularDeals: regular };
  }, [deals]);

  return (
    <div className="space-y-14">
      {primeStrikes.length > 0 && (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-surf-amber/20 border border-surf-amber/30">
              <Zap className="w-5 h-5 text-surf-amber" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Prime Strikes</h2>
              <p className="text-xs text-slate-500">Swell &gt; 3ft • Period &gt; 10s • Flight &lt; $500</p>
            </div>
            <span className="ml-auto px-3 py-1 rounded-full bg-surf-amber/15 text-surf-amber text-xs font-semibold">
              {primeStrikes.length} deals
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {primeStrikes.map((deal, i) => (
              <div
                key={`prime-${deal.destination}-${deal.airportCode}-${i}`}
                id={`deal-${slugify(deal.destination)}`}
                className="animate-in fade-in slide-in-from-bottom-4 duration-300"
                style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'forwards' }}
              >
                <DealCard {...deal} isPrimeStrike />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-surf-accent/15 border border-surf-accent/30">
            <TrendingUp className="w-5 h-5 text-surf-accent" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Surf-Fare Feed</h2>
            <p className="text-xs text-slate-500">{deals.length} destinations</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularDeals.map((deal, i) => (
            <div
              key={`deal-${deal.destination}-${deal.airportCode}-${i}`}
              id={`deal-${slugify(deal.destination)}`}
              className="animate-in fade-in slide-in-from-bottom-4 duration-300"
              style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'forwards' }}
            >
              <DealCard {...deal} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
