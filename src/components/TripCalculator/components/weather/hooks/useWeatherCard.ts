
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
  console.log(`🔑 PLAN: useWeatherCard with stable API key detection for ${stateKey}`);

  const { hasApiKey } = useWeatherApiKey(segment.endCity);
  const weatherState = useSimpleWeatherState(segment.endCity, segment.day);
  
  // PLAN IMPLEMENTATION: Stable API key detection to prevent loops
  const apiKeyStatus = React.useMemo(() => {
    const storedKey = localStorage.getItem('weather_api_key') || localStorage.getItem('openweathermap_api_key');
    const isValid = Boolean(storedKey && storedKey.trim().length > 10);
    
    console.log(`🔑 PLAN: Stable API key check for ${stateKey}`, {
      hasStoredKey: Boolean(storedKey),
      keyLength: storedKey?.length || 0,
      isValid,
      keyPreview: storedKey ? storedKey.substring(0, 8) + '...' : 'none'
    });
    
    return { hasKey: isValid, keyValue: storedKey };
  }, []); // PLAN: No dependencies to prevent loops

  // PLAN IMPLEMENTATION: Stable segment date calculation
  const segmentDate = React.useMemo(() => {
    if (!tripStartDate) return null;
    try {
      const calculatedDate = DateNormalizationService.calculateSegmentDate(tripStartDate, segment.day);
      console.log(`📅 PLAN: Calculated segment date for ${stateKey}:`, calculatedDate.toISOString());
      return calculatedDate;
    } catch {
      console.log(`❌ PLAN: Date calculation failed for ${stateKey}`);
      return null;
    }
  }, [tripStartDate?.getTime(), segment.day, stateKey]);

  // PLAN IMPLEMENTATION: Enhanced fetch function with stable dependencies
  const fetchWeather = React.useCallback(async (isSharedView: boolean = false) => {
    const fetchKey = `${stateKey}-${segmentDate?.getTime()}-${Date.now()}`;
    console.log(`🚀 PLAN: Weather fetch with stable dependencies for ${fetchKey}`, { 
      isSharedView,
      hasValidApiKey: apiKeyStatus.hasKey,
      segmentDate: segmentDate?.toISOString(),
      willAttemptFetch: Boolean(segmentDate)
    });

    if (!segmentDate) {
      console.log(`❌ PLAN: No segment date for ${stateKey}`);
      weatherState.setError('Missing trip date');
      return;
    }

    try {
      weatherState.setLoading(true);
      weatherState.setError(null);

      console.log(`🌤️ PLAN: Calling SimpleWeatherFetcher with stable API key for ${stateKey}`, {
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
        console.log(`✅ PLAN: Weather fetched with correct properties for ${stateKey}:`, {
          temperature: weather.temperature,
          source: weather.source,
          isActualForecast: weather.isActualForecast,
          description: weather.description,
          isLiveForecast: weather.isActualForecast === true && weather.source === 'live_forecast'
        });
        weatherState.setWeather(weather);
      } else {
        console.log(`⚠️ PLAN: No weather data returned for ${stateKey}`);
        weatherState.setError('Unable to fetch weather data');
      }
    } catch (error) {
      console.error(`❌ PLAN: Weather fetch error for ${stateKey}:`, error);
      weatherState.setError('Weather fetch failed');
    } finally {
      weatherState.setLoading(false);
    }
  }, [stateKey, segmentDate?.getTime(), apiKeyStatus.hasKey, weatherState, segment.endCity, segment.day]);

  // PLAN IMPLEMENTATION: Stable auto-fetch with single attempt tracking
  const hasAttemptedFetch = React.useRef(false);
  const lastFetchDateKey = React.useRef<string>('');

  React.useEffect(() => {
    const currentDateKey = `${tripStartDate?.getTime()}-${segmentDate?.getTime()}`;
    
    // Reset attempt if date changed
    if (lastFetchDateKey.current !== currentDateKey) {
      hasAttemptedFetch.current = false;
      lastFetchDateKey.current = currentDateKey;
    }

    const shouldAttemptFetch = tripStartDate && 
                              segmentDate && 
                              !weatherState.weather && 
                              !weatherState.loading && 
                              !hasAttemptedFetch.current;

    if (shouldAttemptFetch) {
      console.log(`🚨 PLAN: Auto-fetch triggered for ${stateKey}`, {
        hasSegmentDate: Boolean(segmentDate),
        hasWeather: Boolean(weatherState.weather),
        loading: weatherState.loading,
        hasValidApiKey: apiKeyStatus.hasKey,
        hasAttemptedFetch: hasAttemptedFetch.current
      });
      
      hasAttemptedFetch.current = true;
      fetchWeather(false);
    }
  }, [tripStartDate?.getTime(), segmentDate?.getTime(), fetchWeather, stateKey]);

  console.log(`🔑 PLAN: useWeatherCard final state for ${stateKey}:`, {
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
