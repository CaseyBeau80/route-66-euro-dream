
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
      
      console.log(`🚀 PLAN: Starting ENHANCED weather fetch for ${segmentEndCity} Day ${segmentDay}:`, {
        segmentDate: segmentDate.toISOString(),
        hasApiKey,
        isSharedView,
        isolationLevel: 'city+date+day',
        ENHANCED_ERROR_HANDLING: true
      });

      // CRITICAL FIX: Set loading and clear any existing errors
      actions.setLoading(true);
      actions.setError(null);

      // Check cache first for non-shared views
      if (!isSharedView) {
        const cachedWeather = WeatherPersistenceService.getWeatherData(segmentEndCity, segmentDate, segmentDay);
        if (cachedWeather) {
          console.log(`💾 PLAN: Using ISOLATED cached weather for ${segmentEndCity} Day ${segmentDay}`);
          actions.setWeather(cachedWeather);
          actions.setLoading(false);
          return;
        }
      }

      console.log(`🔧 CRITICAL: ENHANCED weather fetch attempt for ${segmentEndCity}:`, {
        hasApiKey,
        isSharedView,
        willUseFallback: !hasApiKey,
        ENHANCED_APPROACH: true
      });

      const weather = await SimpleWeatherFetcher.fetchWeatherForCity({
        cityName: segmentEndCity,
        targetDate: segmentDate,
        hasApiKey,
        isSharedView,
        segmentDay
      });

      if (weather) {
        console.log(`✅ PLAN: ENHANCED weather fetched for ${segmentEndCity} Day ${segmentDay}:`, {
          temperature: weather.temperature,
          source: weather.source,
          isActualForecast: weather.isActualForecast,
          isolationLevel: 'city+date+day',
          ENHANCED_SUCCESS: true
        });

        // Store weather data for consistency
        WeatherPersistenceService.storeWeatherData(segmentEndCity, segmentDate, weather, segmentDay);
        actions.setWeather(weather);
        
        // CRITICAL FIX: Ensure loading is cleared and error is null
        actions.setLoading(false);
        actions.setError(null);
      } else {
        console.log(`⚠️ PLAN: No weather data returned for ${segmentEndCity} Day ${segmentDay}`);
        actions.setError('Unable to fetch weather data');
        actions.setLoading(false);
      }

    } catch (error) {
      console.error(`❌ PLAN: Weather fetch error for ${segmentEndCity} Day ${segmentDay}:`, error);
      actions.setError(error instanceof Error ? error.message : 'Weather fetch failed');
      actions.setLoading(false);
    }
  }, [segmentEndCity, segmentDay, tripStartDate, hasApiKey, actions]);

  // Auto-fetch for all views with enhanced error handling
  React.useEffect(() => {
    if (tripStartDate) {
      console.log(`🚨 PLAN: TRIGGERING ENHANCED AUTO FETCH for ${segmentEndCity} Day ${segmentDay}`);
      fetchWeather(false);
    }
  }, [fetchWeather, tripStartDate]);

  return { fetchWeather };
};
