
import { CachedData } from './WeatherDeduplicationTypes';

export class WeatherCacheService {
  private cache = new Map<string, CachedData>();
  private readonly CACHE_DURATION = 60000; // 60 seconds

  getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && (Date.now() - cached.timestamp) < this.CACHE_DURATION) {
      console.log(`💾 WeatherCache: Returning cached data for ${key}`);
      return cached.data;
    }
    return null;
  }

  setCachedData(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clearCache(): void {
    console.log('🧹 WeatherCache: Clearing cache');
    this.cache.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }
}
