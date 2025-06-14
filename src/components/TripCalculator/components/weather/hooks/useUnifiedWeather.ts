
import { useState, useEffect } from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';
import { WeatherFallbackService } from '@/components/Route66Map/services/weather/WeatherFallbackService';

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

  const fetchWeather = async () => {
    if (!segmentDate) {
      setWeather(null);
      setLoading(false);
      return;
    }

    // If we have cached weather and should prioritize it, use it
    if (prioritizeCachedData && cachedWeather) {
      console.log('🎯 useUnifiedWeather: Using prioritized cached data:', {
        cityName,
        segmentDay,
        temperature: cachedWeather.temperature,
        source: cachedWeather.source
      });
      setWeather(cachedWeather);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🌤️ useUnifiedWeather: Starting DIRECT weather fetch for shared view:', {
        cityName,
        segmentDate: segmentDate.toISOString(),
        segmentDay,
        sharedViewOptimized: true
      });

      // CRITICAL FIX: Use direct API fetching for consistent results
      const weatherData = await fetchLiveWeatherDirect(cityName, segmentDate);
      
      if (weatherData) {
        console.log('✅ useUnifiedWeather: DIRECT live weather successful:', {
          cityName,
          temperature: weatherData.temperature,
          source: weatherData.source,
          isActualForecast: weatherData.isActualForecast,
          sharedViewSuccess: true
        });
        setWeather(weatherData);
        return;
      }

      // Fallback to historical weather if live fetch fails
      console.log('🔄 useUnifiedWeather: Using fallback weather for', cityName);
      const fallbackWeather = createFallbackWeather(cityName, segmentDate);
      setWeather(fallbackWeather);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather';
      console.error('❌ useUnifiedWeather: Weather fetch failed:', errorMessage);
      
      // Use fallback weather on error
      const fallbackWeather = createFallbackWeather(cityName, segmentDate);
      setWeather(fallbackWeather);
      setError('Using fallback weather data');
    } finally {
      setLoading(false);
    }
  };

  // CRITICAL FIX: Direct API weather fetching
  const fetchLiveWeatherDirect = async (
    cityName: string, 
    targetDate: Date
  ): Promise<ForecastWeatherData | null> => {
    try {
      // Check API key availability
      const apiKey = WeatherApiKeyManager.getApiKey();
      if (!apiKey) {
        console.log('❌ useUnifiedWeather: No API key available');
        return null;
      }

      // Check if within forecast range (0-7 days from today)
      const today = new Date();
      const daysFromToday = Math.ceil((targetDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
      
      if (daysFromToday < 0 || daysFromToday > 7) {
        console.log('📅 useUnifiedWeather: Date outside forecast range:', daysFromToday);
        return null;
      }

      // Get coordinates
      const coords = await getCoordinates(cityName, apiKey);
      if (!coords) {
        console.log('❌ useUnifiedWeather: Could not get coordinates for', cityName);
        return null;
      }

      // Fetch weather forecast
      const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial`;
      const response = await fetch(weatherUrl);

      if (!response.ok) {
        console.log('❌ useUnifiedWeather: Weather API failed:', response.status);
        return null;
      }

      const data = await response.json();
      if (!data.list || data.list.length === 0) {
        console.log('❌ useUnifiedWeather: No forecast data');
        return null;
      }

      // Find best match for target date
      const targetDateString = targetDate.toISOString().split('T')[0];
      const bestMatch = data.list.find((item: any) => {
        const itemDate = new Date(item.dt * 1000).toISOString().split('T')[0];
        return itemDate === targetDateString;
      }) || data.list[0];

      // CRITICAL FIX: Create live forecast with explicit properties
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
        isActualForecast: true, // CRITICAL: Always true for live API data
        source: 'live_forecast' as const // CRITICAL: Always live_forecast for API data
      };

      console.log('✅ useUnifiedWeather: Created live forecast:', {
        cityName,
        temperature: liveWeather.temperature,
        isActualForecast: liveWeather.isActualForecast,
        source: liveWeather.source
      });

      return liveWeather;
    } catch (error) {
      console.error('❌ useUnifiedWeather: Live weather fetch failed:', error);
      return null;
    }
  };

  // CRITICAL FIX: Geocoding helper
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
      console.error('❌ useUnifiedWeather: Geocoding error:', error);
      return null;
    }
  };

  // CRITICAL FIX: Fallback weather creation
  const createFallbackWeather = (cityName: string, targetDate: Date): ForecastWeatherData => {
    const targetDateString = targetDate.toISOString().split('T')[0];
    const daysFromToday = Math.ceil((targetDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
    
    return WeatherFallbackService.createFallbackForecast(
      cityName,
      targetDate,
      targetDateString,
      daysFromToday
    );
  };

  const refetch = () => {
    fetchWeather();
  };

  useEffect(() => {
    fetchWeather();
  }, [cityName, segmentDate, segmentDay, prioritizeCachedData, cachedWeather]);

  return {
    weather,
    loading,
    error,
    refetch
  };
};
