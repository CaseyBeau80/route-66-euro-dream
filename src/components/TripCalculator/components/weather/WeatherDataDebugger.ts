
export class WeatherDataDebugger {
  static debugWeatherFlow(message: string, data?: any): void {
    console.log(`🌤️ ${message}`, data || '');
  }

  static debugDateCalculation(message: string, tripStartDate: any, dayNumber: number, result: any): void {
    console.log(`📅 ${message}`, {
      tripStartDate: typeof tripStartDate === 'string' ? tripStartDate : tripStartDate?.toISOString(),
      dayNumber,
      result: result?.toISOString(),
      resultType: typeof result
    });
  }

  static debugApiResponse(cityName: string, dateString: string, weatherData: any): void {
    console.log(`🔮 API Response for ${cityName} on ${dateString}:`, {
      hasData: !!weatherData,
      isActualForecast: weatherData?.isActualForecast,
      temperature: weatherData?.temperature,
      description: weatherData?.description,
      dateMatchInfo: weatherData?.dateMatchInfo
    });
  }

  static debugWeatherMatching(cityName: string, targetDate: string, forecasts: any[], matchResult: any): void {
    console.log(`🎯 Weather matching for ${cityName} on ${targetDate}:`, {
      availableForecasts: forecasts.length,
      matchFound: !!matchResult.matchedForecast,
      matchType: matchResult.matchInfo?.matchType,
      confidence: matchResult.matchInfo?.confidence
    });
  }

  static debugComponentState(componentName: string, cityName: string, state: any): void {
    console.log(`📊 ${componentName} state for ${cityName}:`, state);
  }
}
