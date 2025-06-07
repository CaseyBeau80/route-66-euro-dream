
import { TripStop, convertToTripStop } from '../../../types/TripStop';
import { DeterministicIdGenerator } from '../../../utils/deterministicId';

// Safe conversion helper with DETERMINISTIC ID generation
export const convertStopToTripStop = (
  stop: string | { name: string; [key: string]: any }, 
  index: number, 
  fallbackCategory: string,
  segmentKey?: string
): TripStop => {
  if (typeof stop === 'string') {
    // Generate deterministic ID based on stop name, index, category, and segment
    const deterministicId = DeterministicIdGenerator.generateId(
      fallbackCategory, 
      stop, 
      index, 
      segmentKey || 'unknown'
    );
    
    return convertToTripStop({
      name: stop,
      id: deterministicId,
      description: `Discover ${stop} along your Route 66 journey`,
      category: 'attraction',
      city_name: 'Unknown',
      city: 'Unknown', // Add city property
      state: 'Unknown',
      latitude: 0,
      longitude: 0
    });
  } else {
    // Generate deterministic ID for object stops
    const deterministicId = stop.id || DeterministicIdGenerator.generateId(
      fallbackCategory,
      stop.name,
      index,
      segmentKey || 'unknown'
    );
    
    // Manually copy properties to avoid TypeScript spread issues
    const baseStop = {
      name: stop.name,
      id: deterministicId,
      description: stop.description || `Discover ${stop.name} along your Route 66 journey`,
      category: stop.category || 'attraction',
      city_name: stop.city_name || 'Unknown',
      city: stop.city || stop.city_name || 'Unknown', // Add city property
      state: stop.state || 'Unknown',
      latitude: stop.latitude || 0,
      longitude: stop.longitude || 0,
      image_url: stop.image_url,
      is_major_stop: stop.is_major_stop,
      is_official_destination: stop.is_official_destination
    };
    return convertToTripStop(baseStop);
  }
};
