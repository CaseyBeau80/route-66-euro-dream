
/**
 * CENTRALIZED: Single source of truth for weather labels across ALL components
 */
export class WeatherLabelService {
  /**
   * CRITICAL: The ONLY method that determines if weather is live
   */
  static isLiveWeatherData(weather: any): boolean {
    if (!weather) return false;
    
    // DIRECT CHECK: Both properties must be exactly these values
    const isLive = weather.source === 'live_forecast' && weather.isActualForecast === true;
    
    console.log('🎯 CENTRALIZED: WeatherLabelService.isLiveWeatherData:', {
      weatherSource: weather.source,
      isActualForecast: weather.isActualForecast,
      result: isLive,
      cityName: weather.cityName,
      centralizedCheck: true
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
    return isLive ? '✓ Live Forecast' : null;
  }
}
