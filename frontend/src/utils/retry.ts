interface RetryConfig {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
}

interface RetryError extends Error {
  isRetryable?: boolean;
}

const defaultConfig: Required<RetryConfig> = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000,    // 10 seconds
  backoffFactor: 2,
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function withRetry<T>(
  operation: () => Promise<T>,
  config: RetryConfig = {}
): Promise<T> {
  const finalConfig = { ...defaultConfig, ...config };
  let lastError: RetryError;
  let delay = finalConfig.initialDelay;

  for (let attempt = 0; attempt < finalConfig.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as RetryError;
      
      // Don't retry if the error is explicitly marked as non-retryable
      // For example, authentication errors should not be retried
      if (lastError.isRetryable === false) {
        throw lastError;
      }

      // On last attempt, throw the error
      if (attempt === finalConfig.maxRetries - 1) {
        throw lastError;
      }

      // Wait before retrying
      await sleep(delay);
      
      // Exponential backoff with max delay
      delay = Math.min(delay * finalConfig.backoffFactor, finalConfig.maxDelay);
    }
  }

  throw lastError!;
} 