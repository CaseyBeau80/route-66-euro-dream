import { DateNormalizationService } from '../DateNormalizationService';

export class WeatherPersistenceService {
  private static readonly CACHE_PREFIX = 'weather_';
  private static readonly CACHE_DURATION_HOURS = 6; // Cache for 6 hours
  private static readonly MAX_CACHE_ENTRIES = 100;

  // 🔧 PLAN: Enhanced cache key generation with city+date+day isolation
  static generateCacheKey(cityName: string, date: Date, segmentDay?: number): string {
    const normalizedCity = cityName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const dateString = date.toISOString().split('T')[0];
    const daySegment = segmentDay ? `-day${segmentDay}` : '';
    const enhancedKey = `${normalizedCity}-${dateString}${daySegment}`;
    
    console.log('🔧 PLAN: Generated ENHANCED cache key with isolation:', {
      cityName,
      dateString,
      segmentDay,
      enhancedKey,
      isolationLevel: 'city+date+day'
    });
    
    return enhancedKey;
  }

  static storeWeatherData(cityName: string, date: Date, weatherData: any, segmentDay?: number): void {
    try {
      const cacheKey = this.generateCacheKey(cityName, date, segmentDay);
      const cacheEntry = {
        data: weatherData,
        timestamp: Date.now(),
        cityName,
        date: date.toISOString(),
        segmentDay: segmentDay || 0,
        isolationMarker: `${cityName}-${segmentDay || 0}` // 🔧 PLAN: Isolation marker
      };

      localStorage.setItem(`${this.CACHE_PREFIX}${cacheKey}`, JSON.stringify(cacheEntry));
      
      console.log('💾 PLAN: Stored weather data with ENHANCED ISOLATION', {
        cacheKey,
        temperature: weatherData.temperature,
        source: weatherData.source,
        cityName,
        segmentDay,
        isolationMarker: cacheEntry.isolationMarker,
        planImplementation: true
      });

      // Clean up old entries
      this.cleanupOldEntries();
    } catch (error) {
      console.error('❌ WeatherPersistenceService: Error storing weather data:', error);
    }
  }

  static getWeatherData(cityName: string, date: Date, segmentDay?: number): any | null {
    try {
      const cacheKey = this.generateCacheKey(cityName, date, segmentDay);
      const stored = localStorage.getItem(`${this.CACHE_PREFIX}${cacheKey}`);
      
      if (!stored) {
        console.log('💾 PLAN: No cached data found with ENHANCED KEY', { 
          cacheKey,
          cityName,
          segmentDay,
          planImplementation: true 
        });
        return null;
      }

      const cacheEntry = JSON.parse(stored);
      const now = Date.now();
      const cacheAge = now - cacheEntry.timestamp;
      const maxAge = this.CACHE_DURATION_HOURS * 60 * 60 * 1000;

      // 🔧 PLAN: Enhanced isolation validation
      const expectedIsolationMarker = `${cityName}-${segmentDay || 0}`;
      if (cacheEntry.isolationMarker !== expectedIsolationMarker) {
        console.warn('⚠️ PLAN: ISOLATION MARKER MISMATCH - clearing invalid cache', {
          cacheKey,
          expected: expectedIsolationMarker,
          found: cacheEntry.isolationMarker,
          ISOLATION_BREACH: true
        });
        localStorage.removeItem(`${this.CACHE_PREFIX}${cacheKey}`);
        return null;
      }

      // PLAN IMPLEMENTATION: Enhanced forecast range calculation with consistent logic
      const today = new Date();
      const normalizedToday = DateNormalizationService.normalizeSegmentDate(today);
      const normalizedTargetDate = DateNormalizationService.normalizeSegmentDate(date);
      const daysFromToday = DateNormalizationService.getDaysDifference(normalizedToday, normalizedTargetDate);
      
      // PLAN IMPLEMENTATION: ENHANCED forecast range 0-7 days with bypass logic
      const isWithinForecastRange = daysFromToday >= 0 && daysFromToday <= 7;

      console.log('💾 PLAN: Enhanced cache decision with FORECAST RANGE BYPASS AND ISOLATION', {
        cacheKey,
        normalizedToday: normalizedToday.toISOString(),
        normalizedTargetDate: normalizedTargetDate.toISOString(),
        daysFromToday,
        isWithinForecastRange,
        forecastRange: 'Days 0-7 = FORCE live forecast attempt, Day 8+ = allow cache',
        cacheBypassForForecastRange: true,
        isolationMarker: cacheEntry.isolationMarker,
        cacheDecision: isWithinForecastRange ? 'BYPASS_CACHE_FORCE_LIVE_ATTEMPT' : 'USE_CACHE_IF_VALID',
        planImplementation: true
      });

      // PLAN IMPLEMENTATION: CRITICAL - ALWAYS bypass cache for forecast range dates (0-7)
      // This ensures Day 2 (and other forecast range days) always attempt live forecasts
      if (isWithinForecastRange) {
        console.log('💾 PLAN: *** CACHE BYPASS ENFORCED FOR FORECAST RANGE WITH ISOLATION ***', {
          cacheKey,
          daysFromToday,
          reason: 'within_0_to_7_day_forecast_range_MUST_attempt_live',
          bypassEnforced: true,
          isolationMarker: cacheEntry.isolationMarker,
          day2Fix: daysFromToday === 1 ? 'THIS_IS_DAY_2_BYPASS' : 'other_forecast_day_bypass',
          planImplementation: true
        });
        return null;
      }

      if (cacheAge > maxAge) {
        console.log('💾 PLAN: Cache expired with ISOLATION', {
          cacheKey,
          cacheAgeHours: cacheAge / (60 * 60 * 1000),
          maxAgeHours: this.CACHE_DURATION_HOURS,
          isolationMarker: cacheEntry.isolationMarker,
          planImplementation: true
        });
        localStorage.removeItem(`${this.CACHE_PREFIX}${cacheKey}`);
        return null;
      }

      console.log('✅ PLAN: Retrieved cached weather data with ISOLATION (beyond forecast range)', {
        cacheKey,
        temperature: cacheEntry.data.temperature,
        daysFromToday,
        reason: 'beyond_forecast_range_and_cache_valid',
        isolationMarker: cacheEntry.isolationMarker,
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
