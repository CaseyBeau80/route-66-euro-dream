
import React from 'react';
import { DailySegment } from '../../../services/planning/TripPlanBuilder';
import { DateNormalizationService } from '../DateNormalizationService';
import { useWeatherApiKey } from './useWeatherApiKey';
import { useSimpleWeatherState } from './useSimpleWeatherState';
import { useWeatherDataFetcher } from './useWeatherDataFetcher';

interface UseWeatherCardProps {
  segment: DailySegment;
  tripStartDate: Date | null;
}

export const useWeatherCard = ({ segment, tripStartDate }: UseWeatherCardProps) => {
  console.log(`🎯 [WEATHER DEBUG] useWeatherCard FIXED for Day ${segment.day} - preventing loops`);

  const { hasApiKey } = useWeatherApiKey(segment.endCity);
  const weatherState = useSimpleWeatherState(segment.endCity, segment.day);
  
  const { fetchWeather } = useWeatherDataFetcher({
    segmentEndCity: segment.endCity,
    segmentDay: segment.day,
    tripStartDate,
    hasApiKey,
    actions: weatherState
  });

  // CRITICAL FIX: Memoize segment date calculation to prevent recreations
  const segmentDate = React.useMemo(() => {
    if (!tripStartDate) return null;
    try {
      return DateNormalizationService.calculateSegmentDate(tripStartDate, segment.day);
    } catch {
      return null;
    }
  }, [tripStartDate?.getTime(), segment.day]); // Use getTime() to prevent Date object issues

  console.log(`🎯 [WEATHER DEBUG] useWeatherCard STABLE state for ${segment.endCity}:`, {
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
