
import { EnhancedWeatherService as MainEnhancedWeatherService } from '@/components/Route66Map/services/weather/EnhancedWeatherService';

export class EnhancedWeatherService {
  static hasApiKey(): boolean {
    const hasKey = MainEnhancedWeatherService.getInstance().hasApiKey();
    console.log('🔧 TripCalculator EnhancedWeatherService.hasApiKey():', hasKey);
    return hasKey;
  }
  
  static getApiKey(): string | null {
    console.log('🔧 TripCalculator EnhancedWeatherService.getApiKey() called');
    
    // Access the API key manager directly, same as the main service
    const instance = MainEnhancedWeatherService.getInstance();
    // Use the enhanced debug info which contains the actual key access pattern
    const debugInfo = instance.getEnhancedDebugInfo();
    
    console.log('🔧 TripCalculator EnhancedWeatherService debug info:', {
      hasKey: debugInfo.hasKey,
      keyLength: debugInfo.keyLength,
      isCorrupted: debugInfo.corruptionAnalysis?.isCorrupted
    });
    
    // The debug info doesn't contain the actual key, so we need to use
    // the same pattern as the main service's internal apiKeyManager
    if (!debugInfo.hasKey) {
      console.log('🔧 TripCalculator EnhancedWeatherService: No API key available');
      return null;
    }
    
    // Since we can't access the actual key from debug info (security),
    // we'll rely on the fact that if hasKey is true, the service can provide weather data
    // For the wrapper's purposes, we'll return a placeholder that indicates the key exists
    const result = debugInfo.hasKey ? 'key-available' : null;
    console.log('🔧 TripCalculator EnhancedWeatherService returning:', result);
    return result;
  }
}
