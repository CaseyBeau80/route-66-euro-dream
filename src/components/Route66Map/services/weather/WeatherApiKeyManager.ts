
import { WEATHER_API_KEY } from '@/config/weatherConfig';

export class WeatherApiKeyManager {
  private static readonly PRIMARY_STORAGE_KEY = 'openweathermap_api_key';
  private static readonly STORAGE_KEYS = [
    'openweathermap_api_key',
    'weather_api_key',
    'openWeatherMapApiKey',
    'openweather_api_key'
  ];

  static getApiKey(): string | null {
    console.log('🔍 WeatherApiKeyManager: Checking all possible API key sources...');
    
    // Check all localStorage keys
    for (const key of this.STORAGE_KEYS) {
      const storedKey = localStorage.getItem(key);
      if (storedKey && this.isValidKey(storedKey)) {
        console.log(`✅ Found valid API key in localStorage: ${key}`);
        // Migrate to primary key if found elsewhere
        if (key !== this.PRIMARY_STORAGE_KEY) {
          localStorage.setItem(this.PRIMARY_STORAGE_KEY, storedKey);
          console.log(`🔄 Migrated API key to primary storage: ${this.PRIMARY_STORAGE_KEY}`);
        }
        return storedKey.trim();
      }
    }
    
    // Check configured key in code as fallback
    if (WEATHER_API_KEY && typeof WEATHER_API_KEY === 'string') {
      const configKey = WEATHER_API_KEY as string;
      if (this.isValidKey(configKey)) {
        console.log('✅ Using configured API key from weatherConfig.ts');
        return configKey.trim();
      }
    }

    console.log('❌ No valid API key found in any location');
    return null;
  }

  static setApiKey(apiKey: string): void {
    const trimmedKey = apiKey.trim();
    
    if (!this.isValidKey(trimmedKey)) {
      console.error('❌ Cannot set invalid API key');
      throw new Error('Invalid API key format');
    }
    
    // Store in primary location
    localStorage.setItem(this.PRIMARY_STORAGE_KEY, trimmedKey);
    console.log('✅ API key stored successfully in:', this.PRIMARY_STORAGE_KEY);
    
    // Clean up any old keys
    this.STORAGE_KEYS.forEach(key => {
      if (key !== this.PRIMARY_STORAGE_KEY && localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log(`🧹 Cleaned up old API key from: ${key}`);
      }
    });
  }

  static hasApiKey(): boolean {
    const key = this.getApiKey();
    const hasKey = !!key;
    console.log(`🔍 WeatherApiKeyManager: hasApiKey() = ${hasKey}`, {
      keyLength: key?.length || 0,
      keyPreview: key ? `${key.substring(0, 8)}...${key.substring(key.length - 4)}` : 'none'
    });
    return hasKey;
  }

  static validateApiKey(): boolean {
    const key = this.getApiKey();
    const isValid = this.isValidKey(key);
    console.log(`🔍 WeatherApiKeyManager: validateApiKey() = ${isValid}`);
    return isValid;
  }

  private static isValidKey(key: string | null): boolean {
    if (!key || typeof key !== 'string') {
      return false;
    }
    
    const trimmedKey = key.trim();
    
    // Check minimum length (OpenWeatherMap keys are typically 32 characters)
    if (trimmedKey.length < 20) {
      console.log(`❌ Key too short: ${trimmedKey.length} characters`);
      return false;
    }
    
    // Check for placeholder patterns
    const placeholderPatterns = [
      'your_api_key_here',
      'your_api_key',
      'replace_with',
      'example_key',
      'placeholder',
      'PLACEHOLDER_KEY',
      'test_key',
      'demo_key'
    ];
    
    const lowerKey = trimmedKey.toLowerCase();
    for (const pattern of placeholderPatterns) {
      if (lowerKey.includes(pattern.toLowerCase())) {
        console.log(`❌ Detected placeholder pattern: ${pattern}`);
        return false;
      }
    }
    
    console.log(`✅ Key validation passed: ${trimmedKey.length} characters`);
    return true;
  }

  static getDebugInfo(): { hasKey: boolean; keyLength: number | null; keyPreview: string | null; isValid: boolean; allStorageKeys: Record<string, string | null> } {
    const key = this.getApiKey();
    
    // Check all storage locations for debugging
    const allStorageKeys: Record<string, string | null> = {};
    this.STORAGE_KEYS.forEach(storageKey => {
      allStorageKeys[storageKey] = localStorage.getItem(storageKey);
    });
    
    const debugInfo = {
      hasKey: !!key,
      keyLength: key?.length || null,
      keyPreview: key ? `${key.substring(0, 8)}...${key.substring(key.length - 4)}` : null,
      isValid: this.validateApiKey(),
      allStorageKeys
    };
    
    console.log('🔍 WeatherApiKeyManager Debug Info:', debugInfo);
    return debugInfo;
  }

  static clearAllKeys(): void {
    console.log('🧹 WeatherApiKeyManager: Clearing all stored API keys');
    this.STORAGE_KEYS.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log(`🗑️ Removed key from: ${key}`);
      }
    });
  }
}
