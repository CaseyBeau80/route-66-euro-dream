
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { TemperatureExtractor } from './TemperatureExtractor';
import { WeatherDebugService } from './WeatherDebugService';

export interface NormalizedWeatherData {
  temperature: number;
  highTemp: number;
  lowTemp: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  precipitationChance: number;
  cityName: string;
  source: string;
  isActualForecast: boolean;
  dateMatchInfo?: any;
}

export class WeatherDataNormalizer {
  static normalizeWeatherData(
    weather: ForecastWeatherData,
    cityName: string,
    segmentDate?: Date | null
  ): NormalizedWeatherData | null {
    console.log('🔧 WeatherDataNormalizer.normalizeWeatherData called:', {
      cityName,
      weather: {
        temperature: weather.temperature,
        highTemp: weather.highTemp,
        lowTemp: weather.lowTemp,
        description: weather.description,
        isActualForecast: weather.isActualForecast
      },
      segmentDate: segmentDate?.toISOString()
    });

    WeatherDebugService.logWeatherFlow(`WeatherDataNormalizer.normalize [${cityName}]`, {
      inputWeather: weather,
      segmentDate: segmentDate?.toISOString()
    });

    if (!weather) {
      console.warn('❌ WeatherDataNormalizer: No weather data provided');
      return null;
    }

    // Extract temperatures using the dedicated service
    const temperatures = TemperatureExtractor.extractTemperatures(weather, cityName);
    
    console.log('🌡️ WeatherDataNormalizer: Extracted temperatures:', temperatures);

    // Validate extracted temperatures
    if (!TemperatureExtractor.hasDisplayableTemperatureData(temperatures)) {
      console.warn(`⚠️ WeatherDataNormalizer: Invalid temperature data for ${cityName}`);
      return null;
    }

    // Build normalized data with extracted temperatures
    const normalized: NormalizedWeatherData = {
      temperature: temperatures.current,
      highTemp: temperatures.high,
      lowTemp: temperatures.low,
      description: weather.description || 'Clear',
      icon: weather.icon || '01d',
      humidity: weather.humidity || 50,
      windSpeed: weather.windSpeed || 5,
      precipitationChance: weather.precipitationChance || 0,
      cityName: cityName,
      source: weather.dateMatchInfo?.source || (weather.isActualForecast ? 'API Forecast' : 'Seasonal Average'),
      isActualForecast: weather.isActualForecast || false,
      dateMatchInfo: weather.dateMatchInfo
    };

    console.log('✅ WeatherDataNormalizer: Normalized weather data:', normalized);

    WeatherDebugService.logNormalizedForecastOutput(cityName, normalized);

    return normalized;
  }

  static validateNormalizedData(data: NormalizedWeatherData | null): boolean {
    if (!data) return false;

    const isValid = !isNaN(data.temperature) && 
                   !isNaN(data.highTemp) && 
                   !isNaN(data.lowTemp) &&
                   data.temperature > -100 && data.temperature < 200 &&
                   data.highTemp > -100 && data.highTemp < 200 &&
                   data.lowTemp > -100 && data.lowTemp < 200 &&
                   data.description && data.description.length > 0;

    console.log('🔍 WeatherDataNormalizer: Validation result:', {
      isValid,
      data: data ? {
        temperature: data.temperature,
        highTemp: data.highTemp,
        lowTemp: data.lowTemp,
        description: data.description
      } : null
    });

    return isValid;
  }
}
