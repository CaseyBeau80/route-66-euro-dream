
/**
 * CENTRALIZED: Single source of truth for weather labels across ALL components
 */
export class WeatherLabelService {
  /**
   * CRITICAL: The ONLY method that determines if weather is live
   */
  static isLiveWeatherData(weather: any): boolean {
    if (!weather) {
      console.log('🎯 CENTRALIZED: No weather data provided');
      return false;
    }
    
    console.log('🎯 CENTRALIZED: WeatherLabelService.isLiveWeatherData checking:', {
      weatherSource: weather.source,
      isActualForecast: weather.isActualForecast,
      cityName: weather.cityName,
      temperature: weather.temperature,
      hasSource: !!weather.source,
      hasIsActualForecast: weather.hasOwnProperty('isActualForecast'),
      sourceType: typeof weather.source,
      isActualForecastType: typeof weather.isActualForecast
    });
    
    // DIRECT CHECK: Both properties must be exactly these values
    const isLive = weather.source === 'live_forecast' && weather.isActualForecast === true;
    
    console.log('🎯 CENTRALIZED: WeatherLabelService detection result:', {
      weatherSource: weather.source,
      isActualForecast: weather.isActualForecast,
      result: isLive,
      cityName: weather.cityName,
      centralizedCheck: true,
      matchesLiveSource: weather.source === 'live_forecast',
      matchesActualForecast: weather.isActualForecast === true,
      bothMatch: weather.source === 'live_forecast' && weather.isActualForecast === true
    });
    
    return isLive;
  }

  /**
   * CRITICAL: The ONLY method that generates weather source labels
   */
  static getWeatherSourceLabel(weather: any): string {
    const isLive = this.isLiveWeatherData(weather);
    const label = isLive ? 'Live Weather Forecast' : 'Historical Weather Data';
    
    console.log('🎯 CENTRALIZED: WeatherLabelService.getWeatherSourceLabel:', {
      isLive,
      label,
      weatherSource: weather?.source,
      isActualForecast: weather?.isActualForecast,
      cityName: weather?.cityName,
      centralizedLabel: true
    });
    
    return label;
  }

  /**
   * CRITICAL: Get live forecast indicator for display
   */
  static getLiveForecastIndicator(weather: any): string | null {
    const isLive = this.isLiveWeatherData(weather);
    const indicator = isLive ? '✓ Live Forecast' : null;
    
    console.log('🎯 CENTRALIZED: WeatherLabelService.getLiveForecastIndicator:', {
      isLive,
      indicator,
      weatherSource: weather?.source,
      isActualForecast: weather?.isActualForecast,
      cityName: weather?.cityName
    });
    
    return indicator;
  }

  /**
   * CRITICAL: Get styling configuration based on live detection
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

    console.log('🎯 CENTRALIZED: WeatherLabelService.getWeatherStyling:', {
      isLive,
      sourceLabel: config.sourceLabel,
      weatherSource: weather?.source,
      isActualForecast: weather?.isActualForecast,
      cityName: weather?.cityName
    });

    return config;
  }
}
