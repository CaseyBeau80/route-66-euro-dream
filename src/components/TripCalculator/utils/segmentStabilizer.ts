
import { DailySegment } from '../services/planning/TripPlanBuilder';

/**
 * Type guard to check if an item has a name property
 */
const hasNameProperty = (item: any): item is { name: string } => {
  return item && typeof item === 'object' && 'name' in item && typeof item.name === 'string';
};

/**
 * Creates a stable hash from segment data to detect actual changes
 */
export const createSegmentHash = (segment: DailySegment): string => {
  const hashableData = {
    day: segment.day,
    startCity: segment.startCity || '',
    endCity: segment.endCity || '',
    distance: segment.distance || 0,
    driveTimeHours: segment.driveTimeHours || 0,
    recommendedStopsCount: Array.isArray(segment.recommendedStops) ? segment.recommendedStops.length : 0,
    attractionsCount: Array.isArray(segment.attractions) ? segment.attractions.length : 0,
    // Include stop names for change detection - recommendedStops can be objects with name property
    stopNames: Array.isArray(segment.recommendedStops) 
      ? segment.recommendedStops.map(stop => 
          typeof stop === 'string' ? stop : (hasNameProperty(stop) ? stop.name : '')
        ).sort().join('|')
      : '',
    // attractions is always string[] according to DailySegment interface
    attractionNames: Array.isArray(segment.attractions)
      ? segment.attractions.sort().join('|')
      : ''
  };
  
  return JSON.stringify(hashableData);
};

/**
 * Stabilizes segment objects by creating new references only when content actually changes
 */
export class SegmentStabilizer {
  private static cache = new Map<string, { hash: string; segment: DailySegment }>();
  
  static stabilize(segment: DailySegment): DailySegment {
    if (!segment || typeof segment !== 'object') {
      console.warn('⚠️ SegmentStabilizer: Invalid segment provided');
      return segment;
    }
    
    const segmentKey = `day-${segment.day}-${segment.startCity}-${segment.endCity}`;
    const currentHash = createSegmentHash(segment);
    const cached = this.cache.get(segmentKey);
    
    // Return cached segment if hash hasn't changed
    if (cached && cached.hash === currentHash) {
      console.log(`♻️ SegmentStabilizer: Using cached segment for ${segmentKey}`);
      return cached.segment;
    }
    
    // Create frozen copy to prevent mutations
    const stabilizedSegment = Object.freeze({ ...segment });
    
    // Cache the new segment
    this.cache.set(segmentKey, {
      hash: currentHash,
      segment: stabilizedSegment
    });
    
    console.log(`🔄 SegmentStabilizer: Created new stable segment for ${segmentKey}`);
    return stabilizedSegment;
  }
  
  static clearCache(): void {
    this.cache.clear();
  }
}
