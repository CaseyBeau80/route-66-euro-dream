
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
    console.log('🔧 FIXED: WeatherFetchingService.fetchWeatherForSegment called for', cityName, {
      segmentDate: segmentDate.toISOString(),
      hasApiKey: EnhancedWeatherService.hasApiKey()
    });

    // Cancel any existing request for this city to prevent race conditions
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

      console.log('🔧 WeatherFetchingService: Date calculations', {
        cityName,
        normalizedSegmentDate: normalizedSegmentDate.toISOString(),
        daysFromToday,
        isWithinForecastRange: daysFromToday >= 0 && daysFromToday <= 7
      });

      // Set loading state
      onLoadingChange(true);
      onError(null);

      // Check if request was aborted
      if (abortController.signal.aborted) {
        console.log('🔧 WeatherFetchingService: Request aborted for', cityName);
        return;
      }

      // Determine if we should attempt live forecast (days 0-7)
      const shouldAttemptLiveForecast = daysFromToday >= 0 && daysFromToday <= 7;

      if (shouldAttemptLiveForecast && EnhancedWeatherService.hasApiKey()) {
        console.log('🔧 WeatherFetchingService: Attempting live forecast for', cityName);

        try {
          // Attempt live forecast
          const coordinates = await GeocodingService.getCoordinates(cityName);
          
          // Check if request was aborted
          if (abortController.signal.aborted) {
            console.log('🔧 WeatherFetchingService: Request aborted after geocoding for', cityName);
            return;
          }

          if (coordinates) {
            const apiKey = EnhancedWeatherService.getApiKey();
            if (apiKey && apiKey !== 'key-available') {
              // We have a real API key, try to get actual weather service instance
              const weatherService = new WeatherForecastService(apiKey);
              const weather = await weatherService.getWeatherForDate(
                coordinates.lat,
                coordinates.lng,
                cityName,
                normalizedSegmentDate
              );

              // Check if request was aborted
              if (abortController.signal.aborted) {
                console.log('🔧 WeatherFetchingService: Request aborted after weather fetch for', cityName);
                return;
              }

              if (weather && weather.isActualForecast) {
                console.log('✅ WeatherFetchingService: Live forecast SUCCESS for', cityName);
                onLoadingChange(false);
                onWeatherSet(weather);
                return;
              }
            }
          }
        } catch (error) {
          console.log('⚠️ WeatherFetchingService: Live forecast failed for', cityName, 'falling back to historical data:', error);
          // Don't update error state here, just continue to fallback
        }
      }

      // Use fallback weather
      console.log('🔄 WeatherFetchingService: Using fallback weather for', cityName, {
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
        console.log('🔧 WeatherFetchingService: Request aborted after fallback creation for', cityName);
        return;
      }

      // Set the fallback weather
      onLoadingChange(false);
      onWeatherSet(fallbackWeather);

    } catch (error) {
      console.error('❌ WeatherFetchingService: Error for', cityName, ':', error);
      
      if (!abortController.signal.aborted) {
        // Provide fallback even on error
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
