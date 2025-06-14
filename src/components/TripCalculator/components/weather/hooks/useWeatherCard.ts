
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
  const stateKey = `${segment.endCity}-day-${segment.day}`;
  console.log(`🎯 CRITICAL FIX: useWeatherCard for ${stateKey} - enhanced API key detection`);

  const { hasApiKey } = useWeatherApiKey(segment.endCity);
  const weatherState = useSimpleWeatherState(segment.endCity, segment.day);
  
  // Enhanced API key detection for live forecasts
  const enhancedApiKeyCheck = React.useMemo(() => {
    const storedKey = localStorage.getItem('weather_api_key');
    const isValidKey = storedKey && storedKey.length > 10;
    
    console.log(`🔑 CRITICAL FIX: Enhanced API key check for ${stateKey}`, {
      hasApiKey,
      storedKeyExists: !!storedKey,
      storedKeyLength: storedKey?.length || 0,
      isValidKey
    });
    
    return isValidKey;
  }, [hasApiKey, stateKey]);

  // CRITICAL FIX: Stable segment date calculation
  const segmentDate = React.useMemo(() => {
    if (!tripStartDate) return null;
    try {
      const calculatedDate = DateNormalizationService.calculateSegmentDate(tripStartDate, segment.day);
      console.log(`📅 CRITICAL FIX: Calculated segment date for ${stateKey}:`, calculatedDate.toISOString());
      return calculatedDate;
    } catch {
      console.log(`❌ CRITICAL FIX: Date calculation failed for ${stateKey}`);
      return null;
    }
  }, [tripStartDate?.getTime(), segment.day, stateKey]);

  // CRITICAL FIX: Enhanced fetch function with proper API key handling
  const fetchWeather = React.useCallback(async (isSharedView: boolean = false) => {
    const fetchKey = `${stateKey}-${segmentDate?.getTime()}-${enhancedApiKeyCheck}`;
    console.log(`🚀 CRITICAL FIX: Enhanced weather fetch for ${fetchKey}`, { 
      isSharedView,
      hasValidApiKey: enhancedApiKeyCheck,
      segmentDate: segmentDate?.toISOString()
    });

    if (!segmentDate) {
      console.log(`❌ CRITICAL FIX: No segment date for ${stateKey}`);
      weatherState.setError('Missing trip date');
      return;
    }

    try {
      weatherState.setLoading(true);
      weatherState.setError(null);

      console.log(`🌤️ CRITICAL FIX: Calling SimpleWeatherFetcher for ${stateKey}`, {
        hasApiKey: enhancedApiKeyCheck,
        isSharedView,
        segmentDay: segment.day
      });

      const weather = await SimpleWeatherFetcher.fetchWeatherForCity({
        cityName: segment.endCity,
        targetDate: segmentDate,
        hasApiKey: enhancedApiKeyCheck,
        isSharedView,
        segmentDay: segment.day
      });

      if (weather) {
        console.log(`✅ CRITICAL FIX: Weather fetched successfully for ${stateKey}:`, {
          temperature: weather.temperature,
          source: weather.source,
          isActualForecast: weather.isActualForecast,
          description: weather.description
        });
        weatherState.setWeather(weather);
      } else {
        console.log(`⚠️ CRITICAL FIX: No weather data returned for ${stateKey}`);
        weatherState.setError('Unable to fetch weather data');
      }
    } catch (error) {
      console.error(`❌ CRITICAL FIX: Weather fetch error for ${stateKey}:`, error);
      weatherState.setError('Weather fetch failed');
    } finally {
      weatherState.setLoading(false);
    }
  }, [stateKey, segmentDate?.getTime(), enhancedApiKeyCheck, weatherState, segment.endCity, segment.day]);

  // CRITICAL FIX: Auto-fetch logic with enhanced conditions
  const hasAttemptedFetch = React.useRef(false);

  React.useEffect(() => {
    const shouldAttemptFetch = tripStartDate && 
                              segmentDate && 
                              !weatherState.weather && 
                              !weatherState.loading && 
                              !hasAttemptedFetch.current;

    if (shouldAttemptFetch) {
      console.log(`🚨 CRITICAL FIX: Auto-fetch triggered for ${stateKey}`, {
        hasSegmentDate: !!segmentDate,
        hasWeather: !!weatherState.weather,
        loading: weatherState.loading,
        hasValidApiKey: enhancedApiKeyCheck
      });
      
      hasAttemptedFetch.current = true;
      fetchWeather(false);
    }
  }, [tripStartDate?.getTime(), segmentDate?.getTime(), enhancedApiKeyCheck, fetchWeather, stateKey]);

  // Reset fetch attempt when key dependencies change
  React.useEffect(() => {
    hasAttemptedFetch.current = false;
  }, [stateKey, segmentDate?.getTime(), enhancedApiKeyCheck]);

  console.log(`🎯 CRITICAL FIX: useWeatherCard state for ${stateKey}:`, {
    hasApiKey: enhancedApiKeyCheck,
    hasWeather: !!weatherState.weather,
    loading: weatherState.loading,
    hasSegmentDate: !!segmentDate,
    weatherSource: weatherState.weather?.source,
    isActualForecast: weatherState.weather?.isActualForecast
  });

  return {
    hasApiKey: enhancedApiKeyCheck,
    weatherState,
    segmentDate,
    fetchWeather
  };
};
