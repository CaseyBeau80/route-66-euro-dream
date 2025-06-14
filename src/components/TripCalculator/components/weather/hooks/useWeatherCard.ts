
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
  console.log(`🎯 PHASE 3 FIX: useWeatherCard with enhanced API key detection for ${stateKey}`);

  const { hasApiKey } = useWeatherApiKey(segment.endCity);
  const weatherState = useSimpleWeatherState(segment.endCity, segment.day);
  
  // PHASE 3 FIX: Enhanced and consistent API key detection
  const enhancedApiKeyCheck = React.useMemo(() => {
    const storedKey = localStorage.getItem('weather_api_key');
    const isValidKey = Boolean(storedKey && storedKey.trim().length > 10);
    
    console.log(`🔑 PHASE 3 FIX: Enhanced API key check for ${stateKey}`, {
      originalHasApiKey: hasApiKey,
      storedKeyExists: Boolean(storedKey),
      storedKeyLength: storedKey?.length || 0,
      isValidKey,
      finalDecision: isValidKey
    });
    
    return isValidKey;
  }, [hasApiKey, stateKey]);

  // PHASE 3 FIX: Stable segment date calculation
  const segmentDate = React.useMemo(() => {
    if (!tripStartDate) return null;
    try {
      const calculatedDate = DateNormalizationService.calculateSegmentDate(tripStartDate, segment.day);
      console.log(`📅 PHASE 3 FIX: Calculated segment date for ${stateKey}:`, calculatedDate.toISOString());
      return calculatedDate;
    } catch {
      console.log(`❌ PHASE 3 FIX: Date calculation failed for ${stateKey}`);
      return null;
    }
  }, [tripStartDate?.getTime(), segment.day, stateKey]);

  // PHASE 3 FIX: Enhanced fetch function that preserves live forecast properties
  const fetchWeather = React.useCallback(async (isSharedView: boolean = false) => {
    const fetchKey = `${stateKey}-${segmentDate?.getTime()}-${enhancedApiKeyCheck}`;
    console.log(`🚀 PHASE 3 FIX: Weather fetch with preserved properties for ${fetchKey}`, { 
      isSharedView,
      hasValidApiKey: enhancedApiKeyCheck,
      segmentDate: segmentDate?.toISOString(),
      willAttemptFetch: Boolean(segmentDate)
    });

    if (!segmentDate) {
      console.log(`❌ PHASE 3 FIX: No segment date for ${stateKey}`);
      weatherState.setError('Missing trip date');
      return;
    }

    try {
      weatherState.setLoading(true);
      weatherState.setError(null);

      console.log(`🌤️ PHASE 3 FIX: Calling SimpleWeatherFetcher for ${stateKey}`, {
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
        console.log(`✅ PHASE 3 FIX: Weather fetched with preserved properties for ${stateKey}:`, {
          temperature: weather.temperature,
          source: weather.source,
          isActualForecast: weather.isActualForecast,
          description: weather.description,
          preservedLiveProperties: weather.isActualForecast === true && weather.source === 'live_forecast'
        });
        weatherState.setWeather(weather);
      } else {
        console.log(`⚠️ PHASE 3 FIX: No weather data returned for ${stateKey}`);
        weatherState.setError('Unable to fetch weather data');
      }
    } catch (error) {
      console.error(`❌ PHASE 3 FIX: Weather fetch error for ${stateKey}:`, error);
      weatherState.setError('Weather fetch failed');
    } finally {
      weatherState.setLoading(false);
    }
  }, [stateKey, segmentDate?.getTime(), enhancedApiKeyCheck, weatherState, segment.endCity, segment.day]);

  // PHASE 3 FIX: Stable auto-fetch with proper dependency tracking
  const hasAttemptedFetch = React.useRef(false);

  React.useEffect(() => {
    const shouldAttemptFetch = tripStartDate && 
                              segmentDate && 
                              !weatherState.weather && 
                              !weatherState.loading && 
                              !hasAttemptedFetch.current;

    if (shouldAttemptFetch) {
      console.log(`🚨 PHASE 3 FIX: Auto-fetch triggered for ${stateKey}`, {
        hasSegmentDate: Boolean(segmentDate),
        hasWeather: Boolean(weatherState.weather),
        loading: weatherState.loading,
        hasValidApiKey: enhancedApiKeyCheck,
        hasAttemptedFetch: hasAttemptedFetch.current
      });
      
      hasAttemptedFetch.current = true;
      fetchWeather(false);
    }
  }, [tripStartDate?.getTime(), segmentDate?.getTime(), enhancedApiKeyCheck, fetchWeather, stateKey]);

  // Reset fetch attempt when key dependencies change
  React.useEffect(() => {
    hasAttemptedFetch.current = false;
  }, [stateKey, segmentDate?.getTime()]);

  console.log(`🎯 PHASE 3 FIX: useWeatherCard final state for ${stateKey}:`, {
    hasApiKey: enhancedApiKeyCheck,
    hasWeather: Boolean(weatherState.weather),
    loading: weatherState.loading,
    hasSegmentDate: Boolean(segmentDate),
    weatherSource: weatherState.weather?.source,
    isActualForecast: weatherState.weather?.isActualForecast,
    preservedLiveProperties: weatherState.weather?.isActualForecast === true && weatherState.weather?.source === 'live_forecast'
  });

  return {
    hasApiKey: enhancedApiKeyCheck,
    weatherState,
    segmentDate,
    fetchWeather
  };
};
