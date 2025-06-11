
import { EnhancedWeatherService } from '@/components/Route66Map/services/weather/EnhancedWeatherService';
import { ApiKeyRetrievalService } from '@/components/Route66Map/services/weather/ApiKeyRetrievalService';
import { WEATHER_API_KEY } from '@/config/weatherConfig';

export interface ShareWeatherConfig {
  hasApiKey: boolean;
  canFetchLiveWeather: boolean;
  apiKeySource: 'config-file' | 'localStorage' | 'legacy-storage' | 'none';
  detectionDetails?: {
    configKey?: string;
    localStorageKey?: string;
    refreshedKey?: string;
    keyLength?: number;
    validationPassed: boolean;
    isConfiguredKey?: boolean;
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
      
      // Force refresh to ensure we get the latest configuration
      weatherService.refreshApiKey();
      
      // Get detailed API key information
      const refreshedKey = ApiKeyRetrievalService.refreshApiKey();
      const hasApiKey = weatherService.hasApiKey();
      const keySource = weatherService.getApiKeySource();
      
      const detectionDetails: any = {
        validationPassed: hasApiKey,
        keyLength: refreshedKey?.length || 0,
        isConfiguredKey: false
      };
      
      if (refreshedKey) {
        // Check if this is the configured key
        if (WEATHER_API_KEY && typeof WEATHER_API_KEY === 'string') {
          const configKey = WEATHER_API_KEY as string;
          if (configKey.trim() === refreshedKey) {
            detectionDetails.isConfiguredKey = true;
            detectionDetails.configKey = 'WEATHER_API_KEY (configured)';
          }
        }
        
        // Check localStorage keys
        const primaryKey = localStorage.getItem('openweathermap_api_key');
        const legacyKey = localStorage.getItem('openWeatherMapApiKey');
        
        if (primaryKey && primaryKey === refreshedKey) {
          detectionDetails.localStorageKey = 'openweathermap_api_key';
        } else if (legacyKey && legacyKey === refreshedKey) {
          detectionDetails.localStorageKey = 'openWeatherMapApiKey';
        }
        
        detectionDetails.refreshedKey = refreshedKey.substring(0, 8) + '...' + refreshedKey.substring(refreshedKey.length - 4);
      }
      
      console.log('✅ ShareWeatherConfigService: Enhanced weather config analysis:', {
        hasApiKey,
        canFetchLiveWeather: hasApiKey,
        apiKeySource: keySource,
        detectionDetails,
        weatherServiceExists: !!weatherService,
        refreshedKeyLength: refreshedKey?.length || 0,
        isExportContext: true
      });
      
      return {
        hasApiKey,
        canFetchLiveWeather: hasApiKey,
        apiKeySource: keySource,
        detectionDetails
      };
    } catch (error) {
      console.error('❌ ShareWeatherConfigService: Error during enhanced weather config detection:', error);
      return {
        hasApiKey: false,
        canFetchLiveWeather: false,
        apiKeySource: 'none',
        detectionDetails: {
          validationPassed: false,
          keyLength: 0,
          isConfiguredKey: false
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
      apiKeySource: config.apiKeySource,
      isConfiguredKey: config.detectionDetails?.isConfiguredKey || false
    });
    return config.canFetchLiveWeather;
  }
  
  /**
   * Get user-friendly status message for weather configuration
   */
  static getWeatherStatusMessage(config: ShareWeatherConfig): string {
    if (config.hasApiKey) {
      const isConfigured = config.detectionDetails?.isConfiguredKey || false;
      
      switch (config.apiKeySource) {
        case 'config-file':
          return isConfigured 
            ? 'Live weather forecasts enabled (Application configured API key)'
            : 'Live weather forecasts enabled (Configuration file API key)';
        case 'localStorage':
          return 'Live weather forecasts enabled (User configured API key)';
        case 'legacy-storage':
          return 'Live weather forecasts enabled (User configured API key - migrated)';
        default:
          return 'Live weather forecasts enabled';
      }
    } else {
      return 'Weather API configuration not available in export view';
    }
  }
  
  /**
   * Get configuration summary for debugging
   */
  static getConfigurationSummary(): string {
    const config = this.getShareWeatherConfig();
    
    if (config.hasApiKey) {
      const keySource = config.apiKeySource === 'config-file' ? 'application configuration' : 'user settings';
      return `Weather API configured via ${keySource} (${config.detectionDetails?.keyLength || 0} chars)`;
    } else {
      return 'Weather API not configured - live forecasts unavailable in export';
    }
  }
}
