
import { EnhancedWeatherService } from '@/components/Route66Map/services/weather/EnhancedWeatherService';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';
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
   * Get weather configuration for share/export contexts using the same detection as main app
   */
  static getShareWeatherConfig(): ShareWeatherConfig {
    try {
      console.log('🔍 ShareWeatherConfigService: Starting weather config detection for export/shared view');
      
      // FIXED: Use the same WeatherApiKeyManager that works in the main app
      const hasApiKey = WeatherApiKeyManager.hasApiKey();
      const apiKey = WeatherApiKeyManager.getApiKey();
      const debugInfo = WeatherApiKeyManager.getDebugInfo();
      
      console.log('🔍 ShareWeatherConfigService: Using WeatherApiKeyManager detection:', {
        hasApiKey,
        apiKeyExists: !!apiKey,
        keyLength: debugInfo.keyLength,
        keyPreview: debugInfo.keyPreview,
        isValid: debugInfo.isValid
      });
      
      let apiKeySource: 'config-file' | 'localStorage' | 'legacy-storage' | 'none' = 'none';
      
      if (hasApiKey && apiKey) {
        // Check if it's from config file
        if (WEATHER_API_KEY && typeof WEATHER_API_KEY === 'string') {
          const configKey = WEATHER_API_KEY as string;
          if (configKey.trim() === apiKey.trim() && 
              configKey !== 'your_api_key_here' && 
              !configKey.toLowerCase().includes('your_api_key')) {
            apiKeySource = 'config-file';
          }
        }
        
        // Check localStorage
        if (apiKeySource === 'none') {
          const primaryKey = localStorage.getItem('openweathermap_api_key');
          const legacyKey = localStorage.getItem('openWeatherMapApiKey');
          
          if (primaryKey && primaryKey.trim() === apiKey.trim()) {
            apiKeySource = 'localStorage';
          } else if (legacyKey && legacyKey.trim() === apiKey.trim()) {
            apiKeySource = 'legacy-storage';
          } else {
            // If we have a key but can't determine source, assume localStorage
            apiKeySource = 'localStorage';
          }
        }
      }
      
      const detectionDetails = {
        validationPassed: hasApiKey,
        keyLength: debugInfo.keyLength || 0,
        isConfiguredKey: apiKeySource === 'config-file',
        configKey: apiKeySource === 'config-file' ? 'WEATHER_API_KEY (configured)' : undefined,
        localStorageKey: apiKeySource === 'localStorage' ? 'openweathermap_api_key' : 
                        apiKeySource === 'legacy-storage' ? 'openWeatherMapApiKey' : undefined,
        refreshedKey: debugInfo.keyPreview
      };
      
      console.log('✅ ShareWeatherConfigService: Weather config analysis complete:', {
        hasApiKey,
        canFetchLiveWeather: hasApiKey,
        apiKeySource,
        detectionDetails,
        isExportContext: true
      });
      
      return {
        hasApiKey,
        canFetchLiveWeather: hasApiKey,
        apiKeySource,
        detectionDetails
      };
    } catch (error) {
      console.error('❌ ShareWeatherConfigService: Error during weather config detection:', error);
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
   * Check if live weather should be attempted for export - using same logic as main app
   */
  static shouldAttemptLiveWeather(): boolean {
    // Use the same detection as main app
    const hasKey = WeatherApiKeyManager.hasApiKey();
    console.log('🌤️ ShareWeatherConfigService: Live weather attempt decision:', {
      shouldAttempt: hasKey,
      usingMainAppLogic: true
    });
    return hasKey;
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
      const keyType = config.detectionDetails?.isConfiguredKey ? 'application configuration' : 
                     config.apiKeySource === 'config-file' ? 'configuration file' : 'user settings';
      return `Weather API configured via ${keyType} (${config.detectionDetails?.keyLength || 0} chars)`;
    } else {
      return 'Weather API not configured - live forecasts unavailable in export';
    }
  }
}
