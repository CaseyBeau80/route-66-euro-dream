
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
    
    // Check config file with enhanced validation
    const configKey = WEATHER_API_KEY;
    const configKeyString = typeof configKey === 'string' ? configKey : '';
    
    // Enhanced string checking to avoid TypeScript control flow issues
    let isConfigPlaceholder = false;
    if (configKeyString.length === 0) {
      isConfigPlaceholder = true;
    } else {
      // Now TypeScript knows configKeyString is a non-empty string
      if (configKeyString === 'your_api_key_here') {
        isConfigPlaceholder = true;
      } else if (configKeyString.toLowerCase().includes('your_api_key')) {
        isConfigPlaceholder = true;
      } else if (configKeyString.toLowerCase().includes('placeholder')) {
        isConfigPlaceholder = true;
      }
    }
    
    details.configFileKey = !!configKeyString && !isConfigPlaceholder;
    details.isPlaceholder = isConfigPlaceholder;
    details.isConfiguredKey = details.configFileKey;
    
    if (details.configFileKey) {
      details.keyLength = configKeyString.length;
      source = 'config-file';
      isValid = configKeyString.length >= 20;
      console.log('✅ WeatherConfigValidationService: Valid config file key detected', {
        keyLength: configKeyString.length,
        keyPreview: configKeyString.substring(0, 8) + '...'
      });
    }
    
    // Check localStorage only if config file key is not valid
    if (!isValid) {
      const primaryKey = localStorage.getItem('openweathermap_api_key');
      const legacyKey = localStorage.getItem('openWeatherMapApiKey');
      
      details.localStorageKey = !!(primaryKey || legacyKey);
      
      if (details.localStorageKey) {
        const storageKey = primaryKey || legacyKey;
        if (storageKey && storageKey.length >= 20) {
          source = 'localStorage';
          isValid = true;
          details.keyLength = storageKey.length;
          console.log('✅ WeatherConfigValidationService: Valid localStorage key detected');
        }
      }
    }
    
    // Generate enhanced recommendations
    if (!isValid) {
      if (isConfigPlaceholder) {
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
