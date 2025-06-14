
import React from 'react';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';

interface UseWeatherApiKeyProps {
  cityName?: string;
}

export const useWeatherApiKey = (cityName?: string) => {
  // FIXED: Use EXACT same detection as preview mode - no localStorage watching needed
  const hasApiKey = React.useMemo(() => {
    const keyExists = WeatherApiKeyManager.hasApiKey();
    console.log(`🔑 FIXED: useWeatherApiKey for ${cityName || 'unknown city'}:`, {
      hasApiKey: keyExists,
      usingWeatherApiKeyManager: true,
      sameAsPreviewMode: true
    });
    return keyExists;
  }, [cityName]); // Only depend on cityName, not localStorage changes

  return { 
    hasApiKey,
    // For debugging - show which detection method we're using
    detectionMethod: 'WeatherApiKeyManager'
  };
};
