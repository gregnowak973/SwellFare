/**
 * Stormglass API Integration
 * Fetches swell and weather data for surf destinations
 */

import { SwellData } from '@/lib/surfLogic';

export interface StormglassResponse {
  hours: Array<{
    time: string;
    swellHeight?: { noaa?: number; meteo?: number };
    swellPeriod?: { noaa?: number; meteo?: number };
    windSpeed?: { noaa?: number; meteo?: number };
    windDirection?: { noaa?: number; meteo?: number };
  }>;
}

export interface StormglassConfig {
  apiKey: string;
  baseUrl?: string;
}

const DEFAULT_BASE_URL = 'https://api.stormglass.io/v2';

/**
 * Fetch swell data from Stormglass API
 */
export async function fetchSwellData(
  latitude: number,
  longitude: number,
  startDate: Date,
  endDate: Date,
  config: StormglassConfig
): Promise<SwellData[]> {
  const baseUrl = config.baseUrl || DEFAULT_BASE_URL;
  const params = new URLSearchParams({
    lat: latitude.toString(),
    lng: longitude.toString(),
    start: Math.floor(startDate.getTime() / 1000).toString(),
    end: Math.floor(endDate.getTime() / 1000).toString(),
    params: 'swellHeight,swellPeriod,windSpeed,windDirection',
  });

  try {
    const response = await fetch(`${baseUrl}/weather/point?${params}`, {
      headers: {
        'Authorization': config.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Stormglass API error: ${response.statusText}`);
    }

    const data: StormglassResponse = await response.json();
    
    return data.hours
      .map(hour => {
        const swellHeight = hour.swellHeight?.noaa || hour.swellHeight?.meteo;
        const swellPeriod = hour.swellPeriod?.noaa || hour.swellPeriod?.meteo;
        const windSpeed = hour.windSpeed?.noaa || hour.windSpeed?.meteo;
        const windDirection = hour.windDirection?.noaa || hour.windDirection?.meteo;

        if (swellHeight === undefined || swellPeriod === undefined) {
          return null;
        }

        return {
          height: swellHeight,
          period: swellPeriod,
          windSpeed: windSpeed,
          windDirection: windDirection,
        } as SwellData;
      })
      .filter((swell): swell is SwellData => swell !== null);
  } catch (error) {
    console.error('Error fetching swell data:', error);
    throw error;
  }
}

/**
 * Fetch current swell conditions for a destination
 */
export async function fetchCurrentSwell(
  latitude: number,
  longitude: number,
  config: StormglassConfig
): Promise<SwellData | null> {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const swells = await fetchSwellData(latitude, longitude, now, tomorrow, config);
  return swells.length > 0 ? swells[0] : null;
}

