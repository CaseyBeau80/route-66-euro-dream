export class WeatherDebugService {
  private static debugLog: Array<{
    timestamp: string;
    component: string;
    cityName: string;
    segmentDay?: number;
    action: string;
    data: any;
  }> = [];

  static logComponentRender(component: string, cityName: string, data: any, segmentDay?: number) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      component,
      cityName,
      segmentDay,
      action: 'render',
      data
    };

    this.debugLog.push(logEntry);
    
    console.log(`🐛 PLAN: WeatherDebugService - ${component} render for ${cityName}${segmentDay ? ` Day ${segmentDay}` : ''}:`, {
      ...logEntry,
      isolation: segmentDay ? `city+day-${segmentDay}` : 'city-only'
    });

    // Keep only last 50 entries
    if (this.debugLog.length > 50) {
      this.debugLog = this.debugLog.slice(-50);
    }
  }

  static logWeatherStateChange(cityName: string, segmentDay: number, oldState: any, newState: any) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      component: 'WeatherState',
      cityName,
      segmentDay,
      action: 'state_change',
      data: {
        oldState: {
          hasWeather: !!oldState?.weather,
          loading: oldState?.loading,
          temperature: oldState?.weather?.temperature
        },
        newState: {
          hasWeather: !!newState?.weather,
          loading: newState?.loading,
          temperature: newState?.weather?.temperature
        }
      }
    };

    this.debugLog.push(logEntry);
    
    console.log(`🐛 PLAN: WeatherDebugService - State change for ${cityName} Day ${segmentDay}:`, {
      ...logEntry,
      isolationKey: `${cityName}-day-${segmentDay}`
    });
  }

  static logNormalizedForecastOutput(cityName: string, normalizedData: any) {
    console.log(`🎯 PLAN: [NORMALIZED FORECAST OUTPUT] for ${cityName}:`, {
      temperature: normalizedData.temperature,
      highTemp: normalizedData.highTemp,
      lowTemp: normalizedData.lowTemp,
      description: normalizedData.description,
      icon: normalizedData.icon,
      isValid: normalizedData.isValid,
      source: normalizedData.source,
      isActualForecast: normalizedData.isActualForecast,
      debugMarker: 'NORMALIZED_FORECAST_OUTPUT'
    });
  }

  static logPdfWeatherExport(cityName: string, segmentDay: number, enrichedSegment: any) {
    console.log(`🎯 PLAN: [PDF WEATHER EXPORT] for ${cityName} Day ${segmentDay}:`, {
      hasWeather: !!(enrichedSegment.weather || enrichedSegment.weatherData),
      weatherSource: enrichedSegment.weather?.source || enrichedSegment.weatherData?.source,
      temperature: enrichedSegment.weather?.temperature || enrichedSegment.weatherData?.temperature,
      isActualForecast: enrichedSegment.weather?.isActualForecast || enrichedSegment.weatherData?.isActualForecast,
      debugMarker: 'PDF_WEATHER_EXPORT'
    });
  }

  static getDebugSummary(): {
    totalEntries: number;
    citiesTracked: string[];
    componentCoverage: string[];
    recentActivity: any[];
  } {
    const citiesTracked = [...new Set(this.debugLog.map(entry => entry.cityName))];
    const componentCoverage = [...new Set(this.debugLog.map(entry => entry.component))];
    const recentActivity = this.debugLog.slice(-10);

    return {
      totalEntries: this.debugLog.length,
      citiesTracked,
      componentCoverage,
      recentActivity
    };
  }

  static clearDebugLog() {
    this.debugLog = [];
    console.log('🐛 WeatherDebugService: Debug log cleared');
  }
}
