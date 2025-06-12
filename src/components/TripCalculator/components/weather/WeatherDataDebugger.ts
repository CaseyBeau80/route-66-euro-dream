
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
    console.log(`🔮 ENHANCED API Response for ${cityName} on ${dateString}:`, {
      hasData: !!weatherData,
      isActualForecast: weatherData?.isActualForecast,
      temperature: weatherData?.temperature,
      highTemp: weatherData?.highTemp,
      lowTemp: weatherData?.lowTemp,
      description: weatherData?.description,
      dateMatchInfo: weatherData?.dateMatchInfo,
      dateMatchSource: weatherData?.dateMatchInfo?.source
    });

    // Log the specific fields the user requested
    if (weatherData) {
      console.log(`📊 USER REQUESTED FIELDS for ${cityName}:`, {
        'weather.isActualForecast': weatherData.isActualForecast,
        'weather.highTemp': weatherData.highTemp,
        'weather.lowTemp': weatherData.lowTemp,
        'weather.temperature': weatherData.temperature,
        'weather.description': weatherData.description,
        'weather.dateMatchInfo.source': weatherData.dateMatchInfo?.source
      });
    }
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

  static debugValidationFailure(cityName: string, weatherData: any, validationResult: any): void {
    console.log(`❌ ENHANCED VALIDATION ANALYSIS for ${cityName}:`, {
      weatherData: {
        isActualForecast: weatherData?.isActualForecast,
        temperature: weatherData?.temperature,
        highTemp: weatherData?.highTemp,
        lowTemp: weatherData?.lowTemp,
        description: weatherData?.description,
        dateMatchInfo: weatherData?.dateMatchInfo,
        dateMatchSource: weatherData?.dateMatchInfo?.source
      },
      validationResult,
      criticalIssues: {
        noActualForecast: !weatherData?.isActualForecast,
        noTemperatures: !weatherData?.temperature && !weatherData?.highTemp && !weatherData?.lowTemp,
        noDescription: !weatherData?.description,
        noDateMatch: !weatherData?.dateMatchInfo
      }
    });

    // Always log the specific fields the user wants to see
    console.log(`📊 VALIDATION FAILURE - USER REQUESTED FIELDS for ${cityName}:`, {
      'weather.isActualForecast': weatherData?.isActualForecast,
      'weather.highTemp': weatherData?.highTemp,
      'weather.lowTemp': weatherData?.lowTemp,
      'weather.temperature': weatherData?.temperature,
      'weather.description': weatherData?.description,
      'weather.dateMatchInfo.source': weatherData?.dateMatchInfo?.source
    });
  }

  static debugRenderDecision(cityName: string, decision: string, reasons: any): void {
    console.log(`🎨 ENHANCED RENDER DECISION for ${cityName}: ${decision}`, reasons);
  }

  static debugForceValidation(cityName: string, weatherData: any): void {
    console.log(`🔧 ENHANCED FORCE VALIDATION TEST for ${cityName}:`, {
      hasWeatherData: !!weatherData,
      // User requested fields
      'weather.isActualForecast': weatherData?.isActualForecast || 'MISSING',
      'weather.highTemp': weatherData?.highTemp || 'MISSING',
      'weather.lowTemp': weatherData?.lowTemp || 'MISSING',
      'weather.temperature': weatherData?.temperature || 'MISSING',
      'weather.description': weatherData?.description || 'MISSING',
      'weather.dateMatchInfo.source': weatherData?.dateMatchInfo?.source || 'MISSING',
      // Validation checks
      wouldPassMinimalValidation: !!(weatherData?.temperature || weatherData?.highTemp || weatherData?.description),
      hasAnyTemperature: !!(weatherData?.temperature || weatherData?.highTemp || weatherData?.lowTemp),
      hasDescription: !!weatherData?.description,
      forceRenderRecommendation: !!(weatherData?.temperature || weatherData?.highTemp || weatherData?.lowTemp || weatherData?.description)
    });
  }

  // NEW: Enhanced weather data logging specifically for user's requested fields
  static debugWeatherFieldsForUser(cityName: string, weatherData: any, context: string = ''): void {
    console.log(`🎯 USER FIELD DEBUG ${context} for ${cityName}:`, {
      'weather.isActualForecast': weatherData?.isActualForecast,
      'weather.highTemp': weatherData?.highTemp,
      'weather.lowTemp': weatherData?.lowTemp,
      'weather.temperature': weatherData?.temperature,
      'weather.description': weatherData?.description,
      'weather.dateMatchInfo.source': weatherData?.dateMatchInfo?.source,
      hasDisplayableData: !!(weatherData?.temperature || weatherData?.highTemp || weatherData?.lowTemp || weatherData?.description)
    });
  }
}
