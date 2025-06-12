
export class WeatherDebugService {
  private static readonly DEBUG_PREFIX = '🚨 DEBUG:';

  static logComponentRender(componentName: string, city: string, props: any) {
    console.log(`${this.DEBUG_PREFIX} ${componentName} RENDER`, {
      city,
      ...props
    });
  }

  static logWeatherStateChange(city: string, action: string, data: any) {
    console.log(`${this.DEBUG_PREFIX} ${city} ${action}`, data);
  }

  static logDateCalculation(city: string, tripStartDate: any, day: number, result: Date | null) {
    console.log(`${this.DEBUG_PREFIX} Date calculation for ${city}`, {
      tripStartDate: typeof tripStartDate === 'string' ? tripStartDate : tripStartDate?.toISOString(),
      day,
      result: result?.toISOString(),
      daysFromNow: result ? Math.ceil((result.getTime() - Date.now()) / (24 * 60 * 60 * 1000)) : null
    });
  }

  static logWeatherFlow(stage: string, data: any) {
    console.log(`${this.DEBUG_PREFIX} ${stage}`, data);
  }

  static logApiCall(city: string, endpoint: string, params: any) {
    console.log(`${this.DEBUG_PREFIX} API CALL ${city}`, {
      endpoint,
      params
    });
  }

  static logDataNormalization(city: string, input: any, output: any) {
    console.log(`${this.DEBUG_PREFIX} Data normalization ${city}`, {
      input,
      output,
      isValid: !!output
    });
  }

  // 🎯 NEW: Add the specific debug markers you requested
  static logForecastApiRawResponse(city: string, response: any) {
    console.log(`🛰️ [Forecast API Raw Response] ${city}`, {
      hasResponse: !!response,
      temperature: response?.temperature,
      highTemp: response?.highTemp,
      lowTemp: response?.lowTemp,
      isActualForecast: response?.isActualForecast,
      description: response?.description,
      fullResponse: response
    });
  }

  static logNormalizedForecastOutput(city: string, normalized: any) {
    console.log(`🔁 [Normalized Forecast Output] ${city}`, {
      hasNormalized: !!normalized,
      isValid: normalized?.isValid,
      temperature: normalized?.temperature,
      highTemp: normalized?.highTemp,
      lowTemp: normalized?.lowTemp,
      source: normalized?.source,
      fullNormalized: normalized
    });
  }

  static logWeatherStateSet(city: string, weatherData: any) {
    console.log(`📦 [Weather State SET] ${city}`, {
      hasWeatherData: !!weatherData,
      temperature: weatherData?.temperature,
      highTemp: weatherData?.highTemp,
      lowTemp: weatherData?.lowTemp,
      isActualForecast: weatherData?.isActualForecast,
      fullWeatherData: weatherData
    });
  }

  static logSegmentRenderAttempt(city: string, day: number, renderData: any) {
    console.log(`🧩 [Segment Render Attempt] Day ${day} - ${city}`, {
      hasWeather: !!renderData.weather,
      loading: renderData.loading,
      error: renderData.error,
      segmentDate: renderData.segmentDate?.toISOString(),
      weatherTemperature: renderData.weather?.temperature,
      renderData
    });
  }

  static logPdfWeatherExport(city: string, day: number, exportData: any) {
    console.log(`📄 [PDF Weather Export] Day ${day} - ${city}`, {
      hasWeather: !!(exportData.weather || exportData.weatherData),
      weatherValid: exportData.weather ? !!(exportData.weather.highTemp || exportData.weather.lowTemp || exportData.weather.temperature) : false,
      temperature: exportData.weather?.temperature || exportData.weatherData?.temperature,
      exportData
    });
  }
}
