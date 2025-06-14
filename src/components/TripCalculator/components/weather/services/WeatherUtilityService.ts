
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
   * FIXED: Determines if weather data represents a live forecast
   * Uses simplified and reliable logic for live forecast detection
   */
  static isLiveForecast(weather: ForecastWeatherData, segmentDate?: Date | null): boolean {
    if (!weather) {
      console.log('🔍 FIXED: No weather data provided for live forecast check');
      return false;
    }
    
    // FIXED: Primary check - if source is 'live_forecast' AND isActualForecast is true, it's live
    const isVerifiedLive = weather.source === 'live_forecast' && weather.isActualForecast === true;
    
    console.log('🎯 FIXED: Live forecast validation (centralized service):', {
      cityName: weather.cityName,
      weatherSource: weather.source,
      isActualForecast: weather.isActualForecast,
      isVerifiedLive,
      fixedCriteria: {
        hasLiveSource: weather.source === 'live_forecast',
        isActualForecast: weather.isActualForecast === true,
        bothConditionsMet: isVerifiedLive
      },
      validationMethod: 'centralized_service',
      serviceCall: 'WeatherUtilityService.isLiveForecast'
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
   * FIXED: Gets weather source label for display - CENTRALIZED METHOD
   */
  static getWeatherSourceLabel(weather: ForecastWeatherData, segmentDate?: Date | null): string {
    // FIXED: Use the EXACT SAME logic as isLiveForecast method
    const isVerifiedLive = this.isLiveForecast(weather, segmentDate);
    const label = isVerifiedLive ? 'Live Weather Forecast' : 'Historical Weather Data';
    
    console.log('🎯 FIXED: Weather source label (CENTRALIZED SERVICE):', {
      cityName: weather.cityName,
      weatherSource: weather.source,
      isActualForecast: weather.isActualForecast,
      isVerifiedLive,
      label,
      centralizedService: true,
      methodUsed: 'WeatherUtilityService.getWeatherSourceLabel',
      matchesDetection: true,
      finalLabel: label
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
