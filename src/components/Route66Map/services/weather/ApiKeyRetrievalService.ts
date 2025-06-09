
import { WEATHER_API_KEY } from '@/config/weatherConfig';

export class ApiKeyRetrievalService {
  private static readonly STORAGE_KEY = 'openweathermap_api_key';
  private static readonly LEGACY_STORAGE_KEY = 'openWeatherMapApiKey';

  static refreshApiKey(): string | null {
    console.log('🔄 ApiKeyRetrievalService: Refreshing API key from all sources...');
    
    // 1. Check localStorage first (primary storage)
    const primaryKey = localStorage.getItem(this.STORAGE_KEY);
    if (primaryKey && this.isValidKey(primaryKey)) {
      console.log('✅ Found valid key in primary localStorage');
      return primaryKey.trim();
    }

    // 2. Check legacy localStorage key
    const legacyKey = localStorage.getItem(this.LEGACY_STORAGE_KEY);
    if (legacyKey && this.isValidKey(legacyKey)) {
      console.log('✅ Found valid key in legacy localStorage, migrating...');
      // Migrate to primary storage
      localStorage.setItem(this.STORAGE_KEY, legacyKey.trim());
      localStorage.removeItem(this.LEGACY_STORAGE_KEY);
      return legacyKey.trim();
    }

    // 3. Check configured key in code
    if (WEATHER_API_KEY && typeof WEATHER_API_KEY === 'string') {
      const configKey = WEATHER_API_KEY as string;
      if (this.isValidKey(configKey)) {
        console.log('✅ Found valid key in weatherConfig');
        return configKey.trim();
      }
    }

    console.log('❌ No valid API key found in any source');
    return null;
  }

  static getApiKeyWithCorruptionCheck(cachedKey: string | null): string | null {
    // Always refresh to get the latest from localStorage
    return this.refreshApiKey();
  }

  private static isValidKey(key: string): boolean {
    if (!key || typeof key !== 'string') return false;
    
    const trimmedKey = key.trim();
    
    // Check for placeholder keys
    if (trimmedKey === 'your_api_key_here' ||
        trimmedKey.toLowerCase().includes('your_api_key') ||
        trimmedKey.toLowerCase().includes('replace_with') ||
        trimmedKey.toLowerCase().includes('example') ||
        trimmedKey === 'PLACEHOLDER_KEY') {
      return false;
    }
    
    // Valid keys should be at least 20 characters
    return trimmedKey.length >= 20;
  }
}
