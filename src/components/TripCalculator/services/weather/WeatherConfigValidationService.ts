
import { WEATHER_API_KEY } from '@/config/weatherConfig';
import { ApiKeyRetrievalService } from '@/components/Route66Map/services/weather/ApiKeyRetrievalService';

export interface WeatherConfigValidation {
  isValid: boolean;
  source: 'config-file' | 'localStorage' | 'none';
  details: {
    configFileKey?: boolean;
    localStorageKey?: boolean;
    keyLength?: number;
    isPlaceholder?: boolean;
    isConfiguredKey?: boolean;
  };
  recommendations: string[];
}

export class WeatherConfigValidationService {
  /**
   * Validate weather configuration and provide recommendations
   */
  static validateConfiguration(): WeatherConfigValidation {
    console.log('🔍 WeatherConfigValidationService: Starting enhanced configuration validation');
    
    const details: any = {};
    const recommendations: string[] = [];
    let isValid = false;
    let source: 'config-file' | 'localStorage' | 'none' = 'none';
    
    // FIXED: Use ApiKeyRetrievalService for consistent validation
    const refreshedKey = ApiKeyRetrievalService.refreshApiKey();
    const keySource = ApiKeyRetrievalService.getKeySource(refreshedKey);
    
    if (refreshedKey) {
      isValid = true;
      source = keySource === 'config-file' ? 'config-file' : 'localStorage';
      details.keyLength = refreshedKey.length;
      
      // Check if it's from config file
      if (keySource === 'config-file') {
        details.configFileKey = true;
        details.isConfiguredKey = true;
        details.isPlaceholder = false;
        console.log('✅ WeatherConfigValidationService: Valid config file key detected', {
          keyLength: refreshedKey.length,
          keyPreview: refreshedKey.substring(0, 8) + '...'
        });
      } else {
        details.localStorageKey = true;
        details.isConfiguredKey = false;
        console.log('✅ WeatherConfigValidationService: Valid localStorage key detected');
      }
    } else {
      // Check if config has placeholder
      const configKey = WEATHER_API_KEY;
      const configKeyString = typeof configKey === 'string' ? configKey : '';
      
      details.configFileKey = false;
      details.localStorageKey = false;
      details.isPlaceholder = this.isPlaceholderKey(configKeyString);
      details.isConfiguredKey = false;
    }
    
    // Generate enhanced recommendations
    if (!isValid) {
      if (details.isPlaceholder) {
        recommendations.push('Replace the placeholder API key in src/config/weatherConfig.ts with a real OpenWeatherMap API key');
        recommendations.push('This will enable weather forecasts for all users including export views');
      } else if (!details.configFileKey) {
        recommendations.push('Add your API key to src/config/weatherConfig.ts for permanent configuration');
      }
      
      if (!details.localStorageKey) {
        recommendations.push('Alternatively, set up an API key through the weather widget in the main application');
      }
      
      recommendations.push('Get a free API key from https://openweathermap.org/api');
    }
    
    console.log('✅ WeatherConfigValidationService: Enhanced validation complete:', {
      isValid,
      source,
      details,
      recommendationsCount: recommendations.length,
      hasConfiguredKey: details.isConfiguredKey
    });
    
    return {
      isValid,
      source,
      details,
      recommendations
    };
  }
  
  private static isPlaceholderKey(key: string): boolean {
    if (!key || typeof key !== 'string') return true;
    
    const trimmedKey = key.trim().toLowerCase();
    const placeholders = [
      'your_api_key_here',
      'your_api_key',
      'placeholder',
      'example',
      'test'
    ];
    
    return placeholders.some(placeholder => trimmedKey.includes(placeholder));
  }
  
  /**
   * Get a user-friendly configuration status summary
   */
  static getConfigurationSummary(): string {
    const validation = this.validateConfiguration();
    
    if (validation.isValid) {
      const keyType = validation.details.isConfiguredKey ? 'application configured' : 
                     validation.source === 'config-file' ? 'configuration file' : 'user settings';
      return `Weather API configured via ${keyType}`;
    } else {
      return 'Weather API not configured - live forecasts unavailable';
    }
  }
  
  /**
   * Check if the current configuration supports export views
   */
  static supportsExportViews(): boolean {
    const validation = this.validateConfiguration();
    // Export views work best with configured keys or localStorage
    return validation.isValid && (validation.source === 'config-file' || validation.source === 'localStorage');
  }
}
