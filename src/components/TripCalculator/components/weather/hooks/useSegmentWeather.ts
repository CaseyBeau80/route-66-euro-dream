
import React from 'react';
import { EnhancedWeatherService } from '@/components/Route66Map/services/weather/EnhancedWeatherService';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { GeocodingService } from '../../../services/GeocodingService';
import { DateNormalizationService } from '../DateNormalizationService';
import { WeatherDataDebugger } from '../WeatherDataDebugger';

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
  const weatherService = EnhancedWeatherService.getInstance();

  // Validate weather data quality
  const validateWeatherData = React.useCallback((data: ForecastWeatherData, city: string, dateString: string): boolean => {
    const validationResult = {
      hasTemperature: !!(data.temperature || data.highTemp || data.lowTemp),
      hasDescription: !!data.description,
      hasValidDateMatch: !!data.dateMatchInfo,
      isActualForecast: data.isActualForecast
    };

    const isValid = validationResult.hasTemperature && validationResult.hasDescription;
    
    WeatherDataDebugger.debugWeatherFlow(
      `useSegmentWeather.validateWeatherData [${city}]`,
      { dateString, validationResult, isValid }
    );

    return isValid;
  }, []);

  // Enhanced weather data fetching with comprehensive debugging
  const fetchWeatherData = React.useCallback(async () => {
    if (!hasApiKey || !segmentDate) {
      WeatherDataDebugger.debugWeatherFlow(
        `useSegmentWeather.fetchWeatherData.skip [${segmentEndCity}]`,
        { hasApiKey, hasSegmentDate: !!segmentDate, reason: 'missing_requirements' }
      );
      return;
    }

    // Use exact normalized segment date
    const normalizedSegmentDate = DateNormalizationService.normalizeSegmentDate(segmentDate);
    const segmentDateString = DateNormalizationService.toDateString(normalizedSegmentDate);
    
    WeatherDataDebugger.debugWeatherFlow(
      `useSegmentWeather.fetchWeatherData.start [${segmentEndCity}]`,
      {
        originalDate: segmentDate.toISOString(),
        normalizedDate: normalizedSegmentDate.toISOString(),
        segmentDateString,
        daysFromNow: Math.ceil((normalizedSegmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
      }
    );

    setLoading(true);
    setError(null);

    try {
      const coordinates = GeocodingService.getCoordinatesForCity(segmentEndCity);
      if (!coordinates) {
        throw new Error(`No coordinates found for ${segmentEndCity}`);
      }

      WeatherDataDebugger.debugWeatherFlow(
        `useSegmentWeather.fetchWeatherData.coordinates [${segmentEndCity}]`,
        { coordinates, segmentDateString }
      );

      // Fetch weather with enhanced error handling and timeout
      const weatherPromise = weatherService.getWeatherForDate(
        coordinates.lat,
        coordinates.lng,
        segmentEndCity,
        normalizedSegmentDate
      );

      const timeoutPromise = new Promise<ForecastWeatherData | null>((_, reject) => {
        setTimeout(() => reject(new Error('Weather fetch timeout')), 10000);
      });

      const weatherData = await Promise.race([weatherPromise, timeoutPromise]);

      if (weatherData) {
        // Enhanced validation with detailed logging
        const isValidData = validateWeatherData(weatherData, segmentEndCity, segmentDateString);
        
        if (isValidData) {
          WeatherDataDebugger.debugWeatherFlow(
            `useSegmentWeather.fetchWeatherData.success [${segmentEndCity}]`,
            {
              isActualForecast: weatherData.isActualForecast,
              temperature: weatherData.temperature,
              highTemp: weatherData.highTemp,
              lowTemp: weatherData.lowTemp,
              description: weatherData.description,
              dateMatchInfo: weatherData.dateMatchInfo
            }
          );

          setWeather(weatherData);
        } else {
          throw new Error('Invalid weather data received');
        }
      } else {
        throw new Error('No weather data received from service');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather';
      
      WeatherDataDebugger.debugWeatherFlow(
        `useSegmentWeather.fetchWeatherData.error [${segmentEndCity}]`,
        { error: errorMessage, retryCount }
      );
      
      console.error(`❌ Weather fetch error for ${segmentEndCity} on ${segmentDateString}:`, err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [hasApiKey, segmentDate, segmentEndCity, weatherService, setLoading, setError, setWeather, retryCount, validateWeatherData]);

  // Auto-fetch when dependencies change with debouncing
  React.useEffect(() => {
    if (hasApiKey && segmentDate && !weather && !loading) {
      WeatherDataDebugger.debugWeatherFlow(
        `useSegmentWeather.autoFetch [${segmentEndCity}]`,
        { trigger: 'dependency_change', hasApiKey, hasDate: !!segmentDate, hasWeather: !!weather, loading }
      );

      // Debounce to prevent rapid-fire requests
      const timeoutId = setTimeout(() => {
        fetchWeatherData();
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [hasApiKey, segmentDate, segmentEndCity, weather, loading, fetchWeatherData]);

  const handleApiKeySet = React.useCallback(() => {
    WeatherDataDebugger.debugWeatherFlow(
      `useSegmentWeather.handleApiKeySet [${segmentEndCity}]`,
      { previousRetryCount: retryCount }
    );
    
    setRetryCount(0);
    fetchWeatherData();
  }, [segmentEndCity, fetchWeatherData, setRetryCount]);

  const handleTimeout = React.useCallback(() => {
    WeatherDataDebugger.debugWeatherFlow(
      `useSegmentWeather.handleTimeout [${segmentEndCity}]`,
      { currentRetryCount: retryCount }
    );
    
    setRetryCount(prev => prev + 1);
    setError('Weather service timeout - please try again');
  }, [segmentEndCity, setRetryCount, setError, retryCount]);

  const handleRetry = React.useCallback(() => {
    WeatherDataDebugger.debugWeatherFlow(
      `useSegmentWeather.handleRetry [${segmentEndCity}]`,
      { currentRetryCount: retryCount, newRetryCount: retryCount + 1 }
    );
    
    setRetryCount(prev => prev + 1);
    fetchWeatherData();
  }, [segmentEndCity, retryCount, setRetryCount, fetchWeatherData]);

  return {
    handleApiKeySet,
    handleTimeout,
    handleRetry
  };
};
