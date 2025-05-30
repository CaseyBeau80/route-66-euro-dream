
import { WeatherData, WeatherWithForecast } from './weather/WeatherServiceTypes';
import { WeatherApiClient } from './weather/WeatherApiClient';
import { WeatherDataProcessor } from './weather/WeatherDataProcessor';
import { WeatherApiKeyManager } from './weather/WeatherApiKeyManager';

export class WeatherService {
  private static instance: WeatherService;
  private apiKeyManager: WeatherApiKeyManager;

  private constructor() {
    this.apiKeyManager = new WeatherApiKeyManager();
  }

  static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  setApiKey(apiKey: string): void {
    this.apiKeyManager.setApiKey(apiKey);
  }

  hasApiKey(): boolean {
    return this.apiKeyManager.hasApiKey();
  }

  async getWeatherData(lat: number, lng: number, cityName: string): Promise<WeatherData | null> {
    console.log(`🌤️ WeatherService: Fetching weather for ${cityName} (${lat}, ${lng})`);
    
    // Refresh API key from localStorage before making request
    this.apiKeyManager.refreshApiKey();
    
    if (!this.apiKeyManager.validateApiKey()) {
      console.warn('❌ WeatherService: Invalid or missing API key');
      return null;
    }

    const apiKey = this.apiKeyManager.getApiKey();
    if (!apiKey) {
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
      return null;
    }
  }

  async getWeatherWithForecast(lat: number, lng: number, cityName: string): Promise<WeatherWithForecast | null> {
    console.log(`🌤️ WeatherService: Fetching weather with forecast for ${cityName} (${lat}, ${lng})`);
    
    // Refresh API key from localStorage before making request
    this.apiKeyManager.refreshApiKey();
    
    if (!this.apiKeyManager.validateApiKey()) {
      console.warn('❌ WeatherService: Invalid or missing API key');
      return null;
    }

    const apiKey = this.apiKeyManager.getApiKey();
    if (!apiKey) {
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
      return null;
    }
  }
}
