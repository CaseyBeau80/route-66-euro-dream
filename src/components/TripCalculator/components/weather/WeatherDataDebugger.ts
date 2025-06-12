
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

  // NEW: Critical validation debugging
  static debugValidationFailure(cityName: string, weatherData: any, validationResult: any): void {
    console.log(`❌ VALIDATION FAILURE for ${cityName}:`, {
      weatherData: {
        isActualForecast: weatherData?.isActualForecast,
        temperature: weatherData?.temperature,
        highTemp: weatherData?.highTemp,
        lowTemp: weatherData?.lowTemp,
        description: weatherData?.description,
        dateMatchInfo: weatherData?.dateMatchInfo
      },
      validationResult,
      criticalIssues: {
        noActualForecast: !weatherData?.isActualForecast,
        noTemperatures: !weatherData?.temperature && !weatherData?.highTemp && !weatherData?.lowTemp,
        noDescription: !weatherData?.description,
        noDateMatch: !weatherData?.dateMatchInfo
      }
    });
  }

  // NEW: Render decision debugging
  static debugRenderDecision(cityName: string, decision: string, reasons: any): void {
    console.log(`🎨 RENDER DECISION for ${cityName}: ${decision}`, reasons);
  }

  // NEW: Force weather data through validation
  static debugForceValidation(cityName: string, weatherData: any): void {
    console.log(`🔧 FORCE VALIDATION TEST for ${cityName}:`, {
      hasWeatherData: !!weatherData,
      temperature: weatherData?.temperature || 'MISSING',
      highTemp: weatherData?.highTemp || 'MISSING',
      lowTemp: weatherData?.lowTemp || 'MISSING',
      description: weatherData?.description || 'MISSING',
      isActualForecast: weatherData?.isActualForecast || 'MISSING',
      dateMatchInfo: weatherData?.dateMatchInfo || 'MISSING',
      wouldPassMinimalValidation: !!(weatherData?.temperature || weatherData?.highTemp) && !!weatherData?.description
    });
  }
}
