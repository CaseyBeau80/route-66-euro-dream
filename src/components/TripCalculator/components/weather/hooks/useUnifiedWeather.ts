
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
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  const fetchLiveWeather = React.useCallback(async (): Promise<ForecastWeatherData | null> => {
    if (!segmentDate) {
      console.log('🔄 FIXED: No segmentDate - using fallback for', cityName);
      return createFallbackWeather();
    }

    // CRITICAL FIX: Proper API key validation
    const apiKey = WeatherApiKeyManager.getApiKey();
    console.log('🔑 CRITICAL FIX: API Key validation:', {
      hasApiKey: !!apiKey,
      isValid: apiKey && apiKey !== 'your_api_key_here' && apiKey.length > 10,
      keyLength: apiKey?.length || 0,
      cityName
    });

    if (!apiKey || apiKey === 'your_api_key_here' || apiKey.length < 10) {
      console.log('🔄 CRITICAL FIX: Invalid API key - using fallback for', cityName);
      return createFallbackWeather();
    }

    // CRITICAL FIX: Accurate date range validation
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const targetDate = new Date(segmentDate.getFullYear(), segmentDate.getMonth(), segmentDate.getDate());
    const daysFromToday = Math.floor((targetDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
    
    console.log('🌤️ CRITICAL FIX: Date range validation for', cityName, {
      today: today.toISOString().split('T')[0],
      targetDate: targetDate.toISOString().split('T')[0],
      daysFromToday,
      isWithinRange: daysFromToday >= 0 && daysFromToday <= 5,
      calculation: {
        todayTime: today.getTime(),
        targetTime: targetDate.getTime(),
        difference: targetDate.getTime() - today.getTime(),
        differenceDays: (targetDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)
      }
    });

    if (daysFromToday < 0 || daysFromToday > 5) {
      console.log('🔄 CRITICAL FIX: Date outside forecast range - using fallback for', cityName, { daysFromToday });
      return createFallbackWeather();
    }

    try {
      console.log('🌤️ CRITICAL FIX: Attempting LIVE weather fetch for', cityName);

      // Get coordinates first
      const cleanCityName = cityName.replace(/,\s*[A-Z]{2}$/, '').trim();
      const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cleanCityName)}&limit=1&appid=${apiKey}`;
      
      const geoResponse = await fetch(geocodingUrl);
      
      if (!geoResponse.ok) {
        console.error('❌ CRITICAL FIX: Geocoding failed for', cityName, geoResponse.status);
        return createFallbackWeather();
      }
      
      const geoData = await geoResponse.json();
      if (!geoData || geoData.length === 0) {
        console.error('❌ CRITICAL FIX: City not found:', cityName);
        return createFallbackWeather();
      }

      const { lat, lon } = geoData[0];
      console.log('✅ CRITICAL FIX: Got coordinates for', cityName, { lat, lon });
      
      // Get weather forecast
      const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
      
      const weatherResponse = await fetch(weatherUrl);
      
      if (!weatherResponse.ok) {
        console.error('❌ CRITICAL FIX: Weather API failed for', cityName, weatherResponse.status);
        return createFallbackWeather();
      }
      
      const weatherData = await weatherResponse.json();
      if (!weatherData.list || weatherData.list.length === 0) {
        console.error('❌ CRITICAL FIX: No weather data for', cityName);
        return createFallbackWeather();
      }

      console.log('🎯 CRITICAL FIX: Weather API SUCCESS for', cityName, {
        listLength: weatherData.list.length
      });

      // Find the best match for target date
      const targetDateString = targetDate.toISOString().split('T')[0];
      
      // Group forecast items by date
      const dailyData = new Map<string, any[]>();
      weatherData.list.forEach((item: any) => {
        const itemDate = new Date(item.dt * 1000).toISOString().split('T')[0];
        if (!dailyData.has(itemDate)) {
          dailyData.set(itemDate, []);
        }
        dailyData.get(itemDate)!.push(item);
      });

      // Find the target date or closest available date
      let targetDayItems = dailyData.get(targetDateString);
      if (!targetDayItems && dailyData.size > 0) {
        const firstAvailableDate = Array.from(dailyData.keys())[0];
        targetDayItems = dailyData.get(firstAvailableDate);
        console.log('🔄 CRITICAL FIX: Using closest date', firstAvailableDate, 'for target', targetDateString);
      }

      if (!targetDayItems || targetDayItems.length === 0) {
        console.error('❌ CRITICAL FIX: No forecast items for target date');
        return createFallbackWeather();
      }

      // Calculate daily aggregated temperatures
      const dailyTemps = targetDayItems.map(item => ({
        temp: item.main.temp,
        temp_max: item.main.temp_max,
        temp_min: item.main.temp_min
      }));

      const avgTemp = dailyTemps.reduce((sum, t) => sum + t.temp, 0) / dailyTemps.length;
      const maxTemp = Math.max(...dailyTemps.map(t => t.temp_max));
      const minTemp = Math.min(...dailyTemps.map(t => t.temp_min));

      const representativeItem = targetDayItems[Math.floor(targetDayItems.length / 2)];

      // CRITICAL FIX: Create LIVE weather data with explicit properties
      const liveWeatherData: ForecastWeatherData = {
        temperature: Math.round(avgTemp),
        highTemp: Math.round(maxTemp),
        lowTemp: Math.round(minTemp),
        description: representativeItem.weather[0]?.description || 'Partly Cloudy',
        icon: representativeItem.weather[0]?.icon || '02d',
        humidity: representativeItem.main.humidity,
        windSpeed: Math.round(representativeItem.wind?.speed || 0),
        precipitationChance: Math.round((representativeItem.pop || 0) * 100),
        cityName: cityName,
        forecast: [],
        forecastDate: segmentDate,
        isActualForecast: true, // CRITICAL: TRUE for live weather
        source: 'live_forecast' as const // CRITICAL: live_forecast for API data
      };

      console.log('✅ CRITICAL FIX: Created LIVE weather data for', cityName, {
        source: liveWeatherData.source,
        isActualForecast: liveWeatherData.isActualForecast,
        temperature: liveWeatherData.temperature,
        willShowGreen: true
      });

      return liveWeatherData;

    } catch (error) {
      console.error('❌ CRITICAL FIX: Live weather fetch failed for', cityName, error);
      return createFallbackWeather();
    }
  }, [cityName, segmentDate]);

  const createFallbackWeather = React.useCallback((): ForecastWeatherData => {
    const fallbackDate = segmentDate || new Date();
    const targetDateString = fallbackDate.toISOString().split('T')[0];
    const daysFromToday = Math.ceil((fallbackDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
    
    const fallbackData = WeatherFallbackService.createFallbackForecast(
      cityName,
      fallbackDate,
      targetDateString,
      daysFromToday
    );

    // CRITICAL FIX: Ensure fallback has correct properties
    const finalFallback = {
      ...fallbackData,
      source: 'historical_fallback' as const,
      isActualForecast: false // CRITICAL: FALSE for fallback
    };
    
    console.log('⚠️ CRITICAL FIX: Created fallback weather for', cityName, {
      source: finalFallback.source,
      isActualForecast: finalFallback.isActualForecast,
      willShowYellow: true
    });

    return finalFallback;
  }, [cityName, segmentDate]);

  const refetch = React.useCallback(() => {
    console.log('🔄 CRITICAL FIX: Manual refetch requested for', cityName);
    setRefreshTrigger(prev => prev + 1);
  }, [cityName]);

  React.useEffect(() => {
    if (!segmentDate) return;

    setLoading(true);
    setError(null);

    fetchLiveWeather()
      .then((weatherData) => {
        if (weatherData) {
          console.log('✅ CRITICAL FIX: Setting weather data for', cityName, {
            source: weatherData.source,
            isActualForecast: weatherData.isActualForecast,
            temperature: weatherData.temperature
          });
          setWeather(weatherData);
        } else {
          setWeather(createFallbackWeather());
        }
      })
      .catch((err) => {
        console.error('❌ CRITICAL FIX: Error fetching weather for', cityName, err);
        setError(err instanceof Error ? err.message : 'Weather fetch failed');
        setWeather(createFallbackWeather());
      })
      .finally(() => {
        setLoading(false);
      });
  }, [fetchLiveWeather, createFallbackWeather, cityName, segmentDate, refreshTrigger]);

  return { weather, loading, error, refetch };
};
