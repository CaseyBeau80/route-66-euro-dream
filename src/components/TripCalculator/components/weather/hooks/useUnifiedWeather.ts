
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherFallbackService } from '@/components/Route66Map/services/weather/WeatherFallbackService';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';

interface UseUnifiedWeatherProps {
  cityName: string;
  segmentDate: Date | null;
  segmentDay: number;
}

export const useUnifiedWeather = ({ cityName, segmentDate, segmentDay }: UseUnifiedWeatherProps) => {
  const [weather, setWeather] = React.useState<ForecastWeatherData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [fetchKey, setFetchKey] = React.useState(0);

  const fetchWeather = React.useCallback(async () => {
    if (!segmentDate) {
      console.log('🚫 STANDARDIZED: No segment date provided for', cityName);
      return;
    }

    console.log('🚀 STANDARDIZED: Starting weather fetch with unified logic:', cityName, {
      segmentDate: segmentDate.toISOString(),
      segmentDay,
      standardizedApiKeyDetection: true,
      fetchKey
    });

    setLoading(true);
    setError(null);
    setWeather(null); // Clear existing weather first

    try {
      // STEP 1: Check for API key using standardized manager
      const hasValidApiKey = WeatherApiKeyManager.hasApiKey();
      console.log('🔑 STANDARDIZED: API key detection result:', {
        cityName,
        hasValidApiKey,
        source: 'WeatherApiKeyManager'
      });

      // STEP 2: Calculate days from today for live forecast range
      const daysFromNow = Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
      const isWithinForecastRange = daysFromNow >= 0 && daysFromNow <= 7;
      
      console.log('📅 STANDARDIZED: Date analysis:', {
        cityName,
        daysFromNow,
        isWithinForecastRange,
        shouldAttemptLive: hasValidApiKey && isWithinForecastRange
      });

      // STEP 3: ATTEMPT LIVE FORECAST if conditions are met
      if (hasValidApiKey && isWithinForecastRange) {
        console.log('✅ STANDARDIZED: Attempting live forecast with direct call:', cityName);
        
        const apiKey = WeatherApiKeyManager.getApiKey();
        if (apiKey) {
          const liveWeather = await fetchLiveWeatherDirect(cityName, segmentDate, apiKey);
          
          if (liveWeather) {
            console.log('🎯 STANDARDIZED: Live forecast SUCCESS:', cityName, {
              temperature: liveWeather.temperature,
              highTemp: liveWeather.highTemp,
              lowTemp: liveWeather.lowTemp,
              source: liveWeather.source,
              isActualForecast: liveWeather.isActualForecast,
              description: liveWeather.description
            });
            setWeather(liveWeather);
            setLoading(false);
            return;
          } else {
            console.warn('⚠️ STANDARDIZED: Live weather failed, using fallback for', cityName);
          }
        }
      } else {
        console.log('📝 STANDARDIZED: Skipping live weather attempt for', cityName, {
          reason: !hasValidApiKey ? 'no_valid_api_key' : 'outside_forecast_range',
          hasValidApiKey,
          isWithinForecastRange,
          daysFromNow
        });
      }

      // STEP 4: Create fallback weather
      console.log('🔄 STANDARDIZED: Creating fallback weather for', cityName);
      const fallbackWeather = createStandardizedFallback(cityName, segmentDate, segmentDay);
      setWeather(fallbackWeather);

    } catch (err) {
      console.error('❌ STANDARDIZED: Weather fetch error for', cityName, err);
      const fallbackWeather = createStandardizedFallback(cityName, segmentDate, segmentDay);
      setWeather(fallbackWeather);
      setError('Weather temporarily unavailable');
    } finally {
      setLoading(false);
    }
  }, [cityName, segmentDate?.getTime(), segmentDay, fetchKey]);

  // Auto-fetch when dependencies change
  React.useEffect(() => {
    if (segmentDate && !loading && !weather) {
      console.log('🔄 STANDARDIZED: Auto-triggering weather fetch for', cityName, {
        hasSegmentDate: !!segmentDate,
        loading,
        hasWeather: !!weather
      });
      fetchWeather();
    }
  }, [segmentDate?.getTime(), fetchWeather, loading, weather]);

  // Manual refetch - increment fetchKey to force new fetch
  const refetch = React.useCallback(() => {
    console.log('🔄 STANDARDIZED: Manual refetch triggered for', cityName);
    setFetchKey(prev => prev + 1);
    setWeather(null);
    setError(null);
  }, [cityName]);

  return {
    weather,
    loading,
    error,
    refetch
  };
};

// Enhanced live weather fetching with proper temperature range extraction
const fetchLiveWeatherDirect = async (
  cityName: string,
  targetDate: Date,
  apiKey: string
): Promise<ForecastWeatherData | null> => {
  try {
    console.log('🌤️ STANDARDIZED: Starting fetchLiveWeatherDirect:', cityName);

    // Get coordinates
    const coords = await getCoordinatesStandardized(cityName, apiKey);
    if (!coords) {
      console.log('❌ STANDARDIZED: Failed to get coordinates for', cityName);
      return null;
    }

    console.log('✅ STANDARDIZED: Got coordinates for', cityName, coords);

    // Fetch weather data
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial`;
    const response = await fetch(weatherUrl);

    if (!response.ok) {
      console.log('❌ STANDARDIZED: Weather API failed for', cityName, {
        status: response.status,
        statusText: response.statusText
      });
      return null;
    }

    const data = await response.json();
    if (!data.list || data.list.length === 0) {
      console.log('❌ STANDARDIZED: No forecast data for', cityName);
      return null;
    }

    console.log('✅ STANDARDIZED: Got forecast data for', cityName, {
      forecastItems: data.list.length,
      firstItemDate: data.list[0]?.dt_txt,
      lastItemDate: data.list[data.list.length - 1]?.dt_txt
    });

    // Find all forecast items for the target date
    const targetDateString = targetDate.toISOString().split('T')[0];
    const dateMatches = data.list.filter((item: any) => {
      const itemDate = new Date(item.dt * 1000).toISOString().split('T')[0];
      return itemDate === targetDateString;
    });

    let bestMatch = null;
    let highTemp = -Infinity;
    let lowTemp = Infinity;

    if (dateMatches.length > 0) {
      // Use exact date matches and calculate proper temperature range
      console.log('📅 STANDARDIZED: Found', dateMatches.length, 'exact date matches for', targetDateString);
      
      // Calculate temperature range from all forecast items for this date
      dateMatches.forEach((item: any) => {
        const temp = item.main.temp;
        const tempMax = item.main.temp_max;
        const tempMin = item.main.temp_min;
        
        // Track the highest and lowest temperatures across all forecasts for this date
        highTemp = Math.max(highTemp, temp, tempMax);
        lowTemp = Math.min(lowTemp, temp, tempMin);
      });
      
      // Use the midday forecast (closest to noon) as representative
      bestMatch = dateMatches.reduce((closest: any, current: any) => {
        const currentHour = new Date(current.dt * 1000).getHours();
        const closestHour = new Date(closest.dt * 1000).getHours();
        return Math.abs(currentHour - 12) < Math.abs(closestHour - 12) ? current : closest;
      });
    } else {
      // Use closest match if no exact date
      const targetTime = targetDate.getTime();
      bestMatch = data.list.reduce((closest: any, current: any) => {
        const currentTime = new Date(current.dt * 1000).getTime();
        const closestTime = new Date(closest.dt * 1000).getTime();
        return Math.abs(currentTime - targetTime) < Math.abs(closestTime - targetTime) 
          ? current : closest;
      });
      
      // For single match, use its temperature range
      highTemp = Math.max(bestMatch.main.temp, bestMatch.main.temp_max);
      lowTemp = Math.min(bestMatch.main.temp, bestMatch.main.temp_min);
    }

    if (!bestMatch) {
      console.log('❌ STANDARDIZED: No suitable forecast match for', cityName);
      return null;
    }

    const matchedDate = new Date(bestMatch.dt * 1000).toISOString().split('T')[0];
    console.log('✅ STANDARDIZED: Weather match found:', {
      cityName,
      targetDate: targetDateString,
      matchedDate,
      matchType: matchedDate === targetDateString ? 'exact' : 'closest',
      highTemp: Math.round(highTemp),
      lowTemp: Math.round(lowTemp),
      temperature: Math.round(bestMatch.main.temp),
      description: bestMatch.weather[0]?.description
    });

    // Create live forecast with correct source and temperature range
    const liveWeatherResult: ForecastWeatherData = {
      temperature: Math.round(bestMatch.main.temp),
      highTemp: Math.round(highTemp),
      lowTemp: Math.round(lowTemp),
      description: bestMatch.weather[0]?.description || 'Partly Cloudy',
      icon: bestMatch.weather[0]?.icon || '02d',
      humidity: bestMatch.main.humidity || 50,
      windSpeed: Math.round(bestMatch.wind?.speed || 0),
      precipitationChance: Math.round((bestMatch.pop || 0) * 100),
      cityName,
      forecast: [],
      forecastDate: targetDate,
      isActualForecast: true, // CRITICAL: Must be true for live forecasts
      source: 'live_forecast' as const // CRITICAL: Must be 'live_forecast'
    };

    console.log('🎯 STANDARDIZED: Live forecast created with verified properties:', {
      cityName,
      temperature: liveWeatherResult.temperature,
      highTemp: liveWeatherResult.highTemp,
      lowTemp: liveWeatherResult.lowTemp,
      isActualForecast: liveWeatherResult.isActualForecast,
      source: liveWeatherResult.source,
      description: liveWeatherResult.description,
      temperatureRange: `${liveWeatherResult.highTemp}°F/${liveWeatherResult.lowTemp}°F`
    });

    return liveWeatherResult;
  } catch (error) {
    console.error('❌ STANDARDIZED: fetchLiveWeatherDirect error:', error);
    return null;
  }
};

// Enhanced geocoding
const getCoordinatesStandardized = async (cityName: string, apiKey: string) => {
  try {
    let cleanCityName = cityName.replace(/,\s*[A-Z]{2}$/, '').trim();
    cleanCityName = cleanCityName.replace(/\s*(Route 66|Historic Route 66)/gi, '');
    
    console.log('🔍 STANDARDIZED: Geocoding for:', cityName, '→', cleanCityName);

    const strategies = [
      `${cleanCityName},US`,
      `${cleanCityName}, United States`,
      cleanCityName
    ];

    for (const searchTerm of strategies) {
      try {
        const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchTerm)}&limit=5&appid=${apiKey}`;
        
        const response = await fetch(geocodingUrl);
        if (!response.ok) continue;

        const data = await response.json();
        if (!data || data.length === 0) continue;

        const usResult = data.find((r: any) => r.country === 'US') || data[0];
        const coords = { lat: usResult.lat, lng: usResult.lon };
        
        console.log('✅ STANDARDIZED: Coordinates found with strategy:', searchTerm, coords);
        return coords;
      } catch (err) {
        console.warn('⚠️ STANDARDIZED: Geocoding strategy failed:', searchTerm, err);
        continue;
      }
    }
    
    console.log('❌ STANDARDIZED: All geocoding strategies failed for', cityName);
    return null;
  } catch (error) {
    console.error('❌ STANDARDIZED: Geocoding error:', error);
    return null;
  }
};

// Standardized fallback weather creation
const createStandardizedFallback = (cityName: string, targetDate: Date, segmentDay: number): ForecastWeatherData => {
  const targetDateString = targetDate.toISOString().split('T')[0];
  const daysFromToday = Math.ceil((targetDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
  
  console.log('🔄 STANDARDIZED: Creating fallback weather:', {
    cityName,
    targetDateString,
    daysFromToday,
    segmentDay
  });

  const fallbackWeather = WeatherFallbackService.createFallbackForecast(
    cityName,
    targetDate,
    targetDateString,
    daysFromToday
  );

  console.log('✅ STANDARDIZED: Fallback weather created:', {
    cityName,
    temperature: fallbackWeather.temperature,
    highTemp: fallbackWeather.highTemp,
    lowTemp: fallbackWeather.lowTemp,
    description: fallbackWeather.description,
    source: fallbackWeather.source,
    isActualForecast: fallbackWeather.isActualForecast
  });

  return fallbackWeather;
};
