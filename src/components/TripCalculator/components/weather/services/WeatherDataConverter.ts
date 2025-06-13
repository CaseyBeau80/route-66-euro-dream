
import { WeatherDisplayData } from '../getWeatherDataForTripDate';
import { getHistoricalWeatherData } from '../SeasonalWeatherService';

export class WeatherDataConverter {
  static createLiveForecastResult(
    forecastData: any,
    cityName: string
  ): WeatherDisplayData {
    const highTemp = forecastData.highTemp || forecastData.temperature || 0;
    const lowTemp = forecastData.lowTemp || forecastData.temperature || 0;

    return {
      lowTemp: lowTemp,
      highTemp: highTemp,
      icon: forecastData.icon,
      description: forecastData.description,
      source: 'live_forecast',
      isAvailable: true,
      humidity: forecastData.humidity,
      windSpeed: forecastData.windSpeed,
      precipitationChance: forecastData.precipitationChance,
      cityName: forecastData.cityName,
      isActualForecast: true
    };
  }

  static createHistoricalFallbackResult(
    cityName: string,
    segmentDate: Date
  ): WeatherDisplayData {
    const historicalData = getHistoricalWeatherData(cityName, segmentDate, 0);
    
    return {
      lowTemp: historicalData.low,
      highTemp: historicalData.high,
      icon: '🌡️',
      description: historicalData.condition,
      source: 'historical_fallback',
      isAvailable: true,
      humidity: historicalData.humidity,
      windSpeed: historicalData.windSpeed,
      precipitationChance: historicalData.precipitationChance,
      cityName: cityName,
      isActualForecast: false
    };
  }
}
