
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
    console.log('🔧 PLAN: WeatherFetchingService.fetchWeatherForSegment - ENHANCED PROCESSING', {
      cityName,
      segmentDate: segmentDate.toISOString(),
      hasApiKey: EnhancedWeatherService.hasApiKey(),
      timeoutMs: this.LIVE_FORECAST_TIMEOUT_MS,
      planImplementation: true
    });

    // Cancel any existing request for this city to prevent race conditions
    const requestKey = `${cityName}-${segmentDate.getTime()}`;
    if (this.activeRequests.has(requestKey)) {
      this.activeRequests.get(requestKey)?.abort();
    }

    const abortController = new AbortController();
    this.activeRequests.set(requestKey, abortController);

    try {
      // PLAN IMPLEMENTATION: Enhanced date calculation with consistent normalization
      const normalizedSegmentDate = DateNormalizationService.normalizeSegmentDate(segmentDate);
      const normalizedToday = DateNormalizationService.normalizeSegmentDate(new Date());
      const daysFromToday = DateNormalizationService.getDaysDifference(normalizedToday, normalizedSegmentDate);
      const segmentDateString = DateNormalizationService.toDateString(normalizedSegmentDate);

      // PLAN IMPLEMENTATION: ENHANCED forecast range logic (0-7 days)
      const isWithinForecastRange = daysFromToday >= 0 && daysFromToday <= 7;

      console.log('🔧 PLAN: Enhanced date calculations for forecast range determination', {
        cityName,
        normalizedSegmentDate: normalizedSegmentDate.toISOString(),
        normalizedToday: normalizedToday.toISOString(),
        daysFromToday,
        isWithinForecastRange,
        forecastRange: 'Days 0-7 = LIVE FORECAST attempt, Day 8+ = immediate historical',
        segmentDateString,
        day2SpecialCase: daysFromToday === 1 ? 'THIS_IS_DAY_2_ENHANCED_PROCESSING' : 'other_day',
        planImplementation: true
      });

      // Set loading state
      onLoadingChange(true);
      onError(null);

      // Check if request was aborted
      if (abortController.signal.aborted) {
        console.log('🔧 PLAN: Request aborted for', cityName);
        return;
      }

      // PLAN IMPLEMENTATION: Enhanced live forecast attempt for forecast range (0-7 days)
      if (isWithinForecastRange && EnhancedWeatherService.hasApiKey()) {
        console.log('🔧 PLAN: *** ATTEMPTING ENHANCED LIVE FORECAST ***', {
          cityName,
          daysFromToday,
          timeoutMs: this.LIVE_FORECAST_TIMEOUT_MS,
          isDay2: daysFromToday === 1,
          day2Enhancement: daysFromToday === 1 ? 'DAY_2_SPECIAL_PROCESSING' : 'other_forecast_day',
          planImplementation: true
        });

        try {
          // PLAN IMPLEMENTATION: Enhanced live forecast with improved API handler
          const liveForecastPromise = this.attemptEnhancedLiveForecast(
            cityName,
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
            console.log('🔧 PLAN: Request aborted after live forecast attempt for', cityName);
            return;
          }

          if (result && result.isActualForecast) {
            console.log('✅ PLAN: *** ENHANCED LIVE FORECAST SUCCESS ***', {
              cityName,
              temperature: result.temperature,
              highTemp: result.highTemp,
              lowTemp: result.lowTemp,
              source: result.source,
              isDay2Success: daysFromToday === 1,
              timeoutMs: this.LIVE_FORECAST_TIMEOUT_MS,
              planImplementation: true
            });
            onLoadingChange(false);
            onWeatherSet(result);
            return;
          }
        } catch (error) {
          const isTimeout = error instanceof Error && error.message === 'Live forecast timeout';
          console.log(`⚠️ PLAN: Enhanced live forecast ${isTimeout ? 'TIMEOUT' : 'FAILED'}`, {
            cityName,
            isTimeout,
            isDay2: daysFromToday === 1,
            error: error instanceof Error ? error.message : String(error),
            timeoutMs: this.LIVE_FORECAST_TIMEOUT_MS,
            fallingBackToHistorical: true,
            planImplementation: true
          });
          // Continue to fallback - don't set error state
        }
      }

      // PLAN IMPLEMENTATION: Enhanced fallback weather - either beyond range or live forecast failed
      const fallbackReason = isWithinForecastRange ? 'live_forecast_timeout_or_failed' : 'beyond_forecast_range';
      console.log('🔄 PLAN: Using enhanced historical fallback weather', {
        cityName,
        reason: fallbackReason,
        daysFromToday,
        isWithinForecastRange,
        hadApiKey: EnhancedWeatherService.hasApiKey(),
        isDay2Fallback: daysFromToday === 1,
        planImplementation: true
      });

      const fallbackWeather = WeatherFallbackService.createFallbackForecast(
        cityName,
        normalizedSegmentDate,
        segmentDateString,
        daysFromToday
      );

      // Check if request was aborted
      if (abortController.signal.aborted) {
        console.log('🔧 PLAN: Request aborted after fallback creation for', cityName);
        return;
      }

      // Set the fallback weather
      onLoadingChange(false);
      onWeatherSet(fallbackWeather);

    } catch (error) {
      console.error('❌ PLAN: Critical error in enhanced weather fetching for', cityName, ':', error);
      
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

  private static async attemptEnhancedLiveForecast(
    cityName: string,
    normalizedSegmentDate: Date,
    targetDateString: string,
    daysFromToday: number,
    abortController: AbortController
  ): Promise<ForecastWeatherData | null> {
    console.log('🔧 PLAN: attemptEnhancedLiveForecast starting', {
      cityName,
      targetDateString,
      daysFromToday,
      isDay2: daysFromToday === 1,
      planImplementation: true
    });

    // Get coordinates with enhanced error handling
    const coordinates = await GeocodingService.getCoordinates(cityName);
    
    if (abortController.signal.aborted) {
      console.log('🔧 PLAN: Aborted after geocoding for', cityName);
      return null;
    }

    if (!coordinates) {
      console.error('❌ PLAN: Enhanced geocoding failed for', cityName, {
        cityName,
        day2Issue: daysFromToday === 1,
        planImplementation: true
      });
      return null;
    }

    console.log('✅ PLAN: Enhanced geocoding success for', cityName, {
      coordinates,
      lat: coordinates.lat,
      lng: coordinates.lng,
      isDay2: daysFromToday === 1,
      planImplementation: true
    });

    const apiKey = EnhancedWeatherService.getApiKey();
    if (!apiKey || apiKey === 'key-available') {
      console.log('⚠️ PLAN: No valid API key for enhanced live forecast', { 
        apiKey,
        planImplementation: true 
      });
      return null;
    }

    console.log('🔧 PLAN: Attempting enhanced weather API call', {
      cityName,
      coordinates,
      targetDateString,
      daysFromToday,
      isDay2: daysFromToday === 1,
      apiKey: apiKey ? 'present' : 'missing',
      planImplementation: true
    });

    // PLAN IMPLEMENTATION: Use enhanced API handler with improved processing
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
      console.log('🔧 PLAN: Aborted after enhanced weather fetch for', cityName);
      return null;
    }

    console.log('🔧 PLAN: Enhanced live forecast result', {
      cityName,
      hasWeather: !!weather,
      isActualForecast: weather?.isActualForecast,
      temperature: weather?.temperature,
      source: weather?.source,
      isDay2Result: daysFromToday === 1,
      day2Success: daysFromToday === 1 && !!weather?.isActualForecast,
      planImplementation: true
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
