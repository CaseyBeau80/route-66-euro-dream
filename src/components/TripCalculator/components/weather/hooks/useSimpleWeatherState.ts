
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

export interface SimpleWeatherState {
  weather: ForecastWeatherData | null;
  loading: boolean;
  error: string | null;
  retryCount: number;
}

export interface SimpleWeatherActions {
  setWeather: (weather: ForecastWeatherData | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  incrementRetry: () => void;
  reset: () => void;
}

export const useSimpleWeatherState = (segmentEndCity: string, day: number): SimpleWeatherState & SimpleWeatherActions => {
  console.log(`🎯 [WEATHER DEBUG] useSimpleWeatherState initialized:`, {
    component: 'useSimpleWeatherState',
    segmentEndCity,
    day
  });

  const [weather, setWeatherState] = React.useState<ForecastWeatherData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [retryCount, setRetryCount] = React.useState(0);

  // Enhanced weather quality tracking with source validation
  const weatherQualityRef = React.useRef<{
    isLive: boolean;
    timestamp: number;
    source: string;
  } | null>(null);

  const reset = React.useCallback(() => {
    console.log(`🎯 [WEATHER DEBUG] useSimpleWeatherState.reset called for ${segmentEndCity}:`, {
      component: 'useSimpleWeatherState -> reset'
    });
    setWeatherState(null);
    setLoading(false);
    setError(null);
    setRetryCount(0);
    weatherQualityRef.current = null;
  }, [segmentEndCity]);

  const incrementRetry = React.useCallback(() => {
    console.log(`🎯 [WEATHER DEBUG] useSimpleWeatherState.incrementRetry called for ${segmentEndCity}:`, {
      component: 'useSimpleWeatherState -> incrementRetry'
    });
    setRetryCount(prev => prev + 1);
  }, [segmentEndCity]);

  // FIXED: Enhanced setWeather with corrected protection logic
  const setWeather = React.useCallback((newWeather: ForecastWeatherData | null) => {
    console.log(`🔒 [PROTECTION] setWeather called for ${segmentEndCity}:`, {
      hasNewWeather: !!newWeather,
      newSource: newWeather?.source,
      newDateMatchSource: newWeather?.dateMatchInfo?.source,
      newIsLive: newWeather?.isActualForecast,
      currentQuality: weatherQualityRef.current
    });

    const now = Date.now();
    const newIsLive = newWeather?.isActualForecast === true;
    const newSource = newWeather?.source || 'unknown';
    const newDateMatchSource = newWeather?.dateMatchInfo?.source || 'unknown';

    // PROTECTION LAYER 1: Block any downgrade from live to non-live
    if (weatherQualityRef.current?.isLive && newWeather && !newIsLive) {
      console.log(`🚨 [BLOCKED] Preventing downgrade from live to fallback for ${segmentEndCity}:`, {
        currentIsLive: true,
        newIsLive: false,
        currentSource: weatherQualityRef.current.source,
        newSource,
        reason: 'LIVE_TO_FALLBACK_BLOCKED'
      });
      return;
    }

    // PROTECTION LAYER 2: Block if we have recent live data (within 10 minutes)
    if (weatherQualityRef.current?.isLive && 
        (now - weatherQualityRef.current.timestamp) < 600000) {
      console.log(`🚨 [BLOCKED] Recent live forecast protection for ${segmentEndCity}:`, {
        ageMinutes: Math.round((now - weatherQualityRef.current.timestamp) / 60000),
        reason: 'RECENT_LIVE_PROTECTION'
      });
      return;
    }

    // PROTECTION LAYER 3: FIXED - Enhanced source validation with proper allowedSources
    if (newWeather && newIsLive) {
      // FIXED: Updated allowedSources to include 'live_forecast' and other valid live sources
      const allowedLiveSources = ['live_forecast', 'api-forecast', 'forecast'];
      const isValidMainSource = allowedLiveSources.includes(newSource);
      const isValidDateMatchSource = allowedLiveSources.includes(newDateMatchSource);
      
      console.log(`🔧 [FIXED] Enhanced source validation for ${segmentEndCity}:`, {
        newSource,
        newDateMatchSource,
        allowedLiveSources,
        isValidMainSource,
        isValidDateMatchSource,
        isActualForecast: newIsLive
      });

      // FIXED: Accept if either source is valid OR if isActualForecast is explicitly true
      if (!isValidMainSource && !isValidDateMatchSource) {
        console.log(`🚨 [BLOCKED] Invalid source for live forecast for ${segmentEndCity}:`, {
          mainSource: newSource,
          dateMatchSource: newDateMatchSource,
          allowedSources: allowedLiveSources,
          reason: 'INVALID_LIVE_SOURCE'
        });
        
        // FIXED: Add defensive fallback - if isActualForecast is true, allow it anyway
        if (newWeather.isActualForecast === true) {
          console.log(`✅ [OVERRIDE] Allowing live forecast despite source mismatch due to isActualForecast=true for ${segmentEndCity}`);
        } else {
          return;
        }
      }
    }

    // Update quality tracking
    if (newWeather) {
      weatherQualityRef.current = {
        isLive: newIsLive,
        timestamp: now,
        source: newSource
      };

      console.log(`✅ [ACCEPTED] Weather update for ${segmentEndCity}:`, {
        isLive: newIsLive,
        source: newSource,
        dateMatchSource: newDateMatchSource,
        temperature: newWeather.temperature,
        protection: 'PASSED_ALL_LAYERS'
      });
    } else {
      weatherQualityRef.current = null;
    }

    setWeatherState(newWeather);
  }, [segmentEndCity]);

  // Enhanced setLoading with debugging
  const enhancedSetLoading = React.useCallback((loading: boolean) => {
    console.log(`🎯 [WEATHER DEBUG] useSimpleWeatherState.setLoading called for ${segmentEndCity}:`, {
      component: 'useSimpleWeatherState -> setLoading',
      loading,
      hasCurrentWeather: !!weather,
      currentWeatherQuality: weatherQualityRef.current
    });
    setLoading(loading);
  }, [segmentEndCity, weather]);

  const enhancedSetError = React.useCallback((error: string | null) => {
    console.log(`🎯 [WEATHER DEBUG] useSimpleWeatherState.setError called for ${segmentEndCity}:`, {
      component: 'useSimpleWeatherState -> setError',
      error
    });
    setError(error);
  }, [segmentEndCity]);

  React.useEffect(() => {
    console.log(`🎯 [WEATHER DEBUG] useSimpleWeatherState dependency change for ${segmentEndCity}:`, {
      component: 'useSimpleWeatherState -> dependency-effect',
      day,
      action: 'calling reset'
    });
    reset();
  }, [segmentEndCity, day, reset]);

  console.log(`🎯 [WEATHER DEBUG] useSimpleWeatherState current state for ${segmentEndCity}:`, {
    component: 'useSimpleWeatherState -> current-state',
    state: {
      hasWeather: !!weather,
      weatherQuality: weatherQualityRef.current,
      loading,
      error,
      retryCount
    }
  });

  return {
    weather,
    loading,
    error,
    retryCount,
    setWeather,
    setLoading: enhancedSetLoading,
    setError: enhancedSetError,
    incrementRetry,
    reset
  };
};
