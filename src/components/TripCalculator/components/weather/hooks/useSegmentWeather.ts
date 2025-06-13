
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

  // PLAN: Memoize the fetch function to prevent recreation on every render
  const fetchWeather = React.useCallback(async () => {
    if (!hasApiKey || !segmentDate || loading) {
      console.log('🔧 PLAN: useSegmentWeather: Skipping fetch', {
        hasApiKey,
        hasSegmentDate: !!segmentDate,
        loading,
        city: segmentEndCity,
        planImplementation: true
      });
      return;
    }

    console.log('🚨 PLAN: TRIGGERING AUTO FETCH with 5-second timeout for', segmentEndCity, {
      segmentDate: segmentDate.toISOString(),
      daysFromNow: Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)),
      planImplementation: true
    });

    const fetchId = Math.floor(Math.random() * 1000);
    
    WeatherDebugService.logWeatherFlow(`useSegmentWeather.fetchWeather [${segmentEndCity}]`, {
      hasApiKey,
      segmentDate: segmentDate.toISOString(),
      fetchId,
      planImplementation: true
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
  }, [hasApiKey, segmentDate, loading, segmentEndCity, setLoading, setError, setWeather]);

  // PLAN: Auto-fetch effect with proper dependency management
  React.useEffect(() => {
    // Only fetch if we don't have weather data and we're not currently loading
    if (hasApiKey && segmentDate && !weather && !loading) {
      console.log('🔧 PLAN: Auto-fetch triggered for', segmentEndCity, {
        hasApiKey,
        hasSegmentDate: !!segmentDate,
        hasWeather: !!weather,
        loading,
        planImplementation: true
      });
      fetchWeather();
    }
  }, [hasApiKey, segmentDate, weather, loading, fetchWeather]);

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
      planImplementation: true
    });
    
    // Reset any existing error state
    setError(null);
    
    // Trigger a fresh fetch
    if (segmentDate) {
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
