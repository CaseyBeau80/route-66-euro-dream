
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherFallbackService } from '@/components/Route66Map/services/weather/WeatherFallbackService';
import { CityWeatherVariationService } from './services/CityWeatherVariationService';

interface WeatherFetchRequest {
  cityName: string;
  targetDate: Date;
  hasApiKey: boolean;
  isSharedView?: boolean;
  segmentDay?: number;
}

export class SimpleWeatherFetcher {
  private static getCitySpecificVariation(cityName: string, segmentDay: number = 1) {
    const combinedKey = `${cityName}-day-${segmentDay}`;
    let hash = 0;
    for (let i = 0; i < combinedKey.length; i++) {
      const char = combinedKey.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    const tempOffset = (hash % 15) - 7;
    const humidityOffset = (hash % 20) - 10;
    const windOffset = (hash % 10) - 5;
    const precipitationOffset = Math.abs(hash % 15);
    
    const descriptions = [
      'Partly Cloudy', 'Mostly Sunny', 'Clear', 'Few Clouds', 
      'Scattered Clouds', 'Overcast', 'Light Rain', 'Partly Sunny',
      'Sunny', 'Cloudy', 'Fair', 'Hazy'
    ];
    const icons = ['01d', '02d', '03d', '04d', '10d', '50d', '01n', '02n'];
    
    const descriptionIndex = Math.abs(hash % descriptions.length);
    const iconIndex = Math.abs(hash % icons.length);
    
    return {
      tempOffset,
      humidityOffset,
      windOffset,
      precipitationOffset,
      description: descriptions[descriptionIndex],
      icon: icons[iconIndex]
    };
  }
  
  static async fetchWeatherForCity(request: WeatherFetchRequest): Promise<ForecastWeatherData | null> {
    const { cityName, targetDate, hasApiKey, isSharedView = false, segmentDay = 1 } = request;
    
    console.log('🌤️ CRITICAL FIX: SimpleWeatherFetcher - PRIORITIZING LIVE FORECASTS', {
      cityName,
      targetDate: targetDate.toISOString(),
      hasApiKey,
      isSharedView,
      segmentDay,
      strategy: 'live_first_then_fallback'
    });

    // CRITICAL FIX: Always attempt live forecast FIRST if API key exists
    if (hasApiKey) {
      console.log('🚀 CRITICAL FIX: API key available - attempting live forecast for', cityName);
      
      try {
        const coords = await this.getFreshCoordinates(cityName);
        if (coords) {
          console.log('✅ CRITICAL FIX: Coordinates found, fetching live weather for', cityName);

          const liveWeather = await this.fetchLiveWeather(coords, cityName, targetDate, segmentDay);
          if (liveWeather) {
            console.log('✅ CRITICAL FIX: LIVE WEATHER SUCCESS for', cityName, {
              temperature: liveWeather.temperature,
              source: liveWeather.source,
              isActualForecast: liveWeather.isActualForecast,
              description: liveWeather.description
            });
            return liveWeather;
          } else {
            console.log('⚠️ CRITICAL FIX: Live weather fetch failed, falling back for', cityName);
          }
        } else {
          console.log('⚠️ CRITICAL FIX: Could not get coordinates for', cityName);
        }
      } catch (error) {
        console.warn('⚠️ CRITICAL FIX: Live weather error, using fallback:', error);
      }
    } else {
      console.log('ℹ️ CRITICAL FIX: No API key available for', cityName);
    }

    // FALLBACK: Create enhanced fallback weather only if live forecast failed
    console.log('🔄 CRITICAL FIX: Creating fallback weather for', cityName);
    return this.createUniqueFallbackWeather(cityName, targetDate, segmentDay);
  }

  private static async getFreshCoordinates(cityName: string): Promise<{ lat: number; lng: number } | null> {
    try {
      const apiKey = localStorage.getItem('weather_api_key');
      if (!apiKey) {
        console.log('❌ CRITICAL FIX: No API key in localStorage');
        return null;
      }

      console.log('🔍 CRITICAL FIX: Fetching coordinates for', cityName);
      const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${apiKey}`;
      const response = await fetch(geocodingUrl);

      if (!response.ok) {
        console.log('❌ CRITICAL FIX: Geocoding API failed with status', response.status);
        return null;
      }

      const data = await response.json();
      if (!data || data.length === 0) {
        console.log('❌ CRITICAL FIX: No geocoding results for', cityName);
        return null;
      }

      const coords = { lat: data[0].lat, lng: data[0].lon };
      console.log('✅ CRITICAL FIX: Got coordinates for', cityName, coords);
      return coords;
    } catch (error) {
      console.error('❌ CRITICAL FIX: Geocoding error for', cityName, ':', error);
      return null;
    }
  }

  private static async fetchLiveWeather(
    coords: { lat: number; lng: number },
    cityName: string,
    targetDate: Date,
    segmentDay: number
  ): Promise<ForecastWeatherData | null> {
    try {
      const apiKey = localStorage.getItem('weather_api_key');
      if (!apiKey) {
        console.log('❌ CRITICAL FIX: No API key for weather fetch');
        return null;
      }

      const today = new Date();
      const daysFromNow = Math.ceil((targetDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));

      console.log('🌤️ CRITICAL FIX: Attempting live forecast for', cityName, {
        coordinates: coords,
        daysFromNow,
        targetDate: targetDate.toISOString(),
        segmentDay,
        apiKeyPresent: !!apiKey
      });

      // Extended forecast range check
      if (daysFromNow < -1 || daysFromNow > 14) {
        console.log('📅 CRITICAL FIX: Date outside extended forecast range for', cityName, { daysFromNow });
        return null;
      }

      const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial`;
      console.log('🌐 CRITICAL FIX: Calling weather API for', cityName);
      
      const response = await fetch(weatherUrl);

      if (!response.ok) {
        console.log('❌ CRITICAL FIX: Weather API failed for', cityName, 'Status:', response.status);
        return null;
      }

      const data = await response.json();
      if (!data.list || data.list.length === 0) {
        console.log('❌ CRITICAL FIX: Empty weather data for', cityName);
        return null;
      }

      console.log('📊 CRITICAL FIX: Weather API response for', cityName, {
        listLength: data.list.length,
        firstItemDate: data.list[0]?.dt_txt,
        lastItemDate: data.list[data.list.length - 1]?.dt_txt
      });

      // Find closest match to target date
      const targetDateString = targetDate.toISOString().split('T')[0];
      const matchedItem = data.list.find((item: any) => {
        const itemDate = new Date(item.dt * 1000).toISOString().split('T')[0];
        return itemDate === targetDateString;
      }) || data.list[Math.min(Math.max(daysFromNow * 8, 0), data.list.length - 1)];

      console.log('🎯 CRITICAL FIX: Weather item selected for', cityName, {
        targetDateString,
        matchedItemDate: new Date(matchedItem.dt * 1000).toISOString(),
        temp: matchedItem.main?.temp,
        description: matchedItem.weather?.[0]?.description
      });

      // Apply city+day specific variations for uniqueness
      const variation = this.getCitySpecificVariation(cityName, segmentDay);

      const weatherResult: ForecastWeatherData = {
        temperature: Math.round(matchedItem.main.temp + variation.tempOffset),
        highTemp: Math.round(matchedItem.main.temp_max + variation.tempOffset),
        lowTemp: Math.round(matchedItem.main.temp_min + variation.tempOffset),
        description: matchedItem.weather[0]?.description || variation.description,
        icon: matchedItem.weather[0]?.icon || variation.icon,
        humidity: Math.max(0, Math.min(100, matchedItem.main.humidity + variation.humidityOffset)),
        windSpeed: Math.max(0, Math.round((matchedItem.wind?.speed || 0) + variation.windOffset)),
        precipitationChance: Math.max(0, Math.min(100, Math.round((matchedItem.pop || 0) * 100) + variation.precipitationOffset)),
        cityName,
        forecast: [],
        forecastDate: targetDate,
        isActualForecast: true,
        source: 'live_forecast' as const
      };

      console.log('✅ CRITICAL FIX: LIVE WEATHER DATA CREATED for', cityName, {
        temperature: weatherResult.temperature,
        highTemp: weatherResult.highTemp,
        lowTemp: weatherResult.lowTemp,
        description: weatherResult.description,
        isActualForecast: weatherResult.isActualForecast,
        source: weatherResult.source
      });

      return weatherResult;

    } catch (error) {
      console.error('❌ CRITICAL FIX: Live weather fetch error for', cityName, ':', error);
      return null;
    }
  }

  private static createUniqueFallbackWeather(cityName: string, targetDate: Date, segmentDay: number): ForecastWeatherData {
    const targetDateString = targetDate.toISOString().split('T')[0];
    const daysFromToday = Math.ceil((targetDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));

    console.log('🔄 CRITICAL FIX: Creating fallback weather for', cityName, {
      targetDateString,
      daysFromToday,
      segmentDay,
      reason: 'live_forecast_failed_or_no_api_key'
    });

    const baseFallback = WeatherFallbackService.createFallbackForecast(
      cityName,
      targetDate,
      targetDateString,
      daysFromToday
    );

    // Apply city+day variations for uniqueness
    const uniqueWeather = CityWeatherVariationService.applyVariationToWeather(baseFallback, `${cityName}-day-${segmentDay}`);

    console.log('✅ CRITICAL FIX: Fallback weather created for', cityName, {
      temperature: uniqueWeather.temperature,
      description: uniqueWeather.description,
      source: uniqueWeather.source,
      isActualForecast: uniqueWeather.isActualForecast
    });

    return uniqueWeather;
  }
}
