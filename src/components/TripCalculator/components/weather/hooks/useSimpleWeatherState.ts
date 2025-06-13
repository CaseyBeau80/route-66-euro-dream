
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
  const [weather, setWeather] = React.useState<ForecastWeatherData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [retryCount, setRetryCount] = React.useState(0);

  const reset = React.useCallback(() => {
    setWeather(null);
    setLoading(false);
    setError(null);
    setRetryCount(0);
  }, []);

  const incrementRetry = React.useCallback(() => {
    setRetryCount(prev => prev + 1);
  }, []);

  // Reset state when city or day changes
  React.useEffect(() => {
    reset();
  }, [segmentEndCity, day, reset]);

  return {
    weather,
    loading,
    error,
    retryCount,
    setWeather,
    setLoading,
    setError,
    incrementRetry,
    reset
  };
};
