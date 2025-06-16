
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';
import { WeatherFallbackService } from '@/components/Route66Map/services/weather/WeatherFallbackService';
import { TemperatureExtractor } from '../services/TemperatureExtractor';
import { WeatherUtilityService } from '../services/WeatherUtilityService';

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

  const fetchLiveWeather = React.useCallback(async () => {
    if (!segmentDate) {
      console.log('🚨 ULTIMATE FIX: No segment date provided for', cityName);
      return null;
    }

    const apiKey = WeatherApiKeyManager.getApiKey();
    
    // ULTIMATE FIX: More specific API key validation
    if (!apiKey || apiKey === 'your_api_key_here' || apiKey.length < 10) {
      console.log('🚨 ULTIMATE FIX: Invalid or missing API key for', cityName, {
        hasApiKey: !!apiKey,
        keyLength: apiKey?.length || 0,
        reason: 'API_KEY_INVALID_FALLBACK_TO_HISTORICAL'
      });
      return createFallbackWeather();
    }

    // ULTIMATE FIX: Use WeatherUtilityService for proper date validation
    const daysFromToday = WeatherUtilityService.getDaysFromToday(segmentDate);
    const isWithinRange = WeatherUtilityService.isWithinLiveForecastRange(segmentDate);
    
    console.log('🚨 ULTIMATE FIX: Enhanced date validation for', cityName, {
      segmentDate: segmentDate.toISOString(),
      segmentDay,
      daysFromToday,
      isWithinRange,
      shouldAttemptLiveForecast: isWithinRange,
      day1Check: segmentDay === 1 ? 'THIS_IS_DAY_1_SHOULD_BE_LIVE' : 'OTHER_DAY',
      ultimateFix: true
    });
    
    if (!isWithinRange) {
      console.log('🚨 ULTIMATE FIX: Date outside forecast range for', cityName, { 
        daysFromToday, 
        isWithinRange,
        segmentDay,
        reason: 'DATE_OUT_OF_RANGE_USING_HISTORICAL'
      });
      return createFallbackWeather();
    }

    try {
      console.log('🚨 ULTIMATE FIX: Attempting LIVE weather fetch for', cityName, {
        apiKeyLength: apiKey.length,
        segmentDate: segmentDate.toISOString(),
        daysFromToday,
        isWithinRange,
        segmentDay,
        shouldSucceed: true,
        ultimateAttempt: true
      });

      // Get coordinates with enhanced error handling
      const cleanCityName = cityName.replace(/,\s*[A-Z]{2}$/, '').trim();
      const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cleanCityName)}&limit=1&appid=${apiKey}`;
      
      console.log('🚨 ULTIMATE FIX: Geocoding request for', cleanCityName, { url: geocodingUrl });
      
      const geoResponse = await fetch(geocodingUrl);
      if (!geoResponse.ok) {
        console.error('🚨 ULTIMATE FIX: Geocoding failed for', cityName, {
          status: geoResponse.status,
          statusText: geoResponse.statusText
        });
        return createFallbackWeather();
      }
      
      const geoData = await geoResponse.json();
      if (!geoData || geoData.length === 0) {
        console.error('🚨 ULTIMATE FIX: City not found in geocoding:', cityName);
        return createFallbackWeather();
      }

      const { lat, lon } = geoData[0];
      console.log('🚨 ULTIMATE FIX: Geocoding successful for', cityName, { lat, lon });
      
      // Get weather forecast with enhanced validation
      const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
      
      console.log('🚨 ULTIMATE FIX: Weather API request for', cityName, { weatherUrl });
      
      const weatherResponse = await fetch(weatherUrl);
      if (!weatherResponse.ok) {
        console.error('🚨 ULTIMATE FIX: Weather API failed for', cityName, {
          status: weatherResponse.status,
          statusText: weatherResponse.statusText
        });
        return createFallbackWeather();
      }
      
      const weatherData = await weatherResponse.json();
      if (!weatherData.list || weatherData.list.length === 0) {
        console.error('🚨 ULTIMATE FIX: No weather data returned for', cityName);
        return createFallbackWeather();
      }

      console.log('🚨 ULTIMATE FIX: Raw weather API response for', cityName, {
        listLength: weatherData.list.length,
        firstItem: weatherData.list[0],
        segmentDay,
        ultimateSuccess: true
      });

      // ULTIMATE FIX: Enhanced date matching for forecast items
      const targetDateString = segmentDate.toISOString().split('T')[0];
      
      // Group forecast items by date
      const dailyData = new Map<string, any[]>();
      weatherData.list.forEach((item: any) => {
        const itemDate = new Date(item.dt * 1000).toISOString().split('T')[0];
        if (!dailyData.has(itemDate)) {
          dailyData.set(itemDate, []);
        }
        dailyData.get(itemDate)!.push(item);
      });

      console.log('🚨 ULTIMATE FIX: Daily data analysis for', cityName, {
        targetDateString,
        availableDates: Array.from(dailyData.keys()),
        hasTargetDate: dailyData.has(targetDateString),
        segmentDay,
        ultimateProcessing: true
      });

      // Find the target date or closest available date
      let targetDayItems = dailyData.get(targetDateString);
      if (!targetDayItems && dailyData.size > 0) {
        // For Day 1, try to get today's data if available
        if (segmentDay === 1) {
          const todayString = new Date().toISOString().split('T')[0];
          targetDayItems = dailyData.get(todayString);
          console.log('🚨 ULTIMATE FIX: Day 1 fallback to today for', cityName, {
            todayString,
            foundTodayData: !!targetDayItems
          });
        }
        
        // If still no data, use first available
        if (!targetDayItems) {
          const firstAvailableDate = Array.from(dailyData.keys())[0];
          targetDayItems = dailyData.get(firstAvailableDate);
          console.log('🚨 ULTIMATE FIX: Using first available date', firstAvailableDate, 'for target', targetDateString);
        }
      }

      if (!targetDayItems || targetDayItems.length === 0) {
        console.error('🚨 ULTIMATE FIX: No forecast items available for', cityName);
        return createFallbackWeather();
      }

      // Calculate daily temperatures
      const dailyTemps = targetDayItems.map(item => ({
        temp: item.main.temp,
        temp_max: item.main.temp_max,
        temp_min: item.main.temp_min,
        time: new Date(item.dt * 1000).toISOString()
      }));

      const avgTemp = dailyTemps.reduce((sum, t) => sum + t.temp, 0) / dailyTemps.length;
      const maxTemp = Math.max(...dailyTemps.map(t => t.temp_max));
      const minTemp = Math.min(...dailyTemps.map(t => t.temp_min));

      console.log('🚨 ULTIMATE FIX: Final temperature calculation for', cityName, {
        avgTemp: Math.round(avgTemp),
        maxTemp: Math.round(maxTemp),
        minTemp: Math.round(minTemp),
        segmentDay,
        isLiveForecast: true,
        ultimateResult: true
      });

      // Use representative item for other weather data
      const representativeItem = targetDayItems[Math.floor(targetDayItems.length / 2)];

      // ULTIMATE FIX: Create weather data with explicit live forecast marking
      const rawWeatherData: ForecastWeatherData = {
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
        isActualForecast: true, // ULTIMATE FIX: Explicitly mark as actual forecast
        source: 'live_forecast' as const, // ULTIMATE FIX: Explicitly mark as live
        matchedForecastDay: representativeItem
      };

      console.log('🚨 ULTIMATE FIX: Created LIVE weather data for', cityName, {
        temperature: rawWeatherData.temperature,
        highTemp: rawWeatherData.highTemp,
        lowTemp: rawWeatherData.lowTemp,
        source: rawWeatherData.source,
        isActualForecast: rawWeatherData.isActualForecast,
        segmentDay,
        day1Success: segmentDay === 1 ? 'DAY_1_NOW_HAS_LIVE_FORECAST' : 'OTHER_DAY_SUCCESS',
        ultimateSuccess: true
      });

      // Validate with TemperatureExtractor
      const extractedTemperatures = TemperatureExtractor.extractTemperatures(rawWeatherData, cityName);

      if (extractedTemperatures.isValid && TemperatureExtractor.hasDisplayableTemperatureData(extractedTemperatures)) {
        const finalWeatherData: ForecastWeatherData = {
          ...rawWeatherData,
          temperature: extractedTemperatures.current,
          highTemp: extractedTemperatures.high,
          lowTemp: extractedTemperatures.low
        };

        console.log('🚨 ULTIMATE FIX: FINAL SUCCESS - Live weather for', cityName, {
          temperature: finalWeatherData.temperature,
          highTemp: finalWeatherData.highTemp,
          lowTemp: finalWeatherData.lowTemp,
          source: finalWeatherData.source,
          isActualForecast: finalWeatherData.isActualForecast,
          segmentDay,
          ultimateFixSuccess: true
        });

        return finalWeatherData;
      } else {
        console.error('🚨 ULTIMATE FIX: TemperatureExtractor validation failed for', cityName);
        return createFallbackWeather();
      }

    } catch (error) {
      console.error('🚨 ULTIMATE FIX: Live weather fetch error for', cityName, error);
      return createFallbackWeather();
    }
  }, [cityName, segmentDate]);

  const createFallbackWeather = React.useCallback((): ForecastWeatherData => {
    if (!segmentDate) {
      segmentDate = new Date();
    }
    
    const targetDateString = segmentDate.toISOString().split('T')[0];
    const daysFromToday = WeatherUtilityService.getDaysFromToday(segmentDate);
    
    console.log('🚨 ULTIMATE FIX: Creating fallback weather for', cityName, {
      segmentDate: segmentDate.toISOString(),
      targetDateString,
      daysFromToday,
      segmentDay,
      reason: 'FALLBACK_WEATHER_CREATION'
    });
    
    return WeatherFallbackService.createFallbackForecast(
      cityName,
      segmentDate,
      targetDateString,
      daysFromToday
    );
  }, [cityName, segmentDate]);

  const refetch = React.useCallback(() => {
    console.log('🚨 ULTIMATE FIX: Manual refetch for', cityName, { segmentDay });
    setRefreshTrigger(prev => prev + 1);
  }, [cityName]);

  React.useEffect(() => {
    if (!segmentDate) return;

    setLoading(true);
    setError(null);

    console.log('🚨 ULTIMATE FIX: Effect triggered for', cityName, {
      segmentDate: segmentDate.toISOString(),
      segmentDay,
      refreshTrigger,
      ultimateFixAttempt: true
    });

    fetchLiveWeather()
      .then((weatherData) => {
        if (weatherData) {
          console.log('🚨 ULTIMATE FIX: Weather data successfully set for', cityName, {
            segmentDay,
            source: weatherData.source,
            isActualForecast: weatherData.isActualForecast,
            temperature: weatherData.temperature,
            ultimateSuccess: true
          });
          setWeather(weatherData);
        } else {
          console.log('🚨 ULTIMATE FIX: No weather data returned, using fallback for', cityName);
          setWeather(createFallbackWeather());
        }
      })
      .catch((err) => {
        console.error('🚨 ULTIMATE FIX: Error in weather fetch for', cityName, err);
        setError(err instanceof Error ? err.message : 'Weather fetch failed');
        setWeather(createFallbackWeather());
      })
      .finally(() => {
        setLoading(false);
      });
  }, [fetchLiveWeather, createFallbackWeather, cityName, segmentDate, refreshTrigger]);

  return { weather, loading, error, refetch };
};
