/**
 * Surf Logic Utility
 * Categorizes swell data based on mathematical definitions of "Good Surf"
 */

export type SurfDesire = 'barrel' | 'log';

export interface SwellData {
  height: number; // in meters
  period: number; // in seconds
  windSpeed?: number;
  windDirection?: number;
}

export interface CategorizedSwell extends SwellData {
  type: SurfDesire;
  isMatch: boolean;
}

/**
 * Barrels: Height > 0.8m (~2.6ft) AND Period > 9s
 * Relaxed criteria to show more results - users can filter visually
 * Original strict criteria: Height > 1.5m AND Period > 12s
 */
export function isBarrelCondition(swell: SwellData): boolean {
  return swell.height > 0.8 && swell.period > 9;
}

/**
 * Longboard (Log): Height < 1.8m AND Period between 6s and 14s
 * Relaxed criteria to show more results - users can filter visually
 * Original strict criteria: Height < 1.2m AND Period 8-11s
 */
export function isLogCondition(swell: SwellData): boolean {
  return swell.height < 1.8 && swell.period >= 6 && swell.period <= 14;
}

/**
 * Categorize swell data based on surf desire type
 */
export function categorizeSwell(swell: SwellData, desire: SurfDesire): CategorizedSwell {
  const isMatch = desire === 'barrel' 
    ? isBarrelCondition(swell)
    : isLogCondition(swell);

  return {
    ...swell,
    type: desire,
    isMatch,
  };
}

/**
 * Calculate wind alignment multiplier
 * Offshore (opposite to swell): 1.2x multiplier
 * Onshore (same as swell): 0.5x multiplier
 * Cross-shore: 1.0x multiplier
 */
export function calculateWindAlignment(
  windDirection: number,
  idealSwellDirection: number
): number {
  // Normalize angles to 0-360
  const normalizeAngle = (angle: number) => {
    while (angle < 0) angle += 360;
    while (angle >= 360) angle -= 360;
    return angle;
  };

  const windDir = normalizeAngle(windDirection);
  const swellDir = normalizeAngle(idealSwellDirection);
  
  // Calculate absolute difference
  let angleDiff = Math.abs(windDir - swellDir);
  if (angleDiff > 180) {
    angleDiff = 360 - angleDiff;
  }

  // Offshore: wind blowing opposite to swell (135-180 degrees)
  if (angleDiff >= 135 && angleDiff <= 180) {
    return 1.2;
  }
  
  // Onshore: wind blowing same direction as swell (0-45 degrees)
  if (angleDiff <= 45) {
    return 0.5;
  }
  
  // Cross-shore: 45-135 degrees
  return 1.0;
}

/**
 * Calculate Value Score: V = (Height × Period × WindAlignment) / Price
 */
export function calculateValueScore(
  height: number,
  period: number,
  windAlignment: number,
  price: number
): number {
  if (price <= 0) return 0;
  return (height * period * windAlignment) / price;
}

/**
 * Filter and sort swells by surf desire
 */
export function filterSwellsByDesire(
  swells: SwellData[],
  desire: SurfDesire
): CategorizedSwell[] {
  return swells
    .map(swell => categorizeSwell(swell, desire))
    .filter(swell => swell.isMatch)
    .sort((a, b) => {
      // Sort by height × period (wave power)
      const scoreA = a.height * a.period;
      const scoreB = b.height * b.period;
      return scoreB - scoreA;
    });
}

