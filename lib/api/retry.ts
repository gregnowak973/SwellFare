/**
 * Enhanced error handling for API calls with retry logic
 */

export interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  retryableErrors?: string[];
}

const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  retryableErrors: ['timeout', 'network', 'rate limit', '429', '503', '502'],
};

/**
 * Retry a function with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      // Check if error is retryable
      const errorMessage = lastError.message.toLowerCase();
      const isRetryable = opts.retryableErrors.some(retryable => 
        errorMessage.includes(retryable.toLowerCase())
      );

      if (!isRetryable || attempt === opts.maxRetries) {
        throw lastError;
      }

      // Exponential backoff
      const delay = opts.retryDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error('Retry failed');
}

/**
 * Enhanced fetch with timeout and retry
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retryOptions: RetryOptions = {}
): Promise<Response> {
  return withRetry(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }, retryOptions);
}

