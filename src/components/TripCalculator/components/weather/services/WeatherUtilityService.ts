import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { DateNormalizationService } from '../DateNormalizationService';
import { WeatherLabelService } from './WeatherLabelService';

export interface WeatherSourceInfo {
  isLiveForecast: boolean;
  sourceLabel: string;
  confidence: 'excellent' | 'good' | 'fair' | 'poor';
  dataQuality: 'live' | 'historical' | 'fallback';
}

export class WeatherUtilityService {
  /**
   * REDIRECTED: Use centralized WeatherLabelService
   */
  static isLiveForecast(weather: ForecastWeatherData, segmentDate?: Date | null): boolean {
    const result = WeatherLabelService.isLiveWeatherData(weather);
    console.log('🎯 REDIRECTED: WeatherUtilityService.isLiveForecast -> WeatherLabelService:', {
      result,
      weatherSource: weather?.source,
      isActualForecast: weather?.isActualForecast,
      cityName: weather?.cityName,
      redirectedToWeatherLabelService: true
    });
    return result;
  }

  /**
   * REDIRECTED: Use centralized WeatherLabelService
   */
  static getWeatherSourceLabel(weather: ForecastWeatherData, segmentDate?: Date | null): string {
    const result = WeatherLabelService.getWeatherSourceLabel(weather);
    console.log('🎯 REDIRECTED: WeatherUtilityService.getWeatherSourceLabel -> WeatherLabelService:', {
      result,
      weatherSource: weather?.source,
      isActualForecast: weather?.isActualForecast,
      cityName: weather?.cityName,
      redirectedToWeatherLabelService: true
    });
    return result;
  }

  /**
   * REDIRECTED: Gets weather confidence and quality info using centralized service
   */
  static getWeatherSourceInfo(weather: ForecastWeatherData, segmentDate?: Date | null): WeatherSourceInfo {
    const isLive = WeatherLabelService.isLiveWeatherData(weather);
    
    let confidence: 'excellent' | 'good' | 'fair' | 'poor' = 'fair';
    let dataQuality: 'live' | 'historical' | 'fallback' = 'fallback';
    
    if (isLive) {
      confidence = 'excellent';
      dataQuality = 'live';
    } else if (weather.source === 'historical_fallback') {
      confidence = 'good';
      dataQuality = 'historical';
    }
    
    return {
      isLiveForecast: isLive,
      sourceLabel: WeatherLabelService.getWeatherSourceLabel(weather),
      confidence,
      dataQuality
    };
  }

  /**
   * STANDARDIZED: Calculates segment date from trip start date and day number
   */
  static getSegmentDate(tripStartDate: Date | null, segmentDay: number): Date | null {
    if (!tripStartDate) return null;
    
    try {
      const calculatedDate = DateNormalizationService.calculateSegmentDate(tripStartDate, segmentDay);
      console.log('📅 STANDARDIZED: Calculated segment date:', {
        tripStart: tripStartDate.toISOString(),
        day: segmentDay,
        calculated: calculatedDate.toISOString(),
        standardizedCalculation: true
      });
      return calculatedDate;
    } catch (error) {
      console.error('❌ STANDARDIZED: Date calculation failed:', error);
      return null;
    }
  }

  /**
   * STANDARDIZED: Validates if weather data is within live forecast range
   */
  static isWithinLiveForecastRange(targetDate: Date): boolean {
    const today = new Date();
    const daysFromToday = Math.ceil((targetDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
    return daysFromToday >= 0 && daysFromToday <= 7;
  }

  /**
   * STANDARDIZED: Gets days from today for a given date
   */
  static getDaysFromToday(targetDate: Date): number {
    const today = new Date();
    return Math.ceil((targetDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
  }
}
