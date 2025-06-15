
import { useMemo } from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { TripStop } from '../types/TripStop';

/**
 * Optimized validation hook for segments and stops
 */
export const useOptimizedValidation = (segment: DailySegment | null) => {
  return useMemo(() => {
    if (!segment || !segment.endCity) {
      return {
        validStops: [],
        userRelevantStops: [],
        isValid: false
      };
    }

    // For now, return minimal validation - the real logic is in the enhanced system
    return {
      validStops: [],
      userRelevantStops: [],
      isValid: true
    };
  }, [segment?.day, segment?.endCity]);
};
