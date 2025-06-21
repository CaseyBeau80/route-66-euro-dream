
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { OpenWeatherService } from '@/services/OpenWeatherService';
import { WeatherFallbackService } from '@/components/Route66Map/services/weather/WeatherFallbackService';

export interface PriorityWeatherResult {
  weather: ForecastWeatherData;
  source: 'live_api' | 'seasonal_fallback';
  delay: number;
}

export class PriorityWeatherService {
  private static readonly API_DELAY_MS = 400; // 400ms delay for API response
  private static readonly FORECAST_RANGE_DAYS = 7;

  /**
   * Fetch weather with prioritized live API and proper fallbacks
   */
  static async fetchWeatherWithPriority(
    cityName: string,
    targetDate: Date,
    segmentDay: number
  ): Promise<PriorityWeatherResult> {
    console.log('🚀 PRIORITY: Starting prioritized weather fetch for', cityName, {
      targetDate: targetDate.toISOString(),
      segmentDay
    });

    const startTime = Date.now();
    
    // Check if date is within forecast range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const normalizedTargetDate = new Date(targetDate);
    normalizedTargetDate.setHours(0, 0, 0, 0);
    const daysFromToday = Math.ceil((normalizedTargetDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
    const isWithinForecastRange = daysFromToday >= 0 && daysFromToday <= this.FORECAST_RANGE_DAYS;

    console.log('📅 PRIORITY: Date analysis for', cityName, {
      today: today.toISOString(),
      targetDate: normalizedTargetDate.toISOString(),
      daysFromToday,
      isWithinForecastRange
    });

    // Try live API if within range and API key available
    if (isWithinForecastRange) {
      const openWeatherService = OpenWeatherService.getInstance();
      
      if (openWeatherService.hasValidApiKey()) {
        console.log('🌤️ PRIORITY: Attempting live API fetch for', cityName);
        
        try {
          // Add delay for API response
          await this.delay(this.API_DELAY_MS);
          
          const liveWeather = await openWeatherService.getWeatherByCity(cityName, targetDate);
          
          if (liveWeather) {
            console.log('✅ PRIORITY: Live API success for', cityName, {
              temperature: liveWeather.temperature,
              source: liveWeather.source,
              isActualForecast: liveWeather.isActualForecast
            });

            // Convert to proper format with explicit live source
            const priorityWeather: ForecastWeatherData = {
              temperature: liveWeather.temperature,
              highTemp: liveWeather.highTemp,
              lowTemp: liveWeather.lowTemp,
              description: liveWeather.description,
              icon: liveWeather.icon,
              humidity: liveWeather.humidity,
              windSpeed: liveWeather.windSpeed,
              precipitationChance: liveWeather.precipitationChance,
              cityName: liveWeather.cityName,
              forecast: [],
              forecastDate: targetDate,
              isActualForecast: true,
              source: 'live_forecast'
            };

            const delay = Date.now() - startTime;
            return {
              weather: priorityWeather,
              source: 'live_api',
              delay
            };
          }
        } catch (error) {
          console.warn('⚠️ PRIORITY: Live API failed for', cityName, error);
        }
      } else {
        console.log('🔑 PRIORITY: No valid API key, skipping live fetch for', cityName);
      }
    } else {
      console.log('📅 PRIORITY: Date outside forecast range, using fallback for', cityName);
    }

    // Fallback to seasonal data
    console.log('🌱 PRIORITY: Using seasonal fallback for', cityName);
    const fallbackWeather = WeatherFallbackService.createFallbackForecast(
      cityName,
      targetDate,
      targetDate.toISOString().split('T')[0],
      daysFromToday
    );

    // Explicitly mark as seasonal fallback
    fallbackWeather.source = 'historical_fallback';
    fallbackWeather.isActualForecast = false;

    const delay = Date.now() - startTime;
    return {
      weather: fallbackWeather,
      source: 'seasonal_fallback',
      delay
    };
  }

  /**
   * Simple delay utility
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Check if weather source is live API data
   */
  static isLiveWeather(weather: ForecastWeatherData): boolean {
    return weather.source === 'live_forecast' && weather.isActualForecast === true;
  }

  /**
   * Get appropriate label for weather source
   */
  static getSourceLabel(weather: ForecastWeatherData): string {
    if (this.isLiveWeather(weather)) {
      return '🟢 Live Weather Forecast';
    } else {
      return '📊 Seasonal Weather Data';
    }
  }

  /**
   * Get source badge color
   */
  static getSourceColor(weather: ForecastWeatherData): string {
    return this.isLiveWeather(weather) ? '#059669' : '#d97706';
  }
}
