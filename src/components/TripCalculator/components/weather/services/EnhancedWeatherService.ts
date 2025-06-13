
import { EnhancedWeatherService as MainEnhancedWeatherService } from '@/components/Route66Map/services/weather/EnhancedWeatherService';

export class EnhancedWeatherService {
  static hasApiKey(): boolean {
    return MainEnhancedWeatherService.hasApiKey();
  }
  
  static getApiKey(): string | null {
    return MainEnhancedWeatherService.getApiKey();
  }
}
