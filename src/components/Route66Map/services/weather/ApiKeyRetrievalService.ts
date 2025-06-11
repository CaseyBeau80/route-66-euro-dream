
import { WEATHER_API_KEY } from '@/config/weatherConfig';

export class ApiKeyRetrievalService {
  private static readonly STORAGE_KEY = 'openweathermap_api_key';
  private static readonly LEGACY_STORAGE_KEY = 'openWeatherMapApiKey';

  static refreshApiKey(): string | null {
    console.log('🔄 ApiKeyRetrievalService: Enhanced API key refresh from all sources...');
    
    // 1. Check configured key in code FIRST (highest priority for exports)
    if (WEATHER_API_KEY && typeof WEATHER_API_KEY === 'string') {
      const configKey = WEATHER_API_KEY as string;
      if (this.isValidKey(configKey)) {
        console.log('✅ Found valid configured API key in weatherConfig.ts');
        return configKey.trim();
      } else {
        console.log('⚠️ Config key exists but is placeholder/invalid:', configKey.substring(0, 20) + '...');
      }
    }

    // 2. Check localStorage (primary storage)
    const primaryKey = localStorage.getItem(this.STORAGE_KEY);
    if (primaryKey && this.isValidKey(primaryKey)) {
      console.log('✅ Found valid key in primary localStorage');
      return primaryKey.trim();
    }

    // 3. Check legacy localStorage key
    const legacyKey = localStorage.getItem(this.LEGACY_STORAGE_KEY);
    if (legacyKey && this.isValidKey(legacyKey)) {
      console.log('✅ Found valid key in legacy localStorage, migrating...');
      // Migrate to primary storage
      localStorage.setItem(this.STORAGE_KEY, legacyKey.trim());
      localStorage.removeItem(this.LEGACY_STORAGE_KEY);
      return legacyKey.trim();
    }

    console.log('❌ No valid API key found in any source');
    return null;
  }

  static getApiKeyWithCorruptionCheck(cachedKey: string | null): string | null {
    // Always refresh to get the latest from all sources
    const refreshedKey = this.refreshApiKey();
    
    // If we have a refreshed key and it's different from cached, log the change
    if (refreshedKey !== cachedKey) {
      console.log('🔄 ApiKeyRetrievalService: Key changed during refresh', {
        hadCachedKey: !!cachedKey,
        hasRefreshedKey: !!refreshedKey,
        keysMatch: refreshedKey === cachedKey,
        keySource: this.getKeySource(refreshedKey)
      });
    }
    
    return refreshedKey;
  }

  static getKeySource(key: string | null): 'config-file' | 'localStorage' | 'legacy-storage' | 'none' {
    if (!key) return 'none';
    
    // Check if it matches config
    if (WEATHER_API_KEY && typeof WEATHER_API_KEY === 'string' && WEATHER_API_KEY.trim() === key) {
      return 'config-file';
    }
    
    // Check localStorage
    const primaryKey = localStorage.getItem(this.STORAGE_KEY);
    if (primaryKey === key) {
      return 'localStorage';
    }
    
    const legacyKey = localStorage.getItem(this.LEGACY_STORAGE_KEY);
    if (legacyKey === key) {
      return 'legacy-storage';
    }
    
    return 'config-file'; // Default assumption
  }

  private static isValidKey(key: string): boolean {
    if (!key || typeof key !== 'string') return false;
    
    const trimmedKey = key.trim();
    
    // Check for placeholder keys
    if (trimmedKey === 'your_api_key_here' ||
        trimmedKey.toLowerCase().includes('your_api_key') ||
        trimmedKey.toLowerCase().includes('replace_with') ||
        trimmedKey.toLowerCase().includes('example') ||
        trimmedKey.toLowerCase().includes('placeholder') ||
        trimmedKey === 'PLACEHOLDER_KEY') {
      return false;
    }
    
    // Valid keys should be at least 20 characters
    return trimmedKey.length >= 20;
  }
}
