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
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    const response = await fetch(`${baseUrl}/weather/point?${params}`, {
      headers: {
        'Authorization': config.apiKey,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Check response status BEFORE parsing JSON
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Stormglass API error: ${response.status} ${response.statusText}`;
      
      // Try to parse error details if available
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.errors && Array.isArray(errorData.errors)) {
          errorMessage = errorData.errors.map((e: any) => e.message || e).join(', ');
        }
      } catch {
        // If JSON parsing fails, use the text as-is
        if (errorText) {
          errorMessage = errorText;
        }
      }
      
      throw new Error(errorMessage);
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching swell data:', errorMessage);
    }
    
    // Handle timeout/abort errors
    if (error instanceof Error && (error.name === 'AbortError' || errorMessage.includes('aborted'))) {
      throw new Error('Stormglass API request timed out. The API may be slow or unavailable.');
    }
    
    // Provide more helpful error messages
    if (errorMessage.includes('429') || errorMessage.includes('rate limit')) {
      throw new Error('Stormglass API rate limit exceeded. Please try again later.');
    }
    if (errorMessage.includes('401') || errorMessage.includes('403')) {
      throw new Error('Stormglass API authentication failed. Check your API key.');
    }
    
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

