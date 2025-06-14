
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
  console.log(`🎯 PLAN: useSimpleWeatherState FIXED for ${stateKey} - preventing infinite loops`);

  const [weather, setWeatherState] = React.useState<ForecastWeatherData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [retryCount, setRetryCount] = React.useState(0);

  // CRITICAL FIX: Use useRef to track if we've initialized to prevent reset loops
  const isInitialized = React.useRef(false);

  // CRITICAL FIX: Memoize reset function to prevent infinite dependency loops
  const reset = React.useCallback(() => {
    console.log(`🔄 PLAN: Resetting weather state for ${stateKey} - CONTROLLED RESET`);
    setWeatherState(null);
    setLoading(false);
    setError(null);
    setRetryCount(0);
    isInitialized.current = true;
  }, []); // Empty deps to prevent recreation

  const incrementRetry = React.useCallback(() => {
    console.log(`🔄 PLAN: Incrementing retry for ${stateKey}`);
    setRetryCount(prev => prev + 1);
  }, [stateKey]);

  const setWeather = React.useCallback((newWeather: ForecastWeatherData | null) => {
    console.log(`✅ PLAN: Setting weather for ${stateKey}:`, {
      hasWeather: !!newWeather,
      temperature: newWeather?.temperature,
      source: newWeather?.source,
      cityMatch: newWeather?.cityName === segmentEndCity
    });

    if (newWeather && newWeather.cityName !== segmentEndCity) {
      console.warn(`⚠️ PLAN: City mismatch for ${stateKey}:`, {
        expected: segmentEndCity,
        received: newWeather.cityName
      });
    }

    setWeatherState(newWeather);
    
    if (newWeather) {
      setError(null);
    }
  }, [segmentEndCity, stateKey]);

  const enhancedSetLoading = React.useCallback((loading: boolean) => {
    console.log(`🔄 PLAN: Setting loading=${loading} for ${stateKey}`);
    setLoading(loading);
    
    if (loading) {
      setError(null);
    }
  }, [stateKey]);

  const enhancedSetError = React.useCallback((error: string | null) => {
    console.log(`❌ PLAN: Setting error for ${stateKey}:`, error);
    setError(error);
    
    if (error) {
      setLoading(false);
    }
  }, [stateKey]);

  // CRITICAL FIX: Only reset on first mount, not on every dependency change
  React.useEffect(() => {
    if (!isInitialized.current) {
      console.log(`🚀 PLAN: First initialization for ${stateKey} - single reset only`);
      reset();
    }
  }, []); // Empty deps - only run on mount

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
