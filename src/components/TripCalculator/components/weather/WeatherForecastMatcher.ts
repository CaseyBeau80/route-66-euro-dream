
import { ForecastDay } from '@/components/Route66Map/services/weather/WeatherServiceTypes';

export interface MatchResult {
  matchedForecast: ForecastDay | null;
  matchInfo: {
    requestedDate: string;
    matchedDate: string;
    matchType: 'exact' | 'closest' | 'none' | 'fallback';
    daysOffset: number;
  };
}

export class WeatherForecastMatcher {
  static findBestMatch(
    processedForecast: ForecastDay[], 
    targetDate: Date,
    targetDateString: string
  ): MatchResult {
    console.log(`🎯 Forecast matching for ${targetDateString} from ${processedForecast.length} forecasts`);
    
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
    
    // First try exact date match
    for (const forecast of processedForecast) {
      if (forecast.dateString === targetDateString) {
        console.log(`✅ Exact date match found for ${targetDateString}`);
        return {
          matchedForecast: forecast,
          matchInfo: {
            requestedDate: targetDateString,
            matchedDate: forecast.dateString,
            matchType: 'exact' as const,
            daysOffset: 0
          }
        };
      }
    }
    
    // Find closest date within reasonable range
    let closestForecast: ForecastDay | null = null;
    let smallestOffset = Infinity;
    let actualOffset = 0;
    
    const targetDateObj = new Date(targetDateString + 'T00:00:00Z');
    
    for (const forecast of processedForecast) {
      if (!forecast.dateString) continue;
      
      const forecastDate = new Date(forecast.dateString + 'T00:00:00Z');
      const offsetDays = Math.abs((forecastDate.getTime() - targetDateObj.getTime()) / (24 * 60 * 60 * 1000));
      const actualDayOffset = Math.round((forecastDate.getTime() - targetDateObj.getTime()) / (24 * 60 * 60 * 1000));
      
      if (offsetDays < smallestOffset && offsetDays <= 2) {
        closestForecast = forecast;
        smallestOffset = offsetDays;
        actualOffset = actualDayOffset;
      }
    }
    
    if (closestForecast) {
      console.log(`📍 Closest match found for ${targetDateString}: ${closestForecast.dateString}`);
      return {
        matchedForecast: closestForecast,
        matchInfo: {
          requestedDate: targetDateString,
          matchedDate: closestForecast.dateString,
          matchType: 'closest' as const,
          daysOffset: actualOffset
        }
      };
    }
    
    console.log(`❌ No suitable forecast match found for ${targetDateString}`);
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
