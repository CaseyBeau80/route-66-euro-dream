
import React from 'react';
import { DailySegment } from '../../../services/planning/TripPlanBuilder';
import { WeatherUtilityService } from '../services/WeatherUtilityService';
import { useWeatherApiKey } from './useWeatherApiKey';
import { useSimpleWeatherState } from './useSimpleWeatherState';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';
import { WeatherFallbackService } from '@/components/Route66Map/services/weather/WeatherFallbackService';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

interface UseWeatherCardProps {
  segment: DailySegment;
  tripStartDate: Date | null;
}

export const useWeatherCard = ({ segment, tripStartDate }: UseWeatherCardProps) => {
  const stateKey = `${segment.endCity}-day-${segment.day}`;
  console.log(`🔑 UNIFIED: useWeatherCard for ${stateKey}`);

  const { hasApiKey } = useWeatherApiKey(segment.endCity);
  const weatherState = useSimpleWeatherState(segment.endCity, segment.day);
  
  // UNIFIED: Use consistent API key detection for ALL views
  const effectiveHasApiKey = React.useMemo(() => {
    const keyExists = WeatherApiKeyManager.hasApiKey();
    console.log(`🔑 UNIFIED: API key check for ${stateKey}:`, {
      keyExists,
      usingConsistentDetection: true,
      sameLogicForAllViews: true
    });
    return keyExists;
  }, [stateKey]);

  // UNIFIED: Stable segment date calculation
  const segmentDate = React.useMemo(() => {
    if (!tripStartDate) return null;
    
    const calculatedDate = WeatherUtilityService.getSegmentDate(tripStartDate, segment.day);
    console.log(`📅 UNIFIED: Segment date for ${stateKey}:`, {
      tripStart: tripStartDate?.toISOString(),
      day: segment.day,
      calculated: calculatedDate?.toISOString()
    });
    return calculatedDate;
  }, [tripStartDate?.getTime(), segment.day]);

  // UNIFIED: Direct weather fetching - SAME FLOW FOR ALL VIEWS
  const fetchWeather = React.useCallback(async () => {
    if (!segmentDate) {
      console.log(`❌ UNIFIED: No segment date for ${stateKey}`);
      weatherState.setError('Missing trip date');
      return;
    }

    console.log(`🚀 UNIFIED: Starting weather fetch for ${stateKey}`, { 
      hasApiKey: effectiveHasApiKey,
      segmentDate: segmentDate?.toISOString(),
      unifiedFlow: true
    });

    try {
      weatherState.setLoading(true);
      weatherState.setError(null);

      // UNIFIED: Try live weather first if API key exists
      if (effectiveHasApiKey) {
        console.log(`🌤️ UNIFIED: Attempting live weather for ${stateKey}`);
        const liveWeather = await fetchLiveWeatherDirect();
        
        if (liveWeather) {
          console.log(`✅ UNIFIED: Live weather success for ${stateKey}:`, {
            temperature: liveWeather.temperature,
            source: liveWeather.source,
            isActualForecast: liveWeather.isActualForecast
          });
          weatherState.setWeather(liveWeather);
          return;
        }
      }

      // UNIFIED: Fallback to historical weather (same for all views)
      console.log(`🔄 UNIFIED: Using fallback weather for ${stateKey}`);
      const fallbackWeather = createFallbackWeather();
      weatherState.setWeather(fallbackWeather);
      
    } catch (error) {
      console.error(`❌ UNIFIED: Weather fetch error for ${stateKey}:`, error);
      const fallbackWeather = createFallbackWeather();
      weatherState.setWeather(fallbackWeather);
      weatherState.setError('Using fallback weather data');
    } finally {
      weatherState.setLoading(false);
    }
  }, [segmentDate?.getTime(), segment.endCity, segment.day, effectiveHasApiKey, stateKey, weatherState]);

  // UNIFIED: Direct API call - no complex routing
  const fetchLiveWeatherDirect = async (): Promise<ForecastWeatherData | null> => {
    try {
      const apiKey = WeatherApiKeyManager.getApiKey();
      if (!apiKey) {
        console.log(`❌ UNIFIED: No API key available for ${segment.endCity}`);
        return null;
      }

      // Get coordinates
      const coords = await getCoordinates(segment.endCity, apiKey);
      if (!coords) {
        console.log(`❌ UNIFIED: Could not get coordinates for ${segment.endCity}`);
        return null;
      }

      // Check if within forecast range
      const today = new Date();
      const daysFromToday = Math.ceil((segmentDate!.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
      
      if (daysFromToday < 0 || daysFromToday > 7) {
        console.log(`📅 UNIFIED: Date outside forecast range for ${segment.endCity}:`, daysFromToday);
        return null;
      }

      // Fetch weather
      const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial`;
      const response = await fetch(weatherUrl);

      if (!response.ok) {
        console.log(`❌ UNIFIED: Weather API failed for ${segment.endCity}:`, response.status);
        return null;
      }

      const data = await response.json();
      if (!data.list || data.list.length === 0) {
        console.log(`❌ UNIFIED: No forecast data for ${segment.endCity}`);
        return null;
      }

      // Find best match
      const targetDateString = segmentDate!.toISOString().split('T')[0];
      const bestMatch = data.list.find((item: any) => {
        const itemDate = new Date(item.dt * 1000).toISOString().split('T')[0];
        return itemDate === targetDateString;
      }) || data.list[0];

      const liveWeather: ForecastWeatherData = {
        temperature: Math.round(bestMatch.main.temp),
        highTemp: Math.round(bestMatch.main.temp_max),
        lowTemp: Math.round(bestMatch.main.temp_min),
        description: bestMatch.weather[0]?.description || 'Partly Cloudy',
        icon: bestMatch.weather[0]?.icon || '02d',
        humidity: bestMatch.main.humidity,
        windSpeed: Math.round(bestMatch.wind?.speed || 0),
        precipitationChance: Math.round((bestMatch.pop || 0) * 100),
        cityName: segment.endCity,
        forecast: [],
        forecastDate: segmentDate!,
        isActualForecast: true,
        source: 'live_forecast' as const
      };

      console.log(`✅ UNIFIED: Created live forecast for ${segment.endCity}:`, {
        temperature: liveWeather.temperature,
        source: liveWeather.source
      });

      return liveWeather;
    } catch (error) {
      console.error(`❌ UNIFIED: Live weather fetch failed for ${segment.endCity}:`, error);
      return null;
    }
  };

  // UNIFIED: Fallback weather creation
  const createFallbackWeather = (): ForecastWeatherData => {
    const targetDateString = segmentDate!.toISOString().split('T')[0];
    const daysFromToday = Math.ceil((segmentDate!.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
    
    return WeatherFallbackService.createFallbackForecast(
      segment.endCity,
      segmentDate!,
      targetDateString,
      daysFromToday
    );
  };

  // UNIFIED: Geocoding helper
  const getCoordinates = async (cityName: string, apiKey: string) => {
    try {
      const cleanCityName = cityName.replace(/,\s*[A-Z]{2}$/, '').trim();
      const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cleanCityName)}&limit=3&appid=${apiKey}`;
      
      const response = await fetch(geocodingUrl);
      if (!response.ok) return null;

      const data = await response.json();
      if (!data || data.length === 0) return null;

      const result = data.find((r: any) => r.country === 'US') || data[0];
      return { lat: result.lat, lng: result.lon };
    } catch (error) {
      console.error('❌ UNIFIED: Geocoding error:', error);
      return null;
    }
  };

  // UNIFIED: Auto-fetch with immediate trigger
  React.useEffect(() => {
    if (segmentDate && !weatherState.weather && !weatherState.loading) {
      console.log(`🔄 UNIFIED: Auto-fetching weather for ${stateKey}`);
      fetchWeather();
    }
  }, [segmentDate?.getTime(), weatherState.weather, weatherState.loading, fetchWeather]);

  console.log(`🔑 UNIFIED: useWeatherCard final state for ${stateKey}:`, {
    hasValidApiKey: effectiveHasApiKey,
    hasWeather: !!weatherState.weather,
    loading: weatherState.loading,
    hasSegmentDate: !!segmentDate,
    unifiedFlow: true
  });

  return {
    hasApiKey: effectiveHasApiKey,
    weatherState,
    segmentDate,
    fetchWeather
  };
};
