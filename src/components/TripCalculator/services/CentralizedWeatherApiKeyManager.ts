
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';

export class CentralizedWeatherApiKeyManager {
  private static instance: CentralizedWeatherApiKeyManager;
  private lastCheck: number = 0;
  private cachedResult: boolean = false;
  private readonly CACHE_DURATION = 2000; // 2 seconds

  private constructor() {}

  static getInstance(): CentralizedWeatherApiKeyManager {
    if (!this.instance) {
      this.instance = new CentralizedWeatherApiKeyManager();
    }
    return this.instance;
  }

  hasApiKey(): boolean {
    const now = Date.now();
    
    // Use cached result if recent
    if (now - this.lastCheck < this.CACHE_DURATION) {
      return this.cachedResult;
    }

    // Fresh check using the main manager
    this.cachedResult = WeatherApiKeyManager.hasApiKey();
    this.lastCheck = now;
    
    console.log('🔑 CentralizedWeatherApiKeyManager: API key check:', {
      hasKey: this.cachedResult,
      cached: false,
      timestamp: new Date().toISOString()
    });
    
    return this.cachedResult;
  }

  getApiKey(): string | null {
    return WeatherApiKeyManager.getApiKey();
  }

  setApiKey(apiKey: string): void {
    WeatherApiKeyManager.setApiKey(apiKey);
    // Clear cache to force fresh check
    this.lastCheck = 0;
    this.cachedResult = false;
  }

  invalidateCache(): void {
    this.lastCheck = 0;
    this.cachedResult = false;
  }
}
