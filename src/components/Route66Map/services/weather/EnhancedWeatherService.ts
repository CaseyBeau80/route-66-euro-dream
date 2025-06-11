
import { WeatherForecastService, ForecastWeatherData } from './WeatherForecastService';
import { EnhancedWeatherApiKeyManager } from './EnhancedWeatherApiKeyManager';

export class EnhancedWeatherService {
  private static instance: EnhancedWeatherService;
  private apiKeyManager: EnhancedWeatherApiKeyManager;
  private forecastService: WeatherForecastService | null = null;

  private constructor() {
    this.apiKeyManager = new EnhancedWeatherApiKeyManager();
    console.log('🌤️ EnhancedWeatherService: Initialized with enhanced API key detection');
  }

  static getInstance(): EnhancedWeatherService {
    if (!EnhancedWeatherService.instance) {
      EnhancedWeatherService.instance = new EnhancedWeatherService();
    }
    return EnhancedWeatherService.instance;
  }

  hasApiKey(): boolean {
    // Always refresh from all sources to get latest key
    this.apiKeyManager.refreshApiKey();
    const hasKey = this.apiKeyManager.hasApiKey();
    
    console.log('🔍 EnhancedWeatherService: API key check result:', {
      hasKey,
      keySource: this.getApiKeySource(),
      timestamp: new Date().toISOString()
    });
    
    return hasKey;
  }

  getApiKey(): string | null {
    this.apiKeyManager.refreshApiKey();
    const key = this.apiKeyManager.getApiKey();
    
    if (key) {
      console.log('✅ EnhancedWeatherService: API key retrieved successfully', {
        keyLength: key.length,
        keySource: this.getApiKeySource(),
        keyPreview: key.substring(0, 8) + '...' + key.substring(key.length - 4)
      });
    } else {
      console.log('❌ EnhancedWeatherService: No API key available');
    }
    
    return key;
  }

  getApiKeySource(): 'config-file' | 'localStorage' | 'legacy-storage' | 'none' {
    const key = this.apiKeyManager.getApiKey();
    if (!key) return 'none';
    
    // Import here to avoid circular dependencies
    const { ApiKeyRetrievalService } = require('./ApiKeyRetrievalService');
    return ApiKeyRetrievalService.getKeySource(key);
  }

  setApiKey(apiKey: string): void {
    console.log('🔑 EnhancedWeatherService: Setting new API key');
    this.apiKeyManager.setApiKey(apiKey);
    // Reset forecast service to use new API key
    this.forecastService = null;
  }

  refreshApiKey(): void {
    console.log('🔄 EnhancedWeatherService: Refreshing API key from all sources');
    this.apiKeyManager.refreshApiKey();
    // Reset forecast service when refreshing API key to ensure it uses the latest key
    this.forecastService = null;
  }

  private getForecastService(): WeatherForecastService | null {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      console.warn('❌ EnhancedWeatherService: Cannot initialize forecast service - no API key');
      return null;
    }
    
    if (!this.forecastService) {
      console.log('🔧 EnhancedWeatherService: Initializing forecast service with API key');
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
      console.log(`🔮 EnhancedWeatherService: Requesting forecast for ${cityName} on ${targetDate.toDateString()}`, {
        keySource: this.getApiKeySource(),
        hasValidKey: !!this.getApiKey()
      });
      return await forecastService.getWeatherForDate(lat, lng, cityName, targetDate);
    } catch (error) {
      console.error('❌ EnhancedWeatherService: Forecast error:', error);
      return null;
    }
  }

  getEnhancedDebugInfo() {
    const debugInfo = this.apiKeyManager.getEnhancedDebugInfo();
    return {
      ...debugInfo,
      keySource: this.getApiKeySource(),
      serviceInitialized: !!this.forecastService
    };
  }

  performNuclearCleanup(): void {
    console.log('💥 EnhancedWeatherService: Performing nuclear cleanup');
    this.apiKeyManager.performNuclearCleanup();
    // Reset forecast service when cleaning up
    this.forecastService = null;
  }

  getDebugInfo() {
    return this.getEnhancedDebugInfo();
  }
}
