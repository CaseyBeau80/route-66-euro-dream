
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { useWeatherApiKey } from './useWeatherApiKey';

export interface SimpleWeatherState {
  hasApiKey: boolean;
  loading: boolean;
  weather: ForecastWeatherData | null;
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

export const useSimpleWeatherState = (
  cityName: string,
  segmentDate: Date | null,
  sectionKey: string
): SimpleWeatherState & SimpleWeatherActions => {
  const [weather, setWeather] = React.useState<ForecastWeatherData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [retryCount, setRetryCount] = React.useState(0);

  const { hasApiKey } = useWeatherApiKey(cityName);

  const incrementRetry = React.useCallback(() => {
    setRetryCount(prev => prev + 1);
  }, []);

  const reset = React.useCallback(() => {
    setWeather(null);
    setLoading(false);
    setError(null);
    setRetryCount(0);
  }, []);

  console.log(`🎯 useSimpleWeatherState for ${cityName}:`, {
    hasApiKey,
    loading,
    hasWeather: !!weather,
    error,
    retryCount,
    segmentDate: segmentDate?.toISOString(),
    sectionKey
  });

  return {
    hasApiKey,
    loading,
    weather,
    error,
    retryCount,
    setWeather,
    setLoading,
    setError,
    incrementRetry,
    reset
  };
};
