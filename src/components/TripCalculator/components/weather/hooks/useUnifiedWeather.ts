
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

  const fetchWeatherData = async () => {
    if (!segmentDate) {
      console.log('🌤️ useUnifiedWeather: No segment date provided');
      setWeather(null);
      setLoading(false);
      return;
    }

    // Skip cached data completely for shared views - always fetch fresh
    setLoading(true);
    setError(null);

    try {
      console.log('🌤️ useUnifiedWeather: Starting fresh weather fetch for shared view:', {
        cityName,
        segmentDate: segmentDate.toISOString(),
        segmentDay,
        forcingLiveFetch: true
      });

      // Check API key
      const apiKey = WeatherApiKeyManager.getApiKey();
      if (!apiKey) {
        console.log('❌ useUnifiedWeather: No API key available');
        throw new Error('No API key available');
      }

      // Check if date is within forecast range (0-5 days from today)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const targetDate = new Date(segmentDate);
      targetDate.setHours(0, 0, 0, 0);
      const daysFromToday = Math.ceil((targetDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
      
      console.log('🌤️ useUnifiedWeather: Date analysis:', {
        today: today.toISOString(),
        targetDate: targetDate.toISOString(),
        daysFromToday,
        withinForecastRange: daysFromToday >= 0 && daysFromToday <= 5
      });

      if (daysFromToday >= 0 && daysFromToday <= 5) {
        // Try to get live forecast
        const liveWeather = await fetchLiveForecast(cityName, segmentDate, apiKey);
        
        if (liveWeather) {
          console.log('✅ useUnifiedWeather: Live forecast successful:', {
            cityName,
            temperature: liveWeather.temperature,
            source: liveWeather.source,
            isActualForecast: liveWeather.isActualForecast
          });
          setWeather(liveWeather);
          return;
        }
      }

      // If live forecast fails or date is outside range, use fallback
      console.log('🔄 useUnifiedWeather: Using fallback weather for', cityName);
      const fallbackWeather = WeatherFallbackService.createFallbackForecast(
        cityName,
        segmentDate,
        segmentDate.toISOString().split('T')[0],
        daysFromToday
      );
      
      setWeather(fallbackWeather);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather';
      console.error('❌ useUnifiedWeather: Weather fetch failed:', errorMessage);
      setError(errorMessage);
      
      // Use fallback on error
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
  };

  const fetchLiveForecast = async (
    cityName: string, 
    targetDate: Date,
    apiKey: string
  ): Promise<ForecastWeatherData | null> => {
    try {
      // Get coordinates first
      const coords = await getCoordinates(cityName, apiKey);
      if (!coords) {
        console.log('❌ useUnifiedWeather: Could not get coordinates for', cityName);
        return null;
      }

      // Fetch 5-day weather forecast
      const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial`;
      console.log('🌤️ useUnifiedWeather: Fetching from OpenWeatherMap API for', cityName);
      
      const response = await fetch(weatherUrl);
      
      if (!response.ok) {
        console.log('❌ useUnifiedWeather: Weather API failed:', response.status);
        return null;
      }

      const data = await response.json();
      
      if (!data.list || data.list.length === 0) {
        console.log('❌ useUnifiedWeather: No forecast data available');
        return null;
      }

      // Find the best match for our target date
      const targetDateString = targetDate.toISOString().split('T')[0];
      
      // Look for exact date match first
      let bestMatch = data.list.find((item: any) => {
        const itemDate = new Date(item.dt * 1000).toISOString().split('T')[0];
        return itemDate === targetDateString;
      });

      // If no exact match, find closest match
      if (!bestMatch) {
        const targetTime = targetDate.getTime();
        bestMatch = data.list.reduce((closest: any, item: any) => {
          const itemTime = new Date(item.dt * 1000).getTime();
          const closestTime = new Date(closest.dt * 1000).getTime();
          
          return Math.abs(itemTime - targetTime) < Math.abs(closestTime - targetTime) ? item : closest;
        });
      }

      if (!bestMatch) {
        console.log('❌ useUnifiedWeather: No suitable forecast match found');
        return null;
      }

      // Create live forecast data - ensure this is marked as live
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
        isActualForecast: true, // CRITICAL: This ensures it's treated as live forecast
        source: 'live_forecast' as const // CRITICAL: This marks it as live
      };

      console.log('✅ useUnifiedWeather: Created live forecast data:', {
        cityName,
        temperature: liveWeather.temperature,
        isActualForecast: liveWeather.isActualForecast,
        source: liveWeather.source,
        description: liveWeather.description
      });

      return liveWeather;
      
    } catch (error) {
      console.error('❌ useUnifiedWeather: Live forecast fetch error:', error);
      return null;
    }
  };

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

  const refetch = () => {
    fetchWeatherData();
  };

  useEffect(() => {
    fetchWeatherData();
  }, [cityName, segmentDate, segmentDay]);

  return {
    weather,
    loading,
    error,
    refetch
  };
};
