
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
   * CENTRALIZED: Determines if weather data represents a live forecast
   * This replaces scattered isLiveForecast logic across components
   */
  static isLiveForecast(weather: ForecastWeatherData, segmentDate?: Date | null): boolean {
    if (!weather || !segmentDate) return false;
    
    // Calculate days from today
    const today = new Date();
    const daysFromToday = Math.ceil((segmentDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
    
    // EXACT CRITERIA: Must have live source AND be actual forecast AND within forecast range
    const isVerifiedLive = weather.source === 'live_forecast' && 
                          weather.isActualForecast === true &&
                          daysFromToday >= 0 && 
                          daysFromToday <= 7;
    
    console.log('🎯 CENTRALIZED: Live forecast validation:', {
      cityName: weather.cityName,
      segmentDate: segmentDate.toISOString(),
      daysFromToday,
      weatherSource: weather.source,
      isActualForecast: weather.isActualForecast,
      isVerifiedLive,
      criteria: {
        hasLiveSource: weather.source === 'live_forecast',
        isActualForecast: weather.isActualForecast === true,
        withinRange: daysFromToday >= 0 && daysFromToday <= 7
      }
    });
    
    return isVerifiedLive;
  }

  /**
   * CENTRALIZED: Calculates segment date from trip start date and day number
   * This replaces scattered date calculation logic
   */
  static getSegmentDate(tripStartDate: Date | null, segmentDay: number): Date | null {
    if (!tripStartDate) return null;
    
    try {
      const calculatedDate = DateNormalizationService.calculateSegmentDate(tripStartDate, segmentDay);
      console.log('📅 CENTRALIZED: Calculated segment date:', {
        tripStart: tripStartDate.toISOString(),
        day: segmentDay,
        calculated: calculatedDate.toISOString()
      });
      return calculatedDate;
    } catch (error) {
      console.error('❌ CENTRALIZED: Date calculation failed:', error);
      return null;
    }
  }

  /**
   * CENTRALIZED: Gets weather source label for display
   */
  static getWeatherSourceLabel(weather: ForecastWeatherData, segmentDate?: Date | null): string {
    const isLive = this.isLiveForecast(weather, segmentDate);
    return isLive ? 'Live Weather Forecast' : 'Historical Weather Data';
  }

  /**
   * CENTRALIZED: Gets weather confidence and quality info
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
   * CENTRALIZED: Validates if weather data is within live forecast range
   */
  static isWithinLiveForecastRange(targetDate: Date): boolean {
    const today = new Date();
    const daysFromToday = Math.ceil((targetDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
    return daysFromToday >= 0 && daysFromToday <= 7;
  }

  /**
   * CENTRALIZED: Gets days from today for a given date
   */
  static getDaysFromToday(targetDate: Date): number {
    const today = new Date();
    return Math.ceil((targetDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
  }
}
