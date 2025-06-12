
export class WeatherDataDebugger {
  static debugWeatherFlow(context: string, data: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🌦 WEATHER FLOW [${context}]:`, data);
    }
  }

  static debugDateCalculation(context: string, tripStartDate: any, segmentDay: number, result: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`📅 DATE CALC [${context}]:`, {
        tripStartDate: typeof tripStartDate === 'string' ? tripStartDate : tripStartDate?.toISOString(),
        segmentDay,
        result: result?.toISOString(),
        calculationType: 'DateNormalizationService'
      });
    }
  }

  static debugComponentState(component: string, city: string, state: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 COMPONENT STATE [${component}] [${city}]:`, state);
    }
  }

  static debugApiResponse(city: string, date: string, response: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`📡 API RESPONSE [${city}] [${date}]:`, {
        hasResponse: !!response,
        isActualForecast: response?.isActualForecast,
        temperature: response?.temperature,
        description: response?.description,
        source: response?.dateMatchInfo?.source
      });
    }
  }

  static debugWeatherMatching(city: string, targetDate: string, forecasts: any[], matchResult: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🎯 WEATHER MATCHING [${city}] [${targetDate}]:`, {
        availableForecasts: forecasts.length,
        matchFound: !!matchResult.matchedForecast,
        matchType: matchResult.matchInfo?.matchType,
        confidence: matchResult.matchInfo?.confidence
      });
    }
  }
}
