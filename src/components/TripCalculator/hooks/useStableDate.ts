
import { useMemo } from 'react';
import { DateNormalizationService } from '../components/weather/DateNormalizationService';

/**
 * CRITICAL FIX: Hook to provide stable date calculations using centralized date logic
 * Ensures absolute consistency with all other date calculations in the app
 */
export const useStableDate = (baseDate: Date | undefined, dayOffset: number): Date | null => {
  return useMemo(() => {
    console.log('📅 CRITICAL FIX: useStableDate - FINAL FIXED VERSION:', {
      baseDate: baseDate?.toISOString(),
      baseDateLocal: baseDate?.toLocaleDateString(),
      dayOffset,
      fixedCalculation: true
    });

    // Validate inputs
    if (!baseDate || typeof dayOffset !== 'number' || isNaN(dayOffset)) {
      console.log('📅 CRITICAL FIX: useStableDate invalid inputs:', { 
        baseDate, 
        dayOffset, 
        baseDateType: typeof baseDate,
        dayOffsetType: typeof dayOffset
      });
      return null;
    }
    
    try {
      // Validate baseDate is a valid Date object
      if (!(baseDate instanceof Date) || isNaN(baseDate.getTime())) {
        console.error('❌ CRITICAL FIX: useStableDate Invalid Date object:', { 
          baseDate, 
          type: typeof baseDate,
          isDate: baseDate instanceof Date,
          isValid: baseDate instanceof Date ? !isNaN(baseDate.getTime()) : false
        });
        return null;
      }
      
      // Validate dayOffset
      if (!Number.isInteger(dayOffset) || dayOffset < 1) {
        console.error('❌ CRITICAL FIX: useStableDate Invalid dayOffset (must be >= 1):', { 
          dayOffset, 
          type: typeof dayOffset,
          isInteger: Number.isInteger(dayOffset)
        });
        return null;
      }
      
      // CRITICAL FIX: Use the centralized date calculation service
      const resultDate = DateNormalizationService.calculateSegmentDate(baseDate, dayOffset);
      
      // Final validation of result
      if (isNaN(resultDate.getTime())) {
        console.error('❌ CRITICAL FIX: useStableDate calculated invalid date:', {
          baseDate: baseDate.toISOString(),
          dayOffset,
          resultDate,
          resultTime: resultDate.getTime()
        });
        return null;
      }
      
      console.log('📅 CRITICAL FIX: useStableDate SUCCESS:', {
        baseDate: baseDate.toISOString(),
        baseDateLocal: baseDate.toLocaleDateString(),
        dayOffset,
        resultDate: resultDate.toISOString(),
        resultDateLocal: resultDate.toLocaleDateString(),
        day1Verification: dayOffset === 1 ? {
          baseDateString: baseDate.toDateString(),
          resultDateString: resultDate.toDateString(),
          matches: baseDate.toDateString() === resultDate.toDateString(),
          perfectMatch: 'DAY_1_EQUALS_BASE_DATE_EXACTLY'
        } : null,
        fixedCalculation: 'USING_CONSISTENT_LOGIC'
      });
      
      return resultDate;
      
    } catch (error) {
      console.error('❌ CRITICAL FIX: useStableDate error:', error, { 
        baseDate, 
        dayOffset
      });
      return null;
    }
  }, [baseDate, dayOffset]);
};
