
import { WEATHER_API_KEY } from '@/config/weatherConfig';

export class ApiKeyRetrievalService {
  private static readonly STORAGE_KEY = 'openweathermap_api_key';
  private static readonly LEGACY_STORAGE_KEYS = [
    'openWeatherMapApiKey',
    'openweather_api_key',
    'weather_api_key'
  ];

  static refreshApiKey(): string | null {
    console.log('🔄 ApiKeyRetrievalService: Enhanced API key refresh from all sources...');
    
    // 1. Check localStorage first (most common for user input)
    const primaryKey = localStorage.getItem(this.STORAGE_KEY);
    if (primaryKey && this.isValidKey(primaryKey)) {
      console.log('✅ Found valid key in primary localStorage');
      return primaryKey.trim();
    }

    // 2. Check legacy localStorage keys
    for (const legacyKey of this.LEGACY_STORAGE_KEYS) {
      const storedKey = localStorage.getItem(legacyKey);
      if (storedKey && this.isValidKey(storedKey)) {
        console.log(`✅ Found valid key in legacy localStorage (${legacyKey}), migrating...`);
        // Migrate to primary storage
        localStorage.setItem(this.STORAGE_KEY, storedKey.trim());
        localStorage.removeItem(legacyKey);
        return storedKey.trim();
      }
    }

    // 3. Check configured key in code LAST (for development/export scenarios)
    if (WEATHER_API_KEY && typeof WEATHER_API_KEY === 'string') {
      const configKey = WEATHER_API_KEY as string;
      if (this.isValidKey(configKey)) {
        console.log('✅ Found valid configured API key in weatherConfig.ts');
        return configKey.trim();
      } else {
        console.log('⚠️ Config key exists but is placeholder/invalid:', configKey.substring(0, 20) + '...');
      }
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
    
    // Check localStorage first
    const primaryKey = localStorage.getItem(this.STORAGE_KEY);
    if (primaryKey && primaryKey.trim() === key.trim()) {
      return 'localStorage';
    }
    
    // Check legacy storage
    for (const legacyKey of this.LEGACY_STORAGE_KEYS) {
      const storedKey = localStorage.getItem(legacyKey);
      if (storedKey && storedKey.trim() === key.trim()) {
        return 'legacy-storage';
      }
    }
    
    // Check if it matches config
    if (WEATHER_API_KEY && typeof WEATHER_API_KEY === 'string') {
      const configKey = WEATHER_API_KEY as string;
      if (configKey.trim() === key.trim() && this.isValidKey(configKey)) {
        return 'config-file';
      }
    }
    
    return 'none';
  }

  private static isValidKey(key: string): boolean {
    if (!key || typeof key !== 'string') return false;
    
    const trimmedKey = key.trim();
    
    // Check for placeholder keys - be more lenient
    const placeholderPatterns = [
      'your_api_key_here',
      'your_api_key',
      'replace_with',
      'example_key',
      'placeholder',
      'PLACEHOLDER_KEY',
      'INSERT_API_KEY',
      'ADD_YOUR_KEY',
      'test_key',
      'demo_key'
    ];
    
    const lowerKey = trimmedKey.toLowerCase();
    for (const pattern of placeholderPatterns) {
      if (lowerKey.includes(pattern.toLowerCase())) {
        console.log(`❌ Rejected placeholder key pattern: ${pattern}`);
        return false;
      }
    }
    
    // Valid keys should be at least 10 characters (more lenient)
    if (trimmedKey.length < 10) {
      console.log(`❌ Rejected key too short: ${trimmedKey.length} characters`);
      return false;
    }
    
    // Don't be too restrictive on length - some test keys might be shorter
    if (trimmedKey.length > 100) {
      console.log(`❌ Rejected key too long: ${trimmedKey.length} characters`);
      return false;
    }
    
    console.log(`✅ Key validation passed: ${trimmedKey.length} characters`);
    return true;
  }

  /**
   * Store a new API key with validation
   */
  static storeApiKey(apiKey: string): boolean {
    const trimmedKey = apiKey.trim();
    
    if (!this.isValidKey(trimmedKey)) {
      console.error('❌ Cannot store invalid API key');
      return false;
    }
    
    try {
      localStorage.setItem(this.STORAGE_KEY, trimmedKey);
      console.log('✅ API key stored successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to store API key:', error);
      return false;
    }
  }
}
