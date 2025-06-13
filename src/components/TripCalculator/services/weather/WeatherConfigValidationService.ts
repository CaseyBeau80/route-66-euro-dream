
import { WEATHER_API_KEY } from '@/config/weatherConfig';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';

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
   * Validate weather configuration using the same logic as main app
   */
  static validateConfiguration(): WeatherConfigValidation {
    console.log('🔍 WeatherConfigValidationService: Starting configuration validation');
    
    const details: any = {};
    const recommendations: string[] = [];
    let isValid = false;
    let source: 'config-file' | 'localStorage' | 'none' = 'none';
    
    // FIXED: Use the same WeatherApiKeyManager that works in the main app
    const hasApiKey = WeatherApiKeyManager.hasApiKey();
    const apiKey = WeatherApiKeyManager.getApiKey();
    const debugInfo = WeatherApiKeyManager.getDebugInfo();
    
    console.log('🔍 WeatherConfigValidationService: Using WeatherApiKeyManager:', {
      hasApiKey,
      debugInfo
    });
    
    if (hasApiKey && apiKey) {
      isValid = true;
      details.keyLength = debugInfo.keyLength;
      
      // Check if it's from config file
      if (WEATHER_API_KEY && typeof WEATHER_API_KEY === 'string') {
        const configKey = WEATHER_API_KEY as string;
        if (configKey.trim() === apiKey.trim() && 
            configKey !== 'your_api_key_here' && 
            !configKey.toLowerCase().includes('your_api_key')) {
          source = 'config-file';
          details.configFileKey = true;
          details.isConfiguredKey = true;
          details.isPlaceholder = false;
          console.log('✅ WeatherConfigValidationService: Valid config file key detected');
        }
      }
      
      // Check localStorage if not from config
      if (source === 'none') {
        const primaryKey = localStorage.getItem('openweathermap_api_key');
        if (primaryKey && primaryKey.trim() === apiKey.trim()) {
          source = 'localStorage';
          details.localStorageKey = true;
          details.isConfiguredKey = false;
          console.log('✅ WeatherConfigValidationService: Valid localStorage key detected');
        }
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
    
    // Generate recommendations
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
    
    console.log('✅ WeatherConfigValidationService: Validation complete:', {
      isValid,
      source,
      details,
      recommendationsCount: recommendations.length
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
