
import React from 'react';
import { EnhancedWeatherService } from '@/components/Route66Map/services/weather/EnhancedWeatherService';
import { DateNormalizationService } from '../DateNormalizationService';
import { SimpleWeatherActions } from './useSimpleWeatherState';
import { GeocodingService } from '../../../services/GeocodingService';

interface UseWeatherDataFetcherProps {
  segmentEndCity: string;
  segmentDay: number;
  tripStartDate: Date | null;
  hasApiKey: boolean;
  actions: SimpleWeatherActions;
}

export const useWeatherDataFetcher = ({
  segmentEndCity,
  segmentDay,
  tripStartDate,
  hasApiKey,
  actions
}: UseWeatherDataFetcherProps) => {
  const weatherService = EnhancedWeatherService.getInstance();

  const fetchWeather = React.useCallback(async () => {
    if (!hasApiKey || !tripStartDate || !weatherService) return;

    const segmentDate = DateNormalizationService.calculateSegmentDate(tripStartDate, segmentDay);
    if (!segmentDate) return;

    try {
      actions.setLoading(true);
      actions.setError(null);

      // Get coordinates for the city
      const coordinates = GeocodingService.getCoordinatesForCity(segmentEndCity);
      if (!coordinates) {
        throw new Error(`No coordinates found for ${segmentEndCity}`);
      }

      // Use the correct method signature with 4 arguments: lat, lng, cityName, date
      const weatherData = await weatherService.getWeatherForDate(
        coordinates.lat,
        coordinates.lng,
        segmentEndCity,
        segmentDate
      );

      if (weatherData) {
        actions.setWeather(weatherData);
      } else {
        actions.setError('No weather data available');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Weather fetch failed';
      actions.setError(errorMessage);
    } finally {
      actions.setLoading(false);
    }
  }, [hasApiKey, tripStartDate, segmentEndCity, segmentDay, weatherService, actions]);

  // Auto-fetch when conditions are met - check against a loading state we track locally
  const [isCurrentlyLoading, setIsCurrentlyLoading] = React.useState(false);

  React.useEffect(() => {
    if (hasApiKey && tripStartDate && !isCurrentlyLoading) {
      setIsCurrentlyLoading(true);
      const timeoutId = setTimeout(() => {
        fetchWeather().finally(() => setIsCurrentlyLoading(false));
      }, 100);
      return () => {
        clearTimeout(timeoutId);
        setIsCurrentlyLoading(false);
      };
    }
  }, [hasApiKey, tripStartDate, fetchWeather]);

  return { fetchWeather };
};
