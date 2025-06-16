
import { WeatherApiResponse } from './WeatherApiService.ts';

export class FallbackWeatherService {
  static createFallbackWeather(cityName: string, targetDate: Date): WeatherApiResponse {
    const month = targetDate.getMonth() + 1;
    const day = targetDate.getDate();
    
    // Simple seasonal temperature estimation
    let baseTemp = 70; // Default moderate temperature
    if (month >= 6 && month <= 8) baseTemp = 80; // Summer
    else if (month >= 12 || month <= 2) baseTemp = 45; // Winter
    else if (month >= 3 && month <= 5) baseTemp = 65; // Spring
    else if (month >= 9 && month <= 11) baseTemp = 60; // Fall
    
    // Add some variation
    const variation = Math.sin((day / 30) * Math.PI) * 10;
    const estimatedTemp = Math.round(baseTemp + variation);

    return {
      temperature: estimatedTemp,
      highTemp: estimatedTemp + 5,
      lowTemp: estimatedTemp - 8,
      description: 'Partly Cloudy',
      icon: '02d',
      humidity: 50,
      windSpeed: 8,
      precipitationChance: 20,
      cityName: cityName,
      forecastDate: targetDate,
      isActualForecast: false,
      source: 'historical_fallback'
    };
  }
}
