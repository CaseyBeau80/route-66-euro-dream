
import { WeatherData, WeatherWithForecast } from './WeatherServiceTypes';
import { WeatherApiClient } from './WeatherApiClient';
import { WeatherDataProcessor } from './WeatherDataProcessor';
import { EnhancedWeatherApiKeyManager } from './EnhancedWeatherApiKeyManager';

export class EnhancedWeatherService {
  private static instance: EnhancedWeatherService;
  private apiKeyManager: EnhancedWeatherApiKeyManager;

  private constructor() {
    this.apiKeyManager = new EnhancedWeatherApiKeyManager();
    console.log('🌤️ EnhancedWeatherService: Service initialized with enhanced key management');
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
      this.apiKeyManager.setApiKey(apiKey);
    } catch (error) {
      console.error('❌ EnhancedWeatherService: Failed to set API key:', error);
      throw error;
    }
  }

  hasApiKey(): boolean {
    const hasKey = this.apiKeyManager.hasApiKey();
    console.log(`🔑 EnhancedWeatherService: hasApiKey() = ${hasKey}`);
    return hasKey;
  }

  performNuclearCleanup(): void {
    console.log('💥 EnhancedWeatherService: Performing nuclear cleanup');
    this.apiKeyManager.performNuclearCleanup();
  }

  getEnhancedDebugInfo(): any {
    const debugInfo = this.apiKeyManager.getEnhancedDebugInfo();
    console.log('🔍 EnhancedWeatherService: Enhanced debug info requested:', debugInfo);
    return debugInfo;
  }

  // Legacy compatibility method
  getDebugInfo(): { hasKey: boolean; keyLength: number | null; keyPreview: string | null } {
    const enhanced = this.getEnhancedDebugInfo();
    return {
      hasKey: enhanced.hasKey,
      keyLength: enhanced.keyLength,
      keyPreview: enhanced.keyPreview
    };
  }

  async getWeatherData(lat: number, lng: number, cityName: string): Promise<WeatherData | null> {
    console.log(`🌤️ EnhancedWeatherService: Fetching weather for ${cityName} (${lat}, ${lng})`);
    
    // Enhanced validation with automatic corruption cleanup
    if (!this.apiKeyManager.validateApiKey()) {
      console.warn('❌ EnhancedWeatherService: Invalid or corrupted API key detected');
      const debugInfo = this.getEnhancedDebugInfo();
      console.warn('❌ EnhancedWeatherService: Enhanced debug info:', debugInfo);
      return null;
    }

    const apiKey = this.apiKeyManager.getApiKey();
    if (!apiKey) {
      console.error('❌ EnhancedWeatherService: API key is null after enhanced validation');
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
      if (error instanceof Error) {
        console.error('❌ EnhancedWeatherService: Error message:', error.message);
        if (error.message.includes('Invalid API key')) {
          console.error('❌ EnhancedWeatherService: API key is invalid - performing nuclear cleanup');
          this.performNuclearCleanup();
        }
      }
      return null;
    }
  }

  async getWeatherWithForecast(lat: number, lng: number, cityName: string): Promise<WeatherWithForecast | null> {
    console.log(`🌤️ EnhancedWeatherService: Fetching weather with forecast for ${cityName} (${lat}, ${lng})`);
    
    // Enhanced validation with automatic corruption cleanup
    if (!this.apiKeyManager.validateApiKey()) {
      console.warn('❌ EnhancedWeatherService: Invalid or corrupted API key detected');
      const debugInfo = this.getEnhancedDebugInfo();
      console.warn('❌ EnhancedWeatherService: Enhanced debug info:', debugInfo);
      return null;
    }

    const apiKey = this.apiKeyManager.getApiKey();
    if (!apiKey) {
      console.error('❌ EnhancedWeatherService: API key is null after enhanced validation');
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
      if (error instanceof Error) {
        console.error('❌ EnhancedWeatherService: Error message:', error.message);
        if (error.message.includes('Invalid API key')) {
          console.error('❌ EnhancedWeatherService: API key is invalid - performing nuclear cleanup');
          this.performNuclearCleanup();
        }
      }
      return null;
    }
  }
}
