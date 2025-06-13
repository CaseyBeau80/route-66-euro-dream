
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
   * PLAN IMPLEMENTATION: Enhanced forecast matching with comprehensive debugging
   */
  static findBestMatch(
    processedForecast: ForecastDay[], 
    targetDate: Date,
    targetDateString: string,
    cityName: string
  ): EnhancedMatchResult {
    console.log(`🎯 PLAN: Enhanced forecast matching starting for ${cityName} on ${targetDateString}:`, {
      targetDate: targetDate.toISOString(),
      targetDateString,
      forecastCount: processedForecast.length,
      availableDates: processedForecast.map(f => f.dateString).filter(Boolean),
      planImplementation: true,
      enhancedDebugging: true
    });
    
    const availableDates = processedForecast.map(f => f.dateString).filter(Boolean);
    
    if (processedForecast.length === 0) {
      console.log(`❌ PLAN: No forecasts available for ${cityName}`, {
        reason: 'empty_forecast_array',
        planImplementation: true
      });
      return this.createNoMatchResult(targetDateString, availableDates);
    }
    
    // PLAN IMPLEMENTATION: Enhanced Strategy 1 - Exact date match
    console.log(`🔍 PLAN: Attempting EXACT MATCH for ${cityName}`, {
      targetDateString,
      availableDates,
      planImplementation: true
    });
    const exactMatch = this.findExactMatch(processedForecast, targetDateString, cityName);
    if (exactMatch) {
      console.log(`✅ PLAN: EXACT MATCH SUCCESS for ${cityName}`, {
        matchedDate: exactMatch.matchedForecast?.dateString,
        temperature: exactMatch.matchedForecast?.temperature,
        planImplementation: true
      });
      return exactMatch;
    }
    
    // PLAN IMPLEMENTATION: Enhanced Strategy 2 - Closest date within 72 hours (more lenient)
    console.log(`🔍 PLAN: Attempting CLOSEST MATCH for ${cityName}`, {
      targetDateString,
      maxHoursOffset: 72,
      planImplementation: true
    });
    const closestMatch = this.findClosestMatch(processedForecast, targetDate, targetDateString, cityName);
    if (closestMatch) {
      console.log(`✅ PLAN: CLOSEST MATCH SUCCESS for ${cityName}`, {
        matchedDate: closestMatch.matchedForecast?.dateString,
        hoursOffset: closestMatch.matchInfo.hoursOffset,
        planImplementation: true
      });
      return closestMatch;
    }
    
    // PLAN IMPLEMENTATION: Enhanced Strategy 3 - Adjacent date (±3 days, more lenient)
    console.log(`🔍 PLAN: Attempting ADJACENT MATCH for ${cityName}`, {
      targetDateString,
      maxDaysOffset: 3,
      planImplementation: true
    });
    const adjacentMatch = this.findAdjacentMatch(processedForecast, targetDate, targetDateString, cityName);
    if (adjacentMatch) {
      console.log(`✅ PLAN: ADJACENT MATCH SUCCESS for ${cityName}`, {
        matchedDate: adjacentMatch.matchedForecast?.dateString,
        daysOffset: adjacentMatch.matchInfo.daysOffset,
        planImplementation: true
      });
      return adjacentMatch;
    }
    
    // PLAN IMPLEMENTATION: Enhanced Strategy 4 - Any available forecast as fallback
    console.log(`🔍 PLAN: Attempting FALLBACK MATCH for ${cityName}`, {
      targetDateString,
      availableForecasts: processedForecast.length,
      planImplementation: true
    });
    const fallbackMatch = this.findFallbackMatch(processedForecast, targetDate, targetDateString, cityName);
    if (fallbackMatch) {
      console.log(`✅ PLAN: FALLBACK MATCH SUCCESS for ${cityName}`, {
        matchedDate: fallbackMatch.matchedForecast?.dateString,
        planImplementation: true
      });
      return fallbackMatch;
    }
    
    console.log(`❌ PLAN: ALL MATCHING STRATEGIES FAILED for ${cityName} on ${targetDateString}`, {
      availableDates,
      strategiesTried: ['exact', 'closest', 'adjacent', 'fallback'],
      planImplementation: true
    });
    return this.createNoMatchResult(targetDateString, availableDates);
  }

  private static findExactMatch(
    forecasts: ForecastDay[], 
    targetDateString: string, 
    cityName: string
  ): EnhancedMatchResult | null {
    for (const forecast of forecasts) {
      if (forecast.dateString === targetDateString) {
        console.log(`✅ PLAN: EXACT MATCH FOUND for ${cityName} on ${targetDateString}:`, {
          matchedDate: forecast.dateString,
          temperature: forecast.temperature,
          description: forecast.description,
          planImplementation: true
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
    
    console.log(`⚠️ PLAN: No exact match for ${cityName} on ${targetDateString}`, {
      availableDates: forecasts.map(f => f.dateString).filter(Boolean),
      planImplementation: true
    });
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
        
        console.log(`🔍 PLAN: Evaluating closest match candidate for ${cityName}:`, {
          forecastDate: forecast.dateString,
          offsetHours: offsetHours.toFixed(1),
          dayOffset,
          currentBest: smallestOffsetHours.toFixed(1),
          planImplementation: true
        });
        
        // PLAN IMPLEMENTATION: More lenient - consider forecasts within 72 hours
        if (offsetHours <= 72 && offsetHours < smallestOffsetHours) {
          closestForecast = forecast;
          smallestOffsetHours = offsetHours;
          actualDayOffset = dayOffset;
          
          console.log(`🎯 PLAN: New closest match candidate for ${cityName}:`, {
            forecastDate: forecast.dateString,
            offsetHours: offsetHours.toFixed(1),
            dayOffset,
            planImplementation: true
          });
        }
      } catch (error) {
        console.warn(`⚠️ PLAN: Error processing forecast date for ${cityName}:`, forecast.dateString, error);
      }
    }
    
    if (closestForecast) {
      console.log(`📍 PLAN: CLOSEST MATCH FOUND for ${cityName}: ${targetDateString} → ${closestForecast.dateString} (${smallestOffsetHours.toFixed(1)}h offset)`, {
        planImplementation: true
      });
      
      return {
        matchedForecast: closestForecast,
        matchInfo: {
          requestedDate: targetDateString,
          matchedDate: closestForecast.dateString,
          matchType: 'closest',
          daysOffset: actualDayOffset,
          hoursOffset: smallestOffsetHours,
          confidence: smallestOffsetHours <= 24 ? 'high' : smallestOffsetHours <= 48 ? 'medium' : 'low',
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
    // PLAN IMPLEMENTATION: Try ±3 days from target (more lenient)
    const testDates = [];
    for (let i = -3; i <= 3; i++) {
      if (i === 0) continue; // Skip exact match (already tried)
      const testDate = new Date(targetDate.getTime() + i * 24 * 60 * 60 * 1000);
      const testDateString = DateNormalizationService.toDateString(testDate);
      testDates.push({ offset: i, dateString: testDateString });
    }
    
    console.log(`🔍 PLAN: Testing adjacent dates for ${cityName}:`, {
      targetDateString,
      testDates: testDates.map(d => `${d.dateString} (${d.offset > 0 ? '+' : ''}${d.offset})`),
      planImplementation: true
    });
    
    for (const testDate of testDates) {
      for (const forecast of forecasts) {
        if (forecast.dateString === testDate.dateString) {
          console.log(`📅 PLAN: ADJACENT MATCH FOUND for ${cityName}: ${targetDateString} → ${testDate.dateString} (${testDate.offset > 0 ? '+' : ''}${testDate.offset} day${Math.abs(testDate.offset) > 1 ? 's' : ''})`, {
            planImplementation: true
          });
          
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
    // PLAN IMPLEMENTATION: Use the first valid forecast as fallback
    const firstValidForecast = forecasts.find(f => f.dateString && f.temperature);
    
    if (firstValidForecast) {
      console.log(`🔄 PLAN: FALLBACK MATCH for ${cityName}: ${targetDateString} → ${firstValidForecast.dateString} (using best available)`, {
        planImplementation: true
      });
      
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
    console.log(`❌ PLAN: Creating NO MATCH result`, {
      targetDateString,
      availableDates,
      planImplementation: true
    });
    
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
