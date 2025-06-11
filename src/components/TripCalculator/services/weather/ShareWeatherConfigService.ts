
import { EnhancedWeatherService } from '@/components/Route66Map/services/weather/EnhancedWeatherService';
import { ApiKeyRetrievalService } from '@/components/Route66Map/services/weather/ApiKeyRetrievalService';

export interface ShareWeatherConfig {
  hasApiKey: boolean;
  canFetchLiveWeather: boolean;
  apiKeySource: 'main-app' | 'config-file' | 'localStorage' | 'none';
  detectionDetails?: {
    configKey?: string;
    localStorageKey?: string;
    refreshedKey?: string;
    validationPassed: boolean;
  };
}

export class ShareWeatherConfigService {
  /**
   * Get weather configuration for share/export contexts with enhanced detection
   */
  static getShareWeatherConfig(): ShareWeatherConfig {
    try {
      console.log('🔍 ShareWeatherConfigService: Starting enhanced weather config detection for export');
      
      const weatherService = EnhancedWeatherService.getInstance();
      
      // Get detailed API key information
      const refreshedKey = ApiKeyRetrievalService.refreshApiKey();
      const hasApiKey = weatherService.hasApiKey();
      
      // Determine the source of the API key
      let apiKeySource: 'main-app' | 'config-file' | 'localStorage' | 'none' = 'none';
      const detectionDetails: any = {
        validationPassed: hasApiKey
      };
      
      if (refreshedKey) {
        // Check localStorage first
        const primaryKey = localStorage.getItem('openweathermap_api_key');
        const legacyKey = localStorage.getItem('openWeatherMapApiKey');
        
        if (primaryKey && primaryKey === refreshedKey) {
          apiKeySource = 'localStorage';
          detectionDetails.localStorageKey = 'openweathermap_api_key';
        } else if (legacyKey && legacyKey === refreshedKey) {
          apiKeySource = 'localStorage';
          detectionDetails.localStorageKey = 'openWeatherMapApiKey';
        } else {
          apiKeySource = 'config-file';
          detectionDetails.configKey = 'WEATHER_API_KEY';
        }
        detectionDetails.refreshedKey = refreshedKey.substring(0, 8) + '...' + refreshedKey.substring(refreshedKey.length - 4);
      }
      
      console.log('✅ ShareWeatherConfigService: Enhanced weather config analysis:', {
        hasApiKey,
        canFetchLiveWeather: hasApiKey,
        apiKeySource,
        detectionDetails,
        weatherServiceExists: !!weatherService,
        refreshedKeyLength: refreshedKey?.length || 0
      });
      
      return {
        hasApiKey,
        canFetchLiveWeather: hasApiKey,
        apiKeySource,
        detectionDetails
      };
    } catch (error) {
      console.error('❌ ShareWeatherConfigService: Error during enhanced weather config detection:', error);
      return {
        hasApiKey: false,
        canFetchLiveWeather: false,
        apiKeySource: 'none',
        detectionDetails: {
          validationPassed: false
        }
      };
    }
  }
  
  /**
   * Check if live weather should be attempted for export
   */
  static shouldAttemptLiveWeather(): boolean {
    const config = this.getShareWeatherConfig();
    console.log('🌤️ ShareWeatherConfigService: Live weather attempt decision:', {
      shouldAttempt: config.canFetchLiveWeather,
      hasApiKey: config.hasApiKey,
      apiKeySource: config.apiKeySource
    });
    return config.canFetchLiveWeather;
  }
  
  /**
   * Get user-friendly status message for weather configuration
   */
  static getWeatherStatusMessage(config: ShareWeatherConfig): string {
    if (config.hasApiKey) {
      switch (config.apiKeySource) {
        case 'localStorage':
          return 'Live weather forecasts enabled (User configured API key)';
        case 'config-file':
          return 'Live weather forecasts enabled (Application configured API key)';
        case 'main-app':
          return 'Live weather forecasts enabled (System API key)';
        default:
          return 'Live weather forecasts enabled';
      }
    } else {
      return 'Weather API configuration not available in export view';
    }
  }
}
