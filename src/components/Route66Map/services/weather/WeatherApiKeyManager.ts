
import { WEATHER_API_KEY } from '@/config/weatherConfig';

export class WeatherApiKeyManager {
  private static readonly STORAGE_KEY = 'openweathermap_api_key';

  static getApiKey(): string | null {
    // First check if API key is configured in code
    if (WEATHER_API_KEY && WEATHER_API_KEY !== 'your_api_key_here') {
      return WEATHER_API_KEY;
    }
    
    // Fallback to localStorage
    return localStorage.getItem(this.STORAGE_KEY);
  }

  static setApiKey(apiKey: string): void {
    localStorage.setItem(this.STORAGE_KEY, apiKey.trim());
  }

  static hasApiKey(): boolean {
    const key = this.getApiKey();
    return !!(key && key.length > 10);
  }

  static validateApiKey(): boolean {
    const key = this.getApiKey();
    return !!(key && key.length >= 32 && key.length <= 50);
  }

  static getDebugInfo(): { hasKey: boolean; keyLength: number | null; keyPreview: string | null } {
    const key = this.getApiKey();
    return {
      hasKey: !!key,
      keyLength: key?.length || null,
      keyPreview: key ? `${key.substring(0, 8)}...${key.substring(key.length - 4)}` : null
    };
  }
}
