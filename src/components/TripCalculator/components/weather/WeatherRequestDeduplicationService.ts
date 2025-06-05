
interface PendingRequest {
  promise: Promise<any>;
  timestamp: number;
  subscribers: Set<string>;
}

class WeatherRequestDeduplicationService {
  private static instance: WeatherRequestDeduplicationService;
  private pendingRequests = new Map<string, PendingRequest>();
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly REQUEST_TIMEOUT = 8000; // 8 seconds
  private readonly CACHE_DURATION = 60000; // 60 seconds

  static getInstance(): WeatherRequestDeduplicationService {
    if (!WeatherRequestDeduplicationService.instance) {
      WeatherRequestDeduplicationService.instance = new WeatherRequestDeduplicationService();
    }
    return WeatherRequestDeduplicationService.instance;
  }

  async deduplicateRequest<T>(
    key: string,
    requestFn: () => Promise<T>,
    subscriberId: string = 'default',
    timeoutMs: number = this.REQUEST_TIMEOUT
  ): Promise<T> {
    console.log(`🔄 WeatherDedup: Request for ${key} from subscriber ${subscriberId}`);
    
    // Check cache first
    const cached = this.cache.get(key);
    if (cached && (Date.now() - cached.timestamp) < this.CACHE_DURATION) {
      console.log(`💾 WeatherDedup: Returning cached data for ${key}`);
      return cached.data;
    }

    // Check for existing pending request
    const existing = this.pendingRequests.get(key);
    if (existing) {
      console.log(`🔗 WeatherDedup: Joining existing request for ${key}`);
      existing.subscribers.add(subscriberId);
      return existing.promise;
    }

    // Create new request
    console.log(`🆕 WeatherDedup: Creating new request for ${key}`);
    const subscribers = new Set([subscriberId]);
    
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        console.log(`⏰ WeatherDedup: Request timeout for ${key}`);
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
      timestamp: Date.now(),
      subscribers
    });

    try {
      const result = await requestPromise;
      console.log(`✅ WeatherDedup: Request completed for ${key}, ${subscribers.size} subscribers`);
      
      // Cache the result
      this.cache.set(key, {
        data: result,
        timestamp: Date.now()
      });
      
      return result;
    } catch (error) {
      console.error(`❌ WeatherDedup: Request failed for ${key}:`, error);
      throw error;
    } finally {
      // Clean up
      this.pendingRequests.delete(key);
    }
  }

  clearCache(): void {
    console.log('🧹 WeatherDedup: Clearing cache and pending requests');
    this.pendingRequests.clear();
    this.cache.clear();
  }

  getStats(): { pending: number; cached: number } {
    return {
      pending: this.pendingRequests.size,
      cached: this.cache.size
    };
  }
}

export default WeatherRequestDeduplicationService;
