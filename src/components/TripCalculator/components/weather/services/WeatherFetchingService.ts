
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

  static async fetchWeatherForSegment(
    cityName: string,
    segmentDate: Date,
    onLoadingChange: (loading: boolean) => void,
    onError: (error: string | null) => void,
    onWeatherSet: (weather: ForecastWeatherData | null) => void
  ): Promise<void> {
    console.log('🔧 FIXED: Using WeatherFetchingService for', cityName, 'instead of placeholder');

    // FIXED: Cancel any existing request for this city to prevent race conditions
    const requestKey = `${cityName}-${segmentDate.getTime()}`;
    if (this.activeRequests.has(requestKey)) {
      this.activeRequests.get(requestKey)?.abort();
    }

    const abortController = new AbortController();
    this.activeRequests.set(requestKey, abortController);

    try {
      // Normalize dates for consistent calculation
      const normalizedSegmentDate = DateNormalizationService.normalizeSegmentDate(segmentDate);
      const normalizedToday = DateNormalizationService.normalizeSegmentDate(new Date());
      const daysFromToday = DateNormalizationService.getDaysDifference(normalizedToday, normalizedSegmentDate);
      const segmentDateString = DateNormalizationService.toDateString(normalizedSegmentDate);

      console.log('🔧 PLAN: WeatherFetchingService - STANDARDIZED FORECAST RANGE 0-7 WITH FALLBACK ENABLED', {
        cityName,
        normalizedToday: normalizedToday.toISOString(),
        normalizedTodayLocal: normalizedToday.toLocaleDateString(),
        normalizedSegmentDate: normalizedSegmentDate.toISOString(),
        normalizedSegmentLocal: normalizedSegmentDate.toLocaleDateString(),
        daysFromToday,
        isWithinForecastRange: daysFromToday >= 0 && daysFromToday <= 7,
        shouldAttemptLiveForecast: daysFromToday >= 0 && daysFromToday <= 7,
        segmentDateString,
        dateCalculationMethod: 'DateNormalizationService_LOCAL',
        forecastLogic: 'Days 0-7 = TRY live forecast then fallback, Day 8+ = direct fallback',
        standardizedRange: true,
        localDateCalculation: true,
        fallbackEnabled: true
      });

      // FIXED: Single state update to start loading
      onLoadingChange(true);
      onError(null);

      // Check if request was aborted
      if (abortController.signal.aborted) {
        return;
      }

      // Determine if we should attempt live forecast (days 0-7)
      const shouldAttemptLiveForecast = daysFromToday >= 0 && daysFromToday <= 7;

      if (shouldAttemptLiveForecast && EnhancedWeatherService.hasApiKey()) {
        console.log('🔧 PLAN: ATTEMPTING live forecast with fallback for forecast range date', {
          cityName,
          daysFromToday,
          reason: 'within_0_to_7_day_range_attempt_live_then_fallback',
          standardizedForecastRange: true,
          localDateCalculation: true,
          fallbackEnabled: true
        });

        try {
          // FIXED: Attempt live forecast without additional state updates
          const coordinates = await GeocodingService.getCoordinates(cityName);
          
          // Check if request was aborted
          if (abortController.signal.aborted) {
            return;
          }

          if (coordinates) {
            const weatherService = new WeatherForecastService(EnhancedWeatherService.getApiKey()!);
            const weather = await weatherService.getWeatherForDate(
              coordinates.lat,
              coordinates.lng,
              cityName,
              normalizedSegmentDate
            );

            // Check if request was aborted
            if (abortController.signal.aborted) {
              return;
            }

            if (weather && weather.isActualForecast) {
              console.log('✅ Live forecast SUCCESS for', cityName);
              
              // FIXED: Single state update for success
              onLoadingChange(false);
              onWeatherSet(weather);
              return;
            }
          }
        } catch (error) {
          console.log('⚠️ Live forecast failed for', cityName, 'falling back to historical data:', error);
          // Don't update error state here, just continue to fallback
        }
      }

      // FIXED: Direct fallback without additional loading state changes
      console.log('🔄 Using fallback weather for', cityName, {
        reason: shouldAttemptLiveForecast ? 'live_forecast_failed' : 'beyond_forecast_range',
        daysFromToday
      });

      const fallbackWeather = WeatherFallbackService.createFallbackForecast(
        cityName,
        normalizedSegmentDate,
        segmentDateString,
        daysFromToday
      );

      // Check if request was aborted
      if (abortController.signal.aborted) {
        return;
      }

      // FIXED: Single final state update
      onLoadingChange(false);
      onWeatherSet(fallbackWeather);

    } catch (error) {
      console.error('❌ WeatherFetchingService error for', cityName, ':', error);
      
      if (!abortController.signal.aborted) {
        // FIXED: Minimal error handling - still provide fallback
        const fallbackWeather = WeatherFallbackService.createFallbackForecast(
          cityName,
          segmentDate,
          DateNormalizationService.toDateString(segmentDate),
          0
        );
        
        onLoadingChange(false);
        onError(null); // Don't show error, just use fallback
        onWeatherSet(fallbackWeather);
      }
    } finally {
      this.activeRequests.delete(requestKey);
    }
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
