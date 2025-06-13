
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
  // 🎯 DEBUG: Log hook initialization
  console.log(`🎯 [WEATHER DEBUG] useSimpleWeatherState initialized:`, {
    component: 'useSimpleWeatherState',
    segmentEndCity,
    day
  });

  const [weather, setWeather] = React.useState<ForecastWeatherData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [retryCount, setRetryCount] = React.useState(0);

  const reset = React.useCallback(() => {
    console.log(`🎯 [WEATHER DEBUG] useSimpleWeatherState.reset called for ${segmentEndCity}:`, {
      component: 'useSimpleWeatherState -> reset'
    });
    setWeather(null);
    setLoading(false);
    setError(null);
    setRetryCount(0);
  }, [segmentEndCity]);

  const incrementRetry = React.useCallback(() => {
    console.log(`🎯 [WEATHER DEBUG] useSimpleWeatherState.incrementRetry called for ${segmentEndCity}:`, {
      component: 'useSimpleWeatherState -> incrementRetry'
    });
    setRetryCount(prev => prev + 1);
  }, [segmentEndCity]);

  // Enhanced setWeather with debugging
  const enhancedSetWeather = React.useCallback((weather: ForecastWeatherData | null) => {
    console.log(`🎯 [WEATHER DEBUG] useSimpleWeatherState.setWeather called for ${segmentEndCity}:`, {
      component: 'useSimpleWeatherState -> setWeather',
      hasWeather: !!weather,
      weatherData: weather ? {
        temperature: weather.temperature,
        description: weather.description,
        isActualForecast: weather.isActualForecast
      } : null
    });
    setWeather(weather);
  }, [segmentEndCity]);

  // Enhanced setLoading with debugging
  const enhancedSetLoading = React.useCallback((loading: boolean) => {
    console.log(`🎯 [WEATHER DEBUG] useSimpleWeatherState.setLoading called for ${segmentEndCity}:`, {
      component: 'useSimpleWeatherState -> setLoading',
      loading
    });
    setLoading(loading);
  }, [segmentEndCity]);

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

  // 🎯 DEBUG: Log current state on every render
  console.log(`🎯 [WEATHER DEBUG] useSimpleWeatherState current state for ${segmentEndCity}:`, {
    component: 'useSimpleWeatherState -> current-state',
    state: {
      hasWeather: !!weather,
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
    setWeather: enhancedSetWeather,
    setLoading: enhancedSetLoading,
    setError: enhancedSetError,
    incrementRetry,
    reset
  };
};
