
import { useMemo } from 'react';
import { addDays } from 'date-fns';

/**
 * Hook to provide stable date calculations that only change when inputs actually change
 */
export const useStableDate = (baseDate: Date | undefined, dayOffset: number): Date | null => {
  return useMemo(() => {
    // Validate inputs more thoroughly
    if (!baseDate || typeof dayOffset !== 'number' || isNaN(dayOffset)) {
      console.log('🗓️ useStableDate: Invalid inputs', { 
        baseDate, 
        dayOffset, 
        baseDateType: typeof baseDate,
        isBaseDateInstance: baseDate instanceof Date,
        baseDateValid: baseDate instanceof Date ? !isNaN(baseDate.getTime()) : false
      });
      return null;
    }
    
    try {
      // At this point, baseDate is truthy, so check if it's a valid Date object
      if (!(baseDate instanceof Date)) {
        console.error('❌ useStableDate: baseDate is not a Date instance', { 
          baseDate, 
          type: typeof baseDate
        });
        return null;
      }
      
      // Check if it's a valid date
      if (isNaN(baseDate.getTime())) {
        console.error('❌ useStableDate: Invalid Date object provided', { 
          baseDate, 
          getTime: 'NaN',
          toString: baseDate.toString()
        });
        return null;
      }
      
      // Validate dayOffset
      if (!Number.isInteger(dayOffset) || dayOffset < 0) {
        console.error('❌ useStableDate: Invalid dayOffset', { 
          dayOffset, 
          type: typeof dayOffset,
          isInteger: Number.isInteger(dayOffset)
        });
        return null;
      }
      
      const resultDate = addDays(baseDate, dayOffset - 1);
      
      // Final validation of result
      if (isNaN(resultDate.getTime())) {
        console.error('❌ useStableDate: Calculated date is invalid', {
          baseDate: baseDate.toISOString(),
          dayOffset,
          resultDate,
          resultTime: resultDate.getTime()
        });
        return null;
      }
      
      console.log('🗓️ useStableDate: Successfully calculated date', {
        baseDate: baseDate.toISOString(),
        dayOffset,
        resultDate: resultDate.toISOString()
      });
      
      return resultDate;
      
    } catch (error) {
      console.error('❌ useStableDate: Error calculating date:', error, { 
        baseDate, 
        dayOffset,
        baseDateType: typeof baseDate
      });
      return null;
    }
  }, [baseDate, dayOffset]);
};
