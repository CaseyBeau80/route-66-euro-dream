
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

  // FIXED: Memoize the fetch function to prevent recreation on every render
  const fetchWeather = React.useCallback(async () => {
    if (!hasApiKey || !segmentDate || loading) {
      console.log('🔧 useSegmentWeather: Skipping fetch', {
        hasApiKey,
        hasSegmentDate: !!segmentDate,
        loading,
        city: segmentEndCity
      });
      return;
    }

    console.log('🚨 TRIGGERING AUTO FETCH for', segmentEndCity, `Day ${segmentDate ? Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)) + 1 : '?'}`);

    const fetchId = Math.floor(Math.random() * 1000);
    console.log('🚨 Starting weather fetch for', segmentEndCity, `Day ${segmentDate ? Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)) + 1 : '?'}`, {
      fetchId,
      tripStartDate: segmentDate.toISOString()
    });

    WeatherDebugService.logWeatherFlow(`useSegmentWeather.fetchWeather [${segmentEndCity}]`, {
      hasApiKey,
      segmentDate: segmentDate.toISOString(),
      fetchId
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
      console.error('❌ useSegmentWeather: Fetch failed for', segmentEndCity, error);
      setError(error instanceof Error ? error.message : 'Weather fetch failed');
      setLoading(false);
    }
  }, [hasApiKey, segmentDate, loading, segmentEndCity, setLoading, setError, setWeather]);

  // FIXED: Auto-fetch effect with proper dependency management
  React.useEffect(() => {
    // Only fetch if we don't have weather data and we're not currently loading
    if (hasApiKey && segmentDate && !weather && !loading) {
      fetchWeather();
    }
  }, [hasApiKey, segmentDate, weather, loading, fetchWeather]);

  // FIXED: Cleanup effect to cancel requests when component unmounts
  React.useEffect(() => {
    return () => {
      if (segmentDate) {
        WeatherFetchingService.cancelRequest(segmentEndCity, segmentDate);
      }
    };
  }, [segmentEndCity, segmentDate]);

  const handleApiKeySet = React.useCallback(() => {
    console.log('🔧 useSegmentWeather: handleApiKeySet called for', segmentEndCity);
    WeatherDebugService.logWeatherFlow(`useSegmentWeather.handleApiKeySet [${segmentEndCity}]`, {
      hasApiKey,
      segmentDate: segmentDate?.toISOString()
    });
    
    // Reset any existing error state
    setError(null);
    
    // Trigger a fresh fetch
    if (segmentDate) {
      fetchWeather();
    }
  }, [fetchWeather, segmentDate, segmentEndCity, hasApiKey, setError]);

  const handleTimeout = React.useCallback(() => {
    console.log('🚨 handleTimeout for', segmentEndCity);
    setError('Weather request timed out');
    setLoading(false);
  }, [setError, setLoading, segmentEndCity]);

  const handleRetry = React.useCallback(() => {
    console.log('🚨 handleRetry for', segmentEndCity);
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
