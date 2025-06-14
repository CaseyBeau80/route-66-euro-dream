
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { EnhancedApiKeyDetector } from './EnhancedApiKeyDetector';
import { LiveForecastEnhancer } from './LiveForecastEnhancer';
import { WeatherSourceVerifier } from './WeatherSourceVerifier';
import { WeatherFallbackService } from '@/components/Route66Map/services/weather/WeatherFallbackService';

export interface WeatherFetchCallbacks {
  onLoadingChange: (loading: boolean) => void;
  onError: (error: string | null) => void;
  onWeatherSet: (weather: ForecastWeatherData | null) => void;
}

export class WeatherFetchCoordinator {
  private static activeRequests = new Map<string, AbortController>();

  static async fetchWeatherForSegment(
    cityName: string,
    segmentDate: Date,
    callbacks: WeatherFetchCallbacks
  ): Promise<void> {
    const { onLoadingChange, onError, onWeatherSet } = callbacks;
    
    console.log('🔧 PLAN: WeatherFetchCoordinator enhanced fetch starting:', {
      cityName,
      segmentDate: segmentDate.toISOString(),
      enhancedLogic: true
    });

    const requestKey = `${cityName}-${segmentDate.getTime()}`;
    
    // Cancel existing request
    if (this.activeRequests.has(requestKey)) {
      this.activeRequests.get(requestKey)?.abort();
    }

    const abortController = new AbortController();
    this.activeRequests.set(requestKey, abortController);

    try {
      onLoadingChange(true);
      onError(null);

      // STEP 1: Enhanced API key detection
      const apiKeyResult = EnhancedApiKeyDetector.detectApiKey();
      EnhancedApiKeyDetector.logDetectionResult(apiKeyResult, `coordinator-${cityName}`);

      if (abortController.signal.aborted) return;

      // STEP 2: Attempt live forecast if API key is available
      if (apiKeyResult.hasApiKey && apiKeyResult.isValid) {
        console.log('🚀 PLAN: Valid API key detected, attempting live forecast');
        
        const liveResult = await LiveForecastEnhancer.attemptLiveForecast({
          cityName,
          targetDate: segmentDate,
          isSharedView: true
        });

        if (abortController.signal.aborted) return;

        if (liveResult.success && liveResult.weather) {
          // Verify the weather source
          const verification = WeatherSourceVerifier.verifyWeatherSource(
            liveResult.weather,
            segmentDate,
            apiKeyResult.hasApiKey
          );
          
          WeatherSourceVerifier.logVerificationResult(verification, cityName);

          onLoadingChange(false);
          onWeatherSet(liveResult.weather);
          return;
        } else {
          console.log('⚠️ PLAN: Live forecast failed, using fallback:', {
            reason: liveResult.errorReason,
            attemptDetails: liveResult.attemptDetails
          });
        }
      } else {
        console.log('ℹ️ PLAN: No valid API key, proceeding to fallback');
      }

      // STEP 3: Create fallback weather
      const targetDateString = segmentDate.toISOString().split('T')[0];
      const daysFromToday = Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));

      const fallbackWeather = WeatherFallbackService.createFallbackForecast(
        cityName,
        segmentDate,
        targetDateString,
        daysFromToday
      );

      if (abortController.signal.aborted) return;

      // Verify fallback weather source
      const fallbackVerification = WeatherSourceVerifier.verifyWeatherSource(
        fallbackWeather,
        segmentDate,
        apiKeyResult.hasApiKey
      );
      
      WeatherSourceVerifier.logVerificationResult(fallbackVerification, cityName);

      onLoadingChange(false);
      onWeatherSet(fallbackWeather);

    } catch (error) {
      if (!abortController.signal.aborted) {
        console.error('❌ PLAN: WeatherFetchCoordinator error:', error);
        onLoadingChange(false);
        onError(error instanceof Error ? error.message : 'Weather fetch failed');
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
