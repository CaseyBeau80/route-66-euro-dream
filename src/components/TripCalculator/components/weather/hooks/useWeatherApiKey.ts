
import React from 'react';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';

interface UseWeatherApiKeyProps {
  cityName?: string;
}

export const useWeatherApiKey = (cityName?: string) => {
  // UNIFIED: Use consistent detection across ALL views
  const hasApiKey = React.useMemo(() => {
    const keyExists = WeatherApiKeyManager.hasApiKey();
    console.log(`🔑 UNIFIED: useWeatherApiKey for ${cityName || 'unknown city'}:`, {
      hasApiKey: keyExists,
      usingUnifiedDetection: true,
      consistentAcrossAllViews: true
    });
    return keyExists;
  }, [cityName]);

  return { 
    hasApiKey,
    detectionMethod: 'WeatherApiKeyManager-Unified'
  };
};
