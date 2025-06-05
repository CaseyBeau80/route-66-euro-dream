
interface PendingRequest {
  promise: Promise<any>;
  timestamp: number;
}

class WeatherRequestDeduplicationService {
  private static instance: WeatherRequestDeduplicationService;
  private pendingRequests = new Map<string, PendingRequest>();
  private readonly REQUEST_TIMEOUT = 10000; // 10 seconds
  private readonly CACHE_DURATION = 30000; // 30 seconds

  static getInstance(): WeatherRequestDeduplicationService {
    if (!WeatherRequestDeduplicationService.instance) {
      WeatherRequestDeduplicationService.instance = new WeatherRequestDeduplicationService();
    }
    return WeatherRequestDeduplicationService.instance;
  }

  async deduplicateRequest<T>(
    key: string,
    requestFn: () => Promise<T>,
    timeoutMs: number = this.REQUEST_TIMEOUT
  ): Promise<T> {
    console.log(`🔄 WeatherRequestDeduplication: Checking for existing request: ${key}`);
    
    // Check if we have a pending request
    const existing = this.pendingRequests.get(key);
    if (existing) {
      const age = Date.now() - existing.timestamp;
      if (age < this.CACHE_DURATION) {
        console.log(`♻️ WeatherRequestDeduplication: Reusing existing request for ${key} (age: ${age}ms)`);
        return existing.promise;
      } else {
        console.log(`🗑️ WeatherRequestDeduplication: Cleaning up stale request for ${key} (age: ${age}ms)`);
        this.pendingRequests.delete(key);
      }
    }

    // Create new request with timeout
    console.log(`🆕 WeatherRequestDeduplication: Creating new request for ${key}`);
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        this.pendingRequests.delete(key);
        reject(new Error(`Request timeout after ${timeoutMs}ms`));
      }, timeoutMs);
    });

    const requestPromise = Promise.race([
      requestFn(),
      timeoutPromise
    ]);

    // Store the pending request
    this.pendingRequests.set(key, {
      promise: requestPromise,
      timestamp: Date.now()
    });

    try {
      const result = await requestPromise;
      console.log(`✅ WeatherRequestDeduplication: Request completed successfully for ${key}`);
      return result;
    } catch (error) {
      console.error(`❌ WeatherRequestDeduplication: Request failed for ${key}:`, error);
      throw error;
    } finally {
      // Clean up after request completes (success or failure)
      setTimeout(() => {
        this.pendingRequests.delete(key);
      }, 1000); // Keep for 1 second to avoid immediate duplicate requests
    }
  }

  clearCache(): void {
    console.log('🧹 WeatherRequestDeduplication: Clearing all cached requests');
    this.pendingRequests.clear();
  }

  getActiveRequestsCount(): number {
    return this.pendingRequests.size;
  }
}

export default WeatherRequestDeduplicationService;
