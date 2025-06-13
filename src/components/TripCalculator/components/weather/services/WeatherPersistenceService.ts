
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
      
      console.log('💾 PLAN: Stored weather data', {
        cacheKey,
        temperature: weatherData.temperature,
        source: weatherData.source,
        planImplementation: true
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
        console.log('💾 PLAN: No cached data found', { 
          cacheKey,
          planImplementation: true 
        });
        return null;
      }

      const cacheEntry = JSON.parse(stored);
      const now = Date.now();
      const cacheAge = now - cacheEntry.timestamp;
      const maxAge = this.CACHE_DURATION_HOURS * 60 * 60 * 1000;

      // PLAN IMPLEMENTATION: Enhanced forecast range calculation with consistent logic
      const today = new Date();
      const normalizedToday = DateNormalizationService.normalizeSegmentDate(today);
      const normalizedTargetDate = DateNormalizationService.normalizeSegmentDate(date);
      const daysFromToday = DateNormalizationService.getDaysDifference(normalizedToday, normalizedTargetDate);
      
      // PLAN IMPLEMENTATION: ENHANCED forecast range 0-7 days with bypass logic
      const isWithinForecastRange = daysFromToday >= 0 && daysFromToday <= 7;

      console.log('💾 PLAN: Enhanced cache decision with FORECAST RANGE BYPASS', {
        cacheKey,
        normalizedToday: normalizedToday.toISOString(),
        normalizedTargetDate: normalizedTargetDate.toISOString(),
        daysFromToday,
        isWithinForecastRange,
        forecastRange: 'Days 0-7 = FORCE live forecast attempt, Day 8+ = allow cache',
        cacheBypassForForecastRange: true,
        cacheDecision: isWithinForecastRange ? 'BYPASS_CACHE_FORCE_LIVE_ATTEMPT' : 'USE_CACHE_IF_VALID',
        planImplementation: true
      });

      // PLAN IMPLEMENTATION: CRITICAL - ALWAYS bypass cache for forecast range dates (0-7)
      // This ensures Day 2 (and other forecast range days) always attempt live forecasts
      if (isWithinForecastRange) {
        console.log('💾 PLAN: *** CACHE BYPASS ENFORCED FOR FORECAST RANGE ***', {
          cacheKey,
          daysFromToday,
          reason: 'within_0_to_7_day_forecast_range_MUST_attempt_live',
          bypassEnforced: true,
          day2Fix: daysFromToday === 1 ? 'THIS_IS_DAY_2_BYPASS' : 'other_forecast_day_bypass',
          planImplementation: true
        });
        return null;
      }

      if (cacheAge > maxAge) {
        console.log('💾 PLAN: Cache expired', {
          cacheKey,
          cacheAgeHours: cacheAge / (60 * 60 * 1000),
          maxAgeHours: this.CACHE_DURATION_HOURS,
          planImplementation: true
        });
        localStorage.removeItem(`${this.CACHE_PREFIX}${cacheKey}`);
        return null;
      }

      console.log('✅ PLAN: Retrieved cached weather data (beyond forecast range)', {
        cacheKey,
        temperature: cacheEntry.data.temperature,
        daysFromToday,
        reason: 'beyond_forecast_range_and_cache_valid',
        planImplementation: true
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
