
import { useState, useEffect, useCallback } from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';
import { WeatherFallbackService } from '@/components/Route66Map/services/weather/WeatherFallbackService';
import { LiveWeatherDetectionService } from '../services/LiveWeatherDetectionService';
import { WeatherValidationService } from '../services/WeatherValidationService';

interface UseUnifiedWeatherParams {
  cityName: string;
  segmentDate: Date | null;
  segmentDay: number;
  prioritizeCachedData?: boolean;
  cachedWeather?: ForecastWeatherData | null;
}

export const useUnifiedWeather = ({
  cityName,
  segmentDate,
  segmentDay,
  prioritizeCachedData = false,
  cachedWeather = null
}: UseUnifiedWeatherParams) => {
  const [weather, setWeather] = useState<ForecastWeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // FIXED: Always default to true for live weather unless explicitly disabled
  const isUrlBasedSharedView = window.location.pathname === '/shared-trip';
  const urlParams = new URLSearchParams(window.location.search);
  const useLiveWeatherParam = urlParams.get('useLiveWeather');
  
  // CRITICAL FIX: Default to TRUE unless explicitly set to 'false'
  const shouldUseLiveWeather = useLiveWeatherParam !== 'false';

  const fetchWeatherData = useCallback(async () => {
    if (!segmentDate) {
      console.log('useUnifiedWeather - No segment date provided for', cityName);
      setWeather(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🌤️ FIXED: useUnifiedWeather starting fetch for', cityName, {
        isUrlBasedSharedView,
        shouldUseLiveWeather,
        useLiveWeatherParam,
        segmentDate: segmentDate.toISOString(),
        fixedDefaultToTrue: true
      });

      // Check API key first
      const apiKey = WeatherApiKeyManager.getApiKey();
      const hasValidApiKey = !!apiKey && apiKey !== 'YOUR_API_KEY_HERE' && apiKey.length > 10;

      if (!hasValidApiKey) {
        console.log('🌤️ FIXED: No valid API key - using fallback weather for', cityName);
        const fallbackWeather = WeatherFallbackService.createFallbackForecast(
          cityName,
          segmentDate,
          segmentDate.toISOString().split('T')[0],
          0
        );
        setWeather(fallbackWeather);
        setLoading(false);
        return;
      }

      // Check if date is within live forecast range (0-7 days)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const targetDate = new Date(segmentDate);
      targetDate.setHours(0, 0, 0, 0);
      const daysFromToday = Math.ceil((targetDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));

      console.log('🌤️ FIXED: Date analysis for', cityName, {
        today: today.toISOString().split('T')[0],
        targetDate: targetDate.toISOString().split('T')[0],
        daysFromToday,
        isWithinRange: daysFromToday >= 0 && daysFromToday <= 7,
        shouldUseLiveWeather,
        willAttemptLive: (daysFromToday >= 0 && daysFromToday <= 7) && shouldUseLiveWeather
      });

      // FIXED: Always attempt live weather if within range AND live weather is enabled (default true)
      if ((daysFromToday >= 0 && daysFromToday <= 7) && shouldUseLiveWeather) {
        console.log('🌤️ FIXED: Attempting live weather fetch for', cityName, {
          reason: 'within_range_and_live_enabled',
          daysFromToday,
          shouldUseLiveWeather
        });
        
        const liveWeather = await fetchLiveWeatherWithValidation(cityName, segmentDate, apiKey);
        
        if (liveWeather) {
          const validatedWeather = WeatherValidationService.ensureLiveWeatherMarking(liveWeather);
          
          console.log('✅ FIXED: Live weather processed for', cityName, {
            temperature: validatedWeather.temperature,
            source: validatedWeather.source,
            isActualForecast: validatedWeather.isActualForecast,
            shouldUseLiveWeather
          });
          
          setWeather(validatedWeather);
          setLoading(false);
          return;
        }
      }

      // Fallback to historical weather
      console.log('🔄 FIXED: Using fallback weather for', cityName, {
        reason: shouldUseLiveWeather ? 'OUTSIDE_RANGE_OR_API_FAILED' : 'LIVE_WEATHER_DISABLED',
        daysFromToday,
        shouldUseLiveWeather
      });
      
      const fallbackWeather = WeatherFallbackService.createFallbackForecast(
        cityName,
        segmentDate,
        segmentDate.toISOString().split('T')[0],
        daysFromToday
      );
      setWeather(fallbackWeather);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather';
      console.error('❌ FIXED: useUnifiedWeather error:', errorMessage);
      setError(errorMessage);
      
      const fallbackWeather = WeatherFallbackService.createFallbackForecast(
        cityName,
        segmentDate,
        segmentDate.toISOString().split('T')[0],
        0
      );
      setWeather(fallbackWeather);
    } finally {
      setLoading(false);
    }
  }, [cityName, segmentDate, segmentDay, isUrlBasedSharedView, shouldUseLiveWeather]);

  const refetch = useCallback(() => {
    console.log('🌤️ FIXED: Manual refetch for', cityName);
    fetchWeatherData();
  }, [fetchWeatherData, cityName]);

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  return {
    weather,
    loading,
    error,
    refetch
  };
};

// Enhanced live weather fetching with explicit validation
async function fetchLiveWeatherWithValidation(
  cityName: string, 
  targetDate: Date, 
  apiKey: string
): Promise<ForecastWeatherData | null> {
  try {
    console.log('🌤️ FIXED: fetchLiveWeatherWithValidation starting for', cityName);
    
    const coords = await getCoordinates(cityName, apiKey);
    if (!coords) {
      console.log('❌ FIXED: Could not get coordinates for', cityName);
      return null;
    }

    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial`;
    const response = await fetch(weatherUrl);

    if (!response.ok) {
      console.log('❌ FIXED: Weather API failed for', cityName, response.status);
      return null;
    }

    const data = await response.json();
    if (!data.list || data.list.length === 0) {
      console.log('❌ FIXED: No forecast data for', cityName);
      return null;
    }

    const targetDateString = targetDate.toISOString().split('T')[0];
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
      cityName: cityName,
      forecast: [],
      forecastDate: targetDate,
      isActualForecast: true,
      source: 'live_forecast' as const
    };

    console.log('✅ FIXED: Created validated live forecast for', cityName, {
      temperature: liveWeather.temperature,
      isActualForecast: liveWeather.isActualForecast,
      source: liveWeather.source,
      description: liveWeather.description
    });

    return liveWeather;
  } catch (error) {
    console.error('❌ FIXED: Live weather fetch failed for', cityName, error);
    return null;
  }
}

async function getCoordinates(cityName: string, apiKey: string) {
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
    console.error('❌ FIXED: Geocoding error:', error);
    return null;
  }
}
