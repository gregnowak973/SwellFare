/**
 * Amadeus API Integration
 * Fetches flight prices and availability
 */

export interface AmadeusFlightSearchParams {
  originCode: string;
  destinationCode: string;
  departureDate: string; // YYYY-MM-DD
  returnDate?: string; // YYYY-MM-DD
  adults?: number;
  currency?: string;
}

export interface AmadeusFlightOffer {
  id: string;
  price: {
    total: string;
    currency: string;
  };
  itineraries: Array<{
    duration: string;
    segments: Array<{
      departure: {
        iataCode: string;
        at: string;
      };
      arrival: {
        iataCode: string;
        at: string;
      };
      carrierCode: string;
      number: string;
    }>;
  }>;
}

export interface AmadeusConfig {
  clientId: string;
  clientSecret: string;
  baseUrl?: string;
}

const DEFAULT_BASE_URL = 'https://test.api.amadeus.com';

/**
 * Get OAuth access token from Amadeus API
 * Note: This function uses Buffer which requires Node.js runtime
 */
async function getAmadeusToken(config: AmadeusConfig): Promise<string> {
  const baseUrl = config.baseUrl || DEFAULT_BASE_URL;
  
  // Use btoa for browser compatibility or Buffer for Node.js
  let credentials: string;
  if (typeof Buffer !== 'undefined') {
    // Node.js environment
    credentials = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64');
  } else {
    // Browser/Edge environment - use btoa
    credentials = btoa(`${config.clientId}:${config.clientSecret}`);
  }

  const response = await fetch(`${baseUrl}/v1/security/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${credentials}`,
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error(`Amadeus token error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Search for flight offers
 */
export async function searchFlights(
  params: AmadeusFlightSearchParams,
  config: AmadeusConfig
): Promise<AmadeusFlightOffer[]> {
  const baseUrl = config.baseUrl || DEFAULT_BASE_URL;
  const token = await getAmadeusToken(config);

  const searchParams = new URLSearchParams({
    originLocationCode: params.originCode,
    destinationLocationCode: params.destinationCode,
    departureDate: params.departureDate,
    adults: (params.adults || 1).toString(),
    currencyCode: params.currency || 'USD',
    max: '10', // Limit results
  });

  if (params.returnDate) {
    searchParams.append('returnDate', params.returnDate);
  }

  try {
    const response = await fetch(`${baseUrl}/v2/shopping/flight-offers?${searchParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Amadeus API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching flight data:', error);
    throw error;
  }
}

/**
 * Get cheapest flight for a route
 */
export async function getCheapestFlight(
  params: AmadeusFlightSearchParams,
  config: AmadeusConfig
): Promise<AmadeusFlightOffer | null> {
  const offers = await searchFlights(params, config);
  
  if (offers.length === 0) {
    return null;
  }

  // Sort by price and return cheapest
  return offers.sort((a, b) => 
    parseFloat(a.price.total) - parseFloat(b.price.total)
  )[0];
}
