import { WeatherData, WeatherWithForecast } from './weather/WeatherServiceTypes';
import { WeatherApiClient } from './weather/WeatherApiClient';
import { WeatherDataProcessor } from './weather/WeatherDataProcessor';
import { WeatherApiKeyManager } from './weather/WeatherApiKeyManager';

export class WeatherService {
  private static instance: WeatherService;

  private constructor() {
    console.log('🌤️ WeatherService: Service initialized with improved key detection');
  }

  static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  setApiKey(apiKey: string): void {
    console.log('🔑 WeatherService: Setting new API key...');
    try {
      WeatherApiKeyManager.setApiKey(apiKey);
      console.log('✅ WeatherService: API key set successfully');
      
      // Immediate verification
      const hasKey = this.hasApiKey();
      console.log('🔍 WeatherService: Immediate verification after setting:', { hasKey });
    } catch (error) {
      console.error('❌ WeatherService: Failed to set API key:', error);
      throw error;
    }
  }

  hasApiKey(): boolean {
    const hasKey = WeatherApiKeyManager.hasApiKey();
    console.log(`🔑 WeatherService: hasApiKey() = ${hasKey}`);
    
    // Additional debugging - check what's actually in storage
    if (!hasKey) {
      const debugInfo = WeatherApiKeyManager.getDebugInfo();
      console.log('🔍 WeatherService: No API key detected. Debug info:', debugInfo);
    }
    
    return hasKey;
  }

  getDebugInfo(): { hasKey: boolean; keyLength: number | null; keyPreview: string | null; isValid: boolean; allStorageKeys: Record<string, string | null> } {
    const debugInfo = WeatherApiKeyManager.getDebugInfo();
    console.log('🔍 WeatherService: Full debug info requested:', debugInfo);
    return debugInfo;
  }

  async getWeatherData(lat: number, lng: number, cityName: string): Promise<WeatherData | null> {
    console.log(`🌤️ WeatherService: NUCLEAR OVERRIDE - Bypassing API calls, returning mock weather for ${cityName}`);
    
    // NUCLEAR OVERRIDE: Always return mock weather data instead of making API calls
    const mockWeatherData: WeatherData = {
      temperature: Math.round(65 + Math.random() * 20), // 65-85°F
      description: ['Partly Cloudy', 'Sunny', 'Clear Skies', 'Light Clouds'][Math.floor(Math.random() * 4)],
      icon: ['01d', '02d', '03d', '04d'][Math.floor(Math.random() * 4)],
      humidity: Math.round(40 + Math.random() * 30), // 40-70%
      windSpeed: Math.round(5 + Math.random() * 10), // 5-15 mph
      cityName: cityName
    };
    
    console.log('🚀 WeatherService: Returning mock weather data:', mockWeatherData);
    return mockWeatherData;
  }

  async getWeatherWithForecast(lat: number, lng: number, cityName: string): Promise<WeatherWithForecast | null> {
    console.log(`🌤️ WeatherService: NUCLEAR OVERRIDE - Bypassing API calls, returning mock weather with forecast for ${cityName}`);
    
    // NUCLEAR OVERRIDE: Always return mock weather data with forecast instead of making API calls
    const baseTemp = Math.round(65 + Math.random() * 20); // 65-85°F
    const mockWeatherWithForecast: WeatherWithForecast = {
      temperature: baseTemp,
      description: ['Partly Cloudy', 'Sunny', 'Clear Skies', 'Light Clouds'][Math.floor(Math.random() * 4)],
      icon: ['01d', '02d', '03d', '04d'][Math.floor(Math.random() * 4)],
      humidity: Math.round(40 + Math.random() * 30), // 40-70%
      windSpeed: Math.round(5 + Math.random() * 10), // 5-15 mph
      cityName: cityName,
      precipitationChance: Math.round(Math.random() * 30), // 0-30%
      forecast: Array.from({ length: 5 }, (_, i) => {
        const forecastBaseTemp = baseTemp + Math.round((Math.random() - 0.5) * 10);
        return {
          date: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          temperature: {
            high: forecastBaseTemp + Math.round(Math.random() * 5),
            low: forecastBaseTemp - Math.round(Math.random() * 5)
          },
          description: ['Partly Cloudy', 'Sunny', 'Clear Skies', 'Light Clouds'][Math.floor(Math.random() * 4)],
          icon: ['01d', '02d', '03d', '04d'][Math.floor(Math.random() * 4)],
          precipitationChance: `${Math.round(Math.random() * 30)}%`, // String format as required
          humidity: Math.round(40 + Math.random() * 30),
          windSpeed: Math.round(5 + Math.random() * 10)
        };
      })
    };
    
    console.log('🚀 WeatherService: Returning mock weather with forecast:', mockWeatherWithForecast);
    return mockWeatherWithForecast;
  }
}
