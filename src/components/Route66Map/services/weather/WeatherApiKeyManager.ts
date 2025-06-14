
import { WEATHER_API_KEY } from '@/config/weatherConfig';

export class WeatherApiKeyManager {
  private static readonly STORAGE_KEY = 'openweathermap_api_key';

  static getApiKey(): string | null {
    console.log('🔍 WeatherApiKeyManager: Strict API key check...');
    
    // Check localStorage first (user input)
    const localStorageKey = localStorage.getItem(this.STORAGE_KEY);
    if (localStorageKey && this.isValidKey(localStorageKey)) {
      console.log('✅ WeatherApiKeyManager: Found valid key in localStorage');
      return localStorageKey.trim();
    }

    // Check config file with STRICT validation
    if (WEATHER_API_KEY && typeof WEATHER_API_KEY === 'string') {
      const configKey = WEATHER_API_KEY as string;
      if (this.isValidKey(configKey)) {
        console.log('✅ WeatherApiKeyManager: Using config key');
        return configKey.trim();
      } else {
        console.log('❌ WeatherApiKeyManager: Config key is placeholder/invalid:', configKey);
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
    console.log('🔍 WeatherApiKeyManager: hasApiKey() =', hasKey, key ? `(${key.length} chars)` : '(no key)');
    return hasKey;
  }

  static validateApiKey(): boolean {
    const key = this.getApiKey();
    const isValid = this.isValidKey(key);
    console.log('🔍 WeatherApiKeyManager: validateApiKey() =', isValid);
    return isValid;
  }

  private static isValidKey(key: string | null): boolean {
    if (!key || typeof key !== 'string') return false;
    
    const trimmedKey = key.trim();
    
    // STRICT: Check for ANY obvious placeholder patterns
    const placeholderPatterns = [
      'abcd1234',
      'efgh5678', 
      'ijkl9012',
      'mnop3456',
      'your_api_key_here',
      'your_api_key',
      'replace_with',
      'placeholder',
      'example',
      'test_key',
      'demo_key',
      'sample_key'
    ];
    
    const lowerKey = trimmedKey.toLowerCase();
    for (const pattern of placeholderPatterns) {
      if (lowerKey.includes(pattern.toLowerCase())) {
        console.log('❌ WeatherApiKeyManager: Rejected placeholder pattern:', pattern);
        return false;
      }
    }
    
    // Valid OpenWeatherMap keys are exactly 32 characters of alphanumeric
    if (trimmedKey.length !== 32) {
      console.log('❌ WeatherApiKeyManager: Invalid length:', trimmedKey.length, '(expected 32)');
      return false;
    }
    
    // Check if it's all alphanumeric (OpenWeatherMap format)
    if (!/^[a-zA-Z0-9]+$/.test(trimmedKey)) {
      console.log('❌ WeatherApiKeyManager: Invalid format (not alphanumeric)');
      return false;
    }
    
    console.log('✅ WeatherApiKeyManager: Key validation passed');
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
