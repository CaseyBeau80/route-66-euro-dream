
import { ForecastWeatherData } from './WeatherForecastService';
import { SeasonalWeatherGenerator } from '../../../TripCalculator/components/weather/SeasonalWeatherGenerator';
import { CityWeatherVariationService } from '../../../TripCalculator/components/weather/services/CityWeatherVariationService';

export class WeatherFallbackService {
  static createFallbackForecast(
    cityName: string,
    targetDate: Date,
    targetDateString: string,
    daysFromToday: number
  ): ForecastWeatherData {
    console.log('🚨 FIXED: WeatherFallbackService.createFallbackForecast with unique city data', {
      cityName,
      targetDateString,
      targetDateLocal: targetDate.toLocaleDateString(),
      targetMonth: targetDate.getMonth(),
      daysFromToday,
      reason: 'outside_forecast_range_or_api_unavailable',
      uniqueCityVariation: true
    });

    // Validate input parameters
    if (!cityName || !targetDate || isNaN(targetDate.getTime())) {
      console.warn('🚨 FIXED: Invalid parameters for fallback weather, using defaults');
      
      return {
        temperature: 70,
        highTemp: 75,
        lowTemp: 65,
        description: 'Partly Cloudy',
        icon: '02d',
        humidity: 60,
        windSpeed: 8,
        precipitationChance: 20,
        cityName: cityName || 'Unknown Location',
        forecast: [],
        forecastDate: targetDate || new Date(),
        isActualForecast: false,
        source: 'historical_fallback' as const,
        dateMatchInfo: {
          requestedDate: targetDateString || 'unknown',
          matchedDate: 'fallback-default',
          matchType: 'fallback' as const,
          daysOffset: daysFromToday || 0,
          hoursOffset: 0,
          source: 'historical_fallback' as const,
          confidence: 'low' as const
        }
      };
    }

    const month = targetDate.getMonth();
    const seasonalTemp = SeasonalWeatherGenerator.getSeasonalTemperature(month);
    const tempVariation = 15;
    
    // Base seasonal weather
    const baseWeather = {
      temperature: seasonalTemp,
      highTemp: seasonalTemp + tempVariation/2,
      lowTemp: seasonalTemp - tempVariation/2,
      description: SeasonalWeatherGenerator.getSeasonalDescription(month),
      icon: SeasonalWeatherGenerator.getSeasonalIcon(month),
      humidity: SeasonalWeatherGenerator.getSeasonalHumidity(month),
      windSpeed: 8,
      precipitationChance: SeasonalWeatherGenerator.getSeasonalPrecipitation(month)
    };

    // FIXED: Apply city-specific variations to ensure uniqueness
    const uniqueWeather = CityWeatherVariationService.applyVariationToWeather(baseWeather, cityName);
    
    const fallbackResult = {
      ...uniqueWeather,
      cityName: cityName,
      forecast: [],
      forecastDate: targetDate,
      isActualForecast: false, // CRITICAL: Must be false for fallback
      source: 'historical_fallback' as const,
      dateMatchInfo: {
        requestedDate: targetDateString,
        matchedDate: 'seasonal-estimate-with-city-variation',
        matchType: 'seasonal-estimate' as const,
        daysOffset: daysFromToday,
        hoursOffset: 0,
        source: 'historical_fallback' as const,
        confidence: 'low' as const
      }
    };

    console.log('🚨 FIXED: WeatherFallbackService UNIQUE FALLBACK RESULT', {
      cityName,
      targetDateString,
      uniqueVariations: {
        temperature: fallbackResult.temperature,
        description: fallbackResult.description,
        icon: fallbackResult.icon,
        humidity: fallbackResult.humidity,
        isUnique: true
      },
      fallbackResult: {
        isActualForecast: fallbackResult.isActualForecast, // Should be false
        explicitSource: fallbackResult.source, // Should be 'historical_fallback'
        citySpecific: true
      }
    });

    return fallbackResult;
  }
}
