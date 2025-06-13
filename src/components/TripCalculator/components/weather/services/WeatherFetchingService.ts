
import { WeatherForecastService, ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherFallbackService } from '@/components/Route66Map/services/weather/WeatherFallbackService';
import { GeocodingService } from './GeocodingService';
import { EnhancedWeatherService } from './EnhancedWeatherService';
import { DateNormalizationService } from '../DateNormalizationService';

export interface WeatherFetchCallbacks {
  onLoadingChange: (loading: boolean) => void;
  onError: (error: string | null) => void;
  onWeatherSet: (weather: ForecastWeatherData | null) => void;
}

export class WeatherFetchingService {
  private static activeRequests = new Map<string, AbortController>();
  private static readonly LIVE_FORECAST_TIMEOUT_MS = 5000; // PLAN: 5-second timeout for live forecasts

  static async fetchWeatherForSegment(
    cityName: string,
    segmentDate: Date,
    onLoadingChange: (loading: boolean) => void,
    onError: (error: string | null) => void,
    onWeatherSet: (weather: ForecastWeatherData | null) => void
  ): Promise<void> {
    console.log('🔧 FIXED: WeatherFetchingService.fetchWeatherForSegment - ENHANCED GEOCODING', {
      cityName,
      segmentDate: segmentDate.toISOString(),
      hasApiKey: EnhancedWeatherService.hasApiKey(),
      timeoutMs: this.LIVE_FORECAST_TIMEOUT_MS
    });

    // Cancel any existing request for this city to prevent race conditions
    const requestKey = `${cityName}-${segmentDate.getTime()}`;
    if (this.activeRequests.has(requestKey)) {
      this.activeRequests.get(requestKey)?.abort();
    }

    const abortController = new AbortController();
    this.activeRequests.set(requestKey, abortController);

    try {
      // PLAN: Use standardized date calculation with LOCAL time normalization
      const normalizedSegmentDate = DateNormalizationService.normalizeSegmentDate(segmentDate);
      const normalizedToday = DateNormalizationService.normalizeSegmentDate(new Date());
      const daysFromToday = DateNormalizationService.getDaysDifference(normalizedToday, normalizedSegmentDate);
      const segmentDateString = DateNormalizationService.toDateString(normalizedSegmentDate);

      // PLAN: STANDARDIZED forecast range 0-7 days
      const isWithinForecastRange = daysFromToday >= 0 && daysFromToday <= 7;

      console.log('🔧 FIXED: STANDARDIZED date calculations with enhanced geocoding', {
        cityName,
        normalizedSegmentDate: normalizedSegmentDate.toISOString(),
        normalizedToday: normalizedToday.toISOString(),
        daysFromToday,
        isWithinForecastRange,
        forecastRange: 'Days 0-7 = LIVE FORECAST attempt, Day 8+ = immediate historical',
        localNormalization: true,
        standardizedRange: true
      });

      // Set loading state
      onLoadingChange(true);
      onError(null);

      // Check if request was aborted
      if (abortController.signal.aborted) {
        console.log('🔧 FIXED: Request aborted for', cityName);
        return;
      }

      // PLAN: For forecast range (0-7 days), attempt live forecast with timeout
      if (isWithinForecastRange && EnhancedWeatherService.hasApiKey()) {
        console.log('🔧 FIXED: ATTEMPTING live forecast with enhanced geocoding for', cityName, {
          daysFromToday,
          timeoutMs: this.LIVE_FORECAST_TIMEOUT_MS,
          standardizedRange: true
        });

        try {
          // PLAN: Implement 5-second timeout using Promise.race
          const liveForecastPromise = this.attemptLiveForecast(
            cityName,
            normalizedSegmentDate,
            abortController
          );

          const timeoutPromise = new Promise<null>((_, reject) => {
            setTimeout(() => {
              reject(new Error('Live forecast timeout'));
            }, this.LIVE_FORECAST_TIMEOUT_MS);
          });

          // Race between live forecast and timeout
          const result = await Promise.race([liveForecastPromise, timeoutPromise]);

          // Check if request was aborted
          if (abortController.signal.aborted) {
            console.log('🔧 FIXED: Request aborted after live forecast attempt for', cityName);
            return;
          }

          if (result && result.isActualForecast) {
            console.log('✅ FIXED: Live forecast SUCCESS within timeout for', cityName, {
              temperature: result.temperature,
              source: result.source,
              timeoutMs: this.LIVE_FORECAST_TIMEOUT_MS
            });
            onLoadingChange(false);
            onWeatherSet(result);
            return;
          }
        } catch (error) {
          const isTimeout = error instanceof Error && error.message === 'Live forecast timeout';
          console.log(`⚠️ FIXED: Live forecast ${isTimeout ? 'TIMEOUT' : 'FAILED'} for`, cityName, {
            isTimeout,
            error: error instanceof Error ? error.message : String(error),
            timeoutMs: this.LIVE_FORECAST_TIMEOUT_MS,
            fallingBackToHistorical: true
          });
          // Continue to fallback - don't set error state
        }
      }

      // PLAN: Use fallback weather (historical) - either because beyond range or live forecast failed/timed out
      const fallbackReason = isWithinForecastRange ? 'live_forecast_timeout_or_failed' : 'beyond_forecast_range';
      console.log('🔄 FIXED: Using historical fallback weather for', cityName, {
        reason: fallbackReason,
        daysFromToday,
        isWithinForecastRange,
        hadApiKey: EnhancedWeatherService.hasApiKey()
      });

      const fallbackWeather = WeatherFallbackService.createFallbackForecast(
        cityName,
        normalizedSegmentDate,
        segmentDateString,
        daysFromToday
      );

      // Check if request was aborted
      if (abortController.signal.aborted) {
        console.log('🔧 FIXED: Request aborted after fallback creation for', cityName);
        return;
      }

      // Set the fallback weather
      onLoadingChange(false);
      onWeatherSet(fallbackWeather);

    } catch (error) {
      console.error('❌ FIXED: Critical error for', cityName, ':', error);
      
      if (!abortController.signal.aborted) {
        // Provide fallback even on critical error
        const emergencyFallback = WeatherFallbackService.createFallbackForecast(
          cityName,
          segmentDate,
          DateNormalizationService.toDateString(segmentDate),
          0
        );
        
        onLoadingChange(false);
        onError(null); // Don't show error, just use fallback
        onWeatherSet(emergencyFallback);
      }
    } finally {
      this.activeRequests.delete(requestKey);
    }
  }

  private static async attemptLiveForecast(
    cityName: string,
    normalizedSegmentDate: Date,
    abortController: AbortController
  ): Promise<ForecastWeatherData | null> {
    console.log('🔧 FIXED: attemptLiveForecast starting with enhanced geocoding for', cityName);

    // Get coordinates with enhanced error handling
    const coordinates = await GeocodingService.getCoordinates(cityName);
    
    if (abortController.signal.aborted) {
      console.log('🔧 FIXED: Aborted after geocoding for', cityName);
      return null;
    }

    if (!coordinates) {
      console.error('❌ FIXED: GEOCODING FAILED for', cityName, {
        cityName,
        attemptedNormalization: true,
        fallbackToHistorical: true,
        geocodingEnhanced: true
      });
      return null;
    }

    console.log('✅ FIXED: Geocoding SUCCESS for', cityName, {
      coordinates,
      lat: coordinates.lat,
      lng: coordinates.lng
    });

    const apiKey = EnhancedWeatherService.getApiKey();
    if (!apiKey || apiKey === 'key-available') {
      console.log('⚠️ FIXED: No valid API key for live forecast', { apiKey });
      return null;
    }

    console.log('🔧 FIXED: Attempting actual weather API call for', cityName, {
      coordinates,
      apiKey: apiKey ? 'present' : 'missing'
    });

    // Try to get actual weather service instance
    const weatherService = new WeatherForecastService(apiKey);
    const weather = await weatherService.getWeatherForDate(
      coordinates.lat,
      coordinates.lng,
      cityName,
      normalizedSegmentDate
    );

    if (abortController.signal.aborted) {
      console.log('🔧 FIXED: Aborted after weather fetch for', cityName);
      return null;
    }

    console.log('🔧 FIXED: Live forecast result for', cityName, {
      hasWeather: !!weather,
      isActualForecast: weather?.isActualForecast,
      temperature: weather?.temperature,
      source: weather?.source
    });

    return weather;
  }

  static cancelRequest(cityName: string, segmentDate: Date): void {
    const requestKey = `${cityName}-${segmentDate.getTime()}`;
    const controller = this.activeRequests.get(requestKey);
    if (controller) {
      controller.abort();
      this.activeRequests.delete(requestKey);
    }
  }

  static cancelAllRequests(): void {
    this.activeRequests.forEach(controller => controller.abort());
    this.activeRequests.clear();
  }
}
