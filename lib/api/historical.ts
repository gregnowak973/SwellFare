/**
 * Historical Data Utilities
 */

import { fetchSwellData } from './stormglass';
import { SwellData } from '@/lib/surfLogic';
import type { StormglassConfig } from './stormglass';

/**
 * Fetch historical swell data for a destination
 */
export async function fetchHistoricalSwell(
  latitude: number,
  longitude: number,
  daysBack: number,
  config: StormglassConfig
): Promise<SwellData[]> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysBack);

  return fetchSwellData(latitude, longitude, startDate, endDate, config);
}

