
import { WeatherForecastService, ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherFallbackService } from '@/components/Route66Map/services/weather/WeatherFallbackService';
import { GeocodingService } from './GeocodingService';
import { EnhancedWeatherService } from './EnhancedWeatherService';
import { DateNormalizationService } from '../DateNormalizationService';
import { WeatherForecastApiHandler } from '@/components/Route66Map/services/weather/WeatherForecastApiHandler';

export interface WeatherFetchCallbacks {
  onLoadingChange: (loading: boolean) => void;
  onError: (error: string | null) => void;
  onWeatherSet: (weather: ForecastWeatherData | null) => void;
}

export class WeatherFetchingService {
  private static activeRequests = new Map<string, AbortController>();
  private static readonly LIVE_FORECAST_TIMEOUT_MS = 5000;

  static async fetchWeatherForSegment(
    cityName: string,
    segmentDate: Date,
    onLoadingChange: (loading: boolean) => void,
    onError: (error: string | null) => void,
    onWeatherSet: (weather: ForecastWeatherData | null) => void
  ): Promise<void> {
    console.log('🔧 ENHANCED: WeatherFetchingService.fetchWeatherForSegment - IMPROVED GEOCODING', {
      cityName,
      segmentDate: segmentDate.toISOString(),
      hasApiKey: EnhancedWeatherService.hasApiKey(),
      timeoutMs: this.LIVE_FORECAST_TIMEOUT_MS,
      enhancedGeocoding: true
    });

    // Cancel any existing request for this city to prevent race conditions
    const requestKey = `${cityName}-${segmentDate.getTime()}`;
    if (this.activeRequests.has(requestKey)) {
      this.activeRequests.get(requestKey)?.abort();
    }

    const abortController = new AbortController();
    this.activeRequests.set(requestKey, abortController);

    try {
      // ENHANCED: Date calculation with consistent normalization
      const normalizedSegmentDate = DateNormalizationService.normalizeSegmentDate(segmentDate);
      const normalizedToday = DateNormalizationService.normalizeSegmentDate(new Date());
      const daysFromToday = DateNormalizationService.getDaysDifference(normalizedToday, normalizedSegmentDate);
      const segmentDateString = DateNormalizationService.toDateString(normalizedSegmentDate);

      // ENHANCED: Forecast range logic (0-7 days for live forecast)
      const isWithinForecastRange = daysFromToday >= 0 && daysFromToday <= 7;

      console.log('🔧 ENHANCED: Date calculations with improved geocoding fallback', {
        cityName,
        normalizedSegmentDate: normalizedSegmentDate.toISOString(),
        normalizedToday: normalizedToday.toISOString(),
        daysFromToday,
        isWithinForecastRange,
        forecastRange: 'Days 0-7 = LIVE FORECAST attempt, Day 8+ = immediate historical',
        segmentDateString,
        improvedGeocoding: true
      });

      // Set loading state
      onLoadingChange(true);
      onError(null);

      // Check if request was aborted
      if (abortController.signal.aborted) {
        console.log('🔧 ENHANCED: Request aborted for', cityName);
        return;
      }

      // ENHANCED: Always attempt geocoding first to verify coordinates exist
      console.log('🗺️ ENHANCED: Pre-checking coordinates for', cityName);
      const coordinates = await GeocodingService.getCoordinates(cityName);
      
      if (!coordinates) {
        console.warn('⚠️ ENHANCED: No coordinates found for', cityName, '- using location-based fallback');
        
        // Use location error fallback immediately if no coordinates
        const locationErrorFallback = WeatherFallbackService.createFallbackForecast(
          cityName,
          normalizedSegmentDate,
          segmentDateString,
          daysFromToday
        );
        
        // Check if request was aborted
        if (abortController.signal.aborted) {
          console.log('🔧 ENHANCED: Request aborted after location error fallback for', cityName);
          return;
        }
        
        onLoadingChange(false);
        onWeatherSet(locationErrorFallback);
        return;
      }

      console.log('✅ ENHANCED: Coordinates verified for', cityName, coordinates);

      // ENHANCED: Attempt live forecast for cities within forecast range with valid coordinates
      if (isWithinForecastRange && EnhancedWeatherService.hasApiKey()) {
        console.log('🔧 ENHANCED: *** ATTEMPTING LIVE FORECAST WITH VERIFIED COORDINATES ***', {
          cityName,
          daysFromToday,
          coordinates,
          timeoutMs: this.LIVE_FORECAST_TIMEOUT_MS,
          verifiedCoordinates: true
        });

        try {
          const liveForecastPromise = this.attemptLiveForecastWithCoordinates(
            cityName,
            coordinates,
            normalizedSegmentDate,
            segmentDateString,
            daysFromToday,
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
            console.log('🔧 ENHANCED: Request aborted after live forecast attempt for', cityName);
            return;
          }

          if (result && result.isActualForecast) {
            console.log('✅ ENHANCED: *** LIVE FORECAST SUCCESS WITH VERIFIED COORDINATES ***', {
              cityName,
              temperature: result.temperature,
              highTemp: result.highTemp,
              lowTemp: result.lowTemp,
              source: result.source,
              verifiedCoordinates: true
            });
            onLoadingChange(false);
            onWeatherSet(result);
            return;
          }
        } catch (error) {
          const isTimeout = error instanceof Error && error.message === 'Live forecast timeout';
          console.log(`⚠️ ENHANCED: Live forecast ${isTimeout ? 'TIMEOUT' : 'API FAILED'}`, {
            cityName,
            isTimeout,
            error: error instanceof Error ? error.message : String(error),
            timeoutMs: this.LIVE_FORECAST_TIMEOUT_MS,
            coordinatesWereValid: true,
            fallingBackToHistorical: true
          });
          // Continue to fallback - don't set error state
        }
      }

      // ENHANCED: Historical fallback with clear reasoning
      const fallbackReason = !isWithinForecastRange ? 'beyond_forecast_range' 
        : !EnhancedWeatherService.hasApiKey() ? 'no_api_key'
        : 'live_forecast_timeout_or_api_failed';
        
      console.log('🔄 ENHANCED: Using historical fallback weather with verified coordinates', {
        cityName,
        reason: fallbackReason,
        daysFromToday,
        isWithinForecastRange,
        hadApiKey: EnhancedWeatherService.hasApiKey(),
        hadValidCoordinates: true
      });

      const fallbackWeather = WeatherFallbackService.createFallbackForecast(
        cityName,
        normalizedSegmentDate,
        segmentDateString,
        daysFromToday
      );

      // Check if request was aborted
      if (abortController.signal.aborted) {
        console.log('🔧 ENHANCED: Request aborted after fallback creation for', cityName);
        return;
      }

      // Set the fallback weather
      onLoadingChange(false);
      onWeatherSet(fallbackWeather);

    } catch (error) {
      console.error('❌ ENHANCED: Critical error in weather fetching for', cityName, ':', error);
      
      if (!abortController.signal.aborted) {
        // Provide emergency fallback
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

  private static async attemptLiveForecastWithCoordinates(
    cityName: string,
    coordinates: { lat: number; lng: number },
    normalizedSegmentDate: Date,
    targetDateString: string,
    daysFromToday: number,
    abortController: AbortController
  ): Promise<ForecastWeatherData | null> {
    console.log('🔧 ENHANCED: attemptLiveForecastWithCoordinates starting', {
      cityName,
      coordinates,
      targetDateString,
      daysFromToday,
      preVerifiedCoordinates: true
    });

    if (abortController.signal.aborted) {
      console.log('🔧 ENHANCED: Aborted before API call for', cityName);
      return null;
    }

    const apiKey = EnhancedWeatherService.getApiKey();
    if (!apiKey || apiKey === 'key-available') {
      console.log('⚠️ ENHANCED: No valid API key for live forecast', { 
        apiKey,
        preVerifiedCoordinates: true
      });
      return null;
    }

    console.log('🔧 ENHANCED: Attempting weather API call with verified coordinates', {
      cityName,
      coordinates,
      targetDateString,
      daysFromToday,
      apiKey: apiKey ? 'present' : 'missing',
      coordinatesPreVerified: true
    });

    // Use enhanced API handler with improved processing
    const apiHandler = new WeatherForecastApiHandler(apiKey);
    const weather = await apiHandler.fetchLiveForecast(
      coordinates.lat,
      coordinates.lng,
      cityName,
      normalizedSegmentDate,
      targetDateString,
      daysFromToday
    );

    if (abortController.signal.aborted) {
      console.log('🔧 ENHANCED: Aborted after weather fetch for', cityName);
      return null;
    }

    console.log('🔧 ENHANCED: Live forecast result with verified coordinates', {
      cityName,
      hasWeather: !!weather,
      isActualForecast: weather?.isActualForecast,
      temperature: weather?.temperature,
      source: weather?.source,
      coordinatesUsed: coordinates,
      preVerifiedSuccess: true
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
