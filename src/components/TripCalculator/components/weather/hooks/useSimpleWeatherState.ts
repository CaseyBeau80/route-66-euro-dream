
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
  // Memoize the state key to prevent unnecessary resets
  const stateKey = React.useMemo(() => `${segmentEndCity}-${day}`, [segmentEndCity, day]);
  
  const [weather, setWeatherState] = React.useState<ForecastWeatherData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [retryCount, setRetryCount] = React.useState(0);

  const reset = React.useCallback(() => {
    setWeatherState(null);
    setLoading(false);
    setError(null);
    setRetryCount(0);
  }, []);

  const incrementRetry = React.useCallback(() => {
    setRetryCount(prev => prev + 1);
  }, []);

  const setWeather = React.useCallback((newWeather: ForecastWeatherData | null) => {
    setWeatherState(newWeather);
  }, []);

  const enhancedSetLoading = React.useCallback((loading: boolean) => {
    setLoading(loading);
  }, []);

  const enhancedSetError = React.useCallback((error: string | null) => {
    setError(error);
  }, []);

  // Only reset when the state key changes, not on every render
  React.useEffect(() => {
    reset();
  }, [stateKey, reset]);

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
