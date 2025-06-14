
import { WEATHER_API_KEY } from '@/config/weatherConfig';

export class WeatherApiKeyManager {
  private static readonly STORAGE_KEY = 'openweathermap_api_key';

  static getApiKey(): string | null {
    console.log('🔍 WeatherApiKeyManager: Getting API key...');
    
    // Check localStorage first (user input) - highest priority
    const localStorageKey = localStorage.getItem(this.STORAGE_KEY);
    if (localStorageKey && localStorageKey.trim().length > 0) {
      const trimmedKey = localStorageKey.trim();
      console.log('✅ WeatherApiKeyManager: Found key in localStorage, length:', trimmedKey.length);
      return trimmedKey;
    }

    // Check config file as fallback
    if (typeof WEATHER_API_KEY === 'string' && WEATHER_API_KEY.length > 0) {
      const trimmedConfigKey = WEATHER_API_KEY.trim();
      console.log('✅ WeatherApiKeyManager: Using config key, length:', trimmedConfigKey.length);
      return trimmedConfigKey;
    }

    console.log('❌ WeatherApiKeyManager: No API key found');
    return null;
  }

  static setApiKey(apiKey: string): void {
    const trimmedKey = apiKey.trim();
    if (trimmedKey.length < 10) {
      throw new Error('API key too short');
    }
    
    localStorage.setItem(this.STORAGE_KEY, trimmedKey);
    console.log('✅ WeatherApiKeyManager: API key stored successfully, length:', trimmedKey.length);
  }

  static hasApiKey(): boolean {
    const key = this.getApiKey();
    const hasKey = !!key && key.length > 0;
    console.log('🔍 WeatherApiKeyManager: hasApiKey() =', hasKey);
    return hasKey;
  }

  static validateApiKey(): boolean {
    const key = this.getApiKey();
    const isValid = !!key && key.length >= 10;
    console.log('🔍 WeatherApiKeyManager: validateApiKey() =', isValid);
    return isValid;
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

  static clearApiKey(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    console.log('🗑️ WeatherApiKeyManager: API key cleared');
  }
}
