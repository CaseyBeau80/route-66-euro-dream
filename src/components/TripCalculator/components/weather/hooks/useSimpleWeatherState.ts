
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

  const [weather, setWeatherState] = React.useState<ForecastWeatherData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [retryCount, setRetryCount] = React.useState(0);

  const reset = React.useCallback(() => {
    console.log(`🎯 [WEATHER DEBUG] useSimpleWeatherState.reset called for ${segmentEndCity}:`, {
      component: 'useSimpleWeatherState -> reset'
    });
    setWeatherState(null);
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

  // Enhanced setWeather with guards against overwriting live forecasts
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
      currentWeatherData: weather ? {
        temperature: weather.temperature,
        description: weather.description,
        isActualForecast: weather.isActualForecast,
        source: weather.dateMatchInfo?.source
      } : null
    });

    // CRITICAL GUARD: Don't allow fallback data to overwrite live forecast
    if (weather?.isActualForecast && newWeather && !newWeather.isActualForecast) {
      console.log(`🚨 GUARD: Blocking fallback weather from overwriting live forecast for ${segmentEndCity}:`, {
        currentIsLive: weather.isActualForecast,
        newIsLive: newWeather.isActualForecast,
        currentSource: weather.dateMatchInfo?.source,
        newSource: newWeather.dateMatchInfo?.source,
        action: 'BLOCKED'
      });
      return;
    }

    // Log state transition
    if (weather && newWeather) {
      console.log(`🚨 WEATHER STATE TRANSITION for ${segmentEndCity}:`, {
        from: {
          isActualForecast: weather.isActualForecast,
          source: weather.dateMatchInfo?.source,
          temperature: weather.temperature
        },
        to: {
          isActualForecast: newWeather.isActualForecast,
          source: newWeather.dateMatchInfo?.source,
          temperature: newWeather.temperature
        },
        transition: weather.isActualForecast === newWeather.isActualForecast ? 'SAME_TYPE' : 
                   newWeather.isActualForecast ? 'UPGRADE_TO_LIVE' : 'DOWNGRADE_TO_FALLBACK'
      });
    }

    setWeatherState(newWeather);
  }, [segmentEndCity, weather]);

  // Enhanced setLoading with debugging
  const enhancedSetLoading = React.useCallback((loading: boolean) => {
    console.log(`🎯 [WEATHER DEBUG] useSimpleWeatherState.setLoading called for ${segmentEndCity}:`, {
      component: 'useSimpleWeatherState -> setLoading',
      loading,
      hasCurrentWeather: !!weather,
      currentWeatherType: weather?.isActualForecast ? 'live' : 'fallback'
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

  // 🎯 DEBUG: Log current state on every render
  console.log(`🎯 [WEATHER DEBUG] useSimpleWeatherState current state for ${segmentEndCity}:`, {
    component: 'useSimpleWeatherState -> current-state',
    state: {
      hasWeather: !!weather,
      weatherType: weather?.isActualForecast ? 'live' : 'fallback',
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
