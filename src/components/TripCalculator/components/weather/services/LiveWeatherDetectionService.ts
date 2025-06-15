
export class LiveWeatherDetectionService {
  /**
   * CRITICAL FIX: Unified live weather detection logic
   */
  static isLiveWeatherForecast(weather: any): boolean {
    if (!weather) {
      console.log('❌ LIVE DETECTION: No weather data provided');
      return false;
    }

    console.log('🔍 CRITICAL FIX: Live weather detection:', {
      source: weather.source,
      isActualForecast: weather.isActualForecast,
      temperature: weather.temperature,
      cityName: weather.cityName
    });

    // CRITICAL FIX: Both conditions must be true for live weather
    const isLive = weather.source === 'live_forecast' && weather.isActualForecast === true;
    
    console.log('🎯 CRITICAL FIX: Live detection result:', {
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
