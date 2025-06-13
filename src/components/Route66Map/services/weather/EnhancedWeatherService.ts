
import { WeatherForecastService, ForecastWeatherData } from './WeatherForecastService';
import { EnhancedWeatherApiKeyManager } from './EnhancedWeatherApiKeyManager';

export class EnhancedWeatherService {
  private static instance: EnhancedWeatherService;
  private apiKeyManager: EnhancedWeatherApiKeyManager;
  private forecastService: WeatherForecastService | null = null;

  private constructor() {
    this.apiKeyManager = new EnhancedWeatherApiKeyManager();
    console.log('🌤️ EnhancedWeatherService: Service initialized with enhanced API key manager');
  }

  static getInstance(): EnhancedWeatherService {
    if (!EnhancedWeatherService.instance) {
      EnhancedWeatherService.instance = new EnhancedWeatherService();
    }
    return EnhancedWeatherService.instance;
  }

  refreshApiKey(): void {
    console.log('🔄 EnhancedWeatherService: Refreshing API key');
    this.apiKeyManager.refreshApiKey();
    
    // Reset forecast service to use new API key
    const apiKey = this.apiKeyManager.getApiKey();
    if (apiKey) {
      this.forecastService = new WeatherForecastService(apiKey);
      console.log('✅ EnhancedWeatherService: Forecast service refreshed with new API key');
    } else {
      this.forecastService = null;
      console.log('❌ EnhancedWeatherService: No API key available, forecast service disabled');
    }
  }

  setApiKey(apiKey: string): void {
    console.log('🔑 EnhancedWeatherService: Setting new API key');
    this.apiKeyManager.setApiKey(apiKey);
    this.forecastService = new WeatherForecastService(apiKey);
    console.log('✅ EnhancedWeatherService: API key set and forecast service initialized');
  }

  hasApiKey(): boolean {
    const hasKey = this.apiKeyManager.hasApiKey();
    console.log(`🔍 EnhancedWeatherService: hasApiKey() = ${hasKey}`);
    return hasKey;
  }

  getEnhancedDebugInfo() {
    return this.apiKeyManager.getEnhancedDebugInfo();
  }

  getDebugInfo() {
    return this.apiKeyManager.getEnhancedDebugInfo();
  }

  async getWeatherForDate(
    lat: number,
    lng: number,
    cityName: string,
    targetDate: Date
  ): Promise<ForecastWeatherData | null> {
    console.log('🚨 FIXED: EnhancedWeatherService.getWeatherForDate ENTRY', {
      cityName,
      targetDate: targetDate.toISOString(),
      coordinates: { lat, lng },
      hasApiKey: this.hasApiKey(),
      hasForecastService: !!this.forecastService
    });

    if (!this.hasApiKey()) {
      console.log('❌ EnhancedWeatherService: No API key available');
      return null;
    }

    // Initialize forecast service if needed
    if (!this.forecastService) {
      const apiKey = this.apiKeyManager.getApiKey();
      if (apiKey) {
        this.forecastService = new WeatherForecastService(apiKey);
        console.log('🔧 EnhancedWeatherService: Forecast service initialized on demand');
      } else {
        console.log('❌ EnhancedWeatherService: Cannot initialize forecast service - no API key');
        return null;
      }
    }

    try {
      console.log('🌤️ EnhancedWeatherService: Calling forecast service');
      const result = await this.forecastService.getWeatherForDate(lat, lng, cityName, targetDate);
      
      console.log('🚨 FIXED: EnhancedWeatherService result:', {
        cityName,
        hasResult: !!result,
        isActualForecast: result?.isActualForecast,
        temperature: result?.temperature,
        source: result?.dateMatchInfo?.source
      });

      return result;
    } catch (error) {
      console.error('❌ EnhancedWeatherService: Error getting weather for date:', error);
      return null;
    }
  }

  performNuclearCleanup(): void {
    console.log('💥 EnhancedWeatherService: Performing nuclear cleanup');
    this.apiKeyManager.performNuclearCleanup();
    this.forecastService = null;
    console.log('✅ EnhancedWeatherService: Nuclear cleanup completed');
  }
}
