
/**
 * Centralized date normalization service for weather modules
 * Ensures consistent date handling across all weather components
 * CRITICAL FIX: Absolute UTC normalization with NO OFFSET for historical data
 */

export interface NormalizedSegmentDate {
  segmentDate: Date;
  segmentDateString: string; // YYYY-MM-DD format
  daysFromNow: number;
  isWithinForecastRange: boolean;
  season: 'Spring' | 'Summer' | 'Fall' | 'Winter';
  seasonEmoji: string;
}

export class DateNormalizationService {
  /**
   * CRITICAL FIX: Normalize segment date using UTC to prevent timezone drift
   * This is the SINGLE SOURCE OF TRUTH for date normalization
   */
  static normalizeSegmentDate(date: Date): Date {
    // Create a new date in UTC timezone with only year/month/day to prevent drift
    const normalized = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    
    console.log('🗓️ DateNormalizationService: UTC normalization:', {
      input: date.toISOString(),
      normalized: normalized.toISOString(),
      inputDateString: this.toDateString(date),
      normalizedDateString: this.toDateString(normalized),
      preventsDrift: true
    });
    
    return normalized;
  }

  /**
   * Enhanced segment date calculation with absolute validation
   * CRITICAL FIX: Prevents any date drift through multiple calculations
   */
  static calculateSegmentDate(
    tripStartDate: Date | string | null | undefined,
    segmentDay: number
  ): Date | null {
    console.log('🗓️ DateNormalizationService: calculateSegmentDate input:', {
      tripStartDate,
      segmentDay,
      tripStartDateType: typeof tripStartDate
    });

    if (!tripStartDate || typeof segmentDay !== 'number' || segmentDay <= 0) {
      console.error('❌ DateNormalizationService: Invalid input parameters', {
        tripStartDate,
        segmentDay,
        hasStartDate: !!tripStartDate,
        segmentDayValid: typeof segmentDay === 'number' && segmentDay > 0
      });
      return null;
    }

    try {
      let validStartDate: Date;
      
      if (tripStartDate instanceof Date) {
        if (isNaN(tripStartDate.getTime())) {
          console.error('❌ DateNormalizationService: Invalid Date object', tripStartDate);
          return null;
        }
        validStartDate = new Date(tripStartDate);
      } else if (typeof tripStartDate === 'string') {
        validStartDate = new Date(tripStartDate);
        if (isNaN(validStartDate.getTime())) {
          console.error('❌ DateNormalizationService: Invalid date string', tripStartDate);
          return null;
        }
      } else {
        console.error('❌ DateNormalizationService: Invalid tripStartDate type', { tripStartDate, type: typeof tripStartDate });
        return null;
      }
      
      // CRITICAL FIX: First normalize the start date to prevent any initial drift
      const normalizedStartDate = this.normalizeSegmentDate(validStartDate);
      
      // Calculate segment date (day 1 = start date, day 2 = start date + 1, etc.)
      // Use UTC methods to prevent timezone issues during calculation
      const segmentDate = new Date(normalizedStartDate.getTime() + (segmentDay - 1) * 24 * 60 * 60 * 1000);
      
      if (isNaN(segmentDate.getTime())) {
        console.error('❌ DateNormalizationService: Calculated date is invalid', { 
          normalizedStartDate: normalizedStartDate.toISOString(), 
          segmentDay, 
          segmentDate 
        });
        return null;
      }

      // CRITICAL FIX: Normalize the final result to ensure absolute UTC alignment
      const finalNormalizedDate = this.normalizeSegmentDate(segmentDate);
      
      console.log('✅ DateNormalizationService: Successfully calculated segment date:', {
        segmentDay,
        originalStartDate: validStartDate.toISOString(),
        normalizedStartDate: normalizedStartDate.toISOString(),
        calculatedSegmentDate: finalNormalizedDate.toISOString(),
        segmentDateString: this.toDateString(finalNormalizedDate),
        absoluteUTCAlignment: true
      });
      
      return finalNormalizedDate;
      
    } catch (error) {
      console.error('❌ DateNormalizationService: Error calculating segment date:', error, { tripStartDate, segmentDay });
      return null;
    }
  }

  /**
   * Convert Date to normalized YYYY-MM-DD string (UTC)
   * CRITICAL FIX: Uses UTC methods to prevent timezone drift
   */
  static toDateString(date: Date): string {
    // Use UTC methods to prevent timezone issues
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

  /**
   * Get season information for a date using UTC
   */
  private static getSeasonInfo(date: Date): { season: 'Spring' | 'Summer' | 'Fall' | 'Winter'; seasonEmoji: string } {
    const month = date.getUTCMonth(); // Use UTC to prevent timezone issues
    
    if (month >= 2 && month <= 4) {
      return { season: 'Spring', seasonEmoji: '🌸' };
    } else if (month >= 5 && month <= 7) {
      return { season: 'Summer', seasonEmoji: '☀️' };
    } else if (month >= 8 && month <= 10) {
      return { season: 'Fall', seasonEmoji: '🍂' };
    } else {
      return { season: 'Winter', seasonEmoji: '❄️' };
    }
  }

  /**
   * Check if two dates represent the same calendar day using UTC
   */
  static isSameDay(date1: Date, date2: Date): boolean {
    return this.toDateString(date1) === this.toDateString(date2);
  }

  /**
   * Validate that a weather date matches the expected segment date
   * CRITICAL FIX: No offset validation - dates must match exactly
   */
  static validateWeatherDateMatch(
    weatherDate: Date,
    expectedSegmentDate: Date,
    cityName: string
  ): boolean {
    const weatherDateString = this.toDateString(weatherDate);
    const expectedDateString = this.toDateString(expectedSegmentDate);
    const isMatch = weatherDateString === expectedDateString;
    
    if (!isMatch) {
      console.warn(`⚠️ Weather date mismatch for ${cityName}:`, {
        expected: expectedDateString,
        weather: weatherDateString,
        exactMatchRequired: true
      });
    }
    
    return isMatch;
  }
}
