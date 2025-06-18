
import { TripStop } from '../../types/TripStop';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { StrictDestinationCityEnforcer } from '../../services/planning/StrictDestinationCityEnforcer';
import { isGeographicallyRelevant } from './validation/geographicValidation';
import { convertStopToTripStop } from './conversion/stopConversion';
import { createFallbackStops } from './data/fallbackStops';
import { isValidStopData, createStableSegmentKey } from './types/stopValidationTypes';

// Re-export commonly used functions for backward compatibility
export { isGeographicallyRelevant, createStableSegmentKey };

// STRICT: Use destination city enforcer for filtering
export const isUserRelevantStop = (stop: TripStop): stop is TripStop => {
  return StrictDestinationCityEnforcer.isDestinationCity(stop);
};

// Get validated stops from multiple possible sources with enhanced validation
export const getValidatedStops = (segment: DailySegment): TripStop[] => {
  const stops: TripStop[] = [];
  const segmentKey = createStableSegmentKey(segment);
  
  console.log(`🔍 STRICT VALIDATION: Day ${segment.day}:`, {
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
        
        console.log(`🎯 STRICT: Stop ${index + 1} validation:`, {
          stop: stop,
          isValid,
          name: isValid ? (typeof stop === 'string' ? stop : (stop as any)?.name || 'unknown') : 'invalid',
          category: typeof stop === 'object' && stop && 'category' in stop ? (stop as any).category : 'unknown'
        });
        
        return isValid;
      })
      .map((stop, index) => convertStopToTripStop(stop, index, 'recommended', segmentKey))
      .filter((stop: TripStop): stop is TripStop => {
        // STRICT: Only allow destination cities for overnight stops
        const isDestCity = StrictDestinationCityEnforcer.isDestinationCity(stop);
        if (!isDestCity) {
          console.log(`🚫 STRICT: Filtered out non-destination city: ${stop.name} (${stop.category})`);
        }
        return isDestCity;
      });
    
    console.log(`✅ STRICT: Valid destination city stops: ${validRecommendedStops.length}`);
    stops.push(...validRecommendedStops);
  }
  
  // Fallback: attractions array (for backward compatibility) - but still apply strict filtering
  if (stops.length === 0 && segment.attractions && Array.isArray(segment.attractions)) {
    console.log(`🔄 STRICT: Falling back to attractions array:`, segment.attractions);
    
    const attractionStops = segment.attractions
      .filter((attraction, index) => {
        const isValid = isValidStopData(attraction);
        
        console.log(`🎯 STRICT: Attraction ${index + 1} validation:`, {
          attraction,
          isValid,
          type: typeof attraction
        });
        
        return isValid;
      })
      .map((attraction, index) => convertStopToTripStop(attraction, index, 'attraction', segmentKey))
      .filter((stop: TripStop): stop is TripStop => {
        // STRICT: For attractions, we can be less strict but still prefer destination cities
        const isDestCity = StrictDestinationCityEnforcer.isDestinationCity(stop);
        if (isDestCity) {
          console.log(`🏛️ STRICT: Keeping destination city attraction: ${stop.name}`);
          return true;
        } else {
          // For now, allow non-destination attractions but log them
          console.log(`📍 STRICT: Allowing non-destination attraction: ${stop.name} (${stop.category})`);
          return true;
        }
      });
    
    console.log(`✅ STRICT: Valid attraction stops: ${attractionStops.length}`);
    stops.push(...attractionStops);
  }
  
  // FALLBACK: If still no stops, create synthetic ones based on known Route 66 attractions
  if (stops.length === 0) {
    console.log(`🚨 STRICT: NO STOPS FOUND - Creating fallback stops for ${segment.startCity} → ${segment.endCity}`);
    
    const fallbackStops = createFallbackStops(segment, segmentKey);
    console.log(`🔄 STRICT: Created ${fallbackStops.length} fallback stops:`, fallbackStops.map(s => s.name));
    stops.push(...fallbackStops);
  }
  
  // Remove duplicates based on name
  const uniqueStops = stops.filter((stop, index, self) => 
    index === self.findIndex(s => s.name.toLowerCase() === stop.name.toLowerCase())
  );
  
  console.log(`🎯 STRICT: Final unique stops: ${uniqueStops.length}`, uniqueStops.map(s => `${s.name} (${s.category})`));
  
  return uniqueStops;
};

// New function to validate all stops in a trip plan are destination cities
export const validateTripPlanDestinationCities = (segments: DailySegment[]): { isValid: boolean; violations: string[] } => {
  console.log(`🛡️ STRICT: Validating trip plan with ${segments.length} segments for destination city compliance`);
  
  return StrictDestinationCityEnforcer.validateTripPlan(segments);
};

// New function to sanitize trip plan to remove non-destination cities
export const sanitizeTripPlanToDestinationCities = (segments: DailySegment[]): DailySegment[] => {
  console.log(`🧹 STRICT: Sanitizing trip plan to only include destination cities`);
  
  return StrictDestinationCityEnforcer.sanitizeTripPlan(segments);
};
