
import { TripStop } from '../../../types/TripStop';
import { DailySegment } from '../../../services/planning/TripPlanBuilder';

// Type guard for validating stop data with better TypeScript support
export const isValidStopData = (stop: any): stop is (string | { name: string; [key: string]: any }) => {
  if (typeof stop === 'string') {
    return stop.trim() !== '';
  }
  return stop != null && 
         typeof stop === 'object' && 
         'name' in stop && 
         typeof stop.name === 'string' && 
         stop.name.trim() !== '';
};

// Create stable segment key for memoization
export const createStableSegmentKey = (segment: DailySegment): string => {
  // Use only stable, primitive values for the key
  const stableProps = {
    day: segment.day || 0,
    startCity: segment.startCity || '',
    endCity: segment.endCity || '',
    recommendedStopsCount: Array.isArray(segment.recommendedStops) ? segment.recommendedStops.length : 0,
    attractionsCount: Array.isArray(segment.attractions) ? segment.attractions.length : 0
  };
  
  return `seg-${stableProps.day}-${stableProps.startCity}-${stableProps.endCity}-r${stableProps.recommendedStopsCount}-a${stableProps.attractionsCount}`;
};
