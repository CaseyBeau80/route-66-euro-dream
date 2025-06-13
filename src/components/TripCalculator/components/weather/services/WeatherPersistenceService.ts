import { DateNormalizationService } from '../DateNormalizationService';

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

      // Use DateNormalizationService for consistent LOCAL date calculations
      const today = new Date();
      const normalizedToday = DateNormalizationService.normalizeSegmentDate(today);
      const normalizedTargetDate = DateNormalizationService.normalizeSegmentDate(date);
      const daysFromToday = DateNormalizationService.getDaysDifference(normalizedToday, normalizedTargetDate);
      const isWithinForecastRange = daysFromToday >= 0 && daysFromToday <= 7; // PLAN: Standardized to 0-7 range

      console.log('💾 PLAN: WeatherPersistenceService cache decision with STANDARDIZED forecast range 0-7', {
        cacheKey,
        normalizedToday: normalizedToday.toISOString(),
        normalizedTodayLocal: normalizedToday.toLocaleDateString(),
        normalizedTargetDate: normalizedTargetDate.toISOString(),
        normalizedTargetLocal: normalizedTargetDate.toLocaleDateString(),
        daysFromToday,
        isWithinForecastRange,
        forecastRange: 'Days 0-7 = FORCE live forecast attempt, Day 8+ = allow cache',
        standardizedRange: true,
        localDateCalculation: true,
        cacheDecision: isWithinForecastRange ? 'FORCE_SKIP_CACHE_FOR_LIVE_ATTEMPT' : 'USE_CACHE_IF_VALID'
      });

      // NEVER return cached data for forecast range dates (0-7)
      // This forces the system to attempt live forecasts for days 0-7
      if (isWithinForecastRange) {
        console.log('💾 PLAN: FORCING cache skip for forecast range date to ensure live forecast attempt', {
          cacheKey,
          daysFromToday,
          isWithinForecastRange,
          reason: 'within_0_to_7_day_forecast_range_MUST_attempt_live',
          standardizedForecastRange: true,
          localDateCalculation: true
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
        temperature: cacheEntry.data.temperature,
        daysFromToday,
        reason: 'beyond_forecast_range_and_cache_valid',
        standardizedForecastRange: true
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
