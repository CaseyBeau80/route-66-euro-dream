
import { DailySegment } from './planning/TripPlanBuilder';
import { getWeatherDataForTripDate } from '../components/weather/getWeatherDataForTripDate';
import { WeatherPersistenceService } from '../components/weather/services/WeatherPersistenceService';
import { WeatherDataNormalizer } from '../components/weather/services/WeatherDataNormalizer';

export interface WeatherCacheResult {
  success: boolean;
  cachedSegments: number;
  totalSegments: number;
  errors: string[];
}

export class WeatherPreCacheService {
  /**
   * Pre-cache weather data for all segments before sharing
   */
  static async preCacheWeatherForTrip(
    segments: DailySegment[],
    tripStartDate: Date
  ): Promise<WeatherCacheResult> {
    console.log('🔄 WeatherPreCacheService: Starting pre-cache for sharing', {
      segmentCount: segments.length,
      tripStartDate: tripStartDate.toISOString()
    });

    const result: WeatherCacheResult = {
      success: true,
      cachedSegments: 0,
      totalSegments: segments.length,
      errors: []
    };

    // Clear expired cache entries first
    WeatherPersistenceService.clearExpiredEntries();

    for (const segment of segments) {
      try {
        const segmentDate = new Date(tripStartDate.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000);
        
        console.log(`🌤️ Pre-caching weather for Day ${segment.day} (${segment.endCity})`);

        // Check if we already have valid cached data
        const existingCache = WeatherPersistenceService.getWeatherData(
          segment.endCity, 
          segmentDate, 
          segment.day
        );

        if (existingCache) {
          console.log(`💾 Using existing cache for Day ${segment.day}`);
          result.cachedSegments++;
          continue;
        }

        // Fetch fresh weather data
        const weatherData = await getWeatherDataForTripDate(segment.endCity, segmentDate);
        
        if (weatherData) {
          // Normalize and cache the data
          const normalized = WeatherDataNormalizer.normalizeWeatherData(
            weatherData,
            segment.endCity,
            segmentDate
          );

          if (normalized && normalized.isValid) {
            WeatherPersistenceService.storeWeatherData(
              segment.endCity,
              segmentDate,
              normalized,
              segment.day
            );
            
            console.log(`✅ Cached weather for Day ${segment.day}: ${normalized.temperature}°F`);
            result.cachedSegments++;
          } else {
            const error = `Failed to normalize weather data for ${segment.endCity}`;
            console.warn(`⚠️ ${error}`);
            result.errors.push(error);
          }
        } else {
          const error = `No weather data available for ${segment.endCity}`;
          console.warn(`⚠️ ${error}`);
          result.errors.push(error);
        }

        // Small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        const errorMsg = `Failed to cache weather for Day ${segment.day} (${segment.endCity}): ${error instanceof Error ? error.message : 'Unknown error'}`;
        console.error(`❌ ${errorMsg}`);
        result.errors.push(errorMsg);
      }
    }

    result.success = result.errors.length === 0 || result.cachedSegments > 0;

    console.log('📊 Pre-cache results:', {
      success: result.success,
      cached: result.cachedSegments,
      total: result.totalSegments,
      coverage: `${Math.round((result.cachedSegments / result.totalSegments) * 100)}%`,
      errors: result.errors.length
    });

    return result;
  }

  /**
   * Get cache status for a trip without fetching new data
   */
  static getCacheStatus(segments: DailySegment[], tripStartDate: Date) {
    let cachedCount = 0;
    const statusDetails = segments.map(segment => {
      const segmentDate = new Date(tripStartDate.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000);
      const hasCachedData = !!WeatherPersistenceService.getWeatherData(
        segment.endCity,
        segmentDate,
        segment.day
      );
      
      if (hasCachedData) cachedCount++;
      
      return {
        day: segment.day,
        city: segment.endCity,
        cached: hasCachedData
      };
    });

    return {
      cachedSegments: cachedCount,
      totalSegments: segments.length,
      coveragePercentage: Math.round((cachedCount / segments.length) * 100),
      details: statusDetails
    };
  }
}
