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
   * PLAN: Enhanced live forecast detection with comprehensive debugging
   */
  static isLiveForecast(weather: ForecastWeatherData, segmentDate?: Date | null): boolean {
    if (!weather) {
      console.log('🔍 PLAN: WeatherUtilityService.isLiveForecast - No weather data provided');
      return false;
    }
    
    const debugKey = `${weather.cityName}-${segmentDate?.toISOString().split('T')[0] || 'no-date'}`;
    
    // PLAN: Primary verification - both conditions must be true for live forecast
    const hasLiveSource = weather.source === 'live_forecast';
    const isVerifiedActual = weather.isActualForecast === true;
    const isVerifiedLive = hasLiveSource && isVerifiedActual;
    
    console.log('🎯 PLAN: WeatherUtilityService.isLiveForecast - ENHANCED VERIFICATION:', {
      debugKey,
      inputWeather: {
        source: weather.source,
        isActualForecast: weather.isActualForecast,
        cityName: weather.cityName,
        temperature: weather.temperature
      },
      verificationProcess: {
        step1_sourceCheck: {
          expected: 'live_forecast',
          actual: weather.source,
          passes: hasLiveSource
        },
        step2_actualForecastCheck: {
          expected: true,
          actual: weather.isActualForecast,
          passes: isVerifiedActual
        },
        step3_finalVerification: {
          bothConditionsMet: isVerifiedLive,
          result: isVerifiedLive
        }
      },
      methodCall: 'WeatherUtilityService.isLiveForecast',
      planImplementation: true
    });
    
    return isVerifiedLive;
  }

  /**
   * PLAN: Enhanced weather source label with guaranteed consistency
   */
  static getWeatherSourceLabel(weather: ForecastWeatherData, segmentDate?: Date | null): string {
    const debugKey = `${weather.cityName}-${segmentDate?.toISOString().split('T')[0] || 'no-date'}`;
    
    // PLAN: Use the EXACT SAME logic as isLiveForecast method for consistency
    const isVerifiedLive = this.isLiveForecast(weather, segmentDate);
    const label = isVerifiedLive ? 'Live Weather Forecast' : 'Historical Weather Data';
    
    console.log('🎯 PLAN: WeatherUtilityService.getWeatherSourceLabel - ENHANCED CONSISTENCY:', {
      debugKey,
      weatherAnalysis: {
        source: weather.source,
        isActualForecast: weather.isActualForecast,
        temperature: weather.temperature
      },
      labelCalculation: {
        isVerifiedLive,
        selectedLabel: label,
        usingConsistentLogic: true,
        matchesDetectionMethod: true
      },
      guaranteedConsistency: true,
      methodCall: 'WeatherUtilityService.getWeatherSourceLabel',
      planImplementation: true
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
