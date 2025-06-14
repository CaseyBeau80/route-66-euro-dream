
import { useState, useEffect } from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { getWeatherDataForTripDate } from '../getWeatherDataForTripDate';

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
      console.log('🌤️ useUnifiedWeather: Fetching weather data:', {
        cityName,
        segmentDate: segmentDate.toISOString(),
        segmentDay
      });

      const weatherData = await getWeatherDataForTripDate(cityName, segmentDate);
      
      // Ensure weatherData conforms to ForecastWeatherData type
      if (weatherData) {
        const normalizedWeather: ForecastWeatherData = {
          temperature: Math.round((weatherData.highTemp + weatherData.lowTemp) / 2),
          highTemp: weatherData.highTemp,
          lowTemp: weatherData.lowTemp,
          forecast: [],
          forecastDate: segmentDate,
          description: weatherData.description || 'Weather forecast',
          icon: weatherData.icon || '02d',
          humidity: weatherData.humidity || 60,
          windSpeed: weatherData.windSpeed || 8,
          precipitationChance: weatherData.precipitationChance || 20,
          cityName: weatherData.cityName,
          source: weatherData.source === 'live_forecast' ? 'live_forecast' : 'historical_fallback',
          isActualForecast: weatherData.isActualForecast || false
        };
        
        setWeather(normalizedWeather);
        
        console.log('✅ useUnifiedWeather: Weather data received:', {
          cityName,
          temperature: normalizedWeather.temperature,
          source: normalizedWeather.source,
          isActualForecast: normalizedWeather.isActualForecast
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather';
      console.error('❌ useUnifiedWeather: Weather fetch failed:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
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
