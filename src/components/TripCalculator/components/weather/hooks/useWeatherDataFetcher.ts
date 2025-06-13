
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
  // 🎯 DEBUG: Log hook initialization
  console.log(`🎯 [WEATHER DEBUG] useWeatherDataFetcher initialized:`, {
    component: 'useWeatherDataFetcher',
    segmentEndCity,
    segmentDay,
    hasTripStartDate: !!tripStartDate,
    tripStartDate: tripStartDate?.toISOString(),
    hasApiKey
  });

  const weatherService = EnhancedWeatherService.getInstance();

  const fetchWeather = React.useCallback(async () => {
    console.log(`🎯 [WEATHER DEBUG] useWeatherDataFetcher.fetchWeather called for ${segmentEndCity}:`, {
      component: 'useWeatherDataFetcher -> fetchWeather',
      hasApiKey,
      hasTripStartDate: !!tripStartDate,
      hasWeatherService: !!weatherService
    });

    if (!hasApiKey || !tripStartDate || !weatherService) {
      console.log(`🎯 [WEATHER DEBUG] useWeatherDataFetcher.fetchWeather early return for ${segmentEndCity}:`, {
        component: 'useWeatherDataFetcher -> fetchWeather -> early-return',
        reason: !hasApiKey ? 'no API key' : !tripStartDate ? 'no trip start date' : 'no weather service'
      });
      return;
    }

    const segmentDate = DateNormalizationService.calculateSegmentDate(tripStartDate, segmentDay);
    if (!segmentDate) {
      console.log(`🎯 [WEATHER DEBUG] useWeatherDataFetcher.fetchWeather no segment date for ${segmentEndCity}:`, {
        component: 'useWeatherDataFetcher -> fetchWeather -> no-segment-date'
      });
      return;
    }

    console.log(`🎯 [WEATHER DEBUG] useWeatherDataFetcher.fetchWeather proceeding for ${segmentEndCity}:`, {
      component: 'useWeatherDataFetcher -> fetchWeather -> proceeding',
      segmentDate: segmentDate.toISOString(),
      segmentDay
    });

    try {
      actions.setLoading(true);
      actions.setError(null);

      // Get coordinates for the city
      const coordinates = GeocodingService.getCoordinatesForCity(segmentEndCity);
      if (!coordinates) {
        throw new Error(`No coordinates found for ${segmentEndCity}`);
      }

      console.log(`🎯 [WEATHER DEBUG] useWeatherDataFetcher.fetchWeather coordinates found for ${segmentEndCity}:`, {
        component: 'useWeatherDataFetcher -> fetchWeather -> coordinates',
        coordinates
      });

      // Use the correct method signature with 4 arguments: lat, lng, cityName, date
      console.log(`🎯 [WEATHER DEBUG] useWeatherDataFetcher.fetchWeather calling weather service for ${segmentEndCity}:`, {
        component: 'useWeatherDataFetcher -> fetchWeather -> service-call',
        lat: coordinates.lat,
        lng: coordinates.lng,
        cityName: segmentEndCity,
        date: segmentDate.toISOString()
      });

      const weatherData = await weatherService.getWeatherForDate(
        coordinates.lat,
        coordinates.lng,
        segmentEndCity,
        segmentDate
      );

      console.log(`🎯 [WEATHER DEBUG] useWeatherDataFetcher.fetchWeather service response for ${segmentEndCity}:`, {
        component: 'useWeatherDataFetcher -> fetchWeather -> service-response',
        hasWeatherData: !!weatherData,
        weatherData: weatherData ? {
          temperature: weatherData.temperature,
          description: weatherData.description,
          isActualForecast: weatherData.isActualForecast
        } : null
      });

      if (weatherData) {
        actions.setWeather(weatherData);
        console.log(`🎯 [WEATHER DEBUG] useWeatherDataFetcher.fetchWeather weather set for ${segmentEndCity}:`, {
          component: 'useWeatherDataFetcher -> fetchWeather -> weather-set-success'
        });
      } else {
        actions.setError('No weather data available');
        console.log(`🎯 [WEATHER DEBUG] useWeatherDataFetcher.fetchWeather no data for ${segmentEndCity}:`, {
          component: 'useWeatherDataFetcher -> fetchWeather -> no-data-error'
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Weather fetch failed';
      console.log(`🎯 [WEATHER DEBUG] useWeatherDataFetcher.fetchWeather error for ${segmentEndCity}:`, {
        component: 'useWeatherDataFetcher -> fetchWeather -> error',
        error: errorMessage
      });
      actions.setError(errorMessage);
    } finally {
      actions.setLoading(false);
      console.log(`🎯 [WEATHER DEBUG] useWeatherDataFetcher.fetchWeather finally for ${segmentEndCity}:`, {
        component: 'useWeatherDataFetcher -> fetchWeather -> finally'
      });
    }
  }, [hasApiKey, tripStartDate, segmentEndCity, segmentDay, weatherService, actions]);

  // Auto-fetch when conditions are met - check against a loading state we track locally
  const [isCurrentlyLoading, setIsCurrentlyLoading] = React.useState(false);

  React.useEffect(() => {
    console.log(`🎯 [WEATHER DEBUG] useWeatherDataFetcher auto-fetch effect for ${segmentEndCity}:`, {
      component: 'useWeatherDataFetcher -> auto-fetch-effect',
      hasApiKey,
      hasTripStartDate: !!tripStartDate,
      isCurrentlyLoading
    });

    if (hasApiKey && tripStartDate && !isCurrentlyLoading) {
      console.log(`🎯 [WEATHER DEBUG] useWeatherDataFetcher triggering auto-fetch for ${segmentEndCity}:`, {
        component: 'useWeatherDataFetcher -> auto-fetch-effect -> triggering'
      });

      setIsCurrentlyLoading(true);
      const timeoutId = setTimeout(() => {
        fetchWeather().finally(() => setIsCurrentlyLoading(false));
      }, 100);
      return () => {
        clearTimeout(timeoutId);
        setIsCurrentlyLoading(false);
      };
    }
  }, [hasApiKey, tripStartDate, fetchWeather, isCurrentlyLoading, segmentEndCity]);

  return { fetchWeather };
};
