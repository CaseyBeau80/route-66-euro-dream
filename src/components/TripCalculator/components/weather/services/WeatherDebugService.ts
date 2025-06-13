
export class WeatherDebugService {
  static logComponentRender(componentName: string, cityName: string, data: any) {
    console.log(`🎨 ${componentName} [${cityName}] render:`, data);
  }

  static logWeatherFlow(operation: string, data: any) {
    console.log(`🌊 WeatherFlow: ${operation}`, data);
  }

  static logDateCalculation(cityName: string, tripStartDate: any, segmentDay: number, calculatedDate: Date | null) {
    console.log(`📅 DateCalculation [${cityName}]:`, {
      tripStartDate: tripStartDate ? (tripStartDate instanceof Date ? tripStartDate.toISOString() : tripStartDate.toString()) : 'NULL',
      segmentDay,
      calculatedDate: calculatedDate?.toISOString()
    });
  }

  static logSegmentRenderAttempt(cityName: string, segmentDay: number, data: any) {
    console.log(`🎯 SegmentRender [${cityName}] Day ${segmentDay}:`, data);
  }

  static logWeatherStateSet(cityName: string, weather: any) {
    console.log(`📊 WeatherState [${cityName}] set:`, {
      temperature: weather?.temperature,
      highTemp: weather?.highTemp,
      lowTemp: weather?.lowTemp,
      isActualForecast: weather?.isActualForecast,
      hasMain: !!weather?.main,
      hasTemp: !!weather?.temp,
      hasMatchedForecastDay: !!weather?.matchedForecastDay
    });
  }

  static logForecastApiRawResponse(cityName: string, weather: any) {
    console.log(`🔧 API_RAW_RESPONSE [${cityName}]:`, {
      fullWeatherObject: weather,
      temperature: weather?.temperature,
      highTemp: weather?.highTemp,
      lowTemp: weather?.lowTemp,
      main: weather?.main,
      temp: weather?.temp,
      matchedForecastDay: weather?.matchedForecastDay,
      isActualForecast: weather?.isActualForecast,
      allKeys: weather ? Object.keys(weather) : []
    });
  }

  static logNormalizedForecastOutput(cityName: string, normalized: any) {
    console.log(`🔄 NORMALIZED_OUTPUT [${cityName}]:`, normalized);
  }

  static logPdfWeatherExport(cityName: string, day: number, segment: any) {
    console.log(`📄 PDF_EXPORT [${cityName}] Day ${day}:`, {
      hasWeather: !!(segment.weather || segment.weatherData),
      weatherData: segment.weather || segment.weatherData
    });
  }
}
