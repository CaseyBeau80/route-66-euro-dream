
/**
 * FIXED: Ultra-strict centralized weather detection service
 */
export class WeatherLabelService {
  /**
   * CRITICAL: The ONLY method that determines if weather is live - ULTRA STRICT
   */
  static isLiveWeatherData(weather: any): boolean {
    if (!weather) {
      console.log('🎯 FIXED: No weather data provided to isLiveWeatherData');
      return false;
    }
    
    console.log('🎯 FIXED: ULTRA-STRICT weather detection for', weather.cityName, {
      source: weather.source,
      isActualForecast: weather.isActualForecast,
      sourceType: typeof weather.source,
      isActualType: typeof weather.isActualForecast,
      sourceValue: JSON.stringify(weather.source),
      isActualValue: JSON.stringify(weather.isActualForecast)
    });
    
    // ULTRA-STRICT: Both properties must be EXACTLY these values
    const isSourceCorrect = weather.source === 'live_forecast';
    const isActualCorrect = weather.isActualForecast === true;
    const isLive = isSourceCorrect && isActualCorrect;
    
    console.log('🎯 FIXED: ULTRA-STRICT detection result for', weather.cityName, {
      isSourceCorrect,
      isActualCorrect,
      FINAL_RESULT: isLive,
      sourceCheck: `'${weather.source}' === 'live_forecast' = ${isSourceCorrect}`,
      actualCheck: `${weather.isActualForecast} === true = ${isActualCorrect}`,
      GUARANTEED_LIVE_IF_TRUE: isLive
    });
    
    return isLive;
  }

  /**
   * CRITICAL: The ONLY method that generates weather source labels
   */
  static getWeatherSourceLabel(weather: any): string {
    const isLive = this.isLiveWeatherData(weather);
    const label = isLive ? 'Live Weather Forecast' : 'Historical Weather Data';
    
    console.log('🎯 FIXED: Label generation for', weather?.cityName, {
      isLive,
      label,
      FINAL_LABEL: label
    });
    
    return label;
  }

  /**
   * CRITICAL: Get styling configuration based on ULTRA-STRICT live detection
   */
  static getWeatherStyling(weather: any): {
    sourceLabel: string;
    sourceColor: string;
    badgeText: string;
    badgeStyle: string;
    containerStyle: string;
    isLive: boolean;
  } {
    const isLive = this.isLiveWeatherData(weather);
    
    const config = isLive ? {
      sourceLabel: '🟢 Live Weather Forecast',
      sourceColor: 'text-green-600',
      badgeText: '✨ Current live forecast',
      badgeStyle: 'bg-green-100 text-green-700 border-green-200',
      containerStyle: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200',
      isLive: true
    } : {
      sourceLabel: '🟡 Historical Weather Data',
      sourceColor: 'text-amber-600',
      badgeText: '📊 Based on historical patterns',
      badgeStyle: 'bg-amber-100 text-amber-700 border-amber-200',
      containerStyle: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200',
      isLive: false
    };

    console.log('🎯 FIXED: Styling config for', weather?.cityName, {
      isLive,
      sourceLabel: config.sourceLabel,
      FINAL_STYLING: isLive ? 'GREEN_LIVE' : 'AMBER_HISTORICAL'
    });

    return config;
  }
}
