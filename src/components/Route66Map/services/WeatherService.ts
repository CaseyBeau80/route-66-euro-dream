import { WeatherData, WeatherWithForecast } from './weather/WeatherServiceTypes';
import { WeatherApiClient } from './weather/WeatherApiClient';
import { WeatherDataProcessor } from './weather/WeatherDataProcessor';
import { WeatherApiKeyManager } from './weather/WeatherApiKeyManager';

export class WeatherService {
  private static instance: WeatherService;
  private apiKeyManager: WeatherApiKeyManager;

  private constructor() {
    this.apiKeyManager = new WeatherApiKeyManager();
    console.log('🌤️ WeatherService: Service initialized');
  }

  static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  setApiKey(apiKey: string): void {
    console.log('🔑 WeatherService: Setting new API key through service');
    this.apiKeyManager.setApiKey(apiKey);
  }

  hasApiKey(): boolean {
    const hasKey = this.apiKeyManager.hasApiKey();
    console.log(`🔑 WeatherService: hasApiKey() = ${hasKey}`);
    return hasKey;
  }

  getDebugInfo(): { hasKey: boolean; keyLength: number | null; keyPreview: string | null } {
    const debugInfo = this.apiKeyManager.getDebugInfo();
    console.log('🔍 WeatherService: Debug info requested:', debugInfo);
    return debugInfo;
  }

  async getWeatherData(lat: number, lng: number, cityName: string): Promise<WeatherData | null> {
    console.log(`🌤️ WeatherService: Fetching weather for ${cityName} (${lat}, ${lng})`);
    
    // Refresh API key from localStorage before making request
    this.apiKeyManager.refreshApiKey();
    
    if (!this.apiKeyManager.validateApiKey()) {
      console.warn('❌ WeatherService: Invalid or missing API key');
      const debugInfo = this.getDebugInfo();
      console.warn('❌ WeatherService: Debug info:', debugInfo);
      return null;
    }

    const apiKey = this.apiKeyManager.getApiKey();
    if (!apiKey) {
      console.error('❌ WeatherService: API key is null after validation');
      return null;
    }

    try {
      const apiClient = new WeatherApiClient(apiKey);
      const currentData = await apiClient.getCurrentWeather(lat, lng);
      
      console.log('✅ WeatherService: Successfully received weather data');
      
      const weatherData = WeatherDataProcessor.processCurrentWeather(currentData, cityName);
      console.log('🌤️ WeatherService: Processed weather data:', weatherData);
      return weatherData;
    } catch (error) {
      console.error('❌ WeatherService: Error fetching weather data:', error);
      if (error instanceof Error) {
        console.error('❌ WeatherService: Error message:', error.message);
        if (error.message.includes('Invalid API key')) {
          console.error('❌ WeatherService: API key is invalid - user needs to check their key');
        }
      }
      return null;
    }
  }

  async getWeatherWithForecast(lat: number, lng: number, cityName: string): Promise<WeatherWithForecast | null> {
    console.log(`🌤️ WeatherService: Fetching weather with forecast for ${cityName} (${lat}, ${lng})`);
    
    // Refresh API key from localStorage before making request
    this.apiKeyManager.refreshApiKey();
    
    if (!this.apiKeyManager.validateApiKey()) {
      console.warn('❌ WeatherService: Invalid or missing API key');
      const debugInfo = this.getDebugInfo();
      console.warn('❌ WeatherService: Debug info:', debugInfo);
      return null;
    }

    const apiKey = this.apiKeyManager.getApiKey();
    if (!apiKey) {
      console.error('❌ WeatherService: API key is null after validation');
      return null;
    }

    try {
      const apiClient = new WeatherApiClient(apiKey);
      const [currentData, forecastData] = await apiClient.getWeatherAndForecast(lat, lng);

      console.log('✅ WeatherService: Successfully received weather and forecast data');

      const weatherWithForecast = WeatherDataProcessor.processWeatherWithForecast(
        currentData, 
        forecastData, 
        cityName
      );
      
      console.log('🌤️ WeatherService: Processed weather with forecast:', weatherWithForecast);
      return weatherWithForecast;
    } catch (error) {
      console.error('❌ WeatherService: Error fetching weather with forecast:', error);
      if (error instanceof Error) {
        console.error('❌ WeatherService: Error message:', error.message);
        if (error.message.includes('Invalid API key')) {
          console.error('❌ WeatherService: API key is invalid - user needs to check their key');
        }
      }
      return null;
    }
  }
}
