
import { SimpleWeatherFetcher } from './SimpleWeatherFetcher';
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

// FIXED: This function now uses SimpleWeatherFetcher instead of WeatherFetchingService
export const getWeatherDataForTripDate = async (
  cityName: string,
  segmentDate: Date
): Promise<WeatherDisplayData | null> => {
  console.log('🔧 FIXED: getWeatherDataForTripDate now using SimpleWeatherFetcher');
  
  try {
    const hasApiKey = !!localStorage.getItem('weather_api_key');
    
    const weather = await SimpleWeatherFetcher.fetchWeatherForCity({
      cityName,
      targetDate: segmentDate,
      hasApiKey,
      isSharedView: false,
      segmentDay: 1
    });

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
          explanation: 'Weather data retrieved via SimpleWeatherFetcher'
        }
      };
      
      console.log('🔧 FIXED: Converted weather data for', cityName, {
        isActualForecast: weatherDisplayData.isActualForecast,
        source: weatherDisplayData.source
      });
      
      return weatherDisplayData;
    } else {
      return null;
    }
  } catch (error) {
    console.error('❌ Error fetching weather for', cityName, ':', error);
    return null;
  }
};
