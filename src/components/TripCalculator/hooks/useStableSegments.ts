
import { useMemo } from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { SegmentStabilizer } from '../utils/segmentStabilizer';

/**
 * Hook to provide stable segment references that only change when content actually changes
 */
export const useStableSegments = (segments: DailySegment[]): DailySegment[] => {
  return useMemo(() => {
    if (!Array.isArray(segments)) {
      console.warn('⚠️ useStableSegments: segments is not an array');
      return [];
    }
    
    console.log(`🔧 useStableSegments: Stabilizing ${segments.length} segments`);
    
    return segments.map(segment => SegmentStabilizer.stabilize(segment));
  }, [segments]);
};

/**
 * Hook to provide a single stable segment reference
 */
export const useStableSegment = (segment: DailySegment): DailySegment => {
  return useMemo(() => {
    if (!segment) {
      console.warn('⚠️ useStableSegment: segment is null/undefined');
      return segment;
    }
    
    return SegmentStabilizer.stabilize(segment);
  }, [segment]);
};
