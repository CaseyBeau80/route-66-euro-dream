
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

export class WeatherUtilityService {
  static getSegmentDate(tripStartDate: Date, segmentDay: number): Date | null {
    if (!tripStartDate || !segmentDay) return null;
    
    const segmentDate = new Date(tripStartDate);
    segmentDate.setDate(segmentDate.getDate() + (segmentDay - 1));
    
    return segmentDate;
  }

  static isLiveForecast(weather: ForecastWeatherData, segmentDate?: Date | null): boolean {
    if (!weather || !segmentDate) return false;
    
    const daysFromToday = Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
    
    console.log('🎯 CENTRALIZED: Live forecast validation:', {
      cityName: weather.cityName,
      segmentDate: segmentDate.toISOString(),
      daysFromToday,
      weatherSource: weather.source,
      isActualForecast: weather.isActualForecast,
      isVerifiedLive: weather.source === 'live_forecast' && weather.isActualForecast && daysFromToday >= -2 && daysFromToday <= 7,
      criteria: {
        hasLiveSource: weather.source === 'live_forecast',
        isActualForecast: weather.isActualForecast,
        withinRange: daysFromToday >= -2 && daysFromToday <= 7
      }
    });
    
    return weather.source === 'live_forecast' && 
           weather.isActualForecast === true && 
           daysFromToday >= -2 && 
           daysFromToday <= 7;
  }

  static getWeatherSourceLabel(weather: ForecastWeatherData, segmentDate?: Date | null): string {
    if (this.isLiveForecast(weather, segmentDate)) {
      return 'Live Weather Forecast';
    }
    
    if (weather.source === 'live_forecast') {
      return 'OpenWeatherMap API';
    }
    
    return 'Seasonal Weather Estimate';
  }

  static formatTemperature(temp: number): string {
    return `${Math.round(temp)}°F`;
  }

  static getTemperatureRange(weather: ForecastWeatherData): string {
    const high = weather.highTemp || weather.temperature;
    const low = weather.lowTemp || weather.temperature;
    
    if (high === low) {
      return this.formatTemperature(weather.temperature);
    }
    
    return `${this.formatTemperature(high)} / ${this.formatTemperature(low)}`;
  }
}
