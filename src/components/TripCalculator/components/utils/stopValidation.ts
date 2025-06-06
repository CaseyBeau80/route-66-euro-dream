
import { ValidatedStop, isValidStopObject } from '../types/stopTypes';
import { DailySegment } from '../../services/planning/TripPlanBuilder';

// EXPANDED filter function to include more user-relevant categories
export const isUserRelevantStop = (stop: ValidatedStop): boolean => {
  const userRelevantCategories = [
    'attraction',
    'hidden_gem', 
    'diner',
    'motel',
    'museum',
    'destination_city',
    'restaurant',
    'lodging',
    'hotel',
    'historic_site',
    'scenic_viewpoint',
    'photo_opportunity',
    'landmark',
    'cultural_site',
    // Add the exact categories we see in the database
    'Museum',
    'Diner',
    'Attraction',
    'Hidden Gem',
    'Restaurant',
    'Motel',
    'Hotel'
  ];
  
  // Make the comparison case-insensitive
  const stopCategory = (stop.category || '').toLowerCase();
  return userRelevantCategories.some(cat => cat.toLowerCase() === stopCategory);
};

// ENHANCED geographic filtering with more generous boundaries
export const isGeographicallyRelevant = (
  stop: ValidatedStop,
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  segmentDistance: number
): boolean => {
  // Only check geographic relevance if coordinates are available
  if (!stop.latitude || !stop.longitude) {
    return true; // Include stops without coordinates by default
  }
  
  const distanceFromStart = Math.sqrt(
    Math.pow(stop.latitude - startLat, 2) + Math.pow(stop.longitude - startLng, 2)
  ) * 69; // Rough miles conversion
  
  const distanceFromEnd = Math.sqrt(
    Math.pow(stop.latitude - endLat, 2) + Math.pow(stop.longitude - endLng, 2)
  ) * 69;
  
  // More generous geographic boundaries
  const maxDetourDistance = Math.max(segmentDistance * 0.5, 150); // At least 150 miles or 50% of segment
  const totalViaStop = distanceFromStart + distanceFromEnd;
  const detour = totalViaStop - segmentDistance;
  
  return detour <= maxDetourDistance && distanceFromStart <= segmentDistance * 1.2;
};

// Get validated stops from multiple possible sources with enhanced validation
export const getValidatedStops = (segment: DailySegment): ValidatedStop[] => {
  const stops: ValidatedStop[] = [];
  
  console.log(`🔍 ENHANCED VALIDATION: Day ${segment.day}:`, {
    recommendedStops: segment.recommendedStops?.length || 0,
    attractions: segment.attractions?.length || 0,
    startCity: segment.startCity,
    endCity: segment.endCity
  });
  
  // Primary source: recommendedStops array
  if (segment.recommendedStops && Array.isArray(segment.recommendedStops)) {
    const validRecommendedStops = segment.recommendedStops
      .filter((stop, index) => {
        const isValid = isValidStopObject(stop);
        
        console.log(`🎯 Stop ${index + 1} validation:`, {
          stop: stop,
          isValid,
          name: isValid ? stop.name : 'invalid',
          category: isValid ? stop.category : 'unknown'
        });
        
        return isValid;
      })
      .map((stop, index): ValidatedStop => ({
        id: stop.id || `recommended-${index}-${Math.random()}`,
        name: stop.name,
        description: stop.description || `Discover ${stop.name} along your Route 66 journey`,
        category: stop.category || 'attraction',
        city_name: stop.city_name || stop.state || 'Unknown',
        state: stop.state || 'Unknown',
        latitude: stop.latitude || 0,
        longitude: stop.longitude || 0,
        image_url: stop.image_url
      }));
    
    console.log(`✅ Valid recommended stops: ${validRecommendedStops.length}`, validRecommendedStops.map(s => `${s.name} (${s.category})`));
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
            description: `Discover ${attraction} along your Route 66 journey`,
            category: 'attraction',
            city_name: segment.endCity || 'Unknown',
            state: 'Unknown',
            latitude: 0,
            longitude: 0
          };
        } else {
          // TypeScript now knows this is an object with name property due to our filter
          const attractionObj = attraction as { name: string; id?: string; description?: string; category?: string; city_name?: string; state?: string; latitude?: number; longitude?: number; image_url?: string };
          return {
            id: `attraction-${index}-${Math.random()}`,
            name: attractionObj.name,
            description: attractionObj.description || `Discover ${attractionObj.name} along your Route 66 journey`,
            category: attractionObj.category || 'attraction',
            city_name: attractionObj.city_name || segment.endCity || 'Unknown',
            state: attractionObj.state || 'Unknown',
            latitude: attractionObj.latitude || 0,
            longitude: attractionObj.longitude || 0,
            image_url: attractionObj.image_url
          };
        }
      });
    
    console.log(`✅ Valid attraction stops: ${attractionStops.length}`, attractionStops.map(s => s.name));
    stops.push(...attractionStops);
  }
  
  // FALLBACK: If still no stops, create synthetic ones based on known Route 66 attractions
  if (stops.length === 0) {
    console.log(`🚨 NO STOPS FOUND - Creating fallback stops for ${segment.startCity} → ${segment.endCity}`);
    
    const fallbackStops = createFallbackStops(segment);
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

// Create fallback stops for segments with no data
const createFallbackStops = (segment: DailySegment): ValidatedStop[] => {
  const route66Attractions: Record<string, ValidatedStop[]> = {
    'joplin': [
      {
        id: 'fallback-joplin-1',
        name: 'Spook Light',
        description: 'A mysterious light phenomenon that has puzzled visitors for decades along Route 66',
        category: 'attraction',
        city_name: 'Joplin',
        state: 'MO',
        latitude: 37.0262,
        longitude: -94.8591
      },
      {
        id: 'fallback-joplin-2',
        name: 'Schifferdecker Park',
        description: 'A beautiful park perfect for a Route 66 road trip break',
        category: 'attraction',
        city_name: 'Joplin',
        state: 'MO',
        latitude: 37.0842,
        longitude: -94.5133
      }
    ],
    'oklahoma': [
      {
        id: 'fallback-ok-1',
        name: 'Blue Whale of Catoosa',
        description: 'Iconic Route 66 roadside attraction - a giant blue whale sculpture',
        category: 'attraction',
        city_name: 'Catoosa',
        state: 'OK',
        latitude: 36.1851,
        longitude: -95.7317
      },
      {
        id: 'fallback-ok-2',
        name: 'Totem Pole Park',
        description: 'Fascinating collection of hand-carved totem poles along Route 66',
        category: 'attraction',
        city_name: 'Foyil',
        state: 'OK',
        latitude: 36.4395,
        longitude: -95.5122
      },
      {
        id: 'fallback-ok-3',
        name: 'Golden Driller',
        description: 'Towering statue celebrating Oklahoma\'s oil heritage',
        category: 'attraction',
        city_name: 'Tulsa',
        state: 'OK',
        latitude: 36.1540,
        longitude: -95.9928
      }
    ]
  };
  
  const startKey = segment.startCity.toLowerCase();
  const endKey = segment.endCity.toLowerCase();
  
  const relevantStops: ValidatedStop[] = [];
  
  // Check for regional matches
  if (startKey.includes('joplin') || endKey.includes('oklahoma')) {
    relevantStops.push(...(route66Attractions.joplin || []));
    relevantStops.push(...(route66Attractions.oklahoma || []));
  }
  
  return relevantStops.slice(0, 3); // Limit to 3 fallback stops
};
