
import { useEffect, useCallback } from 'react';
import { getWeatherDataForTripDate } from '../getWeatherDataForTripDate';
import { GeocodingService } from '../../../services/GeocodingService';
import WeatherRequestDeduplicationService from '../services/WeatherRequestDeduplicationService';

interface UseSegmentWeatherProps {
  segmentEndCity: string;
  hasApiKey: boolean;
  weather: any;
  setWeather: (weather: any) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  retryCount: number;
  setRetryCount: (count: number | ((prev: number) => number)) => void;
  mountedRef: React.MutableRefObject<boolean>;
  subscriberId: React.MutableRefObject<string>;
  segmentDate?: Date | null;
}

export const useSegmentWeather = ({
  segmentEndCity,
  hasApiKey,
  weather,
  setWeather,
  loading,
  setLoading,
  error,
  setError,
  retryCount,
  setRetryCount,
  mountedRef,
  subscriberId,
  segmentDate
}: UseSegmentWeatherProps) => {
  const deduplicationService = WeatherRequestDeduplicationService.getInstance();

  const handleApiKeySet = useCallback(() => {
    console.log('🔑 API key set, clearing error and retry count');
    setError(null);
    setRetryCount(0);
  }, [setError, setRetryCount]);

  const handleRetry = useCallback(() => {
    console.log(`🔄 Retry requested for ${segmentEndCity}`);
    setRetryCount(prev => prev + 1);
    setError(null);
  }, [segmentEndCity, setRetryCount, setError]);

  const handleTimeout = useCallback(() => {
    console.log(`⏰ Timeout for ${segmentEndCity}`);
    setLoading(false);
    setError('Request timeout - please check your connection');
  }, [segmentEndCity, setLoading, setError]);
  
  const fetchWeather = useCallback(async () => {
    if (!hasApiKey) {
      console.log(`🌤️ No API key for ${segmentEndCity}, skipping fetch`);
      return;
    }
    
    const coordinates = GeocodingService.getCoordinatesForCity(segmentEndCity);
    if (!coordinates) {
      console.warn(`🌤️ No coordinates for ${segmentEndCity}`);
      setError(`No coordinates found for ${segmentEndCity}`);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const requestKey = segmentDate 
        ? `weather-forecast-${coordinates.lat}-${coordinates.lng}-${segmentDate.toISOString().split('T')[0]}`
        : `weather-${coordinates.lat}-${coordinates.lng}`;
      
      console.log(`🌤️ Starting weather fetch for ${segmentEndCity} with key: ${requestKey}`);
      
      const weatherData = await deduplicationService.deduplicateRequest(
        requestKey,
        () => {
          if (segmentDate) {
            // Use the centralized weather utility that handles historical vs forecast
            console.log(`🌤️ Using getWeatherDataForTripDate for ${segmentEndCity} on ${segmentDate.toDateString()}`);
            return getWeatherDataForTripDate(segmentEndCity, segmentDate, coordinates);
          } else {
            // For current weather, fall back to the original approach
            return getWeatherDataForTripDate(segmentEndCity, new Date(), coordinates);
          }
        },
        subscriberId.current,
        10000
      );
      
      if (weatherData && mountedRef.current) {
        console.log(`✅ Weather data received for ${segmentEndCity}:`, {
          isActualForecast: weatherData.isActualForecast,
          source: weatherData.source,
          lowTemp: weatherData.lowTemp,
          highTemp: weatherData.highTemp,
          hasHistoricalData: !!(weatherData.lowTemp && weatherData.highTemp)
        });
        setWeather(weatherData);
        setRetryCount(0);
      } else if (mountedRef.current) {
        console.warn(`❌ No weather data for ${segmentEndCity}`);
        setError('Unable to fetch weather data');
      }
    } catch (err) {
      if (mountedRef.current) {
        console.error(`❌ Weather fetch error for ${segmentEndCity}:`, err);
        const errorMessage = err instanceof Error ? err.message : 'Weather service error';
        setError(errorMessage);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [segmentEndCity, hasApiKey, segmentDate, setLoading, setError, setWeather, setRetryCount, mountedRef, subscriberId, deduplicationService]);

  useEffect(() => {
    mountedRef.current = true;
    if (hasApiKey) {
      fetchWeather();
    }
    
    return () => {
      mountedRef.current = false;
    };
  }, [fetchWeather, hasApiKey, retryCount]);

  return {
    handleApiKeySet,
    handleRetry,
    handleTimeout
  };
};
