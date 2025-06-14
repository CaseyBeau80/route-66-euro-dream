
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { EnhancedApiKeyDetector } from './EnhancedApiKeyDetector';
import { LiveForecastEnhancer } from './LiveForecastEnhancer';
import { WeatherSourceVerifier } from './WeatherSourceVerifier';
import { WeatherFallbackService } from '@/components/Route66Map/services/weather/WeatherFallbackService';

export class SimplifiedWeatherFetchingService {
  static async fetchWeatherForSegment(
    cityName: string,
    segmentDate: Date,
    onLoadingChange: (loading: boolean) => void,
    onError: (error: string | null) => void,
    onWeatherSet: (weather: ForecastWeatherData | null) => void
  ): Promise<void> {
    console.log('🔧 PLAN: SimplifiedWeatherFetchingService enhanced fetch starting:', {
      cityName,
      segmentDate: segmentDate.toISOString(),
      enhancedLogic: true
    });

    try {
      onLoadingChange(true);
      onError(null);

      // STEP 1: Enhanced API key detection
      const apiKeyResult = EnhancedApiKeyDetector.detectApiKey();
      EnhancedApiKeyDetector.logDetectionResult(apiKeyResult, `fetch-${cityName}`);

      // STEP 2: Attempt live forecast if conditions are met
      if (apiKeyResult.hasApiKey && apiKeyResult.isValid) {
        console.log('🚀 PLAN: Attempting live forecast with enhanced logic');
        
        const liveResult = await LiveForecastEnhancer.attemptLiveForecast({
          cityName,
          targetDate: segmentDate,
          isSharedView: true
        });

        if (liveResult.success && liveResult.weather) {
          // STEP 3: Verify weather source
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
            errorReason: liveResult.errorReason,
            attemptDetails: liveResult.attemptDetails
          });
        }
      } else {
        console.log('ℹ️ PLAN: No valid API key, using fallback weather');
      }

      // STEP 4: Fallback to historical weather
      const targetDateString = segmentDate.toISOString().split('T')[0];
      const daysFromToday = Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));

      const fallbackWeather = WeatherFallbackService.createFallbackForecast(
        cityName,
        segmentDate,
        targetDateString,
        daysFromToday
      );

      // STEP 5: Verify fallback source
      const fallbackVerification = WeatherSourceVerifier.verifyWeatherSource(
        fallbackWeather,
        segmentDate,
        apiKeyResult.hasApiKey
      );
      
      WeatherSourceVerifier.logVerificationResult(fallbackVerification, cityName);

      onLoadingChange(false);
      onWeatherSet(fallbackWeather);

    } catch (error) {
      console.error('❌ PLAN: SimplifiedWeatherFetchingService error:', error);
      onLoadingChange(false);
      onError(error instanceof Error ? error.message : 'Weather fetch failed');
    }
  }
}
