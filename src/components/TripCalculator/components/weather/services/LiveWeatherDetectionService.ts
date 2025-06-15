
export class LiveWeatherDetectionService {
  /**
   * CRITICAL: Unified live weather detection logic
   * This is the SINGLE source of truth for determining if weather is live
   */
  static isLiveWeatherForecast(weather: any): boolean {
    if (!weather) {
      console.log('❌ LIVE DETECTION: No weather data provided');
      return false;
    }

    console.log('🔍 LIVE DETECTION: Analyzing weather data:', {
      source: weather.source,
      isActualForecast: weather.isActualForecast,
      temperature: weather.temperature,
      cityName: weather.cityName
    });

    // CRITICAL: Both conditions must be true for live weather
    const isLive = weather.source === 'live_forecast' && weather.isActualForecast === true;
    
    console.log('🎯 LIVE DETECTION: Final result:', {
      isLive,
      sourceCheck: weather.source === 'live_forecast',
      actualForecastCheck: weather.isActualForecast === true,
      expectedStyling: isLive ? 'GREEN' : 'YELLOW'
    });

    return isLive;
  }

  /**
   * Debug helper to analyze weather data structure
   */
  static debugWeatherData(weather: any, cityName: string): void {
    console.log(`🔧 WEATHER DEBUG for ${cityName}:`, {
      hasWeather: !!weather,
      source: weather?.source,
      isActualForecast: weather?.isActualForecast,
      temperature: weather?.temperature,
      description: weather?.description,
      isLiveResult: this.isLiveWeatherForecast(weather),
      expectedBackground: this.isLiveWeatherForecast(weather) ? 'GREEN' : 'YELLOW'
    });
  }
}
