
export class WeatherSourceValidator {
  static shouldAttemptLiveForecast(daysFromNow: number, hasApiKey: boolean): boolean {
    return hasApiKey && daysFromNow >= 0 && daysFromNow <= 5;
  }

  static isValidLiveForecast(
    forecastData: any,
    daysFromNow: number
  ): boolean {
    if (!forecastData) return false;

    // Enhanced validation: Check dateMatchInfo.source first
    if (forecastData.dateMatchInfo?.source === 'live_forecast') {
      console.log(`🚨 Enhanced live forecast validation: Source marked as live_forecast`, {
        source: forecastData.dateMatchInfo.source,
        daysFromNow,
        isActualForecast: forecastData.isActualForecast
      });
      return true;
    }

    // Check for historical/seasonal fallback sources
    if (forecastData.dateMatchInfo?.source === 'historical_fallback' || 
        forecastData.dateMatchInfo?.source === 'seasonal_fallback') {
      console.log(`🚨 Enhanced live forecast validation: Source marked as fallback`, {
        source: forecastData.dateMatchInfo.source,
        daysFromNow,
        isActualForecast: forecastData.isActualForecast
      });
      return false;
    }

    // Legacy validation for backward compatibility
    const isValidLiveForecast = forecastData.isActualForecast === true && 
      (forecastData.dateMatchInfo?.source === 'api-forecast' || 
       forecastData.dateMatchInfo?.source === 'enhanced-fallback');

    console.log(`🚨 Enhanced live forecast validation (legacy):`, {
      isValidLiveForecast,
      strictValidationCriteria: {
        isActualForecast: forecastData.isActualForecast,
        expectedValue: true,
        source: forecastData.dateMatchInfo?.source,
        allowedSources: ['api-forecast', 'enhanced-fallback'],
        daysFromNowCheck: daysFromNow <= 5
      }
    });

    return isValidLiveForecast;
  }

  static validateTemperatureData(highTemp: number, lowTemp: number): boolean {
    return highTemp > 0 && lowTemp > 0 && highTemp >= lowTemp;
  }
}
