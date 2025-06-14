
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherFetchingService } from '../services/WeatherFetchingService';
import { WeatherDebugService } from '../services/WeatherDebugService';

interface UseSegmentWeatherProps {
  segmentEndCity: string;
  hasApiKey: boolean;
  segmentDate: Date | null;
  weather: ForecastWeatherData | null;
  loading: boolean;
  error: string | null;
  retryCount: number;
  setWeather: (weather: ForecastWeatherData | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setRetryCount: () => void; // This is actually incrementRetry
}

export const useSegmentWeather = (props: UseSegmentWeatherProps) => {
  const {
    segmentEndCity,
    hasApiKey,
    segmentDate,
    weather,
    loading,
    error,
    retryCount,
    setWeather,
    setLoading,
    setError,
    setRetryCount: incrementRetry
  } = props;

  // PLAN IMPLEMENTATION: Force weather fetch with aggressive retry logic
  const fetchWeather = React.useCallback(async () => {
    if (!hasApiKey || !segmentDate) {
      console.log('🔧 PLAN: useSegmentWeather: Cannot fetch - missing requirements', {
        hasApiKey,
        hasSegmentDate: !!segmentDate,
        city: segmentEndCity,
        planImplementation: 'force_weather_fetch'
      });
      return;
    }

    // PLAN: Skip fetch if already loading to prevent duplicate requests
    if (loading) {
      console.log('🔧 PLAN: useSegmentWeather: Skipping fetch - already loading', {
        city: segmentEndCity,
        planImplementation: 'prevent_duplicate_fetch'
      });
      return;
    }

    console.log('🚨 PLAN: FORCE TRIGGERING WEATHER FETCH for', segmentEndCity, {
      segmentDate: segmentDate.toISOString(),
      daysFromNow: Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)),
      retryCount,
      planImplementation: 'aggressive_weather_fetch'
    });

    const fetchId = Math.floor(Math.random() * 1000);
    
    WeatherDebugService.logWeatherFlow(`useSegmentWeather.fetchWeather [${segmentEndCity}]`, {
      hasApiKey,
      segmentDate: segmentDate.toISOString(),
      fetchId,
      planImplementation: 'force_fetch'
    });

    try {
      await WeatherFetchingService.fetchWeatherForSegment(
        segmentEndCity,
        segmentDate,
        setLoading,
        setError,
        setWeather
      );
    } catch (error) {
      console.error('❌ PLAN: useSegmentWeather: Fetch failed for', segmentEndCity, error);
      setError(error instanceof Error ? error.message : 'Weather fetch failed');
      setLoading(false);
    }
  }, [hasApiKey, segmentDate, loading, segmentEndCity, setLoading, setError, setWeather, retryCount]);

  // PLAN IMPLEMENTATION: Aggressive auto-fetch effect - fetch even if we have weather data but it's stale
  React.useEffect(() => {
    if (hasApiKey && segmentDate && !loading) {
      // PLAN: Always try to fetch if we have API key and date, regardless of existing weather
      console.log('🔧 PLAN: Aggressive auto-fetch triggered for', segmentEndCity, {
        hasApiKey,
        hasSegmentDate: !!segmentDate,
        hasWeather: !!weather,
        loading,
        planImplementation: 'aggressive_auto_fetch'
      });
      fetchWeather();
    }
  }, [hasApiKey, segmentDate, fetchWeather, segmentEndCity]);

  // PLAN: Cleanup effect to cancel requests when component unmounts
  React.useEffect(() => {
    return () => {
      if (segmentDate) {
        WeatherFetchingService.cancelRequest(segmentEndCity, segmentDate);
        console.log('🔧 PLAN: Cleanup - cancelled request for', segmentEndCity);
      }
    };
  }, [segmentEndCity, segmentDate]);

  const handleApiKeySet = React.useCallback(() => {
    console.log('🔧 PLAN: useSegmentWeather: handleApiKeySet called for', segmentEndCity);
    WeatherDebugService.logWeatherFlow(`useSegmentWeather.handleApiKeySet [${segmentEndCity}]`, {
      hasApiKey,
      segmentDate: segmentDate?.toISOString(),
      planImplementation: 'api_key_set_handler'
    });
    
    // Reset any existing error state
    setError(null);
    
    // PLAN: Force immediate fetch when API key is set
    if (segmentDate) {
      console.log('🚨 PLAN: Forcing immediate fetch after API key set');
      fetchWeather();
    }
  }, [fetchWeather, segmentDate, segmentEndCity, hasApiKey, setError]);

  const handleTimeout = React.useCallback(() => {
    console.log('🚨 PLAN: handleTimeout for', segmentEndCity);
    WeatherDebugService.logForecastTimeout(segmentEndCity, 5000, 'user_requested_timeout');
    setError('Weather request timed out');
    setLoading(false);
  }, [setError, setLoading, segmentEndCity]);

  const handleRetry = React.useCallback(() => {
    console.log('🚨 PLAN: handleRetry for', segmentEndCity);
    setError(null);
    incrementRetry();
    fetchWeather();
  }, [fetchWeather, setError, incrementRetry, segmentEndCity]);

  return {
    handleApiKeySet,
    handleTimeout,
    handleRetry
  };
};
