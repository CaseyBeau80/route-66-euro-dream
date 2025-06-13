
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { getWeatherDataForTripDate } from '../getWeatherDataForTripDate';
import { DateNormalizationService } from '../DateNormalizationService';
import { WeatherDataNormalizer } from '../services/WeatherDataNormalizer';

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
  };
}

export const useWeatherDataFetcher = ({
  segmentEndCity,
  segmentDay,
  tripStartDate,
  hasApiKey,
  actions
}: UseWeatherDataFetcherProps) => {
  
  console.log(`🎯 [WEATHER DEBUG] useWeatherDataFetcher initialized:`, {
    component: 'useWeatherDataFetcher',
    segmentEndCity,
    segmentDay,
    hasTripStartDate: !!tripStartDate,
    tripStartDate: tripStartDate?.toISOString(),
    hasApiKey
  });

  const fetchWeather = React.useCallback(async () => {
    if (!tripStartDate || !hasApiKey) {
      console.log(`🎯 [WEATHER DEBUG] useWeatherDataFetcher fetchWeather skipped:`, {
        component: 'useWeatherDataFetcher -> fetchWeather-skipped',
        segmentEndCity,
        reason: !tripStartDate ? 'no tripStartDate' : 'no apiKey',
        hasTripStartDate: !!tripStartDate,
        hasApiKey
      });
      return;
    }

    console.log(`🚨 FIXED: fetchWeather STARTING for ${segmentEndCity}`, {
      segmentDay,
      tripStartDate: tripStartDate.toISOString(),
      hasApiKey,
      timestamp: new Date().toISOString()
    });

    try {
      actions.setLoading(true);
      actions.setError(null);

      // Calculate the exact segment date
      const segmentDate = DateNormalizationService.calculateSegmentDate(tripStartDate, segmentDay);
      
      if (!segmentDate) {
        throw new Error('Could not calculate segment date');
      }

      console.log(`🚨 FIXED: Calling getWeatherDataForTripDate for ${segmentEndCity}`, {
        segmentDate: segmentDate.toISOString(),
        daysFromNow: Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
      });

      const weatherDisplayData = await getWeatherDataForTripDate(
        segmentEndCity,
        segmentDate
      );

      console.log(`🚨 FIXED: Weather data received for ${segmentEndCity}:`, {
        hasData: !!weatherDisplayData,
        source: weatherDisplayData?.source,
        isActualForecast: weatherDisplayData?.isActualForecast
      });

      if (weatherDisplayData) {
        // Convert to ForecastWeatherData format
        const forecastData: ForecastWeatherData = {
          temperature: Math.round((weatherDisplayData.highTemp + weatherDisplayData.lowTemp) / 2),
          highTemp: weatherDisplayData.highTemp,
          lowTemp: weatherDisplayData.lowTemp,
          description: weatherDisplayData.description,
          icon: weatherDisplayData.icon,
          humidity: weatherDisplayData.humidity,
          windSpeed: weatherDisplayData.windSpeed,
          precipitationChance: weatherDisplayData.precipitationChance,
          cityName: weatherDisplayData.cityName,
          forecast: [],
          forecastDate: segmentDate,
          isActualForecast: weatherDisplayData.isActualForecast || weatherDisplayData.source === 'forecast',
          dateMatchInfo: {
            requestedDate: DateNormalizationService.toDateString(segmentDate),
            matchedDate: DateNormalizationService.toDateString(segmentDate),
            matchType: weatherDisplayData.source === 'forecast' ? 'exact' : 'seasonal-estimate',
            daysOffset: Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)),
            source: weatherDisplayData.source === 'forecast' ? 'api-forecast' : 'seasonal-estimate',
            confidence: weatherDisplayData.source === 'forecast' ? 'high' : 'low'
          }
        };

        console.log(`🚨 FIXED: Setting weather data for ${segmentEndCity}:`, {
          temperature: forecastData.temperature,
          isActualForecast: forecastData.isActualForecast,
          source: forecastData.dateMatchInfo?.source
        });

        actions.setWeather(forecastData);
      } else {
        throw new Error('No weather data available');
      }
    } catch (error) {
      console.error(`🚨 FIXED: Weather fetch error for ${segmentEndCity}:`, error);
      actions.setError(error instanceof Error ? error.message : 'Weather fetch failed');
    } finally {
      actions.setLoading(false);
    }
  }, [segmentEndCity, segmentDay, tripStartDate, hasApiKey, actions]);

  // FIXED: Auto-fetch effect that actually triggers
  React.useEffect(() => {
    console.log(`🚨 FIXED: useWeatherDataFetcher auto-fetch effect for ${segmentEndCity}:`, {
      hasApiKey,
      hasTripStartDate: !!tripStartDate,
      isCurrentlyLoading: actions.retryCount > 0,
      retryCount: actions.retryCount,
      shouldFetch: hasApiKey && tripStartDate
    });

    if (hasApiKey && tripStartDate) {
      console.log(`🚨 FIXED: TRIGGERING AUTO FETCH for ${segmentEndCity}`);
      fetchWeather();
    }
  }, [fetchWeather, hasApiKey, tripStartDate, actions.retryCount]);

  return {
    fetchWeather,
    handleApiKeySet: React.useCallback(() => {
      console.log(`🚨 FIXED: handleApiKeySet for ${segmentEndCity}`);
      if (tripStartDate) {
        fetchWeather();
      }
    }, [fetchWeather, tripStartDate]),
    handleTimeout: React.useCallback(() => {
      console.log(`🚨 FIXED: handleTimeout for ${segmentEndCity}`);
      actions.setError('Weather request timed out');
      actions.setLoading(false);
    }, [actions]),
    handleRetry: React.useCallback(() => {
      console.log(`🚨 FIXED: handleRetry for ${segmentEndCity}`);
      fetchWeather();
    }, [fetchWeather])
  };
};
