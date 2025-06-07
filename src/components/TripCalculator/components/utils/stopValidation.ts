
import { TripStop } from '../../types/TripStop';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { isUserRelevantStop } from './filters/stopFiltering';
import { isGeographicallyRelevant } from './validation/geographicValidation';
import { convertStopToTripStop } from './conversion/stopConversion';
import { createFallbackStops } from './data/fallbackStops';
import { isValidStopData, createStableSegmentKey } from './types/stopValidationTypes';

// Re-export commonly used functions for backward compatibility
export { isUserRelevantStop, isGeographicallyRelevant, createStableSegmentKey };

// Get validated stops from multiple possible sources with enhanced validation
export const getValidatedStops = (segment: DailySegment): TripStop[] => {
  const stops: TripStop[] = [];
  const segmentKey = createStableSegmentKey(segment);
  
  console.log(`🔍 ENHANCED VALIDATION: Day ${segment.day}:`, {
    recommendedStops: segment.recommendedStops?.length || 0,
    attractions: segment.attractions?.length || 0,
    startCity: segment.startCity,
    endCity: segment.endCity,
    segmentKey
  });
  
  // Primary source: recommendedStops array
  if (segment.recommendedStops && Array.isArray(segment.recommendedStops)) {
    const validRecommendedStops = segment.recommendedStops
      .filter((stop, index) => {
        const isValid = isValidStopData(stop);
        
        console.log(`🎯 Stop ${index + 1} validation:`, {
          stop: stop,
          isValid,
          name: isValid ? (typeof stop === 'string' ? stop : stop.name) : 'invalid',
          category: typeof stop === 'object' && stop && 'category' in stop ? stop.category : 'unknown'
        });
        
        return isValid;
      })
      .map((stop, index) => convertStopToTripStop(stop, index, 'recommended', segmentKey));
    
    console.log(`✅ Valid recommended stops: ${validRecommendedStops.length}`);
    stops.push(...validRecommendedStops);
  }
  
  // Fallback: attractions array (for backward compatibility)
  if (stops.length === 0 && segment.attractions && Array.isArray(segment.attractions)) {
    console.log(`🔄 Falling back to attractions array:`, segment.attractions);
    
    const attractionStops = segment.attractions
      .filter((attraction, index) => {
        const isValid = isValidStopData(attraction);
        
        console.log(`🎯 Attraction ${index + 1} validation:`, {
          attraction,
          isValid,
          type: typeof attraction
        });
        
        return isValid;
      })
      .map((attraction, index) => convertStopToTripStop(attraction, index, 'attraction', segmentKey));
    
    console.log(`✅ Valid attraction stops: ${attractionStops.length}`);
    stops.push(...attractionStops);
  }
  
  // FALLBACK: If still no stops, create synthetic ones based on known Route 66 attractions
  if (stops.length === 0) {
    console.log(`🚨 NO STOPS FOUND - Creating fallback stops for ${segment.startCity} → ${segment.endCity}`);
    
    const fallbackStops = createFallbackStops(segment, segmentKey);
    console.log(`🔄 Created ${fallbackStops.length} fallback stops:`, fallbackStops.map(s => s.name));
    stops.push(...fallbackStops);
  }
  
  // Remove duplicates based on name
  const uniqueStops = stops.filter((stop, index, self) => 
    index === self.findIndex(s => s.name.toLowerCase() === stop.name.toLowerCase())
  );
  
  console.log(`🎯 Final unique stops: ${uniqueStops.length}`, uniqueStops.map(s => `${s.name} (${s.category})`));
  
  return uniqueStops;
};
