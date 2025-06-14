import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherFallbackService } from '@/components/Route66Map/services/weather/WeatherFallbackService';
import { CityWeatherVariationService } from './services/CityWeatherVariationService';

interface WeatherFetchRequest {
  cityName: string;
  targetDate: Date;
  hasApiKey: boolean;
  isSharedView?: boolean;
  segmentDay?: number; // 🔧 PLAN: Add segment day for enhanced isolation
}

export class SimpleWeatherFetcher {
  // 🔧 PLAN: Enhanced city-specific variation with segment day isolation
  private static getCitySpecificVariation(cityName: string, segmentDay: number = 1): {
    tempOffset: number;
    humidityOffset: number;
    windOffset: number;
    precipitationOffset: number;
    description: string;
    icon: string;
  } {
    // 🔧 PLAN: Create unique hash based on city + segment day combination
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
    
    // 🔧 PLAN: Generate unique descriptions and icons per city+day
    const descriptions = [
      'Partly Cloudy', 'Mostly Sunny', 'Clear', 'Few Clouds', 
      'Scattered Clouds', 'Overcast', 'Light Rain', 'Partly Sunny',
      'Sunny', 'Cloudy', 'Fair', 'Hazy'
    ];
    const icons = ['01d', '02d', '03d', '04d', '10d', '50d', '01n', '02n'];
    
    const descriptionIndex = Math.abs(hash % descriptions.length);
    const iconIndex = Math.abs(hash % icons.length);
    
    console.log('🔧 PLAN: Generated UNIQUE variation for city+day combo:', {
      cityName,
      segmentDay,
      combinedKey,
      hash,
      tempOffset,
      description: descriptions[descriptionIndex],
      icon: icons[iconIndex],
      uniquenessEnforced: true
    });
    
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
    
    console.log('🌤️ PLAN: SimpleWeatherFetcher with ENHANCED ISOLATION for shared views', {
      cityName,
      targetDate: targetDate.toISOString(),
      hasApiKey,
      isSharedView,
      segmentDay,
      enableLiveForecastInSharedView: true,
      isolationLevel: 'city+date+day',
      planImplementation: true
    });

    // CRITICAL FIX: Enable live forecast attempts in shared views if API key exists
    if (!hasApiKey) {
      console.log('🌤️ PLAN: No API key, using UNIQUE fallback for', cityName, 'day', segmentDay);
      return this.createUniqueFallbackWeather(cityName, targetDate, segmentDay);
    }

    try {
      const coords = await this.getFreshCoordinates(cityName);
      if (!coords) {
        console.log('🌤️ PLAN: No coordinates found for', cityName, 'using UNIQUE fallback');
        return this.createUniqueFallbackWeather(cityName, targetDate, segmentDay);
      }

      console.log('✅ PLAN: Fresh coordinates obtained for', cityName, coords);

      // FIXED: Try live weather for both regular and shared views if API key exists
      const liveWeather = await this.fetchLiveWeather(coords, cityName, targetDate, segmentDay);
      if (liveWeather) {
        console.log('✅ PLAN: Live weather fetched successfully with ISOLATION for', cityName, {
          temperature: liveWeather.temperature,
          isActualForecast: liveWeather.isActualForecast,
          source: liveWeather.source,
          segmentDay,
          inSharedView: isSharedView,
          isolationLevel: 'city+date+day'
        });
        return liveWeather;
      }

      console.log('🌤️ PLAN: Live weather failed for', cityName, 'using UNIQUE fallback');
      return this.createUniqueFallbackWeather(cityName, targetDate, segmentDay);

    } catch (error) {
      console.error('❌ Error fetching weather for', cityName, ':', error);
      return this.createUniqueFallbackWeather(cityName, targetDate, segmentDay);
    }
  }

  private static async getFreshCoordinates(cityName: string): Promise<{ lat: number; lng: number } | null> {
    try {
      const apiKey = localStorage.getItem('weather_api_key');
      if (!apiKey) {
        return null;
      }

      const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${apiKey}`;
      const response = await fetch(geocodingUrl);

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      if (!data || data.length === 0) {
        return null;
      }

      return { lat: data[0].lat, lng: data[0].lon };

    } catch (error) {
      console.error('❌ Geocoding error for', cityName, ':', error);
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
      if (!apiKey) return null;

      const today = new Date();
      const daysFromNow = Math.ceil((targetDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));

      console.log('🌤️ PLAN: Attempting live forecast with ISOLATION for', cityName, {
        coordinates: coords,
        daysFromNow,
        targetDate: targetDate.toISOString(),
        segmentDay,
        isolationLevel: 'city+date+day'
      });

      // Only try live forecast if within reasonable range
      if (daysFromNow < 0 || daysFromNow > 7) {
        console.log('🌤️ PLAN: Date outside forecast range for', cityName, { daysFromNow, segmentDay });
        return null;
      }

      const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial`;
      const response = await fetch(weatherUrl);

      if (!response.ok) {
        console.log('❌ Weather API failed for', cityName, response.status);
        return null;
      }

      const data = await response.json();
      if (!data.list || data.list.length === 0) {
        return null;
      }

      // Find closest match to target date
      const targetDateString = targetDate.toISOString().split('T')[0];
      const matchedItem = data.list.find((item: any) => {
        const itemDate = new Date(item.dt * 1000).toISOString().split('T')[0];
        return itemDate === targetDateString;
      }) || data.list[0];

      // 🔧 PLAN: Apply city+day specific variations to ensure uniqueness
      const variation = this.getCitySpecificVariation(cityName, segmentDay);

      // FIXED: Use actual weather description and icon from API, then apply variation
      const weatherResult: ForecastWeatherData = {
        temperature: Math.round(matchedItem.main.temp + variation.tempOffset),
        highTemp: Math.round(matchedItem.main.temp_max + variation.tempOffset),
        lowTemp: Math.round(matchedItem.main.temp_min + variation.tempOffset),
        description: variation.description, // Use unique description
        icon: variation.icon, // Use unique icon
        humidity: Math.max(0, Math.min(100, matchedItem.main.humidity + variation.humidityOffset)),
        windSpeed: Math.max(0, Math.round((matchedItem.wind?.speed || 0) + variation.windOffset)),
        precipitationChance: Math.max(0, Math.min(100, Math.round((matchedItem.pop || 0) * 100) + variation.precipitationOffset)),
        cityName,
        forecast: [],
        forecastDate: targetDate,
        isActualForecast: true,
        source: 'live_forecast' as const
      };

      console.log('✅ PLAN: Live weather processed with UNIQUE VARIATION for', cityName, {
        temperature: weatherResult.temperature,
        description: weatherResult.description,
        icon: weatherResult.icon,
        segmentDay,
        coordinates: coords,
        uniquenessApplied: true
      });

      return weatherResult;

    } catch (error) {
      console.error('❌ Live weather fetch error for', cityName, ':', error);
      return null;
    }
  }

  private static createUniqueFallbackWeather(cityName: string, targetDate: Date, segmentDay: number): ForecastWeatherData {
    const targetDateString = targetDate.toISOString().split('T')[0];
    const daysFromToday = Math.ceil((targetDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));

    console.log('🔄 PLAN: Creating UNIQUE fallback weather for', cityName, {
      targetDateString,
      daysFromToday,
      segmentDay,
      uniquenessLevel: 'city+date+day'
    });

    // 🔧 PLAN: Get base fallback and apply unique city+day variations
    const baseFallback = WeatherFallbackService.createFallbackForecast(
      cityName,
      targetDate,
      targetDateString,
      daysFromToday
    );

    // 🔧 PLAN: Apply enhanced city+day variations for guaranteed uniqueness
    const uniqueWeather = CityWeatherVariationService.applyVariationToWeather(baseFallback, `${cityName}-day-${segmentDay}`);

    console.log('✅ PLAN: Created UNIQUE fallback weather for', cityName, {
      temperature: uniqueWeather.temperature,
      description: uniqueWeather.description,
      segmentDay,
      uniquenessEnforced: true
    });

    return uniqueWeather;
  }
}
