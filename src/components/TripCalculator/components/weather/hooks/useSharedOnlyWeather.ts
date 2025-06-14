
import { useState, useEffect, useCallback } from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';

interface UseSharedOnlyWeatherParams {
  cityName: string;
  segmentDate: Date | null;
  segmentDay: number;
}

export const useSharedOnlyWeather = ({
  cityName,
  segmentDate,
  segmentDay
}: UseSharedOnlyWeatherParams) => {
  const [weather, setWeather] = useState<ForecastWeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ALWAYS check for live weather preference from URL
  const urlParams = new URLSearchParams(window.location.search);
  const useLiveWeatherParam = urlParams.get('useLiveWeather');
  const shouldUseLiveWeather = useLiveWeatherParam !== 'false'; // Default to true

  const fetchSharedOnlyWeather = useCallback(async () => {
    if (!segmentDate) {
      console.log('useSharedOnlyWeather - No segment date provided for', cityName);
      setWeather(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔥 SHARED ONLY: useSharedOnlyWeather starting fetch for', cityName, {
        shouldUseLiveWeather,
        useLiveWeatherParam,
        segmentDate: segmentDate.toISOString(),
        sharedOnlyLogic: true
      });

      // Check API key
      const apiKey = WeatherApiKeyManager.getApiKey();
      const hasValidApiKey = !!apiKey && apiKey !== 'YOUR_API_KEY_HERE' && apiKey.length > 10;

      if (!hasValidApiKey || !shouldUseLiveWeather) {
        console.log('🔥 SHARED ONLY: Using fallback weather for', cityName, {
          reason: !hasValidApiKey ? 'NO_API_KEY' : 'LIVE_WEATHER_DISABLED',
          shouldUseLiveWeather,
          hasValidApiKey
        });
        
        const fallbackWeather = createSharedOnlyFallback(cityName, segmentDate);
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

      console.log('🔥 SHARED ONLY: Date analysis for', cityName, {
        today: today.toISOString().split('T')[0],
        targetDate: targetDate.toISOString().split('T')[0],
        daysFromToday,
        isWithinRange: daysFromToday >= 0 && daysFromToday <= 7,
        shouldUseLiveWeather
      });

      // ALWAYS attempt live weather if within range AND live weather is enabled
      if ((daysFromToday >= 0 && daysFromToday <= 7) && shouldUseLiveWeather) {
        console.log('🔥 SHARED ONLY: Attempting live weather fetch for', cityName);
        
        const liveWeather = await fetchSharedOnlyLiveWeather(cityName, segmentDate, apiKey);
        
        if (liveWeather) {
          console.log('✅ SHARED ONLY: Live weather SUCCESS for', cityName, {
            temperature: liveWeather.temperature,
            source: liveWeather.source,
            isActualForecast: liveWeather.isActualForecast
          });
          
          setWeather(liveWeather);
          setLoading(false);
          return;
        }
      }

      // Fallback to historical weather
      console.log('🔄 SHARED ONLY: Using fallback weather for', cityName);
      const fallbackWeather = createSharedOnlyFallback(cityName, segmentDate);
      setWeather(fallbackWeather);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather';
      console.error('❌ SHARED ONLY: useSharedOnlyWeather error:', errorMessage);
      setError(errorMessage);
      
      // Fallback weather on error
      const fallbackWeather = createSharedOnlyFallback(cityName, segmentDate);
      setWeather(fallbackWeather);
    } finally {
      setLoading(false);
    }
  }, [cityName, segmentDate, segmentDay, shouldUseLiveWeather]);

  useEffect(() => {
    fetchSharedOnlyWeather();
  }, [fetchSharedOnlyWeather]);

  return {
    weather,
    loading,
    error
  };
};

// Separate live weather fetch for shared views
async function fetchSharedOnlyLiveWeather(
  cityName: string, 
  targetDate: Date, 
  apiKey: string
): Promise<ForecastWeatherData | null> {
  try {
    console.log('🔥 SHARED ONLY: fetchSharedOnlyLiveWeather starting for', cityName);
    
    // Get coordinates
    const coords = await getSharedOnlyCoordinates(cityName, apiKey);
    if (!coords) {
      console.log('❌ SHARED ONLY: Could not get coordinates for', cityName);
      return null;
    }

    // Fetch weather forecast
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial`;
    const response = await fetch(weatherUrl);

    if (!response.ok) {
      console.log('❌ SHARED ONLY: Weather API failed for', cityName, response.status);
      return null;
    }

    const data = await response.json();
    if (!data.list || data.list.length === 0) {
      console.log('❌ SHARED ONLY: No forecast data for', cityName);
      return null;
    }

    // Find best match for target date
    const targetDateString = targetDate.toISOString().split('T')[0];
    const bestMatch = data.list.find((item: any) => {
      const itemDate = new Date(item.dt * 1000).toISOString().split('T')[0];
      return itemDate === targetDateString;
    }) || data.list[0];

    // Create EXPLICIT live forecast for shared view
    const sharedOnlyLiveWeather: ForecastWeatherData = {
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
      isActualForecast: true, // EXPLICIT: Always true for API data
      source: 'live_forecast' as const // EXPLICIT: Always live_forecast for API data
    };

    console.log('✅ SHARED ONLY: Created live forecast for', cityName, {
      temperature: sharedOnlyLiveWeather.temperature,
      isActualForecast: sharedOnlyLiveWeather.isActualForecast,
      source: sharedOnlyLiveWeather.source,
      description: sharedOnlyLiveWeather.description
    });

    return sharedOnlyLiveWeather;
  } catch (error) {
    console.error('❌ SHARED ONLY: Live weather fetch failed for', cityName, error);
    return null;
  }
}

// Geocoding helper for shared views
async function getSharedOnlyCoordinates(cityName: string, apiKey: string) {
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
    console.error('❌ SHARED ONLY: Geocoding error:', error);
    return null;
  }
}

// Simple fallback for shared views
function createSharedOnlyFallback(cityName: string, targetDate: Date): ForecastWeatherData {
  return {
    temperature: 72,
    highTemp: 78,
    lowTemp: 65,
    description: 'Partly Cloudy',
    icon: '02d',
    humidity: 55,
    windSpeed: 8,
    precipitationChance: 20,
    cityName: cityName,
    forecast: [],
    forecastDate: targetDate,
    isActualForecast: false, // EXPLICIT: Always false for fallback
    source: 'historical_fallback' as const // EXPLICIT: Always historical for fallback
  };
}
