/**
 * Centralized date normalization service for weather modules
 * Ensures consistent date handling across all weather components
 * CRITICAL FIX: Simplified date normalization to prevent timezone drift
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
   * CRITICAL FIX: Simplified normalize segment date to prevent timezone drift
   * Creates a clean date object without timezone interference
   */
  static normalizeSegmentDate(date: Date): Date {
    // FIXED: Create a new date using the original date's components directly
    // This prevents timezone conversion issues that were causing date drift
    const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    console.log('🗓️ DateNormalizationService: FIXED normalization (no timezone drift):', {
      input: date.toISOString(),
      inputLocalDate: date.toDateString(),
      normalized: normalized.toISOString(),
      normalizedLocalDate: normalized.toDateString(),
      inputDateString: this.toDateString(date),
      normalizedDateString: this.toDateString(normalized),
      noTimezoneShift: true
    });
    
    return normalized;
  }

  /**
   * CRITICAL FIX: Enhanced segment date calculation with no timezone drift
   * Ensures Day 1 = start date, Day 2 = start date + 1 day, etc.
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
      
      // CRITICAL FIX: Use the original date components directly to prevent timezone drift
      const normalizedStartDate = new Date(validStartDate.getFullYear(), validStartDate.getMonth(), validStartDate.getDate());
      
      // FIXED CALCULATION: Day 1 = start date (no offset), Day 2 = start date + 1, etc.
      const daysToAdd = segmentDay - 1; // Day 1 gets 0 days added, Day 2 gets 1 day added, etc.
      
      // CRITICAL FIX: Create segment date by adding days to the normalized start date
      const segmentDate = new Date(normalizedStartDate);
      segmentDate.setDate(normalizedStartDate.getDate() + daysToAdd);
      
      if (isNaN(segmentDate.getTime())) {
        console.error('❌ DateNormalizationService: Calculated date is invalid', { 
          normalizedStartDate: normalizedStartDate.toISOString(), 
          segmentDay, 
          daysToAdd,
          segmentDate 
        });
        return null;
      }
      
      console.log('✅ DateNormalizationService: Successfully calculated segment date (FIXED):', {
        segmentDay,
        daysToAdd,
        originalStartDate: validStartDate.toISOString(),
        originalStartDateString: validStartDate.toDateString(),
        normalizedStartDate: normalizedStartDate.toISOString(),
        normalizedStartDateString: normalizedStartDate.toDateString(),
        calculatedSegmentDate: segmentDate.toISOString(),
        calculatedSegmentDateString: segmentDate.toDateString(),
        segmentDateString: this.toDateString(segmentDate),
        calculation: `Day ${segmentDay} = start date + ${daysToAdd} days`,
        fixedTimezoneIssue: true
      });
      
      return segmentDate;
      
    } catch (error) {
      console.error('❌ DateNormalizationService: Error calculating segment date:', error, { tripStartDate, segmentDay });
      return null;
    }
  }

  /**
   * Convert Date to normalized YYYY-MM-DD string using local date components
   * CRITICAL FIX: Use local date methods to prevent timezone issues
   */
  static toDateString(date: Date): string {
    // FIXED: Use local date methods instead of UTC to prevent timezone shifts
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

  /**
   * Enhanced date validation with comprehensive logging
   */
  static validateDateAlignment(
    actualDate: Date,
    expectedDate: Date,
    context: string
  ): boolean {
    const actualDateString = this.toDateString(actualDate);
    const expectedDateString = this.toDateString(expectedDate);
    const isAligned = actualDateString === expectedDateString;
    
    if (!isAligned) {
      console.error(`❌ DATE MISALIGNMENT in ${context}:`, {
        expected: expectedDateString,
        actual: actualDateString,
        expectedISO: expectedDate.toISOString(),
        actualISO: actualDate.toISOString(),
        context
      });
    } else {
      console.log(`✅ DATE ALIGNMENT CONFIRMED in ${context}:`, {
        aligned: expectedDateString,
        context
      });
    }
    
    return isAligned;
  }

  /**
   * Check if two dates represent the same calendar day
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
