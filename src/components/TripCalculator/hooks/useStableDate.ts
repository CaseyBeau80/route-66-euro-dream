
import { useMemo } from 'react';
import { addDays } from 'date-fns';

/**
 * Hook to provide stable date calculations that only change when inputs actually change
 */
export const useStableDate = (baseDate: Date | undefined, dayOffset: number): Date | null => {
  return useMemo(() => {
    // Validate inputs
    if (!baseDate || typeof dayOffset !== 'number' || isNaN(dayOffset)) {
      console.log('🗓️ useStableDate: Invalid inputs', { baseDate, dayOffset, type: typeof baseDate });
      return null;
    }
    
    // Ensure baseDate is actually a Date object
    let validDate: Date;
    try {
      if (baseDate instanceof Date) {
        // Check if it's a valid date
        if (isNaN(baseDate.getTime())) {
          console.error('❌ useStableDate: Invalid Date object provided', baseDate);
          return null;
        }
        validDate = baseDate;
      } else if (typeof baseDate === 'string') {
        // Try to parse string date
        validDate = new Date(baseDate);
        if (isNaN(validDate.getTime())) {
          console.error('❌ useStableDate: Invalid date string provided', baseDate);
          return null;
        }
      } else {
        console.error('❌ useStableDate: baseDate is not a Date or string', { baseDate, type: typeof baseDate });
        return null;
      }
      
      console.log('🗓️ useStableDate: Processing valid date', {
        baseDate: validDate.toISOString(),
        dayOffset,
        resultDate: addDays(validDate, dayOffset - 1).toISOString()
      });
      
      return addDays(validDate, dayOffset - 1);
    } catch (error) {
      console.error('❌ useStableDate: Error calculating date:', error, { baseDate, dayOffset });
      return null;
    }
  }, [baseDate, dayOffset]);
};
