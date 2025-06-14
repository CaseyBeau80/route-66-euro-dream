
import { WEATHER_API_KEY } from '@/config/weatherConfig';

export class WeatherApiKeyManager {
  private static readonly STORAGE_KEY = 'openweathermap_api_key';

  static getApiKey(): string | null {
    // First check if API key is configured in code
    if (WEATHER_API_KEY && typeof WEATHER_API_KEY === 'string') {
      const apiKey = WEATHER_API_KEY as string; // Explicit type assertion for clarity
      if (apiKey !== 'your_api_key_here' && 
          !apiKey.toLowerCase().includes('your_api_key') &&
          !apiKey.toLowerCase().includes('replace_with') &&
          apiKey.length >= 20) {
        return apiKey;
      }
    }
    
    // Fallback to localStorage
    return localStorage.getItem(this.STORAGE_KEY);
  }

  static setApiKey(apiKey: string): void {
    localStorage.setItem(this.STORAGE_KEY, apiKey.trim());
  }

  static hasApiKey(): boolean {
    const key = this.getApiKey();
    // More permissive check - just need a reasonable length key
    return !!(key && key.length >= 20 && !this.isPlaceholderKey(key));
  }

  static validateApiKey(): boolean {
    const key = this.getApiKey();
    // OpenWeatherMap API keys are typically 32 characters, but allow some flexibility
    return !!(key && key.length >= 20 && key.length <= 50 && !this.isPlaceholderKey(key));
  }

  private static isPlaceholderKey(key: string): boolean {
    const lowerKey = key.toLowerCase();
    return lowerKey.includes('your_api_key') || 
           lowerKey.includes('replace_with') ||
           lowerKey.includes('example') ||
           key === 'PLACEHOLDER_KEY';
  }

  static getDebugInfo(): { hasKey: boolean; keyLength: number | null; keyPreview: string | null; isValid: boolean } {
    const key = this.getApiKey();
    return {
      hasKey: !!key,
      keyLength: key?.length || null,
      keyPreview: key ? `${key.substring(0, 8)}...${key.substring(key.length - 4)}` : null,
      isValid: this.validateApiKey()
    };
  }
}
