
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { useWeatherFetchLogic } from './useWeatherFetchLogic';

interface UseWeatherDataFetcherProps {
  segmentEndCity: string;
  segmentDay: number;
  tripStartDate: Date | null;
  hasApiKey: boolean;
  actions: {
    setWeather: (weather: ForecastWeatherData | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    retryCount: number;
    incrementRetry: () => void;
    reset: () => void;
  };
}

export const useWeatherDataFetcher = ({
  segmentEndCity,
  segmentDay,
  tripStartDate,
  hasApiKey,
  actions
}: UseWeatherDataFetcherProps) => {
  
  const { fetchWeatherData } = useWeatherFetchLogic();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const fetchWeather = React.useCallback(async () => {
    if (!tripStartDate || !hasApiKey || isProcessing) {
      return;
    }

    setIsProcessing(true);
    
    try {
      await fetchWeatherData(
        { segmentEndCity, segmentDay, tripStartDate, hasApiKey },
        actions
      );
    } finally {
      setIsProcessing(false);
    }
  }, [
    segmentEndCity,
    segmentDay,
    tripStartDate,
    hasApiKey,
    actions,
    fetchWeatherData,
    isProcessing
  ]);

  // Throttled auto-fetch to prevent rapid re-fetching
  React.useEffect(() => {
    if (!hasApiKey || !tripStartDate || isProcessing) {
      return;
    }

    const timeoutId = setTimeout(() => {
      fetchWeather();
    }, 500); // Increased delay to prevent rapid firing

    return () => clearTimeout(timeoutId);
  }, [hasApiKey, tripStartDate, actions.retryCount]); // Removed fetchWeather from deps to prevent loops

  return {
    fetchWeather,
    handleApiKeySet: React.useCallback(() => {
      if (tripStartDate && !isProcessing) {
        fetchWeather();
      }
    }, [fetchWeather, tripStartDate, isProcessing]),
    handleTimeout: React.useCallback(() => {
      actions.setError('Weather request timed out');
      actions.setLoading(false);
    }, [actions]),
    handleRetry: React.useCallback(() => {
      actions.incrementRetry();
      fetchWeather();
    }, [fetchWeather, actions])
  };
};
