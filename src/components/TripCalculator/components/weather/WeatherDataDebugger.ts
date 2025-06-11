
export class WeatherDataDebugger {
  /**
   * Comprehensive debugging for weather data flow
   */
  static debugWeatherFlow(context: string, data: any): void {
    console.log(`🐛 WEATHER DEBUG [${context}]:`, {
      timestamp: new Date().toISOString(),
      context,
      data: this.sanitizeDebugData(data)
    });
  }

  /**
   * Debug weather API response
   */
  static debugApiResponse(cityName: string, targetDate: string, response: any): void {
    console.log(`🌐 WEATHER API DEBUG [${cityName}]:`, {
      targetDate,
      hasResponse: !!response,
      isActualForecast: response?.isActualForecast,
      temperature: response?.temperature,
      highTemp: response?.highTemp,
      lowTemp: response?.lowTemp,
      description: response?.description,
      forecastDate: response?.forecastDate?.toISOString(),
      dateMatchInfo: response?.dateMatchInfo,
      forecastCount: response?.forecast?.length || 0
    });
  }

  /**
   * Debug component state changes
   */
  static debugComponentState(componentName: string, city: string, state: any): void {
    console.log(`🔍 COMPONENT STATE [${componentName}] [${city}]:`, {
      hasApiKey: state.hasApiKey,
      loading: state.loading,
      hasWeather: !!state.weather,
      error: state.error,
      retryCount: state.retryCount,
      segmentDate: state.segmentDate?.toISOString(),
      weatherSource: state.weather?.dateMatchInfo?.source
    });
  }

  /**
   * Debug date calculations
   */
  static debugDateCalculation(context: string, tripStartDate: any, dayNumber: number, result: Date | null): void {
    console.log(`📅 DATE CALCULATION DEBUG [${context}]:`, {
      tripStartDate: typeof tripStartDate === 'string' ? tripStartDate : tripStartDate?.toISOString(),
      tripStartDateType: typeof tripStartDate,
      dayNumber,
      calculatedDate: result?.toISOString(),
      calculatedDateString: result ? result.toISOString().split('T')[0] : null,
      daysFromNow: result ? Math.ceil((result.getTime() - Date.now()) / (24 * 60 * 60 * 1000)) : null
    });
  }

  /**
   * Debug weather matching process
   */
  static debugWeatherMatching(cityName: string, targetDate: string, forecasts: any[], matchResult: any): void {
    console.log(`🎯 WEATHER MATCHING DEBUG [${cityName}]:`, {
      targetDate,
      forecastCount: forecasts.length,
      availableDates: forecasts.map(f => f.dateString).filter(Boolean),
      matchFound: !!matchResult.matchedForecast,
      matchType: matchResult.matchInfo?.matchType,
      matchedDate: matchResult.matchInfo?.matchedDate,
      confidence: matchResult.matchInfo?.confidence,
      daysOffset: matchResult.matchInfo?.daysOffset
    });
  }

  private static sanitizeDebugData(data: any): any {
    if (!data) return data;
    
    // Remove circular references and large objects
    try {
      return JSON.parse(JSON.stringify(data, (key, value) => {
        if (typeof value === 'function') return '[Function]';
        if (value instanceof Date) return value.toISOString();
        if (typeof value === 'object' && value !== null) {
          // Limit object depth
          if (Object.keys(value).length > 20) return '[Large Object]';
        }
        return value;
      }));
    } catch (error) {
      return '[Debug Data Error]';
    }
  }
}
