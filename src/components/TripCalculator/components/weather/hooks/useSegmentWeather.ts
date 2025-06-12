
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherDataDebugger } from '../WeatherDataDebugger';
import { useSegmentWeatherHandlers } from './useSegmentWeatherHandlers';

interface UseSegmentWeatherProps {
  segmentEndCity: string;
  hasApiKey: boolean;
  segmentDate: Date | null;
  weather: ForecastWeatherData | null;
  setWeather: (weather: ForecastWeatherData | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  retryCount: number;
  setRetryCount: React.Dispatch<React.SetStateAction<number>>;
}

interface UseSegmentWeatherReturn {
  handleApiKeySet: () => void;
  handleTimeout: () => void;
  handleRetry: () => void;
}

export const useSegmentWeather = ({
  segmentEndCity,
  hasApiKey,
  segmentDate,
  weather,
  setWeather,
  loading,
  setLoading,
  error,
  setError,
  retryCount,
  setRetryCount
}: UseSegmentWeatherProps): UseSegmentWeatherReturn => {
  // 🚨 FORCE LOG: Hook initialization
  console.log(`🚨 FORCE LOG: useSegmentWeather hook initialized for ${segmentEndCity}`, {
    hasApiKey,
    hasSegmentDate: !!segmentDate,
    segmentDate: segmentDate?.toISOString(),
    hasWeather: !!weather,
    loading,
    error,
    retryCount,
    timestamp: new Date().toISOString()
  });

  const {
    fetchWeatherData,
    handleApiKeySet,
    handleTimeout,
    handleRetry
  } = useSegmentWeatherHandlers({
    segmentEndCity,
    segmentDate,
    retryCount,
    setRetryCount,
    setLoading,
    setError,
    setWeather
  });

  // 🚨 FORCE LOG: Weather handlers ready
  console.log(`🚨 FORCE LOG: Weather handlers ready for ${segmentEndCity}`, {
    hasFetchWeatherData: typeof fetchWeatherData === 'function',
    hasHandleApiKeySet: typeof handleApiKeySet === 'function',
    hasHandleTimeout: typeof handleTimeout === 'function',
    hasHandleRetry: typeof handleRetry === 'function',
    timestamp: new Date().toISOString()
  });

  // Auto-fetch when dependencies change with debouncing
  React.useEffect(() => {
    console.log(`🚨 FORCE LOG: useSegmentWeather auto-fetch effect triggered for ${segmentEndCity}`, {
      hasApiKey,
      hasSegmentDate: !!segmentDate,
      segmentDate: segmentDate?.toISOString(),
      hasWeather: !!weather,
      loading,
      shouldFetch: hasApiKey && segmentDate && !weather && !loading,
      trigger: 'dependency_change',
      timestamp: new Date().toISOString()
    });

    if (hasApiKey && segmentDate && !weather && !loading) {
      console.log(`🚨 FORCE LOG: *** WEATHER FETCH TRIGGERED *** for ${segmentEndCity}`, {
        reason: 'all_conditions_met',
        hasApiKey,
        hasSegmentDate: !!segmentDate,
        hasWeather: !!weather,
        loading,
        timestamp: new Date().toISOString()
      });

      WeatherDataDebugger.debugWeatherFlow(
        `useSegmentWeather.autoFetch [${segmentEndCity}]`,
        { trigger: 'dependency_change', hasApiKey, hasDate: !!segmentDate, hasWeather: !!weather, loading }
      );

      // Debounce to prevent rapid-fire requests
      const timeoutId = setTimeout(() => {
        console.log(`🚨 FORCE LOG: Executing fetchWeatherData for ${segmentEndCity} after debounce`, {
          timestamp: new Date().toISOString()
        });
        fetchWeatherData();
      }, 100);

      return () => {
        console.log(`🚨 FORCE LOG: Clearing weather fetch timeout for ${segmentEndCity}`, {
          timestamp: new Date().toISOString()
        });
        clearTimeout(timeoutId);
      };
    } else {
      console.log(`🚨 FORCE LOG: Weather fetch NOT triggered for ${segmentEndCity}`, {
        reason: 'conditions_not_met',
        hasApiKey,
        hasSegmentDate: !!segmentDate,
        hasWeather: !!weather,
        loading,
        conditionsFailed: {
          noApiKey: !hasApiKey,
          noSegmentDate: !segmentDate,
          alreadyHasWeather: !!weather,
          currentlyLoading: loading
        },
        timestamp: new Date().toISOString()
      });
    }
  }, [hasApiKey, segmentDate, segmentEndCity, weather, loading, fetchWeatherData]);

  return {
    handleApiKeySet,
    handleTimeout,
    handleRetry
  };
};
