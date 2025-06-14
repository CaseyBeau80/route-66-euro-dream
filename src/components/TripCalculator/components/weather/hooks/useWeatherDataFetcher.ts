
import React from 'react';
import { SimpleWeatherFetcher } from '../SimpleWeatherFetcher';
import { WeatherPersistenceService } from '../services/WeatherPersistenceService';
import { SimpleWeatherActions } from './useSimpleWeatherState';

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
  console.log(`🎯 PLAN: useWeatherDataFetcher initialized with ENHANCED ISOLATION for ${segmentEndCity} Day ${segmentDay}`);

  const fetchWeather = React.useCallback(async (isSharedView: boolean = false) => {
    if (!tripStartDate) {
      console.log(`❌ PLAN: No trip start date for ${segmentEndCity} Day ${segmentDay}`);
      return;
    }

    try {
      const segmentDate = new Date(tripStartDate.getTime() + (segmentDay - 1) * 24 * 60 * 60 * 1000);
      
      console.log(`🚀 PLAN: Starting ISOLATED weather fetch for ${segmentEndCity} Day ${segmentDay}:`, {
        segmentDate: segmentDate.toISOString(),
        hasApiKey,
        isSharedView,
        isolationLevel: 'city+date+day'
      });

      actions.setLoading(true);
      actions.setError(null);

      // 🔧 PLAN: Check for cached data with enhanced isolation
      const cachedWeather = WeatherPersistenceService.getWeatherData(segmentEndCity, segmentDate, segmentDay);
      if (cachedWeather) {
        console.log(`💾 PLAN: Using ISOLATED cached weather for ${segmentEndCity} Day ${segmentDay}`);
        actions.setWeather(cachedWeather);
        actions.setLoading(false);
        return;
      }

      // 🔧 PLAN: Fetch fresh weather with enhanced isolation
      const weather = await SimpleWeatherFetcher.fetchWeatherForCity({
        cityName: segmentEndCity,
        targetDate: segmentDate,
        hasApiKey,
        isSharedView,
        segmentDay // 🔧 PLAN: Pass segment day for unique generation
      });

      if (weather) {
        console.log(`✅ PLAN: Fresh ISOLATED weather fetched for ${segmentEndCity} Day ${segmentDay}:`, {
          temperature: weather.temperature,
          source: weather.source,
          isActualForecast: weather.isActualForecast,
          isolationLevel: 'city+date+day'
        });

        // 🔧 PLAN: Store with enhanced isolation
        WeatherPersistenceService.storeWeatherData(segmentEndCity, segmentDate, weather, segmentDay);
        actions.setWeather(weather);
      } else {
        console.log(`⚠️ PLAN: No weather data returned for ${segmentEndCity} Day ${segmentDay}`);
        actions.setError('Unable to fetch weather data');
      }

      actions.setLoading(false);

    } catch (error) {
      console.error(`❌ PLAN: Weather fetch error for ${segmentEndCity} Day ${segmentDay}:`, error);
      actions.setError(error instanceof Error ? error.message : 'Weather fetch failed');
      actions.setLoading(false);
    }
  }, [segmentEndCity, segmentDay, tripStartDate, hasApiKey, actions]);

  // 🔧 PLAN: Auto-fetch on component mount with isolation
  React.useEffect(() => {
    if (tripStartDate && hasApiKey) {
      console.log(`🚨 PLAN: TRIGGERING AUTO FETCH with ISOLATION for ${segmentEndCity} Day ${segmentDay}`);
      fetchWeather(false);
    }
  }, [fetchWeather, tripStartDate, hasApiKey]);

  return { fetchWeather };
};
