
import { useMemo } from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';

/**
 * Hook to create stable segment references to prevent unnecessary re-renders
 */
export const useStableSegment = (segment: DailySegment) => {
  return useMemo(() => {
    if (!segment) return null;
    
    return {
      day: segment.day,
      startCity: segment.startCity,
      endCity: segment.endCity,
      distance: segment.distance,
      driveTimeHours: segment.driveTimeHours,
      driveTimeCategory: segment.driveTimeCategory,
      destination: segment.destination
    };
  }, [
    segment?.day,
    segment?.startCity,
    segment?.endCity,
    segment?.distance,
    segment?.driveTimeHours,
    segment?.driveTimeCategory?.category,
    segment?.destination?.name
  ]);
};

/**
 * Hook to create stable segment array references
 */
export const useStableSegments = (segments: DailySegment[]) => {
  return useMemo(() => {
    return segments.map(segment => ({
      day: segment.day,
      startCity: segment.startCity,
      endCity: segment.endCity,
      distance: segment.distance,
      driveTimeHours: segment.driveTimeHours,
      driveTimeCategory: segment.driveTimeCategory,
      destination: segment.destination
    }));
  }, [segments]);
};
