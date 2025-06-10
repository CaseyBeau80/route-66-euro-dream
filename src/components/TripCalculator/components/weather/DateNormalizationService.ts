
/**
 * Centralized date normalization service for weather modules
 * Ensures consistent date handling across all weather components
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
   * Centralize normalized segment date using UTC to avoid timezone issues
   */
  static normalizeSegmentDate(date: Date): Date {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  }

  /**
   * Normalize segment date from various input formats
   */
  static normalizeSegmentDateFromTrip(
    tripStartDate: Date | string | null | undefined,
    segmentDay: number
  ): NormalizedSegmentDate | null {
    if (!tripStartDate) {
      console.log('🗓️ DateNormalizationService: No trip start date provided');
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
      
      // Calculate segment date
      const segmentDate = new Date(validStartDate.getTime() + (segmentDay - 1) * 24 * 60 * 60 * 1000);
      
      if (isNaN(segmentDate.getTime())) {
        console.error('❌ DateNormalizationService: Calculated date is invalid', { 
          validStartDate: validStartDate.toISOString(), 
          segmentDay, 
          segmentDate 
        });
        return null;
      }

      // Normalize the segment date using UTC
      const normalizedSegmentDate = this.normalizeSegmentDate(segmentDate);

      // Generate normalized date string (UTC normalized to avoid timezone issues)
      const segmentDateString = this.toDateString(normalizedSegmentDate);
      
      // Calculate days from now
      const now = new Date();
      const daysFromNow = Math.ceil((normalizedSegmentDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
      
      // Check if within forecast range
      const isWithinForecastRange = daysFromNow >= 0 && daysFromNow <= 5;
      
      // Get season info
      const { season, seasonEmoji } = this.getSeasonInfo(normalizedSegmentDate);
      
      const result = {
        segmentDate: normalizedSegmentDate,
        segmentDateString,
        daysFromNow,
        isWithinForecastRange,
        season,
        seasonEmoji
      };
      
      console.log('✅ DateNormalizationService: Normalized date:', {
        segmentDay,
        segmentDateString,
        daysFromNow,
        isWithinForecastRange,
        season
      });
      
      return result;
      
    } catch (error) {
      console.error('❌ DateNormalizationService: Error normalizing date:', error, { tripStartDate, segmentDay });
      return null;
    }
  }

  /**
   * Convert Date to normalized YYYY-MM-DD string (UTC)
   */
  static toDateString(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Get season information for a date
   */
  private static getSeasonInfo(date: Date): { season: 'Spring' | 'Summer' | 'Fall' | 'Winter'; seasonEmoji: string } {
    const month = date.getMonth();
    
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
   * Check if two dates represent the same calendar day
   */
  static isSameDay(date1: Date, date2: Date): boolean {
    return this.toDateString(date1) === this.toDateString(date2);
  }

  /**
   * Validate that a historical weather date matches the expected segment date
   */
  static validateHistoricalDateMatch(
    historicalDate: Date,
    expectedSegmentDate: Date,
    cityName: string
  ): boolean {
    const historicalDateString = this.toDateString(historicalDate);
    const expectedDateString = this.toDateString(expectedSegmentDate);
    const isMatch = historicalDateString === expectedDateString;
    
    if (!isMatch) {
      console.warn(`⚠️ Historical date mismatch for ${cityName}:`, {
        expected: expectedDateString,
        historical: historicalDateString,
        monthDayMatch: historicalDate.getMonth() === expectedSegmentDate.getMonth() && 
                     historicalDate.getDate() === expectedSegmentDate.getDate()
      });
    }
    
    return isMatch;
  }
}
