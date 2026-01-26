/**
 * Data Validation Utilities
 * Validate API responses to prevent runtime errors
 */

import { SwellData } from '@/lib/surfLogic';
import type { AmadeusFlightOffer } from '@/lib/api/amadeus';

/**
 * Validate Stormglass swell data
 */
export function validateSwellData(data: any): data is SwellData {
  if (!data || typeof data !== 'object') return false;
  
  return (
    typeof data.height === 'number' &&
    data.height >= 0 &&
    typeof data.period === 'number' &&
    data.period >= 0 &&
    (data.windSpeed === undefined || (typeof data.windSpeed === 'number' && data.windSpeed >= 0)) &&
    (data.windDirection === undefined || (typeof data.windDirection === 'number' && data.windDirection >= 0 && data.windDirection <= 360))
  );
}

/**
 * Validate Amadeus flight offer
 */
export function validateFlightOffer(data: any): data is AmadeusFlightOffer {
  if (!data || typeof data !== 'object') return false;
  
  return (
    typeof data.id === 'string' &&
    data.price &&
    typeof data.price.total === 'string' &&
    !isNaN(parseFloat(data.price.total)) &&
    parseFloat(data.price.total) > 0 &&
    Array.isArray(data.itineraries)
  );
}

/**
 * Validate deal object
 */
export function validateDeal(deal: any): boolean {
  if (!deal || typeof deal !== 'object') return false;
  
  return (
    typeof deal.destination === 'string' &&
    typeof deal.airportCode === 'string' &&
    typeof deal.price === 'number' &&
    deal.price > 0 &&
    typeof deal.swellHeight === 'number' &&
    deal.swellHeight >= 0 &&
    typeof deal.swellPeriod === 'number' &&
    deal.swellPeriod >= 0 &&
    typeof deal.valueScore === 'number' &&
    (deal.swellType === 'barrel' || deal.swellType === 'log')
  );
}

