
export class WeatherApiKeyManager {
  private static readonly STORAGE_KEY = 'openweathermap_api_key';
  private apiKey: string | null = null;

  constructor() {
    this.refreshApiKey();
  }

  refreshApiKey(): void {
    this.apiKey = localStorage.getItem(WeatherApiKeyManager.STORAGE_KEY);
    console.log('🔑 WeatherApiKeyManager: API key refreshed from localStorage:', this.apiKey ? 'Present' : 'Missing');
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
    return !!this.apiKey;
  }

  getApiKey(): string | null {
    return this.apiKey;
  }

  validateApiKey(): boolean {
    if (!this.apiKey) {
      console.warn('❌ WeatherApiKeyManager: No API key available');
      return false;
    }
    
    // Basic validation - OpenWeatherMap API keys are typically 32 characters
    if (this.apiKey.length < 10) {
      console.warn('❌ WeatherApiKeyManager: API key appears to be too short');
      return false;
    }
    
    return true;
  }
}
