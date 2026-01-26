'use client';

import { SurfDesire } from '@/lib/surfLogic';
import { Waves, Zap } from 'lucide-react';

export interface DesireToggleProps {
  currentDesire: SurfDesire;
  onDesireChange: (desire: SurfDesire) => void;
}

export function DesireToggle({ currentDesire, onDesireChange }: DesireToggleProps) {
  const isBarrel = currentDesire === 'barrel';

  return (
    <div className="flex items-center gap-4 p-1 bg-slate-800 rounded-lg border border-slate-700 w-fit">
      <button
        onClick={() => onDesireChange('barrel')}
        disabled={isBarrel}
        className={`
          flex items-center gap-2 px-6 py-3 rounded-md font-semibold transition-all duration-200
          ${isBarrel 
            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10 scale-105' 
            : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'
          }
          disabled:cursor-not-allowed
        `}
        aria-pressed={isBarrel}
        aria-label="Heaving Barrels filter"
      >
        <Zap className="w-5 h-5" />
        <span>Heaving Barrels</span>
      </button>
      <button
        onClick={() => onDesireChange('log')}
        disabled={!isBarrel}
        className={`
          flex items-center gap-2 px-6 py-3 rounded-md font-semibold transition-all duration-200
          ${!isBarrel 
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10 scale-105' 
            : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'
          }
          disabled:cursor-not-allowed
        `}
        aria-pressed={!isBarrel}
        aria-label="Soft & Longboard filter"
      >
        <Waves className="w-5 h-5" />
        <span>Soft & Longboard</span>
      </button>
    </div>
  );
}

