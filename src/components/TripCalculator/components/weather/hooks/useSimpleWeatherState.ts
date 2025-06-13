
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

  // Track weather quality to prevent downgrades
  const weatherQualityRef = React.useRef<{
    isLive: boolean;
    timestamp: number;
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

  // ENHANCED setWeather with strict quality protection
  const setWeather = React.useCallback((newWeather: ForecastWeatherData | null) => {
    console.log(`🎯 [WEATHER DEBUG] useSimpleWeatherState.setWeather called for ${segmentEndCity}:`, {
      component: 'useSimpleWeatherState -> setWeather',
      hasNewWeather: !!newWeather,
      newWeatherData: newWeather ? {
        temperature: newWeather.temperature,
        description: newWeather.description,
        isActualForecast: newWeather.isActualForecast,
        source: newWeather.dateMatchInfo?.source
      } : null,
      currentWeatherQuality: weatherQualityRef.current
    });

    const now = Date.now();
    const newIsLive = newWeather?.isActualForecast === true;

    // CRITICAL GUARD: Prevent live forecast downgrades
    if (weatherQualityRef.current?.isLive && 
        newWeather && 
        !newIsLive &&
        (now - weatherQualityRef.current.timestamp) < 600000) { // 10 minutes
      console.log(`🚨 QUALITY GUARD: Blocking downgrade from live to fallback for ${segmentEndCity}:`, {
        currentIsLive: weatherQualityRef.current.isLive,
        currentAge: now - weatherQualityRef.current.timestamp,
        newIsLive,
        newSource: newWeather.dateMatchInfo?.source,
        action: 'BLOCKED'
      });
      return;
    }

    // Update weather quality tracking
    if (newWeather) {
      weatherQualityRef.current = {
        isLive: newIsLive,
        timestamp: now
      };

      console.log(`🚨 WEATHER QUALITY UPDATE for ${segmentEndCity}:`, {
        isLive: newIsLive,
        source: newWeather.dateMatchInfo?.source,
        temperature: newWeather.temperature,
        timestamp: now
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

  // Enhanced setError with debugging
  const enhancedSetError = React.useCallback((error: string | null) => {
    console.log(`🎯 [WEATHER DEBUG] useSimpleWeatherState.setError called for ${segmentEndCity}:`, {
      component: 'useSimpleWeatherState -> setError',
      error
    });
    setError(error);
  }, [segmentEndCity]);

  // Reset state when city or day changes
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
