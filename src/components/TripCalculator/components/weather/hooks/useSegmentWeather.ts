
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

  // PLAN IMPLEMENTATION: Enhanced weather fetch with comprehensive logging
  const fetchWeather = React.useCallback(async () => {
    if (!hasApiKey || !segmentDate) {
      console.log('🔧 PLAN: Enhanced useSegmentWeather: Cannot fetch - missing requirements', {
        hasApiKey,
        hasSegmentDate: !!segmentDate,
        city: segmentEndCity,
        planImplementation: 'enhanced_requirements_check'
      });
      return;
    }

    // PLAN: Skip fetch if already loading to prevent duplicate requests
    if (loading) {
      console.log('🔧 PLAN: Enhanced useSegmentWeather: Skipping fetch - already loading', {
        city: segmentEndCity,
        planImplementation: 'enhanced_duplicate_prevention'
      });
      return;
    }

    console.log('🚨 PLAN: ENHANCED WEATHER FETCH TRIGGER for', segmentEndCity, {
      segmentDate: segmentDate.toISOString(),
      daysFromNow: Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)),
      retryCount,
      hasExistingWeather: !!weather,
      planImplementation: 'enhanced_fetch_trigger'
    });

    const fetchId = Math.floor(Math.random() * 1000);
    
    WeatherDebugService.logWeatherFlow(`useSegmentWeather.fetchWeather [${segmentEndCity}]`, {
      hasApiKey,
      segmentDate: segmentDate.toISOString(),
      fetchId,
      planImplementation: 'enhanced_fetch_debug'
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
      console.error('❌ PLAN: Enhanced useSegmentWeather: Fetch failed for', segmentEndCity, error);
      setError(error instanceof Error ? error.message : 'Weather fetch failed');
      setLoading(false);
    }
  }, [hasApiKey, segmentDate, loading, segmentEndCity, setLoading, setError, setWeather, retryCount, weather]);

  // PLAN IMPLEMENTATION: Enhanced auto-fetch with better conditions
  React.useEffect(() => {
    if (hasApiKey && segmentDate && !loading) {
      console.log('🔧 PLAN: Enhanced auto-fetch effect triggered for', segmentEndCity, {
        hasApiKey,
        hasSegmentDate: !!segmentDate,
        hasWeather: !!weather,
        loading,
        shouldFetch: true,
        planImplementation: 'enhanced_auto_fetch'
      });
      fetchWeather();
    }
  }, [hasApiKey, segmentDate, fetchWeather, segmentEndCity]);

  // PLAN: Enhanced cleanup effect to cancel requests when component unmounts
  React.useEffect(() => {
    return () => {
      if (segmentDate) {
        WeatherFetchingService.cancelRequest(segmentEndCity, segmentDate);
        console.log('🔧 PLAN: Enhanced cleanup - cancelled request for', segmentEndCity);
      }
    };
  }, [segmentEndCity, segmentDate]);

  const handleApiKeySet = React.useCallback(() => {
    console.log('🔧 PLAN: Enhanced useSegmentWeather: handleApiKeySet called for', segmentEndCity);
    WeatherDebugService.logWeatherFlow(`useSegmentWeather.handleApiKeySet [${segmentEndCity}]`, {
      hasApiKey,
      segmentDate: segmentDate?.toISOString(),
      planImplementation: 'enhanced_api_key_set'
    });
    
    // Reset any existing error state
    setError(null);
    
    // PLAN: Force immediate fetch when API key is set
    if (segmentDate) {
      console.log('🚨 PLAN: Enhanced forcing immediate fetch after API key set');
      fetchWeather();
    }
  }, [fetchWeather, segmentDate, segmentEndCity, hasApiKey, setError]);

  const handleTimeout = React.useCallback(() => {
    console.log('🚨 PLAN: Enhanced handleTimeout for', segmentEndCity);
    WeatherDebugService.logForecastTimeout(segmentEndCity, 5000, 'user_requested_timeout');
    setError('Weather request timed out');
    setLoading(false);
  }, [setError, setLoading, segmentEndCity]);

  const handleRetry = React.useCallback(() => {
    console.log('🚨 PLAN: Enhanced handleRetry for', segmentEndCity, {
      currentRetryCount: retryCount,
      hasWeather: !!weather,
      planImplementation: 'enhanced_retry_logic'
    });
    setError(null);
    incrementRetry();
    fetchWeather();
  }, [fetchWeather, setError, incrementRetry, segmentEndCity, retryCount, weather]);

  return {
    handleApiKeySet,
    handleTimeout,
    handleRetry
  };
};
