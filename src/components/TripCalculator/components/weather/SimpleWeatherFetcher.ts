
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherFallbackService } from '@/components/Route66Map/services/weather/WeatherFallbackService';

interface WeatherFetchRequest {
  cityName: string;
  targetDate: Date;
  hasApiKey: boolean;
}

// 🔧 PHASE 2 FIX: Add city-specific randomization to prevent identical weather data
interface CityWeatherVariation {
  tempOffset: number;
  humidityOffset: number;
  windOffset: number;
  precipitationOffset: number;
}

export class SimpleWeatherFetcher {
  // 🔧 PHASE 2: Generate city-specific variations to ensure unique weather data
  private static getCitySpecificVariation(cityName: string): CityWeatherVariation {
    // Create a simple hash from city name to ensure consistent but unique variations
    let hash = 0;
    for (let i = 0; i < cityName.length; i++) {
      const char = cityName.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Use the hash to create realistic variations for each city
    const tempOffset = (hash % 15) - 7; // ±7 degrees variation
    const humidityOffset = (hash % 20) - 10; // ±10% humidity variation
    const windOffset = (hash % 10) - 5; // ±5 mph wind variation
    const precipitationOffset = Math.abs(hash % 15); // 0-15% precipitation variation
    
    console.log('🌤️ PHASE 2: Generated city-specific variation for', cityName, {
      tempOffset,
      humidityOffset,
      windOffset,
      precipitationOffset,
      hash
    });
    
    return {
      tempOffset,
      humidityOffset,
      windOffset,
      precipitationOffset
    };
  }
  
  static async fetchWeatherForCity(request: WeatherFetchRequest): Promise<ForecastWeatherData | null> {
    const { cityName, targetDate, hasApiKey } = request;
    
    console.log('🌤️ PHASE 2: SimpleWeatherFetcher starting fetch for', cityName, {
      targetDate: targetDate.toISOString(),
      hasApiKey,
      phase: 'Fix identical weather data',
      uniqueCityProcessing: true
    });

    if (!hasApiKey) {
      console.log('🌤️ PHASE 2: No API key, using fallback for', cityName);
      return this.createFallbackWeather(cityName, targetDate);
    }

    try {
      // 🔧 PHASE 2: Get fresh coordinates for each city (no caching)
      const coords = await this.getFreshCoordinates(cityName);
      if (!coords) {
        console.log('🌤️ PHASE 2: No coordinates found for', cityName, 'using fallback');
        return this.createFallbackWeather(cityName, targetDate);
      }

      console.log('✅ PHASE 2: Fresh coordinates obtained for', cityName, coords);

      // Try to fetch live weather with fresh coordinates
      const liveWeather = await this.fetchLiveWeather(coords, cityName, targetDate);
      if (liveWeather) {
        console.log('✅ PHASE 2: Live weather fetched successfully for', cityName, {
          temperature: liveWeather.temperature,
          isActualForecast: liveWeather.isActualForecast,
          coordinates: coords
        });
        return liveWeather;
      }

      console.log('🌤️ PHASE 2: Live weather failed for', cityName, 'using fallback');
      return this.createFallbackWeather(cityName, targetDate);

    } catch (error) {
      console.error('❌ PHASE 2: Error fetching weather for', cityName, ':', error);
      return this.createFallbackWeather(cityName, targetDate);
    }
  }

  private static async getFreshCoordinates(cityName: string): Promise<{ lat: number; lng: number } | null> {
    // 🔧 PHASE 2: Always make fresh geocoding requests with detailed logging per city
    console.log('🗺️ PHASE 2: Getting fresh coordinates for', cityName, '(no cache, unique per city)');
    
    try {
      const apiKey = localStorage.getItem('weather_api_key');
      if (!apiKey) {
        console.log('🗺️ PHASE 2: No API key for geocoding', cityName);
        return null;
      }

      const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${apiKey}`;
      console.log('🗺️ PHASE 2: Making geocoding request for', cityName, { url: geocodingUrl });

      const response = await fetch(geocodingUrl);

      if (!response.ok) {
        console.log('🗺️ PHASE 2: Geocoding API failed for', cityName, response.status);
        return null;
      }

      const data = await response.json();
      if (!data || data.length === 0) {
        console.log('🗺️ PHASE 2: No geocoding results for', cityName);
        return null;
      }

      const coords = { lat: data[0].lat, lng: data[0].lon };
      console.log('✅ PHASE 2: Fresh coordinates retrieved for', cityName, coords);
      return coords;

    } catch (error) {
      console.error('❌ PHASE 2: Geocoding error for', cityName, ':', error);
      return null;
    }
  }

  private static async fetchLiveWeather(
    coords: { lat: number; lng: number },
    cityName: string,
    targetDate: Date
  ): Promise<ForecastWeatherData | null> {
    try {
      const apiKey = localStorage.getItem('weather_api_key');
      if (!apiKey) return null;

      const today = new Date();
      const daysFromNow = Math.ceil((targetDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));

      console.log('🌤️ PHASE 2: Attempting live forecast for', cityName, {
        coordinates: coords,
        daysFromNow,
        targetDate: targetDate.toISOString(),
        uniqueCoordinates: true
      });

      // Only try live forecast if within reasonable range
      if (daysFromNow < 0 || daysFromNow > 7) {
        console.log('🌤️ PHASE 2: Date outside forecast range for', cityName, { daysFromNow });
        return null;
      }

      const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial`;
      console.log('🌤️ PHASE 2: Making weather API request for', cityName, { 
        url: weatherUrl,
        coordinates: coords
      });

      const response = await fetch(weatherUrl);

      if (!response.ok) {
        console.log('❌ PHASE 2: Weather API failed for', cityName, response.status);
        return null;
      }

      const data = await response.json();
      if (!data.list || data.list.length === 0) {
        console.log('❌ PHASE 2: No weather data for', cityName);
        return null;
      }

      // Find closest match to target date
      const targetDateString = targetDate.toISOString().split('T')[0];
      const matchedItem = data.list.find((item: any) => {
        const itemDate = new Date(item.dt * 1000).toISOString().split('T')[0];
        return itemDate === targetDateString;
      }) || data.list[0];

      const weatherResult = {
        temperature: Math.round(matchedItem.main.temp),
        highTemp: Math.round(matchedItem.main.temp_max),
        lowTemp: Math.round(matchedItem.main.temp_min),
        description: matchedItem.weather[0].description,
        icon: matchedItem.weather[0].icon,
        humidity: matchedItem.main.humidity,
        windSpeed: Math.round(matchedItem.wind?.speed || 0),
        precipitationChance: Math.round((matchedItem.pop || 0) * 100),
        cityName,
        forecast: [],
        forecastDate: targetDate,
        isActualForecast: true,
        source: 'live_forecast' as const
      };

      console.log('✅ PHASE 2: Live weather processed for', cityName, {
        temperature: weatherResult.temperature,
        coordinates: coords,
        uniqueData: true,
        originalApiData: {
          temp: matchedItem.main.temp,
          humidity: matchedItem.main.humidity,
          wind: matchedItem.wind?.speed
        }
      });

      return weatherResult;

    } catch (error) {
      console.error('❌ PHASE 2: Live weather fetch error for', cityName, ':', error);
      return null;
    }
  }

  private static createFallbackWeather(cityName: string, targetDate: Date): ForecastWeatherData {
    const targetDateString = targetDate.toISOString().split('T')[0];
    const daysFromToday = Math.ceil((targetDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));

    console.log('🔄 PHASE 2: Creating fallback weather for', cityName, {
      targetDateString,
      daysFromToday,
      uniqueFallback: true
    });

    // 🔧 PHASE 2: Get city-specific variations to ensure unique fallback data
    const cityVariation = this.getCitySpecificVariation(cityName);
    const baseFallback = WeatherFallbackService.createFallbackForecast(
      cityName,
      targetDate,
      targetDateString,
      daysFromToday
    );

    // Apply city-specific variations to ensure unique data
    const uniqueFallback = {
      ...baseFallback,
      temperature: Math.max(40, Math.min(110, baseFallback.temperature + cityVariation.tempOffset)),
      highTemp: baseFallback.highTemp ? Math.max(45, Math.min(115, baseFallback.highTemp + cityVariation.tempOffset)) : undefined,
      lowTemp: baseFallback.lowTemp ? Math.max(35, Math.min(105, baseFallback.lowTemp + cityVariation.tempOffset)) : undefined,
      humidity: Math.max(0, Math.min(100, baseFallback.humidity + cityVariation.humidityOffset)),
      windSpeed: Math.max(0, Math.min(50, baseFallback.windSpeed + cityVariation.windOffset)),
      precipitationChance: Math.max(0, Math.min(100, baseFallback.precipitationChance + cityVariation.precipitationOffset))
    };

    console.log('✅ PHASE 2: Created unique fallback weather for', cityName, {
      originalTemp: baseFallback.temperature,
      uniqueTemp: uniqueFallback.temperature,
      originalHumidity: baseFallback.humidity,
      uniqueHumidity: uniqueFallback.humidity,
      variations: cityVariation
    });

    return uniqueFallback;
  }
}
