
import { useState, useEffect, useCallback } from 'react';
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

  const fetchWeatherData = useCallback(async () => {
    if (!segmentDate) {
      console.log('🌤️ FIXED: No segment date provided for', cityName);
      setWeather(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🌤️ FIXED: Starting weather fetch for', cityName, {
        segmentDate: segmentDate.toISOString(),
        segmentDay,
        isSharedView: window.location.pathname === '/shared-trip'
      });

      // Check API key
      const apiKey = WeatherApiKeyManager.getApiKey();
      const hasValidApiKey = !!apiKey && apiKey !== 'YOUR_API_KEY_HERE' && apiKey.length > 10;

      console.log('🔑 FIXED: API Key check:', {
        hasApiKey: !!apiKey,
        keyLength: apiKey?.length,
        isValid: hasValidApiKey
      });

      if (!hasValidApiKey) {
        console.log('❌ FIXED: No valid API key - using fallback');
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

      // Check if date is within live forecast range
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const targetDate = new Date(segmentDate);
      targetDate.setHours(0, 0, 0, 0);
      const daysFromToday = Math.ceil((targetDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));

      console.log('📅 FIXED: Date analysis:', {
        today: today.toISOString().split('T')[0],
        targetDate: targetDate.toISOString().split('T')[0],
        daysFromToday,
        isWithinLiveRange: daysFromToday >= 0 && daysFromToday <= 7
      });

      // If within live forecast range, fetch live weather
      if (daysFromToday >= 0 && daysFromToday <= 7) {
        console.log('🚀 FIXED: Attempting live weather fetch for', cityName);
        
        const liveWeather = await fetchLiveWeatherData(cityName, segmentDate, apiKey);
        
        if (liveWeather) {
          console.log('✅ FIXED: Live weather fetch successful:', {
            cityName,
            temperature: liveWeather.temperature,
            source: liveWeather.source,
            isActualForecast: liveWeather.isActualForecast
          });
          
          setWeather(liveWeather);
          setLoading(false);
          return;
        } else {
          console.log('❌ FIXED: Live weather fetch failed for', cityName);
        }
      } else {
        console.log('📊 FIXED: Date outside live range, using historical data');
      }

      // Fallback to historical weather
      const fallbackWeather = WeatherFallbackService.createFallbackForecast(
        cityName,
        segmentDate,
        segmentDate.toISOString().split('T')[0],
        daysFromToday
      );
      
      console.log('🔄 FIXED: Using fallback weather for', cityName);
      setWeather(fallbackWeather);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather';
      console.error('❌ FIXED: Weather fetch error:', errorMessage);
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
  }, [cityName, segmentDate, segmentDay]);

  const refetch = useCallback(() => {
    console.log('🔄 FIXED: Manual refetch for', cityName);
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

// Live weather fetching function with proper API integration
async function fetchLiveWeatherData(
  cityName: string, 
  targetDate: Date, 
  apiKey: string
): Promise<ForecastWeatherData | null> {
  try {
    console.log('🌤️ FIXED: fetchLiveWeatherData starting for', cityName);
    
    // Get coordinates first
    const coords = await getCoordinatesForCity(cityName, apiKey);
    if (!coords) {
      console.log('❌ FIXED: Could not get coordinates for', cityName);
      return null;
    }

    console.log('📍 FIXED: Got coordinates for', cityName, coords);

    // Fetch weather forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial`;
    
    console.log('🌐 FIXED: Making forecast API call for', cityName);
    const response = await fetch(forecastUrl);

    if (!response.ok) {
      console.log('❌ FIXED: Forecast API failed:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    console.log('📊 FIXED: Forecast API response received:', {
      cityName,
      hasData: !!data,
      hasList: !!data?.list,
      listLength: data?.list?.length || 0
    });

    if (!data.list || data.list.length === 0) {
      console.log('❌ FIXED: No forecast data available');
      return null;
    }

    // Find best forecast match for target date
    const targetDateString = targetDate.toISOString().split('T')[0];
    const bestMatch = data.list.find((item: any) => {
      const itemDate = new Date(item.dt * 1000).toISOString().split('T')[0];
      return itemDate === targetDateString;
    }) || data.list[0];

    console.log('🎯 FIXED: Found forecast match:', {
      targetDateString,
      matchDate: new Date(bestMatch.dt * 1000).toISOString().split('T')[0],
      temperature: bestMatch.main.temp
    });

    // Create live forecast data with EXPLICIT live marking
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

    console.log('✅ FIXED: Created live weather data:', {
      cityName,
      temperature: liveWeather.temperature,
      source: liveWeather.source,
      isActualForecast: liveWeather.isActualForecast,
      description: liveWeather.description
    });

    return liveWeather;
  } catch (error) {
    console.error('❌ FIXED: Live weather fetch failed:', error);
    return null;
  }
}

// Geocoding helper
async function getCoordinatesForCity(cityName: string, apiKey: string) {
  try {
    const cleanCityName = cityName.replace(/,\s*[A-Z]{2}$/, '').trim();
    const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cleanCityName)}&limit=3&appid=${apiKey}`;
    
    console.log('🌐 FIXED: Making geocoding API call for', cleanCityName);
    const response = await fetch(geocodingUrl);
    
    if (!response.ok) {
      console.log('❌ FIXED: Geocoding API failed:', response.status);
      return null;
    }

    const data = await response.json();
    if (!data || data.length === 0) {
      console.log('❌ FIXED: No geocoding results');
      return null;
    }

    const result = data.find((r: any) => r.country === 'US') || data[0];
    console.log('📍 FIXED: Geocoding successful:', { lat: result.lat, lng: result.lon });
    
    return { lat: result.lat, lng: result.lon };
  } catch (error) {
    console.error('❌ FIXED: Geocoding error:', error);
    return null;
  }
}
