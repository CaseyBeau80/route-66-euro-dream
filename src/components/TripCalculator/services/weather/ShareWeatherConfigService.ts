
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
   * FIXED: Get weather configuration for share/export contexts using EXACT same detection as main app
   */
  static getShareWeatherConfig(): ShareWeatherConfig {
    try {
      console.log('🔍 FIXED: ShareWeatherConfigService - Starting EXACT same detection as preview');
      
      // FIXED: Use EXACT same detection logic as preview mode
      const hasApiKey = WeatherApiKeyManager.hasApiKey();
      const apiKey = WeatherApiKeyManager.getApiKey();
      
      console.log('🔍 FIXED: ShareWeatherConfigService - API key detection result:', {
        hasApiKey,
        keyExists: !!apiKey,
        keyLength: apiKey?.length || 0,
        keyPreview: apiKey ? `${apiKey.substring(0, 8)}...` : 'none'
      });
      
      // FIXED: If WeatherApiKeyManager says we have a key, trust it completely
      if (!hasApiKey || !apiKey) {
        console.log('❌ FIXED: ShareWeatherConfigService - No valid API key found');
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
      
      // FIXED: Determine source using same logic as main app
      let apiKeySource: 'config-file' | 'localStorage' | 'legacy-storage' | 'none' = 'localStorage';
      
      // Check if it matches config file
      if (WEATHER_API_KEY && typeof WEATHER_API_KEY === 'string') {
        const configKey = WEATHER_API_KEY as string;
        if (configKey.trim() === apiKey.trim() && 
            configKey !== 'your_api_key_here' && 
            !configKey.toLowerCase().includes('your_api_key')) {
          apiKeySource = 'config-file';
        }
      }
      
      // Check localStorage keys
      const primaryKey = localStorage.getItem('weather_api_key');
      const legacyKey = localStorage.getItem('openweathermap_api_key');
      
      if (primaryKey && primaryKey.trim() === apiKey.trim()) {
        apiKeySource = 'localStorage';
      } else if (legacyKey && legacyKey.trim() === apiKey.trim()) {
        apiKeySource = 'legacy-storage';
      }
      
      const result = {
        hasApiKey: true,
        canFetchLiveWeather: true,
        apiKeySource,
        detectionDetails: {
          validationPassed: true,
          keyLength: apiKey.length,
          isConfiguredKey: apiKeySource === 'config-file',
          configKey: apiKeySource === 'config-file' ? 'WEATHER_API_KEY (configured)' : undefined,
          localStorageKey: apiKeySource === 'localStorage' ? 'weather_api_key' : 
                          apiKeySource === 'legacy-storage' ? 'openweathermap_api_key' : undefined,
          refreshedKey: `${apiKey.substring(0, 8)}...`
        }
      };
      
      console.log('✅ FIXED: ShareWeatherConfigService - Weather config detected for shared view:', {
        hasApiKey: result.hasApiKey,
        canFetchLiveWeather: result.canFetchLiveWeather,
        apiKeySource: result.apiKeySource,
        keyLength: result.detectionDetails?.keyLength,
        shouldWorkInSharedView: true
      });
      
      return result;
    } catch (error) {
      console.error('❌ FIXED: ShareWeatherConfigService - Error during detection:', error);
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
   * FIXED: Check if live weather should be attempted using EXACT same logic as preview
   */
  static shouldAttemptLiveWeather(): boolean {
    const hasKey = WeatherApiKeyManager.hasApiKey();
    console.log('🌤️ FIXED: ShareWeatherConfigService - Live weather decision (same as preview):', {
      shouldAttempt: hasKey,
      usingExactSameLogicAsPreview: true
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
