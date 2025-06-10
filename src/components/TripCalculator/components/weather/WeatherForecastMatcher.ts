
import { ForecastDay } from '@/components/Route66Map/services/weather/WeatherServiceTypes';

export interface MatchResult {
  matchedForecast: ForecastDay | null;
  matchInfo: {
    requestedDate: string;
    matchedDate: string;
    matchType: 'exact' | 'closest' | 'none' | 'fallback';
    daysOffset: number;
    hoursOffset?: number;
  };
}

export class WeatherForecastMatcher {
  /**
   * Normalize date to UTC midnight for exact matching
   */
  private static normalizeToUtcMidnight(date: Date): Date {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  }

  static findBestMatch(
    processedForecast: ForecastDay[], 
    targetDate: Date,
    targetDateString: string
  ): MatchResult {
    console.log(`🎯 Exact date matching for ${targetDateString} from ${processedForecast.length} forecasts`);
    
    if (processedForecast.length === 0) {
      return {
        matchedForecast: null,
        matchInfo: {
          requestedDate: targetDateString,
          matchedDate: 'none',
          matchType: 'none' as const,
          daysOffset: -1
        }
      };
    }
    
    const normalizedTargetDate = this.normalizeToUtcMidnight(targetDate);
    
    // First: Try exact UTC date match
    for (const forecast of processedForecast) {
      if (forecast.dateString === targetDateString) {
        console.log(`✅ Exact UTC date match found for ${targetDateString}`);
        return {
          matchedForecast: forecast,
          matchInfo: {
            requestedDate: targetDateString,
            matchedDate: forecast.dateString,
            matchType: 'exact' as const,
            daysOffset: 0,
            hoursOffset: 0
          }
        };
      }
    }
    
    // Second: Find closest date within ±12 hours
    let closestForecast: ForecastDay | null = null;
    let smallestOffsetHours = Infinity;
    let actualDayOffset = 0;
    
    for (const forecast of processedForecast) {
      if (!forecast.dateString) continue;
      
      const forecastDate = new Date(forecast.dateString + 'T00:00:00Z');
      const offsetHours = Math.abs((forecastDate.getTime() - normalizedTargetDate.getTime()) / (60 * 60 * 1000));
      const dayOffset = Math.round((forecastDate.getTime() - normalizedTargetDate.getTime()) / (24 * 60 * 60 * 1000));
      
      // Only consider forecasts within 12 hours (0.5 days)
      if (offsetHours <= 12 && offsetHours < smallestOffsetHours) {
        closestForecast = forecast;
        smallestOffsetHours = offsetHours;
        actualDayOffset = dayOffset;
      }
    }
    
    if (closestForecast) {
      console.log(`📍 Closest match found for ${targetDateString}: ${closestForecast.dateString} (${smallestOffsetHours.toFixed(1)} hours offset)`);
      return {
        matchedForecast: closestForecast,
        matchInfo: {
          requestedDate: targetDateString,
          matchedDate: closestForecast.dateString,
          matchType: 'closest' as const,
          daysOffset: actualDayOffset,
          hoursOffset: smallestOffsetHours
        }
      };
    }
    
    console.log(`❌ No suitable forecast match found within 12 hours for ${targetDateString}`);
    return {
      matchedForecast: null,
      matchInfo: {
        requestedDate: targetDateString,
        matchedDate: 'none',
        matchType: 'none' as const,
        daysOffset: -1
      }
    };
  }
}
