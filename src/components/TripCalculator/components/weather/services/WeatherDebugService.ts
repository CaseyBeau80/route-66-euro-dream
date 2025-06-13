
export class WeatherDebugService {
  static logComponentRender(componentName: string, cityName: string, data: any) {
    console.log(`🎨 PLAN: ${componentName} [${cityName}] render:`, {
      ...data,
      timestamp: new Date().toISOString(),
      standardizedLogging: true
    });
  }

  static logWeatherFlow(operation: string, data: any) {
    console.log(`🌊 PLAN: WeatherFlow: ${operation}`, {
      ...data,
      timestamp: new Date().toISOString(),
      planImplementation: true
    });
  }

  static logDateCalculation(cityName: string, tripStartDate: any, segmentDay: number, calculatedDate: Date | null) {
    console.log(`📅 PLAN: DateCalculation [${cityName}] - LOCAL NORMALIZATION:`, {
      tripStartDate: tripStartDate ? (tripStartDate instanceof Date ? tripStartDate.toISOString() : tripStartDate.toString()) : 'NULL',
      segmentDay,
      calculatedDate: calculatedDate?.toISOString(),
      calculatedDateLocal: calculatedDate?.toLocaleDateString(),
      timestamp: new Date().toISOString(),
      normalizationMethod: 'LOCAL_MIDNIGHT',
      planImplementation: true
    });
  }

  static logSegmentRenderAttempt(cityName: string, segmentDay: number, data: any) {
    console.log(`🎯 PLAN: SegmentRender [${cityName}] Day ${segmentDay}:`, {
      ...data,
      timestamp: new Date().toISOString(),
      planImplementation: true
    });
  }

  static logWeatherStateSet(cityName: string, weather: any) {
    console.log(`📊 PLAN: WeatherState [${cityName}] set:`, {
      temperature: weather?.temperature,
      highTemp: weather?.highTemp,
      lowTemp: weather?.lowTemp,
      isActualForecast: weather?.isActualForecast,
      source: weather?.source,
      hasMain: !!weather?.main,
      hasTemp: !!weather?.temp,
      hasMatchedForecastDay: !!weather?.matchedForecastDay,
      timestamp: new Date().toISOString(),
      planImplementation: true
    });
  }

  static logForecastApiRawResponse(cityName: string, weather: any) {
    console.log(`🔧 PLAN: API_RAW_RESPONSE [${cityName}]:`, {
      fullWeatherObject: weather,
      temperature: weather?.temperature,
      highTemp: weather?.highTemp,
      lowTemp: weather?.lowTemp,
      main: weather?.main,
      temp: weather?.temp,
      matchedForecastDay: weather?.matchedForecastDay,
      isActualForecast: weather?.isActualForecast,
      source: weather?.source,
      allKeys: weather ? Object.keys(weather) : [],
      timestamp: new Date().toISOString(),
      planImplementation: true
    });
  }

  static logNormalizedForecastOutput(cityName: string, normalized: any) {
    console.log(`🔄 PLAN: NORMALIZED_OUTPUT [${cityName}]:`, {
      ...normalized,
      timestamp: new Date().toISOString(),
      planImplementation: true
    });
  }

  static logPdfWeatherExport(cityName: string, day: number, segment: any) {
    console.log(`📄 PLAN: PDF_EXPORT [${cityName}] Day ${day}:`, {
      hasWeather: !!(segment.weather || segment.weatherData),
      weatherData: segment.weather || segment.weatherData,
      timestamp: new Date().toISOString(),
      planImplementation: true
    });
  }

  static logLiveForecastAttempt(cityName: string, daysFromToday: number, timeoutMs: number) {
    console.log(`🚀 PLAN: LIVE_FORECAST_ATTEMPT [${cityName}]:`, {
      daysFromToday,
      timeoutMs,
      isWithinRange: daysFromToday >= 0 && daysFromToday <= 7,
      standardizedRange: true,
      timestamp: new Date().toISOString(),
      planImplementation: true
    });
  }

  static logForecastTimeout(cityName: string, timeoutMs: number, reason: string) {
    console.log(`⏰ PLAN: FORECAST_TIMEOUT [${cityName}]:`, {
      timeoutMs,
      reason,
      fallbackToHistorical: true,
      timestamp: new Date().toISOString(),
      planImplementation: true
    });
  }

  static logHistoricalFallback(cityName: string, reason: string, daysFromToday: number) {
    console.log(`🏛️ PLAN: HISTORICAL_FALLBACK [${cityName}]:`, {
      reason,
      daysFromToday,
      isExpectedFallback: daysFromToday > 7,
      timestamp: new Date().toISOString(),
      planImplementation: true
    });
  }
}
