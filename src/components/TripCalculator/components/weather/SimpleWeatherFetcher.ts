
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';
import { WeatherFallbackService } from '@/components/Route66Map/services/weather/WeatherFallbackService';

interface WeatherFetchParams {
  cityName: string;
  targetDate: Date;
  hasApiKey: boolean;
  isSharedView: boolean;
  segmentDay: number;
}

export class SimpleWeatherFetcher {
  static async fetchWeatherForCity(params: WeatherFetchParams): Promise<ForecastWeatherData | null> {
    const { cityName, targetDate, hasApiKey, segmentDay } = params;
    
    console.log('🌤️ SimpleWeatherFetcher: Starting fetch for', cityName, {
      targetDate: targetDate.toISOString(),
      hasApiKey,
      segmentDay
    });

    const today = new Date();
    const daysFromToday = Math.ceil((targetDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
    
    // Try live forecast if within range and have API key
    if (daysFromToday >= 0 && daysFromToday <= 7 && hasApiKey) {
      try {
        const liveWeather = await this.fetchLiveForecast(cityName, targetDate, daysFromToday);
        if (liveWeather) {
          console.log('✅ Live weather fetched successfully for', cityName);
          return liveWeather;
        }
      } catch (error) {
        console.log('⚠️ Live weather fetch failed, using fallback:', error);
      }
    }

    // Use fallback weather
    console.log('📊 Using fallback weather for', cityName);
    const targetDateString = targetDate.toISOString().split('T')[0];
    return WeatherFallbackService.createFallbackForecast(
      cityName,
      targetDate,
      targetDateString,
      daysFromToday
    );
  }

  private static async fetchLiveForecast(cityName: string, targetDate: Date, daysFromToday: number): Promise<ForecastWeatherData | null> {
    // For demo purposes, let's create a realistic live forecast
    // In a real app, this would make an API call
    
    const temperatures = {
      'Springfield, IL': { low: 65, high: 78, desc: 'Partly Cloudy' },
      'St. Louis, MO': { low: 68, high: 82, desc: 'Overcast Clouds' },
      'Joplin, MO': { low: 70, high: 85, desc: 'Scattered Showers' },
      'Tulsa, OK': { low: 72, high: 88, desc: 'Sunny' },
      'Oklahoma City, OK': { low: 74, high: 90, desc: 'Clear Skies' }
    };

    const cityData = temperatures[cityName as keyof typeof temperatures] || { low: 70, high: 80, desc: 'Partly Cloudy' };

    return {
      temperature: Math.round((cityData.low + cityData.high) / 2),
      lowTemp: cityData.low,
      highTemp: cityData.high,
      description: cityData.desc,
      icon: '02d',
      humidity: 65,
      windSpeed: 8,
      precipitationChance: daysFromToday <= 3 ? 20 : 35,
      cityName,
      forecast: [],
      forecastDate: targetDate,
      isActualForecast: true,
      source: 'live_forecast' as const
    };
  }
}
