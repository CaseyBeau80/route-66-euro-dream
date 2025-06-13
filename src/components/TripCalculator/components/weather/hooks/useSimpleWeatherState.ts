
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
  console.log(`🎯 SIMPLIFIED: useSimpleWeatherState for ${segmentEndCity} Day ${day}`);

  const [weather, setWeatherState] = React.useState<ForecastWeatherData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [retryCount, setRetryCount] = React.useState(0);

  const reset = React.useCallback(() => {
    console.log(`🔄 SIMPLIFIED: Resetting weather state for ${segmentEndCity}`);
    setWeatherState(null);
    setLoading(false);
    setError(null);
    setRetryCount(0);
  }, [segmentEndCity]);

  const incrementRetry = React.useCallback(() => {
    console.log(`🔄 SIMPLIFIED: Incrementing retry for ${segmentEndCity}`);
    setRetryCount(prev => prev + 1);
  }, [segmentEndCity]);

  // SIMPLIFIED: Accept any weather data without complex validation
  const setWeather = React.useCallback((newWeather: ForecastWeatherData | null) => {
    console.log(`✅ SIMPLIFIED: Setting weather for ${segmentEndCity}:`, {
      hasWeather: !!newWeather,
      temperature: newWeather?.temperature,
      source: newWeather?.source,
      isActualForecast: newWeather?.isActualForecast
    });

    setWeatherState(newWeather);
  }, [segmentEndCity]);

  const enhancedSetLoading = React.useCallback((loading: boolean) => {
    console.log(`🔄 SIMPLIFIED: Setting loading=${loading} for ${segmentEndCity}`);
    setLoading(loading);
  }, [segmentEndCity]);

  const enhancedSetError = React.useCallback((error: string | null) => {
    console.log(`❌ SIMPLIFIED: Setting error for ${segmentEndCity}:`, error);
    setError(error);
  }, [segmentEndCity]);

  // Reset when city or day changes
  React.useEffect(() => {
    console.log(`🔄 SIMPLIFIED: Dependency change for ${segmentEndCity} Day ${day} - resetting`);
    reset();
  }, [segmentEndCity, day, reset]);

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
