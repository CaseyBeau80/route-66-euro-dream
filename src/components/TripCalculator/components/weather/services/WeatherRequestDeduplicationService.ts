
import { DeduplicationStats } from './WeatherDeduplicationTypes';
import { WeatherCacheService } from './WeatherCacheService';
import { WeatherRequestManager } from './WeatherRequestManager';

class WeatherRequestDeduplicationService {
  private static instance: WeatherRequestDeduplicationService;
  private cacheService = new WeatherCacheService();
  private requestManager = new WeatherRequestManager();

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
    timeoutMs: number = 8000
  ): Promise<T> {
    console.log(`🔄 WeatherDedup: Request for ${key} from subscriber ${subscriberId}`);
    
    // Check cache first
    const cachedData = this.cacheService.getCachedData(key);
    if (cachedData) {
      return cachedData;
    }

    // Check for existing pending request
    if (this.requestManager.hasPendingRequest(key)) {
      console.log(`🔗 WeatherDedup: Joining existing request for ${key}`);
      this.requestManager.addSubscriberToPendingRequest(key, subscriberId);
      const existing = this.requestManager.getPendingRequest(key);
      return existing!.promise;
    }

    // Create new request
    const requestPromise = this.requestManager.createPendingRequest(
      key,
      requestFn,
      subscriberId,
      timeoutMs
    );

    try {
      const result = await requestPromise;
      const existing = this.requestManager.getPendingRequest(key);
      const subscribersCount = existing?.subscribers.size || 0;
      
      console.log(`✅ WeatherDedup: Request completed for ${key}, ${subscribersCount} subscribers`);
      
      // Cache the result
      this.cacheService.setCachedData(key, result);
      
      return result;
    } catch (error) {
      console.error(`❌ WeatherDedup: Request failed for ${key}:`, error);
      throw error;
    } finally {
      // Clean up
      this.requestManager.removePendingRequest(key);
    }
  }

  clearCache(): void {
    console.log('🧹 WeatherDedup: Clearing cache and pending requests');
    this.requestManager.clearPendingRequests();
    this.cacheService.clearCache();
  }

  getStats(): DeduplicationStats {
    return {
      pending: this.requestManager.getPendingRequestsCount(),
      cached: this.cacheService.getCacheSize()
    };
  }
}

export default WeatherRequestDeduplicationService;
