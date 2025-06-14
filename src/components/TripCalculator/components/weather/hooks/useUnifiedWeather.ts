
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

  // Detect if we're in a URL-based shared view
  const isUrlBasedSharedView = window.location.pathname === '/shared-trip';
  const shouldUseLiveWeather = isUrlBasedSharedView && 
    new URLSearchParams(window.location.search).get('useLiveWeather') === 'true';

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
      console.log('🌤️ ENHANCED: useUnifiedWeather starting fetch for', cityName, {
        isUrlBasedSharedView,
        shouldUseLiveWeather,
        segmentDate: segmentDate.toISOString()
      });

      // Check API key first
      const apiKey = WeatherApiKeyManager.getApiKey();
      const hasValidApiKey = !!apiKey && apiKey !== 'YOUR_API_KEY_HERE' && apiKey.length > 10;

      if (!hasValidApiKey) {
        console.log('🌤️ ENHANCED: No valid API key - using fallback weather for', cityName);
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

      console.log('🌤️ ENHANCED: Date analysis for', cityName, {
        today: today.toISOString().split('T')[0],
        targetDate: targetDate.toISOString().split('T')[0],
        daysFromToday,
        isWithinRange: daysFromToday >= 0 && daysFromToday <= 7,
        shouldUseLiveWeather,
        isUrlBasedSharedView
      });

      // ENHANCED: For URL-based shared views with useLiveWeather=true, always try live weather if within range
      if ((daysFromToday >= 0 && daysFromToday <= 7) && 
          (!isUrlBasedSharedView || shouldUseLiveWeather)) {
        console.log('🌤️ ENHANCED: Attempting live weather fetch for', cityName);
        
        // Try live weather fetch with explicit validation
        const liveWeather = await fetchLiveWeatherWithValidation(cityName, segmentDate, apiKey);
        
        if (liveWeather) {
          const validatedWeather = WeatherValidationService.ensureLiveWeatherMarking(liveWeather);
          const isDetectedAsLive = LiveWeatherDetectionService.isLiveWeatherForecast(validatedWeather);
          
          console.log('✅ ENHANCED: Live weather processed for', cityName, {
            temperature: validatedWeather.temperature,
            source: validatedWeather.source,
            isActualForecast: validatedWeather.isActualForecast,
            detectedAsLive: isDetectedAsLive,
            isUrlBasedSharedView,
            shouldUseLiveWeather
          });
          
          setWeather(validatedWeather);
          setLoading(false);
          return;
        }
      }

      // Fallback to historical weather
      console.log('🔄 ENHANCED: Using fallback weather for', cityName, {
        reason: isUrlBasedSharedView && !shouldUseLiveWeather ? 'URL_SHARED_NO_LIVE_FLAG' : 'OUTSIDE_RANGE_OR_API_FAILED',
        isUrlBasedSharedView,
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
      console.error('❌ ENHANCED: useUnifiedWeather error:', errorMessage);
      setError(errorMessage);
      
      // Fallback weather on error
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
    console.log('🌤️ ENHANCED: Manual refetch for', cityName);
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
    console.log('🌤️ ENHANCED: fetchLiveWeatherWithValidation starting for', cityName);
    
    // Get coordinates
    const coords = await getCoordinates(cityName, apiKey);
    if (!coords) {
      console.log('❌ ENHANCED: Could not get coordinates for', cityName);
      return null;
    }

    // Fetch weather forecast
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial`;
    const response = await fetch(weatherUrl);

    if (!response.ok) {
      console.log('❌ ENHANCED: Weather API failed for', cityName, response.status);
      return null;
    }

    const data = await response.json();
    if (!data.list || data.list.length === 0) {
      console.log('❌ ENHANCED: No forecast data for', cityName);
      return null;
    }

    // Find best match for target date
    const targetDateString = targetDate.toISOString().split('T')[0];
    const bestMatch = data.list.find((item: any) => {
      const itemDate = new Date(item.dt * 1000).toISOString().split('T')[0];
      return itemDate === targetDateString;
    }) || data.list[0];

    // Create live forecast with EXPLICIT live marking
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
      isActualForecast: true, // EXPLICIT: Always true for live API data
      source: 'live_forecast' as const // EXPLICIT: Always live_forecast for API data
    };

    console.log('✅ ENHANCED: Created validated live forecast for', cityName, {
      temperature: liveWeather.temperature,
      isActualForecast: liveWeather.isActualForecast,
      source: liveWeather.source,
      description: liveWeather.description
    });

    return liveWeather;
  } catch (error) {
    console.error('❌ ENHANCED: Live weather fetch failed for', cityName, error);
    return null;
  }
}

// Geocoding helper
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
    console.error('❌ ENHANCED: Geocoding error:', error);
    return null;
  }
}
