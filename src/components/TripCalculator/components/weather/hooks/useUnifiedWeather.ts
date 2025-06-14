
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
      segmentDay,
      prioritizingLiveWeather: true
    });

    setLoading(true);
    setError(null);

    try {
      // Step 1: AGGRESSIVE API key detection - check multiple storage locations
      const apiKey = WeatherApiKeyManager.getApiKey() || 
                   localStorage.getItem('weather_api_key') || 
                   localStorage.getItem('openweathermap_api_key');

      const hasValidApiKey = apiKey && apiKey.length > 20 && 
                            !apiKey.includes('your_api_key') && 
                            !apiKey.includes('placeholder');

      console.log('🔑 UNIFIED: Enhanced API key detection for', cityName, {
        hasApiKey: !!apiKey,
        keyLength: apiKey?.length || 0,
        hasValidApiKey,
        keyPreview: hasValidApiKey ? `${apiKey.substring(0, 8)}...` : 'none'
      });

      // Step 2: Calculate days from today - be more permissive for shared views
      const daysFromNow = Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
      const isWithinForecastRange = daysFromNow >= -1 && daysFromNow <= 6; // Allow yesterday to 6 days ahead
      
      console.log('📅 UNIFIED: Date analysis for', cityName, {
        daysFromNow,
        isWithinForecastRange,
        shouldAttemptLive: hasValidApiKey && isWithinForecastRange
      });

      // Step 3: PRIORITIZE live forecast for shared views
      if (hasValidApiKey && isWithinForecastRange) {
        console.log('✅ UNIFIED: Attempting LIVE WEATHER for shared view:', cityName);
        
        const liveWeather = await fetchLiveWeatherDirect(cityName, segmentDate, apiKey);
        
        if (liveWeather) {
          console.log('🎯 UNIFIED: LIVE WEATHER SUCCESS for', cityName, {
            temperature: liveWeather.temperature,
            source: liveWeather.source,
            isActualForecast: liveWeather.isActualForecast,
            description: liveWeather.description
          });
          setWeather(liveWeather);
          setLoading(false);
          return;
        } else {
          console.warn('⚠️ UNIFIED: Live weather failed, will use fallback for', cityName);
        }
      } else {
        console.log('📝 UNIFIED: Skipping live weather for', cityName, {
          reason: !hasValidApiKey ? 'no_api_key' : 'outside_forecast_range',
          hasValidApiKey,
          isWithinForecastRange
        });
      }

      // Step 4: Use fallback weather
      console.log('🔄 UNIFIED: Creating fallback weather for', cityName);
      const fallbackWeather = createFallbackWeather(cityName, segmentDate, segmentDay);
      setWeather(fallbackWeather);

    } catch (err) {
      console.error('❌ UNIFIED: Weather fetch error for', cityName, err);
      const fallbackWeather = createFallbackWeather(cityName, segmentDate, segmentDay);
      setWeather(fallbackWeather);
      setError('Weather temporarily unavailable');
    } finally {
      setLoading(false);
    }
  }, [cityName, segmentDate?.getTime(), segmentDay]);

  // Auto-fetch when dependencies change
  React.useEffect(() => {
    if (segmentDate) {
      console.log('🔄 UNIFIED: Auto-triggering weather fetch for', cityName);
      fetchWeather();
    }
  }, [segmentDate?.getTime(), fetchWeather]);

  return {
    weather,
    loading,
    error,
    refetch: fetchWeather
  };
};

// Enhanced live weather fetching with better error handling
const fetchLiveWeatherDirect = async (
  cityName: string,
  targetDate: Date,
  apiKey: string
): Promise<ForecastWeatherData | null> => {
  try {
    console.log('🌤️ UNIFIED: Starting enhanced live weather fetch for', cityName);

    // Get coordinates with better city name processing
    const coords = await getCoordinatesEnhanced(cityName, apiKey);
    if (!coords) {
      console.log('❌ UNIFIED: Failed to get coordinates for', cityName);
      return null;
    }

    console.log('✅ UNIFIED: Got coordinates for', cityName, coords);

    // Fetch weather data
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial`;
    const response = await fetch(weatherUrl);

    if (!response.ok) {
      console.log('❌ UNIFIED: Weather API failed for', cityName, response.status);
      return null;
    }

    const data = await response.json();
    if (!data.list || data.list.length === 0) {
      console.log('❌ UNIFIED: No forecast data for', cityName);
      return null;
    }

    console.log('✅ UNIFIED: Got forecast data for', cityName, {
      forecastItems: data.list.length,
      firstItemDate: data.list[0]?.dt_txt
    });

    // Find best match for target date
    const targetDateString = targetDate.toISOString().split('T')[0];
    let bestMatch = data.list.find((item: any) => {
      const itemDate = new Date(item.dt * 1000).toISOString().split('T')[0];
      return itemDate === targetDateString;
    });

    // If no exact match, use closest
    if (!bestMatch) {
      const targetTime = targetDate.getTime();
      bestMatch = data.list.reduce((closest: any, current: any) => {
        const currentTime = new Date(current.dt * 1000).getTime();
        const closestTime = new Date(closest.dt * 1000).getTime();
        return Math.abs(currentTime - targetTime) < Math.abs(closestTime - targetTime) 
          ? current : closest;
      });
    }

    if (!bestMatch) {
      console.log('❌ UNIFIED: No suitable forecast match for', cityName);
      return null;
    }

    const liveWeather: ForecastWeatherData = {
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
      isActualForecast: true, // CRITICAL: This marks it as live weather
      source: 'live_forecast' as const // CRITICAL: This shows it's live
    };

    console.log('🎯 UNIFIED: LIVE FORECAST CREATED for', cityName, {
      temperature: liveWeather.temperature,
      isActualForecast: liveWeather.isActualForecast,
      source: liveWeather.source
    });

    return liveWeather;
  } catch (error) {
    console.error('❌ UNIFIED: Live weather fetch error:', error);
    return null;
  }
};

// Enhanced geocoding function
const getCoordinatesEnhanced = async (cityName: string, apiKey: string) => {
  try {
    // Clean city name - remove state abbreviations, Route 66 references
    let cleanCityName = cityName.replace(/,\s*[A-Z]{2}$/, '').trim();
    cleanCityName = cleanCityName.replace(/\s*(Route 66|Historic Route 66)/gi, '');
    
    console.log('🔍 UNIFIED: Enhanced geocoding for', cityName, '→', cleanCityName);

    const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cleanCityName + ',US')}&limit=5&appid=${apiKey}`;
    
    const response = await fetch(geocodingUrl);
    if (!response.ok) {
      console.log('❌ UNIFIED: Geocoding failed for', cleanCityName);
      return null;
    }

    const data = await response.json();
    if (!data || data.length === 0) {
      // Try without ,US suffix
      const altUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cleanCityName)}&limit=5&appid=${apiKey}`;
      const altResponse = await fetch(altUrl);
      
      if (altResponse.ok) {
        const altData = await altResponse.json();
        if (altData && altData.length > 0) {
          const usResult = altData.find((r: any) => r.country === 'US') || altData[0];
          return { lat: usResult.lat, lng: usResult.lon };
        }
      }
      
      return null;
    }

    // Prefer US results
    const usResult = data.find((r: any) => r.country === 'US') || data[0];
    return { lat: usResult.lat, lng: usResult.lon };
  } catch (error) {
    console.error('❌ UNIFIED: Geocoding error:', error);
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
