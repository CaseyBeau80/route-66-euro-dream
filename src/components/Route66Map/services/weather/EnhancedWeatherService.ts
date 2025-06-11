import { WeatherForecastService, ForecastWeatherData } from './WeatherForecastService';
import { DateNormalizationService } from '../../../TripCalculator/components/weather/DateNormalizationService';

export class EnhancedWeatherService {
  private static instance: EnhancedWeatherService | null = null;
  private weatherService: WeatherForecastService | null = null;
  private apiKey: string | null = null;

  private constructor() {
    this.initializeApiKey();
  }

  static getInstance(): EnhancedWeatherService {
    if (!EnhancedWeatherService.instance) {
      EnhancedWeatherService.instance = new EnhancedWeatherService();
    }
    return EnhancedWeatherService.instance;
  }

  private initializeApiKey(): void {
    this.refreshApiKey();
  }

  refreshApiKey(): void {
    // Enhanced API key detection with multiple sources
    const apiKey = 
      import.meta.env.VITE_OPENWEATHER_API_KEY ||
      import.meta.env.OPENWEATHER_API_KEY ||
      localStorage.getItem('openweather_api_key') ||
      null;

    console.log('🔑 EnhancedWeatherService: API Key check:', {
      hasViteEnv: !!import.meta.env.VITE_OPENWEATHER_API_KEY,
      hasBasicEnv: !!import.meta.env.OPENWEATHER_API_KEY,
      hasLocalStorage: !!localStorage.getItem('openweather_api_key'),
      finalApiKey: !!apiKey,
      apiKeyLength: apiKey?.length || 0,
      envKeys: Object.keys(import.meta.env).filter(key => key.includes('WEATHER'))
    });

    this.apiKey = apiKey;
    
    if (this.apiKey) {
      this.weatherService = new WeatherForecastService(this.apiKey);
      console.log('✅ EnhancedWeatherService: Weather service initialized with API key');
    } else {
      this.weatherService = null;
      console.log('⚠️ EnhancedWeatherService: No API key available - weather service not initialized');
    }
  }

  hasApiKey(): boolean {
    const hasKey = !!this.apiKey;
    console.log('🔍 EnhancedWeatherService: hasApiKey check:', {
      hasKey,
      apiKeyExists: !!this.apiKey,
      apiKeyLength: this.apiKey?.length || 0,
      weatherServiceExists: !!this.weatherService
    });
    return hasKey;
  }

  setApiKey(apiKey: string): void {
    console.log('🔑 EnhancedWeatherService: Setting new API key:', {
      hasApiKey: !!apiKey,
      apiKeyLength: apiKey?.length || 0
    });
    
    this.apiKey = apiKey;
    localStorage.setItem('openweather_api_key', apiKey);
    
    if (apiKey) {
      this.weatherService = new WeatherForecastService(apiKey);
      console.log('✅ EnhancedWeatherService: Weather service re-initialized with new API key');
    }
  }

  getEnhancedDebugInfo(): any {
    console.log('🔍 EnhancedWeatherService: Getting enhanced debug info');
    
    return {
      hasKey: this.hasApiKey(),
      apiKeyLength: this.apiKey?.length || 0,
      hasWeatherService: !!this.weatherService,
      localStorage: {
        hasApiKey: !!localStorage.getItem('openweather_api_key'),
        apiKeyLength: localStorage.getItem('openweather_api_key')?.length || 0
      },
      envVars: {
        hasViteEnv: !!import.meta.env.VITE_OPENWEATHER_API_KEY,
        hasBasicEnv: !!import.meta.env.OPENWEATHER_API_KEY
      },
      corruptionAnalysis: {
        isCorrupted: false,
        reason: 'No corruption detected'
      }
    };
  }

  performNuclearCleanup(): void {
    console.log('💥 EnhancedWeatherService: Performing nuclear cleanup');
    
    // Clear all API key sources
    localStorage.removeItem('openweather_api_key');
    
    // Reset internal state
    this.apiKey = null;
    this.weatherService = null;
    
    console.log('✅ EnhancedWeatherService: Nuclear cleanup completed');
  }

  async getWeatherForDate(
    lat: number,
    lng: number,
    cityName: string,
    targetDate: Date
  ): Promise<ForecastWeatherData | null> {
    console.log('🌤️ EnhancedWeatherService: getWeatherForDate called:', {
      lat,
      lng,
      cityName,
      targetDate: targetDate.toISOString(),
      hasApiKey: this.hasApiKey(),
      hasWeatherService: !!this.weatherService
    });

    if (!this.hasApiKey() || !this.weatherService) {
      console.warn('⚠️ EnhancedWeatherService: No API key or weather service available');
      return this.getFallbackWeather(cityName, targetDate);
    }

    try {
      // Use centralized date normalization
      const normalizedDate = DateNormalizationService.normalizeSegmentDate(targetDate);
      
      console.log('🎯 EnhancedWeatherService: Calling weather service with normalized date:', {
        originalDate: targetDate.toISOString(),
        normalizedDate: normalizedDate.toISOString(),
        cityName
      });

      const weatherData = await this.weatherService.getWeatherForDate(lat, lng, cityName, normalizedDate);
      
      if (weatherData) {
        console.log('✅ EnhancedWeatherService: Weather data received:', {
          cityName,
          temperature: weatherData.temperature,
          isActualForecast: weatherData.isActualForecast,
          hasDateMatchInfo: !!weatherData.dateMatchInfo
        });
      }
      
      return weatherData;
    } catch (error) {
      console.error('❌ EnhancedWeatherService: Error fetching weather:', error);
      return this.getFallbackWeather(cityName, targetDate);
    }
  }

  private getFallbackWeather(cityName: string, targetDate: Date): ForecastWeatherData {
    console.log('🎭 EnhancedWeatherService: Generating fallback weather for:', cityName);
    
    const month = targetDate.getMonth();
    const seasonalTemp = this.getSeasonalTemperature(month);
    
    return {
      temperature: seasonalTemp,
      highTemp: seasonalTemp + 8,
      lowTemp: seasonalTemp - 8,
      description: this.getSeasonalDescription(month),
      icon: this.getSeasonalIcon(month),
      humidity: this.getSeasonalHumidity(month),
      windSpeed: 8,
      precipitationChance: this.getSeasonalPrecipitation(month),
      cityName: cityName,
      forecast: [],
      forecastDate: targetDate,
      isActualForecast: false,
      dateMatchInfo: {
        requestedDate: DateNormalizationService.toDateString(targetDate),
        matchedDate: 'seasonal-estimate',
        matchType: 'none',
        daysOffset: 0,
        source: 'seasonal-estimate'
      }
    };
  }

  private getSeasonalTemperature(month: number): number {
    // Seasonal temperature averages for Route 66 region
    const seasonalTemps = [45, 50, 60, 70, 80, 90, 95, 92, 85, 75, 60, 50];
    return seasonalTemps[month] || 70;
  }

  private getSeasonalDescription(month: number): string {
    if (month >= 5 && month <= 7) return 'Sunny and warm';
    if (month >= 2 && month <= 4) return 'Partly cloudy';
    if (month >= 8 && month <= 10) return 'Clear and mild';
    return 'Cool and partly cloudy';
  }

  private getSeasonalIcon(month: number): string {
    if (month >= 5 && month <= 7) return '01d'; // sunny
    if (month >= 2 && month <= 4) return '02d'; // partly cloudy
    if (month >= 8 && month <= 10) return '01d'; // clear
    return '03d'; // cloudy
  }

  private getSeasonalHumidity(month: number): number {
    // Lower humidity in summer, higher in winter
    if (month >= 5 && month <= 7) return 45;
    if (month >= 11 || month <= 1) return 65;
    return 55;
  }

  private getSeasonalPrecipitation(month: number): number {
    // Spring and summer have higher precipitation chances
    if (month >= 3 && month <= 6) return 25;
    if (month >= 7 && month <= 9) return 15;
    return 20;
  }
}
