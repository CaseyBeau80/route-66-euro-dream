
import { WeatherData, WeatherWithForecast } from './WeatherServiceTypes';
import { WeatherApiClient } from './WeatherApiClient';
import { WeatherDataProcessor } from './WeatherDataProcessor';
import { WeatherApiKeyManager } from './WeatherApiKeyManager';
import { WeatherForecastService, ForecastWeatherData } from './WeatherForecastService';

export class EnhancedWeatherService {
  private static instance: EnhancedWeatherService;

  private constructor() {
    console.log('🌤️ EnhancedWeatherService: Service initialized');
  }

  static getInstance(): EnhancedWeatherService {
    if (!EnhancedWeatherService.instance) {
      EnhancedWeatherService.instance = new EnhancedWeatherService();
    }
    return EnhancedWeatherService.instance;
  }

  setApiKey(apiKey: string): void {
    console.log('🔑 EnhancedWeatherService: Setting new API key through enhanced service');
    try {
      WeatherApiKeyManager.setApiKey(apiKey);
    } catch (error) {
      console.error('❌ EnhancedWeatherService: Failed to set API key:', error);
      throw error;
    }
  }

  hasApiKey(): boolean {
    const hasKey = WeatherApiKeyManager.hasApiKey();
    console.log(`🔑 EnhancedWeatherService: hasApiKey() = ${hasKey}`);
    return hasKey;
  }

  getDebugInfo(): { hasKey: boolean; keyLength: number | null; keyPreview: string | null } {
    const debugInfo = WeatherApiKeyManager.getDebugInfo();
    console.log('🔍 EnhancedWeatherService: Debug info requested:', debugInfo);
    return debugInfo;
  }

  async getWeatherData(lat: number, lng: number, cityName: string): Promise<WeatherData | null> {
    console.log(`🌤️ EnhancedWeatherService: Fetching weather for ${cityName} (${lat}, ${lng})`);
    
    if (!WeatherApiKeyManager.validateApiKey()) {
      console.warn('❌ EnhancedWeatherService: Invalid or missing API key');
      const debugInfo = this.getDebugInfo();
      console.warn('❌ EnhancedWeatherService: Debug info:', debugInfo);
      return null;
    }

    const apiKey = WeatherApiKeyManager.getApiKey();
    if (!apiKey) {
      console.error('❌ EnhancedWeatherService: API key is null after validation');
      return null;
    }

    try {
      const apiClient = new WeatherApiClient(apiKey);
      const currentData = await apiClient.getCurrentWeather(lat, lng);
      
      console.log('✅ EnhancedWeatherService: Successfully received weather data');
      
      const weatherData = WeatherDataProcessor.processCurrentWeather(currentData, cityName);
      console.log('🌤️ EnhancedWeatherService: Processed weather data:', weatherData);
      return weatherData;
    } catch (error) {
      console.error('❌ EnhancedWeatherService: Error fetching weather data:', error);
      return null;
    }
  }

  async getWeatherForDate(lat: number, lng: number, cityName: string, targetDate: Date): Promise<ForecastWeatherData | null> {
    console.log(`🌤️ EnhancedWeatherService: Fetching weather for ${cityName} on ${targetDate.toDateString()}`);
    
    if (!WeatherApiKeyManager.validateApiKey()) {
      console.warn('❌ EnhancedWeatherService: Invalid or missing API key');
      const debugInfo = this.getDebugInfo();
      console.warn('❌ EnhancedWeatherService: Debug info:', debugInfo);
      return null;
    }

    const apiKey = WeatherApiKeyManager.getApiKey();
    if (!apiKey) {
      console.error('❌ EnhancedWeatherService: API key is null after validation');
      return null;
    }

    try {
      const forecastService = new WeatherForecastService(apiKey);
      const forecastData = await forecastService.getWeatherForDate(lat, lng, cityName, targetDate);
      
      console.log('✅ EnhancedWeatherService: Successfully received forecast data');
      return forecastData;
    } catch (error) {
      console.error('❌ EnhancedWeatherService: Error fetching forecast data:', error);
      return null;
    }
  }

  async getWeatherWithForecast(lat: number, lng: number, cityName: string): Promise<WeatherWithForecast | null> {
    console.log(`🌤️ EnhancedWeatherService: Fetching weather with forecast for ${cityName} (${lat}, ${lng})`);
    
    if (!WeatherApiKeyManager.validateApiKey()) {
      console.warn('❌ EnhancedWeatherService: Invalid or missing API key');
      const debugInfo = this.getDebugInfo();
      console.warn('❌ EnhancedWeatherService: Debug info:', debugInfo);
      return null;
    }

    const apiKey = WeatherApiKeyManager.getApiKey();
    if (!apiKey) {
      console.error('❌ EnhancedWeatherService: API key is null after validation');
      return null;
    }

    try {
      const apiClient = new WeatherApiClient(apiKey);
      const [currentData, forecastData] = await apiClient.getWeatherAndForecast(lat, lng);

      console.log('✅ EnhancedWeatherService: Successfully received weather and forecast data');

      const weatherWithForecast = WeatherDataProcessor.processWeatherWithForecast(
        currentData, 
        forecastData, 
        cityName
      );
      
      console.log('🌤️ EnhancedWeatherService: Processed weather with forecast:', weatherWithForecast);
      return weatherWithForecast;
    } catch (error) {
      console.error('❌ EnhancedWeatherService: Error fetching weather with forecast:', error);
      return null;
    }
  }
}
