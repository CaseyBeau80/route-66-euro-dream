
import { EnhancedWeatherService as MainEnhancedWeatherService } from '@/components/Route66Map/services/weather/EnhancedWeatherService';

export class EnhancedWeatherService {
  static hasApiKey(): boolean {
    return MainEnhancedWeatherService.getInstance().hasApiKey();
  }
  
  static getApiKey(): string | null {
    const instance = MainEnhancedWeatherService.getInstance();
    const debugInfo = instance.getDebugInfo();
    return debugInfo.apiKey || null;
  }
}
