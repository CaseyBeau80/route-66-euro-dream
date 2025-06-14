
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
      
      console.log(`🚀 PLAN: Starting SHARED VIEW COMPATIBLE weather fetch for ${segmentEndCity} Day ${segmentDay}:`, {
        segmentDate: segmentDate.toISOString(),
        hasApiKey,
        isSharedView,
        isolationLevel: 'city+date+day',
        SHARED_VIEW_ENABLED: true
      });

      actions.setLoading(true);
      actions.setError(null);

      // 🔧 PLAN: For shared views, still check cache but also try fresh fetch
      if (!isSharedView) {
        const cachedWeather = WeatherPersistenceService.getWeatherData(segmentEndCity, segmentDate, segmentDay);
        if (cachedWeather) {
          console.log(`💾 PLAN: Using ISOLATED cached weather for ${segmentEndCity} Day ${segmentDay}`);
          actions.setWeather(cachedWeather);
          actions.setLoading(false);
          return;
        }
      }

      // 🔧 CRITICAL: ALWAYS attempt weather fetch for shared views, even without API key
      console.log(`🔧 CRITICAL: SHARED VIEW weather fetch attempt for ${segmentEndCity}:`, {
        hasApiKey,
        isSharedView,
        willUseFallback: !hasApiKey,
        FORCING_FETCH: true
      });

      const weather = await SimpleWeatherFetcher.fetchWeatherForCity({
        cityName: segmentEndCity,
        targetDate: segmentDate,
        hasApiKey,
        isSharedView,
        segmentDay
      });

      if (weather) {
        console.log(`✅ PLAN: SHARED VIEW weather fetched for ${segmentEndCity} Day ${segmentDay}:`, {
          temperature: weather.temperature,
          source: weather.source,
          isActualForecast: weather.isActualForecast,
          isolationLevel: 'city+date+day',
          SHARED_VIEW_SUCCESS: true
        });

        // Store weather data even for shared views for consistency
        WeatherPersistenceService.storeWeatherData(segmentEndCity, segmentDate, weather, segmentDay);
        actions.setWeather(weather);
      } else {
        console.log(`⚠️ PLAN: No weather data returned for ${segmentEndCity} Day ${segmentDay} in shared view`);
        actions.setError('Unable to fetch weather data');
      }

      actions.setLoading(false);

    } catch (error) {
      console.error(`❌ PLAN: Weather fetch error for ${segmentEndCity} Day ${segmentDay}:`, error);
      actions.setError(error instanceof Error ? error.message : 'Weather fetch failed');
      actions.setLoading(false);
    }
  }, [segmentEndCity, segmentDay, tripStartDate, hasApiKey, actions]);

  // 🔧 CRITICAL: Auto-fetch for ALL views, including shared views
  React.useEffect(() => {
    if (tripStartDate) {
      console.log(`🚨 PLAN: TRIGGERING UNIVERSAL AUTO FETCH for ${segmentEndCity} Day ${segmentDay} (works for shared views)`);
      // Always fetch weather regardless of API key status for shared views to get fallback data
      fetchWeather(false); // Let the SimpleWeatherFetcher handle shared view logic internally
    }
  }, [fetchWeather, tripStartDate]);

  return { fetchWeather };
};
