'use client';

import { DealCard, DealCardProps } from './DealCard';
import { Zap, TrendingUp } from 'lucide-react';

export interface SurfFareFeedProps {
  deals: DealCardProps[];
}

export function SurfFareFeed({ deals }: SurfFareFeedProps) {
  // Separate Prime Strikes from regular deals
  const primeStrikes = deals.filter(deal => {
    // Convert height from meters to feet for comparison (3ft = 0.91m)
    const heightInMeters = deal.swellHeight;
    return heightInMeters > 0.91 && deal.swellPeriod > 10 && deal.price < 500;
  });

  const regularDeals = deals.filter(deal => {
    const heightInMeters = deal.swellHeight;
    return !(heightInMeters > 0.91 && deal.swellPeriod > 10 && deal.price < 500);
  });

  return (
    <div>
      {/* Prime Strikes Section */}
      {primeStrikes.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-6 h-6 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">
              ⚡ Prime Strikes
            </h2>
            <span className="px-3 py-1 bg-yellow-400/20 text-yellow-400 rounded-full text-xs font-semibold border border-yellow-400/30">
              Swell > 3ft • Period > 10s • Flight < $500
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {primeStrikes.map((deal, index) => (
              <div key={`prime-${deal.destination}-${index}`} className="relative">
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="bg-yellow-400 text-slate-900 px-3 py-1 rounded-full text-xs font-bold">
                    PRIME STRIKE
                  </div>
                </div>
                <DealCard {...deal} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regular Feed */}
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
            <DealCard key={`deal-${deal.destination}-${index}`} {...deal} />
          ))}
        </div>
      </div>
    </div>
  );
}

