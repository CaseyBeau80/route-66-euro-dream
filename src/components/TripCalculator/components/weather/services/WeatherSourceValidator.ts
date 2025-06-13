
export class WeatherSourceValidator {
  static shouldAttemptLiveForecast(daysFromNow: number, hasApiKey: boolean): boolean {
    return hasApiKey && daysFromNow >= 0 && daysFromNow <= 5;
  }

  static isValidLiveForecast(
    forecastData: any,
    daysFromNow: number
  ): boolean {
    if (!forecastData) return false;

    const isValidLiveForecast = forecastData.isActualForecast === true && 
      (forecastData.dateMatchInfo?.source === 'api-forecast' || 
       forecastData.dateMatchInfo?.source === 'enhanced-fallback');

    console.log(`🚨 Enhanced live forecast validation:`, {
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
