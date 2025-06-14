
import React from 'react';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';

interface UseWeatherApiKeyProps {
  cityName?: string;
}

export const useWeatherApiKey = (cityName?: string) => {
  // STANDARDIZED: Use WeatherApiKeyManager consistently across ALL views
  const hasApiKey = React.useMemo(() => {
    const keyExists = WeatherApiKeyManager.hasApiKey();
    console.log(`🔑 STANDARDIZED: useWeatherApiKey for ${cityName || 'unknown city'}:`, {
      hasApiKey: keyExists,
      usingWeatherApiKeyManager: true,
      standardizedDetection: true,
      consistentAcrossAllViews: true
    });
    return keyExists;
  }, [cityName]);

  return { 
    hasApiKey,
    detectionMethod: 'WeatherApiKeyManager-Standardized'
  };
};
