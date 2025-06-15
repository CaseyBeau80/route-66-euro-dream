
import { useMemo } from 'react';
import { DateNormalizationService } from '../components/weather/DateNormalizationService';

/**
 * CRITICAL FIX: Hook to provide stable date calculations using centralized date logic
 * Ensures absolute consistency with all other date calculations in the app
 */
export const useStableDate = (baseDate: Date | undefined, dayOffset: number): Date | null => {
  return useMemo(() => {
    console.log('🗓️ CRITICAL FIX: useStableDate called with comprehensive validation:', {
      baseDate: baseDate?.toISOString(),
      baseDateLocal: baseDate?.toLocaleDateString(),
      baseDateComponents: baseDate ? {
        year: baseDate.getFullYear(),
        month: baseDate.getMonth(),
        date: baseDate.getDate(),
        hours: baseDate.getHours(),
        minutes: baseDate.getMinutes(),
        seconds: baseDate.getSeconds()
      } : null,
      dayOffset,
      dayOffsetType: typeof dayOffset,
      isBaseDateValid: baseDate instanceof Date && !isNaN(baseDate.getTime()),
      isDayOffsetValid: typeof dayOffset === 'number' && !isNaN(dayOffset),
      usingCentralizedLogic: true
    });

    // Validate inputs more thoroughly
    if (!baseDate || typeof dayOffset !== 'number' || isNaN(dayOffset)) {
      console.log('🗓️ CRITICAL FIX: useStableDate invalid inputs detected:', { 
        baseDate, 
        dayOffset, 
        baseDateType: typeof baseDate,
        isBaseDateInstance: baseDate instanceof Date,
        baseDateValid: baseDate instanceof Date ? !isNaN(baseDate.getTime()) : false,
        dayOffsetType: typeof dayOffset,
        dayOffsetValid: typeof dayOffset === 'number' && !isNaN(dayOffset)
      });
      return null;
    }
    
    try {
      // At this point, baseDate is truthy, so check if it's a valid Date object
      if (!(baseDate instanceof Date)) {
        console.error('❌ CRITICAL FIX: useStableDate baseDate is not a Date instance', { 
          baseDate, 
          type: typeof baseDate
        });
        return null;
      }
      
      // Check if it's a valid date
      if (isNaN(baseDate.getTime())) {
        console.error('❌ CRITICAL FIX: useStableDate Invalid Date object provided', { 
          baseDate, 
          getTime: 'NaN',
          toString: baseDate.toString()
        });
        return null;
      }
      
      // Validate dayOffset
      if (!Number.isInteger(dayOffset) || dayOffset < 1) {
        console.error('❌ CRITICAL FIX: useStableDate Invalid dayOffset (must be >= 1)', { 
          dayOffset, 
          type: typeof dayOffset,
          isInteger: Number.isInteger(dayOffset)
        });
        return null;
      }
      
      // CRITICAL FIX: Use the centralized date calculation service for absolute consistency
      const resultDate = DateNormalizationService.calculateSegmentDate(baseDate, dayOffset);
      
      // Final validation of result
      if (isNaN(resultDate.getTime())) {
        console.error('❌ CRITICAL FIX: useStableDate calculated date is invalid', {
          baseDate: baseDate.toISOString(),
          dayOffset,
          resultDate,
          resultTime: resultDate.getTime()
        });
        return null;
      }
      
      console.log('🗓️ CRITICAL FIX: useStableDate successfully calculated date using centralized logic:', {
        baseDate: baseDate.toISOString(),
        baseDateLocal: baseDate.toLocaleDateString(),
        dayOffset,
        resultDate: resultDate.toISOString(),
        resultDateLocal: resultDate.toLocaleDateString(),
        resultComponents: {
          year: resultDate.getFullYear(),
          month: resultDate.getMonth(),
          date: resultDate.getDate()
        },
        day1Verification: dayOffset === 1 ? {
          baseDateString: baseDate.toDateString(),
          resultDateString: resultDate.toDateString(),
          matches: baseDate.toDateString() === resultDate.toDateString(),
          perfectMatch: 'DAY_1_EQUALS_BASE_DATE_EXACTLY'
        } : null,
        usingCentralizedService: 'DateNormalizationService.calculateSegmentDate'
      });
      
      return resultDate;
      
    } catch (error) {
      console.error('❌ CRITICAL FIX: useStableDate error calculating date:', error, { 
        baseDate, 
        dayOffset,
        baseDateType: typeof baseDate
      });
      return null;
    }
  }, [baseDate, dayOffset]);
};
