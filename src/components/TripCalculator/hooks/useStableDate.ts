
import { useMemo } from 'react';
import { addDays } from 'date-fns';

/**
 * Hook to provide stable date calculations that only change when inputs actually change
 */
export const useStableDate = (baseDate: Date | undefined, dayOffset: number): Date | null => {
  return useMemo(() => {
    if (!baseDate || typeof dayOffset !== 'number' || isNaN(dayOffset)) {
      return null;
    }
    
    try {
      return addDays(baseDate, dayOffset - 1);
    } catch (error) {
      console.error('❌ useStableDate: Error calculating date:', error);
      return null;
    }
  }, [baseDate, dayOffset]);
};
