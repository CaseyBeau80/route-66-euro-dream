
import { ForecastWeatherData } from './WeatherForecastService';
import { SeasonalWeatherGenerator } from '../../../TripCalculator/components/weather/SeasonalWeatherGenerator';

export class WeatherFallbackService {
  static createFallbackForecast(
    cityName: string,
    targetDate: Date,
    targetDateString: string,
    daysFromToday: number
  ): ForecastWeatherData {
    console.log('🚨 FIXED: WeatherFallbackService.createFallbackForecast - CONSISTENT historical marking', {
      cityName,
      targetDateString,
      targetMonth: targetDate.getMonth(),
      daysFromToday,
      reason: 'outside_forecast_range_or_api_unavailable'
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
      isActualForecast: false,
      source: 'historical_fallback' as const,
      dateMatchInfo: {
        requestedDate: targetDateString,
        matchedDate: 'seasonal-estimate',
        matchType: 'seasonal-estimate' as const,
        daysOffset: daysFromToday,
        hoursOffset: 0,
        source: 'historical_fallback' as const,
        confidence: 'low' as const
      }
    };

    console.log('🚨 FIXED: WeatherFallbackService fallback result with CONSISTENT HISTORICAL SOURCE MARKING', {
      cityName,
      targetDateString,
      fallbackResult: {
        isActualForecast: fallbackResult.isActualForecast,
        explicitSource: fallbackResult.source,
        dateMatchSource: fallbackResult.dateMatchInfo.source,
        temperature: fallbackResult.temperature
      }
    });

    return fallbackResult;
  }
}
