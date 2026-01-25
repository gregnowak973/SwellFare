/**
 * Prime Strike Matching Algorithm
 * Prime Strike: Swell > 3ft (0.91m) AND Period > 10s AND Flight < $500
 */

export interface StrikeConditions {
  swellHeight: number; // in meters
  swellPeriod: number; // in seconds
  flightPrice: number; // in USD
}

/**
 * Check if conditions meet Prime Strike criteria
 */
export function isPrimeStrike(conditions: StrikeConditions): boolean {
  const MIN_SWELL_HEIGHT_METERS = 0.91; // 3 feet
  const MIN_PERIOD_SECONDS = 10;
  const MAX_FLIGHT_PRICE = 500;

  return (
    conditions.swellHeight > MIN_SWELL_HEIGHT_METERS &&
    conditions.swellPeriod > MIN_PERIOD_SECONDS &&
    conditions.flightPrice < MAX_FLIGHT_PRICE
  );
}

/**
 * Get strike level based on conditions
 */
export type StrikeLevel = 'prime' | 'good' | 'fair' | 'poor';

export function getStrikeLevel(conditions: StrikeConditions): StrikeLevel {
  if (isPrimeStrike(conditions)) {
    return 'prime';
  }

  // Good: Meets 2 out of 3 criteria
  const meetsHeight = conditions.swellHeight > 0.91;
  const meetsPeriod = conditions.swellPeriod > 10;
  const meetsPrice = conditions.flightPrice < 500;

  const criteriaMet = [meetsHeight, meetsPeriod, meetsPrice].filter(Boolean).length;

  if (criteriaMet === 2) {
    return 'good';
  }
  if (criteriaMet === 1) {
    return 'fair';
  }
  return 'poor';
}

/**
 * Calculate strike score (0-100)
 */
export function calculateStrikeScore(conditions: StrikeConditions): number {
  const heightScore = Math.min((conditions.swellHeight / 2.0) * 40, 40); // Max 40 points
  const periodScore = Math.min((conditions.swellPeriod / 15) * 30, 30); // Max 30 points
  const priceScore = Math.max(0, (500 - conditions.flightPrice) / 500 * 30); // Max 30 points

  return Math.round(heightScore + periodScore + priceScore);
}

