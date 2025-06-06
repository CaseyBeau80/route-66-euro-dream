
import { ValidatedStop, isValidStopObject } from '../types/stopTypes';
import { DailySegment } from '../../services/planning/TripPlanBuilder';

// Filter function to exclude route66_waypoint categories from user display
export const isUserRelevantStop = (stop: ValidatedStop): boolean => {
  const userRelevantCategories = [
    'attraction',
    'hidden_gem', 
    'diner',
    'motel',
    'museum',
    'destination_city'
  ];
  
  return userRelevantCategories.includes(stop.category || '');
};

// Get validated stops from multiple possible sources with enhanced validation
export const getValidatedStops = (segment: DailySegment): ValidatedStop[] => {
  const stops: ValidatedStop[] = [];
  
  console.log(`🔍 EnhancedRecommendedStops: Validating stops for Day ${segment.day}:`, {
    recommendedStops: segment.recommendedStops?.length || 0,
    attractions: segment.attractions?.length || 0,
    recommendedStopsData: segment.recommendedStops,
    attractionsData: segment.attractions
  });
  
  // Primary source: recommendedStops array
  if (segment.recommendedStops && Array.isArray(segment.recommendedStops)) {
    const validRecommendedStops = segment.recommendedStops
      .filter((stop, index) => {
        const isValid = isValidStopObject(stop);
        
        console.log(`🎯 Stop ${index + 1} validation:`, {
          stop: stop,
          isValid,
          name: isValid ? stop.name : 'invalid'
        });
        
        return isValid;
      })
      .map((stop, index): ValidatedStop => ({
        id: stop.id || `recommended-${index}-${Math.random()}`,
        name: stop.name,
        category: stop.category || 'attraction',
        city_name: stop.city_name || stop.state,
        state: stop.state
      }));
    
    console.log(`✅ Valid recommended stops: ${validRecommendedStops.length}`, validRecommendedStops.map(s => s.name));
    stops.push(...validRecommendedStops);
  }
  
  // Fallback: attractions array (for backward compatibility)
  if (stops.length === 0 && segment.attractions && Array.isArray(segment.attractions)) {
    console.log(`🔄 Falling back to attractions array:`, segment.attractions);
    
    const attractionStops = segment.attractions
      .filter((attraction, index) => {
        const isValid = attraction != null && 
          (typeof attraction === 'string' ? attraction.trim() !== '' : 
           isValidStopObject(attraction));
        
        console.log(`🎯 Attraction ${index + 1} validation:`, {
          attraction,
          isValid,
          type: typeof attraction
        });
        
        return isValid;
      })
      .map((attraction, index): ValidatedStop => {
        // Handle both string and object attractions explicitly
        if (typeof attraction === 'string') {
          return {
            id: `attraction-${index}-${Math.random()}`,
            name: attraction,
            category: 'attraction',
            city_name: segment.endCity,
            state: segment.destination?.state || 'Unknown'
          };
        } else {
          // TypeScript now knows this is an object with name property due to our filter
          const attractionObj = attraction as { name: string; id?: string; category?: string; city_name?: string; state?: string };
          return {
            id: `attraction-${index}-${Math.random()}`,
            name: attractionObj.name,
            category: 'attraction',
            city_name: segment.endCity,
            state: segment.destination?.state || 'Unknown'
          };
        }
      });
    
    console.log(`✅ Valid attraction stops: ${attractionStops.length}`, attractionStops.map(s => s.name));
    stops.push(...attractionStops);
  }
  
  // Remove duplicates based on name
  const uniqueStops = stops.filter((stop, index, self) => 
    index === self.findIndex(s => s.name.toLowerCase() === stop.name.toLowerCase())
  );
  
  console.log(`🎯 Final unique stops: ${uniqueStops.length}`, uniqueStops.map(s => s.name));
  
  return uniqueStops;
};
