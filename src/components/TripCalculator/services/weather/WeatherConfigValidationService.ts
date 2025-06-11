
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
  };
  recommendations: string[];
}

export class WeatherConfigValidationService {
  /**
   * Validate weather configuration and provide recommendations
   */
  static validateConfiguration(): WeatherConfigValidation {
    console.log('🔍 WeatherConfigValidationService: Starting configuration validation');
    
    const details: any = {};
    const recommendations: string[] = [];
    let isValid = false;
    let source: 'config-file' | 'localStorage' | 'none' = 'none';
    
    // Check config file - ensure we have a string before calling methods
    const configKey = WEATHER_API_KEY;
    const configKeyString = typeof configKey === 'string' ? configKey : '';
    
    // More explicit string checking to avoid TypeScript control flow issues
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
    
    if (details.configFileKey) {
      details.keyLength = configKeyString.length;
      source = 'config-file';
      isValid = configKeyString.length >= 20;
    }
    
    // Check localStorage
    const primaryKey = localStorage.getItem('openweathermap_api_key');
    const legacyKey = localStorage.getItem('openWeatherMapApiKey');
    
    details.localStorageKey = !!(primaryKey || legacyKey);
    
    if (details.localStorageKey && !isValid) {
      const storageKey = primaryKey || legacyKey;
      if (storageKey && storageKey.length >= 20) {
        source = 'localStorage';
        isValid = true;
        details.keyLength = storageKey.length;
      }
    }
    
    // Generate recommendations
    if (!isValid) {
      if (isConfigPlaceholder) {
        recommendations.push('Replace the placeholder API key in src/config/weatherConfig.ts with a real OpenWeatherMap API key');
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
  
  /**
   * Get a user-friendly configuration status summary
   */
  static getConfigurationSummary(): string {
    const validation = this.validateConfiguration();
    
    if (validation.isValid) {
      return `Weather API configured via ${validation.source === 'config-file' ? 'configuration file' : 'user settings'}`;
    } else {
      return 'Weather API not configured - live forecasts unavailable';
    }
  }
}
