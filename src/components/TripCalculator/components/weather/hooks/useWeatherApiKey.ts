
import React from 'react';
import { EnhancedWeatherService } from '@/components/Route66Map/services/weather/EnhancedWeatherService';
import { WeatherDebugService } from '../services/WeatherDebugService';

export const useWeatherApiKey = (cityName: string) => {
  const [hasApiKey, setHasApiKey] = React.useState(false);
  const weatherService = EnhancedWeatherService.getInstance();

  React.useEffect(() => {
    if (!weatherService) {
      WeatherDebugService.logWeatherFlow(`useWeatherApiKey.error [${cityName}]`, {
        error: 'WeatherService is null'
      });
      return;
    }

    try {
      weatherService.refreshApiKey();
      const apiKeyStatus = weatherService.hasApiKey();
      
      WeatherDebugService.logWeatherFlow(`useWeatherApiKey.check [${cityName}]`, {
        hasApiKey: apiKeyStatus,
        environmentCheck: !!import.meta.env.VITE_OPENWEATHER_API_KEY
      });
      
      setHasApiKey(apiKeyStatus);
    } catch (error) {
      WeatherDebugService.logWeatherFlow(`useWeatherApiKey.error [${cityName}]`, {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      setHasApiKey(false);
    }
  }, [weatherService, cityName]);

  const refreshApiKey = React.useCallback(() => {
    WeatherDebugService.logWeatherFlow(`useWeatherApiKey.refresh [${cityName}]`, {
      previousStatus: hasApiKey
    });
    
    weatherService.refreshApiKey();
    setHasApiKey(weatherService.hasApiKey());
  }, [weatherService, cityName, hasApiKey]);

  return { hasApiKey, refreshApiKey };
};
