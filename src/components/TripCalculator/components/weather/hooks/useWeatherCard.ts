
import React from 'react';
import { DailySegment } from '../../../services/planning/TripPlanBuilder';
import { WeatherUtilityService } from '../services/WeatherUtilityService';
import { useWeatherApiKey } from './useWeatherApiKey';
import { useSimpleWeatherState } from './useSimpleWeatherState';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';
import { WeatherFallbackService } from '@/components/Route66Map/services/weather/WeatherFallbackService';

interface UseWeatherCardProps {
  segment: DailySegment;
  tripStartDate: Date | null;
}

export const useWeatherCard = ({ segment, tripStartDate }: UseWeatherCardProps) => {
  const stateKey = `${segment.endCity}-day-${segment.day}`;
  console.log(`🔑 SIMPLIFIED: useWeatherCard for ${stateKey}`);

  const { hasApiKey } = useWeatherApiKey(segment.endCity);
  const weatherState = useSimpleWeatherState(segment.endCity, segment.day);
  
  // SIMPLIFIED: Use same API key detection as main app
  const effectiveHasApiKey = React.useMemo(() => {
    const keyExists = WeatherApiKeyManager.hasApiKey();
    console.log(`🔑 SIMPLIFIED: API key check for ${stateKey}:`, {
      hasApiKey,
      keyExists,
      usingWeatherApiKeyManager: true
    });
    return keyExists;
  }, [hasApiKey, stateKey]);

  // SIMPLIFIED: Stable segment date calculation
  const segmentDate = React.useMemo(() => {
    if (!tripStartDate) return null;
    
    const calculatedDate = WeatherUtilityService.getSegmentDate(tripStartDate, segment.day);
    console.log(`📅 SIMPLIFIED: Segment date for ${stateKey}:`, {
      tripStart: tripStartDate?.toISOString(),
      day: segment.day,
      calculated: calculatedDate?.toISOString()
    });
    return calculatedDate;
  }, [tripStartDate?.getTime(), segment.day]);

  // SIMPLIFIED: Direct weather fetching without complex logic
  const fetchWeather = React.useCallback(async (isSharedView: boolean = false) => {
    if (!segmentDate) {
      console.log(`❌ SIMPLIFIED: No segment date for ${stateKey}`);
      weatherState.setError('Missing trip date');
      return;
    }

    if (!effectiveHasApiKey) {
      console.log(`🔄 SIMPLIFIED: No API key, using fallback for ${stateKey}`);
      const fallbackWeather = createFallbackWeather();
      weatherState.setWeather(fallbackWeather);
      return;
    }

    console.log(`🚀 SIMPLIFIED: Starting live weather fetch for ${stateKey}`, { 
      isSharedView,
      hasApiKey: effectiveHasApiKey,
      segmentDate: segmentDate?.toISOString()
    });

    try {
      weatherState.setLoading(true);
      weatherState.setError(null);

      const liveWeather = await fetchLiveWeatherDirect();
      
      if (liveWeather) {
        console.log(`✅ SIMPLIFIED: Live weather success for ${stateKey}:`, {
          temperature: liveWeather.temperature,
          source: liveWeather.source,
          isActualForecast: liveWeather.isActualForecast
        });
        weatherState.setWeather(liveWeather);
      } else {
        console.log(`🔄 SIMPLIFIED: Live weather failed, using fallback for ${stateKey}`);
        const fallbackWeather = createFallbackWeather();
        weatherState.setWeather(fallbackWeather);
      }
    } catch (error) {
      console.error(`❌ SIMPLIFIED: Weather fetch error for ${stateKey}:`, error);
      const fallbackWeather = createFallbackWeather();
      weatherState.setWeather(fallbackWeather);
      weatherState.setError('Using fallback weather data');
    } finally {
      weatherState.setLoading(false);
    }
  }, [segmentDate?.getTime(), segment.endCity, segment.day, effectiveHasApiKey, stateKey, weatherState]);

  // SIMPLIFIED: Direct API call without complex routing
  const fetchLiveWeatherDirect = async () => {
    try {
      const apiKey = WeatherApiKeyManager.getApiKey();
      if (!apiKey) return null;

      // Get coordinates
      const coords = await getCoordinates(segment.endCity, apiKey);
      if (!coords) return null;

      // Check if within forecast range
      const today = new Date();
      const daysFromToday = Math.ceil((segmentDate!.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
      
      if (daysFromToday < 0 || daysFromToday > 5) {
        console.log(`📅 SIMPLIFIED: Date outside forecast range for ${segment.endCity}:`, daysFromToday);
        return null;
      }

      // Fetch weather
      const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial`;
      const response = await fetch(weatherUrl);

      if (!response.ok) return null;

      const data = await response.json();
      if (!data.list || data.list.length === 0) return null;

      // Find best match
      const targetDateString = segmentDate!.toISOString().split('T')[0];
      const bestMatch = data.list.find((item: any) => {
        const itemDate = new Date(item.dt * 1000).toISOString().split('T')[0];
        return itemDate === targetDateString;
      }) || data.list[0];

      return {
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
    } catch (error) {
      console.error(`❌ SIMPLIFIED: Live weather fetch failed for ${segment.endCity}:`, error);
      return null;
    }
  };

  // SIMPLIFIED: Fallback weather creation
  const createFallbackWeather = () => {
    const targetDateString = segmentDate!.toISOString().split('T')[0];
    const daysFromToday = Math.ceil((segmentDate!.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
    
    return WeatherFallbackService.createFallbackForecast(
      segment.endCity,
      segmentDate!,
      targetDateString,
      daysFromToday
    );
  };

  // SIMPLIFIED: Geocoding helper
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
      console.error('❌ SIMPLIFIED: Geocoding error:', error);
      return null;
    }
  };

  // SIMPLIFIED: Auto-fetch with immediate trigger
  React.useEffect(() => {
    if (segmentDate && !weatherState.weather && !weatherState.loading && effectiveHasApiKey) {
      console.log(`🔄 SIMPLIFIED: Auto-fetching weather for ${stateKey}`);
      fetchWeather(true);
    }
  }, [segmentDate?.getTime(), weatherState.weather, weatherState.loading, effectiveHasApiKey, fetchWeather]);

  console.log(`🔑 SIMPLIFIED: useWeatherCard final state for ${stateKey}:`, {
    hasValidApiKey: effectiveHasApiKey,
    hasWeather: !!weatherState.weather,
    loading: weatherState.loading,
    hasSegmentDate: !!segmentDate
  });

  return {
    hasApiKey: effectiveHasApiKey,
    weatherState,
    segmentDate,
    fetchWeather
  };
};
