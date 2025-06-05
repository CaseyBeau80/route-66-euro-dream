
export class WeatherApiKeyManager {
  private static readonly STORAGE_KEY = 'openweathermap_api_key';
  private static readonly FALLBACK_STORAGE_KEYS = [
    'weather_api_key',
    'openweather_api_key',
    'owm_api_key'
  ];
  
  private apiKey: string | null = null;

  constructor() {
    this.refreshApiKey();
  }

  refreshApiKey(): void {
    console.log('🔍 WeatherApiKeyManager: Starting API key refresh...');
    
    // First try the primary storage key
    this.apiKey = localStorage.getItem(WeatherApiKeyManager.STORAGE_KEY);
    console.log(`🔍 WeatherApiKeyManager: Primary key from localStorage:`, {
      key: WeatherApiKeyManager.STORAGE_KEY,
      value: this.apiKey,
      length: this.apiKey?.length || 0,
      firstChar: this.apiKey?.[0] || 'none',
      lastChar: this.apiKey?.[this.apiKey.length - 1] || 'none'
    });
    
    // If not found, try fallback keys
    if (!this.apiKey) {
      console.log('🔍 WeatherApiKeyManager: Primary key not found, trying fallbacks...');
      for (const fallbackKey of WeatherApiKeyManager.FALLBACK_STORAGE_KEYS) {
        this.apiKey = localStorage.getItem(fallbackKey);
        if (this.apiKey) {
          console.log(`🔑 WeatherApiKeyManager: API key found using fallback key: ${fallbackKey}`, {
            length: this.apiKey.length,
            firstChar: this.apiKey[0],
            lastChar: this.apiKey[this.apiKey.length - 1]
          });
          // Migrate to primary key for consistency
          localStorage.setItem(WeatherApiKeyManager.STORAGE_KEY, this.apiKey);
          console.log('🔄 WeatherApiKeyManager: Migrated key to primary storage');
          break;
        }
      }
    }
    
    console.log('🔑 WeatherApiKeyManager: API key refreshed from localStorage:', this.apiKey ? 'Present' : 'Missing');
    
    if (!this.apiKey) {
      console.warn('❌ WeatherApiKeyManager: No API key found in any storage location');
      this.logAvailableKeys();
    } else {
      console.log('✅ WeatherApiKeyManager: API key found with length:', this.apiKey.length);
    }
  }

  private logAvailableKeys(): void {
    console.log('🔍 WeatherApiKeyManager: Checking all localStorage keys...');
    const allKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        allKeys.push(key);
        if (key.toLowerCase().includes('weather') || key.toLowerCase().includes('api')) {
          const value = localStorage.getItem(key);
          console.log(`🔍 Found potential key: ${key} = ${value} (length: ${value?.length || 0})`);
        }
      }
    }
    console.log('🔍 All localStorage keys:', allKeys);
  }

  setApiKey(apiKey: string): void {
    console.log('🔑 WeatherApiKeyManager: Setting API key...', {
      originalLength: apiKey.length,
      originalFirstChar: apiKey[0] || 'none',
      originalLastChar: apiKey[apiKey.length - 1] || 'none'
    });
    
    const trimmedKey = apiKey.trim();
    console.log('🔑 WeatherApiKeyManager: After trimming:', {
      trimmedLength: trimmedKey.length,
      trimmedFirstChar: trimmedKey[0] || 'none',
      trimmedLastChar: trimmedKey[trimmedKey.length - 1] || 'none'
    });
    
    if (!trimmedKey) {
      console.error('❌ WeatherApiKeyManager: API key cannot be empty');
      throw new Error('API key cannot be empty');
    }
    
    if (trimmedKey.length < 10) {
      console.error('❌ WeatherApiKeyManager: API key appears to be too short:', trimmedKey.length);
      throw new Error(`API key appears to be too short (${trimmedKey.length} characters). OpenWeatherMap API keys are typically 32 characters long.`);
    }
    
    // Store the key
    this.apiKey = trimmedKey;
    localStorage.setItem(WeatherApiKeyManager.STORAGE_KEY, trimmedKey);
    
    // Verify the storage immediately
    const storedKey = localStorage.getItem(WeatherApiKeyManager.STORAGE_KEY);
    console.log('🔑 WeatherApiKeyManager: Verification after storage:', {
      stored: storedKey,
      storedLength: storedKey?.length || 0,
      matches: storedKey === trimmedKey
    });
    
    if (storedKey !== trimmedKey) {
      console.error('❌ WeatherApiKeyManager: Storage verification failed!');
      throw new Error('Failed to store API key properly');
    }
    
    console.log('✅ WeatherApiKeyManager: API key set and verified successfully');
  }

  hasApiKey(): boolean {
    // Always refresh from localStorage to ensure we have the latest key
    this.refreshApiKey();
    const hasKey = !!this.apiKey && this.apiKey.length > 0;
    console.log(`🔑 WeatherApiKeyManager: hasApiKey() = ${hasKey}`, {
      keyExists: !!this.apiKey,
      keyLength: this.apiKey?.length || 0
    });
    return hasKey;
  }

  getApiKey(): string | null {
    if (!this.apiKey) {
      console.log('🔑 WeatherApiKeyManager: No cached key, refreshing...');
      this.refreshApiKey();
    }
    console.log('🔑 WeatherApiKeyManager: Returning API key:', {
      hasKey: !!this.apiKey,
      length: this.apiKey?.length || 0
    });
    return this.apiKey;
  }

  validateApiKey(): boolean {
    if (!this.apiKey) {
      console.warn('❌ WeatherApiKeyManager: No API key available for validation');
      return false;
    }
    
    // Basic validation - OpenWeatherMap API keys are typically 32 characters
    if (this.apiKey.length < 10) {
      console.warn('❌ WeatherApiKeyManager: API key appears to be too short:', this.apiKey.length);
      return false;
    }
    
    console.log('✅ WeatherApiKeyManager: API key validation passed');
    return true;
  }

  // Debug method to get detailed API key info
  getDebugInfo(): { hasKey: boolean; keyLength: number | null; keyPreview: string | null } {
    this.refreshApiKey();
    return {
      hasKey: !!this.apiKey,
      keyLength: this.apiKey?.length || null,
      keyPreview: this.apiKey ? `${this.apiKey.substring(0, 4)}...${this.apiKey.substring(this.apiKey.length - 4)}` : null
    };
  }

  // Recovery method to clear corrupted keys
  clearApiKey(): void {
    console.log('🧹 WeatherApiKeyManager: Clearing API key from all storage locations');
    this.apiKey = null;
    localStorage.removeItem(WeatherApiKeyManager.STORAGE_KEY);
    
    // Also clear fallback keys
    WeatherApiKeyManager.FALLBACK_STORAGE_KEYS.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log('✅ WeatherApiKeyManager: API key cleared successfully');
  }

  // Method to manually set a temporary API key for testing
  setTemporaryApiKey(apiKey: string): void {
    if (apiKey && apiKey.trim()) {
      this.apiKey = apiKey.trim();
      console.log('🔑 WeatherApiKeyManager: Temporary API key set (not saved to localStorage)');
    }
  }
}
