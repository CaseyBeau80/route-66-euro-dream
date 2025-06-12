
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherDebugService } from './WeatherDebugService';
import { TemperatureExtractor } from './TemperatureExtractor';

export interface NormalizedWeatherData {
  temperature: number;
  highTemp: number;
  lowTemp: number;
  description: string;
  humidity: number;
  windSpeed: number;
  precipitationChance: number;
  isActualForecast: boolean;
  cityName: string;
  icon: string;
  dateMatchInfo?: any;
  isValid: boolean;
  source: 'api-forecast' | 'seasonal-estimate' | 'fallback';
}

export class WeatherDataNormalizer {
  static normalizeWeatherData(
    weather: ForecastWeatherData | null,
    cityName: string,
    segmentDate?: Date | null
  ): NormalizedWeatherData | null {
    WeatherDebugService.logWeatherFlow(`WeatherDataNormalizer.normalize [${cityName}]`, {
      hasWeather: !!weather,
      segmentDate: segmentDate?.toISOString(),
      weatherInput: weather ? {
        temperature: weather.temperature,
        highTemp: weather.highTemp,
        lowTemp: weather.lowTemp,
        isActualForecast: weather.isActualForecast,
        description: weather.description
      } : null
    });

    if (!weather) {
      WeatherDebugService.logWeatherFlow(`WeatherDataNormalizer.noData [${cityName}]`, {
        reason: 'no_weather_data'
      });
      return null;
    }

    // Extract temperatures using the dedicated service
    const extractedTemps = TemperatureExtractor.extractTemperatures(weather, cityName);
    
    // Validate that we have displayable data
    const hasDisplayableData = TemperatureExtractor.hasDisplayableTemperatureData(extractedTemps);
    
    if (!hasDisplayableData) {
      WeatherDebugService.logWeatherFlow(`WeatherDataNormalizer.invalidData [${cityName}]`, {
        extractedTemps,
        reason: 'no_displayable_temperature_data'
      });
      return null;
    }

    const normalized: NormalizedWeatherData = {
      temperature: extractedTemps.current,
      highTemp: extractedTemps.high,
      lowTemp: extractedTemps.low,
      description: weather.description || 'Clear conditions',
      humidity: weather.humidity || 50,
      windSpeed: Math.round(weather.windSpeed || 5),
      precipitationChance: weather.precipitationChance || 10,
      isActualForecast: !!weather.isActualForecast,
      cityName: weather.cityName || cityName,
      icon: weather.icon || '01d',
      dateMatchInfo: weather.dateMatchInfo,
      isValid: true,
      source: weather.isActualForecast ? 'api-forecast' : 'seasonal-estimate'
    };

    WeatherDebugService.logDataNormalization(cityName, weather, normalized);

    return normalized;
  }

  static validateForExport(normalized: NormalizedWeatherData | null): boolean {
    const isValid = normalized !== null && 
           normalized.isValid && 
           normalized.temperature > 0 && 
           normalized.highTemp > 0 && 
           normalized.lowTemp > 0;

    WeatherDebugService.logWeatherFlow('WeatherDataNormalizer.validateExport', {
      hasNormalized: !!normalized,
      isValid,
      normalized: normalized ? {
        isValid: normalized.isValid,
        temperature: normalized.temperature,
        highTemp: normalized.highTemp,
        lowTemp: normalized.lowTemp
      } : null
    });

    return isValid;
  }
}
