import { ForecastDay } from '@/components/Route66Map/services/weather/WeatherServiceTypes';
import { DateNormalizationService } from './DateNormalizationService';

export interface EnhancedMatchResult {
  matchedForecast: ForecastDay | null;
  matchInfo: {
    requestedDate: string;
    matchedDate: string;
    matchType: 'exact' | 'closest' | 'adjacent' | 'fallback' | 'none' | 'seasonal-estimate';
    daysOffset: number;
    hoursOffset?: number;
    confidence: 'high' | 'medium' | 'low';
    availableDates: string[];
  };
}

export class EnhancedWeatherForecastMatcher {
  /**
   * FIXED: Find best weather forecast match with more lenient strategies
   */
  static findBestMatch(
    processedForecast: ForecastDay[], 
    targetDate: Date,
    targetDateString: string,
    cityName: string
  ): EnhancedMatchResult {
    console.log(`🎯 FIXED: EnhancedWeatherForecastMatcher starting for ${cityName} on ${targetDateString}:`, {
      targetDate: targetDate.toISOString(),
      targetDateString,
      forecastCount: processedForecast.length,
      availableDates: processedForecast.map(f => f.dateString).filter(Boolean)
    });
    
    const availableDates = processedForecast.map(f => f.dateString).filter(Boolean);
    
    if (processedForecast.length === 0) {
      console.log(`❌ No forecasts available for ${cityName}`);
      return this.createNoMatchResult(targetDateString, availableDates);
    }
    
    // STRATEGY 1: Exact date match
    const exactMatch = this.findExactMatch(processedForecast, targetDateString, cityName);
    if (exactMatch) {
      return exactMatch;
    }
    
    // STRATEGY 2: Closest date within 48 hours (more lenient)
    const closestMatch = this.findClosestMatch(processedForecast, targetDate, targetDateString, cityName);
    if (closestMatch) {
      return closestMatch;
    }
    
    // STRATEGY 3: Adjacent date (±2 days, more lenient)
    const adjacentMatch = this.findAdjacentMatch(processedForecast, targetDate, targetDateString, cityName);
    if (adjacentMatch) {
      return adjacentMatch;
    }
    
    // STRATEGY 4: Any available forecast as fallback (most lenient)
    const fallbackMatch = this.findFallbackMatch(processedForecast, targetDate, targetDateString, cityName);
    if (fallbackMatch) {
      return fallbackMatch;
    }
    
    console.log(`❌ No suitable weather match found for ${cityName} on ${targetDateString}`);
    return this.createNoMatchResult(targetDateString, availableDates);
  }

  private static findExactMatch(
    forecasts: ForecastDay[], 
    targetDateString: string, 
    cityName: string
  ): EnhancedMatchResult | null {
    for (const forecast of forecasts) {
      if (forecast.dateString === targetDateString) {
        console.log(`✅ EXACT MATCH found for ${cityName} on ${targetDateString}:`, {
          matchedDate: forecast.dateString,
          temperature: forecast.temperature,
          description: forecast.description
        });
        
        return {
          matchedForecast: forecast,
          matchInfo: {
            requestedDate: targetDateString,
            matchedDate: forecast.dateString,
            matchType: 'exact',
            daysOffset: 0,
            hoursOffset: 0,
            confidence: 'high',
            availableDates: forecasts.map(f => f.dateString).filter(Boolean)
          }
        };
      }
    }
    
    console.log(`⚠️ No exact match for ${cityName} on ${targetDateString}`);
    return null;
  }

  private static findClosestMatch(
    forecasts: ForecastDay[], 
    targetDate: Date, 
    targetDateString: string, 
    cityName: string
  ): EnhancedMatchResult | null {
    const normalizedTarget = DateNormalizationService.normalizeSegmentDate(targetDate);
    
    let closestForecast: ForecastDay | null = null;
    let smallestOffsetHours = Infinity;
    let actualDayOffset = 0;
    
    for (const forecast of forecasts) {
      if (!forecast.dateString) continue;
      
      try {
        const forecastDate = new Date(forecast.dateString + 'T12:00:00Z');
        const offsetHours = Math.abs((forecastDate.getTime() - normalizedTarget.getTime()) / (60 * 60 * 1000));
        const dayOffset = Math.round((forecastDate.getTime() - normalizedTarget.getTime()) / (24 * 60 * 60 * 1000));
        
        // FIXED: More lenient - consider forecasts within 48 hours
        if (offsetHours <= 48 && offsetHours < smallestOffsetHours) {
          closestForecast = forecast;
          smallestOffsetHours = offsetHours;
          actualDayOffset = dayOffset;
        }
      } catch (error) {
        console.warn(`⚠️ Error processing forecast date for ${cityName}:`, forecast.dateString, error);
      }
    }
    
    if (closestForecast) {
      console.log(`📍 FIXED: CLOSEST MATCH found for ${cityName}: ${targetDateString} → ${closestForecast.dateString} (${smallestOffsetHours.toFixed(1)}h offset)`);
      
      return {
        matchedForecast: closestForecast,
        matchInfo: {
          requestedDate: targetDateString,
          matchedDate: closestForecast.dateString,
          matchType: 'closest',
          daysOffset: actualDayOffset,
          hoursOffset: smallestOffsetHours,
          confidence: smallestOffsetHours <= 24 ? 'high' : 'medium',
          availableDates: forecasts.map(f => f.dateString).filter(Boolean)
        }
      };
    }
    
    return null;
  }

  private static findAdjacentMatch(
    forecasts: ForecastDay[], 
    targetDate: Date, 
    targetDateString: string, 
    cityName: string
  ): EnhancedMatchResult | null {
    // FIXED: Try ±2 days from target (more lenient)
    const testDates = [];
    for (let i = -2; i <= 2; i++) {
      if (i === 0) continue; // Skip exact match (already tried)
      const testDate = new Date(targetDate.getTime() + i * 24 * 60 * 60 * 1000);
      const testDateString = DateNormalizationService.toDateString(testDate);
      testDates.push({ offset: i, dateString: testDateString });
    }
    
    for (const testDate of testDates) {
      for (const forecast of forecasts) {
        if (forecast.dateString === testDate.dateString) {
          console.log(`📅 FIXED: ADJACENT MATCH found for ${cityName}: ${targetDateString} → ${testDate.dateString} (${testDate.offset > 0 ? '+' : ''}${testDate.offset} day${Math.abs(testDate.offset) > 1 ? 's' : ''})`);
          
          return {
            matchedForecast: forecast,
            matchInfo: {
              requestedDate: targetDateString,
              matchedDate: forecast.dateString,
              matchType: 'adjacent',
              daysOffset: testDate.offset,
              confidence: Math.abs(testDate.offset) === 1 ? 'medium' : 'low',
              availableDates: forecasts.map(f => f.dateString).filter(Boolean)
            }
          };
        }
      }
    }
    
    return null;
  }

  private static findFallbackMatch(
    forecasts: ForecastDay[], 
    targetDate: Date, 
    targetDateString: string, 
    cityName: string
  ): EnhancedMatchResult | null {
    // Use the first valid forecast as fallback
    const firstValidForecast = forecasts.find(f => f.dateString && f.temperature);
    
    if (firstValidForecast) {
      console.log(`🔄 FALLBACK MATCH for ${cityName}: ${targetDateString} → ${firstValidForecast.dateString} (using best available)`);
      
      return {
        matchedForecast: firstValidForecast,
        matchInfo: {
          requestedDate: targetDateString,
          matchedDate: firstValidForecast.dateString,
          matchType: 'fallback',
          daysOffset: DateNormalizationService.getDaysDifference(targetDate, new Date(firstValidForecast.dateString + 'T12:00:00Z')),
          confidence: 'low',
          availableDates: forecasts.map(f => f.dateString).filter(Boolean)
        }
      };
    }
    
    return null;
  }

  private static createNoMatchResult(targetDateString: string, availableDates: string[]): EnhancedMatchResult {
    return {
      matchedForecast: null,
      matchInfo: {
        requestedDate: targetDateString,
        matchedDate: 'none',
        matchType: 'none',
        daysOffset: -1,
        confidence: 'low',
        availableDates
      }
    };
  }
}
