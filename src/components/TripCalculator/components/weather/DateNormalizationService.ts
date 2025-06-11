
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
        console.error('❌ DateNormalizationService: Invalid tripStartDate type', { 
          tripStartDate, 
          type: typeof tripStartDate 
        });
        return null;
      }

      // FIXED: Direct date calculation without timezone conversion
      const normalizedStartDate = this.normalizeSegmentDate(validStartDate);
      
      // Calculate segment date: Day 1 = start date, Day 2 = start date + 1, etc.
      const daysToAdd = segmentDay - 1;
      const segmentDate = new Date(
        normalizedStartDate.getFullYear(),
        normalizedStartDate.getMonth(),
        normalizedStartDate.getDate() + daysToAdd
      );

      console.log('🗓️ DateNormalizationService: FIXED segment date calculation:', {
        tripStartDate: validStartDate.toISOString(),
        segmentDay,
        daysToAdd,
        segmentDate: segmentDate.toISOString(),
        segmentDateString: this.toDateString(segmentDate),
        noTimezoneShift: true
      });

      return segmentDate;
    } catch (error) {
      console.error('❌ DateNormalizationService: Error calculating segment date:', error, {
        tripStartDate,
        segmentDay
      });
      return null;
    }
  }

  /**
   * Convert Date to YYYY-MM-DD string format (local date, no timezone conversion)
   */
  static toDateString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Calculate days from now for a given date
   */
  static getDaysFromNow(targetDate: Date): number {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    
    const timeDiff = target.getTime() - today.getTime();
    return Math.ceil(timeDiff / (24 * 60 * 60 * 1000));
  }

  /**
   * Get season information for a date
   */
  static getSeasonInfo(date: Date): { season: 'Spring' | 'Summer' | 'Fall' | 'Winter'; emoji: string } {
    const month = date.getMonth();
    
    if (month >= 2 && month <= 4) return { season: 'Spring', emoji: '🌸' };
    if (month >= 5 && month <= 7) return { season: 'Summer', emoji: '☀️' };
    if (month >= 8 && month <= 10) return { season: 'Fall', emoji: '🍂' };
    return { season: 'Winter', emoji: '❄️' };
  }

  /**
   * Get full normalized segment date information
   */
  static getNormalizedSegmentDate(
    tripStartDate: Date | string | null,
    segmentDay: number
  ): NormalizedSegmentDate | null {
    const segmentDate = this.calculateSegmentDate(tripStartDate, segmentDay);
    if (!segmentDate) return null;

    const daysFromNow = this.getDaysFromNow(segmentDate);
    const seasonInfo = this.getSeasonInfo(segmentDate);

    return {
      segmentDate,
      segmentDateString: this.toDateString(segmentDate),
      daysFromNow,
      isWithinForecastRange: daysFromNow >= 0 && daysFromNow <= 5,
      season: seasonInfo.season,
      seasonEmoji: seasonInfo.emoji
    };
  }

  /**
   * Check if a date is within the weather forecast range (5 days)
   */
  static isWithinForecastRange(date: Date): boolean {
    const daysFromNow = this.getDaysFromNow(date);
    return daysFromNow >= 0 && daysFromNow <= 5;
  }

  /**
   * Format date for display purposes
   */
  static formatDisplayDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
