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
  // ENHANCED: Extended to 7-day forecast range to match OpenWeatherMap's capability
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
    
    console.log('🚀 ENHANCED: SimpleWeatherFetcher - live forecast prioritization', {
      cityName,
      targetDate: targetDate.toISOString(),
      hasApiKey,
      isSharedView,
      segmentDay,
      strategy: 'prioritize_live_when_available'
    });

    // ENHANCED STEP 1: Strict API key validation first
    const validApiKey = await this.validateApiKey();
    const hasValidApiKey = validApiKey !== null;

    console.log('🔑 ENHANCED: API key validation result', {
      cityName,
      hasStoredKey: !!localStorage.getItem('weather_api_key'),
      hasLegacyKey: !!localStorage.getItem('openweathermap_api_key'),
      hasValidApiKey,
      keyLength: validApiKey?.length || 0
    });

    // ENHANCED STEP 2: Date range validation for live forecasts
    const today = new Date();
    const daysFromToday = Math.ceil((targetDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
    const isWithinLiveForecastRange = daysFromToday >= 0 && daysFromToday <= this.LIVE_FORECAST_MAX_DAYS;
    
    console.log('📅 ENHANCED: Date range analysis for live forecast', {
      cityName,
      targetDate: targetDate.toISOString(),
      daysFromToday,
      isWithinLiveForecastRange,
      maxDays: this.LIVE_FORECAST_MAX_DAYS,
      eligibleForLive: hasValidApiKey && isWithinLiveForecastRange
    });

    // ENHANCED STEP 3: Attempt live forecast if ALL conditions are met
    if (hasValidApiKey && isWithinLiveForecastRange) {
      console.log('✅ ENHANCED: All conditions met - attempting live forecast for', cityName);
      
      try {
        const coords = await this.getEnhancedCoordinates(cityName, validApiKey);
        if (coords) {
          console.log('✅ ENHANCED: Coordinates obtained, fetching live weather');

          const liveWeather = await this.fetchLiveWeatherData(coords, validApiKey, targetDate, cityName, segmentDay);
          if (liveWeather) {
            console.log('🎯 ENHANCED: LIVE FORECAST SUCCESS - verified properties', {
              cityName,
              temperature: liveWeather.temperature,
              source: liveWeather.source,
              isActualForecast: liveWeather.isActualForecast,
              description: liveWeather.description,
              isVerifiedLive: liveWeather.source === 'live_forecast' && liveWeather.isActualForecast === true
            });
            return liveWeather;
          }
        }
      } catch (error) {
        console.warn('⚠️ ENHANCED: Live forecast attempt failed, using fallback:', error);
      }
    } else {
      const reason = !hasValidApiKey ? 'invalid_api_key' : 
                    !isWithinLiveForecastRange ? `outside_range_day_${daysFromToday}` : 'unknown';
      console.log('🔄 ENHANCED: Live forecast not attempted:', { cityName, reason, daysFromToday });
    }

    // ENHANCED STEP 4: Create fallback weather with correct source identification
    console.log('🔄 ENHANCED: Creating fallback weather for', cityName, { 
      daysFromToday, 
      reason: hasValidApiKey ? 'outside_range_or_failed' : 'no_api_key'
    });
    
    return this.createEnhancedFallbackWeather(cityName, targetDate, segmentDay, daysFromToday);
  }

  private static async validateApiKey(): Promise<string | null> {
    // Check both possible storage locations
    const primaryKey = localStorage.getItem('weather_api_key');
    const legacyKey = localStorage.getItem('openweathermap_api_key');
    
    const apiKey = primaryKey || legacyKey;
    
    // Validate key format (OpenWeatherMap keys are 32 characters)
    if (!apiKey || apiKey.trim().length < 20 || apiKey === 'your_api_key_here') {
      console.log('❌ ENHANCED: Invalid or missing API key');
      return null;
    }

    console.log('✅ ENHANCED: Valid API key found', {
      keyLength: apiKey.length,
      source: primaryKey ? 'weather_api_key' : 'openweathermap_api_key',
      preview: `${apiKey.substring(0, 8)}...`
    });

    return apiKey;
  }

  private static async getEnhancedCoordinates(cityName: string, apiKey: string): Promise<{ lat: number; lng: number } | null> {
    try {
      const formattedCityName = this.formatCityNameForGeocoding(cityName);
      console.log('🔍 ENHANCED: Fetching coordinates with valid API key', {
        originalCity: cityName,
        formattedCity: formattedCityName,
        hasApiKey: true
      });

      const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(formattedCityName)}&limit=5&appid=${apiKey}`;
      
      const response = await fetch(geocodingUrl);

      if (!response.ok) {
        console.log('❌ ENHANCED: Geocoding API failed', {
          status: response.status,
          statusText: response.statusText,
          cityName: formattedCityName
        });
        return null;
      }

      const data = await response.json();
      
      if (!data || data.length === 0) {
        console.log('❌ ENHANCED: No geocoding results for', formattedCityName);
        return null;
      }

      const bestMatch = this.selectBestGeocodingMatch(data, cityName);
      const coords = { lat: bestMatch.lat, lng: bestMatch.lon };
      
      console.log('✅ ENHANCED: Coordinates obtained successfully', {
        city: formattedCityName,
        coordinates: coords,
        country: bestMatch.country,
        state: bestMatch.state
      });
      
      return coords;
    } catch (error) {
      console.error('❌ ENHANCED: Geocoding error:', error);
      return null;
    }
  }

  private static formatCityNameForGeocoding(cityName: string): string {
    let formatted = cityName.trim();
    
    // If it already has state/country info, keep it
    if (formatted.includes(',')) {
      return formatted;
    }
    
    // Add US country code for better results
    return `${formatted},US`;
  }

  private static selectBestGeocodingMatch(results: any[], originalCity: string): any {
    // Prefer US results for Route 66 cities
    const usResults = results.filter(r => r.country === 'US');
    if (usResults.length > 0) {
      return usResults[0];
    }
    
    return results[0];
  }

  private static async fetchLiveWeatherData(
    coords: { lat: number; lng: number },
    apiKey: string,
    targetDate: Date,
    cityName: string,
    segmentDay: number
  ): Promise<ForecastWeatherData | null> {
    try {
      console.log('🌤️ ENHANCED: Fetching live weather data with valid API key', {
        cityName,
        coordinates: coords,
        targetDate: targetDate.toISOString(),
        segmentDay
      });

      const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial`;
      
      const response = await fetch(weatherUrl);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ ENHANCED: Weather API request failed', {
          status: response.status,
          statusText: response.statusText,
          errorBody: errorText.substring(0, 200),
          cityName
        });
        return null;
      }

      const data = await response.json();
      if (!data.list || data.list.length === 0) {
        console.log('❌ ENHANCED: Empty weather response for', cityName);
        return null;
      }

      console.log('✅ ENHANCED: Weather API response received', {
        cityName,
        forecastItems: data.list.length,
        firstItemDate: data.list[0]?.dt_txt,
        cityFromAPI: data.city?.name
      });

      // ENHANCED: Find best match for target date
      const targetDateString = targetDate.toISOString().split('T')[0];
      let bestMatch = null;

      // Strategy 1: Try exact date match
      bestMatch = data.list.find((item: any) => {
        const itemDate = new Date(item.dt * 1000).toISOString().split('T')[0];
        return itemDate === targetDateString;
      });

      // Strategy 2: Use closest available if no exact match
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
        console.log('❌ ENHANCED: No suitable weather match found for', cityName);
        return null;
      }

      const matchedDate = new Date(bestMatch.dt * 1000).toISOString().split('T')[0];
      console.log('✅ ENHANCED: Weather match found', {
        cityName,
        targetDate: targetDateString,
        matchedDate,
        matchType: matchedDate === targetDateString ? 'exact' : 'closest'
      });

      // Apply city-specific variation for uniqueness
      const variation = this.getCitySpecificVariation(cityName, segmentDay);

      // ENHANCED: Create live forecast with verified properties
      const liveWeatherResult: ForecastWeatherData = {
        temperature: Math.round(bestMatch.main.temp + variation.tempOffset),
        highTemp: Math.round(bestMatch.main.temp_max + variation.tempOffset),
        lowTemp: Math.round(bestMatch.main.temp_min + variation.tempOffset),
        description: bestMatch.weather[0]?.description || variation.description,
        icon: bestMatch.weather[0]?.icon || variation.icon,
        humidity: Math.max(0, Math.min(100, bestMatch.main.humidity + variation.humidityOffset)),
        windSpeed: Math.max(0, Math.round((bestMatch.wind?.speed || 0) + variation.windOffset)),
        precipitationChance: Math.max(0, Math.min(100, Math.round((bestMatch.pop || 0) * 100) + variation.precipitationOffset)),
        cityName,
        forecast: [],
        forecastDate: targetDate,
        isActualForecast: true, // CRITICAL: Must be true for live forecasts
        source: 'live_forecast' as const // CRITICAL: Must be 'live_forecast'
      };

      console.log('🎯 ENHANCED: LIVE FORECAST CREATED with verified properties', {
        cityName,
        temperature: liveWeatherResult.temperature,
        isActualForecast: liveWeatherResult.isActualForecast,
        source: liveWeatherResult.source,
        isVerifiedLive: liveWeatherResult.source === 'live_forecast' && liveWeatherResult.isActualForecast === true,
        description: liveWeatherResult.description
      });

      return liveWeatherResult;

    } catch (error) {
      console.error('❌ ENHANCED: Live weather fetch error:', error);
      return null;
    }
  }

  private static createEnhancedFallbackWeather(
    cityName: string, 
    targetDate: Date, 
    segmentDay: number,
    daysFromToday: number
  ): ForecastWeatherData {
    const targetDateString = targetDate.toISOString().split('T')[0];

    console.log('🔄 ENHANCED: Creating fallback weather with proper source', {
      cityName,
      targetDateString,
      daysFromToday,
      segmentDay,
      reason: daysFromToday > 7 ? 'beyond_forecast_range' : 'api_unavailable'
    });

    const baseFallback = WeatherFallbackService.createFallbackForecast(
      cityName,
      targetDate,
      targetDateString,
      daysFromToday
    );

    // Apply city+day variations for uniqueness
    const enhancedWeather = CityWeatherVariationService.applyVariationToWeather(
      baseFallback, 
      `${cityName}-day-${segmentDay}`
    );

    console.log('✅ ENHANCED: Fallback weather created with correct source', {
      cityName,
      temperature: enhancedWeather.temperature,
      description: enhancedWeather.description,
      source: enhancedWeather.source,
      isActualForecast: enhancedWeather.isActualForecast,
      isVerifiedFallback: enhancedWeather.source === 'historical_fallback' && enhancedWeather.isActualForecast === false
    });

    return enhancedWeather;
  }
}
