
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';
import { WeatherFallbackService } from '@/components/Route66Map/services/weather/WeatherFallbackService';

interface UseUnifiedWeatherProps {
  cityName: string;
  segmentDate: Date | null;
  segmentDay: number;
}

export const useUnifiedWeather = ({ cityName, segmentDate, segmentDay }: UseUnifiedWeatherProps) => {
  const [weather, setWeather] = React.useState<ForecastWeatherData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchWeather = React.useCallback(async () => {
    if (!segmentDate) {
      console.log('🚫 UNIFIED: No segment date, skipping fetch for', cityName);
      return;
    }

    console.log('🚀 UNIFIED: Starting weather fetch for', cityName, {
      segmentDate: segmentDate.toISOString(),
      segmentDay
    });

    setLoading(true);
    setError(null);

    try {
      // Step 1: Check API key using the same method everywhere
      const hasApiKey = WeatherApiKeyManager.hasApiKey();
      const apiKey = WeatherApiKeyManager.getApiKey();

      console.log('🔑 UNIFIED: API key check for', cityName, {
        hasApiKey,
        keyExists: !!apiKey,
        keyLength: apiKey?.length || 0
      });

      // Step 2: Try live forecast if we have an API key and date is within range
      if (hasApiKey && apiKey) {
        const daysFromNow = Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
        
        if (daysFromNow >= 0 && daysFromNow <= 5) {
          console.log('✅ UNIFIED: Attempting live forecast for', cityName);
          
          const liveWeather = await fetchLiveWeather(cityName, segmentDate, apiKey);
          
          if (liveWeather) {
            console.log('✅ UNIFIED: Live forecast SUCCESS for', cityName, {
              temperature: liveWeather.temperature,
              source: liveWeather.source,
              isActualForecast: liveWeather.isActualForecast
            });
            setWeather(liveWeather);
            setLoading(false);
            return;
          }
        } else {
          console.log('📅 UNIFIED: Date outside live forecast range for', cityName, { daysFromNow });
        }
      }

      // Step 3: Use fallback weather
      console.log('🔄 UNIFIED: Using fallback weather for', cityName);
      const fallbackWeather = createFallbackWeather(cityName, segmentDate, segmentDay);
      setWeather(fallbackWeather);

    } catch (err) {
      console.error('❌ UNIFIED: Weather fetch error for', cityName, err);
      const fallbackWeather = createFallbackWeather(cityName, segmentDate, segmentDay);
      setWeather(fallbackWeather);
      setError('Using fallback weather data');
    } finally {
      setLoading(false);
    }
  }, [cityName, segmentDate?.getTime(), segmentDay]);

  // Auto-fetch when dependencies change
  React.useEffect(() => {
    if (segmentDate && !weather && !loading) {
      console.log('🔄 UNIFIED: Auto-triggering weather fetch for', cityName);
      fetchWeather();
    }
  }, [segmentDate?.getTime(), weather, loading, fetchWeather]);

  return {
    weather,
    loading,
    error,
    refetch: fetchWeather
  };
};

// Helper function to fetch live weather
const fetchLiveWeather = async (
  cityName: string,
  targetDate: Date,
  apiKey: string
): Promise<ForecastWeatherData | null> => {
  try {
    // Get coordinates
    const coords = await getCoordinates(cityName, apiKey);
    if (!coords) return null;

    // Fetch weather data
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial`;
    const response = await fetch(weatherUrl);

    if (!response.ok) return null;

    const data = await response.json();
    if (!data.list || data.list.length === 0) return null;

    // Find best match
    const targetDateString = targetDate.toISOString().split('T')[0];
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
      cityName,
      forecast: [],
      forecastDate: targetDate,
      isActualForecast: true,
      source: 'live_forecast' as const
    };
  } catch (error) {
    console.error('❌ UNIFIED: Live weather fetch failed:', error);
    return null;
  }
};

// Helper function to get coordinates
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
    return null;
  }
};

// Helper function to create fallback weather
const createFallbackWeather = (cityName: string, targetDate: Date, segmentDay: number): ForecastWeatherData => {
  const targetDateString = targetDate.toISOString().split('T')[0];
  const daysFromToday = Math.ceil((targetDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
  
  return WeatherFallbackService.createFallbackForecast(
    cityName,
    targetDate,
    targetDateString,
    daysFromToday
  );
};
