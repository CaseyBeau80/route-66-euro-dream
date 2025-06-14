
import { useState, useEffect, useCallback } from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';

interface UseUnifiedWeatherProps {
  cityName: string;
  segmentDate: Date | null;
  segmentDay: number;
  prioritizeCachedData?: boolean;
  cachedWeather?: ForecastWeatherData | null;
}

interface UseUnifiedWeatherReturn {
  weather: ForecastWeatherData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useUnifiedWeather = ({
  cityName,
  segmentDate,
  segmentDay,
  prioritizeCachedData = false,
  cachedWeather = null
}: UseUnifiedWeatherProps): UseUnifiedWeatherReturn => {
  const [weather, setWeather] = useState<ForecastWeatherData | null>(cachedWeather);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const refetch = useCallback(() => {
    setRefetchTrigger(prev => prev + 1);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!segmentDate) {
        console.log('❌ FIXED: No segment date provided for', cityName);
        setLoading(false);
        return;
      }

      console.log('🌤️ FIXED: Starting weather fetch for', cityName, {
        segmentDate: segmentDate.toISOString(),
        segmentDay,
        refetchTrigger
      });

      setLoading(true);
      setError(null);

      try {
        // Check for valid API key
        const apiKey = WeatherApiKeyManager.getApiKey();
        const hasValidKey = WeatherApiKeyManager.hasApiKey() && apiKey && apiKey.length > 10;

        console.log('🔑 FIXED: API key check for', cityName, {
          hasValidKey,
          keyLength: apiKey?.length || 0
        });

        // Calculate if we're within forecast range (0-7 days)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const targetDate = new Date(segmentDate);
        targetDate.setHours(0, 0, 0, 0);
        
        const timeDiff = targetDate.getTime() - today.getTime();
        const daysFromToday = Math.ceil(timeDiff / (24 * 60 * 60 * 1000));
        const isWithinForecastRange = daysFromToday >= 0 && daysFromToday <= 7;

        console.log('📅 FIXED: Date analysis for', cityName, {
          today: today.toISOString(),
          targetDate: targetDate.toISOString(),
          daysFromToday,
          isWithinForecastRange
        });

        // Try live weather if conditions are met
        if (hasValidKey && isWithinForecastRange && apiKey) {
          console.log('🚀 FIXED: Attempting live weather for', cityName);
          
          const liveWeather = await fetchLiveWeatherFixed(cityName, targetDate, apiKey);
          if (liveWeather) {
            console.log('✅ FIXED: Live weather SUCCESS for', cityName, {
              temperature: liveWeather.temperature,
              source: liveWeather.source,
              isActualForecast: liveWeather.isActualForecast,
              VERIFICATION: {
                sourceIsLive: liveWeather.source === 'live_forecast',
                isActualIsTrue: liveWeather.isActualForecast === true,
                BOTH_CORRECT: liveWeather.source === 'live_forecast' && liveWeather.isActualForecast === true
              }
            });
            setWeather(liveWeather);
            setLoading(false);
            return;
          }
        }

        // Fallback to historical weather
        console.log('🔄 FIXED: Using historical fallback for', cityName);
        const fallbackWeather = createHistoricalWeatherFixed(cityName, targetDate);
        setWeather(fallbackWeather);

      } catch (err) {
        console.error('❌ FIXED: Weather fetch error for', cityName, ':', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        
        // Still provide fallback weather on error
        if (segmentDate) {
          const fallbackWeather = createHistoricalWeatherFixed(cityName, segmentDate);
          setWeather(fallbackWeather);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [cityName, segmentDate, segmentDay, refetchTrigger]);

  return { weather, loading, error, refetch };
};

// FIXED: Enhanced live weather fetching with guaranteed live marking
const fetchLiveWeatherFixed = async (
  cityName: string,
  targetDate: Date,
  apiKey: string
): Promise<ForecastWeatherData | null> => {
  try {
    console.log('🌐 FIXED: fetchLiveWeatherFixed starting for', cityName);

    // Get coordinates
    const coords = await getCoordinatesFixed(cityName, apiKey);
    if (!coords) {
      console.log('❌ FIXED: No coordinates for', cityName);
      return null;
    }

    console.log('📍 FIXED: Got coordinates for', cityName, coords);

    // Fetch 5-day forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial`;
    console.log('🌐 FIXED: Fetching from OpenWeather API for', cityName);
    
    const response = await fetch(forecastUrl);

    if (!response.ok) {
      console.error('❌ FIXED: API response failed:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    
    if (!data.list || data.list.length === 0) {
      console.log('❌ FIXED: No forecast data in API response');
      return null;
    }

    console.log('📊 FIXED: Processing API forecast data for', cityName, {
      forecastItems: data.list.length
    });

    // Find best match for target date
    const targetDateString = targetDate.toISOString().split('T')[0];
    let bestMatch = null;
    
    // Look for exact date match first
    for (const item of data.list) {
      const itemDate = new Date(item.dt * 1000);
      const itemDateString = itemDate.toISOString().split('T')[0];
      
      if (itemDateString === targetDateString) {
        bestMatch = item;
        console.log('🎯 FIXED: Found exact date match for', cityName);
        break;
      }
    }
    
    // Use first item if no exact match
    if (!bestMatch) {
      bestMatch = data.list[0];
      console.log('🔄 FIXED: Using closest available forecast for', cityName);
    }

    // CRITICAL: Create weather object with GUARANTEED live properties
    const liveWeather: ForecastWeatherData = {
      temperature: Math.round(bestMatch.main.temp),
      highTemp: Math.round(bestMatch.main.temp_max || bestMatch.main.temp),
      lowTemp: Math.round(bestMatch.main.temp_min || bestMatch.main.temp),
      description: bestMatch.weather[0]?.description || 'Clear',
      icon: bestMatch.weather[0]?.icon || '01d',
      humidity: bestMatch.main.humidity || 50,
      windSpeed: Math.round(bestMatch.wind?.speed || 0),
      precipitationChance: Math.round((bestMatch.pop || 0) * 100),
      cityName: cityName,
      forecast: [],
      forecastDate: targetDate,
      // GUARANTEED LIVE PROPERTIES - THESE MUST NEVER CHANGE
      isActualForecast: true,
      source: 'live_forecast' as const
    };

    console.log('🔥 FIXED: LIVE WEATHER OBJECT CREATED with GUARANTEED properties:', {
      cityName,
      temperature: liveWeather.temperature,
      isActualForecast: liveWeather.isActualForecast,
      source: liveWeather.source,
      CRITICAL_CHECK: {
        sourceIsLiveForecast: liveWeather.source === 'live_forecast',
        isActualForecastIsTrue: liveWeather.isActualForecast === true,
        BOTH_PROPERTIES_CORRECT: liveWeather.source === 'live_forecast' && liveWeather.isActualForecast === true
      }
    });

    return liveWeather;
  } catch (error) {
    console.error('❌ FIXED: Live weather fetch error:', error);
    return null;
  }
};

// FIXED: Geocoding helper
const getCoordinatesFixed = async (cityName: string, apiKey: string) => {
  try {
    const cleanCityName = cityName.replace(/,\s*[A-Z]{2}$/, '').trim();
    const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cleanCityName)}&limit=3&appid=${apiKey}`;
    
    const response = await fetch(geocodingUrl);
    if (!response.ok) {
      console.error('❌ FIXED: Geocoding failed:', response.status);
      return null;
    }

    const data = await response.json();
    if (!data || data.length === 0) {
      console.log('❌ FIXED: No geocoding results for', cleanCityName);
      return null;
    }

    const result = data.find((r: any) => r.country === 'US') || data[0];
    return { lat: result.lat, lng: result.lon };
  } catch (error) {
    console.error('❌ FIXED: Geocoding error:', error);
    return null;
  }
};

// FIXED: Historical fallback weather creation
const createHistoricalWeatherFixed = (cityName: string, targetDate: Date): ForecastWeatherData => {
  const month = targetDate.getMonth();
  const isWinter = month === 11 || month === 0 || month === 1;
  const isSummer = month >= 5 && month <= 8;
  
  const baseTemp = isWinter ? 45 : isSummer ? 85 : 65;
  const tempVariation = Math.random() * 20 - 10;
  const temperature = Math.round(baseTemp + tempVariation);
  
  const historicalWeather: ForecastWeatherData = {
    temperature,
    highTemp: temperature + 8,
    lowTemp: temperature - 8,
    description: isWinter ? 'Partly cloudy' : isSummer ? 'Sunny' : 'Clear',
    icon: isWinter ? '02d' : isSummer ? '01d' : '01d',
    humidity: Math.round(40 + Math.random() * 40),
    windSpeed: Math.round(5 + Math.random() * 10),
    precipitationChance: Math.round(Math.random() * 30),
    cityName,
    forecast: [],
    forecastDate: targetDate,
    // GUARANTEED HISTORICAL PROPERTIES
    isActualForecast: false,
    source: 'historical_fallback' as const
  };

  console.log('📊 FIXED: Created historical weather for', cityName, {
    temperature: historicalWeather.temperature,
    isActualForecast: historicalWeather.isActualForecast,
    source: historicalWeather.source
  });

  return historicalWeather;
};
