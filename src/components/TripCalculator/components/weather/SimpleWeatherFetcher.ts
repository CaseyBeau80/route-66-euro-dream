import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';
import { WeatherFallbackService } from '@/components/Route66Map/services/weather/WeatherFallbackService';

export interface WeatherFetchParams {
  cityName: string;
  targetDate: Date;
  hasApiKey: boolean;
  isSharedView: boolean;
  segmentDay: number;
}

export class SimpleWeatherFetcher {
  /**
   * FIXED: Simplified and more reliable weather fetching with guaranteed live weather marking
   */
  static async fetchWeatherForCity(params: WeatherFetchParams): Promise<ForecastWeatherData | null> {
    const { cityName, targetDate, isSharedView, segmentDay } = params;
    
    console.log('🌤️ FIXED: SimpleWeatherFetcher starting fetch for', cityName, {
      targetDate: targetDate.toISOString(),
      isSharedView,
      segmentDay
    });

    // FIXED: Always check for API key directly
    const apiKey = WeatherApiKeyManager.getApiKey();
    const hasValidApiKey = apiKey && apiKey !== 'YOUR_API_KEY_HERE' && apiKey.length > 10;
    
    console.log('🔑 FIXED: API key check:', {
      hasKey: !!apiKey,
      isValid: hasValidApiKey,
      keyLength: apiKey?.length || 0
    });

    // Check if date is within forecast range (0-7 days)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDateNormalized = new Date(targetDate);
    targetDateNormalized.setHours(0, 0, 0, 0);
    
    const timeDiff = targetDateNormalized.getTime() - today.getTime();
    const daysFromToday = Math.ceil(timeDiff / (24 * 60 * 60 * 1000));
    
    const isWithinForecastRange = daysFromToday >= 0 && daysFromToday <= 7;
    
    console.log('📅 FIXED: Date range check:', {
      today: today.toISOString(),
      targetDate: targetDateNormalized.toISOString(),
      daysFromToday,
      isWithinForecastRange
    });

    // If we have a valid API key and date is within range, try live weather
    if (hasValidApiKey && isWithinForecastRange) {
      console.log('🚀 FIXED: Attempting live weather fetch for', cityName);
      
      try {
        const liveWeather = await this.fetchLiveWeatherDirect(cityName, targetDate, apiKey!);
        
        if (liveWeather) {
          console.log('✅ FIXED: Live weather successful - GUARANTEED LIVE MARKING:', {
            cityName,
            temperature: liveWeather.temperature,
            source: liveWeather.source,
            isActualForecast: liveWeather.isActualForecast,
            guaranteedLive: liveWeather.source === 'live_forecast' && liveWeather.isActualForecast === true
          });
          return liveWeather;
        }
      } catch (error) {
        console.error('❌ FIXED: Live weather failed for', cityName, error);
      }
    } else {
      console.log('📊 FIXED: Using fallback weather for', cityName, {
        reason: !hasValidApiKey ? 'no_valid_api_key' : 'outside_forecast_range',
        hasValidApiKey,
        isWithinForecastRange,
        daysFromToday
      });
    }

    // Return fallback weather
    return this.createFallbackWeather(cityName, targetDate);
  }

  /**
   * FIXED: Direct live weather fetching with GUARANTEED live weather marking
   */
  private static async fetchLiveWeatherDirect(
    cityName: string, 
    targetDate: Date, 
    apiKey: string
  ): Promise<ForecastWeatherData | null> {
    try {
      console.log('🌐 FIXED: Fetching live weather for', cityName);
      
      // Get coordinates first
      const coords = await this.getCoordinates(cityName, apiKey);
      if (!coords) {
        console.log('❌ FIXED: No coordinates found for', cityName);
        return null;
      }

      console.log('📍 FIXED: Got coordinates for', cityName, coords);

      // Fetch 5-day forecast
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial`;
      const response = await fetch(forecastUrl);

      if (!response.ok) {
        console.error('❌ FIXED: Weather API error:', response.status, response.statusText);
        return null;
      }

      const data = await response.json();
      
      if (!data.list || data.list.length === 0) {
        console.log('❌ FIXED: No forecast data returned for', cityName);
        return null;
      }

      console.log('📦 FIXED: Got forecast data for', cityName, {
        listLength: data.list.length,
        firstItem: data.list[0]?.dt_txt
      });

      // Find the best match for the target date
      const targetDateString = targetDate.toISOString().split('T')[0];
      
      let bestMatch = null;
      let closestDiff = Infinity;
      
      for (const item of data.list) {
        const itemDate = new Date(item.dt * 1000);
        const itemDateString = itemDate.toISOString().split('T')[0];
        const timeDiff = Math.abs(itemDate.getTime() - targetDate.getTime());
        
        if (itemDateString === targetDateString || timeDiff < closestDiff) {
          bestMatch = item;
          closestDiff = timeDiff;
          
          // Perfect match - use it
          if (itemDateString === targetDateString) {
            break;
          }
        }
      }

      if (!bestMatch) {
        console.log('❌ FIXED: No suitable forecast found for', cityName);
        return null;
      }

      console.log('🎯 FIXED: Found forecast match for', cityName, {
        targetDate: targetDateString,
        matchedDate: new Date(bestMatch.dt * 1000).toISOString(),
        temperature: bestMatch.main.temp
      });

      // CRITICAL FIX: Create live weather object with GUARANTEED live marking
      const liveWeather: ForecastWeatherData = {
        temperature: Math.round(bestMatch.main.temp),
        highTemp: Math.round(bestMatch.main.temp_max),
        lowTemp: Math.round(bestMatch.main.temp_min),
        description: bestMatch.weather[0]?.description || 'Clear',
        icon: bestMatch.weather[0]?.icon || '01d',
        humidity: bestMatch.main.humidity,
        windSpeed: Math.round(bestMatch.wind?.speed || 0),
        precipitationChance: Math.round((bestMatch.pop || 0) * 100),
        cityName: cityName,
        forecast: [],
        forecastDate: targetDate,
        // CRITICAL FIX: GUARANTEE these values for live weather
        isActualForecast: true,
        source: 'live_forecast' as const
      };

      console.log('✅ FIXED: Created GUARANTEED live weather object for', cityName, {
        temperature: liveWeather.temperature,
        isActualForecast: liveWeather.isActualForecast,
        source: liveWeather.source,
        guaranteedLive: true,
        validationCheck: liveWeather.source === 'live_forecast' && liveWeather.isActualForecast === true
      });

      return liveWeather;
    } catch (error) {
      console.error('❌ FIXED: Live weather fetch error for', cityName, error);
      return null;
    }
  }

  /**
   * Get coordinates for a city
   */
  private static async getCoordinates(cityName: string, apiKey: string) {
    try {
      // Clean city name (remove state codes)
      const cleanCityName = cityName.replace(/,\s*[A-Z]{2}$/, '').trim();
      const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cleanCityName)}&limit=3&appid=${apiKey}`;
      
      console.log('🗺️ FIXED: Geocoding', cleanCityName);
      
      const response = await fetch(geocodingUrl);
      if (!response.ok) {
        console.error('❌ FIXED: Geocoding API error:', response.status);
        return null;
      }

      const data = await response.json();
      if (!data || data.length === 0) {
        console.log('❌ FIXED: No geocoding results for', cleanCityName);
        return null;
      }

      // Prefer US results
      const result = data.find((r: any) => r.country === 'US') || data[0];
      
      console.log('📍 FIXED: Geocoding result for', cleanCityName, {
        lat: result.lat,
        lon: result.lon,
        country: result.country
      });
      
      return { lat: result.lat, lng: result.lon };
    } catch (error) {
      console.error('❌ FIXED: Geocoding error:', error);
      return null;
    }
  }

  /**
   * Create fallback weather
   */
  private static createFallbackWeather(cityName: string, targetDate: Date): ForecastWeatherData {
    const targetDateString = targetDate.toISOString().split('T')[0];
    const daysFromToday = Math.ceil((targetDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
    
    console.log('📊 FIXED: Creating fallback weather for', cityName, {
      targetDateString,
      daysFromToday
    });
    
    return WeatherFallbackService.createFallbackForecast(
      cityName,
      targetDate,
      targetDateString,
      daysFromToday
    );
  }
}
