
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { EnhancedApiKeyDetector } from './EnhancedApiKeyDetector';
import { LiveForecastEnhancer } from './LiveForecastEnhancer';
import { WeatherSourceVerifier } from './WeatherSourceVerifier';
import { WeatherFallbackService } from '@/components/Route66Map/services/weather/WeatherFallbackService';

interface WeatherFetchRequest {
  cityName: string;
  targetDate: Date;
  hasApiKey: boolean;
  isSharedView?: boolean;
}

export class CoreWeatherFetcher {
  static async fetchWeatherForCity(request: WeatherFetchRequest): Promise<ForecastWeatherData | null> {
    const { cityName, targetDate, isSharedView = false } = request;
    
    console.log('🌤️ PLAN: CoreWeatherFetcher enhanced fetch with comprehensive logic:', {
      cityName,
      targetDate: targetDate.toISOString(),
      isSharedView,
      enhancedApiKeyDetection: true,
      liveForecastLogic: true
    });

    try {
      // STEP 1: Enhanced API key detection
      const apiKeyResult = EnhancedApiKeyDetector.detectApiKey();
      EnhancedApiKeyDetector.logDetectionResult(apiKeyResult, `core-${cityName}`);

      // STEP 2: Attempt live forecast if API key is available
      if (apiKeyResult.hasApiKey && apiKeyResult.isValid) {
        console.log('🚀 PLAN: API key detected, attempting live forecast');
        
        const liveResult = await LiveForecastEnhancer.attemptLiveForecast({
          cityName,
          targetDate,
          isSharedView
        });

        if (liveResult.success && liveResult.weather) {
          // Verify the weather source
          const verification = WeatherSourceVerifier.verifyWeatherSource(
            liveResult.weather,
            targetDate,
            apiKeyResult.hasApiKey
          );
          
          WeatherSourceVerifier.logVerificationResult(verification, cityName);

          console.log('✅ PLAN: Live forecast successful with verification:', {
            cityName,
            temperature: liveResult.weather.temperature,
            source: liveResult.weather.source,
            isActualForecast: liveResult.weather.isActualForecast,
            verificationPassed: verification.isValid
          });
          
          return liveResult.weather;
        } else {
          console.log('⚠️ PLAN: Live forecast failed, proceeding to fallback:', {
            reason: liveResult.errorReason,
            attemptDetails: liveResult.attemptDetails
          });
        }
      } else {
        console.log('ℹ️ PLAN: No valid API key detected, using fallback weather');
      }

      // STEP 3: Create fallback weather
      const fallbackWeather = this.createFallbackWeather(cityName, targetDate);
      
      // Verify fallback weather source
      const fallbackVerification = WeatherSourceVerifier.verifyWeatherSource(
        fallbackWeather,
        targetDate,
        apiKeyResult.hasApiKey
      );
      
      WeatherSourceVerifier.logVerificationResult(fallbackVerification, cityName);

      return fallbackWeather;

    } catch (error) {
      console.error('❌ PLAN: CoreWeatherFetcher error:', error);
      return this.createFallbackWeather(cityName, targetDate);
    }
  }

  private static createFallbackWeather(cityName: string, targetDate: Date): ForecastWeatherData {
    const targetDateString = targetDate.toISOString().split('T')[0];
    const daysFromToday = Math.ceil((targetDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));

    console.log('🔄 PLAN: Creating enhanced fallback weather:', {
      cityName,
      targetDateString,
      daysFromToday,
      enhancedFallback: true
    });

    return WeatherFallbackService.createFallbackForecast(
      cityName,
      targetDate,
      targetDateString,
      daysFromToday
    );
  }
}
