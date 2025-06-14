
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
  // 🔧 PLAN: Enhanced state isolation with city+day unique key
  const stateKey = `${segmentEndCity}-day-${day}`;
  console.log(`🎯 PLAN: useSimpleWeatherState with ENHANCED ISOLATION for ${stateKey}`);

  const [weather, setWeatherState] = React.useState<ForecastWeatherData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [retryCount, setRetryCount] = React.useState(0);

  const reset = React.useCallback(() => {
    console.log(`🔄 PLAN: Resetting weather state for ${stateKey} - FULL ISOLATION`);
    setWeatherState(null);
    setLoading(false);
    setError(null);
    setRetryCount(0);
  }, [stateKey]);

  const incrementRetry = React.useCallback(() => {
    console.log(`🔄 PLAN: Incrementing retry for ${stateKey}`);
    setRetryCount(prev => prev + 1);
  }, [stateKey]);

  // 🔧 PLAN: Enhanced weather setting with isolation validation
  const setWeather = React.useCallback((newWeather: ForecastWeatherData | null) => {
    console.log(`✅ PLAN: Setting ISOLATED weather for ${stateKey}:`, {
      hasWeather: !!newWeather,
      temperature: newWeather?.temperature,
      source: newWeather?.source,
      isActualForecast: newWeather?.isActualForecast,
      cityMatch: newWeather?.cityName === segmentEndCity,
      isolationKey: stateKey
    });

    // 🔧 PLAN: Validate city match to ensure no cross-contamination
    if (newWeather && newWeather.cityName !== segmentEndCity) {
      console.warn(`⚠️ PLAN: ISOLATION BREACH DETECTED - Weather city mismatch:`, {
        expectedCity: segmentEndCity,
        receivedCity: newWeather.cityName,
        isolationKey: stateKey,
        BREACH: true
      });
    }

    setWeatherState(newWeather);
  }, [segmentEndCity, stateKey]);

  const enhancedSetLoading = React.useCallback((loading: boolean) => {
    console.log(`🔄 PLAN: Setting loading=${loading} for ISOLATED ${stateKey}`);
    setLoading(loading);
  }, [stateKey]);

  const enhancedSetError = React.useCallback((error: string | null) => {
    console.log(`❌ PLAN: Setting error for ISOLATED ${stateKey}:`, error);
    setError(error);
  }, [stateKey]);

  // 🔧 PLAN: Enhanced dependency tracking for complete isolation
  React.useEffect(() => {
    console.log(`🔄 PLAN: Dependency change for ISOLATED ${stateKey} - resetting for fresh state`);
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
