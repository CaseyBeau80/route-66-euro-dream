
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';
import { WeatherFallbackService } from '@/components/Route66Map/services/weather/WeatherFallbackService';

export interface WeatherFetchResult {
  weather: ForecastWeatherData | null;
  error: string | null;
}

export class UnifiedWeatherService {
  /**
   * ENHANCED: Main entry point with comprehensive validation and debugging
   */
  static async fetchWeatherForSegment(
    cityName: string,
    targetDate: Date,
    segmentDay: number,
    forceRefresh: boolean = false
  ): Promise<WeatherFetchResult> {
    const operationId = `${cityName}-${targetDate.toISOString().split('T')[0]}-${Date.now()}`;
    
    console.log('🔍 ENHANCED: UnifiedWeatherService operation started:', {
      operationId,
      cityName,
      targetDate: targetDate.toISOString(),
      segmentDay,
      forceRefresh,
      enhancedDebugMode: true
    });

    // Step 1: Enhanced API key validation
    const apiKey = WeatherApiKeyManager.getApiKey();
    const hasValidApiKey = !!apiKey && apiKey !== 'YOUR_API_KEY_HERE' && apiKey.length > 10;

    console.log('🔍 ENHANCED: API key validation:', {
      operationId,
      hasApiKey: !!apiKey,
      isValidFormat: hasValidApiKey,
      keyLength: apiKey?.length || 0,
      keyPreview: apiKey ? apiKey.substring(0, 8) + '...' : 'none'
    });

    // Step 2: Enhanced date analysis
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDateCopy = new Date(targetDate);
    targetDateCopy.setHours(0, 0, 0, 0);
    const daysFromToday = Math.ceil((targetDateCopy.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
    const isWithinForecastRange = daysFromToday >= 0 && daysFromToday <= 5;

    console.log('🔍 ENHANCED: Date analysis for live forecast:', {
      operationId,
      today: today.toISOString(),
      targetDate: targetDateCopy.toISOString(),
      daysFromToday,
      isWithinForecastRange,
      shouldAttemptLive: hasValidApiKey && isWithinForecastRange
    });

    // Step 3: Enhanced live forecast attempt
    if (hasValidApiKey && isWithinForecastRange) {
      try {
        console.log('🔍 ENHANCED: Attempting live forecast for', cityName, operationId);
        const liveWeather = await this.fetchLiveWeather(cityName, targetDate, apiKey, operationId);
        
        if (liveWeather) {
          // ENHANCED: Comprehensive data validation
          const isValidLiveData = this.validateLiveWeatherData(liveWeather, operationId);
          
          if (isValidLiveData) {
            console.log('✅ ENHANCED: Live forecast SUCCESS and VALIDATED for', cityName, {
              operationId,
              temperature: liveWeather.temperature,
              source: liveWeather.source,
              isActualForecast: liveWeather.isActualForecast,
              description: liveWeather.description,
              validationPassed: true,
              timestamp: new Date().toISOString()
            });
            return { weather: liveWeather, error: null };
          } else {
            console.error('❌ ENHANCED: Live weather data failed validation:', liveWeather);
          }
        }
      } catch (error) {
        console.error('❌ ENHANCED: Live forecast failed for', cityName, {
          operationId,
          error: error instanceof Error ? error.message : error
        });
      }
    }

    // Step 4: Enhanced fallback to historical data
    console.log('🔄 ENHANCED: Using fallback weather for', cityName, {
      operationId,
      reason: !hasValidApiKey ? 'no_api_key' : !isWithinForecastRange ? 'outside_forecast_range' : 'live_fetch_failed'
    });

    const fallbackWeather = WeatherFallbackService.createFallbackForecast(
      cityName,
      targetDate,
      targetDate.toISOString().split('T')[0],
      daysFromToday
    );

    // ENHANCED: Validate fallback data too
    if (fallbackWeather) {
      const isValidFallbackData = this.validateFallbackWeatherData(fallbackWeather, operationId);
      if (isValidFallbackData) {
        console.log('✅ ENHANCED: Fallback weather validated for', cityName, {
          operationId,
          source: fallbackWeather.source,
          isActualForecast: fallbackWeather.isActualForecast,
          timestamp: new Date().toISOString()
        });
      }
    }

    return { weather: fallbackWeather, error: null };
  }

  /**
   * ENHANCED: Live weather API call with comprehensive validation
   */
  private static async fetchLiveWeather(
    cityName: string,
    targetDate: Date,
    apiKey: string,
    operationId: string
  ): Promise<ForecastWeatherData | null> {
    try {
      // Get coordinates
      const coords = await this.getCoordinates(cityName, apiKey);
      if (!coords) {
        console.log('❌ ENHANCED: No coordinates for', cityName, operationId);
        return null;
      }

      // Fetch 5-day forecast
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial`;
      console.log('🔍 ENHANCED: Calling OpenWeather API for', cityName, operationId);

      const response = await fetch(forecastUrl);
      if (!response.ok) {
        console.error('❌ ENHANCED: API call failed:', {
          operationId,
          status: response.status,
          statusText: response.statusText
        });
        return null;
      }

      const data = await response.json();
      if (!data.list || data.list.length === 0) {
        console.error('❌ ENHANCED: No forecast data returned', operationId);
        return null;
      }

      // Find best match for target date
      const targetDateString = targetDate.toISOString().split('T')[0];
      const bestMatch = data.list.find((item: any) => {
        const itemDate = new Date(item.dt * 1000).toISOString().split('T')[0];
        return itemDate === targetDateString;
      }) || data.list[0]; // Fallback to first available

      // ENHANCED: Create live forecast data with EXPLICIT and VALIDATED properties
      const liveWeather: ForecastWeatherData = {
        temperature: Math.round(bestMatch.main.temp),
        highTemp: Math.round(bestMatch.main.temp_max),
        lowTemp: Math.round(bestMatch.main.temp_min),
        description: bestMatch.weather[0]?.description || 'Partly Cloudy',
        icon: bestMatch.weather[0]?.icon || '02d',
        humidity: bestMatch.main.humidity,
        windSpeed: Math.round(bestMatch.wind?.speed || 0),
        precipitationChance: Math.round((bestMatch.pop || 0) * 100),
        cityName: cityName,
        forecast: [],
        forecastDate: targetDate,
        isActualForecast: true, // ENHANCED: Explicitly true for live API data
        source: 'live_forecast' as const // ENHANCED: Explicitly typed as const
      };

      console.log('✅ ENHANCED: Live weather data created with validation for', cityName, {
        operationId,
        temperature: liveWeather.temperature,
        isActualForecast: liveWeather.isActualForecast,
        source: liveWeather.source,
        description: liveWeather.description,
        typeValidation: {
          sourceType: typeof liveWeather.source,
          actualType: typeof liveWeather.isActualForecast,
          sourceValue: liveWeather.source,
          actualValue: liveWeather.isActualForecast
        },
        creationTimestamp: new Date().toISOString()
      });

      return liveWeather;
    } catch (error) {
      console.error('❌ ENHANCED: Live weather fetch error:', {
        operationId,
        error: error instanceof Error ? error.message : error
      });
      return null;
    }
  }

  /**
   * ENHANCED: Validate live weather data structure and properties
   */
  private static validateLiveWeatherData(weather: ForecastWeatherData, operationId: string): boolean {
    const validations = {
      hasTemperature: weather.temperature !== undefined && !isNaN(weather.temperature),
      hasSource: weather.source === 'live_forecast',
      hasActualForecast: weather.isActualForecast === true,
      hasDescription: typeof weather.description === 'string' && weather.description.length > 0,
      hasIcon: typeof weather.icon === 'string' && weather.icon.length > 0
    };

    const isValid = Object.values(validations).every(Boolean);

    console.log('🔍 ENHANCED: Live weather data validation:', {
      operationId,
      validations,
      isValid,
      weatherData: {
        temperature: weather.temperature,
        source: weather.source,
        isActualForecast: weather.isActualForecast,
        description: weather.description,
        icon: weather.icon
      }
    });

    return isValid;
  }

  /**
   * ENHANCED: Validate fallback weather data structure
   */
  private static validateFallbackWeatherData(weather: ForecastWeatherData, operationId: string): boolean {
    const validations = {
      hasTemperature: weather.temperature !== undefined && !isNaN(weather.temperature),
      hasSource: weather.source === 'historical_fallback',
      hasActualForecast: weather.isActualForecast === false,
      hasDescription: typeof weather.description === 'string' && weather.description.length > 0
    };

    const isValid = Object.values(validations).every(Boolean);

    console.log('🔍 ENHANCED: Fallback weather data validation:', {
      operationId,
      validations,
      isValid,
      weatherData: {
        temperature: weather.temperature,
        source: weather.source,
        isActualForecast: weather.isActualForecast,
        description: weather.description
      }
    });

    return isValid;
  }

  /**
   * Geocoding helper (unchanged but with enhanced logging)
   */
  private static async getCoordinates(cityName: string, apiKey: string) {
    try {
      const cleanCityName = cityName.replace(/,\s*[A-Z]{2}$/, '').trim();
      const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cleanCityName)}&limit=3&appid=${apiKey}`;
      
      const response = await fetch(geocodingUrl);
      if (!response.ok) return null;

      const data = await response.json();
      if (!data || data.length === 0) return null;

      const result = data.find((r: any) => r.country === 'US') || data[0];
      console.log('🔍 ENHANCED: Coordinates found for', cityName, { lat: result.lat, lng: result.lon });
      return { lat: result.lat, lng: result.lon };
    } catch (error) {
      console.error('❌ ENHANCED: Geocoding error:', error);
      return null;
    }
  }
}
