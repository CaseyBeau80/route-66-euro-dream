
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

export class LiveWeatherDetectionService {
  /**
   * Explicit live weather detection with multiple validation checks
   */
  static isLiveWeatherForecast(weather: ForecastWeatherData): boolean {
    console.log('🔍 LiveWeatherDetectionService: Analyzing weather data:', {
      source: weather.source,
      isActualForecast: weather.isActualForecast,
      hasTemperature: !!weather.temperature,
      hasHighLow: !!(weather.highTemp && weather.lowTemp),
      cityName: weather.cityName
    });

    // PRIMARY CHECK: Both source and isActualForecast must be correct
    const isLiveForecast = weather.source === 'live_forecast' && weather.isActualForecast === true;
    
    // SECONDARY CHECK: Must have real temperature data
    const hasRealData = weather.temperature !== undefined && weather.temperature > 0;
    
    // TERTIARY CHECK: Must have realistic weather values
    const hasRealisticData = weather.temperature >= -50 && weather.temperature <= 150;
    
    const result = isLiveForecast && hasRealData && hasRealisticData;
    
    console.log('🔍 LiveWeatherDetectionService: Detection result:', {
      isLiveForecast,
      hasRealData,
      hasRealisticData,
      finalResult: result,
      weatherData: {
        source: weather.source,
        isActualForecast: weather.isActualForecast,
        temperature: weather.temperature
      }
    });

    return result;
  }

  /**
   * Get the appropriate weather source label
   */
  static getWeatherSourceLabel(weather: ForecastWeatherData): string {
    const isLive = this.isLiveWeatherForecast(weather);
    
    console.log('🏷️ LiveWeatherDetectionService: Getting label for weather:', {
      isLive,
      source: weather.source,
      isActualForecast: weather.isActualForecast,
      cityName: weather.cityName
    });

    if (isLive) {
      return '🟢 Live Weather Forecast';
    } else {
      return '🟡 Historical Weather Data';
    }
  }

  /**
   * Get the appropriate weather source color
   */
  static getWeatherSourceColor(weather: ForecastWeatherData): string {
    const isLive = this.isLiveWeatherForecast(weather);
    return isLive ? 'text-green-600' : 'text-amber-600';
  }

  /**
   * Get the appropriate weather badge text
   */
  static getWeatherBadgeText(weather: ForecastWeatherData): string {
    const isLive = this.isLiveWeatherForecast(weather);
    
    if (isLive) {
      return '✨ Current live forecast';
    } else {
      return '📊 Based on historical patterns';
    }
  }

  /**
   * Get the appropriate weather badge style
   */
  static getWeatherBadgeStyle(weather: ForecastWeatherData): string {
    const isLive = this.isLiveWeatherForecast(weather);
    
    if (isLive) {
      return 'bg-green-100 text-green-700';
    } else {
      return 'bg-amber-100 text-amber-700';
    }
  }
}
