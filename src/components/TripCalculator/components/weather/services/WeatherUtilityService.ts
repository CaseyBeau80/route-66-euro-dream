
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { DateNormalizationService } from '../DateNormalizationService';

export interface WeatherSourceInfo {
  isLiveForecast: boolean;
  sourceLabel: string;
  confidence: 'excellent' | 'good' | 'fair' | 'poor';
  dataQuality: 'live' | 'historical' | 'fallback';
}

export class WeatherUtilityService {
  /**
   * FIXED: Direct and simple live forecast detection
   */
  static isLiveForecast(weather: ForecastWeatherData, segmentDate?: Date | null): boolean {
    if (!weather) {
      return false;
    }
    
    // CRITICAL FIX: Simple, direct boolean check
    const isLive = weather.source === 'live_forecast' && weather.isActualForecast === true;
    
    console.log('🔧 FIXED: WeatherUtilityService.isLiveForecast - DIRECT CHECK:', {
      weatherSource: weather.source,
      isActualForecast: weather.isActualForecast,
      directResult: isLive,
      cityName: weather.cityName,
      fixApplied: true
    });
    
    return isLive;
  }

  /**
   * FIXED: Direct weather source label without complex logic
   */
  static getWeatherSourceLabel(weather: ForecastWeatherData, segmentDate?: Date | null): string {
    // CRITICAL FIX: Use direct property checks, not method calls
    const isLive = weather.source === 'live_forecast' && weather.isActualForecast === true;
    const label = isLive ? 'Live Weather Forecast' : 'Historical Weather Data';
    
    console.log('🔧 FIXED: WeatherUtilityService.getWeatherSourceLabel - DIRECT LABEL:', {
      weatherSource: weather.source,
      isActualForecast: weather.isActualForecast,
      directIsLive: isLive,
      selectedLabel: label,
      cityName: weather.cityName,
      fixApplied: true
    });
    
    return label;
  }

  /**
   * FIXED: Gets weather confidence and quality info
   */
  static getWeatherSourceInfo(weather: ForecastWeatherData, segmentDate?: Date | null): WeatherSourceInfo {
    const isLive = this.isLiveForecast(weather, segmentDate);
    
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
      sourceLabel: this.getWeatherSourceLabel(weather, segmentDate),
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
