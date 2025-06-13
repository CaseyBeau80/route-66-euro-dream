
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

  // Enhanced weather quality tracking with source validation
  const weatherQualityRef = React.useRef<{
    isLive: boolean;
    timestamp: number;
    source: string;
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

  // ENHANCED: More permissive setWeather with improved validation
  const setWeather = React.useCallback((newWeather: ForecastWeatherData | null) => {
    console.log(`🔒 [ENHANCED] setWeather called for ${segmentEndCity}:`, {
      hasNewWeather: !!newWeather,
      newSource: newWeather?.source,
      newDateMatchSource: newWeather?.dateMatchInfo?.source,
      newIsLive: newWeather?.isActualForecast,
      currentQuality: weatherQualityRef.current
    });

    const now = Date.now();
    
    if (!newWeather) {
      weatherQualityRef.current = null;
      setWeatherState(null);
      return;
    }

    // ENHANCED: More flexible live forecast detection
    const newIsLive = newWeather?.isActualForecast === true;
    const newSource = newWeather?.source || 'unknown';
    const newDateMatchSource = newWeather?.dateMatchInfo?.source || 'unknown';

    // Determine if this is a live forecast using multiple indicators
    const hasLiveIndicators = (
      newIsLive ||
      newSource === 'live_forecast' ||
      newDateMatchSource === 'live_forecast' ||
      newDateMatchSource === 'api-forecast'
    );

    console.log(`🔧 [ENHANCED] Live forecast validation for ${segmentEndCity}:`, {
      newSource,
      newDateMatchSource,
      isActualForecast: newIsLive,
      hasLiveIndicators,
      decision: hasLiveIndicators ? 'ACCEPT_AS_LIVE' : 'ACCEPT_AS_HISTORICAL'
    });

    // ENHANCED PROTECTION: Only prevent obvious downgrades
    if (weatherQualityRef.current?.isLive && newWeather && !hasLiveIndicators) {
      // Allow the update if it's been more than 5 minutes (more reasonable timeout)
      if ((now - weatherQualityRef.current.timestamp) < 300000) {
        console.log(`🚨 [BLOCKED] Recent live forecast protection for ${segmentEndCity}:`, {
          ageMinutes: Math.round((now - weatherQualityRef.current.timestamp) / 60000),
          reason: 'RECENT_LIVE_PROTECTION'
        });
        return;
      }
    }

    // Update quality tracking
    weatherQualityRef.current = {
      isLive: hasLiveIndicators,
      timestamp: now,
      source: newSource
    };

    console.log(`✅ [ENHANCED] Weather update accepted for ${segmentEndCity}:`, {
      isLive: hasLiveIndicators,
      source: newSource,
      dateMatchSource: newDateMatchSource,
      temperature: newWeather.temperature,
      protection: 'PASSED_ENHANCED_VALIDATION'
    });

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

  const enhancedSetError = React.useCallback((error: string | null) => {
    console.log(`🎯 [WEATHER DEBUG] useSimpleWeatherState.setError called for ${segmentEndCity}:`, {
      component: 'useSimpleWeatherState -> setError',
      error
    });
    setError(error);
  }, [segmentEndCity]);

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
