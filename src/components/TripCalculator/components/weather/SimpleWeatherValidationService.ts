
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

export interface SimpleWeatherValidationResult {
  isValid: boolean;
  hasDisplayableData: boolean;
  isLiveForecast: boolean;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  message: string;
}

export class SimpleWeatherValidationService {
  static validateWeatherData(
    weather: any, 
    cityName: string,
    segmentDate?: Date | null
  ): SimpleWeatherValidationResult {
    console.log(`🔍 SIMPLIFIED: Weather validation for ${cityName}:`, {
      hasWeather: !!weather,
      weatherType: typeof weather,
      segmentDate: segmentDate?.toISOString()
    });

    if (!weather) {
      return {
        isValid: false,
        hasDisplayableData: false,
        isLiveForecast: false,
        quality: 'poor',
        message: 'No weather data available'
      };
    }

    // Check for any displayable temperature data
    const hasTemperature = !!(weather.temperature || weather.highTemp || weather.lowTemp);
    const hasDescription = !!weather.description;
    const hasDisplayableData = hasTemperature || hasDescription;

    if (!hasDisplayableData) {
      return {
        isValid: false,
        hasDisplayableData: false,
        isLiveForecast: false,
        quality: 'poor',
        message: 'No displayable weather data'
      };
    }

    // Determine if this is a live forecast using multiple indicators
    const isLiveForecast = (
      weather.isActualForecast === true ||
      weather.source === 'live_forecast' ||
      weather.dateMatchInfo?.source === 'live_forecast' ||
      weather.dateMatchInfo?.source === 'api-forecast'
    );

    // Determine quality based on data completeness and freshness
    let quality: 'excellent' | 'good' | 'fair' | 'poor' = 'fair';
    
    if (isLiveForecast && hasTemperature && hasDescription) {
      quality = 'excellent';
    } else if (isLiveForecast && hasTemperature) {
      quality = 'good';
    } else if (hasTemperature) {
      quality = 'fair';
    }

    const message = this.getQualityMessage(quality, isLiveForecast);

    const result = {
      isValid: true,
      hasDisplayableData: true,
      isLiveForecast,
      quality,
      message
    };

    console.log(`✅ SIMPLIFIED: Validation result for ${cityName}:`, result);
    return result;
  }

  private static getQualityMessage(quality: string, isLiveForecast: boolean): string {
    if (quality === 'excellent') {
      return isLiveForecast ? 'Live forecast with complete data' : 'Complete historical weather data';
    } else if (quality === 'good') {
      return isLiveForecast ? 'Live forecast available' : 'Good historical weather data';
    } else if (quality === 'fair') {
      return isLiveForecast ? 'Live forecast with limited data' : 'Historical weather estimate';
    } else {
      return 'Limited weather information available';
    }
  }
}
