
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
  const stateKey = `${segmentEndCity}-day-${day}`;
  console.log(`🎯 SIMPLIFIED: useSimpleWeatherState for ${stateKey} - no loops`);

  const [weather, setWeatherState] = React.useState<ForecastWeatherData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [retryCount, setRetryCount] = React.useState(0);

  // CRITICAL FIX: All callbacks are now completely stable with empty dependencies
  const setWeather = React.useCallback((newWeather: ForecastWeatherData | null) => {
    console.log(`✅ SIMPLIFIED: Setting weather for ${stateKey}:`, !!newWeather);
    setWeatherState(newWeather);
    if (newWeather) {
      setError(null);
    }
  }, []); // Empty deps - completely stable

  const enhancedSetLoading = React.useCallback((loading: boolean) => {
    console.log(`🔄 SIMPLIFIED: Setting loading=${loading} for ${stateKey}`);
    setLoading(loading);
    if (loading) {
      setError(null);
    }
  }, []); // Empty deps - completely stable

  const enhancedSetError = React.useCallback((error: string | null) => {
    console.log(`❌ SIMPLIFIED: Setting error for ${stateKey}:`, error);
    setError(error);
    if (error) {
      setLoading(false);
    }
  }, []); // Empty deps - completely stable

  const incrementRetry = React.useCallback(() => {
    console.log(`🔄 SIMPLIFIED: Incrementing retry for ${stateKey}`);
    setRetryCount(prev => prev + 1);
  }, []); // Empty deps - completely stable

  const reset = React.useCallback(() => {
    console.log(`🔄 SIMPLIFIED: Resetting weather state for ${stateKey}`);
    setWeatherState(null);
    setLoading(false);
    setError(null);
    setRetryCount(0);
  }, []); // Empty deps - completely stable

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
