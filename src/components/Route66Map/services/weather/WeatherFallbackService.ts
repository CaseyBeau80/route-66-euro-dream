
import { ForecastWeatherData } from './WeatherForecastService';
import { SeasonalWeatherGenerator } from '../../../TripCalculator/components/weather/SeasonalWeatherGenerator';

export class WeatherFallbackService {
  static createFallbackForecast(
    cityName: string,
    targetDate: Date,
    targetDateString: string,
    daysFromToday: number
  ): ForecastWeatherData {
    console.log('🚨 PLAN: WeatherFallbackService.createFallbackForecast - ENHANCED with location error handling', {
      cityName,
      targetDateString,
      targetDateLocal: targetDate.toLocaleDateString(),
      targetMonth: targetDate.getMonth(),
      daysFromToday,
      reason: 'outside_expanded_forecast_range_or_api_unavailable_or_location_error',
      expandedRange: true,
      localDateCalculation: true,
      enhancedFallback: true
    });

    // Validate input parameters
    if (!cityName || !targetDate || isNaN(targetDate.getTime())) {
      console.warn('🚨 PLAN: Invalid parameters for fallback weather, using defaults');
      
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
          source: 'fallback_historical_due_to_location_error' as const,
          confidence: 'low' as const
        }
      };
    }

    const month = targetDate.getMonth();
    const seasonalTemp = SeasonalWeatherGenerator.getSeasonalTemperature(month);
    const tempVariation = 15;
    
    // Determine the fallback reason for better tracking
    const fallbackReason = daysFromToday > 7 ? 'beyond_forecast_range' : 'location_or_api_error';
    
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
        source: fallbackReason === 'location_or_api_error' 
          ? 'fallback_historical_due_to_location_error' as const
          : 'historical_fallback' as const,
        confidence: 'low' as const
      }
    };

    console.log('🚨 PLAN: WeatherFallbackService ENHANCED FALLBACK RESULT', {
      cityName,
      targetDateString,
      targetDateLocal: targetDate.toLocaleDateString(),
      daysFromToday,
      fallbackReason,
      fallbackResult: {
        isActualForecast: fallbackResult.isActualForecast, // Should be false
        explicitSource: fallbackResult.source, // Should be 'historical_fallback'
        dateMatchSource: fallbackResult.dateMatchInfo.source, // Should indicate reason
        temperature: fallbackResult.temperature,
        strictValidation: {
          allSourcesHistorical: fallbackResult.source === 'historical_fallback',
          isActualForecastFalse: fallbackResult.isActualForecast === false,
          hasLocationErrorIndicator: fallbackResult.dateMatchInfo.source.includes('location_error')
        }
      },
      expandedRange: true,
      localDateCalculation: true,
      enhancedFallback: true
    });

    return fallbackResult;
  }
}
