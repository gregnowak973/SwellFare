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
 * Barrels: Very lenient criteria to show tons of results
 * Any decent wave with some power - Height > 0.3m OR Period > 6s
 * This will catch almost all surfable conditions
 */
export function isBarrelCondition(swell: SwellData): boolean {
  // Very lenient: any wave with decent height OR decent period
  return swell.height > 0.3 || swell.period > 6;
}

/**
 * Longboard (Log): Very lenient criteria to show tons of results
 * Any wave that's not massive - Height < 3.0m AND Period > 4s
 * This will catch almost all conditions suitable for longboarding
 */
export function isLogCondition(swell: SwellData): boolean {
  // Very lenient: anything that's not huge and has some period
  return swell.height < 3.0 && swell.period > 4;
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

