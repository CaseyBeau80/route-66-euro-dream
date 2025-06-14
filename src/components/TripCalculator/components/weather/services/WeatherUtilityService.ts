
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
   * STANDARDIZED: Determines if weather data represents a live forecast
   * Uses consistent logic across all views and components
   */
  static isLiveForecast(weather: ForecastWeatherData, segmentDate?: Date | null): boolean {
    if (!weather || !segmentDate) {
      console.log('🔍 STANDARDIZED: Missing weather or date for live forecast check');
      return false;
    }
    
    // Calculate days from today
    const today = new Date();
    const daysFromToday = Math.ceil((segmentDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
    
    // STANDARDIZED CRITERIA: Must have live source AND be actual forecast AND within forecast range
    const isVerifiedLive = weather.source === 'live_forecast' && 
                          weather.isActualForecast === true &&
                          daysFromToday >= 0 && 
                          daysFromToday <= 7;
    
    console.log('🎯 STANDARDIZED: Live forecast validation:', {
      cityName: weather.cityName,
      segmentDate: segmentDate.toISOString(),
      daysFromToday,
      weatherSource: weather.source,
      isActualForecast: weather.isActualForecast,
      isVerifiedLive,
      standardizedCriteria: {
        hasLiveSource: weather.source === 'live_forecast',
        isActualForecast: weather.isActualForecast === true,
        withinRange: daysFromToday >= 0 && daysFromToday <= 7
      },
      validationMethod: 'standardized'
    });
    
    return isVerifiedLive;
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
   * STANDARDIZED: Gets weather source label for display
   */
  static getWeatherSourceLabel(weather: ForecastWeatherData, segmentDate?: Date | null): string {
    const isLive = this.isLiveForecast(weather, segmentDate);
    return isLive ? 'Live Weather Forecast' : 'Historical Weather Data';
  }

  /**
   * STANDARDIZED: Gets weather confidence and quality info
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
