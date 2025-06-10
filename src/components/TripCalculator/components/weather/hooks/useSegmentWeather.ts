
import React from 'react';
import { EnhancedWeatherService } from '@/components/Route66Map/services/weather/EnhancedWeatherService';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { GeocodingService } from '../../../services/GeocodingService';
import { DateNormalizationService } from '../DateNormalizationService';

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
  setRetryCount: (count: number) => void;
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
  const weatherService = EnhancedWeatherService.getInstance();

  // CRITICAL: Fetch weather data using EXACT segment date with no offset
  const fetchWeatherData = React.useCallback(async () => {
    if (!hasApiKey || !segmentDate) {
      console.log('🌤️ useSegmentWeather: Skipping fetch - no API key or segment date');
      return;
    }

    // Use exact normalized segment date
    const normalizedSegmentDate = DateNormalizationService.normalizeSegmentDate(segmentDate);
    const segmentDateString = DateNormalizationService.toDateString(normalizedSegmentDate);
    
    console.log(`🌤️ useSegmentWeather: Fetching weather for ${segmentEndCity} on EXACT date ${segmentDateString}:`, {
      segmentDate: normalizedSegmentDate.toISOString(),
      segmentDateString,
      noOffset: true,
      exactDateFetch: true
    });

    setLoading(true);
    setError(null);

    try {
      const coordinates = GeocodingService.getCoordinatesForCity(segmentEndCity);
      if (!coordinates) {
        throw new Error(`No coordinates found for ${segmentEndCity}`);
      }

      console.log(`🎯 Fetching weather with EXACT coordinates and date:`, {
        city: segmentEndCity,
        coordinates,
        exactDate: normalizedSegmentDate.toISOString(),
        exactDateString: segmentDateString
      });

      // Use exact segment date - no offset
      const weatherData = await weatherService.getWeatherForDate(
        coordinates.lat,
        coordinates.lng,
        segmentEndCity,
        normalizedSegmentDate // EXACT segment date
      );

      if (weatherData) {
        // Validate that weather data date matches segment date
        if (weatherData.dateMatchInfo) {
          const expectedDateString = DateNormalizationService.toDateString(normalizedSegmentDate);
          const { requestedDate, matchedDate, source } = weatherData.dateMatchInfo;
          
          if (requestedDate !== expectedDateString && source !== 'seasonal-estimate') {
            console.warn(`⚠️ Weather data date mismatch for ${segmentEndCity} - BUT USING SEGMENT DATE FOR DISPLAY:`, {
              segmentDate: expectedDateString,
              requestedDate,
              matchedDate,
              displayingCorrectDate: true
            });
          }
        }

        console.log(`✅ Weather data received for ${segmentEndCity} on ${segmentDateString}:`, {
          isActualForecast: weatherData.isActualForecast,
          temperature: weatherData.temperature,
          description: weatherData.description,
          segmentDateUsed: segmentDateString
        });

        setWeather(weatherData);
      } else {
        throw new Error('No weather data received');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather';
      console.error(`❌ Weather fetch error for ${segmentEndCity} on ${segmentDateString}:`, err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [hasApiKey, segmentDate, segmentEndCity, weatherService, setLoading, setError, setWeather]);

  // Auto-fetch when dependencies change
  React.useEffect(() => {
    if (hasApiKey && segmentDate && !weather && !loading) {
      console.log(`🔄 Auto-fetching weather for ${segmentEndCity} due to dependency change`);
      fetchWeatherData();
    }
  }, [hasApiKey, segmentDate, segmentEndCity, weather, loading, fetchWeatherData]);

  const handleApiKeySet = React.useCallback(() => {
    console.log(`🔑 API key set, fetching weather for ${segmentEndCity}`);
    setRetryCount(0);
    fetchWeatherData();
  }, [segmentEndCity, fetchWeatherData, setRetryCount]);

  const handleTimeout = React.useCallback(() => {
    console.log(`⏰ Weather fetch timeout for ${segmentEndCity}, incrementing retry count`);
    setRetryCount(prev => prev + 1);
    setError('Weather service timeout');
  }, [segmentEndCity, setRetryCount, setError]);

  const handleRetry = React.useCallback(() => {
    console.log(`🔄 Manual retry for ${segmentEndCity}, attempt ${retryCount + 1}`);
    setRetryCount(prev => prev + 1);
    fetchWeatherData();
  }, [segmentEndCity, retryCount, setRetryCount, fetchWeatherData]);

  return {
    handleApiKeySet,
    handleTimeout,
    handleRetry
  };
};
