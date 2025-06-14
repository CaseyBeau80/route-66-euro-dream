
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
  console.log(`🔑 ENHANCED: useWeatherCard with robust API key validation for ${stateKey}`);

  const { hasApiKey } = useWeatherApiKey(segment.endCity);
  const weatherState = useSimpleWeatherState(segment.endCity, segment.day);
  
  // ENHANCED: More robust API key validation
  const enhancedApiKeyStatus = React.useMemo(() => {
    const primaryKey = localStorage.getItem('weather_api_key');
    const legacyKey = localStorage.getItem('openweathermap_api_key');
    const foundKey = primaryKey || legacyKey;
    
    // Enhanced validation - check length and content
    const isValidKey = foundKey && 
                      foundKey.trim().length >= 20 && 
                      foundKey !== 'your_api_key_here' &&
                      /^[a-zA-Z0-9]+$/.test(foundKey); // Only alphanumeric characters
    
    console.log(`🔑 ENHANCED: API key validation for ${stateKey}`, {
      hasPrimaryKey: !!primaryKey,
      hasLegacyKey: !!legacyKey,
      foundKeyLength: foundKey?.length || 0,
      isValidFormat: isValidKey,
      keyPreview: foundKey ? `${foundKey.substring(0, 8)}...` : 'none'
    });
    
    return { 
      hasValidKey: !!isValidKey, 
      keyValue: foundKey,
      keySource: primaryKey ? 'primary' : legacyKey ? 'legacy' : 'none'
    };
  }, []); // No dependencies to prevent infinite loops

  // ENHANCED: Stable segment date calculation
  const segmentDate = React.useMemo(() => {
    if (!tripStartDate) return null;
    try {
      const calculatedDate = DateNormalizationService.calculateSegmentDate(tripStartDate, segment.day);
      console.log(`📅 ENHANCED: Calculated segment date for ${stateKey}:`, {
        tripStart: tripStartDate.toISOString(),
        day: segment.day,
        calculated: calculatedDate.toISOString()
      });
      return calculatedDate;
    } catch (error) {
      console.log(`❌ ENHANCED: Date calculation failed for ${stateKey}:`, error);
      return null;
    }
  }, [tripStartDate?.getTime(), segment.day, stateKey]);

  // ENHANCED: Weather fetch with validated API key
  const fetchWeather = React.useCallback(async (isSharedView: boolean = false) => {
    const fetchKey = `${stateKey}-${segmentDate?.getTime()}-${Date.now()}`;
    console.log(`🚀 ENHANCED: Weather fetch with validated API key for ${fetchKey}`, { 
      isSharedView,
      hasValidApiKey: enhancedApiKeyStatus.hasValidKey,
      keySource: enhancedApiKeyStatus.keySource,
      segmentDate: segmentDate?.toISOString(),
      willAttemptLive: enhancedApiKeyStatus.hasValidKey && segmentDate
    });

    if (!segmentDate) {
      console.log(`❌ ENHANCED: No segment date for ${stateKey}`);
      weatherState.setError('Missing trip date');
      return;
    }

    try {
      weatherState.setLoading(true);
      weatherState.setError(null);

      console.log(`🌤️ ENHANCED: Calling SimpleWeatherFetcher with validated API key for ${stateKey}`, {
        hasValidApiKey: enhancedApiKeyStatus.hasValidKey,
        keySource: enhancedApiKeyStatus.keySource,
        isSharedView,
        segmentDay: segment.day
      });

      const weather = await SimpleWeatherFetcher.fetchWeatherForCity({
        cityName: segment.endCity,
        targetDate: segmentDate,
        hasApiKey: enhancedApiKeyStatus.hasValidKey, // Use validated status
        isSharedView,
        segmentDay: segment.day
      });

      if (weather) {
        console.log(`✅ ENHANCED: Weather fetched with validated source for ${stateKey}:`, {
          temperature: weather.temperature,
          source: weather.source,
          isActualForecast: weather.isActualForecast,
          description: weather.description,
          isLiveForecast: weather.isActualForecast === true && weather.source === 'live_forecast',
          isFallback: weather.isActualForecast === false && weather.source === 'historical_fallback'
        });
        weatherState.setWeather(weather);
      } else {
        console.log(`⚠️ ENHANCED: No weather data returned for ${stateKey}`);
        weatherState.setError('Unable to fetch weather data');
      }
    } catch (error) {
      console.error(`❌ ENHANCED: Weather fetch error for ${stateKey}:`, error);
      weatherState.setError('Weather fetch failed');
    } finally {
      weatherState.setLoading(false);
    }
  }, [stateKey, segmentDate?.getTime(), enhancedApiKeyStatus.hasValidKey, enhancedApiKeyStatus.keySource, weatherState, segment.endCity, segment.day]);

  // ENHANCED: Auto-fetch with validated API key and single attempt tracking
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
      console.log(`🚨 ENHANCED: Auto-fetch triggered for ${stateKey}`, {
        hasSegmentDate: Boolean(segmentDate),
        hasWeather: Boolean(weatherState.weather),
        loading: weatherState.loading,
        hasValidApiKey: enhancedApiKeyStatus.hasValidKey,
        keySource: enhancedApiKeyStatus.keySource,
        hasAttemptedFetch: hasAttemptedFetch.current
      });
      
      hasAttemptedFetch.current = true;
      fetchWeather(false);
    }
  }, [tripStartDate?.getTime(), segmentDate?.getTime(), fetchWeather, stateKey, enhancedApiKeyStatus.hasValidKey]);

  console.log(`🔑 ENHANCED: useWeatherCard final state for ${stateKey}:`, {
    hasValidApiKey: enhancedApiKeyStatus.hasValidKey,
    keySource: enhancedApiKeyStatus.keySource,
    hasWeather: Boolean(weatherState.weather),
    loading: weatherState.loading,
    hasSegmentDate: Boolean(segmentDate),
    weatherSource: weatherState.weather?.source,
    isActualForecast: weatherState.weather?.isActualForecast,
    isLiveForecast: weatherState.weather?.isActualForecast === true && weatherState.weather?.source === 'live_forecast'
  });

  return {
    hasApiKey: enhancedApiKeyStatus.hasValidKey, // Return validated status
    weatherState,
    segmentDate,
    fetchWeather
  };
};
