
import React from 'react';
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
  segmentDay
}: UseUnifiedWeatherParams) => {
  const [weather, setWeather] = React.useState<ForecastWeatherData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchLiveWeather = React.useCallback(async () => {
    if (!segmentDate) return null;

    const apiKey = WeatherApiKeyManager.getApiKey();
    if (!apiKey || apiKey === 'your_api_key_here') {
      console.log('🔄 useUnifiedWeather: No valid API key - using fallback for', cityName);
      return createFallbackWeather();
    }

    // Check if date is within live forecast range (0-7 days from today)
    const today = new Date();
    const daysFromToday = Math.ceil((segmentDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
    
    if (daysFromToday < 0 || daysFromToday > 7) {
      console.log('🔄 useUnifiedWeather: Date outside forecast range - using fallback for', cityName, { daysFromToday });
      return createFallbackWeather();
    }

    try {
      console.log('🌤️ useUnifiedWeather: Fetching LIVE weather for', cityName, {
        apiKeyLength: apiKey.length,
        segmentDate: segmentDate.toISOString(),
        daysFromToday
      });

      // Get coordinates
      const cleanCityName = cityName.replace(/,\s*[A-Z]{2}$/, '').trim();
      const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cleanCityName)}&limit=1&appid=${apiKey}`;
      
      const geoResponse = await fetch(geocodingUrl);
      if (!geoResponse.ok) {
        console.error('❌ useUnifiedWeather: Geocoding failed for', cityName);
        return createFallbackWeather();
      }
      
      const geoData = await geoResponse.json();
      if (!geoData || geoData.length === 0) {
        console.error('❌ useUnifiedWeather: City not found:', cityName);
        return createFallbackWeather();
      }

      const { lat, lon } = geoData[0];
      
      // Get weather forecast
      const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
      
      const weatherResponse = await fetch(weatherUrl);
      if (!weatherResponse.ok) {
        console.error('❌ useUnifiedWeather: Weather API failed for', cityName, weatherResponse.status);
        return createFallbackWeather();
      }
      
      const weatherData = await weatherResponse.json();
      if (!weatherData.list || weatherData.list.length === 0) {
        console.error('❌ useUnifiedWeather: No weather data for', cityName);
        return createFallbackWeather();
      }

      // Find best match for target date
      const targetDateString = segmentDate.toISOString().split('T')[0];
      const bestMatch = weatherData.list.find((item: any) => {
        const itemDate = new Date(item.dt * 1000).toISOString().split('T')[0];
        return itemDate === targetDateString;
      }) || weatherData.list[0];

      // Create live weather data
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
        forecastDate: segmentDate,
        isActualForecast: true,
        source: 'live_forecast' as const
      };

      console.log('✅ useUnifiedWeather: LIVE weather fetched successfully for', cityName, {
        temperature: liveWeather.temperature,
        description: liveWeather.description,
        source: liveWeather.source,
        isActualForecast: liveWeather.isActualForecast
      });

      return liveWeather;
    } catch (error) {
      console.error('❌ useUnifiedWeather: Live weather fetch failed for', cityName, error);
      return createFallbackWeather();
    }
  }, [cityName, segmentDate]);

  const createFallbackWeather = React.useCallback((): ForecastWeatherData => {
    if (!segmentDate) {
      segmentDate = new Date();
    }
    
    const targetDateString = segmentDate.toISOString().split('T')[0];
    const daysFromToday = Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
    
    return WeatherFallbackService.createFallbackForecast(
      cityName,
      segmentDate,
      targetDateString,
      daysFromToday
    );
  }, [cityName, segmentDate]);

  React.useEffect(() => {
    if (!segmentDate) return;

    setLoading(true);
    setError(null);

    fetchLiveWeather()
      .then((weatherData) => {
        if (weatherData) {
          setWeather(weatherData);
        } else {
          setWeather(createFallbackWeather());
        }
      })
      .catch((err) => {
        console.error('❌ useUnifiedWeather: Error fetching weather for', cityName, err);
        setError(err instanceof Error ? err.message : 'Weather fetch failed');
        setWeather(createFallbackWeather());
      })
      .finally(() => {
        setLoading(false);
      });
  }, [fetchLiveWeather, createFallbackWeather, cityName, segmentDate]);

  return { weather, loading, error };
};
