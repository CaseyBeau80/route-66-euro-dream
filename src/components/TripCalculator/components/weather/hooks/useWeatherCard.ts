
import React from 'react';
import { DailySegment } from '../../../services/planning/TripPlanBuilder';
import { DateNormalizationService } from '../DateNormalizationService';
import { useWeatherApiKey } from './useWeatherApiKey';
import { useSimpleWeatherState } from './useSimpleWeatherState';
import { SimpleWeatherFetcher } from '../SimpleWeatherFetcher';

interface UseWeatherCardProps {
  segment: DailySegment;
  tripStartDate: Date | null;
}

export const useWeatherCard = ({ segment, tripStartDate }: UseWeatherCardProps) => {
  console.log(`🎯 [WEATHER DEBUG] useWeatherCard SIMPLIFIED for Day ${segment.day} - preventing all loops`);

  const { hasApiKey } = useWeatherApiKey(segment.endCity);
  const weatherState = useSimpleWeatherState(segment.endCity, segment.day);
  
  // CRITICAL FIX: Memoize segment date with primitive dependencies only
  const segmentDate = React.useMemo(() => {
    if (!tripStartDate) return null;
    try {
      return DateNormalizationService.calculateSegmentDate(tripStartDate, segment.day);
    } catch {
      return null;
    }
  }, [tripStartDate?.getTime(), segment.day]);

  // CRITICAL FIX: Single stable fetch function with no external dependencies
  const fetchWeather = React.useCallback(async (isSharedView: boolean = false) => {
    if (!tripStartDate || !segmentDate) {
      console.log(`❌ SIMPLIFIED: No date available for ${segment.endCity} Day ${segment.day}`);
      return;
    }

    console.log(`🚀 SIMPLIFIED: Fetching weather for ${segment.endCity} Day ${segment.day}`);

    try {
      weatherState.setLoading(true);
      weatherState.setError(null);

      const weather = await SimpleWeatherFetcher.fetchWeatherForCity({
        cityName: segment.endCity,
        targetDate: segmentDate,
        hasApiKey,
        isSharedView,
        segmentDay: segment.day
      });

      if (weather) {
        console.log(`✅ SIMPLIFIED: Weather fetched for ${segment.endCity}:`, weather.temperature);
        weatherState.setWeather(weather);
      } else {
        console.log(`⚠️ SIMPLIFIED: No weather data for ${segment.endCity}`);
        weatherState.setError('Unable to fetch weather data');
      }
    } catch (error) {
      console.error(`❌ SIMPLIFIED: Weather fetch error for ${segment.endCity}:`, error);
      weatherState.setError('Weather fetch failed');
    } finally {
      weatherState.setLoading(false);
    }
  }, [segment.endCity, segment.day, hasApiKey, segmentDate?.getTime(), weatherState]);

  // CRITICAL FIX: Only fetch once when all dependencies are stable
  React.useEffect(() => {
    if (tripStartDate && segmentDate && !weatherState.weather && !weatherState.loading) {
      console.log(`🚨 SIMPLIFIED: Auto-fetch for ${segment.endCity} Day ${segment.day}`);
      fetchWeather(false);
    }
  }, [segmentDate?.getTime(), segment.endCity, segment.day]);

  console.log(`🎯 SIMPLIFIED: useWeatherCard stable state for ${segment.endCity}:`, {
    hasApiKey,
    hasWeather: !!weatherState.weather,
    loading: weatherState.loading,
    hasSegmentDate: !!segmentDate
  });

  return {
    hasApiKey,
    weatherState,
    segmentDate,
    fetchWeather
  };
};
