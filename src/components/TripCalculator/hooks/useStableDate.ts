
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
      // Ensure baseDate is actually a valid Date object
      let validDate: Date;
      
      if (baseDate instanceof Date) {
        // Check if it's a valid date
        if (isNaN(baseDate.getTime())) {
          console.error('❌ useStableDate: Invalid Date object provided', { 
            baseDate, 
            getTime: 'NaN',
            toString: baseDate.toString()
          });
          return null;
        }
        validDate = baseDate;
      } else {
        // Handle non-Date types (shouldn't happen with our type signature, but for safety)
        console.error('❌ useStableDate: baseDate is not a Date instance', { 
          baseDate, 
          type: typeof baseDate,
          constructorName: baseDate?.constructor?.name || 'unknown'
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
      
      const resultDate = addDays(validDate, dayOffset - 1);
      
      // Final validation of result
      if (isNaN(resultDate.getTime())) {
        console.error('❌ useStableDate: Calculated date is invalid', {
          validDate: validDate.toISOString(),
          dayOffset,
          resultDate,
          resultTime: resultDate.getTime()
        });
        return null;
      }
      
      console.log('🗓️ useStableDate: Successfully calculated date', {
        baseDate: validDate.toISOString(),
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
