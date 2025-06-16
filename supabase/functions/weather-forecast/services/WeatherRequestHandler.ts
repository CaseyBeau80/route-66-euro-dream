
import { WeatherApiService, WeatherApiResponse } from './WeatherApiService.ts';
import { DateCalculationService } from './DateCalculationService.ts';
import { FallbackWeatherService } from './FallbackWeatherService.ts';

export class WeatherRequestHandler {
  private weatherApi: WeatherApiService;

  constructor(apiKey: string) {
    this.weatherApi = new WeatherApiService(apiKey);
  }

  async processWeatherRequest(cityName: string, targetDate: Date): Promise<WeatherApiResponse> {
    console.log('🌤️ Processing weather request:', {
      cityName,
      targetDate: targetDate.toISOString()
    });

    const daysFromToday = DateCalculationService.calculateDaysFromToday(targetDate);
    const isWithinForecastRange = DateCalculationService.isWithinForecastRange(daysFromToday);
    const targetDateString = DateCalculationService.getTargetDateString(targetDate);

    console.log('📅 Date analysis:', {
      daysFromToday,
      isWithinForecastRange,
      targetDateString
    });

    // Try to get live weather if within forecast range
    if (isWithinForecastRange) {
      const liveWeather = await this.fetchLiveWeather(cityName, targetDate, daysFromToday, targetDateString);
      if (liveWeather) {
        console.log('✅ Live weather retrieved successfully');
        return liveWeather;
      }
    }

    // Fall back to historical estimate
    console.log('🔄 Using fallback weather');
    return FallbackWeatherService.createFallbackWeather(cityName, targetDate);
  }

  private async fetchLiveWeather(
    cityName: string, 
    targetDate: Date, 
    daysFromToday: number, 
    targetDateString: string
  ): Promise<WeatherApiResponse | null> {
    try {
      // Get coordinates
      const coords = await this.weatherApi.getCoordinates(cityName);
      if (!coords) {
        throw new Error('Could not get coordinates');
      }

      console.log('🗺️ Coordinates found:', coords);

      // Get current weather for today (day 0) or forecast for future days
      if (daysFromToday === 0) {
        console.log('🌡️ Getting current weather for today');
        return await this.weatherApi.getCurrentWeather(coords.lat, coords.lon, cityName);
      } else {
        console.log('🔮 Getting forecast for future day:', daysFromToday);
        return await this.weatherApi.getForecastWeather(coords.lat, coords.lon, cityName, targetDateString);
      }
    } catch (error) {
      console.error('❌ Live weather fetch failed:', error);
      return null;
    }
  }
}
