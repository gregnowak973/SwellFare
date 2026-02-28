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
    <div className="inline-flex p-1 rounded-2xl bg-surf-surface border border-surf-border">
      <button
        onClick={() => onDesireChange('barrel')}
        disabled={isBarrel}
        className={`
          flex items-center gap-2.5 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200
          ${isBarrel
            ? 'bg-surf-accent/15 text-surf-accent border border-surf-accent/30 shadow-soft'
            : 'text-slate-500 hover:text-slate-300 hover:bg-surf-surface-elevated/50'
          }
          disabled:cursor-default
        `}
        aria-pressed={isBarrel}
        aria-label="Heaving Barrels"
      >
        <Zap className="w-5 h-5" />
        Heaving Barrels
      </button>
      <button
        onClick={() => onDesireChange('log')}
        disabled={!isBarrel}
        className={`
          flex items-center gap-2.5 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200
          ${!isBarrel
            ? 'bg-surf-emerald/15 text-surf-emerald border border-surf-emerald/30 shadow-soft'
            : 'text-slate-500 hover:text-slate-300 hover:bg-surf-surface-elevated/50'
          }
          disabled:cursor-default
        `}
        aria-pressed={!isBarrel}
        aria-label="Soft & Longboard"
      >
        <Waves className="w-5 h-5" />
        Soft & Longboard
      </button>
    </div>
  );
}
