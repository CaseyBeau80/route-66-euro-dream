
import { ForecastWeatherData } from './WeatherForecastService';
import { SeasonalWeatherGenerator } from '../../../TripCalculator/components/weather/SeasonalWeatherGenerator';

export class WeatherFallbackService {
  static createFallbackForecast(
    cityName: string,
    targetDate: Date,
    targetDateString: string,
    daysFromToday: number
  ): ForecastWeatherData {
    console.log('🚨 PLAN: WeatherFallbackService.createFallbackForecast - STRICT historical marking with LOCAL dates', {
      cityName,
      targetDateString,
      targetDateLocal: targetDate.toLocaleDateString(),
      targetMonth: targetDate.getMonth(),
      daysFromToday,
      reason: 'outside_expanded_forecast_range_or_api_unavailable',
      expandedRange: true,
      localDateCalculation: true
    });

    const month = targetDate.getMonth();
    const seasonalTemp = SeasonalWeatherGenerator.getSeasonalTemperature(month);
    const tempVariation = 15;
    
    const fallbackResult = {
      temperature: seasonalTemp,
      highTemp: seasonalTemp + tempVariation/2,
      lowTemp: seasonalTemp - tempVariation/2,
      description: SeasonalWeatherGenerator.getSeasonalDescription(month),
      icon: SeasonalWeatherGenerator.getSeasonalIcon(month),
      humidity: SeasonalWeatherGenerator.getSeasonalHumidity(month),
      windSpeed: 8,
      precipitationChance: SeasonalWeatherGenerator.getSeasonalPrecipitation(month),
      cityName: cityName,
      forecast: [],
      forecastDate: targetDate,
      isActualForecast: false, // CRITICAL: Must be false for fallback
      source: 'historical_fallback' as const,
      dateMatchInfo: {
        requestedDate: targetDateString,
        matchedDate: 'seasonal-estimate',
        matchType: 'seasonal-estimate' as const,
        daysOffset: daysFromToday,
        hoursOffset: 0,
        source: 'historical_fallback' as const, // CRITICAL: Must match main source
        confidence: 'low' as const
      }
    };

    console.log('🚨 PLAN: WeatherFallbackService STRICT FALLBACK RESULT WITH LOCAL DATES', {
      cityName,
      targetDateString,
      targetDateLocal: targetDate.toLocaleDateString(),
      daysFromToday,
      fallbackResult: {
        isActualForecast: fallbackResult.isActualForecast, // Should be false
        explicitSource: fallbackResult.source, // Should be 'historical_fallback'
        dateMatchSource: fallbackResult.dateMatchInfo.source, // Should be 'historical_fallback'
        temperature: fallbackResult.temperature,
        strictValidation: {
          allSourcesHistorical: fallbackResult.source === 'historical_fallback' && 
                               fallbackResult.dateMatchInfo.source === 'historical_fallback',
          isActualForecastFalse: fallbackResult.isActualForecast === false
        }
      },
      expandedRange: true,
      localDateCalculation: true
    });

    return fallbackResult;
  }
}
