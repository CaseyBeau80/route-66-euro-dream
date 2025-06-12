
import { NormalizedWeatherData } from './WeatherDataNormalizer';

interface WeatherCacheEntry {
  data: NormalizedWeatherData;
  timestamp: number;
  cityName: string;
  segmentDate: string;
}

export class WeatherPersistenceService {
  private static cache = new Map<string, WeatherCacheEntry>();
  private static readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

  /**
   * Store normalized weather data with cache key
   */
  static storeWeatherData(
    cityName: string,
    segmentDate: Date,
    weatherData: NormalizedWeatherData
  ): void {
    const cacheKey = this.generateCacheKey(cityName, segmentDate);
    
    const entry: WeatherCacheEntry = {
      data: weatherData,
      timestamp: Date.now(),
      cityName,
      segmentDate: segmentDate.toISOString()
    };

    this.cache.set(cacheKey, entry);
    
    console.log('💾 WeatherPersistenceService: Stored weather data', {
      cacheKey,
      cityName,
      hasValidData: weatherData.isValid,
      temperature: weatherData.temperature
    });
  }

  /**
   * Retrieve cached weather data
   */
  static getWeatherData(cityName: string, segmentDate: Date): NormalizedWeatherData | null {
    const cacheKey = this.generateCacheKey(cityName, segmentDate);
    const entry = this.cache.get(cacheKey);

    if (!entry) {
      console.log('🔍 WeatherPersistenceService: No cached data found for', cacheKey);
      return null;
    }

    // Check if cache is still valid
    if (Date.now() - entry.timestamp > this.CACHE_DURATION) {
      console.log('⏰ WeatherPersistenceService: Cache expired for', cacheKey);
      this.cache.delete(cacheKey);
      return null;
    }

    console.log('✅ WeatherPersistenceService: Retrieved cached weather data', {
      cacheKey,
      temperature: entry.data.temperature
    });

    return entry.data;
  }

  /**
   * Check if weather data exists for a segment
   */
  static hasWeatherData(cityName: string, segmentDate: Date): boolean {
    const data = this.getWeatherData(cityName, segmentDate);
    return data !== null && data.isValid;
  }

  /**
   * Get weather statistics for export validation
   */
  static getWeatherStats(): {
    totalCached: number;
    validEntries: number;
    citiesWithWeather: string[];
  } {
    const stats = {
      totalCached: this.cache.size,
      validEntries: 0,
      citiesWithWeather: [] as string[]
    };

    this.cache.forEach((entry, key) => {
      if (entry.data.isValid) {
        stats.validEntries++;
        if (!stats.citiesWithWeather.includes(entry.cityName)) {
          stats.citiesWithWeather.push(entry.cityName);
        }
      }
    });

    return stats;
  }

  private static generateCacheKey(cityName: string, segmentDate: Date): string {
    const dateString = segmentDate.toISOString().split('T')[0];
    return `${cityName.toLowerCase().replace(/\s+/g, '-')}-${dateString}`;
  }

  /**
   * Clear expired cache entries
   */
  static clearExpiredEntries(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > this.CACHE_DURATION) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));
    
    if (keysToDelete.length > 0) {
      console.log('🗑️ WeatherPersistenceService: Cleared', keysToDelete.length, 'expired entries');
    }
  }
}
