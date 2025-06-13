
import React from 'react';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';
import { EnhancedWeatherService } from '@/components/Route66Map/services/weather/EnhancedWeatherService';
import { WeatherDebugService } from '../services/WeatherDebugService';

export const useWeatherApiKey = (cityName: string) => {
  const [hasApiKey, setHasApiKey] = React.useState(false);
  const weatherService = EnhancedWeatherService.getInstance();

  React.useEffect(() => {
    console.log(`🔑 [PLAN FIX] useWeatherApiKey checking API key for ${cityName}`);
    
    try {
      // FIXED: Use WeatherApiKeyManager directly - same logic as ShareWeatherConfigService
      const managerHasKey = WeatherApiKeyManager.hasApiKey();
      const managerDebugInfo = WeatherApiKeyManager.getDebugInfo();
      
      console.log(`🔑 [PLAN FIX] WeatherApiKeyManager detection for ${cityName}:`, {
        hasKey: managerHasKey,
        debugInfo: managerDebugInfo,
        keyLength: managerDebugInfo.keyLength,
        isValid: managerDebugInfo.isValid
      });

      // Also check the weather service for comparison
      let serviceHasKey = false;
      if (weatherService) {
        try {
          weatherService.refreshApiKey();
          serviceHasKey = weatherService.hasApiKey();
        } catch (error) {
          console.warn(`🔑 [PLAN FIX] Error checking weather service API key:`, error);
        }
      }

      console.log(`🔑 [PLAN FIX] API key comparison for ${cityName}:`, {
        managerHasKey,
        serviceHasKey,
        usingManagerResult: managerHasKey
      });

      WeatherDebugService.logWeatherFlow(`useWeatherApiKey.fixed-check [${cityName}]`, {
        managerHasKey,
        serviceHasKey,
        finalDecision: managerHasKey,
        debugInfo: managerDebugInfo
      });
      
      // Use the WeatherApiKeyManager result as it's proven to work correctly
      setHasApiKey(managerHasKey);
      
      if (managerHasKey) {
        console.log(`✅ [PLAN FIX] API key confirmed available for ${cityName}`);
      } else {
        console.log(`❌ [PLAN FIX] No API key detected for ${cityName}`);
      }
    } catch (error) {
      console.error(`🔑 [PLAN FIX] Error during API key detection for ${cityName}:`, error);
      WeatherDebugService.logWeatherFlow(`useWeatherApiKey.error [${cityName}]`, {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      setHasApiKey(false);
    }
  }, [weatherService, cityName]);

  const refreshApiKey = React.useCallback(() => {
    console.log(`🔑 [PLAN FIX] refreshApiKey called for ${cityName}`);
    
    WeatherDebugService.logWeatherFlow(`useWeatherApiKey.refresh [${cityName}]`, {
      previousStatus: hasApiKey
    });
    
    // Refresh both services to ensure consistency
    if (weatherService) {
      weatherService.refreshApiKey();
    }
    
    // Use WeatherApiKeyManager for the actual check
    const newHasApiKey = WeatherApiKeyManager.hasApiKey();
    
    console.log(`🔑 [PLAN FIX] refreshApiKey result for ${cityName}:`, {
      previousStatus: hasApiKey,
      newStatus: newHasApiKey
    });
    
    setHasApiKey(newHasApiKey);
  }, [weatherService, cityName, hasApiKey]);

  return { hasApiKey, refreshApiKey };
};
