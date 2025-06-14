
import { WEATHER_API_KEY } from '@/config/weatherConfig';

export class WeatherApiKeyManager {
  private static readonly STORAGE_KEY = 'openweathermap_api_key';

  static getApiKey(): string | null {
    console.log('🔍 WeatherApiKeyManager: Getting API key...');
    
    // Check localStorage first (user input)
    const localStorageKey = localStorage.getItem(this.STORAGE_KEY);
    if (localStorageKey && this.isValidKey(localStorageKey)) {
      console.log('✅ WeatherApiKeyManager: Found valid key in localStorage');
      return localStorageKey.trim();
    }

    // Check config file
    if (WEATHER_API_KEY && typeof WEATHER_API_KEY === 'string' && WEATHER_API_KEY.trim().length > 0) {
      const configKey = WEATHER_API_KEY.trim();
      if (this.isValidKey(configKey)) {
        console.log('✅ WeatherApiKeyManager: Using valid config key');
        return configKey;
      }
    }

    console.log('❌ WeatherApiKeyManager: No valid API key found');
    return null;
  }

  static setApiKey(apiKey: string): void {
    const trimmedKey = apiKey.trim();
    if (!this.isValidKey(trimmedKey)) {
      throw new Error('Invalid API key provided');
    }
    
    localStorage.setItem(this.STORAGE_KEY, trimmedKey);
    console.log('✅ WeatherApiKeyManager: API key stored successfully');
  }

  static hasApiKey(): boolean {
    const key = this.getApiKey();
    const hasKey = !!key;
    console.log('🔍 WeatherApiKeyManager: hasApiKey() =', hasKey);
    return hasKey;
  }

  static validateApiKey(): boolean {
    const key = this.getApiKey();
    const isValid = this.isValidKey(key);
    console.log('🔍 WeatherApiKeyManager: validateApiKey() =', isValid);
    return isValid;
  }

  private static isValidKey(key: string | null): boolean {
    if (!key || typeof key !== 'string') {
      console.log('❌ WeatherApiKeyManager: Key is null or not string');
      return false;
    }
    
    const trimmedKey = key.trim();
    
    // Reject obvious placeholders
    const placeholderPatterns = [
      'your_api_key_here',
      'your_api_key',
      'replace_with_your_key',
      'your_openweather_api_key',
      'enter_your_api_key',
      'a1b2c3d4e5f6789012345678901abcde' // old placeholder
    ];
    
    const lowerKey = trimmedKey.toLowerCase();
    for (const pattern of placeholderPatterns) {
      if (lowerKey === pattern.toLowerCase()) {
        console.log('❌ WeatherApiKeyManager: Rejected placeholder pattern:', pattern);
        return false;
      }
    }
    
    // Must be at least 20 characters for OpenWeather API keys
    if (trimmedKey.length < 20) {
      console.log('❌ WeatherApiKeyManager: Key too short:', trimmedKey.length);
      return false;
    }
    
    console.log('✅ WeatherApiKeyManager: Key validation passed, length:', trimmedKey.length);
    return true;
  }

  static getDebugInfo(): { hasKey: boolean; keyLength: number | null; keyPreview: string | null; isValid: boolean } {
    const key = this.getApiKey();
    const debugInfo = {
      hasKey: !!key,
      keyLength: key?.length || null,
      keyPreview: key ? `${key.substring(0, 8)}...${key.substring(key.length - 4)}` : null,
      isValid: this.validateApiKey()
    };
    
    console.log('🔍 WeatherApiKeyManager: Debug info:', debugInfo);
    return debugInfo;
  }
}
