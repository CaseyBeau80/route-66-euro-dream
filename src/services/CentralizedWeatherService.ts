import { getCurrentApiKey, validateApiKey } from '@/config/weatherConfig';

export interface WeatherData {
  temperature: number;
  highTemp?: number;
  lowTemp?: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  precipitationChance: number;
  cityName: string;
  source: 'live_forecast' | 'seasonal_fallback';
  isActualForecast: boolean;
  confidence: 'high' | 'medium' | 'low';
  forecastDate: Date;
  daysFromToday: number;
}

export interface WeatherFetchResult {
  success: boolean;
  weather?: WeatherData;
  error?: string;
  source: 'live_api' | 'seasonal_fallback';
  fetchTime: number;
  debugInfo: {
    apiKeyAvailable: boolean;
    cityName: string;
    targetDate: string;
    daysFromToday: number;
    withinForecastRange: boolean;
    geoSuccess?: boolean;
    apiCallSuccess?: boolean;
    fallbackReason?: string;
  };
}

export class CentralizedWeatherService {
  private static readonly FORECAST_RANGE_DAYS = 7;
  private static readonly API_TIMEOUT = 8000;

  /**
   * Main entry point for weather fetching with comprehensive logging
   */
  static async fetchWeatherForCity(
    cityName: string,
    targetDate: Date
  ): Promise<WeatherFetchResult> {
    const startTime = Date.now();
    
    // Normalize target date to prevent timezone drift
    const normalizedDate = this.normalizeToLocalDate(targetDate);
    const targetDateString = this.formatDateForApi(normalizedDate);
    const daysFromToday = this.calculateDaysFromToday(normalizedDate);
    const withinForecastRange = daysFromToday >= 0 && daysFromToday <= this.FORECAST_RANGE_DAYS;

    console.log('🌤️ CENTRALIZED WEATHER: Starting fetch with enhanced logging', {
      cityName,
      originalDate: targetDate.toISOString(),
      normalizedDate: normalizedDate.toISOString(),
      targetDateString,
      daysFromToday,
      withinForecastRange,
      forecastRangeLimit: this.FORECAST_RANGE_DAYS
    });

    const debugInfo = {
      apiKeyAvailable: false,
      cityName,
      targetDate: targetDateString,
      daysFromToday,
      withinForecastRange,
      fallbackReason: undefined as string | undefined
    };

    // Check API key availability
    const apiKey = getCurrentApiKey();
    const hasValidApiKey = apiKey && validateApiKey(apiKey);
    debugInfo.apiKeyAvailable = !!hasValidApiKey;

    console.log('🔑 CENTRALIZED WEATHER: API Key Status', {
      hasApiKey: !!apiKey,
      isValid: hasValidApiKey,
      keyLength: apiKey?.length || 0
    });

    // Attempt live forecast if conditions are met
    if (hasValidApiKey && withinForecastRange) {
      console.log('🚀 CENTRALIZED WEATHER: Attempting live forecast');
      
      try {
        const liveResult = await this.fetchLiveForecast(
          cityName,
          normalizedDate,
          apiKey!,
          debugInfo
        );

        if (liveResult.success && liveResult.weather) {
          const fetchTime = Date.now() - startTime;
          console.log('✅ CENTRALIZED WEATHER: Live forecast SUCCESS', {
            cityName,
            temperature: liveResult.weather.temperature,
            source: liveResult.weather.source,
            fetchTime
          });

          return {
            success: true,
            weather: liveResult.weather,
            source: 'live_api',
            fetchTime,
            debugInfo: { ...debugInfo, ...liveResult.debugInfo }
          };
        } else {
          console.log('⚠️ CENTRALIZED WEATHER: Live forecast failed, using fallback', {
            reason: liveResult.error,
            debugInfo: liveResult.debugInfo
          });
          debugInfo.fallbackReason = liveResult.error || 'unknown_live_error';
        }
      } catch (error) {
        console.error('❌ CENTRALIZED WEATHER: Live forecast error', error);
        debugInfo.fallbackReason = `live_error: ${error instanceof Error ? error.message : 'unknown'}`;
      }
    } else {
      const reason = !hasValidApiKey ? 'no_api_key' : 'outside_forecast_range';
      console.log('ℹ️ CENTRALIZED WEATHER: Skipping live forecast', { reason });
      debugInfo.fallbackReason = reason;
    }

    // Create seasonal fallback
    console.log('🌱 CENTRALIZED WEATHER: Creating seasonal fallback');
    const fallbackWeather = this.createSeasonalFallback(
      cityName,
      normalizedDate,
      daysFromToday
    );

    const fetchTime = Date.now() - startTime;
    
    console.log('✅ CENTRALIZED WEATHER: Seasonal fallback created', {
      cityName,
      temperature: fallbackWeather.temperature,
      source: fallbackWeather.source,
      fetchTime
    });

    return {
      success: true,
      weather: fallbackWeather,
      source: 'seasonal_fallback',
      fetchTime,
      debugInfo
    };
  }

  /**
   * Attempt to fetch live weather forecast
   */
  private static async fetchLiveForecast(
    cityName: string,
    targetDate: Date,
    apiKey: string,
    debugInfo: any
  ): Promise<{ success: boolean; weather?: WeatherData; error?: string; debugInfo: any }> {
    try {
      // Step 1: Get coordinates
      console.log('🌍 CENTRALIZED WEATHER: Getting coordinates for', cityName);
      const coords = await this.getCoordinates(cityName, apiKey);
      
      if (!coords) {
        debugInfo.geoSuccess = false;
        return {
          success: false,
          error: 'geocoding_failed',
          debugInfo
        };
      }

      debugInfo.geoSuccess = true;
      console.log('✅ CENTRALIZED WEATHER: Coordinates found', coords);

      // Step 2: Get weather forecast
      console.log('🌤️ CENTRALIZED WEATHER: Fetching weather forecast');
      const weatherData = await this.getWeatherForecast(
        coords.lat,
        coords.lon,
        cityName,
        targetDate,
        apiKey
      );

      if (!weatherData) {
        debugInfo.apiCallSuccess = false;
        return {
          success: false,
          error: 'weather_api_failed',
          debugInfo
        };
      }

      debugInfo.apiCallSuccess = true;
      console.log('✅ CENTRALIZED WEATHER: Weather data received', {
        temperature: weatherData.temperature,
        description: weatherData.description
      });

      return {
        success: true,
        weather: weatherData,
        debugInfo
      };

    } catch (error) {
      console.error('❌ CENTRALIZED WEATHER: Live forecast error', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'unknown_error',
        debugInfo: { ...debugInfo, error: String(error) }
      };
    }
  }

  /**
   * Get coordinates for a city
   */
  private static async getCoordinates(
    cityName: string,
    apiKey: string
  ): Promise<{ lat: number; lon: number } | null> {
    try {
      const cleanCityName = cityName.replace(/,\s*[A-Z]{2}$/, '').trim();
      const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cleanCityName)}&limit=3&appid=${apiKey}`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.API_TIMEOUT);

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }

      const data = await response.json();
      if (!data || data.length === 0) {
        return null;
      }

      // Prefer US locations
      const usLocation = data.find((r: any) => r.country === 'US') || data[0];
      return { lat: usLocation.lat, lon: usLocation.lon };

    } catch (error) {
      console.error('❌ CENTRALIZED WEATHER: Geocoding failed', error);
      return null;
    }
  }

  /**
   * Get weather forecast for coordinates
   */
  private static async getWeatherForecast(
    lat: number,
    lon: number,
    cityName: string,
    targetDate: Date,
    apiKey: string
  ): Promise<WeatherData | null> {
    try {
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.API_TIMEOUT);

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.list || data.list.length === 0) {
        return null;
      }

      // Find best match for target date
      const targetDateString = this.formatDateForApi(targetDate);
      const bestMatch = this.findBestForecastMatch(data.list, targetDateString);

      if (!bestMatch) {
        return null;
      }

      const daysFromToday = this.calculateDaysFromToday(targetDate);

      return {
        temperature: Math.round(bestMatch.main.temp),
        highTemp: Math.round(bestMatch.main.temp_max),
        lowTemp: Math.round(bestMatch.main.temp_min),
        description: bestMatch.weather[0]?.description || 'Partly Cloudy',
        icon: bestMatch.weather[0]?.icon || '02d',
        humidity: bestMatch.main.humidity || 60,
        windSpeed: Math.round(bestMatch.wind?.speed || 0),
        precipitationChance: Math.round((bestMatch.pop || 0) * 100),
        cityName,
        source: 'live_forecast',
        isActualForecast: true,
        confidence: 'high',
        forecastDate: targetDate,
        daysFromToday
      };

    } catch (error) {
      console.error('❌ CENTRALIZED WEATHER: Weather forecast failed', error);
      return null;
    }
  }

  /**
   * Find the best forecast match for a target date
   */
  private static findBestForecastMatch(forecastList: any[], targetDateString: string): any | null {
    // Try to find exact date match first
    const exactMatch = forecastList.find(item => {
      const itemDate = new Date(item.dt * 1000).toISOString().split('T')[0];
      return itemDate === targetDateString;
    });

    if (exactMatch) {
      console.log('🎯 CENTRALIZED WEATHER: Found exact date match');
      return exactMatch;
    }

    // Find closest match
    const targetTime = new Date(targetDateString).getTime();
    let closestMatch = forecastList[0];
    let smallestDiff = Math.abs(new Date(forecastList[0].dt * 1000).getTime() - targetTime);

    for (const item of forecastList) {
      const itemTime = new Date(item.dt * 1000).getTime();
      const diff = Math.abs(itemTime - targetTime);
      
      if (diff < smallestDiff) {
        smallestDiff = diff;
        closestMatch = item;
      }
    }

    console.log('📍 CENTRALIZED WEATHER: Using closest match', {
      targetDate: targetDateString,
      matchedDate: new Date(closestMatch.dt * 1000).toISOString().split('T')[0],
      diffHours: Math.round(smallestDiff / (1000 * 60 * 60))
    });

    return closestMatch;
  }

  /**
   * Create seasonal fallback weather
   */
  private static createSeasonalFallback(
    cityName: string,
    targetDate: Date,
    daysFromToday: number
  ): WeatherData {
    const month = targetDate.getMonth();
    
    // Seasonal temperature data
    const seasonalTemps = {
      0: 45, 1: 52, 2: 61, 3: 70, 4: 78, 5: 87,
      6: 92, 7: 90, 8: 82, 9: 71, 10: 58, 11: 47
    };

    const baseTemp = seasonalTemps[month as keyof typeof seasonalTemps];
    const tempVariation = 12;

    // City-specific variation based on name hash
    const cityHash = cityName.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const variation = (Math.abs(cityHash) % tempVariation) - tempVariation/2;
    const temperature = Math.round(baseTemp + variation);

    // Seasonal descriptions
    const seasonalDescs = {
      0: 'Cool and Clear', 1: 'Mild and Sunny', 2: 'Pleasant', 3: 'Warm and Clear',
      4: 'Perfect Weather', 5: 'Hot and Sunny', 6: 'Very Hot', 7: 'Hot and Sunny',
      8: 'Warm', 9: 'Pleasant', 10: 'Cool', 11: 'Cool and Clear'
    };

    const seasonalIcons = {
      0: '☀️', 1: '🌤️', 2: '☀️', 3: '☀️', 4: '☀️', 5: '☀️',
      6: '🌞', 7: '🌞', 8: '☀️', 9: '🌤️', 10: '🌤️', 11: '☀️'
    };

    return {
      temperature,
      highTemp: temperature + 8,
      lowTemp: temperature - 8,
      description: seasonalDescs[month as keyof typeof seasonalDescs],
      icon: seasonalIcons[month as keyof typeof seasonalIcons],
      humidity: 55 + (Math.abs(cityHash) % 30),
      windSpeed: 6 + (Math.abs(cityHash) % 8),
      precipitationChance: 15 + (Math.abs(cityHash) % 25),
      cityName,
      source: 'seasonal_fallback',
      isActualForecast: false,
      confidence: 'low',
      forecastDate: targetDate,
      daysFromToday
    };
  }

  /**
   * Normalize date to prevent timezone drift
   */
  private static normalizeToLocalDate(date: Date): Date {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    return new Date(year, month, day, 12, 0, 0, 0); // Set to noon to avoid timezone issues
  }

  /**
   * Calculate days from today using local dates
   */
  private static calculateDaysFromToday(targetDate: Date): number {
    const today = new Date();
    const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const normalizedTarget = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    
    const diffTime = normalizedTarget.getTime() - normalizedToday.getTime();
    return Math.floor(diffTime / (24 * 60 * 60 * 1000));
  }

  /**
   * Format date for API calls
   */
  private static formatDateForApi(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
