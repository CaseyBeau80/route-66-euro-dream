export class WeatherPersistenceService {
  private static readonly CACHE_PREFIX = 'weather_';
  private static readonly CACHE_DURATION_HOURS = 6; // Cache for 6 hours
  private static readonly MAX_CACHE_ENTRIES = 100;

  static generateCacheKey(cityName: string, date: Date): string {
    const normalizedCity = cityName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const dateString = date.toISOString().split('T')[0];
    return `${normalizedCity}-${dateString}`;
  }

  static storeWeatherData(cityName: string, date: Date, weatherData: any): void {
    try {
      const cacheKey = this.generateCacheKey(cityName, date);
      const cacheEntry = {
        data: weatherData,
        timestamp: Date.now(),
        cityName,
        date: date.toISOString()
      };

      localStorage.setItem(`${this.CACHE_PREFIX}${cacheKey}`, JSON.stringify(cacheEntry));
      
      console.log('💾 WeatherPersistenceService: Stored weather data', {
        cacheKey,
        temperature: weatherData.temperature,
        source: weatherData.source
      });

      // Clean up old entries
      this.cleanupOldEntries();
    } catch (error) {
      console.error('❌ WeatherPersistenceService: Error storing weather data:', error);
    }
  }

  static getWeatherData(cityName: string, date: Date): any | null {
    try {
      const cacheKey = this.generateCacheKey(cityName, date);
      const stored = localStorage.getItem(`${this.CACHE_PREFIX}${cacheKey}`);
      
      if (!stored) {
        console.log('💾 WeatherPersistenceService: No cached data found', { cacheKey });
        return null;
      }

      const cacheEntry = JSON.parse(stored);
      const now = Date.now();
      const cacheAge = now - cacheEntry.timestamp;
      const maxAge = this.CACHE_DURATION_HOURS * 60 * 60 * 1000;

      // FIXED: For forecast range dates (0-6 days), don't use cache to force live forecast attempts
      const today = new Date();
      const targetDate = new Date(date);
      const daysFromToday = Math.ceil((targetDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
      const isWithinForecastRange = daysFromToday >= 0 && daysFromToday <= 6;

      if (isWithinForecastRange) {
        console.log('💾 FIXED: Skipping cache for forecast range date to force live attempt', {
          cacheKey,
          daysFromToday,
          isWithinForecastRange
        });
        return null;
      }

      if (cacheAge > maxAge) {
        console.log('💾 WeatherPersistenceService: Cache expired', {
          cacheKey,
          cacheAgeHours: cacheAge / (60 * 60 * 1000),
          maxAgeHours: this.CACHE_DURATION_HOURS
        });
        localStorage.removeItem(`${this.CACHE_PREFIX}${cacheKey}`);
        return null;
      }

      console.log('✅ WeatherPersistenceService: Retrieved cached weather data', {
        cacheKey,
        temperature: cacheEntry.data.temperature
      });

      return cacheEntry.data;
    } catch (error) {
      console.error('❌ WeatherPersistenceService: Error retrieving weather data:', error);
      return null;
    }
  }

  private static cleanupOldEntries(): void {
    try {
      const allKeys = Object.keys(localStorage);
      const weatherKeys = allKeys.filter(key => key.startsWith(this.CACHE_PREFIX));
      
      if (weatherKeys.length > this.MAX_CACHE_ENTRIES) {
        const entries = weatherKeys.map(key => {
          const stored = localStorage.getItem(key);
          const parsed = stored ? JSON.parse(stored) : null;
          return { key, timestamp: parsed?.timestamp || 0 };
        });

        entries.sort((a, b) => a.timestamp - b.timestamp);
        const toRemove = entries.slice(0, weatherKeys.length - this.MAX_CACHE_ENTRIES);
        
        toRemove.forEach(entry => {
          localStorage.removeItem(entry.key);
        });

        console.log(`💾 WeatherPersistenceService: Cleaned up ${toRemove.length} old cache entries`);
      }
    } catch (error) {
      console.error('❌ WeatherPersistenceService: Error cleaning up cache:', error);
    }
  }

  static clearExpiredEntries(): void {
    try {
      const allKeys = Object.keys(localStorage);
      const weatherKeys = allKeys.filter(key => key.startsWith(this.CACHE_PREFIX));
      const now = Date.now();
      const maxAge = this.CACHE_DURATION_HOURS * 60 * 60 * 1000;
      let removedCount = 0;

      weatherKeys.forEach(key => {
        try {
          const stored = localStorage.getItem(key);
          if (stored) {
            const cacheEntry = JSON.parse(stored);
            const cacheAge = now - cacheEntry.timestamp;
            
            if (cacheAge > maxAge) {
              localStorage.removeItem(key);
              removedCount++;
            }
          }
        } catch (error) {
          localStorage.removeItem(key);
          removedCount++;
        }
      });

      if (removedCount > 0) {
        console.log(`💾 WeatherPersistenceService: Cleared ${removedCount} expired cache entries`);
      }
    } catch (error) {
      console.error('❌ WeatherPersistenceService: Error clearing expired entries:', error);
    }
  }

  static clearAllWeatherData(): void {
    try {
      const allKeys = Object.keys(localStorage);
      const weatherKeys = allKeys.filter(key => key.startsWith(this.CACHE_PREFIX));
      
      weatherKeys.forEach(key => {
        localStorage.removeItem(key);
      });

      console.log(`💾 WeatherPersistenceService: Cleared all ${weatherKeys.length} cached weather entries`);
    } catch (error) {
      console.error('❌ WeatherPersistenceService: Error clearing all weather data:', error);
    }
  }
}
