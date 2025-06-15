
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

export interface EdgeFunctionWeatherParams {
  cityName: string;
  targetDate: Date;
  segmentDay: number;
}

export class EdgeFunctionWeatherService {
  /**
   * Fetch weather data directly from the Edge Function
   */
  static async fetchWeatherFromEdgeFunction(params: EdgeFunctionWeatherParams): Promise<ForecastWeatherData | null> {
    const { cityName, targetDate, segmentDay } = params;
    
    console.log('🌐 EDGE FUNCTION: Fetching weather from Edge Function:', {
      cityName,
      targetDate: targetDate.toISOString(),
      segmentDay
    });

    try {
      const response = await fetch('/api/weather-forecast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          city: cityName,
          targetDate: targetDate.toISOString(),
          segmentDay
        })
      });

      if (!response.ok) {
        console.error('❌ EDGE FUNCTION: API request failed:', response.status);
        return null;
      }

      const data = await response.json();
      
      console.log('✅ EDGE FUNCTION: Raw response from Edge Function:', {
        cityName,
        data,
        hasTemperature: data.temperature !== undefined,
        hasHighTemp: data.highTemp !== undefined,
        hasLowTemp: data.lowTemp !== undefined
      });

      if (!data || data.temperature === undefined) {
        console.error('❌ EDGE FUNCTION: Invalid response data');
        return null;
      }

      // Create ForecastWeatherData directly from Edge Function response
      const weatherData: ForecastWeatherData = {
        temperature: Math.round(data.temperature),
        highTemp: data.highTemp ? Math.round(data.highTemp) : Math.round(data.temperature),
        lowTemp: data.lowTemp ? Math.round(data.lowTemp) : Math.round(data.temperature),
        description: data.description || 'Partly Cloudy',
        icon: data.icon || '02d',
        humidity: data.humidity || 65,
        windSpeed: Math.round(data.windSpeed || 5),
        precipitationChance: Math.round(data.precipitationChance || 20),
        cityName: cityName,
        forecast: [],
        forecastDate: targetDate,
        isActualForecast: data.isActualForecast || false,
        source: data.source || 'historical_fallback'
      };

      console.log('✅ EDGE FUNCTION: Created weather data:', {
        cityName,
        temperature: weatherData.temperature,
        highTemp: weatherData.highTemp,
        lowTemp: weatherData.lowTemp,
        source: weatherData.source,
        isActualForecast: weatherData.isActualForecast,
        temperaturesAreDifferent: {
          currentVsHigh: weatherData.temperature !== weatherData.highTemp,
          currentVsLow: weatherData.temperature !== weatherData.lowTemp,
          highVsLow: weatherData.highTemp !== weatherData.lowTemp
        }
      });

      return weatherData;

    } catch (error) {
      console.error('❌ EDGE FUNCTION: Request failed:', error);
      return null;
    }
  }
}
