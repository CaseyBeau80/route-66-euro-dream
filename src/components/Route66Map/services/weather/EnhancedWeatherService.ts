
import { WeatherForecastService, ForecastWeatherData } from './WeatherForecastService';
import { EnhancedWeatherApiKeyManager } from './EnhancedWeatherApiKeyManager';

export class EnhancedWeatherService {
  private static instance: EnhancedWeatherService;
  private apiKeyManager: EnhancedWeatherApiKeyManager;
  private forecastService: WeatherForecastService | null = null;

  private constructor() {
    this.apiKeyManager = new EnhancedWeatherApiKeyManager();
  }

  static getInstance(): EnhancedWeatherService {
    if (!EnhancedWeatherService.instance) {
      EnhancedWeatherService.instance = new EnhancedWeatherService();
    }
    return EnhancedWeatherService.instance;
  }

  hasApiKey(): boolean {
    // Always refresh from storage to get latest key
    this.apiKeyManager.refreshApiKey();
    return this.apiKeyManager.hasApiKey();
  }

  getApiKey(): string | null {
    this.apiKeyManager.refreshApiKey();
    return this.apiKeyManager.getApiKey();
  }

  setApiKey(apiKey: string): void {
    this.apiKeyManager.setApiKey(apiKey);
    // Reset forecast service to use new API key
    this.forecastService = null;
  }

  private getForecastService(): WeatherForecastService | null {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      return null;
    }
    
    if (!this.forecastService) {
      this.forecastService = new WeatherForecastService(apiKey);
    }
    
    return this.forecastService;
  }

  async getWeatherForDate(
    lat: number,
    lng: number,
    cityName: string,
    targetDate: Date
  ): Promise<ForecastWeatherData | null> {
    if (!this.hasApiKey()) {
      console.warn('❌ EnhancedWeatherService: No API key available for forecast');
      return null;
    }

    const forecastService = this.getForecastService();
    if (!forecastService) {
      console.warn('❌ EnhancedWeatherService: Could not initialize forecast service');
      return null;
    }

    try {
      console.log(`🔮 EnhancedWeatherService: Requesting forecast for ${cityName} on ${targetDate.toDateString()}`);
      return await forecastService.getWeatherForDate(lat, lng, cityName, targetDate);
    } catch (error) {
      console.error('❌ EnhancedWeatherService: Forecast error:', error);
      return null;
    }
  }

  getEnhancedDebugInfo() {
    return this.apiKeyManager.getEnhancedDebugInfo();
  }

  performNuclearCleanup(): void {
    this.apiKeyManager.performNuclearCleanup();
    // Reset forecast service when cleaning up
    this.forecastService = null;
  }

  getDebugInfo() {
    return this.apiKeyManager.getEnhancedDebugInfo();
  }
}
