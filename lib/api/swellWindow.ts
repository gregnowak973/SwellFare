/**
 * Swell Window Utilities
 * Check if there's good surf in a time window (past + future)
 */

import { fetchSwellData } from './stormglass';
import { SwellData, isBarrelCondition, isLogCondition } from '@/lib/surfLogic';
import type { StormglassConfig } from './stormglass';

export interface SwellWindowResult {
  hasGoodSurf: boolean;
  bestConditions: SwellData | null;
  bestTime: Date | null;
  allConditions: SwellData[];
}

/**
 * Check if there's good surf in a time window (past + future)
 * Returns the best conditions found in that window
 * Optimized: Uses smaller window (3 days back, 3 days forward) for faster responses
 */
export async function checkSwellWindow(
  latitude: number,
  longitude: number,
  daysBack: number,
  daysForward: number,
  desire: 'barrel' | 'log',
  config: StormglassConfig
): Promise<SwellWindowResult> {
  const now = new Date();
  const startDate = new Date(now);
  // Limit to max 3 days back to reduce API load
  const actualDaysBack = Math.min(daysBack, 3);
  startDate.setDate(startDate.getDate() - actualDaysBack);
  const endDate = new Date(now);
  // Limit to max 3 days forward to reduce API load
  const actualDaysForward = Math.min(daysForward, 3);
  endDate.setDate(endDate.getDate() + actualDaysForward);

  try {
    // Fetch all swell data for the window
    const allSwells = await fetchSwellData(latitude, longitude, startDate, endDate, config);

    if (allSwells.length === 0) {
      return {
        hasGoodSurf: false,
        bestConditions: null,
        bestTime: null,
        allConditions: [],
      };
    }

    // Check if ANY time in the window has good conditions
    const goodConditions = allSwells.filter(swell => {
      if (desire === 'barrel') {
        return isBarrelCondition(swell);
      } else {
        return isLogCondition(swell);
      }
    });

    // If no good conditions found, still include if there's any surfable wave
    // (very lenient - just needs some height and period)
    const surfableConditions = allSwells.filter(swell => 
      swell.height > 0.2 && swell.period > 3
    );

    const hasGoodSurf = goodConditions.length > 0 || surfableConditions.length > 0;

    // Find the best conditions (highest wave power: height × period)
    const allConditions = goodConditions.length > 0 ? goodConditions : surfableConditions;
    const bestConditions = allConditions.reduce((best, current) => {
      const bestPower = best.height * best.period;
      const currentPower = current.height * current.period;
      return currentPower > bestPower ? current : best;
    }, allConditions[0]);

    return {
      hasGoodSurf,
      bestConditions: bestConditions || null,
      bestTime: bestConditions ? new Date() : null, // Approximate - actual time would need to be tracked
      allConditions: allSwells,
    };
  } catch (error) {
    console.error('Error checking swell window:', error);
    return {
      hasGoodSurf: false,
      bestConditions: null,
      bestTime: null,
      allConditions: [],
    };
  }
}

