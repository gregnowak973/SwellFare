/**
 * Amadeus Token Cache
 * Cache tokens to avoid rate limits and improve performance
 */

import type { AmadeusConfig } from './amadeus';
import { getAmadeusToken } from './amadeus';

interface CachedToken {
  token: string;
  expiresAt: number;
}

let tokenCache: CachedToken | null = null;
const TOKEN_CACHE_DURATION = 55 * 60 * 1000; // 55 minutes (tokens expire in 1 hour)

/**
 * Get cached Amadeus token or fetch new one
 */
export async function getCachedAmadeusToken(config: AmadeusConfig): Promise<string> {
  // Check if cached token is still valid
  if (tokenCache && tokenCache.expiresAt > Date.now()) {
    return tokenCache.token;
  }

  // Fetch new token
  const token = await getAmadeusToken(config);
  
  // Cache it
  tokenCache = {
    token,
    expiresAt: Date.now() + TOKEN_CACHE_DURATION,
  };

  return token;
}

