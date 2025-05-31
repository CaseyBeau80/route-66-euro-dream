
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
    // First try the primary storage key
    this.apiKey = localStorage.getItem(WeatherApiKeyManager.STORAGE_KEY);
    
    // If not found, try fallback keys
    if (!this.apiKey) {
      for (const fallbackKey of WeatherApiKeyManager.FALLBACK_STORAGE_KEYS) {
        this.apiKey = localStorage.getItem(fallbackKey);
        if (this.apiKey) {
          console.log(`🔑 WeatherApiKeyManager: API key found using fallback key: ${fallbackKey}`);
          // Migrate to primary key for consistency
          localStorage.setItem(WeatherApiKeyManager.STORAGE_KEY, this.apiKey);
          break;
        }
      }
    }
    
    console.log('🔑 WeatherApiKeyManager: API key refreshed from localStorage:', this.apiKey ? 'Present' : 'Missing');
    
    if (!this.apiKey) {
      console.warn('❌ WeatherApiKeyManager: No API key found in any storage location');
      this.logAvailableKeys();
    }
  }

  private logAvailableKeys(): void {
    console.log('🔍 WeatherApiKeyManager: Checking all localStorage keys...');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.toLowerCase().includes('weather') || key?.toLowerCase().includes('api')) {
        console.log(`🔍 Found potential key: ${key}`);
      }
    }
  }

  setApiKey(apiKey: string): void {
    const trimmedKey = apiKey.trim();
    if (!trimmedKey) {
      throw new Error('API key cannot be empty');
    }
    
    this.apiKey = trimmedKey;
    localStorage.setItem(WeatherApiKeyManager.STORAGE_KEY, trimmedKey);
    console.log('🔑 WeatherApiKeyManager: API key set and saved to localStorage');
  }

  hasApiKey(): boolean {
    // Always refresh from localStorage to ensure we have the latest key
    this.refreshApiKey();
    const hasKey = !!this.apiKey && this.apiKey.length > 0;
    console.log(`🔑 WeatherApiKeyManager: hasApiKey() = ${hasKey}`);
    return hasKey;
  }

  getApiKey(): string | null {
    if (!this.apiKey) {
      this.refreshApiKey();
    }
    return this.apiKey;
  }

  validateApiKey(): boolean {
    if (!this.apiKey) {
      console.warn('❌ WeatherApiKeyManager: No API key available for validation');
      return false;
    }
    
    // Basic validation - OpenWeatherMap API keys are typically 32 characters
    if (this.apiKey.length < 10) {
      console.warn('❌ WeatherApiKeyManager: API key appears to be too short');
      return false;
    }
    
    console.log('✅ WeatherApiKeyManager: API key validation passed');
    return true;
  }

  // Method to manually set a temporary API key for testing
  setTemporaryApiKey(apiKey: string): void {
    if (apiKey && apiKey.trim()) {
      this.apiKey = apiKey.trim();
      console.log('🔑 WeatherApiKeyManager: Temporary API key set (not saved to localStorage)');
    }
  }
}
