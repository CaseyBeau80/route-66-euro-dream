
import { WeatherDisplayData } from '../getWeatherDataForTripDate';
import { getHistoricalWeatherData } from '../SeasonalWeatherService';

export class WeatherDataConverter {
  static createLiveForecastResult(
    forecastData: any,
    cityName: string
  ): WeatherDisplayData {
    const highTemp = forecastData.highTemp || forecastData.temperature || 0;
    const lowTemp = forecastData.lowTemp || forecastData.temperature || 0;

    console.log('🔄 WeatherDataConverter: Creating LIVE forecast result', {
      cityName,
      hasExplicitSource: !!forecastData.source,
      hasIsActualForecast: typeof forecastData.isActualForecast === 'boolean',
      sourceMarking: 'live_forecast'
    });

    return {
      lowTemp: lowTemp,
      highTemp: highTemp,
      icon: forecastData.icon,
      description: forecastData.description,
      source: 'live_forecast', // ENHANCED: Explicit live forecast marking
      isAvailable: true,
      humidity: forecastData.humidity,
      windSpeed: forecastData.windSpeed,
      precipitationChance: forecastData.precipitationChance,
      cityName: forecastData.cityName,
      isActualForecast: true, // ENHANCED: Always true for live forecasts
      dateMatchInfo: {
        ...forecastData.dateMatchInfo,
        source: 'api-forecast' // ENHANCED: Use api-forecast for dateMatchSource
      }
    };
  }

  static createHistoricalFallbackResult(
    cityName: string,
    segmentDate: Date
  ): WeatherDisplayData {
    const historicalData = getHistoricalWeatherData(cityName, segmentDate, 0);
    
    console.log('🔄 WeatherDataConverter: Creating HISTORICAL fallback result', {
      cityName,
      segmentDate: segmentDate.toISOString(),
      sourceMarking: 'historical_fallback'
    });
    
    return {
      lowTemp: historicalData.low,
      highTemp: historicalData.high,
      icon: '🌡️',
      description: historicalData.condition,
      source: 'historical_fallback', // ENHANCED: Explicit historical marking
      isAvailable: true,
      humidity: historicalData.humidity,
      windSpeed: historicalData.windSpeed,
      precipitationChance: historicalData.precipitationChance,
      cityName: cityName,
      isActualForecast: false, // ENHANCED: Always false for historical data
      dateMatchInfo: {
        source: 'seasonal-estimate', // ENHANCED: Clear seasonal source marking
        confidence: 'historical',
        explanation: 'Using seasonal weather patterns - live forecast not available for this date'
      }
    };
  }
}
