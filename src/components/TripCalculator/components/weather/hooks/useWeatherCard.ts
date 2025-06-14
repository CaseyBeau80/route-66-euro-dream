
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
  console.log(`🔑 FIXED: useWeatherCard with consistent API key detection for ${stateKey}`);

  const { hasApiKey } = useWeatherApiKey(segment.endCity);
  const weatherState = useSimpleWeatherState(segment.endCity, segment.day);
  
  // FIXED: Single source of truth for API key detection
  const apiKeyStatus = React.useMemo(() => {
    const storedKey = localStorage.getItem('weather_api_key') || localStorage.getItem('openweathermap_api_key');
    const isValid = Boolean(storedKey && storedKey.trim().length > 10);
    
    console.log(`🔑 FIXED: Consistent API key check for ${stateKey}`, {
      hasStoredKey: Boolean(storedKey),
      keyLength: storedKey?.length || 0,
      isValid,
      keyPreview: storedKey ? storedKey.substring(0, 8) + '...' : 'none'
    });
    
    return { hasKey: isValid, keyValue: storedKey };
  }, [stateKey]); // Remove hasApiKey dependency to prevent loops

  // FIXED: Stable segment date calculation
  const segmentDate = React.useMemo(() => {
    if (!tripStartDate) return null;
    try {
      const calculatedDate = DateNormalizationService.calculateSegmentDate(tripStartDate, segment.day);
      console.log(`📅 FIXED: Calculated segment date for ${stateKey}:`, calculatedDate.toISOString());
      return calculatedDate;
    } catch {
      console.log(`❌ FIXED: Date calculation failed for ${stateKey}`);
      return null;
    }
  }, [tripStartDate?.getTime(), segment.day, stateKey]);

  // FIXED: Enhanced fetch function with proper API key handling
  const fetchWeather = React.useCallback(async (isSharedView: boolean = false) => {
    const fetchKey = `${stateKey}-${segmentDate?.getTime()}-${apiKeyStatus.hasKey}`;
    console.log(`🚀 FIXED: Weather fetch with proper API key handling for ${fetchKey}`, { 
      isSharedView,
      hasValidApiKey: apiKeyStatus.hasKey,
      segmentDate: segmentDate?.toISOString(),
      willAttemptFetch: Boolean(segmentDate)
    });

    if (!segmentDate) {
      console.log(`❌ FIXED: No segment date for ${stateKey}`);
      weatherState.setError('Missing trip date');
      return;
    }

    try {
      weatherState.setLoading(true);
      weatherState.setError(null);

      console.log(`🌤️ FIXED: Calling SimpleWeatherFetcher with consistent API key for ${stateKey}`, {
        hasApiKey: apiKeyStatus.hasKey,
        isSharedView,
        segmentDay: segment.day
      });

      const weather = await SimpleWeatherFetcher.fetchWeatherForCity({
        cityName: segment.endCity,
        targetDate: segmentDate,
        hasApiKey: apiKeyStatus.hasKey,
        isSharedView,
        segmentDay: segment.day
      });

      if (weather) {
        console.log(`✅ FIXED: Weather fetched with proper properties for ${stateKey}:`, {
          temperature: weather.temperature,
          source: weather.source,
          isActualForecast: weather.isActualForecast,
          description: weather.description,
          isLiveForecast: weather.isActualForecast === true && weather.source === 'live_forecast'
        });
        weatherState.setWeather(weather);
      } else {
        console.log(`⚠️ FIXED: No weather data returned for ${stateKey}`);
        weatherState.setError('Unable to fetch weather data');
      }
    } catch (error) {
      console.error(`❌ FIXED: Weather fetch error for ${stateKey}:`, error);
      weatherState.setError('Weather fetch failed');
    } finally {
      weatherState.setLoading(false);
    }
  }, [stateKey, segmentDate?.getTime(), apiKeyStatus.hasKey, weatherState, segment.endCity, segment.day]);

  // FIXED: Stable auto-fetch with proper dependency tracking (NO shared view auto-retry here)
  const hasAttemptedFetch = React.useRef(false);

  React.useEffect(() => {
    const shouldAttemptFetch = tripStartDate && 
                              segmentDate && 
                              !weatherState.weather && 
                              !weatherState.loading && 
                              !hasAttemptedFetch.current;

    if (shouldAttemptFetch) {
      console.log(`🚨 FIXED: Auto-fetch triggered for ${stateKey}`, {
        hasSegmentDate: Boolean(segmentDate),
        hasWeather: Boolean(weatherState.weather),
        loading: weatherState.loading,
        hasValidApiKey: apiKeyStatus.hasKey,
        hasAttemptedFetch: hasAttemptedFetch.current
      });
      
      hasAttemptedFetch.current = true;
      fetchWeather(false);
    }
  }, [tripStartDate?.getTime(), segmentDate?.getTime(), apiKeyStatus.hasKey, fetchWeather, stateKey]);

  // Reset fetch attempt when key dependencies change
  React.useEffect(() => {
    hasAttemptedFetch.current = false;
  }, [stateKey, segmentDate?.getTime()]);

  console.log(`🔑 FIXED: useWeatherCard final state for ${stateKey}:`, {
    hasApiKey: apiKeyStatus.hasKey,
    hasWeather: Boolean(weatherState.weather),
    loading: weatherState.loading,
    hasSegmentDate: Boolean(segmentDate),
    weatherSource: weatherState.weather?.source,
    isActualForecast: weatherState.weather?.isActualForecast,
    isLiveForecast: weatherState.weather?.isActualForecast === true && weatherState.weather?.source === 'live_forecast'
  });

  return {
    hasApiKey: apiKeyStatus.hasKey,
    weatherState,
    segmentDate,
    fetchWeather
  };
};
