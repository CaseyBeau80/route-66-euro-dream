
import { WeatherForecastService, ForecastWeatherData } from './WeatherForecastService';
import { EnhancedWeatherApiKeyManager } from './EnhancedWeatherApiKeyManager';

export class EnhancedWeatherService {
  private static instance: EnhancedWeatherService;
  private apiKeyManager: EnhancedWeatherApiKeyManager;
  private forecastService: WeatherForecastService;

  private constructor() {
    this.apiKeyManager = new EnhancedWeatherApiKeyManager();
    this.forecastService = new WeatherForecastService();
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

    const apiKey = this.getApiKey();
    if (!apiKey) {
      console.warn('❌ EnhancedWeatherService: API key is null');
      return null;
    }

    try {
      console.log(`🔮 EnhancedWeatherService: Requesting forecast for ${cityName} on ${targetDate.toDateString()}`);
      return await this.forecastService.getWeatherForDate(lat, lng, cityName, targetDate, apiKey);
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
  }

  getDebugInfo() {
    return this.apiKeyManager.getEnhancedDebugInfo();
  }
}
