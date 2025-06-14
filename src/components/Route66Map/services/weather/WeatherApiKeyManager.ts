
import { WEATHER_API_KEY } from '@/config/weatherConfig';

export class WeatherApiKeyManager {
  private static readonly STORAGE_KEY = 'openweathermap_api_key';

  static getApiKey(): string | null {
    console.log('🔍 FIXED WeatherApiKeyManager: Getting API key...');
    
    // Check localStorage first (user input)
    const localStorageKey = localStorage.getItem(this.STORAGE_KEY);
    if (localStorageKey && this.isValidKey(localStorageKey)) {
      console.log('✅ FIXED WeatherApiKeyManager: Found valid key in localStorage');
      return localStorageKey.trim();
    }

    // Check config file - accept the test key for now
    if (typeof WEATHER_API_KEY === 'string' && WEATHER_API_KEY.length > 0) {
      const trimmedConfigKey = WEATHER_API_KEY.trim();
      if (trimmedConfigKey.length > 0) {
        console.log('✅ FIXED WeatherApiKeyManager: Using config key (test key accepted)');
        return trimmedConfigKey;
      }
    } else {
      console.log('🔍 FIXED WeatherApiKeyManager: No config key set (empty string)');
    }

    console.log('❌ FIXED WeatherApiKeyManager: No API key found');
    return null;
  }

  static setApiKey(apiKey: string): void {
    const trimmedKey = apiKey.trim();
    if (!this.isValidKey(trimmedKey)) {
      throw new Error('Invalid API key provided');
    }
    
    localStorage.setItem(this.STORAGE_KEY, trimmedKey);
    console.log('✅ FIXED WeatherApiKeyManager: API key stored successfully');
  }

  static hasApiKey(): boolean {
    const key = this.getApiKey();
    const hasKey = !!key;
    console.log('🔍 FIXED WeatherApiKeyManager: hasApiKey() =', hasKey);
    return hasKey;
  }

  static validateApiKey(): boolean {
    const key = this.getApiKey();
    const isValid = this.isValidKey(key);
    console.log('🔍 FIXED WeatherApiKeyManager: validateApiKey() =', isValid);
    return isValid;
  }

  private static isValidKey(key: string | null): boolean {
    if (!key || typeof key !== 'string') {
      console.log('❌ FIXED WeatherApiKeyManager: Key is null or not string');
      return false;
    }
    
    const trimmedKey = key.trim();
    
    // Reject empty strings
    if (trimmedKey.length === 0) {
      console.log('❌ FIXED WeatherApiKeyManager: Key is empty string');
      return false;
    }
    
    // Accept the test key for testing
    if (trimmedKey === 'b6907d289e10d714a6e88b30761fae22') {
      console.log('✅ FIXED WeatherApiKeyManager: Accepted test API key');
      return true;
    }
    
    // Reject obvious placeholders
    const placeholderPatterns = [
      'your_api_key_here',
      'your_api_key',
      'replace_with_your_key',
      'your_openweather_api_key',
      'enter_your_api_key',
      'a1b2c3d4e5f6789012345678901abcde' // example pattern
    ];
    
    const lowerKey = trimmedKey.toLowerCase();
    for (const pattern of placeholderPatterns) {
      if (lowerKey === pattern.toLowerCase()) {
        console.log('❌ FIXED WeatherApiKeyManager: Rejected placeholder pattern:', pattern);
        return false;
      }
    }
    
    // Must be at least 20 characters for OpenWeather API keys
    if (trimmedKey.length < 20) {
      console.log('❌ FIXED WeatherApiKeyManager: Key too short:', trimmedKey.length);
      return false;
    }
    
    console.log('✅ FIXED WeatherApiKeyManager: Key validation passed, length:', trimmedKey.length);
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
    
    console.log('🔍 FIXED WeatherApiKeyManager: Debug info:', debugInfo);
    return debugInfo;
  }
}
