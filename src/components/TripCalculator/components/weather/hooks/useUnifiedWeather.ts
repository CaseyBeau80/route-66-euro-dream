
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';
import { WeatherFallbackService } from '@/components/Route66Map/services/weather/WeatherFallbackService';
import { TemperatureExtractor } from '../services/TemperatureExtractor';

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
      console.log('🌤️ TEMPERATURE FIX: useUnifiedWeather - Fetching LIVE weather for', cityName, {
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

      console.log('🌤️ TEMPERATURE FIX: Raw API response for', cityName, {
        listLength: weatherData.list.length,
        firstItemStructure: weatherData.list[0],
        temperatureFields: {
          temp: weatherData.list[0]?.main?.temp,
          temp_max: weatherData.list[0]?.main?.temp_max,
          temp_min: weatherData.list[0]?.main?.temp_min
        }
      });

      // TEMPERATURE FIX: Find the best match for target date and aggregate daily temperatures
      const targetDateString = segmentDate.toISOString().split('T')[0];
      
      // Group forecast items by date to find daily highs and lows
      const dailyData = new Map<string, any[]>();
      weatherData.list.forEach((item: any) => {
        const itemDate = new Date(item.dt * 1000).toISOString().split('T')[0];
        if (!dailyData.has(itemDate)) {
          dailyData.set(itemDate, []);
        }
        dailyData.get(itemDate)!.push(item);
      });

      console.log('🌤️ TEMPERATURE FIX: Daily data grouping for', cityName, {
        targetDateString,
        availableDates: Array.from(dailyData.keys()),
        itemsPerDate: Array.from(dailyData.entries()).map(([date, items]) => ({ date, count: items.length }))
      });

      // Find the target date or closest available date
      let targetDayItems = dailyData.get(targetDateString);
      if (!targetDayItems && dailyData.size > 0) {
        // Use the first available date as fallback
        const firstAvailableDate = Array.from(dailyData.keys())[0];
        targetDayItems = dailyData.get(firstAvailableDate);
        console.log('🌤️ TEMPERATURE FIX: Using fallback date', firstAvailableDate, 'for target', targetDateString);
      }

      if (!targetDayItems || targetDayItems.length === 0) {
        console.error('❌ useUnifiedWeather: No forecast items for target date');
        return createFallbackWeather();
      }

      // TEMPERATURE FIX: Calculate daily aggregated temperatures
      const dailyTemps = targetDayItems.map(item => ({
        temp: item.main.temp,
        temp_max: item.main.temp_max,
        temp_min: item.main.temp_min,
        time: new Date(item.dt * 1000).toISOString()
      }));

      console.log('🌤️ TEMPERATURE FIX: Individual forecast temps for', cityName, {
        targetDateString,
        forecastCount: dailyTemps.length,
        temperatureDetails: dailyTemps
      });

      // Calculate aggregated daily values
      const avgTemp = dailyTemps.reduce((sum, t) => sum + t.temp, 0) / dailyTemps.length;
      const maxTemp = Math.max(...dailyTemps.map(t => t.temp_max));
      const minTemp = Math.min(...dailyTemps.map(t => t.temp_min));

      console.log('🌤️ TEMPERATURE FIX: Calculated daily temperatures for', cityName, {
        avgTemp: Math.round(avgTemp),
        maxTemp: Math.round(maxTemp),
        minTemp: Math.round(minTemp),
        temperatureRange: Math.round(maxTemp - minTemp),
        shouldBeDifferent: Math.round(maxTemp) !== Math.round(minTemp)
      });

      // Use the most representative item for other weather data
      const representativeItem = targetDayItems[Math.floor(targetDayItems.length / 2)];

      // TEMPERATURE FIX: Create weather data with proper temperature extraction
      const rawWeatherData: ForecastWeatherData = {
        temperature: Math.round(avgTemp), // Use average temp as current
        highTemp: Math.round(maxTemp),    // Use actual daily max
        lowTemp: Math.round(minTemp),     // Use actual daily min
        description: representativeItem.weather[0]?.description || 'Partly Cloudy',
        icon: representativeItem.weather[0]?.icon || '02d',
        humidity: representativeItem.main.humidity,
        windSpeed: Math.round(representativeItem.wind?.speed || 0),
        precipitationChance: Math.round((representativeItem.pop || 0) * 100),
        cityName: cityName,
        forecast: [],
        forecastDate: segmentDate,
        isActualForecast: true,
        source: 'live_forecast' as const,
        matchedForecastDay: representativeItem
      };

      console.log('🌤️ TEMPERATURE FIX: Raw weather data before extraction:', {
        cityName,
        temperature: rawWeatherData.temperature,
        highTemp: rawWeatherData.highTemp,
        lowTemp: rawWeatherData.lowTemp,
        source: rawWeatherData.source,
        isActualForecast: rawWeatherData.isActualForecast
      });

      // TEMPERATURE FIX: Use TemperatureExtractor to validate and process the temperatures
      const extractedTemperatures = TemperatureExtractor.extractTemperatures(rawWeatherData, cityName);

      console.log('🌤️ TEMPERATURE FIX: TemperatureExtractor results for', cityName, {
        extractedTemperatures,
        isValid: extractedTemperatures.isValid,
        hasDisplayableData: TemperatureExtractor.hasDisplayableTemperatureData(extractedTemperatures)
      });

      if (extractedTemperatures.isValid && TemperatureExtractor.hasDisplayableTemperatureData(extractedTemperatures)) {
        // Update the weather data with extracted temperatures
        const finalWeatherData: ForecastWeatherData = {
          ...rawWeatherData,
          temperature: extractedTemperatures.current,
          highTemp: extractedTemperatures.high,
          lowTemp: extractedTemperatures.low
        };

        console.log('✅ TEMPERATURE FIX: Final live weather data for', cityName, {
          temperature: finalWeatherData.temperature,
          highTemp: finalWeatherData.highTemp,
          lowTemp: finalWeatherData.lowTemp,
          temperatureRange: finalWeatherData.highTemp && finalWeatherData.lowTemp ? 
            finalWeatherData.highTemp - finalWeatherData.lowTemp : 'N/A',
          source: finalWeatherData.source,
          isActualForecast: finalWeatherData.isActualForecast,
          allTemperaturesDifferent: finalWeatherData.temperature !== finalWeatherData.highTemp || 
            finalWeatherData.highTemp !== finalWeatherData.lowTemp
        });

        return finalWeatherData;
      } else {
        console.error('❌ TEMPERATURE FIX: TemperatureExtractor validation failed for', cityName);
        return createFallbackWeather();
      }

    } catch (error) {
      console.error('❌ TEMPERATURE FIX: Live weather fetch failed for', cityName, error);
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

  const refetch = React.useCallback(() => {
    console.log('🔄 TEMPERATURE FIX: Manual refetch requested for', cityName);
    setRefreshTrigger(prev => prev + 1);
  }, [cityName]);

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
        console.error('❌ TEMPERATURE FIX: Error fetching weather for', cityName, err);
        setError(err instanceof Error ? err.message : 'Weather fetch failed');
        setWeather(createFallbackWeather());
      })
      .finally(() => {
        setLoading(false);
      });
  }, [fetchLiveWeather, createFallbackWeather, cityName, segmentDate, refreshTrigger]);

  return { weather, loading, error, refetch };
};
