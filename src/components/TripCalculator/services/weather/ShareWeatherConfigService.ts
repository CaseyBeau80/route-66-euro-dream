
import { EnhancedWeatherService } from '@/components/Route66Map/services/weather/EnhancedWeatherService';

export interface ShareWeatherConfig {
  hasApiKey: boolean;
  canFetchLiveWeather: boolean;
  apiKeySource: 'main-app' | 'none';
}

export class ShareWeatherConfigService {
  /**
   * Get weather configuration for share/export contexts
   */
  static getShareWeatherConfig(): ShareWeatherConfig {
    try {
      const weatherService = EnhancedWeatherService.getInstance();
      const hasApiKey = weatherService.hasApiKey();
      
      console.log('🔑 ShareWeatherConfigService: Checking weather config for export', {
        hasApiKey,
        weatherServiceExists: !!weatherService
      });
      
      return {
        hasApiKey,
        canFetchLiveWeather: hasApiKey,
        apiKeySource: hasApiKey ? 'main-app' : 'none'
      };
    } catch (error) {
      console.error('❌ ShareWeatherConfigService: Error checking weather config:', error);
      return {
        hasApiKey: false,
        canFetchLiveWeather: false,
        apiKeySource: 'none'
      };
    }
  }
  
  /**
   * Check if live weather should be attempted for export
   */
  static shouldAttemptLiveWeather(): boolean {
    const config = this.getShareWeatherConfig();
    return config.canFetchLiveWeather;
  }
}
