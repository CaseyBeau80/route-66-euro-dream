
import { useMemo } from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { SegmentStabilizer } from '../utils/segmentStabilizer';

/**
 * Hook to provide stable segment references that only change when content actually changes
 */
export const useStableSegments = (segments: DailySegment[]): DailySegment[] => {
  return useMemo(() => {
    if (!Array.isArray(segments)) {
      console.warn('⚠️ useStableSegments: segments is not an array', segments);
      return [];
    }
    
    console.log(`🔧 useStableSegments: Processing ${segments.length} segments`);
    console.log(`🔧 useStableSegments: Raw input segments:`, segments.map(s => ({ 
      day: s.day, 
      endCity: s.endCity, 
      startCity: s.startCity,
      hasEndCity: !!s.endCity,
      hasStartCity: !!s.startCity 
    })));
    
    const stabilizedSegments = segments.map((segment, index) => {
      console.log(`🔧 useStableSegments: Stabilizing segment ${index + 1}:`, {
        day: segment.day,
        endCity: segment.endCity,
        startCity: segment.startCity,
        isValid: !!(segment.day && segment.endCity && segment.startCity)
      });
      
      return SegmentStabilizer.stabilize(segment);
    });
    
    console.log(`🔧 useStableSegments: Final stabilized segments:`, stabilizedSegments.map(s => ({
      day: s.day,
      endCity: s.endCity,
      startCity: s.startCity
    })));
    
    // Check for any segments that got filtered out
    if (stabilizedSegments.length !== segments.length) {
      console.error('❌ useStableSegments: Segments were lost during stabilization!', {
        originalCount: segments.length,
        stabilizedCount: stabilizedSegments.length,
        originalSegments: segments.map(s => ({ day: s.day, endCity: s.endCity })),
        stabilizedSegments: stabilizedSegments.map(s => ({ day: s.day, endCity: s.endCity }))
      });
    }
    
    return stabilizedSegments;
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
