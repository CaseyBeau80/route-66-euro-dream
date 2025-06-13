
import { WeatherFetchingService } from './services/WeatherFetchingService';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherSourceType } from '@/components/Route66Map/services/weather/WeatherServiceTypes';

export interface DateMatchInfo {
  source: WeatherSourceType;
  confidence: 'high' | 'medium' | 'low' | 'historical';
  explanation: string;
}

export interface WeatherDisplayData {
  lowTemp: number;
  highTemp: number;
  icon: string;
  description: string;
  source: 'live_forecast' | 'historical_fallback';
  isAvailable: boolean;
  humidity?: number;
  windSpeed?: number;
  precipitationChance?: number;
  cityName: string;
  isActualForecast: boolean;
  dateMatchInfo: DateMatchInfo;
}

// FIXED: This function now acts as a bridge to the actual weather service
// instead of being a placeholder that always returns null
export const getWeatherDataForTripDate = async (
  cityName: string,
  segmentDate: Date
): Promise<WeatherDisplayData | null> => {
  console.log('🔧 FIXED: getWeatherDataForTripDate now redirecting to WeatherFetchingService');
  
  return new Promise((resolve, reject) => {
    WeatherFetchingService.fetchWeatherForSegment(
      cityName,
      segmentDate,
      () => {}, // loading callback - not needed here
      (error) => {
        if (error) {
          console.warn(`getWeatherDataForTripDate: Error fetching weather for ${cityName}:`, error);
          resolve(null);
        }
      },
      (weather: ForecastWeatherData | null) => {
        if (weather) {
          // Convert ForecastWeatherData to WeatherDisplayData format
          const weatherDisplayData: WeatherDisplayData = {
            lowTemp: weather.lowTemp || weather.temperature - 10,
            highTemp: weather.highTemp || weather.temperature + 10,
            icon: weather.icon,
            description: weather.description,
            source: weather.source === 'live_forecast' ? 'live_forecast' : 'historical_fallback',
            isAvailable: true,
            humidity: weather.humidity,
            windSpeed: weather.windSpeed,
            precipitationChance: weather.precipitationChance,
            cityName: weather.cityName,
            isActualForecast: weather.isActualForecast,
            dateMatchInfo: {
              source: weather.dateMatchInfo?.source || 'historical_fallback',
              confidence: weather.dateMatchInfo?.confidence || 'low',
              explanation: 'Weather data retrieved via WeatherFetchingService'
            }
          };
          
          console.log('🔧 FIXED: Converted weather data for', cityName, {
            isActualForecast: weatherDisplayData.isActualForecast,
            source: weatherDisplayData.source
          });
          
          resolve(weatherDisplayData);
        } else {
          resolve(null);
        }
      }
    );
  });
};
