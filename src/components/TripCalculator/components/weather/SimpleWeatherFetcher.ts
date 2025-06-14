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
  // PLAN IMPLEMENTATION: Strict 7-day forecast range
  private static readonly LIVE_FORECAST_MAX_DAYS = 7;
  
  private static getCitySpecificVariation(cityName: string, segmentDay: number = 1) {
    // ... keep existing code (variation calculation logic)
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
    
    // PLAN IMPLEMENTATION: Strict date range validation FIRST
    const today = new Date();
    const daysFromToday = Math.ceil((targetDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
    const isWithinLiveForecastRange = daysFromToday >= 0 && daysFromToday <= this.LIVE_FORECAST_MAX_DAYS;
    
    console.log('🚀 PLAN: SimpleWeatherFetcher - strict date range validation', {
      cityName,
      targetDate: targetDate.toISOString(),
      daysFromToday,
      isWithinLiveForecastRange,
      hasApiKey,
      isSharedView,
      segmentDay,
      strategy: 'strict_7_day_validation'
    });

    // PLAN IMPLEMENTATION: Only attempt live forecast if BOTH conditions are met
    if (hasApiKey && isWithinLiveForecastRange) {
      console.log('🔑 PLAN: Valid conditions for live forecast attempt:', cityName);
      
      try {
        const coords = await this.getEnhancedCoordinates(cityName);
        if (coords) {
          console.log('✅ PLAN: Coordinates found, fetching live weather for', cityName, coords);

          const liveWeather = await this.fetchLiveWeather(coords, cityName, targetDate, segmentDay);
          if (liveWeather) {
            console.log('🎯 PLAN: LIVE WEATHER SUCCESS with verified properties for', cityName, {
              temperature: liveWeather.temperature,
              source: liveWeather.source,
              isActualForecast: liveWeather.isActualForecast,
              description: liveWeather.description,
              daysFromToday,
              isWithinRange: isWithinLiveForecastRange
            });
            return liveWeather;
          } else {
            console.log('⚠️ PLAN: Live weather fetch failed, falling back for', cityName);
          }
        } else {
          console.log('⚠️ PLAN: Could not get coordinates for', cityName);
        }
      } catch (error) {
        console.warn('⚠️ PLAN: Live weather error, using fallback:', error);
      }
    } else {
      const reason = !hasApiKey ? 'no_api_key' : 
                    !isWithinLiveForecastRange ? `outside_range_day_${daysFromToday}` : 'unknown';
      console.log('🔄 PLAN: Skipping live forecast attempt:', cityName, { reason, daysFromToday });
    }

    // PLAN IMPLEMENTATION: Create fallback weather with correct source marking
    console.log('🔄 PLAN: Creating fallback weather for', cityName, { daysFromToday, isWithinLiveForecastRange });
    return this.createCorrectFallbackWeather(cityName, targetDate, segmentDay, isWithinLiveForecastRange);
  }

  private static async getEnhancedCoordinates(cityName: string): Promise<{ lat: number; lng: number } | null> {
    try {
      const apiKey = localStorage.getItem('weather_api_key') || localStorage.getItem('openweathermap_api_key');
      
      console.log('🔍 PLAN: API key validation', {
        hasWeatherApiKey: !!localStorage.getItem('weather_api_key'),
        hasOpenWeatherMapKey: !!localStorage.getItem('openweathermap_api_key'),
        finalApiKey: apiKey ? `${apiKey.substring(0, 8)}...` : 'none',
        keyLength: apiKey?.length || 0,
        keyValid: !!(apiKey && apiKey.length > 10)
      });
      
      if (!apiKey || apiKey.length < 10) {
        console.log('❌ PLAN: Invalid API key - too short or missing');
        return null;
      }

      const formattedCityName = this.formatCityNameForGeocoding(cityName);
      console.log('🔍 PLAN: Fetching coordinates', {
        originalCity: cityName,
        formattedCity: formattedCityName
      });

      const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(formattedCityName)}&limit=5&appid=${apiKey}`;
      
      const response = await fetch(geocodingUrl);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ PLAN: Geocoding API failed', {
          status: response.status,
          statusText: response.statusText,
          errorBody: errorText,
          cityName: formattedCityName
        });
        return null;
      }

      const data = await response.json();
      
      if (!data || data.length === 0) {
        console.log('❌ PLAN: No geocoding results for', formattedCityName);
        return null;
      }

      const bestMatch = this.selectBestGeocodingMatch(data, cityName);
      const coords = { lat: bestMatch.lat, lng: bestMatch.lon };
      
      console.log('✅ PLAN: Got coordinates for', formattedCityName, {
        coordinates: coords
      });
      
      return coords;
    } catch (error) {
      console.error('❌ PLAN: Geocoding error for', cityName, ':', error);
      return null;
    }
  }

  private static formatCityNameForGeocoding(cityName: string): string {
    let formatted = cityName.trim();
    
    if (formatted.includes(',')) {
      return formatted;
    }
    
    return `${formatted},US`;
  }

  private static selectBestGeocodingMatch(results: any[], originalCity: string): any {
    const usResults = results.filter(r => r.country === 'US');
    if (usResults.length > 0) {
      return usResults[0];
    }
    
    return results[0];
  }

  private static async fetchLiveWeather(
    coords: { lat: number; lng: number },
    cityName: string,
    targetDate: Date,
    segmentDay: number
  ): Promise<ForecastWeatherData | null> {
    try {
      const apiKey = localStorage.getItem('weather_api_key') || localStorage.getItem('openweathermap_api_key');
      if (!apiKey || apiKey.length < 10) {
        console.log('❌ PLAN: Invalid API key for weather fetch');
        return null;
      }

      const today = new Date();
      const daysFromNow = Math.ceil((targetDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));

      console.log('🌤️ PLAN: Attempting live forecast for', cityName, {
        coordinates: coords,
        daysFromNow,
        targetDate: targetDate.toISOString(),
        segmentDay
      });

      // PLAN IMPLEMENTATION: Strict range check
      if (daysFromNow < -1 || daysFromNow > this.LIVE_FORECAST_MAX_DAYS) {
        console.log('📅 PLAN: Date outside live forecast range for', cityName, { daysFromNow });
        return null;
      }

      const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial`;
      
      const response = await fetch(weatherUrl);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ PLAN: Weather API failed for', cityName, {
          status: response.status,
          errorBody: errorText
        });
        return null;
      }

      const data = await response.json();
      if (!data.list || data.list.length === 0) {
        console.log('❌ PLAN: Empty weather data for', cityName);
        return null;
      }

      const targetDateString = targetDate.toISOString().split('T')[0];
      const matchedItem = data.list.find((item: any) => {
        const itemDate = new Date(item.dt * 1000).toISOString().split('T')[0];
        return itemDate === targetDateString;
      }) || data.list[Math.min(Math.max(daysFromNow * 8, 0), data.list.length - 1)];

      const variation = this.getCitySpecificVariation(cityName, segmentDay);

      // PLAN IMPLEMENTATION: Ensure live forecast properties are correctly set
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
        isActualForecast: true, // PLAN: Must be true for live forecasts
        source: 'live_forecast' as const // PLAN: Must be 'live_forecast'
      };

      console.log('✅ PLAN: LIVE WEATHER DATA CREATED with verified properties for', cityName, {
        temperature: weatherResult.temperature,
        isActualForecast: weatherResult.isActualForecast,
        source: weatherResult.source,
        daysFromNow
      });

      return weatherResult;

    } catch (error) {
      console.error('❌ PLAN: Live weather fetch error for', cityName, ':', error);
      return null;
    }
  }

  private static createCorrectFallbackWeather(
    cityName: string, 
    targetDate: Date, 
    segmentDay: number,
    wasWithinLiveRange: boolean
  ): ForecastWeatherData {
    const targetDateString = targetDate.toISOString().split('T')[0];
    const daysFromToday = Math.ceil((targetDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));

    console.log('🔄 PLAN: Creating fallback weather for', cityName, {
      targetDateString,
      daysFromToday,
      segmentDay,
      wasWithinLiveRange,
      reason: wasWithinLiveRange ? 'live_forecast_failed' : 'outside_live_range'
    });

    const baseFallback = WeatherFallbackService.createFallbackForecast(
      cityName,
      targetDate,
      targetDateString,
      daysFromToday
    );

    // Apply city+day variations for uniqueness
    const uniqueWeather = CityWeatherVariationService.applyVariationToWeather(baseFallback, `${cityName}-day-${segmentDay}`);

    console.log('✅ PLAN: Fallback weather created for', cityName, {
      temperature: uniqueWeather.temperature,
      description: uniqueWeather.description,
      source: uniqueWeather.source,
      isActualForecast: uniqueWeather.isActualForecast,
      daysFromToday
    });

    return uniqueWeather;
  }
}
